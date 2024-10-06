const express = require('express');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');

const app = express();

// Шлях до ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Статичні файли
app.use(express.static(path.join(__dirname, '../public')));
app.use('/media', express.static(path.join(__dirname, '../media')));

// Відправлення index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Конвертація AVI у MP4
app.get('/convert-avi', (req, res) => {
    const inputPath = path.join(__dirname, '../media/video.avi');
    const outputPath = path.join(__dirname, '../public/video-avi.mp4');

    if (fs.existsSync(outputPath)) {
        return res.sendFile(outputPath);
    }

    ffmpeg(inputPath)
        .output(outputPath)
        .on('start', () => {
            console.log('Початок конвертації AVI');
        })
        .on('end', () => {
            console.log('Конвертація AVI завершена');
            res.sendFile(outputPath);
        })
        .on('error', (err) => {
            console.error('Помилка конвертації AVI: ', err.message);
            res.status(500).send(`Помилка конвертації файлу AVI: ${err.message}`);
        })
        .run();
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер працює на порту 3000');
});
