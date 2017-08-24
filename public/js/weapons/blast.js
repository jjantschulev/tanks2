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

function generateId() {
  var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  var randomID = '';
  for (var i = 0; i < 100; i++) {
    randomID += letters[Math.floor(random(letters.length))];
  }
  return randomID;
}
