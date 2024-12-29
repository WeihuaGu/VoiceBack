import { Transform } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
//import { url_vadcheck } from './config.js';

ffmpeg.setFfmpegPath(ffmpegPath);

class AudioCompressor extends Transform {
    constructor(rec_options) {
	super();
	this.ffmpegProcess = null;
    }

    _transform(chunk, encoding, next) {
	if (!this.ffmpegProcess) {
            this.ffmpegProcess = ffmpeg()
             .input('pipe:')
             .output('pipe:')
             .audioCodec('libmp3lame') // 使用MP3编码进行压缩
             .format('mp3')
             .on('error', (err) => {
                    console.error('Error during audio compression:', err);
                    this.emit('error', err);
                })
             .on('end', () => {
                    this.push(null); // 标记流结束
                })
             .pipe(this, { end: false });
        }
	this.ffmpegProcess.write(chunk);
	next();
    }

    _flush(callback) {
        if (this.ffmpegProcess) {
            this.ffmpegProcess.end();
        }
        callback();
    }
}

export { AudioCompressor }
