import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
assert.deepEqual(packageJson.sideEffects, [
  "./lib/index.js",
  "./lib/index.mjs",
  "./lib/index.global.js",
]);

const require = createRequire(import.meta.url);
const cjs = require("../lib/index.js");
const esm = await import("../lib/index.mjs");

for (const api of [cjs, esm]) {
  assert.equal(typeof api.generateDeviceId, "function");
  assert.equal(typeof api.getCurrentBrowserFingerprint, "function");
  assert.equal(typeof api.getCurrentBrowserFingerPrint, "function");
  assert.equal(typeof api.getFingerprintDiagnostics, "function");
}

const context = { window: {}, console, setTimeout, clearTimeout };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL("../lib/index.global.js", import.meta.url), "utf8"), context);
assert.equal(typeof context.DeviceKeygen.generateDeviceId, "function");
assert.equal(typeof context.window.getCurrentBrowserFingerPrint, "function");
