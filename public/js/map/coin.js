function Coin(x, y, id) {
  this.x = x;
  this.y = y;
  this.r = 15;
  this.id = id;
  this.value = 100;
  this.image = loadImage("./assets/coin.png");
  this.life = 9000;


  this.show = function () {
    imageMode(CENTER);
    image(this.image, this.x, this.y, this.r, this.r);
  }

  this.update = function () {
    this.life --;
    if(this.life <= 0){
      this.remove(false);
    }
    if (dist(tank.pos.x, tank.pos.y, this.x, this.y) < this.r) {
      this.remove(true);
    }
  }

  this.remove = function (addCoins) {
    var data = {
      type: "coinRemove",
      id: this.id
    }
    socket.emit("weapon", data);
    if(addCoins){
      tank.coins += this.value;
    }
    particleEffects.push(new ParticleEffect(this.x, this.y, 'gold'));
    tank.weaponManager.coins.splice(tank.weaponManager.coins.indexOf(this), 1);
  }
}
