const PORT = 3333;
// IMPORTS
var express = require('express');
var socket_io = require('socket.io');
var fs = require('fs');

//EXPRESS SERVER
var app = express();
var server = app.listen(PORT);
app.use(express.static('public'));

// SOCKET.IO
io = socket_io(server);

// VARIABLES
var tanks = [];
var map = [];

setInterval(function () {
  for (var i = 0; i < tanks.length; i++) {
    io.to(tanks[i].id).emit('update', tanks);
  }
}, 38);

io.on('connection', function (socket) {
  tanks.push({
    id:socket.id,
    x:0,
    y:0,
    dir:0,
    gunDir:0,
    col: "yellow",
    paused: false,
    name: 'anonym',
    health: 100
  });
  socket.emit("initial-update", socket.id);
  socket.emit('new_map', map);

  socket.on('sync', function (data) {
    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id == data.id){
        tanks[i].x = data.x;
        tanks[i].y = data.y;
        tanks[i].dir = data.dir;
        tanks[i].gunDir = data.gunDir;
        tanks[i].col = data.col;
        tanks[i].paused = data.paused;
        tanks[i].health = data.health;
        tanks[i].name = data.name;
      }
    }
  });

  socket.on('new_map', function (data) {
    map = data;
    socket.broadcast.emit('new_map', map);
  });

  socket.on('bullet', function (data) {
    socket.broadcast.emit('bullet', data);
  });

  socket.on('weapon', function (data) {
    socket.broadcast.emit('weapon', data);
  });

  socket.on('death', function (deathData) {
    socket.broadcast.emit('death', deathData);
  });

  socket.on('refresh', function () {
    socket.broadcast.emit('refresh');
  })

  socket.on('disconnect', function () {
    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id == socket.id){
        socket.broadcast.emit('remove', tanks[i].id);
        tanks.splice(i, 1);
      }
    }
  });
})
