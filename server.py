import io
from flask import Flask, request
from vad import is_speechdata

app = Flask(__name__)

@app.route('/check_audio', methods=['POST'])
def check_audio():
    if 'audio' not in request.files:
        return "No audio file provided", 400

    audio_file = request.files['audio']
    audio_data = audio_file.read()

    # 将接收到的音频数据转换为可被webrtcvad处理的格式（这里假设是WAV格式，可按需调整）
    audio_io = io.BytesIO(audio_data)
    is_voice = is_speechdata(audio_io)
    if is_voice:
        return "The audio contains human voice", 200
    return "The audio does not contain human voice", 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
