import axios from 'axios';
import FormData from 'form-data';
import { Transform } from 'stream';
import { url_vadcheck } from './config.js';


class VadTransform extends Transform {
    constructor(rec_options) {
	super();
	this.rec_options = rec_options;
        this.sampleWidth = rec_options.bits/8;
        this.sampleRate =  rec_options.rate;
	this.url_vadcheck = url_vadcheck;
    }
    splitFrames(chunk,frameDuration) {
        const frameSizeInBytes = Math.floor(this.sampleRate * (frameDuration / 1000) * 2 * 1);
        const numFrames = Math.floor(chunk.length / frameSizeInBytes);
        const frames = [];

        for (let i = 0; i < numFrames; i++) {
            const start = i * frameSizeInBytes;
            const end = start + frameSizeInBytes;
            const frameChunk = chunk.slice(start, end);
            frames.push(frameChunk);
        }
        return frames;
    }
    sendFrameToPythonService(frameChunk) {
        // 根据采样宽度进行相应处理，这里针对16位音频提取低字节发送给Python服务
        let processedFrameChunk;
        processedFrameChunk = frameChunk;
        const formData = new FormData();
        formData.append('audio', Buffer.from(processedFrameChunk),'audio');

        const posturl = this.url_vadcheck;
	return new Promise((resolve, reject) => {
            axios.post(posturl, formData, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            }).then((response)=>{
		    const res_json =  response.data;
		    const flag_human = res_json.human_voice;
		    resolve(flag_human);
	    }).catch((error)=>{
                    //console.error("Error while checking vad server:", error);
                    resolve(false);
		    //reject(error);

	    });

	});

    }

    _transform(chunk, encoding, next) {
       const self = this;
       const frames = this.splitFrames(chunk,30);

       const voiceCheckPromises = frames.map((frameChunk) => {
	     return this.sendFrameToPythonService(frameChunk);
       });
       Promise.all(voiceCheckPromises)
	    .then((results)=>{
		        results.forEach((isVoice, index) => {
                          if (isVoice){ 
                            self.push(frames[index]);
			  }
			});
		        next();
            }).catch((error)=>{
               console.error("Error while checking audio for voice in _transform:", error);
               next(error);

	    });

    }
}

export { VadTransform }
