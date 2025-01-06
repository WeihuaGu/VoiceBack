import AudioRecorder from 'node-audiorecorder'
import { sndName } from './config.js'
import { delaytime } from './util.js'
const rec_options = {
  program: `arecord`, // Which program to use, either `arecord`, `rec`, or `sox`.
  device: null, // Recording device to use. Null means default.
  //device: 'plughw:2,0', // Recording device to use. Null means default.
  driver: null, // Recording driver to use. Null means default.
  bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
  format: `S16_LE`, // Encoding type. (only for `arecord`)
  rate: 16000, // Sample rate.
  type: `wav`, // Format type.
}

// Create an instance.
const audioRecorder = new AudioRecorder(rec_options,console);
audioRecorder.on('error', (info) => {
   console.log(info);
});
audioRecorder.on('end', (info) => {
   console.log(info);
   delaytime(1).then(()=>{
       audioRecorder.start();
   });
});
const getRecorder = () => {
   audioRecorder.start();
   return audioRecorder.stream();
}
export { rec_options,getRecorder }



