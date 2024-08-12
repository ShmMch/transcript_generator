const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const { exec } = require('child_process');

// Function to download video
async function downloadVideo(url, outputFileName) {
  if (!ytdl.validateURL(url)) {
    console.error('Invalid URL');
    return;
  }

  const videoStream = ytdl(url, { quality: 'highest' });
  videoStream.pipe(fs.createWriteStream(outputFileName));
  
  return new Promise((resolve, reject) => {
    videoStream.on('end', () => resolve());
    videoStream.on('error', (err) => reject(err));
  });
}

// Function to extract audio
function extractAudio(videoFileName, audioFileName) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoFileName)
      .noVideo()
      .audioCodec('aac')
      .save(audioFileName)
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
}

// Placeholder function for transcription (replace with actual transcription logic)
function transcribeAudio(audioFileName) {
  return new Promise((resolve, reject) => {
    exec(`whisper ${audioFileName} --output_transcript`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Main function
async function main(url) {
  const videoFileName = 'video.mp4';
  const audioFileName = 'audio.aac';
  const transcriptFileName = 'transcript.txt';

  try {
    await downloadVideo(url, videoFileName);
    await extractAudio(videoFileName, audioFileName);
    const transcript = await transcribeAudio(audioFileName);
    fs.writeFileSync(transcriptFileName, transcript);
    console.log('Transcript created:', transcriptFileName);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Get URL from command line arguments
const url = process.argv[2];
if (!url) {
  console.error('Please provide a video URL.');
} else {
  main(url);
}
