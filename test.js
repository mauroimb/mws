//let url = 'wss://stream.binance.com:9443/stream'
let url = 'ws://localhost:8080'

const Ws = require('./main.js')

const m = require('../m/main.js')
const ws = new Ws(url)

m.command('close', function () {
    ws.close()
})
m.command('stop', function () {
    ws.stop()
})

m.start()

url = 'ws://localhost:8080'
//console.log('readyState', ws.readyState)

ws.check(1000, 2000, true)
ws.interval = 1000

ws.connect()

ws.on('state', function (state) {
    console.log('STATE CHANGE', state.previous + '    ==>     ' + state.current)
    // if (state.current == 'disconnected') ws.connect()

})

ws.on('open', function (...args) {
    console.log('open', ...args)
    //console.log('readyState', ws.readyState, 'protocol', ws.protocol, ws.url, ws.bufferedamount)

    // ws.ping(function (...args) { console.log('mandato ping', ...args) })
    // console.log('closing')
    // ws.close()
    // ws.terminate()
    // console.log('readyState', ws.readyState)
})

ws.on('close', function (...args) {
    console.log('close', ...args)
    //console.log('readyState', ws.readyState)

})
ws.on('error', function (...args) {
    console.log('error', ...args)
    //  console.log('readyState', ws.readyState)

})


ws.on('knock', function () {
    console.log('knock')
})

ws.on('lost', function () {
    console.log('lost')
    // ws.close()
})


ws.on('pong', function () {
    console.log('pong')
})