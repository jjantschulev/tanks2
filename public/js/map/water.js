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
  this.colOff = 0;

  this.show = function () {
    colorMode(HSB);

    stroke(map(sin(this.colOff), -1, 1, 25, 40), 255, 128);
    // stroke(255, 173, 13);
    this.width = 35 * map(noise(this.rOff), 0, 1, 1, 1.3);
    strokeWeight(this.width);
    line(this.x1, this.y1, this.x2, this.y2);
    this.rOff += 0.02;
    this.colOff += 0.03;
    colorMode(RGB);
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
        if(tank.speedMultiplyer > 1){
          tank.removeHealth(5*(tank.speedMultiplyer**2));
        }else{
          tank.removeHealth(1.5);
        }
        tank.checkDeath("lava");
        tank.speedMultiplyer = 0.1;
      }
    }
  }

  this.tankColliding = function (vector) {
    var hit = collideLineCircle(this.x1, this.y1, this.x2, this.y2, vector.x, vector.y, tank.h * 1.2);
    return hit;
  }
}
