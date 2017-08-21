var bullets = [];

function showBullets() {
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].show();
    bullets[i].update();
  }
  // for (var i = bullets.length-1; i >= 0; i--) {
  //   bullets[i].show();
  //   bullets[i].update();
  // }
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
    this.damage = 25;
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
      if (this.name != tanks[i].name && !tanks[i].paused) {
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

  this.shoot = function () {
    if(this.reload1 <= 0 && this.type == 1){
      this.reload1 = 6;
    } else if(this.reload2 <= 0 && this.type == 2){
      this.reload2 = 50;
    }else{
      return;
    }
    var bulletData = {
      x: tank.pos.x + 20*sin(tank.gunDir+tank.dir),
      y: tank.pos.y - 20*cos(tank.gunDir+tank.dir),
      dir: tank.gunDir + tank.dir,
      type: this.type,
      col: tank.colour,
      name: tank.name
    }
    bullets.push(new Bullet(bulletData.x, bulletData.y, bulletData.dir, bulletData.name, bulletData.type, bulletData.col));
    socket.emit('bullet', bulletData);

    // Recoil effect
    if(this.type > 1){
      tank.pos.x -= this.type**2*sin(tank.gunDir+tank.dir);
      tank.pos.y += this.type**2*cos(tank.gunDir+tank.dir);
    }
  }

  this.update = function () {
    this.reload1 --;
    this.reload2 --;

    if(this.trackMouseActive){
      this.trackMouse();
    }
  }

  this.toggleTrackMouse = function () {
    if(this.trackMouseActive){
      this.trackMouseActive = false;
    }else{
      this.trackMouseActive = true;
    }
    console.log(this.trackMouseActive);
  }

  this.trackMouse = function () {
    if((view.getRealMousePoints().y - tank.pos.y) < 0){
      tank.gunDir = -atan((view.getRealMousePoints().x - tank.pos.x)/(view.getRealMousePoints().y - tank.pos.y)) - tank.dir;
    }else {
      tank.gunDir = PI-atan((view.getRealMousePoints().x - tank.pos.x)/(view.getRealMousePoints().y - tank.pos.y)) - tank.dir;
    }
    if (mouseIsPressed && !pause.paused) {
      this.shoot();
    }
  }
}
