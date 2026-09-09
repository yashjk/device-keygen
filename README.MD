<h1 align="center">Device Keygen</h1>
<p align="center">A small, zero-dependency browser identifier built from local browser signals.</p>

Device Keygen combines audio, canvas, baseline browser information, and optional WebGL renderer data into a compact deterministic hash. Collection happens locally in the browser; the package does not transmit or store data.

## Features

- Zero runtime dependencies
- ESM, CommonJS, and browser-global builds
- TypeScript types
- Configurable signal collection and audio timeout
- Graceful fallback when optional signals are unavailable
- Privacy-safe diagnostics that report status without exposing raw signal values

## Installation

```sh
npm i device-unique-keygen
```

## Usage

```ts
import { generateDeviceId } from "device-unique-keygen";

const deviceId = await generateDeviceId();
```

The correctly-cased `getCurrentBrowserFingerprint()` alias is also available. The original `getCurrentBrowserFingerPrint()` export remains available for compatibility and is deprecated.

## Configuration

```ts
const deviceId = await generateDeviceId({
  algorithm: "v1",
  audioTimeoutMs: 1500,
  signals: {
    audio: true,
    canvas: true,
    baseline: true,
    webgl: false,
  },
});
```

Disabling or changing signals changes the resulting identifier. Store the configuration and algorithm version alongside identifiers when long-term consistency matters.

## Diagnostics

```ts
import { getFingerprintDiagnostics } from "device-unique-keygen";

const result = await getFingerprintDiagnostics();
// {
//   id: "7857229465367760",
//   algorithm: "v1",
//   signals: {
//     audio: "collected",
//     canvas: "collected",
//     baseline: "collected",
//     webgl: "unavailable"
//   }
// }
```

Diagnostics expose only collection status, not raw browser signal values.

## Stability contract

The default `v1` algorithm preserves the signal ordering used by the 0.2.x release. Future algorithms will use a new explicit version rather than silently changing existing identifiers.

A browser identifier is not a hardware serial number. It may change after browser, operating-system, display, language, privacy-setting, or hardware changes. Hardened browsers may normalize signals, and different devices can collide. Do not use this value as a password, authentication factor, or sole fraud-control decision.

## Responsible use

Browser fingerprinting may be regulated or require disclosure or consent depending on your jurisdiction and use case. Explain the purpose to users, collect only the signals you need, define a retention period, and provide an appropriate opt-out where required. This package performs local computation only; applications decide whether and where to send or store the resulting identifier.

## Browser support

Modern Chromium, Firefox, and Safari are tested. Call the API in a browser context, preferably after a user interaction so browsers can permit audio rendering. When audio, canvas, or WebGL is blocked, the package falls back to the remaining enabled signals.

## Browser-global build

```html
<script src="https://unpkg.com/device-unique-keygen/lib/index.global.js"></script>
<script>
  DeviceKeygen.generateDeviceId().then(console.log);
</script>
```

## Development

```sh
npm ci
npm test
npm run build
```

The Vite example app lives in `example/`.

## License

MIT
