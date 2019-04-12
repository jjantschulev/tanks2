function Gunner(x, y, colour, name, id) {
  this.x = x;
  this.y = y;
  this.colour = colour;
  this.image = loadImage("./assets/" + this.colour + "_gunner.png")
  this.owner = name;
  this.id = id;
  this.health = 120;
  this.range = 400;
  this.w = 30;
  this.h = 30;

  this.dir = 0;

  this.reload = 0;

  this.update = function () {
    this.reload--;
    this.trackTank();
  }

  this.show = function () {
    push();
    translate(this.x, this.y);

    imageMode(CENTER);
    image(this.image, 0, 0, this.w, this.h);

    //show health circle:
    noFill();
    stroke(150, 180);
    strokeWeight(2);
    arc(0, 0, this.w, this.h, 0, map(this.health, 0, 120, 0, TWO_PI));
    // ellipse(0, 0, this.range*2, this.range*2);

    // show gun
    rotate(this.dir);
    fill(this.colour);
    noStroke();
    ellipse(0, 0, 10, 10);
    rectMode(CENTER);
    rect(0, -10, 3, 20, 100);
    pop();
  }

  this.shoot = function () {
    if (this.reload <= 0) {
      this.reload = 6;
    } else {
      return;
    }
    var bulletData = {
      x: this.x + 20 * sin(this.dir),
      y: this.y - 20 * cos(this.dir),
      dir: this.dir,
      type: 1,
      col: this.colour,
      name: this.colour + "_gunner"
    }
    bullets.push(new Bullet(bulletData.x, bulletData.y, bulletData.dir, bulletData.name, bulletData.type, bulletData.col));
    // socket.emit('bullet', bulletData);
  }

  this.trackTank = function () {
    var closestTank = this.getClosestTank();
    var ct = {x:0,y:0}
    if (closestTank == null) {
      if (this.health < 120 - 0.08) {
        this.health += 0.04;
      }
      return;
    }else{
      if(closestTank.type == 'tank'){
        var vel = p5.Vector.sub(closestTank.t.pos, closestTank.t.previousPos);
        var tempPos = closestTank.t.pos.copy();
        var moving = (vel != 0);
        if(moving){
          var time = dist(this.x, this.y, closestTank.t.pos.x, closestTank.t.pos.y) / 10;
          for(var i = 0; i < time; i ++){
            tempPos.add(vel);
          }
          ct.x = tempPos.x;
          ct.y = tempPos.y;

        }else{
          ct.x = closestTank.x;
          ct.y = closestTank.y;
        }
      }else{
        ct.x = closestTank.x;
        ct.y = closestTank.y;
      }
    }

    var targetDir;
    var currentDir = this.dir;
    if ((ct.y - this.y) < 0) {
      targetDir = -atan((ct.x - this.x) / (ct.y - this.y));
    } else {
      targetDir = PI - atan((ct.x - this.x) / (ct.y - this.y));
    }

    var vel = targetDir - currentDir;
    if (vel > PI) {
      currentDir += TWO_PI;
    } else if (vel < -PI) {
      currentDir -= TWO_PI;
    }
    vel = targetDir - currentDir;
    vel = constrain(vel, -0.05, 0.05);
    this.dir += vel;

    this.shoot();
  }

  this.getClosestTank = function () {
    var distance = this.range;
    var closestEnemy = null;
    for (var i = 0; i < tanks.length; i++) {
      if (tanks[i].colour != this.colour && tanks[i].name != this.owner && !tanks[i].paused) {
        var newDist = dist(this.x, this.y, tanks[i].pos.x, tanks[i].pos.y);
        if (newDist < distance) {
          distance = newDist;
          closestEnemy = {
            x: tanks[i].pos.x,
            y: tanks[i].pos.y,
            type: 'tank',
            t: tanks[i],
          };
        }
      }
    }
    for (var i = tank.weaponManager.gunners.length - 1; i >= 0; i--) {
      if (tank.weaponManager.gunners[i].colour != this.colour && this.id != tank.weaponManager.gunners[i].id) {
        var newDist = dist(this.x, this.y, tank.weaponManager.gunners[i].x, tank.weaponManager.gunners[i].y);
        if (newDist < distance) {
          distance = newDist;
          closestEnemy = {
            x: tank.weaponManager.gunners[i].x,
            y: tank.weaponManager.gunners[i].y,
            type : 'gunner',
            g: tank.weaponManager.gunners[i],
          };
        }
      }
    }
    if (closestEnemy != null) {
      return closestEnemy;
    } else {
      return null;
    }
  }

  this.hitByBullet = function (b) {
    if (b.col != this.colour) {
      this.health -= b.damage;
      if (this.health <= 0) {
        if (b.name == tank.name) {
          tank.health += 30;
          tank.coins += 40;
          notify("You destoyed " + this.owner + "'s gunner", 150, this.colour, width - width / 3)
        }
        this.remove();
      }
      return true;
    }
  }

  this.remove = function () {
    var data = {
      id: this.id,
      type: "gunnerRemove",
    }
    socket.emit('weapon', data);
    particleEffects.push(new ParticleEffect(this.x, this.y, this.colour));
    tank.weaponManager.gunners.splice(tank.weaponManager.gunners.indexOf(this), 1);
  }

  this.place = function () {
    var inRange = false;
    // for (var i = tank.weaponManager.gunners.length - 1; i >= 0; i--) {
      // if (dist(tank.weaponManager.gunners[i].x, tank.weaponManager.gunners[i].y, this.x, this.y) < 100) {
    //     inRange = true;
    //   }
    // }

    if (!inRange) {
      return true;
    } else {
      notify('too close to other gunner!', 100, tank.colour, width);
      return false;
    }
  }

  this.pickUp = function () {
    if (this.owner == tank.name && this.colour == tank.colour) {
      var coinAmount = map(this.health, 0, 120, 0, tank.weaponManager.gunnerPrice);
      tank.coins += coinAmount;
      notify("picked up gunner with " + Math.round(coinAmount) + " coins", 150, this.colour, width);

      var data = {
        id: this.id,
        type: "gunnerRemove",
      }
      socket.emit('weapon', data);
      particleEffects.push(new ParticleEffect(this.x, this.y, this.colour));
      tank.weaponManager.gunners.splice(tank.weaponManager.gunners.indexOf(this), 1);
      return;
    }
  }
}

function removeAllGunners() {
  for(var i = tank.weaponManager.gunners.length -1; i >= 0; i --){
    tank.weaponManager.gunners[i].remove();
  }
}
