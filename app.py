# from flask import Flask, render_template, url_for, request, redirect
# from flask_sqlalchemy import SQLAlchemy
# from datetime import datetime
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask import jsonify
# from flask_cors import CORS
# # import functions
# # import email_verification
# import os
# import wave
# from vosk import Model, KaldiRecognizer

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
# db = SQLAlchemy(app)
# CORS(app)

# class Accounts(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(200), nullable=False, unique=True)
#     username = db.Column(db.String(200), nullable=False, unique=True)
#     password_hash = db.Column(db.String(256), nullable=False)

#     def set_password(self, password):
#         self.password_hash = generate_password_hash(password)
    
#     def check_password(self, password):
#         return check_password_hash(self.password_hash, password)

#     def __repr__(self):
#         return f'<Account name: {self.username}, id: {self.id}>'

# @app.route('/', methods=['POST', 'GET'])
# def index():
#     return jsonify({'message': 'some random page'})
    


# @app.route('/upload-audio', methods=['POST'])
# def upload_audio():
#     if 'audio' not in request.files:
#         return jsonify({'error': 'No audio file in request'}), 400
    
#     os.makedirs('uploads', exist_ok=True)
    
#     audio_file = request.files['audio']
#     # Save to a folder or process as needed
#     audio_file.save(os.path.join('uploads', audio_file.filename))
    
#     # Process the audio file or simply return success
#     print(f"Received audio file: {audio_file.filename}")
#     return jsonify({'message': 'Audio received successfully'})


# @app.route('/upload-audio-stt', methods=['POST'])
# def upload_audio_stt():
#     if 'audio' not in request.files:
#         return jsonify({'error': 'No audio file in request'}), 400

#     os.makedirs('uploads', exist_ok=True)
    
#     audio_file = request.files['audio']
#     file_path = os.path.join('uploads', audio_file.filename)
#     audio_file.save(file_path)
    
#     # Check that the model folder exists
#     if not os.path.exists("model"):
#         return jsonify({"error": "Speech model not found. Please download a Vosk model and place it in the 'model' folder."}), 500
    
#     try:
#         wf = wave.open(file_path, "rb")
#     except Exception as e:
#         return jsonify({"error": f"Could not open audio file: {str(e)}"}), 400

#     # Vosk expects mono, 16-bit PCM WAV. You may need to convert if your recordings differ.
#     if wf.getnchannels() != 1 or wf.getsampwidth() != 2:
#         return jsonify({"error": "Audio file must be mono PCM WAV 16-bit."}), 400

#     model = Model("model")
#     rec = KaldiRecognizer(model, wf.getframerate())
    
#     transcript = ""
#     while True:
#         data = wf.readframes(4000)
#         if len(data) == 0:
#             break
#         if rec.AcceptWaveform(data):
#             result = rec.Result()
#             transcript += result
#     transcript += rec.FinalResult()
    
#     print(f"Transcription result: {transcript}")
#     return jsonify({"transcript": transcript})

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5001, debug=True)

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import wave
import subprocess
from vosk import Model, KaldiRecognizer

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
CORS(app)

# (Your Accounts model and other routes go here)

@app.route('/', methods=['POST', 'GET'])
def index():
    return jsonify({'message': 'some random page'})

# Route to simply receive audio if needed
@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file in request'}), 400
    
    os.makedirs('uploads', exist_ok=True)
    audio_file = request.files['audio']
    audio_file.save(os.path.join('uploads', audio_file.filename))
    print(f"Received audio file: {audio_file.filename}")
    return jsonify({'message': 'Audio received successfully'})

def convert_to_wav(input_path, output_path):
    # Convert m4a to WAV: force mono channel, 16kHz sample rate and 16-bit PCM
    command = [
        "ffmpeg", "-y", "-i", input_path,
        "-ac", "1",          # mono channel
        "-ar", "16000",      # sample rate 16kHz
        "-acodec", "pcm_s16le",  # PCM signed 16-bit little endian
        output_path
    ]
    subprocess.run(command, check=True)

@app.route('/upload-audio-stt', methods=['POST'])
def upload_audio_stt():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file in request'}), 400
    
    os.makedirs('uploads', exist_ok=True)
    audio_file = request.files['audio']
    input_file_path = os.path.join('uploads', audio_file.filename)
    audio_file.save(input_file_path)
    
    # Ensure Vosk model folder exists
    if not os.path.exists("model"):
        return jsonify({"error": "Speech model not found. Please download a Vosk model and place it in the 'model' folder."}), 500
    
    # Convert m4a to WAV
    wav_file_path = os.path.splitext(input_file_path)[0] + ".wav"
    try:
        convert_to_wav(input_file_path, wav_file_path)
    except Exception as e:
        return jsonify({"error": f"Conversion to WAV failed: {str(e)}"}), 500
    
    try:
        wf = wave.open(wav_file_path, "rb")
    except Exception as e:
        return jsonify({"error": f"Could not open WAV file: {str(e)}"}), 400
    
    # Ensure audio is mono PCM 16-bit as expected by Vosk
    if wf.getnchannels() != 1 or wf.getsampwidth() != 2:
        return jsonify({"error": "Audio file must be mono PCM WAV 16-bit."}), 400

    model = Model("model")
    rec = KaldiRecognizer(model, wf.getframerate())
    
    transcript = ""
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            result = rec.Result()
            transcript += result
    transcript += rec.FinalResult()
    
    print(f"Transcription result: {transcript}")
    return jsonify({"transcript": transcript})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)