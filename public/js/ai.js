function AI() {
  this.lines = [{}, {}];
  this.length = 70;
  this.colliding = false;
  this.turnSpeed = 0.06;
  this.reload = 0;

  this.show = function () {
    strokeWeight(1);
    stroke(255);
    line(this.lines[0].x1, this.lines[0].y1, this.lines[0].x2, this.lines[0].y2);
    line(this.lines[1].x1, this.lines[1].y1, this.lines[1].x2, this.lines[1].y2);

  }

  this.update = function () {
    tank.speed = 2;
    this.lines[0] = {
      x1: tank.pos.x,
      y1: tank.pos.y,
      x2: tank.pos.x + this.length * sin(tank.dir + PI / 6),
      y2: tank.pos.y - this.length * cos(tank.dir + PI / 6),
    };
    this.lines[1] = {
      x1: tank.pos.x,
      y1: tank.pos.y,
      x2: tank.pos.x + this.length * sin(tank.dir - PI / 6),
      y2: tank.pos.y - this.length * cos(tank.dir - PI / 6),
    };

    this.avoidWalls();


    tank.gun.useAiAim = true;
    this.shoot();
    this.reload--;
  }

  this.avoidWalls = function () {
    var hitRight = false;
    var hitLeft = false;
    var barriers = walls.slice();
    barriers.push({
      x1: 0,
      y1: 0,
      x2: 0,
      y2: height,
    })
    barriers.push({
      x1: 0,
      y1: 0,
      x2: width,
      y2: 0,
    })
    barriers.push({
      x1: width,
      y1: height,
      x2: 0,
      y2: height,
    })
    barriers.push({
      x1: width,
      y1: height,
      x2: width,
      y2: 0,
    })

    for (var i = 0; i < barriers.length; i++) {
      var w = barriers[i];
      if (collideLineLine(this.lines[0].x1, this.lines[0].y1, this.lines[0].x2, this.lines[0].y2, w.x1, w.y1, w.x2, w.y2)) {
        hitRight = true;
      }
      if (collideLineLine(this.lines[1].x1, this.lines[1].y1, this.lines[1].x2, this.lines[1].y2, w.x1, w.y1, w.x2, w.y2)) {
        hitLeft = true;
      }
    }

    if (this.colliding) {
      this.turn(-this.turnSpeed);
    } else if (hitLeft) {
      this.turn(this.turnSpeed);
    } else if (hitRight) {
      this.turn(-this.turnSpeed);
    } else {
      this.steerToTarget();
    }
  }

  this.turn = function (direction) {
    tank.dirVel = direction;
  }

  this.steerToTarget = function () {
    var target = this.getTarget();
    if (target == null) {
      return;
    }
    var x = target.x;
    var y = target.y;

    var targetDir;
    var currentDir = tank.dir;
    if ((y - tank.pos.y) < 0) {
      targetDir = -atan((x - tank.pos.x) / (y - tank.pos.y));
    } else {
      targetDir = PI - atan((x - tank.pos.x) / (y - tank.pos.y));
    }
    if (targetDir > tank.dir) {
      this.turn(this.turnSpeed);
    } else {
      this.turn(-this.turnSpeed);
    }


    return;
    var vel = targetDir - currentDir;
    if (vel > PI) {
      currentDir += TWO_PI;
    } else if (vel < -PI) {
      currentDir -= TWO_PI;
    }
    vel = targetDir - currentDir;
    vel = constrain(vel, -this.turnSpeed, this.turnSpeed);
    tank.dirVel = vel;
  }

  this.getTarget = function () {
    return (team.getClosestTank());
  }

  this.shoot = function () {
    if (this.reload <= 0) {
      this.reload = 2;
    } else {
      return;
    }
    var bulletData = {
      x: tank.pos.x + 20 * sin(tank.gunDir + tank.dir),
      y: tank.pos.y - 20 * cos(tank.gunDir + tank.dir),
      dir: tank.gunDir + tank.dir,
      type: 1,
      col: tank.colour,
      name: tank.name
    }
    bullets.push(new Bullet(bulletData.x, bulletData.y, bulletData.dir, bulletData.name, bulletData.type, bulletData.col));
    socket.emit('bullet', bulletData);
  }

}