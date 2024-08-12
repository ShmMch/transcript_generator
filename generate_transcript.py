import sys
import os
import youtube_dl
from whisper import Whisper
from googletrans import Translator

def download_audio(url, output_file='audio.mp3'):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_file,
        'quiet': True,
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

def transcribe_audio(audio_file):
    model = Whisper.load_model('base')
    result = model.transcribe(audio_file)
    return result['text']

def translate_transcript(transcript, dest_language):
    translator = Translator()
    translated = translator.translate(transcript, dest=dest_language).text
    return translated

def save_transcript(transcript, filename='transcript.txt'):
    with open(filename, 'w') as file:
        file.write(transcript)

def main(url, language):
    audio_file = 'audio.mp3'
    download_audio(url, audio_file)
    transcript = transcribe_audio(audio_file)
    translated_transcript = translate_transcript(transcript, language)
    save_transcript(translated_transcript)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_transcript.py <URL> <LANGUAGE>")
        sys.exit(1)
    url = sys.argv[1]
    language = sys.argv[2]
    main(url, language)
