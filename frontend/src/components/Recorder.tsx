import { Button } from "@/components/ui/button";
import useRecorder from "@/hooks/useRecorder";
import RecordingTimer from "./RecordingTimer";
import OnlineFlag from "./OnlineFlag";

export default function Recorder() {
  const { recording, start, stop, startUpload, stopUpload } = useRecorder();

  console.log({ recording, start, stop, startUpload });
  return (
    <div className="h-screen w-screen bg-background flex flex-col justify-center items-center text-white gap-8">
      <div className="flex gap-8 text-md">
        <OnlineFlag />
        {recording && <RecordingTimer />}
      </div>

      <div className="flex gap-6">
        <Button
          className="cursor-pointer disabled:cursor-not-allowed"
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
      <div className="flex gap-6">
        <Button
          className="cursor-pointer"
          onClick={() => startUpload()}
          variant="outline"
        >
          Start sync
        </Button>
        <Button
          className="cursor-pointer"
          onClick={() => stopUpload()}
          variant="outline"
        >
          Stop sync
        </Button>
      </div>
    </div>
  );
}
