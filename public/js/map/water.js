var waters = [];

function showWater() {
  for (var i = waters.length - 1; i >= 0; i--) {
    waters[i].show();
    waters[i].update();
  }
}

function Water(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.rOff = 0;
  this.width = 30;


  this.show = function () {
    stroke(50, 150, 255);
    this.width = 35 * map(noise(this.rOff), 0, 1, 1, 1.3);
    strokeWeight(this.width);
    line(this.x1, this.y1, this.x2, this.y2);
    this.rOff += 0.01;
  }

  this.update = function () {
    if (this.tankColliding(tank.pos)) {
      var onBridge = false;
      for (var i = 0; i < tank.weaponManager.bridges.length; i++) {
        if (tank.weaponManager.bridges[i].colour == tank.colour) {
          if (tank.weaponManager.bridges[i].ontop()) {
            onBridge = true;
          }
        }

      }
      if (!onBridge) {
        tank.removeHealth(3);
        tank.checkDeath("water");
        tank.speedMultiplyer = 0.05;
      }
    }
  }

  this.tankColliding = function (vector) {
    var hit = collideLineCircle(this.x1, this.y1, this.x2, this.y2, vector.x, vector.y, tank.h * 1.2);
    return hit;
  }
}