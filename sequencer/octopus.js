const SerialPort = require('serialport')

async function octopus() {
    return new Promise((resolve, reject) => {
        const port = new SerialPort(process.env.HERO_SERIAL_PATH || '/dev/cu.wchusbserial1420', {baudRate: +(process.env.HERO_BAUD_RATE || 57600)})
        port.on('open', err => {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
    
            function sendCommand(cmd) {
                console.log(`Sending: ${cmd}`)
                return new Promise(resolve => {
                    port.write(new Buffer(`M*${cmd}\n`, 'ascii'), (err, bytes) => {
                        port.drain(resolve)
                    })    
                })
            }    

            const PIXELS = +(process.env.HERO_PIXELS || '45')

            port.on('data', data => {
                console.log('Received ' + data.toString('ascii').replace(/(\r|\n)/, ' | '))
                resolve && resolve({
                    demoOn: () => sendCommand('D1'),
                    demoOff: () => sendCommand('D0'),
                    beat: () => sendCommand('naaaa'),
                    reset: () => sendCommand('r'),
                    setDelay: ms => sendCommand(`sT=${Math.floor(ms / PIXELS)}`),
                    setGoalColor: color => sendCommand(`sgc=0x${color}`),
                    setScoreColor: color => sendCommand(`ssc=0x${color}`),
                    setAcceptanceWindow: win => sendCommand(`ssc=${color}`),
                    defineNote: (channel, color, scorable   ) => sendCommand(`d${(String.fromCharCode('a'.charCodeAt(0) + channel))}${scorable?1:0}0x${color}`),
                    playNote: (channel) =>
                        sendCommand('n' + new Array(4).fill('.').map((v, i) =>
                            i === channel ? (String.fromCharCode('b'.charCodeAt(0) + channel)) : '.'
                        ).join(''))
                    
                }) 
                
                resolve = null
            })            
        });

        port.on('error', e => {
            console.error(e)
            process.exit(-1)
        })
    
    })
}

module.exports = octopus
