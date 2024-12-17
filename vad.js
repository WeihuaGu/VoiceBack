import { Transform } from 'stream';
import axios from 'axios';
import FormData from 'form-data';


class VadTransform extends Transform {
    constructor(rec_options) {
	super();
	this.rec_options = rec_options;
	this.url_vadcheck = 'http://127.0.0.1:5000/check_audio'
    }

    _transform(chunk, encoding, next) {
	    const formData = new FormData();
	    formData.append('audio', Buffer.from(chunk), 'audio.wav');
	    const me = this;
        try {
            const response = axios.post(this.url_vadcheck, formData, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            });
	    response.then((res)=>{
                if (res.data === "The audio contains human voice") {
                   me.push(chunk);
                   next();
                }
	    })

        } catch (error) {
            console.error("Error while checking audio for voice:", error);
            next(error);
        }

    }
}

export { VadTransform }
