const fs = require('fs')
const usleep = require('sleep').usleep

function playCommands(commands) {
    const startTime = Date.now() * 1000
    commands.forEach(cmd => {
        const now = Date.now() * 1000
        const designatedTime = cmd.ts + startTime
        if (designatedTime > now) {
            usleep(designatedTime - now)            
        }

        switch (cmd.cmd) {
            case "NOTE":
                process.stdout.write(`NOTE ${cmd.arg.channel} ${cmd.arg.note}\n`)
                break
            case "BEAT":
                process.stdout.write(`BEAT\n`)
                break
            case "AUDIO":
                process.stdout.write(`AUDIO\n`)
                break
        }
    })
}

module.exports = playCommands