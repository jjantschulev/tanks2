function HealthPacket(x, y, owner, col, id) {
  this.x = x;
  this.y = y;
  this.owner = owner;
  this.colour = col;
  this.healthAmount = 15;
  this.timer = 0;
  this.id = id;

  this.place = function () {
    if(tank.health > this.healthAmount + 5){
      tank.removeHealth(this.healthAmount);
      return true;
    }else{
      return false;
    }
  }

  this.update = function () {
    this.timer ++;
    if (this.timer == 600) {
      this.owner = "";
    }
    if (this.healthAmount < 40) {
      this.healthAmount += 0.004;
    }
  }

  this.pickUp = function () {
    notify(Math.round(this.healthAmount) + ' HP added to tank', 130, 200, width/2);
    tank.health += this.healthAmount;
    tank.weaponManager.healthPackets.splice(tank.weaponManager.healthPackets.indexOf(this), 1);
    var data = {
      type : 'healthPacketRemove',
      id : this.id,
    }
    socket.emit('weapon', data);
    return;
  }

  this.show = function () {
    noStroke();
    fill(this.colour);
    rectMode(CENTER);
    var l = map(this.healthAmount, 20, 50, 10, 30);
    rect(this.x, this.y, l, l/3, 10);
    rect(this.x, this.y, l/3, l, 10);
  }
}
