const commandLineArgs = require('command-line-args')
const fs = require('fs')
const midi2cmds = require('./midi2cmds')
const playCommands = require('./playCommands')
const playAudio = require('./audioPlayer')

const optionDefinitions = [
    { name: 'midiFile', alias: 'm', type: String },
    { name: 'commandFile', alias: 'c', type: String },
    { name: 'audioFile', alias: 'a', type: String }
  ]

const options = commandLineArgs(optionDefinitions)
const commands = midi2cmds(fs.readFileSync(options.midiFile, 'binary'))

if (options.commandFile) {
    fs.writeFileSync(options.commandFile, JSON.stringify(commands))    
} else {
    playCommands(commands, {
        onBeat: () => {
            console.log('BEAT')
        },
        onNote: (note, channel) => {
            console.log(`NOTE ${note} ${channel}`)            
        },
        onAudio: () => {
            if (options.audioFile) {
                playAudio(options.audioFile)
            }
    }})
}

