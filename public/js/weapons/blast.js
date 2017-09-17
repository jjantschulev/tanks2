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
    this.timer--;
    if (this.timer <= 0) {
      this.explode();
    }
  }

  this.explode = function () {
    tank.weaponManager.pushTank(this.x, this.y, 200);
    explosions.push(new Explosion(this.x, this.y, 300, tank.weaponManager.blastColour, 50));
    tank.weaponManager.blasts.splice(tank.weaponManager.blasts.indexOf(this), 1);
  }
}

function showBoostTimer() {
  if (tank.boostTimer >= 0) {
    var h = map(tank.boostTimer, 0, tank.boostLength, 0, height);
    fill(tank.weaponManager.blastColour);
    noStroke();
    rect(width - 20, 0, 20, h);
  }
}


