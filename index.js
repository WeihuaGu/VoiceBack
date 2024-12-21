import { rec_options ,getRecorder } from './recorder.js'
import { VadTransform } from './vad.js'
import { AudioSound } from './sound.js'
const vadtrans = new VadTransform(rec_options);
const sound = new AudioSound(rec_options);
//getRecorder().pipe(sound);
getRecorder().pipe(vadtrans).pipe(sound);
