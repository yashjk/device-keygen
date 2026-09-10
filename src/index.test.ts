import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    canvasFingerprint: vi.fn().mockReturnValue("canvas-value"),
}));

vi.mock("./code/generateTheAudioPrints", () => ({
    getAudioFingerprint: vi.fn().mockResolvedValue("1.25"),
}));
vi.mock("./code/GenerateCanvasFingerprint", () => ({
    getCanvasFingerprint: mocks.canvasFingerprint,
}));

afterEach(() => {
    vi.unstubAllGlobals();
    mocks.canvasFingerprint.mockReturnValue("canvas-value");
});

function installBrowserGlobals(): void {
    vi.stubGlobal("window", { btoa: (value: string) => `b64:${value}`, devicePixelRatio: 2 });
    vi.stubGlobal("document", {
        createElement: () => ({ getContext: () => null }),
    });
    vi.stubGlobal("navigator", {
        userAgent: "test-agent", platform: "test-platform", vendor: "test-vendor",
        hardwareConcurrency: 8, language: "en", languages: ["en"],
    });
    vi.stubGlobal("screen", { colorDepth: 24, width: 1440, height: 900 });
}

describe("public API", () => {
    it("rejects with an Error outside a browser", async () => {
        const { generateDeviceId } = await import("./index");
        await expect(generateDeviceId()).rejects.toThrow("browser environment");
    });

    it("keeps all public aliases equivalent", async () => {
        installBrowserGlobals();
        const api = await import("./index");
        const values = await Promise.all([
            api.generateDeviceId(),
            api.getCurrentBrowserFingerprint(),
            api.getCurrentBrowserFingerPrint(),
        ]);
        expect(new Set(values).size).toBe(1);
        expect(values[0]).toMatch(/^\d+$/);
    });

    it("reports disabled and unavailable signals without exposing raw values", async () => {
        installBrowserGlobals();
        const { getFingerprintDiagnostics } = await import("./index");
        const result = await getFingerprintDiagnostics({
            signals: { audio: false, canvas: false, webgl: false },
        });
        expect(result.algorithm).toBe("v1");
        expect(result.signals).toEqual({
            audio: "disabled", canvas: "disabled", baseline: "collected", webgl: "disabled",
        });
        expect(result).not.toHaveProperty("components");
    });

    it("fails when every signal is disabled", async () => {
        installBrowserGlobals();
        const { generateDeviceId } = await import("./index");
        await expect(generateDeviceId({
            signals: { audio: false, canvas: false, baseline: false, webgl: false },
        })).rejects.toThrow("No browser fingerprint signals");
    });

    it("rejects canvas-only generation when Canvas 2D is unavailable", async () => {
        installBrowserGlobals();
        mocks.canvasFingerprint.mockReturnValue("");
        const { getFingerprintDiagnostics } = await import("./index");
        await expect(getFingerprintDiagnostics({
            signals: { audio: false, canvas: true, baseline: false, webgl: false },
        })).rejects.toThrow("No browser fingerprint signals");
    });

    it("reports unavailable canvas while retaining successful fallback signals", async () => {
        installBrowserGlobals();
        mocks.canvasFingerprint.mockReturnValue("");
        const { getFingerprintDiagnostics } = await import("./index");
        const result = await getFingerprintDiagnostics({
            signals: { audio: false, canvas: true, baseline: true, webgl: false },
        });
        expect(result.signals.canvas).toBe("unavailable");
        expect(result.signals.baseline).toBe("collected");
        expect(result.id).toMatch(/^\d+$/);
    });

    it("rejects unsupported algorithm versions at runtime", async () => {
        installBrowserGlobals();
        const { generateDeviceId } = await import("./index");
        await expect(generateDeviceId({ algorithm: "v2" as never }))
            .rejects.toThrow("Unsupported fingerprint algorithm");
    });
});
