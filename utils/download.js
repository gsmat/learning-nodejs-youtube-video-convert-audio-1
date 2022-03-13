const ytdl = require("ytdl-core");
const fs = require('fs')

const download = (url, videoId, directory) => {
    ytdl(url)
        .pipe(fs.createWriteStream(directory + videoId + '.mp4'));
}

module.exports = download