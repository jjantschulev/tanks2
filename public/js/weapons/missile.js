function Missile(x, y, dir, owner, fuel, col, range) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(cos(dir), sin(dir));
  this.acc.mult(0.5);
  this.fuel = fuel * 1.5;
  this.timer = fuel * 4 * 1.5;
  this.owner = owner;
  this.colour = col;
  this.image = loadImage("./assets/" + this.colour + "_rocket.png");
  this.range = range;

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
    var distance = dist(tank.pos.x, tank.pos.y, this.pos.x, this.pos.y);
    if (distance < this.range) {
      if (distance < this.range - 110) {
        tank.removeHealth(110);
      } else {
        tank.removeHealth(this.range - distance);
      }
      tank.weaponManager.pushTank(this.pos.x, this.pos.y, this.range);
      tank.checkDeath(this.owner);
    }
    for (var i = tank.weaponManager.bridges.length - 1; i >= 0; i--) {
      var b = tank.weaponManager.bridges[i];
      var distToBridge = dist(this.pos.x, this.pos.y, tank.weaponManager.bridges[i].x, tank.weaponManager.bridges[i].y);
      if (distToBridge < this.range) {
        if (distToBridge < this.range - 110) {
          tank.weaponManager.bridges[i].health -= 300;
        } else {
          tank.weaponManager.bridges[i].health -= this.range * 2 - distToBridge * 2;
        }
        tank.weaponManager.bridges[i].checkDeath();
      }
    }
    for (var i = tank.weaponManager.landmines.length - 1; i >= 0; i--) {
      var d = dist(tank.weaponManager.landmines[i].x, tank.weaponManager.landmines[i].y, this.pos.x, this.pos.y);
      if (d < this.range) {
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
    }, 1200);
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

