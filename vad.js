import { Transform } from 'stream';

class VadTransform extends Transform {
    constructor(rec_options) {
	super();
	this.rec_options = rec_options;
    }

    _transform(chunk, encoding, next) {
	this.push(chunk);
        next();
    }
}

export { VadTransform }
