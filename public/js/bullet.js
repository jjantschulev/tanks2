var bullets = [];

function showBullets() {
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].show();
    bullets[i].update();
  }
}

function Bullet(x, y, dir, name, type, col) {
  this.x = x;
  this.y = y;
  this.dir = dir;
  this.name = name;
  this.col = col;
  this.type = type;
  this.speed = 5;
  if(type == 1){
    this.r = 4;
    this.damage = 2.5;
  }else if (type == 2) {
    this.r = 8;
    this.damage = 22;
  }

  this.update = function () {
    this.x += this.speed * sin(this.dir);
    this.y -= this.speed * cos(this.dir);
    if(!this.collisions()){
      this.deleteOffScreen();
    }
  }

  this.collisions = function () {
    // Splice if hitting wall
    for (var i = 0; i < walls.length; i++) {
      if (walls[i].bulletColliding(this.x, this.y, 20)) {
        explosions.push(new Explosion(this.x, this.y, this.r * 6, this.col, 30));
        bullets.splice(bullets.indexOf(this), 1);
        return true;
      }
    }
    // Splice and apply damage if hitting tank
    if(this.name != tank.name){
      if (collideRectCircle(tank.pos.x - tank.w/2, tank.pos.y - tank.h/2, tank.w, tank.h, this.x, this.y, this.r/2)) {
        if(teams){
          if(this.col != tank.colour){
            this.hit();
            return true;
          }
        }else{
          this.hit();
          return true;
        }
      }
    }
    // Splice if hitting other tank
    for (var i = 0; i < tanks.length; i++) {
      if (tanks[i].id != tank.id && this.name != tanks[i].name && !tanks[i].paused) {
        if (collideRectCircle(tanks[i].pos.x - tanks[i].w/2, tanks[i].pos.y - tanks[i].h/2, tanks[i].w, tanks[i].h, this.x, this.y, this.r/2)) {
          if (teams && this.col == tanks[i].colour) {
            return false;
          }
          explosions.push(new Explosion(this.x, this.y, this.r * 6, this.col, 30));
          bullets.splice(bullets.indexOf(this), 1);
          return true;
        }
      }
    }
  }

  this.hit = function () {
    tank.removeHealth(this.damage);
    explosions.push(new Explosion(this.x, this.y, this.r * 6, this.col, 30));
    tank.pos.x += this.type**2*sin(this.dir);
    tank.pos.y -= this.type**2*cos(this.dir);
    tank.checkDeath(this.name);
    bullets.splice(bullets.indexOf(this), 1);
  }

  this.deleteOffScreen = function () {
    if(this.x < 0 || this.x > width || this.y < 0 || this.y > height){
      bullets.splice(bullets.indexOf(this), 1);
      return true;
    }
  }

  this.show = function () {
    fill(this.col);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
  }
}

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

  this.aiAim = function () {
    var closestTank = null;
    var distanceToTank = 100000;
    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id != tank.id && tanks[i].colour != tank.colour && !tanks[i].paused){
        var distance = dist(tanks[i].pos.x, tanks[i].pos.y, tank.pos.x, tank.pos.y);
        if (distance < distanceToTank) {
          distanceToTank = distance;
          closestTank = tanks[i];
        }
      }
    }
    if (closestTank != null) {
      this.trackPoint(closestTank.pos.x, closestTank.pos.y);
    }
  }
}
