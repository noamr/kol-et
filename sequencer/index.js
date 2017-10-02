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
    const options = commandLineArgs(optionDefinitions)
    const delay = options.delay || 1000
    const commands = midi2cmds(fs.readFileSync(options.midiFile, 'binary'), {delay: delay * 1000})
    const octopus = await oct()
    octopus.demoOff()
    octopus.setDelay(delay)

    colors = ['b'];
    
    if (options.commandFile) {
        fs.writeFileSync(options.commandFile, JSON.stringify(commands))    
    } else {
        playCommands(commands, {
            onBeat: () => {
                if (options.playBeats) {
                    octopus.beat();                    
                }
                console.log('BEAT')
            },
            onNote: (note, channel) => {
                octopus.note(colors[channel], channel);
                // if (note === 45) {
                //     octopus.note('c', 2);                    
                // }
                // if (note === 37) {
                //     octopus.note('d', 3);                    
                // }
                console.log(`NOTE ${note} ${channel}`)            
            },
            onAudio: () => {
                if (options.audioFile) {
                    playAudio(options.audioFile)
                }
        }})
    }    
}

start()
