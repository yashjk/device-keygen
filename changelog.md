# Changelog
All notable changes to the `device-unique-keygen` package are documented in this file.

## [0.2.0] - 2026-06-15

### Added

- Audio fingerprint now has a timeout guard: if `OfflineAudioContext` stalls, it
  gracefully falls back to canvas + baseline (+ WebGL) signals instead of hanging.

### Changed

- Core source is now fully typed — removed `@ts-nocheck` from the hash and audio
  fingerprint modules.

### Fixed

- Removed dead Brave-browser branch in `getCurrentBrowserFingerPrint` (both paths
  were identical).
- Removed an invalid `bin` entry from `package.json` (the library has no CLI).

### Notes

- Example/demo app fully redesigned with an Apple-style "Liquid Glass" aesthetic.

## [0.1.1] - 2025-10-03

- Maintenance release.

## [0.1.0] - 2025-10-03

- Added baseline browser signals (UA, platform, vendor, hardware concurrency,
  device memory, screen metrics, languages, timezone) and optional WebGL
  vendor/renderer entropy to improve uniqueness.
- Graceful fallbacks when audio or canvas signals are unavailable.

## [0.0.1] - 2025-10-03

- Initial release of the rebranded `device-unique-keygen` package.
