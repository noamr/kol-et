const midi2cmds = require('./midi2cmds')
const playCommands = require('./playCommands')
const playAudio = require('./audioPlayer')
const oct = require('./octopus')
const fs = require('fs')

module.exports = async function playSong({title, midiFile, audioFile, delay, playBeats, colors}) {
  try {
      console.log(`Playing ${title}`)
      const commands = midi2cmds(fs.readFileSync(midiFile, 'binary'))
      const octopus = await oct()
      await octopus.demoOff()
      await octopus.demoOff()
      await octopus.demoOff()
      await octopus.setDelay(delay)
      for (var i = 0; i < colors.length; ++i) {
          await octopus.defineNote(i, colors[i], !!i)
      }

      await playCommands(commands, {
          onBeat: () => {
              if (playBeats) {
                  return octopus.beat();                    
              }
          },
          onNote: (channel) => {
              console.log('NOTE ' + channel)
              return octopus.playNote(channel - 1);
          },
          onAudio: () => {
              if (audioFile) {
                  return playAudio(audioFile)
              }
      }}, {delay})
  } catch (e) {
      console.error(e)
      console.log('Moving to next song')
  }
}  

