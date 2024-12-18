import { Transform } from 'stream';
import axios from 'axios';
import FormData from 'form-data';


class VadTransform extends Transform {
    constructor(rec_options) {
	super();
	this.rec_options = rec_options;
        this.sampleWidth = int(rec_options.bits/8);
        this.sampleRate =  rec_options.sampleRate;
	this.url_vadcheck = 'http://127.0.0.1:5000/check_audio';
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
        if (this.sampleWidth === 2) {
            processedFrameChunk = frameChunk.filter((_, index) => index % 2!== 0);
        } else {
            processedFrameChunk = frameChunk;
        }
        const formData = new FormData();
        formData.append('audio', Buffer.from(processedFrameChunk));

        const posturl = this.url_vadcheck;
	return new Promise((resolve, reject) => {
            axios.post(posturl, formData, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            }).then((response)=>{
		    resolve(response.data === "The audio contains human voice");
	    }).catch((error)=>{
                    console.error("Error while checking audio for voice:", error);
                    reject(false);

	    });

	});

    }

    _transform(chunk, encoding, next) {
       const self = this;
       const frames = this.splitFrames(chunk,30);
       const voiceCheckPromises = frames.map(frameChunk => this.sendFrameToPythonService(frameChunk));
       Promise.all(voiceCheckPromises)
	    .then(()=>{
		        results.forEach((isVoice, index) => {
                          if (isVoice) 
                            self.push(frames[index]);
			});
		        next();
            }).catch((err)=>{
               console.error("Error while checking audio for voice in _transform:", error);
               next(error);

	    });

    }
}

export { VadTransform }
