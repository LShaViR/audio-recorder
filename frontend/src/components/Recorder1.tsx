import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { dbDelete, dbGetPending, dbPut } from "@/lib/db";
import useOnlineStatus from "@/hooks/useOnlineStatus";

// Types ──────────────────────────────────────────────────────────────────
interface AudioChunk {
  recordingId: string;
  chunkId: number;
  audioBlob: Blob;
  timestamp: number;
  status?: "pending" | "uploading";
  attempt: number;
}

// ── Dummy upload ───────────────────────────────────────────────────────────
async function uploadChunk(chunk: AudioChunk): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 500));
  if (Math.random() < 0.05) throw new Error("simulated failure");
  console.log("upload", chunk);
  return { success: true };
}

// ── Upload Queue ───────────────────────────────────────────────────────────
class UploadQueue {
  private onChange: () => void;
  public busy: boolean;

  constructor(onChange: () => void) {
    this.onChange = onChange;
    this.busy = false;
  }

  async add(chunk: Omit<AudioChunk, "status">): Promise<void> {
    await dbPut({ ...chunk, status: "pending" });
    this.onChange();
    this.run();
  }

  async run(): Promise<void> {
    if (this.busy || !navigator.onLine) return;
    const pending = await dbGetPending();
    if (!pending.length) return;

    pending.sort((a, b) => a.timestamp - b.timestamp);
    const chunk = pending[0];

    this.busy = true;
    this.onChange();

    try {
      await dbPut({ ...chunk, status: "uploading" });
      await uploadChunk(chunk);
      await dbDelete(chunk.recordingId, chunk.chunkId);
    } catch (err) {
      await dbPut({ ...chunk, status: "pending" });
    } finally {
      this.busy = false;
      this.onChange();
      setTimeout(() => this.run(), 300);
    }
  }
}

// ── App ────────────────────────────────────────────────────────────────────
export default function Recorder1() {
  const [recording, setRecording] = useState<boolean>(false);
  const [_pending, setPending] = useState<number>(0);
  const [_uploading, setUploading] = useState<boolean>(false);
  const [secs, setSecs] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const mr = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const queue = useRef<UploadQueue | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const idx = useRef<number>(0);

  const { online } = useOnlineStatus();

  const refresh = useCallback(async () => {
    const p = await dbGetPending();
    setPending(p.length);
    setUploading(queue.current?.busy ?? false);
  }, []);

  useEffect(() => {
    queue.current = new UploadQueue(refresh);
    refresh();
    const initialRunTimeout = setTimeout(() => queue.current?.run(), 1000);

    return () => {
      clearTimeout(initialRunTimeout);
    };
  }, [refresh]);

  const start = async () => {
    setError("");
    try {
      const strm = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = strm;
      const rec = new MediaRecorder(strm);
      mr.current = rec;

      rec.ondataavailable = (e: BlobEvent) => {
        if (e.data?.size > 0 && queue.current) {
          queue.current.add({
            chunkId: `chunk_${Date.now()}_${idx.current++}`,
            audioBlob: e.data,
            timestamp: Date.now(),
            attempt: 0,
          });
        }
      };

      rec.start(3000);
      setRecording(true);
      setSecs(0);
      timer.current = setInterval(() => setSecs((sec) => sec + 1), 1000);
    } catch (e: any) {
      setError(e.message || "Failed to start recording");
    }
  };

  const stop = () => {
    mr.current?.stop();
    stream.current?.getTracks().forEach((t) => t.stop());
    if (timer.current) clearInterval(timer.current);
    setRecording(false);
  };

  const fmt = (s: number): string =>
    `${Math.floor(s / 3600) ? `${String(Math.floor(s / 3600)).padStart(2, "0")}:` : ""}${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="h-screen w-screen bg-background flex flex-col justify-center items-center text-white gap-8">
      <div className="flex gap-8 text-md">
        <span style={{ color: online ? "#4caf50" : "#f44336" }}>
          ● {online ? "online" : "offline"}
        </span>
        {recording && (
          <span className="text-emerald-400">● rec {fmt(secs)}</span>
        )}
      </div>

      <div className="flex gap-6">
        <Button
          className="cursor-pointer"
          onClick={start}
          disabled={recording}
          variant="default"
        >
          start
        </Button>
        <Button
          className="cursor-pointer"
          onClick={stop}
          disabled={!recording}
          variant="destructive"
        >
          stop
        </Button>
      </div>

      {error && (
        <div className="text-red-600 text-md w-max-120 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
