const fs = require('fs')
const usleep = require('sleep').usleep

function playCommands(commands, callbacks) {
    const startTime = Date.now() * 1000

    function playNext() {
        const now = Date.now() * 1000
        while (commands.length) {
            const designatedTime = commands[0].ts + startTime
            if (designatedTime > now) {
                setTimeout(playNext, (designatedTime - now) / 1000)            
                break;
            }
            const cmd = commands.splice(0, 1)[0]
            switch (cmd.cmd) {
                case 'AUDIO':
                    callbacks.onAudio();
                    break;
                case 'BEAT':
                    callbacks.onBeat();
                    break;
                case 'NOTE':
                    callbacks.onNote(cmd.arg.note, cmd.arg.channel);
                    break;
            }    
        }
    }

    playNext()
}

module.exports = playCommands