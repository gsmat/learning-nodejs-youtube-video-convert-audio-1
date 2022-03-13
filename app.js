const express = require("express");
const app = express();
const fs = require('fs')
const youtube = require("ytdl-core");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
const convert = require("./utils/convert");
const {v4: uuidv4} = require('uuid')
ffmpeg.setFfmpegPath(ffmpegPath);


app.set("view engine", "ejs");
// OUR ROUTES WILL GO HERE
const videoDir = 'videos/'
const audioDir = 'audios/'


app.get("/", (req, res) => {
    return res.render("index");
});

app.get("/download", async (req, res) => {
    const info = await youtube.getInfo(req.query.url)
    const name = uuidv4()
    // info['player_response']['videoDetails']['title'].replace(" ", "-")
    const videoName = name + '.mp4';
    const audioName = name + '.mp3';
    const stream = await fs.createWriteStream(videoDir + videoName)


    const yt = youtube(req.query.url)
    yt.pipe(stream);

    yt.on("error", (err) => {
        console.log(err)
    })

    yt.on("data", (chunk) => {
        console.log(chunk)
    })

    yt.on("end", () => {

        convert(videoDir + videoName, audioDir + audioName, async err => {
            if (!err) {
                res.header({
                    'Content-Disposition': 'attachment; filename=' + audioName
                })
                res.setHeader('Content-type', "audio/mp3");

                const filestream = fs.createReadStream(audioDir + audioName);
                filestream.pipe(res);
                fs.unlinkSync(audioDir + audioName)
                res.redirect('/')
                filestream.on("error", (err) => {
                    console.log(err)
                })
            }
        })
    })


})
;


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
