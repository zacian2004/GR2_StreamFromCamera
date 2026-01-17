const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
const uploadDir = path.join(__dirname, 'uploads');
const hlsDir = path.join(__dirname, 'hls');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(hlsDir)) fs.mkdirSync(hlsDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `video-${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(`Request to login: `, username, password);

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Please provide both username and password." });
    }

    try {
        const response = await axios({
            method: 'get',
            url: 'https://api.toolhub.app/hust/KiemTraMatKhau',
            params: {
                taikhoan: username,
                matkhau: password
            },
            timeout: 5000
        });

        const rawData = response.data;
        const dataString = String(rawData);
        const lines = dataString.split(/\r?\n/);
        const status = lines[0] ? lines[0].trim() : null;
        const message = lines[1] ? lines[1].trim() : "No message provided";
        console.log('User check: ${username} | Status from API: ${status}');
        if (status === "1") {
            return res.json({ 
                success: true, 
                message: "Sign in successful.",
                user: {
                    username: username,
                    role: 'user'
                }
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: message || "Invalid username or password."
            });
        }
    } catch (error) {
        if (error.response) {
            console.error("API Toolhub error:", error.response.status, error.response.statusText);
            console.error("Data return:", error.response.data);
        } else {
            console.error("Internal error:", error.message);
        }
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred while processing your request." 
        });
    }
});

app.post('/api/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const inputPath = req.file.path;
    const videoId = uuidv4();
    const outputDir = path.join(hlsDir, videoId);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const outputPath = path.join(outputDir, 'index.m3u8');
    console.log(`Converting video ${inputPath} to HLS format at ${outputPath}`);

    ffmpeg(inputPath)
        .outputOptions([
            '-hls_time 10',
            '-hls_list_size 0',
            '-c:v libx264',
            '-c:a aac',
            '-b:v 1000k'
        ])
        .output(outputPath)
        .on('end', () => {
            console.log(`HLS conversion completed for ${videoId}`);
            res.json({ 
                success: true, 
                message: "Video uploaded and converted successfully.", 
                streamUrl: `http://localhost:3000/hls/${videoId}/index.m3u8`
            });
        })
        .on('error', (err) => {
            console.error("Error during HLS conversion:", err);
            res.status(500).json({ success: false, message: "Error converting video to HLS." });
        })
        .run();
});
app.use('/hls', express.static(path.join(__dirname, 'hls')));

app.listen(PORT, () => {
    console.log(`Server Backend is running on http://localhost:${PORT}`);
});