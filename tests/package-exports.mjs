import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

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
