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
var map = loadJSON('map');
var scores = loadJSON('scores');
var ammo = loadJSON('ammo');


setInterval(function () {
  for (var i = 0; i < tanks.length; i++) {
    io.to(tanks[i].id).emit('update', tanks);
  }
}, 38);

setInterval(function () {
  io.sockets.emit('update-scores', scores);
}, 1000);

io.on('connection', function (socket) {

  socket.on('name', function (userName) {
    socket.emit('new_map', map);
    socket.emit('ammo', loadAmmo(userName));
    socket.emit('id', socket.id);

    tanks.push({
      id: socket.id,
      x:0,
      y:0,
      dir:0,
      gunDir:0,
      col: "yellow",
      paused: false,
      name: userName,
      health: 100
    });

  });

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
    saveJSON('map', map);
  });

  socket.on('bullet', function (data) {
    socket.broadcast.emit('bullet', data);
  });

  socket.on('weapon', function (data) {
    socket.broadcast.emit('weapon', data);
  });

  socket.on('death', function (deathData) {
    socket.broadcast.emit('death', deathData);

    var foundKillerMatch = false;
    var foundVictimMatch = false;

    for (var i = 0; i < scores.length; i++) {
      if (scores[i].name == deathData.killerName) {
        scores[i].won += 1;
        foundKillerMatch = true;
      }
      if (scores[i].name == deathData.victimName) {
        scores[i].lost += 1;
        foundVictimMatch = true;
      }
    }

    if (!foundKillerMatch) {
      if (deathData.killerName.charAt(deathData.killerName.length-1) != '-' && deathData.killerName.charAt(1) != '-') {
        scores.push({
          name: deathData.killerName,
          won: 1,
          lost: 0
        });
      }
    }
    if (!foundVictimMatch) {
      if (deathData.victimName.charAt(deathData.victimName.length-1) != '-' && deathData.victimName.charAt(1) != '-') {
        scores.push({
          name: deathData.victimName,
          won: 0,
          lost: 1
        });
      }
    }
    saveJSON('scores', scores);
  });

  socket.on('ammoSync', function (data) {
    saveAmmo(data);
  });

  socket.on('refresh', function () {
    socket.broadcast.emit('refresh');
  });

  socket.on('disconnect', function () {
    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id == socket.id){
        socket.broadcast.emit('remove', tanks[i].id);
        tanks.splice(i, 1);
      }
    }
  });
})

function saveAmmo(data) {
  for (var i = 0; i < ammo.length; i++) {
    if (data.name == ammo[i].name) {
      ammo[i].mine = data.mine;
      ammo[i].blast = data.blast;
      ammo[i].bomb = data.bomb;
    }
  }
  saveJSON('ammo', ammo);
}

function loadAmmo(name) {
  var hasFound = false;
  var returnObject;
  for (var i = 0; i < ammo.length; i++) {
    if(ammo[i].name == name){
      returnObject = ammo[i]
      hasFound = true;
    }
  }
  if(!hasFound){
    returnObject = {
      mine: 4,
      blast: 4,
      bomb: 4,
      name: name,
    }
    if (name.charAt(name.length-1) != '-' && name.charAt(1) != '-') {
      ammo.push(returnObject);
    }
  }
  return returnObject;
}

function saveJSON(filename, data) {
  dataToWrite = JSON.stringify(data);
  fs.writeFile('./data/'+filename+'.json', dataToWrite, function(err) {
    if(err){return console.log(err);}
  });
}

function loadJSON(filename) {
  var object = JSON.parse(fs.readFileSync('./data/'+filename+'.json', 'utf8'));
  return object;
}
