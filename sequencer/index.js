const commandLineArgs = require('command-line-args')
const fs = require('fs')
const midi2cmds = require('./midi2cmds')
const playCommands = require('./playCommands')

const optionDefinitions = [
    { name: 'midiFile', alias: 'm', type: String },
    { name: 'commandFile', alias: 'c', type: String }
  ]

const options = commandLineArgs(optionDefinitions)
const commands = midi2cmds(fs.readFileSync(options.midiFile, 'binary'))

if (options.commandFile) {
    fs.writeFileSync(options.commandFile, JSON.stringify(commands))    
} else {
    playCommands(commands)
}

