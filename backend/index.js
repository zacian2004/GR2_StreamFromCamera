const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server Backend is running on http://localhost:${PORT}`);
});