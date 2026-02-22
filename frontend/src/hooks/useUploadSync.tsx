import type { SyncStatus } from "@/worker/uploadWorker";
import { useEffect, useCallback, useRef } from "react";
import useOnlineStatus from "./useOnlineStatus";

export function useUploadSync() {
  const workerRef = useRef<Worker | null>(null);
  const online = useOnlineStatus();

  useEffect(() => {
    const worker = new Worker(
      new URL("../worker/uploadWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );

    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<SyncStatus>) => {
      const { type } = e.data;
      if (type === "ERROR") {
        const message = e.data.message;
        const recordingId = e.data.recordingId;
        const chunkNo = e.data.chunkNo;
        console.log(`${message}: ${recordingId} - ${chunkNo}`);
      } else if (type === "SUCCESS") {
        const message = e.data.message;
        console.log(message);
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const startUpload = useCallback(
    (recordingId?: string | null) => {
      if (!workerRef.current) return;
      if (online) {
        workerRef.current.postMessage({
          type: "START_SYNC",
          priorityId: recordingId,
        });
      }
    },
    [online],
  );

  return { startUpload };
}
