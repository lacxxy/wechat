const Koa = require('koa');
const app = new Koa();
const WebSocket = require('ws');
const ws = new WebSocket.Server({
    port: 5001,
    noServer: true
});
const userArr = {};
const connection = function (socket, request) {
    //console.log(ws._server._connections);
    socket.on('message', function (msg) {
        const id = (JSON.parse(msg)).connect;
        userArr[id] = socket;
    });
    socket.on('disconnect', function () {
        ws.emit('user disconnected');
    });
};
module.exports = {
    ws: ws,
    app: app,
    connection: connection,
    userArr:userArr
};