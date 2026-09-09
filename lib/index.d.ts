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
export declare function getFingerprintDiagnostics(options?: FingerprintOptions): Promise<FingerprintDiagnostics>;
export declare function generateDeviceId(options?: FingerprintOptions): Promise<string>;
export declare const getCurrentBrowserFingerprint: typeof generateDeviceId;
/** @deprecated Use generateDeviceId or getCurrentBrowserFingerprint. */
export declare const getCurrentBrowserFingerPrint: typeof generateDeviceId;
