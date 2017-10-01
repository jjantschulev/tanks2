function Bomb(x, y, owner) {
  this.x = x;
  this.y = y;
  this.r = 10;

  this.timer = 80;

  this.owner = owner;

  this.show = function() {
    fill(tank.weaponManager.bombColour);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
    noFill();
    stroke(255, 100, 0);
    strokeWeight(1);
    arc(this.x, this.y, this.r, this.r, 0, map(this.timer, 0, 150, 0, TWO_PI));
  };

  this.update = function() {
    this.timer--;
    if (this.timer <= 0) {
      this.explode();
      tank.weaponManager.bombs.splice(
        tank.weaponManager.bombs.indexOf(this),
        1
      );
    }
  };

  this.explode = function() {
    var distance = dist(tank.pos.x, tank.pos.y, this.x, this.y);
    if (distance < 100) {
      tank.removeHealth(100 - distance);
      tank.weaponManager.pushTank(this.x, this.y, 100);
      tank.checkDeath(this.owner);
    }
    for (var i = tank.weaponManager.bridges.length - 1; i >= 0; i--) {
      var b = tank.weaponManager.bridges[i];
      var distToBridge = dist(
        this.x,
        this.y,
        tank.weaponManager.bridges[i].x,
        tank.weaponManager.bridges[i].y
      );
      if (distToBridge < 200) {
        tank.weaponManager.bridges[i].health -= 200 - distToBridge;
        tank.weaponManager.bridges[i].checkDeath();
      }
    }
    for (var i = tank.weaponManager.healthBeacons.length - 1; i >= 0; i--) {
      var b = tank.weaponManager.healthBeacons[i];
      var distToBridge = dist(
        this.x,
        this.y,
        tank.weaponManager.healthBeacons[i].x,
        tank.weaponManager.healthBeacons[i].y
      );
      if (distToBridge < 200) {
        tank.weaponManager.healthBeacons[i].health -= 200 - distToBridge;
        tank.weaponManager.healthBeacons[i].checkDeath();
      }
    }
    for (var i = tank.weaponManager.landmines.length - 1; i >= 0; i--) {
      var d = dist(
        tank.weaponManager.landmines[i].x,
        tank.weaponManager.landmines[i].y,
        this.x,
        this.y
      );
      if (d < 100) {
        var data = {
          type: 'landmineRemove',
          id: tank.weaponManager.landmines[i].id
        };
        socket.emit('weapon', data);
        tank.weaponManager.landmines[i].explode();
      }
    }
    explosions.push(
      new Explosion(this.x, this.y, 200, tank.weaponManager.bombColour, 50)
    );
  };
}
