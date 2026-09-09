import { cyrb53 } from "./code/EncryptDecrypt";
import { getCanvasFingerprint } from "./code/GenerateCanvasFingerprint";
import { getAudioFingerprint } from "./code/generateTheAudioPrints";

export type FingerprintSignal = "audio" | "canvas" | "baseline" | "webgl";
export type FingerprintAlgorithm = "v1";
export interface FingerprintOptions {
    algorithm?: FingerprintAlgorithm;
    audioTimeoutMs?: number;
    signals?: Partial<Record<FingerprintSignal, boolean>>;
}
export interface FingerprintDiagnostics {
    id: string;
    algorithm: FingerprintAlgorithm;
    signals: Record<FingerprintSignal, "collected" | "disabled" | "unavailable">;
}
const DEFAULT_SIGNALS: Record<FingerprintSignal, boolean> = {
    audio: true, canvas: true, baseline: true, webgl: true,
};
function assertBrowser(): void {
    if (typeof window === "undefined" || typeof document === "undefined" || typeof navigator === "undefined") {
        throw new Error("device-unique-keygen can only generate identifiers in a browser environment");
    }
}
function collectBaselineSignals(): string {
    const nav = navigator as Navigator & { deviceMemory?: number; userLanguage?: string };
    return [
        nav.userAgent, nav.platform, nav.vendor, nav.hardwareConcurrency || "", nav.deviceMemory || "",
        screen.colorDepth || "", window.devicePixelRatio || "", screen.width || "", screen.height || "",
        Intl.DateTimeFormat().resolvedOptions().timeZone || "", nav.language || nav.userLanguage || "",
        Array.isArray(nav.languages) ? nav.languages.join(",") : "",
    ].map(String).join("|");
}
function collectWebGLEntropy(): string {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return "";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    if (!info) return "";
    return [gl.getParameter(info.UNMASKED_VENDOR_WEBGL) || "", gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || ""].join("|");
}
export async function getFingerprintDiagnostics(options: FingerprintOptions = {}): Promise<FingerprintDiagnostics> {
    assertBrowser();
    const algorithm = options.algorithm ?? "v1";
    if (algorithm !== "v1") throw new Error(`Unsupported fingerprint algorithm: ${String(algorithm)}`);
    const enabled = { ...DEFAULT_SIGNALS, ...options.signals };
    const signals: FingerprintDiagnostics["signals"] = {
        audio: enabled.audio ? "unavailable" : "disabled",
        canvas: enabled.canvas ? "unavailable" : "disabled",
        baseline: enabled.baseline ? "unavailable" : "disabled",
        webgl: enabled.webgl ? "unavailable" : "disabled",
    };
    let audio = "";
    if (enabled.audio) {
        try { audio = await getAudioFingerprint(options.audioTimeoutMs ?? 1000); signals.audio = "collected"; }
        catch { /* optional signal */ }
    }
    let canvas = "";
    if (enabled.canvas) {
        try { canvas = getCanvasFingerprint(); signals.canvas = canvas ? "collected" : "unavailable"; }
        catch { /* optional signal */ }
    }
    let baseline = "";
    if (enabled.baseline) {
        try { baseline = collectBaselineSignals(); signals.baseline = baseline ? "collected" : "unavailable"; }
        catch { /* optional signal */ }
    }
    let webgl = "";
    if (enabled.webgl) {
        try { webgl = collectWebGLEntropy(); signals.webgl = webgl ? "collected" : "unavailable"; }
        catch { /* optional signal */ }
    }
    if (!audio && !canvas && !baseline && !webgl) throw new Error("No browser fingerprint signals are available");
    const parts = audio ? [window.btoa(audio), canvas, baseline, webgl] : [canvas, baseline, webgl];
    return { id: cyrb53(parts.join("::"), 0).toString(), algorithm, signals };
}
export async function generateDeviceId(options: FingerprintOptions = {}): Promise<string> {
    return (await getFingerprintDiagnostics(options)).id;
}
export const getCurrentBrowserFingerprint = generateDeviceId;
/** @deprecated Use generateDeviceId or getCurrentBrowserFingerprint. */
export const getCurrentBrowserFingerPrint = generateDeviceId;
try {
    if (typeof window !== "undefined") {
        const target = window as Window & { getCurrentBrowserFingerPrint?: typeof generateDeviceId };
        if (!target.getCurrentBrowserFingerPrint) target.getCurrentBrowserFingerPrint = generateDeviceId;
    }
} catch { /* global exposure is best-effort */ }
