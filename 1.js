const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to download video from a URL and save to a file
async function downloadVideo(videoUrl, outputFilePath) {
  const writer = fs.createWriteStream(outputFilePath);

  try {
    const response = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream', // We want the response as a stream (ideal for large files)
    });

    // Pipe the video stream into the file
    response.data.pipe(writer);

    // Return a promise that resolves when the download is complete
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`Download complete. File saved to ${outputFilePath}`));
      writer.on('error', (err) => reject(`Error downloading video: ${err.message}`));
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    throw err;
  }
}

// Example usage
const videoUrl = 'https://v5-dy-o-abtest.zjcdn.com/19e2f338a445a7413dd4ca39b66872a4/67d1a838/video/tos/cn/tos-cn-ve-15/o0edlQ2DD5GfAfoIMZL63QYoCkvdIAEAifkMMA/?a=6383\u0026ch=26\u0026cr=3\u0026dr=0\u0026lr=all\u0026cd=0%7C0%7C0%7C3\u0026cv=1\u0026br=1965\u0026bt=1965\u0026cs=0\u0026ds=4\u0026ft=ANicW4Hm9Iux8KusH5FMpG7AlcuSe9q2bLMqOpFuZmkaY3\u0026mime_type=video_mp4\u0026qs=0\u0026rc=NDY5PDpnaDpoNjo1NjRpOkBpM2kza2o5cnBrdzMzNGkzM0A0MjI2MzFfNmExYDE2NjNeYSNtNW4uMmRzYnNgLS1kLTBzcw%3D%3D\u0026btag=c0000e00038000\u0026cc=46\u0026cquery=100o_100w_100B_100x_100z\u0026dy_q=1741781904\u0026feature_id=46a7bb47b4fd1280f3d3825bf2b29388\u0026l=20250312201824105241A999BC7F19FAB6\u0026req_cdn_type='; // Replace with your video URL
const outputFilePath = path.join(__dirname, '抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4'); // Path to save the file

downloadVideo(videoUrl, outputFilePath)
  .then(message => console.log(message))
  .catch(error => console.error(error));