export class UploadError extends Error {
  recordingId;
  chunkNo;
  constructor(message: string, recordingId: string, chunkNo: number) {
    super(message);
    this.recordingId = recordingId;
    this.chunkNo = chunkNo;
  }
}
