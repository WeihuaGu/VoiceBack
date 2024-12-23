import io
import json
from flask import Flask, request
from vad import is_speechdata

app = Flask(__name__)

@app.route('/is_human_audio', methods=['POST'])
def check_audio():
    if 'audio' not in request.files:
        return "No audio file provided", 400

    audio_file = request.files['audio']
    audio_data = audio_file.read()
    is_voice = is_speechdata(audio_data);
    res_json = {
        "human_voice": is_voice,
    }
    if is_voice:
        print('The audio contains human voice');
    else:
        print('The audio does not contains human voice');
    return json.dumps(res_json), 200, {'Content-Type': 'application/json'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
