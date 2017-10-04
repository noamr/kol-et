const path = require('path')
const playSong = require('./playSong')
const wait = millis => new Promise(resolve => setTimeout(resolve, millis))
const DELAY = 750
const COLORS = ['090909', 'DD0000', '00DD00', '0000DD',  '00EE55']
const input = require('./songs.json')
const VAMP = 10000
const colorString = require('color-string')


async function game() {   
    try {
        const songs = input.songs
        const delay = input.delay || DELAY
        const vamp = input.vamp || VAMP
        const colors = input.colors || COLORS
        const playBeats = !!input.playBeats
        const acceptanceWindow = input.acceptanceWindow || 15
        const goalColor = input.goalColor || '102000'
        const scoreColor = input.scoreColor || '100008'
        const gamePath = p => path.resolve(__dirname, input.gamePath, p)
        function song(row) {
            if (typeof(row) == 'string') {
                row = [`${row}/${row}.mp3`, `${row}/${row}.mid`]
            }
            return {midiFile: gamePath(row[1]), audioFile: gamePath(row[0]), playBeats, delay, colors, acceptanceWindow, scoreColor, goalColor}
        }
        
        for (var i = 0; i < songs.length; ++i) {
            var s = song(songs[i]);
            console.log(s)
            await playSong(s)
            wait(VAMP)
        } 
    } catch (e) {
        console.error(e)
    }
}

game()