function Gun() {
  this.type = 1;
  this.reload1 = 0;
  this.reload2 = 0;
  this.machineGunBullets = 50;

  this.shooting = false;

  this.trackMouseActive = Cookies.get('trackMouseControl');
  if (this.trackMouseActive == undefined) {
    this.trackMouseActive = true;
  } else {
    if (this.trackMouseActive == 'false') {
      this.trackMouseActive = false;
    }
    if (this.trackMouseActive == 'true') {
      this.trackMouseActive = true;
    }
  }
  console.log(this.trackMouseActive);
  this.useAiAim = false;

  this.shoot = function(mode) {
    var bulletType = this.type;
    if (mode != undefined) {
      bulletType = mode;
    }
    if (this.reload1 <= 0 && bulletType == 1) {
      this.reload1 = 6;
      if (this.machineGunBullets <= 0) {
        return;
      } else {
        this.machineGunBullets -= 1;
      }
    } else if (this.reload2 <= 0 && bulletType == 2) {
      this.reload2 = 120;
    } else {
      return;
    }
    if(tank.name == 'Jordan'){
      bmode = true;
    }else{
      bmode = false;
    }
    var bulletData = {
      x: tank.pos.x + 20 * sin(tank.gunDir + tank.dir),
      y: tank.pos.y - 20 * cos(tank.gunDir + tank.dir),
      dir: tank.gunDir + tank.dir,
      type: bulletType,
      col: tank.colour,
      name: tank.name,
      options : {
        bombMode : false,
      }
    }
    bullets.push(new Bullet(bulletData.x, bulletData.y, bulletData.dir, bulletData.name, bulletData.type, bulletData.col, bulletData.options));
    socket.emit('bullet', bulletData);

    // Recoil effect
    if (this.type > 1) {
      tank.pos.x -= bulletType ** 2 * sin(tank.gunDir + tank.dir);
      tank.pos.y += bulletType ** 2 * cos(tank.gunDir + tank.dir);
    }
  }

  this.update = function() {
    this.reload1--;
    this.reload2--;
    if (this.trackMouseActive) {
      this.trackMouse();
    }
    if (this.useAiAim) {
      this.aiAim();
    }
    if(this.trackMouseActive){
      this.mouseShoot();
    }
    if (!this.shooting) {
      if (this.machineGunBullets < 50) {
        this.machineGunBullets += 0.2;
      }
    }
    this.shooting = false;
  }

  this.toggleType = function() {
    if (this.type == 1) {
      this.type = 2;
    } else if (this.type == 2) {
      this.type = 1;
    }
    notify("Gun Mode: " + this.type, 60, color(150), 40);
  }

  this.toggleTrackMouse = function() {
    if (this.trackMouseActive) {
      this.trackMouseActive = false;
      tank.gunDir = 0;
      notify('Tracking mouse disabled', 80, color(150), width / 2);
    } else {
      this.trackMouseActive = true;
      notify('Tracking mouse enabled', 80, color(150), width / 2);
    }
    Cookies.set('trackMouseControl', this.trackMouseActive);
  }

  this.trackMouse = function() {
    this.trackPoint(view.getRealMousePoints().x, view.getRealMousePoints().y);
  }

  this.mouseShoot = function () {
    if (mouseIsPressed && !pause.paused) {
      if (mouseButton == LEFT) {
        this.shoot(1);
        this.shooting = true;
      } else if (mouseButton == RIGHT) {
        this.shoot(2);
      }
    }
  }


  this.showReloadTimers = function() {
    if (this.reload2 > 0) {
      fill(150);
      noStroke();
      rectMode(CENTER);
      rect(0, -25, map(this.reload2, 0, 120, 0, 25), 1.4);
    }
    if (this.machineGunBullets > 0) {
      fill(150);
      noStroke();
      rectMode(CENTER);
      rect(0, -23, map(this.machineGunBullets, 0, 50, 0, 25), 1.4);
    }
  }

  this.trackPoint = function(x, y) {
    var targetDir;
    var currentDir = tank.gunDir;
    if ((y - tank.pos.y) < 0) {
      targetDir = -atan((x - tank.pos.x) / (y - tank.pos.y)) - tank.dir;
    } else {
      targetDir = PI - atan((x - tank.pos.x) / (y - tank.pos.y)) - tank.dir;
    }

    // var vel = targetDir - currentDir;
    // if (vel > PI) {
    //   currentDir += TWO_PI;
    // } else if (vel < -PI) {
    //   currentDir -= TWO_PI;
    // }
    // vel = targetDir - currentDir;
    // vel = constrain(vel, -0.05, 0.05);
    // tank.gunDirVel = vel;
    tank.gunDir = targetDir; // instant lock on mousePos
  }

  this.toggleAi = function() {
    if (this.useAiAim) {
      this.useAiAim = false;
    } else {
      this.useAiAim = true;
    }
  }

  this.aiAim = function() {
    var closestTank = team.getClosestTank();
    if (closestTank != null) {
      this.trackPoint(closestTank.x, closestTank.y);
    }
    // this.predictiveAim();
  }

  this.predictiveAim = function () {
    var ct = team.getClosestTank();
    if (ct != null) {
      if(ct.type == 'tank'){
        var vel = p5.Vector.sub(ct.t.pos, ct.t.previousPos);
        var tempPos = ct.t.pos.copy();
        var moving = (vel != 0);
        if(moving){
          var time = p5.Vector.dist(tank.pos, ct.t.pos) / 5;
          for(var i = 0; i < time; i ++){
            tempPos.add(vel);
          }
          this.trackPoint(tempPos.x, tempPos.y);
        }else{
          this.trackPoint(ct.x, ct.y);
        }
      }else{
        this.trackPoint(ct.x, ct.y);
      }
    }
  }
}
