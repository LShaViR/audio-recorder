import { create } from "zustand";

interface Recording {
  recording: boolean;
  setRecording: (recording: boolean) => void;
}

export const useRecording = create<Recording>((set) => ({
  recording: false,
  setRecording: (recording) => set({ recording: recording }),
}));
