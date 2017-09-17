const PORT = 5000;
// IMPORTS
var express = require('express');
var socket_io = require('socket.io');
var fs = require('fs');

//EXPRESS SERVER
var app = express();
var server = app.listen(PORT, function () {
  console.log('tanks 2.0 running on port ' + PORT);
});
app.use(express.static('public'));

// SOCKET.IO
io = socket_io(server);

// VARIABLES
var tanks = [];
var map = loadJSON('map');
var scores = loadJSON('scores');
var ammo = loadJSON('ammo');
var weapons = loadJSON('weapons');
var width = 1200;
var height = 1200;

setInterval(function () {
  for (var i = 0; i < tanks.length; i++) {
    io.to(tanks[i].id).emit('update', tanks);
  }
}, 38);

setInterval(function () {
  var coinCount = 0;

  for (var j = 0; j < weapons.length; j++) {
    if (weapons[j].type == "coin") {
      coinCount++;
    }
  }
  if (coinCount < 2) {
    if (Math.random() < 0.2) {
      var data = {
        type: "coin",
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        id: generateId()
      }
      for (var i = 0; i < tanks.length; i++) {
        io.to(tanks[i].id).emit("weapon", data);
      }
      weapons.push(data);
      saveJSON("weapons", weapons);
    }
  }
}, 1000);

setInterval(function () {
  io.sockets.emit('update-scores', scores);
}, 1000);

io.on('connection', function (socket) {

  socket.on('name', function (userName) {
    tanks.push({
      id: socket.id,
      x: 0,
      y: 0,
      dir: 0,
      gunDir: 0,
      col: "gold",
      paused: false,
      name: userName,
      health: 100
    });
    socket.emit('new_map', map);
    socket.emit('ammo', loadAmmo(userName));
    socket.emit('id', socket.id);
    socket.emit('weapons', weapons);
  });

  socket.on('sync', function (data) {
    for (var i = 0; i < tanks.length; i++) {
      if (tanks[i].id == data.id) {
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

  socket.on("flag_changed", function (data) {
    for (var i = 0; i < map.flags.length; i++) {
      if (map.flags[i].id == data.id) {
        map.flags[i].col = data.col;
      }
    }
    socket.broadcast.emit("flag_changed", map.flags);
    saveJSON('map', map);
  })

  socket.on('bullet', function (data) {
    socket.broadcast.emit('bullet', data);
  });

  socket.on('weapon', function (data) {
    socket.broadcast.emit('weapon', data);
    if (data.type == "landmine" || data.type == "healthPacket" || data.type == "gunner" || data.type == "bridge") {
      weapons.push(data);
    }
    if (data.type == "healthPacketRemove" || data.type == "landmineRemove" || data.type == "gunnerRemove" || data.type == "bridgeRemove" || data.type == "coinRemove") {
      for (var i = weapons.length - 1; i >= 0; i--) {
        if (weapons[i].id == data.id) {
          weapons.splice(i, 1);
        }
      }
    }
    saveJSON('weapons', weapons);
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
      if (deathData.killerName.charAt(deathData.killerName.length - 1) != '-' && deathData.killerName.charAt(1) != '-') {
        scores.push({
          name: deathData.killerName,
          won: 1,
          lost: 0
        });
      }
    }
    if (!foundVictimMatch) {
      if (deathData.victimName.charAt(deathData.victimName.length - 1) != '-' && deathData.victimName.charAt(1) != '-') {
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
      if (tanks[i].id == socket.id) {
        socket.broadcast.emit('remove', tanks[i].id);
        tanks.splice(i, 1);
      }
    }
  });
});

function saveAmmo(data) {
  for (var i = 0; i < ammo.length; i++) {
    if (data.name == ammo[i].name) {
      ammo[i].mine = data.mine;
      ammo[i].gunner = data.gunner;
      ammo[i].bridge = data.bridge;
      ammo[i].blast = data.blast;
      ammo[i].bomb = data.bomb;
      ammo[i].health = data.health;
      ammo[i].coins = data.coins;
    }
  }
  saveJSON('ammo', ammo);
}

function loadAmmo(name) {
  var hasFound = false;
  var returnObject;
  for (var i = 0; i < ammo.length; i++) {
    if (ammo[i].name == name) {
      returnObject = ammo[i]
      hasFound = true;
    }
  }
  if (!hasFound) {
    returnObject = {
      mine: 4,
      blast: 4,
      bomb: 4,
      gunner: 0,
      bridge: 0,
      health: 100,
      name: name,
      coins: 150,
    }
    if (name.charAt(name.length - 1) != '-' && name.charAt(1) != '-') {
      ammo.push(returnObject);
    }
  }
  return returnObject;
}

function saveJSON(filename, data) {
  dataToWrite = JSON.stringify(data);
  fs.writeFile('./data/' + filename + '.json', dataToWrite, function (err) {
    if (err) { return console.log(err); }
  });
}

function loadJSON(filename) {
  var object = JSON.parse(fs.readFileSync('./data/' + filename + '.json', 'utf8'));
  return object;
}



function generateId() {
  var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  var randomID = '';
  for (var i = 0; i < 100; i++) {
    randomID += letters[Math.floor(Math.random() * letters.length)];
  }
  return randomID;
}