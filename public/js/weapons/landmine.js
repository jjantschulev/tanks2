function Landmine(x, y, owner, col, id) {
  this.x = x;
  this.y = y;
  this.r = 10;
  this.colour = col;
  this.owner = owner;
  this.id = id;

  this.show = function () {
    fill(15);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
  }

  this.update = function () {
    var distance = dist(tank.pos.x, tank.pos.y, this.x, this.y);
    if(distance < 30 && this.owner != tank.name && !pause.paused){
      if(this.colour != tank.colour){
        var data = {
          type: 'landmineRemove',
          id: this.id,
        }
        socket.emit('weapon', data);

        tank.removeHealth(40);
        tank.checkDeath(this.owner);
        tank.weaponManager.pushTank(this.x, this.y, 45);

        this.explode();
        return;
      }
    }
  }

  this.explode = function () {
    explosions.push(new Explosion(this.x, this.y, 200, tank.weaponManager.landmineColour, 50));
    tank.weaponManager.landmines.splice(tank.weaponManager.landmines.indexOf(this), 1);
  }
}



