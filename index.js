import { rec_options ,getRecorder } from './recorder.js'
import { ConsoleTrans,stdout } from './consoletrans.js'
import { VadTransform } from './vad.js'
import { AudioSound } from './sound.js'
import { AudioCompressor } from './compressor.js'
const consoletrans = new ConsoleTrans();
const vadtrans = new VadTransform(rec_options);
const compress = new AudioCompressor();
const sound = new AudioSound(rec_options);
//getRecorder().pipe(consoletrans);
//getRecorder().pipe(sound);
//getRecorder().pipe(vadtrans).pipe(stdout);
getRecorder().pipe(compress).pipe(stdout);
