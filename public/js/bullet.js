var bullets = [];

function showBullets() {
  for (var i = bullets.length-1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].update();
  }
}

function Bullet(x, y, dir, id, type, col) {
  this.x = x;
  this.y = y;
  this.dir = dir;
  this.id = id;
  this.col = col;
  this.type = type;
  this.speed = 5;
  if(type == 1){
    this.r = 4;
    this.damage = 2.5;
  }else if (type == 2) {
    this.r = 8;
    this.damage = 13;
  }

  this.update = function () {
    this.x += this.speed * sin(this.dir);
    this.y -= this.speed * cos(this.dir);
    this.collisions();
    this.deleteOffScreen();
  }

  this.collisions = function () {
    // Splice if hitting wall
    for (var i = 0; i < walls.length; i++) {
      if (walls[i].bulletColliding(this.x, this.y, 20)) {
        explosions.push(new Explosion(this.x, this.y, this.r * 6, this.col));
        bullets.splice(bullets.indexOf(this), 1);
        return;
      }
    }
    // Splice and apply damage if hitting tank
    if(this.id != tank.id){
      if (collideRectCircle(tank.pos.x - tank.w/2, tank.pos.y - tank.h/2, tank.w, tank.h, this.x, this.y, this.r/2)) {
        tank.health -= this.damage;
        if(tank.health <= 0){
          tank.death()
        }
        explosions.push(new Explosion(this.x, this.y, this.r * 6, this.col));
        tank.pos.x += this.type**2*sin(this.dir);
        tank.pos.y -= this.type**2*cos(this.dir);
        bullets.splice(bullets.indexOf(this), 1);
        return;
      }
    }
    // Splice if hitting other tank
    for (var i = 0; i < tanks.length; i++) {
      if (this.id != tanks[i].id) {
        if (collideRectCircle(tanks[i].pos.x - tanks[i].w/2, tanks[i].pos.y - tanks[i].h/2, tanks[i].w, tanks[i].h, this.x, this.y, this.r/2)) {
          explosions.push(new Explosion(this.x, this.y, this.r * 6, this.col));
          bullets.splice(bullets.indexOf(this), 1);
          return;
        }
      }
    }
  }

  this.deleteOffScreen = function () {
    if(this.x < 0 || this.x > width || this.y < 0 || this.y > height){
      bullets.splice(bullets.indexOf(this), 1);
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
  this.trackMouseActive = false;

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
      id: tank.id,
      type: this.type,
      col: tank.colour
    }
    bullets.push(new Bullet(bulletData.x, bulletData.y, bulletData.dir, bulletData.id, bulletData.type, bulletData.col));
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
    return this.trackMouseActive;
  }

  this.trackMouse = function () {
    fill('white');
    if((view.getRealMousePoints().y - tank.pos.y) < 0){
      tank.gunDir = -atan((view.getRealMousePoints().x - tank.pos.x)/(view.getRealMousePoints().y - tank.pos.y)) - tank.dir;
    }else {
      tank.gunDir = PI-atan((view.getRealMousePoints().x - tank.pos.x)/(view.getRealMousePoints().y - tank.pos.y)) - tank.dir;
    }
    if (mouseIsPressed) {
      this.shoot();
    }
  }
}
