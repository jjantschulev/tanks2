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
  if (type == 1) {
    this.r = 4;
    this.damage = 2.5;
  } else if (type == 2) {
    this.r = 8;
    this.damage = 22;
  }

  this.update = function () {
    this.x += this.speed * sin(this.dir);
    this.y -= this.speed * cos(this.dir);
    if (!this.collisions()) {
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
    // splice and apply damage to gunners
    for (var i = tank.weaponManager.gunners.length - 1; i >= 0; i--) {
      if (collideCircleCircle(this.x, this.y, this.r, tank.weaponManager.gunners[i].x, tank.weaponManager.gunners[i].y, tank.weaponManager.gunners[i].w)) {
        if (tank.weaponManager.gunners[i].hitByBullet(this)) {
          explosions.push(new Explosion(this.x, this.y, this.r * 6, this.col, 30));
          bullets.splice(bullets.indexOf(this), 1);
          return true;
        }
      }
    }
    // Splice and apply damage if hitting tank
    if (this.name != tank.name) {
      if (collideRectCircle(tank.pos.x - tank.w / 2, tank.pos.y - tank.h / 2, tank.w, tank.h, this.x, this.y, this.r)) {
        if (teams) {
          if (this.col != tank.colour) {
            this.hit();
            return true;
          }
        } else {
          this.hit();
          return true;
        }
      }
    }
    // Splice if hitting other tank
    for (var i = 0; i < tanks.length; i++) {
      if (tanks[i].id != tank.id && this.name != tanks[i].name && !tanks[i].paused) {
        if (collideRectCircle(tanks[i].pos.x - tanks[i].w / 2, tanks[i].pos.y - tanks[i].h / 2, tanks[i].w, tanks[i].h, this.x, this.y, this.r)) {
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
    tank.pos.x += this.type ** 2 * sin(this.dir);
    tank.pos.y -= this.type ** 2 * cos(this.dir);
    tank.checkDeath(this.name);
    bullets.splice(bullets.indexOf(this), 1);
  }

  this.deleteOffScreen = function () {
    if (this.x < - fullWidth / 2 || this.x > fullWidth / 2 || this.y < -fullHeight / 2 || this.y > fullHeight / 2) {
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

