import { useRecording } from "@/store/recording";
import { useEffect, useState } from "react";

const RecordingTimer = () => {
  const recording = useRecording((state) => state.recording);
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    let interval: number;
    if (recording) {
      setSecs(0);
      interval = setInterval(() => {
        setSecs((s) => s + 1);
      }, 1000);
    } else {
      setSecs(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const fmt = (s: number): string =>
    `${Math.floor(s / 3600) ? `${String(Math.floor(s / 3600)).padStart(2, "0")}:` : ""}${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    recording && <span className="text-emerald-400">● rec {fmt(secs)}</span>
  );
};

export default RecordingTimer;
