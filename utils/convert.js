const ffmpeg = require("fluent-ffmpeg");
const fs = require('fs')
const convert = (input, output, callback) => {
    ffmpeg(input)
        .output(output)
        .on('end', () => {
            console.log('Convert Ended')
            callback(null)
            fs.unlinkSync(input)
        })
        .on('error', (err) => {
            console.log('err', err)
            callback(err)
        })
        .run()
}
module.exports = convert