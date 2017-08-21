function WeaponManager() {
  this.landmines = [];
  this.bombs = [];
  this.blasts = [];

  this.landmineAmount = 0;
  this.bombAmount = 0;
  this.blastAmount = 0;

  this.landmineColour = color(0, 190, 255);
  this.bombColour = color(255, 180, 0);
  this.blastColour = color(15, 255, 150);

  this.showInfo = function () {
    var rectSize = 6;
    noStroke();
    rectMode(CORNER);
    for (var i = 0; i < this.blastAmount; i++) {
      fill(this.blastColour);
      rect(rectSize*0, i*rectSize, rectSize, rectSize);
    }
    for (var i = 0; i < this.bombAmount; i++) {
      fill(this.bombColour);
      rect(rectSize*1, i*rectSize, rectSize, rectSize);
    }
    for (var i = 0; i < this.landmineAmount; i++) {
      fill(this.landmineColour);
      rect(rectSize*2, i*rectSize, rectSize, rectSize);
    }

    this.limitWeaponAmount();
  }

  this.showWeapons = function () {
    for (var i = this.bombs.length-1; i >= 0; i--) {
      this.bombs[i].show();
      this.bombs[i].update();
    }
    for (var i = this.landmines.length-1; i >= 0; i--) {
      this.landmines[i].show();
      this.landmines[i].update();
    }
    for (var i = this.blasts.length-1; i >= 0; i--) {
      this.blasts[i].update();
    }
  }

  this.dropWeapon = function (data) {
    if(data.type == 'landmine'){
      this.landmines.push(new Landmine(data.x, data.y, data.name, data.col));
    }
    if(data.type == 'bomb'){
      this.bombs.push(new Bomb(data.x, data.y, data.name));
    }
    if(data.type == 'blast'){
      this.blasts.push(new Blast(data.x, data.y, data.name));
    }
  }

  this.dropLandmine = function () {
    if(this.landmineAmount > 0){
      var data = {
        x: tank.pos.x,
        y: tank.pos.y,
        name: tank.name,
        col: tank.colour,
        type: 'landmine'
      }
      socket.emit('weapon', data);
      this.landmines.push(new Landmine(data.x, data.y, data.name, data.col));
      this.landmineAmount--;
    }
  }
  this.dropBomb = function () {
    if(this.bombAmount > 0){
      var data = {
        x: tank.pos.x,
        y: tank.pos.y,
        name: tank.name,
        col: tank.colour,
        type: 'bomb'
      }
      socket.emit('weapon', data);
      this.bombs.push(new Bomb(data.x, data.y, data.name));
      this.bombAmount--;
    }
  }
  this.dropBlast = function () {
    if(this.blastAmount > 0){
      var data = {
        x: tank.pos.x,
        y: tank.pos.y,
        name: tank.name,
        col: tank.colour,
        type: 'blast'
      }
      socket.emit('weapon', data);
      this.blasts.push(new Blast(data.x, data.y, data.name));
      this.blastAmount--;
    }
  }

  this.pushTank = function (x, y, d, direction) {
    var distance = dist(tank.pos.x, tank.pos.y, x, y);
    if(direction == undefined){
      if(distance < d && distance != 0){
        if((tank.pos.y - y) < 0){
          var dir = -atan((tank.pos.x - x)/(tank.pos.y - y));
        }else {
          var dir = PI-atan((tank.pos.x - x)/(tank.pos.y - y));
        }
        tank.pos.x += (d-distance) * sin(dir);
        tank.pos.y -= (d-distance) * cos(dir);
      }
    }else{
      tank.pos.x += (d) * sin(direction);
      tank.pos.y -= (d) * cos(direction);
    }
  }

  this.limitWeaponAmount = function () {
    if(this.landmineAmount > 10){
      this.landmineAmount = 10;
    }
    if(this.bombAmount > 10){
      this.bombAmount = 10;
    }
    if(this.blastAmount > 10){
      this.blastAmount = 10;
    }
  }
}

function Landmine(x, y, owner, col) {
  this.x = x;
  this.y = y;
  this.r = 10;
  this.colour = col;
  this.owner = owner;

  this.show = function () {
    fill(15);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
  }

  this.update = function () {
    var distance = dist(tank.pos.x, tank.pos.y, this.x, this.y);
    if(distance < 30 && this.owner != tank.name && !pause.paused){
      if(teams){
        if(this.colour != tank.colour){
          this.explode();
          tank.weaponManager.landmines.splice(tank.weaponManager.landmines.indexOf(this), 1);
          return;
        }
      }else{
        this.explode();
        tank.weaponManager.landmines.splice(tank.weaponManager.landmines.indexOf(this), 1);
        return;
      }
    }else{
      for (var i = 0; i < tanks.length; i++) {
        if(tanks[i].id != tank.id && tanks[i].name != this.owner && !tanks[i].paused){
          if(dist(tanks[i].pos.x, tanks[i].pos.y, this.x, this.y) < 30){
            if (teams) {
              if (tanks[i].colour != this.colour) {
                explosions.push(new Explosion(this.x, this.y, 200, tank.weaponManager.landmineColour, 50));
                tank.weaponManager.landmines.splice(tank.weaponManager.landmines.indexOf(this), 1);
                return;
              }
            } else {
              explosions.push(new Explosion(this.x, this.y, 200, tank.weaponManager.landmineColour, 50));
              tank.weaponManager.landmines.splice(tank.weaponManager.landmines.indexOf(this), 1);
              return;
            }
          }
        }
      }
    }
  }

  this.explode = function () {
    tank.removeHealth(40);
    tank.weaponManager.pushTank(this.x, this.y, 45);
    explosions.push(new Explosion(this.x, this.y, 200, tank.weaponManager.landmineColour, 50));
    tank.checkDeath(this.owner);
  }
}

function Bomb(x, y, owner) {
  this.x = x;
  this.y = y;
  this.r = 10;

  this.timer = 80;

  this.owner = owner;

  this.show = function () {
    fill(tank.weaponManager.bombColour);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
    noFill();
    stroke(255, 100, 0);
    strokeWeight(1);
    arc(this.x, this.y, this.r, this.r, 0, map(this.timer, 0, 150, 0, TWO_PI));
  }

  this.update = function () {
    this.timer --;
    if(this.timer <= 0){
      this.explode();
      tank.weaponManager.bombs.splice(tank.weaponManager.bombs.indexOf(this), 1);
    }
  }

  this.explode = function () {
    var distance = dist(tank.pos.x, tank.pos.y, this.x, this.y);
    if (distance < 100) {
      tank.removeHealth(100-distance);
      tank.weaponManager.pushTank(this.x, this.y, 100);
      tank.checkDeath(this.owner);
    }
    explosions.push(new Explosion(this.x, this.y, 200, tank.weaponManager.bombColour, 50));
  }
}

function Blast(x, y, owner) {
  this.x = x;
  this.y = y;
  this.r = 5;
  this.owner = owner;
  this.timer = 5;

  this.update = function () {
    fill(tank.weaponManager.blastColour);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
    this.timer --;
    if(this.timer <= 0){
      this.explode();
    }
  }

  this.explode = function () {
    tank.weaponManager.pushTank(this.x, this.y, 200);
    explosions.push(new Explosion(this.x, this.y, 300, tank.weaponManager.blastColour, 50));
    tank.weaponManager.blasts.splice(tank.weaponManager.blasts.indexOf(this), 1);
  }
}
