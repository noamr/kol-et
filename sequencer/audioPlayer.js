const Speaker = require('speaker')
const fs = require('fs')
const lame = require('lame')

function playFile(path) {
    fs.createReadStream(path)
        .pipe(new lame.Decoder())
        .pipe(new Speaker);
  }

  module.exports = playFile