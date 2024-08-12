const ytdl = require('ytdl-core');
const fs = require('fs');

async function downloadVideo(url) {
  if (!ytdl.validateURL(url)) {
    console.error('Invalid URL');
    return;
  }

  const videoInfo = await ytdl.getInfo(url);
  const title = videoInfo.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-'); // Replace invalid filename characters
  const output = `${title}.mp4`;

  console.log(`Downloading: ${title}`);
  ytdl(url, { quality: 'highest' })
    .pipe(fs.createWriteStream(output))
    .on('finish', () => {
      console.log(`Downloaded to ${output}`);
    });
}

// Get the URL from command line arguments
const url = process.argv[2];
if (!url) {
  console.error('Please provide a video URL.');
} else {
  downloadVideo(url);
}
