// https://blog.logrocket.com/build-video-streaming-server-node/

const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index 2.html");
});

app.get("/video", function (req, res) {
    const range = req.headers.range;
    if (range) {
        const videoPath = "抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4";∆
        const videoSize = fs.statSync("抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4").∆size;
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.slice(range.indexOf('=') + 1).split('-')[0]);
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        console.log(range, start, end)
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
    }else{
        const videoPath = "抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4";
        const videoSize = fs.statSync("抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4").size;
        const CHUNK_SIZE = 10 ** 6;
        const headers = {

            "Accept-Ranges": "bytes",

            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, {start: 0});
        videoStream.pipe(res);
    }

});

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});