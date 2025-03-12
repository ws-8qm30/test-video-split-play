// backend (Express.js) - server.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('.')); // Serve static files (HTML, JS)

app.get('/video', (req, res) => {
  const videoPath = path.join(__dirname, '抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4'); // Replace with your video file
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head); // 206 Partial Content
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head); // 200 OK
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// frontend (Vanilla JavaScript) - public/index.html

