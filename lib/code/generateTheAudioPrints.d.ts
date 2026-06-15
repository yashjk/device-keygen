type FingerprintCallback = (fingerprint: string) => void;
declare global {
    interface Window {
        webkitOfflineAudioContext?: typeof OfflineAudioContext;
    }
}
export declare const generateTheAudioFingerPrint: {
    run: (cb: FingerprintCallback, debug?: boolean) => void;
};
export {};
