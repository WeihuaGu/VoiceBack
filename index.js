import { rec_options ,getRecorder } from './recorder.js'
import { VadTransform } from './vad.js'
import { AudioSound } from './sound.js'
import { AudioCompressor } from './compressor.js'
const vadtrans = new VadTransform(rec_options);
const compress = new AudioCompressor();
const sound = new AudioSound(rec_options);
//getRecorder().pipe(sound);
//getRecorder().pipe(vadtrans).pipe(sound);
getRecorder().pipe(compress).pipe(sound);
