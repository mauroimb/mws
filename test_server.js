const WebSocket = require('./check.js');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('new connection', ws)
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    //ws.send('something');

    ws.on('ping', function (data) { console.log('ping', data.toString()) })
    ws.on('pong', function (data) { console.log('pong', data.toString()) })

    setTimeout(function () {
        ws.ping()
    }, 1000)

});