//  ref = https://github.com/rickmacgillis/audio-fingerprint/blob/master/audio-fingerprinting.js

type FingerprintCallback = (fingerprint: string) => void;

declare global {
    interface Window {
        webkitOfflineAudioContext?: typeof OfflineAudioContext;
    }
}

export const generateTheAudioFingerPrint = (function () {

    let context: OfflineAudioContext | null = null;
    let currentTime: number | null = null;
    let oscillator: OscillatorNode | null = null;
    let compressor: DynamicsCompressorNode | null = null;
    let fingerprint: string | null = null;
    let callback: FingerprintCallback | null = null;

    function run(cb: FingerprintCallback, debug = false): void {

        callback = cb;

        try {

            setup();

            oscillator!.connect(compressor!);
            compressor!.connect(context!.destination);

            oscillator!.start(0);
            context!.startRendering();

            context!.oncomplete = onComplete;

        } catch (e) {

            if (debug) {
                throw e;
            }

        }
    }

    function setup(): void {
        setContext();
        currentTime = context!.currentTime;
        setOscillator();
        setCompressor();
    }

    function setContext(): void {
        const audioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        context = new audioContext!(1, 44100, 44100);
    }

    function setOscillator(): void {
        oscillator = context!.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(10000, currentTime!);
    }

    function setCompressor(): void {
        compressor = context!.createDynamicsCompressor();

        setCompressorValueIfDefined('threshold', -50);
        setCompressorValueIfDefined('knee', 40);
        setCompressorValueIfDefined('ratio', 12);
        setCompressorValueIfDefined('reduction', -20);
        setCompressorValueIfDefined('attack', 0);
        setCompressorValueIfDefined('release', .25);
    }

    function setCompressorValueIfDefined(item: string, value: number): void {
        const param = (compressor as unknown as Record<string, AudioParam | undefined>)[item];
        if (param !== undefined && typeof param.setValueAtTime === 'function') {
            param.setValueAtTime(value, context!.currentTime);
        }
    }

    function onComplete(event: OfflineAudioCompletionEvent): void {
        generateFingerprints(event);
        compressor!.disconnect();
    }

    function generateFingerprints(event: OfflineAudioCompletionEvent): void {
        let output = 0;
        for (let i = 4500; 5e3 > i; i++) {

            const channelData = event.renderedBuffer.getChannelData(0)[i];
            output += Math.abs(channelData);

        }

        fingerprint = output.toString();

        if (typeof callback === 'function') {
            callback(fingerprint);
        }
    }

    return {
        run: run
    };

})();
