declare global {
    interface Window {
        webkitOfflineAudioContext?: typeof OfflineAudioContext;
    }
}
export declare function getAudioFingerprint(timeoutMs?: number): Promise<string>;
