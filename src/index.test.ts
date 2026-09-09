import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./code/generateTheAudioPrints", () => ({
    getAudioFingerprint: vi.fn().mockResolvedValue("1.25"),
}));
vi.mock("./code/GenerateCanvasFingerprint", () => ({
    getCanvasFingerprint: vi.fn().mockReturnValue("canvas-value"),
}));

afterEach(() => vi.unstubAllGlobals());

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

    it("rejects unsupported algorithm versions at runtime", async () => {
        installBrowserGlobals();
        const { generateDeviceId } = await import("./index");
        await expect(generateDeviceId({ algorithm: "v2" as never }))
            .rejects.toThrow("Unsupported fingerprint algorithm");
    });
});
