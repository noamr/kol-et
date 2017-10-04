const commandLineArgs = require('command-line-args')
const fs = require('fs')
const playSong = require('./playSong')
const optionDefinitions = [
    { name: 'midiFile', alias: 'm', type: String },
    { name: 'audioFile', alias: 'a', type: String },
    { name: 'playBeats', alias: 'b', type: Boolean},
    { name: 'delay', alias: 'd', type: Number }
  ]

const opts = Object.assign({
    colors: ['090909', 'DD0000', '00DD00', '0000DD',  '00EE55'],
    playBeats: false,
    delay: 800}, commandLineArgs(optionDefinitions))
playSong(opts)
