# TimeshiftRadioPlayer

TimeshiftRadioPlayer is a modern, single-file website (index.html) and Progressive Web App (PWA) that enables time-shifted listening for live internet radio streams. Built with vanilla JavaScript, the Web Audio API, and IndexedDB, it records live audio chunks locally in real-time, allowing you to pause, rewind, fast-forward, fast-rewind and resume live broadcasts seamlessly.

**Notice**: Please wait a few minutes after starting the initial recording before you start the timeshift playback.


**Demo**: **[https://ahrens.tk/radio](https://ahrens.tk/radio)**



![TimeshiftRadioPlayer](https://raw.githubusercontent.com/ahrenstk/TimeshiftRadioPlayer/main/TimeshiftRadioPlayer.jpg)


---

## Overview

Unlike standard web radio players that only stream live audio via HTML5 `<audio>` tags, **TimeshiftRadioPlayer** continuously fetches raw stream data, synchronizes MPEG frames, segments audio into chunks, and persists them into browser storage (`IndexedDB`).

Whether you need to step away from your desk, missed a song title or news segment, or want to skip ahead through buffered content, this player gives you full control over live audio.

I developed software specifically for train journeys: with about 15 minutes of lead time, it builds up enough buffer to effortlessly bridge even longer dead zones on one- to two-hour routes.

---

## Key Features

- **True Timeshift Playback:** Pause live radio, rewind and forward in steps (1 chunk (monstly one minute) or 10 chunks (mostly 10 minutes)).
- **Client-Side Chunk Persistence:** Audio chunks are buffered and stored locally using **IndexedDB**, surviving network drops and stream reconnects.
- **Low-Level MPEG Frame Parsing:** Custom stream parser checks MPEG sync words, frame headers, bitrates, and sample rates to guarantee clean, uncorrupted chunk boundaries.
- **Smart Reconnection & Overlap Detection:** Uses trailing frame signatures to detect and eliminate duplicate audio segments when reconnecting.
- **Live & Timeshift Modes:** Toggle instantly between direct low-latency live streaming and timeshift buffer playback.
- **Auto-Delete:** On startup, recordings are truncated to two hours.
- **Interactive UI:**
  - Split buffer timeline displaying both past (rewindable) and future (buffered) capacity.
  - Perceptual non-linear volume slider curve for natural volume control.
  - Sleep timer with automatic stream cut-off.
  - Network Freeze / Record toggle switch with smooth touch & drag interactions.
- **System Integration:**
  - **Media Session API:** Lock screen controls and track status across mobile and desktop.
  - **Screen Wake Lock:** Prevents device sleep during active sessions.
  - **PWA Ready:** Includes manifest configuration and Service Worker registration.

---

### Prerequisites

You only need a modern web browser that supports:
- Web Audio API
- IndexedDB
- ES6 JavaScript
- MediaStream / Fetch Streaming

### Installation & Local Run

- copy `index.html` and change the setting
- copy all in a folder for possibility to install as Progressive Web App (PWA)

## Privacy Notice

By running this application, the data (e.g. chunks and station presets) are saved locally on your device. No personal data is transmitted to external servers, except for connecting directly to audio streams. This application is intended for private use only, as there is no active privacy notice or user consent mechanism prior to storing data in the browser. For other use feel free to add a privacy notice for your users.


## Configuration

You can customize the available radio streams directly in the `App` class constructor inside the script:

```javascript
this.livestations = [
            { name: "BOB! & Best of Rock", url: "dynamic" }, 
            { name: "BOB! & Best of Rock AAC", url: "dynamic_aac" },
            { name: "RADIO BOB!", url: "https://streams.radiobob.de/bob-national/mp3-128/streams.radiobob.de" },
            { name: "RADIO BOB! AAC", url: "https://streams.radiobob.de/bob-national/aac-64/streams.radiobob.de" },
];
```

The first two entries (dynamic and dynamic_aac) correspond to the four entries t1, t2, t3, t4 listed below. The software automatically switches between two stations at :03, :27, :33, and :57 past the hour. If this logic is not required, you can delete this tow lines. You can but must not delete the software logic.


```javascript
this.stations = [
            { name: "RADIO BOB!", url: "https://streams.radiobob.de/bob-national/mp3-128/streams.radiobob.de", bitrate: 128000 },
            { name: "RADIO BOB! Best of Rock", url: "https://streams.radiobob.de/bob-bestofrock/mp3-128/streams.radiobob.de", bitrate: 128000 },

];
```
List of recordable streams. Only MP3 can be used. Please also set the correct bitrate.


```javascript
this.dynamicUrls = [
            t1: "https://streams.radiobob.de/bob-national/mp3-128/streams.radiobob.de",
            t2: "https://streams.radiobob.de/bob-bestofrock/mp3-128/streams.radiobob.de",
            t3: "https://streams.radiobob.de/bob-national/aac-64/streams.radiobob.de",
            t4: "https://streams.radiobob.de/bob-bestofrock/aac-64/mediaplayer"

];
```

Dynamic urls for switching at :03, :27, :33, :57 every hour.


**Note on Audio Streams:** Internet radio streams must allow Cross-Origin Resource Sharing (CORS) headers (`Access-Control-Allow-Origin: *`) for the browser's `fetch()` API to read and chunk raw audio data.

---


## License

This project is licensed under the **MIT License**. You can find the licensing details in the `LICENSE` file.

