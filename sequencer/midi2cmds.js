const midiToJson = require('midi-converter').midiToJson

function midi2cmds(midiFile, {delay}) {
    const song = midiToJson(midiFile)
    const ticksPerBeat = song.header.ticksPerBeat
    let microsecondsPerBeat = 500000
    let timestamp = 0
    const commands = []
    const tempos = []
    const addCommand = (cmd, arg) => commands.push({ts: Math.floor(timestamp - delay), cmd, arg})
    song.tracks[0].forEach(command => {
        timestamp += command.deltaTime * microsecondsPerBeat / ticksPerBeat
        switch (command.subtype) {
            case "setTempo":
                tempos.push([timestamp, command.microsecondsPerBeat])
                microsecondsPerBeat = command.microsecondsPerBeat
                break
            case "noteOn":
                if (command.noteNumber === 24) {
                    addCommand("AUDIO")
                } else {
                    addCommand("NOTE", {channel: command.channel, note: command.noteNumber})
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
