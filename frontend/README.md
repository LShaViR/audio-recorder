# 🎙️ Audio Recorder — Frontend

A clean, browser-based audio recording application built with React. Record audio directly from your microphone, play it back, and manage your recordings — all from a modern, responsive UI.

---

## ✨ Features

- 🎤 **One-click recording** — Start and stop audio capture using your browser's microphone
- ▶️ **Instant playback** — Listen to recordings right after capturing them
- 📁 **Recording management** — View, replay, and delete saved recordings
- 📡 **Backend integration** — Uploads recordings to a REST API for storage or processing
- 📱 **Responsive design** — Works seamlessly on desktop and mobile browsers

---

## 🛠️ Tech Stack

| Layer       | Technology                  |
| ----------- | --------------------------- |
| Framework   | React                       |
| Language    | TypeScript                  |
| Audio API   | MediaRecorder API (Web API) |
| HTTP Client | Fetch / Axios               |
| Styling     | CSS / Tailwind CSS          |
| Build Tool  | Vite                        |

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

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm or yarn
- A running instance of the [backend server](../backend/) _(if applicable)_

### Installation

```bash
# Clone the repository
git clone https://github.com/LShaViR/audio-recorder.git

# Navigate to the frontend directory
cd audio-recorder/frontend

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (Vite).

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` (Vite) or `build/` (CRA) folder.

---

## ⚙️ Configuration

If the frontend needs to communicate with a backend, create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> Replace the URL with your actual backend address.

---

## 🎯 How It Works

1. The user clicks **Record** — the browser requests microphone permission via `getUserMedia`.
2. Audio is captured using the **MediaRecorder API** and stored as binary chunks.
3. On stopping, chunks are assembled into a `Blob` (`.webm` or `.wav` format).
4. The recording is available for **immediate playback** via an `<audio>` element.
5. Optionally, the audio `Blob` is sent to the backend API as `multipart/form-data`.

---

## 🌐 Browser Support

| Browser | Supported                                  |
| ------- | ------------------------------------------ |
| Chrome  | ✅                                         |
| Firefox | ✅                                         |
| Edge    | ✅                                         |
| Safari  | ⚠️ Partial (limited MediaRecorder support) |

> **Note:** Microphone access requires HTTPS in production environments.

---

## 📄 License

This project is open source and available under the [MIT License](../LICENSE).

---

## 👤 Author

**LShaViR**  
GitHub: [@LShaViR](https://github.com/LShaViR)
