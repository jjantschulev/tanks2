function Gunner(x, y, colour, name, id) {
  this.x = x;
  this.y = y;
  this.colour = colour;
  this.image = loadImage("./assets/"+this.colour+"_gunner.png")
  this.owner = name;
  this.id = id;
  this.health = 100;
  this.w = 30;
  this.h = 30;

  this.dir = 0;

  this.reload = 0;

  this.update = function () {
    this.reload --;
    this.trackTank();
  }

  this.show = function () {
    push();
    translate(this.x, this.y);

    imageMode(CENTER);
    image(this.image, 0, 0, this.w, this.h);

    //show health circle:
    noFill();
    stroke(120);
    strokeWeight(2);
    arc(0, 0, this.w, this.h, 0, map(this.health, 0, 100, 0, TWO_PI));

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
      this.reload = 9;
    }else{
      return;
    }
    var bulletData = {
      x: this.x + 20*sin(this.dir),
      y: this.y - 20*cos(this.dir),
      dir: this.dir,
      type: 1,
      col: this.colour,
      name: this.owner
    }
    bullets.push(new Bullet(bulletData.x, bulletData.y, bulletData.dir, bulletData.name, bulletData.type, bulletData.col));
    // socket.emit('bullet', bulletData);
  }

  this.trackTank = function () {
    var ct = this.getClosestTank();
    if(ct == null){
      this.dir += 0.04;
      return;
    }

    var targetDir;
    var currentDir = this.dir;
    if((ct.pos.y - this.y) < 0){
      targetDir = -atan((ct.pos.x - this.x)/(ct.pos.y - this.y));
    }else {
      targetDir = PI-atan((ct.pos.x - this.x)/(ct.pos.y - this.y));
    }

    var vel = targetDir - currentDir;
    if (vel > PI) {
      currentDir += TWO_PI;
    }else if (vel < -PI) {
      currentDir -= TWO_PI;
    }
    vel = targetDir - currentDir;
    vel = constrain(vel, -0.05, 0.05);
    this.dir += vel;

    this.shoot();
  }

  this.getClosestTank = function () {
    var distance = Infinity;
    var closestTank = null;
    for (var i = 0; i < tanks.length; i++) {
      if (tanks[i].colour != this.colour && tanks[i].name != this.owner && !tanks[i].paused) {
        var newDist = dist(this.x, this.y, tanks[i].pos.x, tanks[i].pos.y);
        if (newDist < distance) {
          distance = newDist;
          closestTank = tanks[i];
        }
      }
    }
    if (closestTank != null) {
      return closestTank;
    } else {
      return null;
    }
  }

  this.hitByBullet = function (b) {
    if (b.col != this.colour && b.name != this.owner) {
      this.health -= b.damage;
      if (this.health <= 0) {
        if(b.name == tank.name){
          tank.health += 40;
          notify("You destoyed " + this.owner + "'s gunner", 150, this.colour, width - width/3)
        }
        var data = {
          id : this.id,
          type : "gunnerRemove",
        }
        socket.emit('weapon', data);
        particleEffects.push(new ParticleEffect(this.x, this.y, this.colour));
        tank.weaponManager.gunners.splice(tank.weaponManager.gunners.indexOf(this), 1);
        return;
      }
    }
  }

  this.place = function() {
    if(tank.health > 120){
      tank.removeHealth(120);
      return true;
    }else{
      return false;
    }
  }

  this.pickUp = function() {
    if(this.owner == tank.name || this.colour == tank.colour){
      tank.health += this.health;
      notify("picked up gunner with " + Math.round(this.health) + " hp", 150, this.colour, width);

      var data = {
        id : this.id,
        type : "gunnerRemove",
      }
      socket.emit('weapon', data);
      particleEffects.push(new ParticleEffect(this.x, this.y, this.colour));
      tank.weaponManager.gunners.splice(tank.weaponManager.gunners.indexOf(this), 1);
      return;
    }
  }
}
