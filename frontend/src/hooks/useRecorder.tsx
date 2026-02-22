import { useEffect, useRef } from "react";
import { useUploadSync } from "./useUploadSync";
import { useRecording } from "@/store/recording";
import { dbPut } from "@/lib/db";
import useOnlineStatus from "./useOnlineStatus";

const useRecorder = () => {
  const { startUpload } = useUploadSync();
  const { recording, setRecording } = useRecording((state) => state);
  const online = useOnlineStatus();

  const mr = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const idx = useRef<number>(0);
  const recordingId = useRef<string | null>(null);

  useEffect(() => {
    const initialRunTimeout = setTimeout(() => startUpload(), 1000);
    return () => {
      clearTimeout(initialRunTimeout);
    };
  }, [online]);

  const start = async () => {
    try {
      const strm = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = strm;
      const rec = new MediaRecorder(strm);
      mr.current = rec;

      const newRecordingId = crypto.randomUUID();
      recordingId.current = newRecordingId;
      idx.current = 0;

      rec.ondataavailable = (e: BlobEvent) => {
        if (e.data?.size > 0) {
          dbPut({
            recordingId: newRecordingId,
            chunkNo: idx.current++,
            audioBlob: e.data,
            timestamp: Date.now(),
            status: "pending",
          });
          startUpload(recordingId.current);
        }
      };

      rec.start(2000);
      setRecording(true);
    } catch (e: any) {
      console.error(e);
    }
  };

  const stop = () => {
    mr.current?.stop();
    stream.current?.getTracks().forEach((t) => t.stop());
    recordingId.current = null;
    setRecording(false);
  };

  return {
    start,
    stop,
    recording,
    startUpload,
  };
};

export default useRecorder;
