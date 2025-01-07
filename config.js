import fs from 'fs';
const url_vadcheck = 'http://box.local:5000/is_human_audio';
const snddevicename = 'pcmC2D0c';
const sounddevice = 'pulse';
function sndName() {
    const exists = fs.existsSync('/dev/snd/'+snddevicename);
    if (exists) {
	return snddevicename;
    } else {
	return null;
    }
}





















export { url_vadcheck,sndName,sounddevice } 
