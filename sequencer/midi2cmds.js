const midiToJson = require('midi-converter').midiToJson
const _ = require('lodash')

function midi2cmds(midiFile) {
    const song = midiToJson(midiFile)
    const ticksPerBeat = song.header.ticksPerBeat
    let microsecondsPerBeat = 500000
    const commands = []
    const tempos = []
    const addCommand = (cmd, arg) => commands.push({ts: Math.floor(timestamp), cmd, arg})
    let firstNote = true

    const flatCommands = _(song.tracks).map(
        (track, i) => _.reduce(track, (agg, cmd) => agg.concat([_.assign({trackIndex: i, absoluteTime: _.get(_.last(agg), 'absoluteTime', 0) + cmd.deltaTime}, cmd)]), []))
        .flatten()
        .value()

    let rawTime = 0
    let timestamp = 0
    console.log(flatCommands)
    flatCommands.forEach(command => {
        const deltaTime = command.absoluteTime - rawTime
        rawTime = command.absoluteTime
        timestamp += deltaTime * microsecondsPerBeat / ticksPerBeat
        switch (command.subtype) {
            case "setTempo":
                tempos.push([timestamp, command.microsecondsPerBeat])
                microsecondsPerBeat = command.microsecondsPerBeat
                break
            case "noteOn":
                if (firstNote) {
                    addCommand("AUDIO", null)
                    firstNote = false
                } else {
                    addCommand("NOTE", command.trackIndex - 2)
                }
                break
        }
    })

    tempos.forEach(([ts, mpb], index) => {
        const nextTs = index === tempos.length - 1 ? commands[commands.length - 1].ts : tempos[index + 1].ts
        for (let t = ts - (ts % mpb); t < nextTs - (nextTs % mpb); t += mpb) {
            commands.push({ts: t, cmd: "BEAT"})
        }
    })

    return commands.sort((a, b) => a.ts - b.ts).map(cmd => Object.assign(cmd, {ts: Math.floor(cmd.ts / 1000)}))
}

module.exports = midi2cmds
