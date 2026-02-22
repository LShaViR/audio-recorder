# Audio Recorder — Frontend

## 🚀 Getting Started

### Installation

Clone the repository and navigate to the frontend directory:

```
git clone https://github.com/LShaViR/audio-recorder
cd audio-recorder/frontend
```

Install all dependencies using Bun:

```
bun install
```

### Running Locally

```bash
VITE_BACKEND_URL="http://localhost:8080" bun run dev  
```

The app will be available at `http://localhost:5173` (Vite) .


> Replace the URL with your actual backend address.

---

## 📁 Project Structure

```

frontend/
├── index.html             # HTML entry point with root mount
├── src/
│   ├── main.tsx           # React root initialization
│   ├── App.tsx            # Top-level component
│   ├── index.css          # Global styles and Tailwind imports
│   ├── components/        # React components
│   │   ├── Recorder.tsx   # Main recording interface
│   │   ├── RecordingTimer.tsx  # Timer display
│   │   ├── OnlineFlag.tsx # Network status indicator
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   │   ├── useRecorder.ts
│   │   ├── useUploadSync.ts
│   │   └── useOnlineStatus.ts
│   ├── lib/               # Shared utilities
│   │   ├── db.ts          # Dexie database configuration
│   │   └── utils.ts       # Utility functions
│   └── workers/           # Web Workers
│       └── uploadWorker.ts
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite bundler configuration
└── eslint.config.js       # ESLint rules
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React |
| Language | TypeScript |
| Audio API | MediaRecorder API (Web API) |
| HTTP Client | Axios |
| Styling | CSS / Tailwind CSS |
| Build Tool | Vite |

---

## 🎯 How It Works

1. The user clicks **Record** — the browser requests microphone permission via `getUserMedia`.
2. Audio is captured using the **MediaRecorder API** and stored as binary chunks.
3. On stopping, chunks are assembled into a `Blob` (`.webm` or `.wav` format).
4. The recording is available for **immediate playback** via an `<audio>` element.
5. Optionally, the audio `Blob` is sent to the backend API as `multipart/form-data`.

---

## 🌐 Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome  | ✅ |
| Firefox | ✅ |
| Edge    | ✅ |
| Safari  | ⚠️ Partial (limited MediaRecorder support) |

> **Note:** Microphone access requires HTTPS in production environments.


## 👤 Author

**LShaViR**  
GitHub: [@LShaViR](https://github.com/LShaViR)
