import Dexie, { type Table } from "dexie";

export interface AudioChunk {
  recordingId: string;
  chunkNo: number;
  audioBlob: Blob;
  timestamp: number;
  status?: "pending" | "failed";
}

export class MyDatabase extends Dexie {
  chunks!: Table<AudioChunk, [string, number]>;

  constructor() {
    super("AudioStreamDB");
    this.version(1).stores({
      chunks: "[recordingId+chunkNo], recordingId, chunkNo, status",
    });
  }
}

export const db = new MyDatabase();

async function dbPut(chunk: AudioChunk): Promise<void> {
  await db.chunks.put(chunk);
}

async function dbDelete(recordingId: string, chunkNo: number): Promise<void> {
  await db.chunks.delete([recordingId, chunkNo]);
}

async function dbGetPending(): Promise<AudioChunk[]> {
  return await db.chunks.where("status").equals("pending").toArray();
}

export { dbPut, dbDelete, dbGetPending };
