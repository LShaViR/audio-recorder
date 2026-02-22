import { BACKEND_URL } from "@/config";
import { dbDelete, dbGetPending, type AudioChunk } from "@/lib/db";
import axios from "axios";
import { UploadError } from "@/lib/error/UploadError";

type UploadResult =
  | { success: true; data: { recordingId: string; chunkNo: number } }
  | { success: false; type: "PERMANENT" | "TEMPORARY" };

export type SyncStatus =
  | {
      type: "ERROR";
      message: "PERMANENT" | "TEMPORARY";
      recordingId: string;
      chunkNo: number;
    }
  | {
      type: "SUCCESS";
      message: string;
    };

self.onmessage = async (
  e: MessageEvent<{ type: string; priorityId?: string | null }>,
) => {
  if (e.data.type === "START_SYNC") {
    await runUploadQueue(e.data.priorityId);
  }
};

export async function uploadChunk(chunk: AudioChunk): Promise<UploadResult> {
  const formData = new FormData();

  formData.append("recordingId", chunk.recordingId);
  formData.append("chunkNo", chunk.chunkNo.toString());
  formData.append("timestamp", chunk.timestamp.toString());
  formData.append(
    "audioBlob",
    chunk.audioBlob,
    `chunk_${chunk.recordingId}_${chunk.chunkNo}.webm`,
  );

  try {
    const response = await axios.post(`${BACKEND_URL}/post`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 15000,
    });
    return response.data;
  } catch (err: any) {
    if (err.response) {
      const status = err.response.status;
      if (status >= 400 && status < 500) {
        throw new Error("PERMANENT");
      }
    }
    throw new Error("TEMPORARY");
  }
}

export async function processChunkWithRetry(
  chunk: AudioChunk,
  maxRetries: number = 3,
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await uploadChunk(chunk);
      await dbDelete(chunk.recordingId, chunk.chunkNo);
      handleSyncSuccess(response);
      return;
    } catch (err: unknown) {
      if (err instanceof UploadError && err.message === "PERMANENT") {
        throw err;
      }
      // Exponential Backoff
      const delay = 1000 * Math.pow(2, attempt - 1);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new UploadError("PERMANENT", chunk.recordingId, chunk.chunkNo);
}

async function runUploadQueue(priorityId?: string | null) {
  await navigator.locks.request("upload_queue_lock", async () => {
    console.log("run upload queue");
    if (!navigator.onLine) return;

    let pending = await dbGetPending();
    if (pending.length === 0) return;

    pending = pending.sort((a, b) => {
      const isBPriority = b.recordingId === priorityId;
      const isAPriority = a.recordingId === priorityId;
      if (isAPriority != isBPriority) {
        return isAPriority ? -1 : 1;
      } else {
        if (a.recordingId === b.recordingId) {
          return a.chunkNo - b.chunkNo;
        } else {
          return a.recordingId.localeCompare(b.recordingId);
        }
      }
    });

    try {
      for (const chunk of pending) {
        await processChunkWithRetry(chunk);
      }
    } catch (err: unknown) {
      if (err instanceof UploadError) {
        handleSyncError(err);
      }
    }
  });
}

function notifyUI(status: SyncStatus) {
  postMessage(status);
}

function handleSyncError(error: UploadError) {
  if (error.message == "PERMANENET") {
    notifyUI({
      type: "ERROR",
      message: "PERMANENT",
      recordingId: error.recordingId,
      chunkNo: error.chunkNo,
    });
  } else {
    notifyUI({
      type: "ERROR",
      message: "TEMPORARY",
      recordingId: error.recordingId,
      chunkNo: error.chunkNo,
    });
  }
}

function handleSyncSuccess(response: UploadResult) {
  if (response.success) {
    notifyUI({
      type: "SUCCESS",
      message: `chunk of recording id: ${response.data.recordingId} and chunk no: ${response.data.chunkNo} successfully uploaded`,
    });
  }
}
