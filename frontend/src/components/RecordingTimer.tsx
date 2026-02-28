import { useEffect, useState } from "react";

const RecordingTimer = () => {
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    let interval: number;
    setSecs(0);
    interval = setInterval(() => {
      setSecs((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (s: number): string =>
    `${Math.floor(s / 3600) ? `${String(Math.floor(s / 3600)).padStart(2, "0")}:` : ""}${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return <span className="text-emerald-400">● rec {fmt(secs)}</span>;
};

export default RecordingTimer;
