import webrtcvad
import io
import wave
import struct

vad = webrtcvad.Vad(1);
sample_rate = 16000
frame_duration = 30  # ms

def is_speechdata(audio_data):
    is_voice = vad.is_speech(audio_data, sample_rate)
    return is_voice;
