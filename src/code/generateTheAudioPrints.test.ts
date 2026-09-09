import { describe, expect, it, vi } from "vitest";
import { getAudioFingerprint } from "./generateTheAudioPrints";

function createAudioContext(value: number, neverResolve = false) {
    return class {
        currentTime = 0;
        destination = {};
        createOscillator() {
            return {
                type: "",
                frequency: { setValueAtTime: vi.fn() },
                connect: vi.fn(),
                disconnect: vi.fn(),
                start: vi.fn(),
            };
        }
        createDynamicsCompressor() {
            const parameter = { setValueAtTime: vi.fn() };
            return {
                threshold: parameter, knee: parameter, ratio: parameter,
                attack: parameter, release: parameter,
                connect: vi.fn(), disconnect: vi.fn(),
            };
        }
        startRendering() {
            if (neverResolve) return new Promise(() => undefined);
            return Promise.resolve({
                getChannelData: () => new Float32Array(5000).fill(value),
            });
        }
    };
}

describe("audio collector", () => {
    it("keeps concurrent calls isolated", async () => {
        let call = 0;
        const First = createAudioContext(0.1);
        const Second = createAudioContext(0.2);
        vi.stubGlobal("window", {
            OfflineAudioContext: class {
                constructor() {
                    return new (call++ === 0 ? First : Second)();
                }
            },
        });
        const [first, second] = await Promise.all([getAudioFingerprint(), getAudioFingerprint()]);
        expect(Number(first)).toBeCloseTo(50, 3);
        expect(Number(second)).toBeCloseTo(100, 3);
        vi.unstubAllGlobals();
    });

    it("rejects stalled rendering after the configured timeout", async () => {
        vi.stubGlobal("window", { OfflineAudioContext: createAudioContext(0, true) });
        await expect(getAudioFingerprint(5)).rejects.toThrow("timed out");
        vi.unstubAllGlobals();
    });
});
