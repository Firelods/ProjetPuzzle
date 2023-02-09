// server.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//keep track of how times clients have clicked the button
var clickCount = 0;

app.use(express.static(__dirname + '/'));
//redirect / to our index.html file
app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (client) {
  //when the server receives clicked message, do this
  console.log('Client connected...');
  client.on('movePiece', function (data) {
    clickCount++;
    console.log(data);
    //send a message to ALL connected clients
    console.log('clickCount: ' + clickCount);
    io.emit('buttonUpdate', clickCount);
  });
  client.on('mousemove', function (data) {
    // send a message to ALL connected clients
    io.emit('moving', { position: data, name: client.id });
  });
});

// save users that are connected
var users = [];


//start our web server and socket.io server listening
server.listen(3001, function () {
  console.log('listening on *:3001');
}); 