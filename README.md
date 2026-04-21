# OllieTube 🎬

A YouTube-style local video player built with React, Vite, TypeScript, and Tailwind CSS. Drop your own video files in and get a fully featured media browser with search, watch history, likes, view counts, and editable metadata.

## Features

- 📁 Auto-detects video files from a local directory
- 🔍 Search by title or channel
- 🎬 Custom video player with keyboard shortcuts
- 👍 Like button and view count (persisted locally)
- 🕑 Watch history in the sidebar
- ✎ Editable video titles and descriptions
- 📺 Related videos sidebar on the watch page

## Prerequisites

- [Node.js](https://nodejs.org) v20 or higher
- npm v9 or higher

## Getting Started

**1. Clone the repo:**
```bash
git clone https://github.com/stevo2882/ollietube.git
cd ollietube
```

**2. Install dependencies:**
```bash
npm install
```

**3. Add your videos:**

Drop any `.mp4`, `.mov`, `.webm`, or `.mkv` files into the `public/videos/` directory.

**4. Start the app:**
```bash
npm run dev:all
```

This starts both the Vite dev server and the Express API server concurrently.

| Service | URL |
|---|---|
| App | http://localhost:5173 |
| API | http://localhost:3001 |

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `→` | Skip forward 5s |
| `←` | Skip back 5s |
| `M` | Toggle mute |
| `F` | Toggle fullscreen |

## Project Structure

```
ollietube/
├── public/
│   └── videos/        ← drop your video files here
├── server/
│   └── index.ts       ← Express API that scans the videos directory
└── src/
    ├── components/    ← Navbar, Sidebar, VideoCard, VideoPlayer, etc.
    ├── hooks/         ← useVideos, useWatchHistory, useVideoStats, useVideoMetadata
    ├── pages/         ← Home, Watch
    └── types/         ← Video interface
```

## Tech Stack

- [React](https://react.dev) + [Vite](https://vitejs.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [React Router v6](https://reactrouter.com)
- [Express](https://expressjs.com) (local API server)