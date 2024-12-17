import webrtcvad
import io
import wave
import struct

vad = webrtcvad.Vad();
sample_rate = 16000
frame_duration = 10  # ms

def split_frames_for_webrtcvad(frames, sample_rate, num_channels, sample_width):
    """
    根据webrtcvad库的要求对音频帧数据进行切分

    参数:
    frames (bytes): 包含音频数据的字节序列
    sample_rate (int): 音频的采样率，单位Hz
    num_channels (int): 音频的声道数
    sample_width (int): 音频的采样宽度，单位字节（如1表示8位音频，2表示16位音频等）

    返回:
    list: 切分好的符合webrtcvad处理要求的音频帧数据列表
    """
    frame_duration = 30  # 每帧时长，单位毫秒，可根据实际需求调整，webrtcvad常用30ms左右的帧时长
    frame_size = sample_rate * (frame_duration / 1000) * sample_width * num_channels
    num_frames = len(frames) // frame_size
    split_frames = []
    for i in range(num_frames):
        start = i * frame_size
        end = start + frame_size
        frame_data = frames[start:end]

        # 对于16位音频数据（采样宽度为2字节），webrtcvad通常只需要每个采样点的低字节（小端序情况）
        if sample_width == 2:
            frame_data = frame_data[1::2]
        elif sample_width!= 1:
            continue  # 暂时跳过其他不支持的采样宽度情况，可根据实际需求扩展处理逻辑

        # 确保frame_data长度是符合要求的整数倍（比如某些情况下需要补齐数据长度等，这里简单示例按原长度处理）
        if len(frame_data) % sample_width!= 0:
            continue
        # 将帧数据转换为整数序列（如果是16位音频等情况，根据小端序转换为对应的整数值）
        if sample_width == 2:
            fmt = f"<{len(frame_data) // 2}h"  # 小端序，有对应长度的短整型（16位）格式
            frame_data_as_ints = list(struct.unpack(fmt, frame_data))
        else:
            frame_data_as_ints = list(frame_data)

        split_frames.append(frame_data_as_ints)
    return split_frames

def is_speechdata(audio_io):
    with wave.open(audio_io, 'rb') as wav_file:
        num_channels = wav_file.getnchannels()
        sample_width = wav_file.getsampwidth()
        frames = wav_file.readframes(wav_file.getnframes())


    prin(frames);
    is_voice = vad.is_speech(frames, sample_rate)
    return is_voice;
