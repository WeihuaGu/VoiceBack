import AudioRecorder from 'node-audiorecorder'
const options = {
  program: `rec`, // Which program to use, either `arecord`, `rec`, or `sox`.
  device: null, // Recording device to use. Null means default.
  // List available devices with 'arecord -l', 'rec -V6 -n -t coreaudio junk_device_name', or 'sox -V6 -n -t coreaudio junk_device_name'.
  driver: null, // Recording driver to use. Null means default.

  bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
  format: `S16_LE`, // Encoding type. (only for `arecord`)
  rate: 16000, // Sample rate.
  type: `wav`, // Format type.

  // Following options only available when using `rec` or `sox`.
  silence: 2, // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5, // Silence threshold to start recording.
  thresholdStop: 0.5, // Silence threshold to stop recording.
  keepSilence: true, // Keep the silence in the recording.
}
const logger = console
// Create an instance.
const audioRecorder = new AudioRecorder(options, logger)
audioRecorder.start();
const getRecorder = () => {
   return audioRecorder.stream();
}
export { getRecorder }



