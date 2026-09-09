declare global {
    interface Window {
        webkitOfflineAudioContext?: typeof OfflineAudioContext;
    }
}

export async function getAudioFingerprint(timeoutMs = 1000): Promise<string> {
    const AudioContextConstructor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!AudioContextConstructor) throw new Error("OfflineAudioContext is unavailable");
    const context = new AudioContextConstructor(1, 44100, 44100);
    const oscillator = context.createOscillator();
    const compressor = context.createDynamicsCompressor();
    let timer: ReturnType<typeof setTimeout> | undefined;
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(10000, context.currentTime);
    compressor.threshold.setValueAtTime(-50, context.currentTime);
    compressor.knee.setValueAtTime(40, context.currentTime);
    compressor.ratio.setValueAtTime(12, context.currentTime);
    compressor.attack.setValueAtTime(0, context.currentTime);
    compressor.release.setValueAtTime(0.25, context.currentTime);
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);
    try {
        const renderedBuffer = await Promise.race([
            context.startRendering(),
            new Promise<never>((_, reject) => {
                timer = setTimeout(() => reject(new Error("Audio fingerprint timed out")), timeoutMs);
            }),
        ]);
        const channel = renderedBuffer.getChannelData(0);
        let output = 0;
        for (let index = 4500; index < 5000; index += 1) output += Math.abs(channel[index]);
        return output.toString();
    } finally {
        if (timer) clearTimeout(timer);
        oscillator.disconnect();
        compressor.disconnect();
    }
}
