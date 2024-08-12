from pytube import YouTube
import sys

def download_video(url):
    yt = YouTube(url)
    video = yt.streams.filter(file_extension='mp4').first()
    video.download(filename='video.mp4')

if __name__ == '__main__':
    url = sys.argv[1]
    download_video(url)
