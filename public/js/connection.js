var socket = io(window.location.href);

function onLoad() {
  setInterval(sync, 38);
  setInterval(syncAmmo, 1000);
  socket.emit('name', tank.name);
}

socket.on("update", function (tanks_array) {
  for (var i = 0; i < tanks_array.length; i++) {
    if(tanks[i] == null){
      var newTank = new EnemyTank();
      newTank.id = tanks_array[i].id;
      newTank.loadImages(tanks_array[i].col);
      if(tanks_array[i].name != tank.name){
        notify(tanks_array[i].name + ' joined the game', 130, tank.colour, width/2);
      }else{
        notify('connected succesfully as \'' + tank.name + "\'", 200, tank.colour, width/2);
      }
      tanks.push(newTank);
    }else{
      tanks[i].pos.x = tanks_array[i].x;
      tanks[i].pos.y = tanks_array[i].y;
      tanks[i].gunDir = tanks_array[i].gunDir;
      tanks[i].dir = tanks_array[i].dir;
      tanks[i].paused = tanks_array[i].paused;
      if(tanks[i].colour != tanks_array[i].col){
        tanks[i].loadImages(tanks_array[i].col);
      }
      tanks[i].name = tanks_array[i].name;
      tanks[i].health = tanks_array[i].health;
    }
  }
});

socket.on('id', function (id) {
  tank.id = id;
})

socket.on('new_map', function (data) {
  pause.mapEditor.newMap(data);
});

socket.on('bullet', function (bulletData) {
  bullets.push(new Bullet(bulletData.x, bulletData.y, bulletData.dir, bulletData.name, bulletData.type, bulletData.col));
});

socket.on('weapon', function (data) {
  tank.weaponManager.addWeapon(data);
});

socket.on('weapons', function (data) {
  for (var i = 0; i < data.length; i++) {
    tank.weaponManager.addWeapon(data[i]);
  }
})

socket.on('death', function (deathData) {
  gifExplosions.push(new GifExplosion(deathData.victimX, deathData.victimY));
  if(deathData.killerName == tank.name){
    tank.kill(deathData.victimName);
  }
});

socket.on('remove', function (id) {
  for (var i = tanks.length-1; i >= 0; i--) {
    if(tanks[i].id == id){
      notify(tanks[i].name + ' left the game', 130, tank.colour, width/2);
      tanks.splice(i, 1);
    }
  }
});

socket.on('ammo', function (data) {
  tank.weaponManager.landmineAmount = data.mine;
  tank.weaponManager.blastAmount = data.blast;
  tank.weaponManager.bombAmount = data.bomb;
  tank.health = data.health;
});

function sync() {
  var data = {
    x: tank.pos.x,
    y: tank.pos.y,
    dir: tank.dir,
    gunDir: tank.gunDir,
    id: tank.id,
    col: tank.colour,
    paused: pause.paused,
    health: tank.health,
    name: tank.name,
  }
  socket.emit('sync', data);
}

function syncAmmo() {
  var data = {
    mine: tank.weaponManager.landmineAmount,
    blast: tank.weaponManager.blastAmount,
    bomb: tank.weaponManager.bombAmount,
    health: tank.health,
    name: tank.name
  }
  socket.emit('ammoSync', data);
}

// FORCE REFRESH ALL USERS
function refresh() {
  socket.emit('refresh');
  window.location.reload(true);
}

socket.on('refresh', function () {
  window.location.reload(true);
})
