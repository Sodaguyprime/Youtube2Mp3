const express = require("express");
const https = require('https');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/convert-mp3", (req, res) => {
    const videoId = req.body.VideoID;
    if (!videoId) {
        return res.render("index", { success: false, message: "Please enter a video ID" });
    }

    const options = {
        method: 'GET',
        hostname: 'youtube-mp36.p.rapidapi.com',
        port: null,
        path: `/dl?id=${videoId}`,
        headers: {
            'x-rapidapi-key': '8bbb73751bmshb90458728808e54p1e21c1jsna5530d057494',
            'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
        }
    };

    const request = https.request(options, function (response) {
        const chunks = [];

        response.on('data', function (chunk) {
            chunks.push(chunk);
        });

        response.on('end', function () {
            const body = Buffer.concat(chunks);
            const result = JSON.parse(body.toString());

            if (result.status === "ok") {
                res.render("index", { 
                    success: true, 
                    song_title: result.title, 
                    song_link: result.link 
                });
            } else {
                res.render("index", { success: false, message: result.msg || "An error occurred" });
            }
        });
    });

    request.on('error', function(error) {
        console.error('Error:', error);
        res.render("index", { success: false, message: "An error occurred while processing your request" });
    });

    request.end();
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});