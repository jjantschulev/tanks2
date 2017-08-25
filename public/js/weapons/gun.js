function Gun() {
  this.type = 1;
  this.reload1 = 0;
  this.reload2 = 0;
  this.trackMouseActive = true;
  this.useAiAim = false;

  this.shoot = function (mode) {
    var bulletType = this.type;
    if(mode != undefined){
      bulletType = mode;
    }
    if(this.reload1 <= 0 && bulletType == 1){
      this.reload1 = 6;
    } else if(this.reload2 <= 0 && bulletType == 2){
      this.reload2 = 120;
    }else{
      return;
    }
    var bulletData = {
      x: tank.pos.x + 20*sin(tank.gunDir+tank.dir),
      y: tank.pos.y - 20*cos(tank.gunDir+tank.dir),
      dir: tank.gunDir + tank.dir,
      type: bulletType,
      col: tank.colour,
      name: tank.name
    }
    bullets.push(new Bullet(bulletData.x, bulletData.y, bulletData.dir, bulletData.name, bulletData.type, bulletData.col));
    socket.emit('bullet', bulletData);

    // Recoil effect
    if(this.type > 1){
      tank.pos.x -= bulletType**2*sin(tank.gunDir+tank.dir);
      tank.pos.y += bulletType**2*cos(tank.gunDir+tank.dir);
    }
  }

  this.update = function () {
    this.reload1 --;
    this.reload2 --;

    if(this.trackMouseActive){
      this.trackMouse();
    }
    if(this.useAiAim && tank.name == 'Jordan'){
      this.aiAim();
    }
  }

  this.toggleType = function () {
    if(this.type == 1){
      this.type = 2;
    }else if (this.type == 2) {
      this.type = 1;
    }
    notify(this.type, 60, color(150), 40);
  }

  this.toggleTrackMouse = function () {
    if(this.trackMouseActive){
      this.trackMouseActive = false;
      tank.gunDir = 0;
      notify('Tracking mouse disabled', 80, color(150), width/2);
    }else{
      this.trackMouseActive = true;
      notify('Tracking mouse enabled', 80, color(150), width/2);
    }
  }

  this.trackMouse = function () {
    this.trackPoint(view.getRealMousePoints().x, view.getRealMousePoints().y);

    if (mouseIsPressed && !pause.paused) {
      if(mouseButton == LEFT) {
        this.shoot(1);
      }else if (mouseButton == RIGHT) {
        this.shoot(2);
      }
    }
  }


  this.showReloadTimers = function () {
    if(this.reload2 > 0){
      fill(150);
      noStroke();
      rectMode(CENTER);
      rect(0, -25, map(this.reload2, 0, 120, 0, 25), 1.4);
    }
  }

  this.trackPoint = function (x, y) {
    var targetDir;
    var currentDir = tank.gunDir;
    if((y - tank.pos.y) < 0){
      targetDir = -atan((x - tank.pos.x)/(y - tank.pos.y)) - tank.dir;
    }else {
      targetDir = PI-atan((x - tank.pos.x)/(y - tank.pos.y)) - tank.dir;
    }

    var vel = targetDir - currentDir;
    if (vel > PI) {
      currentDir += TWO_PI;
    }else if (vel < -PI) {
      currentDir -= TWO_PI;
    }
    vel = targetDir - currentDir;
    vel = constrain(vel, -0.05, 0.05);
    tank.gunDirVel = vel;
    // tank.gunDir = targetDir; // instant lock on mousePos
  }

  this.toggleAi = function() {
    if (this.useAiAim) {
      this.useAiAim = false;
    } else {
      this.useAiAim = true;
    }
  }

  this.aiAim = function () {
    var closestTank = null;
    var distanceToTank = Infinity;
    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id != tank.id && tanks[i].colour != tank.colour && !tanks[i].paused){
        var distance = dist(tanks[i].pos.x, tanks[i].pos.y, tank.pos.x, tank.pos.y);
        if (distance < distanceToTank) {
          distanceToTank = distance;
          closestTank = {
            x: tanks[i].pos.x,
            y: tanks[i].pos.y
          }
        }
      }
    }

    for (var i = 0; i < tank.weaponManager.gunners.length; i++) {
      if(tank.weaponManager.gunners[i].colour != tank.colour){
        var distance = dist(tank.weaponManager.gunners[i].x, tank.weaponManager.gunners[i].y, tank.pos.x, tank.pos.y);
        if (distance < distanceToTank) {
          distanceToTank = distance;
          closestTank = {
            x: tank.weaponManager.gunners[i].x,
            y: tank.weaponManager.gunners[i].y
          }        
        }
      }
    }    
    if (closestTank != null) {
      this.trackPoint(closestTank.x, closestTank.y);
    }
  }
}