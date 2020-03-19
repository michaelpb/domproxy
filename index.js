const express = require('express');
const app = express();
const http = require('http');
const {makeRequest} = require('./lib/httphelper');
const Client = require('./lib/Client');
const httpServer = http.createServer(app);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/tests/testsite.html');
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
        console.log('last patches',
          JSON.stringify(client.latestPatch, null, 4));
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



