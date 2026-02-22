const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const multer = require("multer");

const data = [];

let print = 1;
const upload = multer();
// Middleware to parse various body formats
app.use(cors());
app.use(express.json()); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For URL-encoded bodies
app.use(express.text()); // For plain text bodies

setInterval(() => {
  const chunks = data.sort((a, b) => {
    if (a.recordingId === b.recordingId) {
      return a.chunkNo - b.chunkNo;
    } else {
      return a.recordingId.localeCompare(b.recordingId);
    }
  });
  const log = chunks
    .map((item) => `${item.recordingId} : ${item.chunkNo}`)
    .join("\n");
  console.log(
    "----------------------------------",
    print++,
    "------------------------------------------\n\n",
    log,
    "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
  );
}, 3_000);

// The "Catch-all" route
app.post("/post", upload.single("audioBlob"), async (req, res) => {
  try {
    const body = req.body;
    const random = Math.random();
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
    if (random < 0.00001) {
      return res.send(500).json({ success: false });
    } else if (random < 0.000002) {
      return res.send(400).json({ success: false });
    }
    data.push({ recordingId: body.recordingId, chunkNo: body.chunkNo });
    return res.status(200).json({
      success: true,
      data: { recordingId: body.recordingId, chunkNo: body.chunkNo },
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`HTTP Dumper listening at http://localhost:${port}`);
});
