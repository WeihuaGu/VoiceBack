import { Transform } from 'stream';


const stdout = process.stdout;
class ConsoleTrans extends Transform {
    constructor(rec_options) {
	super();
    }

    _transform(chunk, encoding, next) {
	
	console.log(chunk);
        this.push(chunk);
	next();
    }
}

export { ConsoleTrans , stdout }
