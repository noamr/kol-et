const commandLineArgs = require('command-line-args')
const fs = require('fs')
const midi2cmds = require('./midi2cmds')
const playCommands = require('./playCommands')
const playAudio = require('./audioPlayer')
const oct = require('./octopus')
const optionDefinitions = [
    { name: 'midiFile', alias: 'm', type: String },
    { name: 'commandFile', alias: 'c', type: String },
    { name: 'audioFile', alias: 'a', type: String },
    { name: 'playBeats', alias: 'b', type: Boolean},
    { name: 'delay', alias: 'd', type: Number }
  ]

  async function start() {
    try {
        const options = commandLineArgs(optionDefinitions)
        const delay = options.delay || 1000
        const commands = midi2cmds(fs.readFileSync(options.midiFile, 'binary'))
        const octopus = await oct()
        await Promise.all(new Array(4).fill(0).map(async () => await octopus.demoOff()))
        octopus.setDelay(delay)

    colors = 'bcde';
        if (options.commandFile) {
            fs.writeFileSync(options.commandFile, JSON.stringify(commands))    
        } else {
            playCommands(commands, {
                onBeat: () => {
                    if (options.playBeats) {
                        return octopus.beat();                    
                    }
                },
                onNote: (channel) => {
                    console.log('NOTE ' + channel)
                    return octopus.note(colors[channel - 1], channel - 1);
                },
                onAudio: () => {
                    if (options.audioFile) {
                        return playAudio(options.audioFile)
                    }
            }}, {delay})
        }        
    } catch (e) {
        console.error(e)
    }
    
}

start()
