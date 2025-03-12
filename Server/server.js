const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Path to the video file
const videoPath = path.join(__dirname, '抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4');

// Serve the HTML file when visiting the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Video streaming route to serve video chunks
app.get('/video', (req, res) => {
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = (end - start) + 1;
        const fileStream = fs.createReadStream(videoPath, { start, end });

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        });

        fileStream.pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        });

        fs.createReadStream(videoPath).pipe(res);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
