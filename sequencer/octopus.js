const SerialPort = require('serialport')

async function octopus() {
    return new Promise((resolve, reject) => {
        const port = new SerialPort(process.env.HERO_SERIAL_PATH, {baudRate: +(process.env.HERO_BAUD_RATE || 57600)})
        port.on('open', err => {
            if (err) {
                console.error(err);
                return;
            }
    
            function sendCommand(cmd) {
                return new Promise(resolve => {
                    port.write(new Buffer(`M*${cmd}\n`, 'ascii'), resolve)    
                })
            }    

            const PIXELS = +(process.env.HERO_PIXELS || '45')

            port.on('data', data => {
                console.log(data.toString('ascii'))
                resolve({
                    demoOn: () => sendCommand('D1'),
                    demoOff: () => sendCommand('D0'),
                    beat: () => sendCommand('naaaa'),
                    reset: () => sendCommand('r'),
                    setDelay: ms => sendCommand(`sT=${Math.floor(ms / PIXELS)}`),
                    setGoalColor: color => sendCommand(`sgc=${color}`),
                    setScoreColor: color => sendCommand(`ssc=${color}`),
                    setAcceptanceWindow: win => sendCommand(`ssc=${color}`),
                    defineNote: (channel, color) => sendCommand(`d${channel}${color}`),
                    playNote: (channel) =>
                        sendCommand('n' + new Array(4).fill('.').map((v, i) =>
                            i == channel ? (String.fromCharCode('b'.charCodeAt(0) + channel)) : '.'
                        ).join(''))
                    
                })    
            })            
        });

        port.on('error', e => console.error(e))
    
    })
}

module.exports = octopus
