# timeshift-radio-player

A modern, responsive Progressive Web App (PWA) that brings DVR-style **Timeshift** capabilities to live internet radio streams. Built with vanilla JavaScript, the Web Audio API, and IndexedDB, it records live audio chunks locally in real-time, allowing you to pause, rewind, fast-forward, fast-rewind and resume live broadcasts seamlessly.

---

## Overview

Unlike standard web radio players that only stream live audio via HTML5 `<audio>` tags, **timeshift-radio-player** continuously fetches raw stream data, synchronizes MPEG frames, segments audio into chunks, and persists them into browser storage (`IndexedDB`).

Whether you need to step away from your desk, missed a song title or news segment, or want to skip ahead through buffered content, this player gives you full control over live audio.

---

## Key Features

- **True Timeshift Playback**: Pause live radio, rewind and forward in steps (1 chunk or 10 chunks).
- **Client-Side Chunk Persistence**: Audio chunks are buffered and stored locally using **IndexedDB**, surviving network drops and stream reconnects.
- **Low-Level MPEG Frame Parsing**: Custom stream parser checks MPEG sync words, frame headers, bitrates, and sample rates to guarantee clean, uncorrupted chunk boundaries.
- **Smart Reconnection & Overlap Detection**: Uses trailing frame signatures to detect and eliminate duplicate audio segments when reconnecting.
- **Web Audio API & Worker Decoupling**: Background Web Worker isolates buffer copies while the `AudioContext` handles gapless audio scheduling.
- **Live & Timeshift Modes**: Toggle instantly between direct low-latency live streaming and timeshift buffer playback.
- **Interactive UI**:
  - Split buffer timeline displaying both past (rewindable) and future (buffered) capacity.
  - Perceptual non-linear volume slider curve for natural volume control.
  - Sleep timer with automatic stream cut-off.
  - Network Freeze / Record toggle switch with smooth touch & drag interactions.
- **System Integration**:
  - **Media Session API**: Lock screen controls and track status across mobile and desktop.
  - **Screen Wake Lock**: Prevents device sleep during active sessions.
  - **PWA Ready**: Includes manifest configuration and Service Worker registration.

---

## Architecture & Code Structure

The project is structured in clean, modular object-oriented JavaScript classes:


---

## Getting Started

### Prerequisites

You only need a modern web browser that supports:
- Web Audio API
- IndexedDB
- ES6 JavaScript
- MediaStream / Fetch Streaming

### Installation & Local Run

- cop`radio.html` or `bob.html


## Configuration

You can customize the available radio streams directly in the `App` class constructor inside the script:

```javascript
this.stations = [
    { 
        name: "Station Name", 
        url: "https://your-stream-url.mp3", 
        bitrate: 128000 
    },
    // Add your favorite stations here
];
```

> **Note on Audio Streams**: Internet radio streams must allow Cross-Origin Resource Sharing (CORS) headers (`Access-Control-Allow-Origin: *`) for the browser's `fetch()` API to read and chunk raw audio data.

---

## Controls & Usage

| Control | Action |
| :--- | :--- |
| **LIVE Button** | Starts direct live stream playback. |
| **Play / Pause Button** | Starts or pauses Timeshift audio playback. |
| **«« / »» (Split Buttons)** | Jumps back / forward by 1 chunk (~60 seconds). |
| **««« / »»» (Outer Buttons)** | Jumps back / forward by 10 chunks (~10 minutes). |
| **Toggle Slider** | Toggles network recording (Freeze / Record mode). |
| **Top Slider** | Adjusts playback volume with perceptual curve correction. |
| **Bottom Slider** | Sets sleep timer (1 to 60 minutes). |

---


## License

