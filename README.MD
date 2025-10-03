<h1 align="center">Device Keygen</h1>
<p align="center">The world's easiest, smallest and powerful visitor identifier for browsers.</p>

<p align="center">
 <a href="https://github.com/Rajesh-Royal/Broprint.js"><img src="https://img.shields.io/badge/total%20size-~2%20KB-brightgreen" height="20"/></a>
 <a href="https://www.npmjs.com/package/@rajesh896/broprint.js">
    <img src="https://img.shields.io/npm/v/@rajesh896/broprint.js" alt="Current NPM version">
  </a>
  <a href="https://broprintjs.netlify.app/" target="_blank"><img src="https://img.shields.io/badge/demo-live-blue" alt="Live Demo"/></a>
  <a href="https://codesandbox.io/s/browser-fingerprinting-generate-unique-device-id-or-browser-id-507n2v" target="_blank"><img src="https://img.shields.io/badge/CodeSandbox-try%20it-green" alt="CodeSandbox"/></a>
  <a href="https://twitter.com/intent/tweet?text=The world's easiest, smallest and powerful visitor identifier for browsers.&url=https://github.com/Rajesh-Royal/Broprint.js&hashtags=javascript,opensource,js,webdev,developers"><img src="http://randojs.com/images/tweetShield.svg" alt="Tweet" height="20"/></a>
</p>

<br/>

<p align="center">
Broprint.js generates a deterministic string per browser by combining <b>Audio</b>, <b>Canvas</b>, <b>baseline browser signals</b> and optional <b>WebGL vendor/renderer</b>, then hashes the result with a tiny, fast 53‑bit hash.
</p>

<p align="center"><a href="https://broprintjs.netlify.app/" target="_blank">Live Demo</a></p>

> ⚠ For educational and demonstration purposes only.


## ✨ Features

- Minimal bundle size, zero runtime deps
- Multi-format builds: ESM, CJS, Global (IIFE)
- Works in modern browsers; graceful fallbacks when signals are blocked
- Includes TypeScript types


## 📦 Installation

### npm
```sh
npm i @rajesh896/broprint.js
```

### Yarn
```sh
yarn add @rajesh896/broprint.js
```

### CDN (v2.2.0+)
ESM (modern browsers):
```html
<script type="module">
  import { getCurrentBrowserFingerPrint } from 'https://cdn.jsdelivr.net/npm/@rajesh896/broprint.js@latest/lib/index.mjs';
  getCurrentBrowserFingerPrint().then(fp => console.log('Fingerprint:', fp));
</script>
```

Classic global (no module support needed):
```html
<script src="https://cdn.jsdelivr.net/npm/@rajesh896/broprint.js@latest/lib/index.global.js"></script>
<script>
  getCurrentBrowserFingerPrint().then(fp => console.log('Fingerprint (global):', fp));
</script>
```


## 🚀 Quick Start

### ESM (Vite, Next.js, CRA with modules)
```js
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js';

const fp = await getCurrentBrowserFingerPrint();
console.log(fp);
```

### CommonJS (Node-style bundlers)
```js
const { getCurrentBrowserFingerPrint } = require('@rajesh896/broprint.js');

getCurrentBrowserFingerPrint().then(console.log);
```

### React example
```js
import { useEffect, useState } from 'react';
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js';

export default function Component(){
  const [fp, setFp] = useState('');
  useEffect(() => {
    getCurrentBrowserFingerPrint()
      .then(v => setFp(String(v)))
      .catch(() => setFp('ERROR'));
  }, []);
  return <pre>{fp}</pre>;
}
```

### Plain HTML (local install)
```html
<!doctype html>
<html>
  <head><meta charset="utf-8"/><title>Broprint</title></head>
  <body>
    <script type="module">
      import { getCurrentBrowserFingerPrint } from './node_modules/@rajesh896/broprint.js/lib/index.mjs';
      getCurrentBrowserFingerPrint().then(console.log);
    </script>
  </body>
</html>
```


## 📚 API

### `getCurrentBrowserFingerPrint(): Promise<string>`
Returns a deterministic string for the current browser instance.

Under the hood, Broprint.js combines:
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
