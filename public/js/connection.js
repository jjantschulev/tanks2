var socket = io(window.location.href);

setInterval(sync, 38);
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

socket.on("initial-update", function (id) {
  setTimeout(function () {
    tank.id = id
  }, 100);
})

socket.on("update", function (tanks_array) {
  for (var i = 0; i < tanks_array.length; i++) {
    if(tanks[i] == null){
      var newTank = new EnemyTank();
      newTank.id = tanks_array[i].id;
      newTank.loadImages(tanks_array[i].col);
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

socket.on('new_map', function (data) {
  pause.mapEditor.newMap(data);
});

socket.on('bullet', function (bulletData) {
  bullets.push(new Bullet(bulletData.x, bulletData.y, bulletData.dir, bulletData.name, bulletData.type, bulletData.col));
});

socket.on('weapon', function (data) {
  tank.weaponManager.dropWeapon(data);
})

socket.on('death', function (deathData) {
  gifExplosions.push(new GifExplosion(deathData.victimX, deathData.victimY));
  if(deathData.killerName == tank.name){
    tank.kill();
  }
});

socket.on('remove', function (id) {
  for (var i = tanks.length-1; i >= 0; i--) {
    if(tanks[i].id == id){
      tanks.splice(i, 1);
    }
  }
});

function refresh() {
  socket.emit('refresh');
  window.location.reload(true);
}

socket.on('refresh', function () {
  window.location.reload(true);
})
