import { Writable } from 'stream'
import Speaker from 'speaker'
import { sounddevice } from './config.js'

// 自定义可写流类，用于接收音频数据并播放
class AudioSound extends Writable {
    constructor(rec_options) {
        super();
        this.speaker = new Speaker({
            channels: rec_options.channels ,
            sampleRate: rec_options.rate,
            bitDepth: rec_options.bits,
	    device: sounddevice
        });
    }
    _write(chunk, encoding, callback) {
        // 将接收到的音频数据块写入到扬声器进行播放
        this.speaker.write(chunk);
        callback();
    }
}

export { AudioSound }
