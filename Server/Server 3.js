let express = require('express');
let fs = require('fs');
let path = require('path');
let cors = require('cors');
let app = express();
let port = 8080;

app.use(cors());

// app.use(express.static(path.join(__dirname, '.')));

app.listen(port, () => console.log(`Video stream app listening on port ${port}!`));


let mainVideoFilePath = path.join(__dirname, '抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4');

let files = `抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4.sf-part1
抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4.sf-part2
抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4.sf-part3
抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4.sf-part4
抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4.sf-part5
抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4.sf-part6
抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4.sf-part7
抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4.sf-part8`.split('\n')
let sf = files.map(f => fs.statSync(f).size)
console.log(sf)

app.get('/ping', (req, res) => res.send('pong !!'));

app.get('/video', (req, res) => {
  try {
    let main_stat = fs.statSync(mainVideoFilePath);
    let main_fileSize = main_stat.size;

    let range = req.headers.range;

    let parts = range.replace(/bytes=/, '').split('-');
    let start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : main_fileSize - 1;
    let chunkSize = end - start + 1;

    let n = Math.floor(start / 20000000) + 1

    let n_start = start - (n - 1) * 20000000
    let n_end = parts[1] ? end - n * 20000000 : 20000000

    console.log(n, start, end, n_start, n_end)

    let targetFilePath = `./抖音v - 7457707741759425802 -- withLaura ---> 打工人一年去了12个国家 年度旅行总结 #每一帧都是热爱 #2024年度回忆 #旅行.mp4.sf-part${n}`

    console.log(range)
    if (range) {




      let file = fs.createReadStream(targetFilePath, { start: n_start, end: n_end });
      let headers = {
        'Content-Type': 'video/mp4',
        'Content-Length': chunkSize,
        'Content-Range': `bytes ${start}-${end}/${main_fileSize}`,
        'Accept-Ranges': 'bytes',
      };
      res.status(206).set(headers);
      file.pipe(res);
    } else {
      let headers = {
        'Content-Type': 'video/mp4',
        'Content-Length': main_fileSize,
        'Accept-Ranges': 'bytes',
      };
      res.status(200).set(headers);
      fs.createReadStream(mainVideoFilePath).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index 2.html')));
