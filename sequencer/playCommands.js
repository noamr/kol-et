const fs = require('fs')

async function playCommands(cmds, callbacks, {delay}) {
    const startTime = Date.now()
    const commands = cmds.map(c => c.type === 'AUDIO' ? c : Object.assign({}, c, {ts: c.ts - delay})).sort((a, b) => a.ts - b.ts);
    console.log(commands)

    commands.forEach(async ({cmd, ts, arg}) => {
        const designatedTime = ts + startTime
        const now = Date.now()
        if (designatedTime > now) {
            await new Promise(resolve => setTimeout(resolve, designatedTime - now))
        }

        switch (cmd) {
            case 'AUDIO':
                await callbacks.onAudio();
                break;
            case 'BEAT':
                await callbacks.onBeat();
                break;
            case 'NOTE':
                await callbacks.onNote(arg);
                break;
        }    
    })
}

module.exports = playCommands