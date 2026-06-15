import { cyrb53 } from "./code/EncryptDecrypt";
import { getCanvasFingerprint } from "./code/GenerateCanvasFingerprint";
import { generateTheAudioFingerPrint } from "./code/generateTheAudioPrints";



// Collect a baseline set of low-risk, broadly available signals for better uniqueness
// while keeping the library lightweight and compatible in most environments.
function collectBaselineSignals(): string {
    try {
        const nav = typeof navigator !== "undefined" ? navigator : ({} as any);
        const scr = typeof screen !== "undefined" ? screen : ({} as any);
        const tz = (() => {
            try { return Intl && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""; } catch { return ""; }
        })();
        const lang = (nav as any).language || (nav as any).userLanguage || "";
        const languages = Array.isArray((nav as any).languages) ? (nav as any).languages.join(",") : "";
        const hardwareConcurrency = (nav as any).hardwareConcurrency || "";
        const deviceMemory = (nav as any).deviceMemory || "";
        const platform = (nav as any).platform || "";
        const userAgent = (nav as any).userAgent || "";
        const vendor = (nav as any).vendor || "";
        const colorDepth = (scr as any).colorDepth || "";
        const pixelRatio = typeof window !== "undefined" ? (window.devicePixelRatio || "") : "";
        const width = (scr as any).width || "";
        const height = (scr as any).height || "";

        const payload = [
            userAgent, platform, vendor, String(hardwareConcurrency), String(deviceMemory),
            String(colorDepth), String(pixelRatio), String(width), String(height), tz, lang, languages
        ].join("|");
        return payload;
    } catch (_) {
        return "";
    }
}

// Try to extract WebGL vendor/renderer details as additional entropy (when available)
function collectWebGLEntropy(): string {
    try {
        if (typeof document === "undefined") return "";
        const canvas = document.createElement("canvas");
        // Prefer webgl2, then fallback
        const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
        if (!gl) return "";
        const debugInfo = (gl as any).getExtension && (gl as any).getExtension("WEBGL_debug_renderer_info");
        if (!debugInfo) return "";
        const vendor = (gl as any).getParameter && (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = (gl as any).getParameter && (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return [vendor || "", renderer || ""].join("|");
    } catch (_) {
        return "";
    }
}

/**
 * This functions working
 * @Param {null}
 * @return {Promise<string>} - resolve(string)
 */
export const getCurrentBrowserFingerPrint = (): Promise<string> => {

    /**
     * @return {Promise} - a frequency number 120.256896523
     * @reference - https://fingerprintjs.com/blog/audio-fingerprinting/
     *
     * Some browsers restrict or stall OfflineAudioContext rendering (e.g. until
     * a user gesture). Guard with a timeout so the overall promise can fall back
     * to canvas + baseline signals instead of hanging forever.
     */
    const AUDIO_TIMEOUT_MS = 1000;
    const getTheAudioPrints = new Promise((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                reject(new Error("audio fingerprint timed out"));
            }
        }, AUDIO_TIMEOUT_MS);
        try {
            generateTheAudioFingerPrint.run(function (fingerprint: any) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve(fingerprint);
            });
        } catch (e) {
            if (!settled) {
                settled = true;
                clearTimeout(timer);
                reject(e);
            }
        }
    });

    /**
     *
     * @param {null}
     * @return {Promise<string>} - and sha512 hashed string
     */
    const DevicePrints: Promise<string> = new Promise((resolve, reject) => {
        const baseline = collectBaselineSignals();
        const webgl = collectWebGLEntropy();
        getTheAudioPrints.then((audioChannelResult) => {
            const fingerprint = [
                String(window.btoa(String(audioChannelResult))),
                String(getCanvasFingerprint()),
                baseline,
                webgl
            ].join("::");

            resolve(cyrb53(fingerprint, 0).toString());
        }).catch(() => {
            try {
                // if audio fingerprint fails, rely on canvas + baseline signals (+ webgl) to reduce collisions
                const combined = [
                    String(getCanvasFingerprint()),
                    baseline,
                    webgl
                ].join("::");
                resolve(cyrb53(combined).toString());
            } catch (error) {
                reject("Failed to generate the finger print of this browser");
            }
        })
    });
    return DevicePrints;
};

// Expose as a global for classic <script src> usage when a UMD/IIFE build is loaded.
// This is safe and idempotent; bundlers/tree-shakers ignore this in ESM contexts.
try {
    if (typeof window !== 'undefined' && !(window as any).getCurrentBrowserFingerPrint) {
        (window as any).getCurrentBrowserFingerPrint = getCurrentBrowserFingerPrint;
    }
} catch (_) { /* no-op */ }
