import { Transform , PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
//import { url_vadcheck } from './config.js';

ffmpeg.setFfmpegPath(ffmpegPath);

class AudioCompressor extends Transform {
    constructor(rec_options) {
	super();
	const me = this;
	// 创建PassThrough 流作为中间流
        this.inputStream = new PassThrough();
        this.outputStream = new PassThrough();
        this.ffmpegProcess = ffmpeg(this.inputStream)
	     .inputFormat('wav')
             .audioCodec('libmp3lame') // 使用MP3编码进行压缩
             .format('mp3')
             .on('error', this.msg_ffmpeg_err)
             .on('end', () => {
                    me.push(null); // 标记流结束
             });
	
	this.ffmpegProcess.pipe(this.outputStream);
	this.outputStream.on('data', (chunk) => me.push(chunk));


    }

    msg_ffmpeg_err(err){
        console.error('Error during audio compression:', err);
        this.emit('error', err);
    }

    _transform(chunk, encoding, next) {
	this.inputStream.write(chunk, encoding, next);
    }

}

export { AudioCompressor }
