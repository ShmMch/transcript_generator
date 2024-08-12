import sys
from youtube_transcript_api import YouTubeTranscriptApi
from googletrans import Translator

def fetch_transcript(video_id):
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    return transcript

def translate_transcript(transcript, dest_language):
    translator = Translator()
    translated = []
    for entry in transcript:
        translated_text = translator.translate(entry['text'], dest=dest_language).text
        translated.append({
            'start': entry['start'],
            'duration': entry['duration'],
            'text': translated_text
        })
    return translated

def save_transcript(transcript, filename='transcript.txt'):
    with open(filename, 'w') as file:
        for entry in transcript:
            file.write(f"{entry['start']} - {entry['duration']} : {entry['text']}\n")

def main(url, language):
    video_id = url.split('v=')[-1].split('&')[0]  # Extract video ID from URL
    transcript = fetch_transcript(video_id)
    translated_transcript = translate_transcript(transcript, language)
    save_transcript(translated_transcript)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_transcript.py <URL> <LANGUAGE>")
        sys.exit(1)
    url = sys.argv[1]
    language = sys.argv[2]
    main(url, language)
