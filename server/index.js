const express = require('express')
const fs = require('fs')
const path =require('path')

const app = express()

const videoFileMap={
    'JhonWick':'videos/JhonWick.mp4',
    'jurassic world':'videos/jurassicworld.mp4',
    'the boys':'videos/theboys.mp4',
    'antman':'videos/antman.mp4',
    'Avengers':'videos/Avengers.mp4',
    'avengers2':'videos/avengers2.mp4',
    'moonknight':'videos/moonknight.mp4',
    'avengers3':'videos/avengers3.mp4',
    'avengers4':'videos/avengers4.mp4',
}

app.get('/videos/:filename', (req, res)=>{
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, videoFileMap[fileName])
    if(!filePath){
        return res.status(404).send('File not found')
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range){
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = end - start + 1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else{
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res)
    }
})

app.listen(3000, ()=>{
    console.log('server is listening on post 3000')
})