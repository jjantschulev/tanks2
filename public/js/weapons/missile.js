function Missile(x, y, dir, owner, fuel, col) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(cos(dir), sin(dir));
  this.fuel = fuel;
  this.timer = fuel * 4;
  this.owner = owner;
  this.colour = col;
  this.image = loadImage("./assets/" + this.colour + "_rocket.png");


  this.update = function () {
    if (this.fuel >= 0) {
      this.vel.add(this.acc);
    } else {
      this.vel.mult(0.99);
    }
    this.pos.add(this.vel);
    this.fuel--;
    this.timer--;
    if (this.timer <= 0) {
      this.explode();
      tank.weaponManager.missiles.splice(tank.weaponManager.missiles.indexOf(this), 1);
    }
  }

  this.explode = function () {
    var range = 300;
    var distance = dist(tank.pos.x, tank.pos.y, this.pos.x, this.pos.y);
    if (distance < range) {
      tank.removeHealth(range - distance);
      tank.weaponManager.pushTank(this.pos.x, this.pos.y, range);
      tank.checkDeath(this.owner);
    }
    for (var i = tank.weaponManager.bridges.length - 1; i >= 0; i--) {
      var b = tank.weaponManager.bridges[i];
      var distToBridge = dist(this.pos.x, this.pos.y, tank.weaponManager.bridges[i].x, tank.weaponManager.bridges[i].y);
      if (distToBridge < range) {
        tank.weaponManager.bridges[i].health -= range - distToBridge;
        tank.weaponManager.bridges[i].checkDeath();
      }
    }
    for (var i = tank.weaponManager.landmines.length - 1; i >= 0; i--) {
      var d = dist(tank.weaponManager.landmines[i].x, tank.weaponManager.landmines[i].y, this.pos.x, this.pos.y);
      if (d < range) {
        var data = {
          type: 'landmineRemove',
          id: tank.weaponManager.landmines[i].id,
        }
        socket.emit('weapon', data);
        tank.weaponManager.landmines[i].explode();
      }
    }
    explosions.push(new Explosion(this.pos.x, this.pos.y, 500, tank.weaponManager.missileColour, 60));
    setTimeout(function () {
      view.object = tank.pos;
      console.log("view reset");
    }, 1000);
  }

  this.show = function () {
    noStroke();
    fill(this.colour);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.acc.heading() + PI / 2);
    image(this.image, 0, 0, 30, 30);
    pop();
  }
}

function showMissileStrength() {
  if (tank.weaponManager.missileStrength > 12) {
    var h = map(tank.weaponManager.missileStrength, 12, 25, 0, height);
    if (tank.weaponManager.missileStrength > 25) {
      fill(255, 0, 0);
    } else {
      fill(tank.weaponManager.missileColour);
    }
    noStroke();
    rect(width - 20, 0, 20, h);
  }
}

