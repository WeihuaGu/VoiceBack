import { Transform } from'stream';
import webrtcvad from 'webrtcvad';

class VadTransform extends Transform {
    constructor() {
        super({
            readableObjectMode: true,
            writableObjectMode: true
        });
        this.vad = webrtcvad.default(16000, 3);
    }

    _transform(chunk, encoding, next) {
        const frameDuration = 10;
        const frameSize = Math.round(frameDuration * 16000 / 1000);
        const numFrames = Math.floor(chunk.length / frameSize);
        const voiceData = [];
        for (let i = 0; i < numFrames; i++) {
            const frame = chunk.slice(i * frameSize, (i + 1) * frameSize);
            const isSpeech = this.vad.isSpeech(frame.buffer, 16000);
            if (isSpeech) {
                voiceData.push(frame);
            }
        }
        if (voiceData.length > 0) {
            this.push(Buffer.concat(voiceData));
        }
        next();
    }
}

export { VadTransform }
