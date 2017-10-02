const fs = require('fs')
const usleep = require('sleep').usleep

function playCommands(commands, callbacks) {
    const startTime = Date.now()

    async function playNext() {
        const now = Date.now()
        while (commands.length) {
            const designatedTime = commands[0].ts + startTime
            if (designatedTime > now) {
                setTimeout(playNext, designatedTime - now)          
                break;
            }
            const cmd = commands.splice(0, 1)[0]
            switch (cmd.cmd) {
                case 'AUDIO':
                    await callbacks.onAudio();
                    break;
                case 'BEAT':
                    await callbacks.onBeat();
                    break;
                case 'NOTE':
                    await callbacks.onNote(cmd.arg);
                    break;
            }    
        }
    }

    playNext()
}

module.exports = playCommands