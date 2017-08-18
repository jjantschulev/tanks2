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
  if(type == 1){
    this.speed = 5;
    this.r = 4;
  }else if (type == 2) {
    this.speed = 4;
    this.r = 8;
  }

  this.update = function () {
    this.x += this.speed * sin(this.dir);
    this.y -= this.speed * cos(this.dir);
    this.collisions();
  }

  this.collisions = function () {
    for (var i = 0; i < walls.length; i++) {
      if (walls[i].bulletColliding(this.x, this.y, this.r*5)) {
        bullets.splice(bullets.indexOf(this), 1);
        return;
      }
    }
    for (var i = 0; i < tanks.length; i++) {
      if (this.id != tanks[i].id) {
        if (collideRectCircle(tanks[i].pos.x - tanks[i].w/2, tanks[i].pos.y - tanks[i].h/2, tanks[i].w, tanks[i].h, this.x, this.y, this.r)) {
          bullets.splice(bullets.indexOf(this), 1);
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
  this.shoot = function () {
    if(this.reload1 <= 0 && this.type == 1){
      this.reload1 = 10;
    } else if(this.reload2 <= 0 && this.type == 2){
      this.reload2 = 100;
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
    tank.pos.x -= this.type*sin(tank.gunDir+tank.dir);
    tank.pos.y += this.type*cos(tank.gunDir+tank.dir);
  }

  this.update = function () {
    this.reload1 --;
    this.reload2 --;
  }
}
