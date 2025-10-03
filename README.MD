<h1 align="center">Device Keygen</h1>
<p align="center">The world's easiest, smallest and powerful visitor identifier for browsers.</p>

<br/>

<p align="center">
Device keygen generates a deterministic string per browser by combining <b>Audio</b>, <b>Canvas</b>, <b>baseline browser signals</b> and optional <b>WebGL vendor/renderer</b>, then hashes the result with a tiny, fast 53‑bit hash.
</p>

> ⚠ For educational and demonstration purposes only.

## ✨ Features

- Minimal bundle size, zero runtime deps
- Multi-format builds: ESM, CJS, Global (IIFE)
- Works in modern browsers; graceful fallbacks when signals are blocked
- Includes TypeScript types

## 📦 Installation

### npm

```sh
npm i device-unique-keygen
```

### Yarn

```sh
yarn add device-unique-keygen
```

## 📚 API

### `getCurrentBrowserFingerPrint(): Promise<string>`

Returns a deterministic string for the current browser instance.

Under the hood, device keygen combines:

- Audio fingerprint (OfflineAudioContext render)
- Canvas fingerprint (styled text + `canvas.toDataURL()`)
- Baseline browser signals (UA, platform, vendor, hardware concurrency, device memory, screen width/height/color depth, devicePixelRatio, languages, timezone)
- WebGL vendor/renderer (when `WEBGL_debug_renderer_info` is available)

All parts are concatenated and hashed via a compact 53‑bit hash (`cyrb53`). If the audio path fails, the library falls back to canvas + baseline signals (+ WebGL when available). If canvas is unsupported, a stable string plus baseline signals are used to avoid global collisions.

## 🔍 How it works

1. Generate audio entropy using an oscillator + compressor rendered in an `OfflineAudioContext`, summing a slice of the buffer.
2. Generate canvas entropy by drawing styled text and reading `canvas.toDataURL()`.
3. Collect baseline signals and optional WebGL vendor/renderer.
4. Concatenate and hash to produce a compact, deterministic identifier.

Note: anti‑fingerprinting features (e.g., Brave, Firefox ETP, Safari ITP, extensions) can normalize/obfuscate signals. Broprint.js includes additional entropy to reduce collisions, but uniqueness cannot be guaranteed in all hardened environments.

## 🌐 Browser support

- Modern Chromium, Firefox, and Safari
- Graceful degradation when audio/canvas/WebGL are unavailable
- Some privacy modes/extensions may change stability or uniqueness

## 🧰 Troubleshooting

- Audio context errors: many browsers restrict audio contexts until user interaction; call after a click.
- Identical outputs: your environment may normalize canvas/audio/WebGL; baseline signals still help differentiate.
- Types: shipped via `lib/index.d.ts`.

## 🛠️ Build & contribute

Library build (root):

```sh
npm run build
```

Example app lives under `example/` (Create React App).

PRs and issues welcome.

## 📄 License

MIT
