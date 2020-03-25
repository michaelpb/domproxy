const express = require('express');
const app = express();
const http = require('http');
const Client = require('./lib/Client');
const httpServer = http.createServer(app);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/tests/testsite.html');
});


app.get('/-scripts/main.js', function(req, res){
  res.sendFile(__dirname + '/client/main.js');
});


app.get('/-scripts/virtual-dom.js', function(req, res){
  res.sendFile(__dirname + '/node_modules/virtual-dom/dist/virtual-dom.js');
});

app.get('/-scripts/vdomserialize.js', function(req, res){
  res.sendFile(__dirname + '/lib/vdomserialize.js');
});

const io = require('socket.io')(httpServer);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  let client = null;

  socket.on('ready', (initialHtml) => {
    client = new Client(initialHtml);
    setTimeout(() => {
      client.sendRequest(() => {
        /*
        console.log('last patches',
          JSON.stringify(client.latestPatch, null, 4));
        */
        const payload = {
          patch: client.latestPatch,
          // Hack, send over initial vdom also
          initial: client.initialVdom,
        };
        socket.emit('response', JSON.stringify(payload));
      });
    }, 10);
  });

  socket.on('request', function(msg){
    const parsed = JSON.parse(msg);
    const {path, method, headers} = parsed;
    client.sendRequest();
  });
});

httpServer.listen(3000, function(){
  console.log('listening on *:3000');
});



