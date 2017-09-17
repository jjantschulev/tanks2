function WeaponManager() {
  this.coinImage = loadImage("./assets/coin.png");

  this.landmines = [];
  this.gunners = [];
  this.bombs = [];
  this.blasts = [];
  this.healthPackets = [];
  this.bridges = [];
  this.coins = [];

  this.landmineAmount = 0;
  this.bombAmount = 0;
  this.blastAmount = 0;
  this.gunnerAmount = 0;
  this.bridgeAmount = 0;

  this.landmineLimit = 100;
  this.bombLimit = 100;
  this.blastLimit = 100;
  this.gunnerLimit = 100;
  this.bridgeLimit = 100;


  this.blastPrice = 60;
  this.bombPrice = 80;
  this.landminePrice = 80;
  this.gunnerPrice = 300;
  this.bridgePrice = 300;

  this.landmineColour = color(0, 190, 255);
  this.bombColour = color(255, 180, 0);
  this.blastColour = color(15, 255, 150);
  this.gunnerColour = color(255, 250, 50);
  this.bridgeColour = color(255, 60, 40);

  this.showInfo = function () {
    var rectSize = 6;
    noStroke();
    rectMode(CORNER);
    fill(this.blastColour);
    rect(rectSize * 0, 0, rectSize, rectSize * this.blastAmount);
    fill(this.bombColour);
    rect(rectSize * 1, 0, rectSize, rectSize * this.bombAmount);
    fill(this.landmineColour);
    rect(rectSize * 2, 0, rectSize, rectSize * this.landmineAmount);
    fill(this.gunnerColour);
    rect(rectSize * 3, 0, rectSize, rectSize * this.gunnerAmount);
    fill(this.bridgeColour);
    rect(rectSize * 4, 0, rectSize, rectSize * this.bridgeAmount);

    showBoostTimer();

    imageMode(CENTER);
    image(this.coinImage, width - 17, 17, 30, 30);
    textAlign(RIGHT);
    fill('gold');
    noStroke();
    textSize(24);
    text(tank.coins, width - 36, 18);

    this.limitWeaponAmount();
  }

  this.showWeapons = function () {
    for (var i = this.bombs.length - 1; i >= 0; i--) {
      this.bombs[i].show();
      this.bombs[i].update();
    }
    for (var i = this.landmines.length - 1; i >= 0; i--) {
      this.landmines[i].show();
      this.landmines[i].update();
    }
    for (var i = this.healthPackets.length - 1; i >= 0; i--) {
      this.healthPackets[i].show();
      this.healthPackets[i].update();
    }
    for (var i = this.gunners.length - 1; i >= 0; i--) {
      this.gunners[i].show();
      this.gunners[i].update();
    }
    for (var i = this.bridges.length - 1; i >= 0; i--) {
      this.bridges[i].show();
      this.bridges[i].update();
    }
    for (var i = this.coins.length - 1; i >= 0; i--) {
      this.coins[i].show();
      this.coins[i].update();
    }
    for (var i = this.blasts.length - 1; i >= 0; i--) {
      this.blasts[i].update();
    }
  }

  this.addWeapon = function (data) {
    if (data.type == 'landmine') {
      this.landmines.push(new Landmine(data.x, data.y, data.name, data.col, data.id));
    }
    if (data.type == 'bomb') {
      this.bombs.push(new Bomb(data.x, data.y, data.name));
    }
    if (data.type == 'blast') {
      this.blasts.push(new Blast(data.x, data.y, data.name));
    }
    if (data.type == 'healthPacket') {
      this.healthPackets.push(new HealthPacket(data.x, data.y, data.name, data.col, data.id));
    }
    if (data.type == 'gunner') {
      this.gunners.push(new Gunner(data.x, data.y, data.col, data.name, data.id));
    }
    if (data.type == 'coin') {
      this.coins.push(new Coin(data.x, data.y, data.id));
    }
    if (data.type == 'bridge') {
      this.bridges.push(new Bridge(data.x, data.y, data.a, data.col, data.id));
    }
    if (data.type == 'bridgeRemove') {
      for (var i = this.bridges.length - 1; i >= 0; i--) {
        if (this.bridges[i].id == data.id) {
          this.bridges.splice(i, 1);
        }
      }
    }
    if (data.type == 'coinRemove') {
      for (var i = this.coins.length - 1; i >= 0; i--) {
        if (this.coins[i].id == data.id) {
          this.coins.splice(i, 1);
        }
      }
    }
    if (data.type == 'healthPacketRemove') {
      for (var i = this.healthPackets.length - 1; i >= 0; i--) {
        if (this.healthPackets[i].id == data.id) {
          this.healthPackets.splice(i, 1);
        }
      }
    }
    if (data.type == 'landmineRemove') {
      for (var i = this.landmines.length - 1; i >= 0; i--) {
        if (this.landmines[i].id == data.id) {
          this.landmines[i].explode();
        }
      }
    }
    if (data.type == 'gunnerRemove') {
      for (var i = this.gunners.length - 1; i >= 0; i--) {
        if (this.gunners[i].id == data.id) {
          particleEffects.push(new ParticleEffect(this.gunners[i].x, this.gunners[i].y, this.gunners[i].colour));
          this.gunners.splice(i, 1);
        }
      }
    }
  }

  this.dropWeapon = function (weaponType) {
    var data = {
      x: tank.pos.x,
      y: tank.pos.y,
      name: tank.name,
      col: tank.colour,
      type: weaponType
    }
    if (this.landmineAmount > 0 && data.type == 'landmine') {
      data.id = generateId();
      socket.emit('weapon', data);
      this.landmines.push(new Landmine(data.x, data.y, data.name, data.col, data.id));
      this.landmineAmount--;
    }
    if (this.bombAmount > 0 && data.type == 'bomb') {
      socket.emit('weapon', data);
      this.bombs.push(new Bomb(data.x, data.y, data.name));
      this.bombAmount--;
    }
    if (this.bridgeAmount > 0 && data.type == 'bridge') {
      data.a = tank.dir
      data.id = generateId();
      socket.emit('weapon', data);
      this.bridges.push(new Bridge(data.x, data.y, data.a, data.col, data.id));
      this.bridgeAmount--;
    }
    if (this.blastAmount > 0 && data.type == 'blast') {
      tank.boostTimer = tank.boostLength;
      // socket.emit('weapon', data);
      // this.blasts.push(new Blast(data.x, data.y, data.name));
      this.blastAmount--;
    }
    if (data.type == 'gunner') {
      //deciding whether to drop or pickup gunner
      var g = null;
      for (var i = 0; i < this.gunners.length; i++) {
        if (dist(this.gunners[i].x, this.gunners[i].y, tank.pos.x, tank.pos.y) < this.gunners[i].w) {
          g = this.gunners[i];
        }
      }
      if (g != null) {
        g.pickUp();
      } else {
        // Dropping gunner here
        if (this.gunnerAmount > 0) {
          data.id = generateId();
          var newGunner = new Gunner(data.x, data.y, data.col, data.name, data.id);
          if (team.allowGunner(newGunner)) {
            if (newGunner.place()) {
              socket.emit('weapon', data);
              this.gunners.push(newGunner);
              this.gunnerAmount--;
            }
          }
        }
      }
    }
    if (data.type == 'healthPacket') {
      //deciding whether to drop or pickup health packet
      var hp = null;
      for (var i = 0; i < this.healthPackets.length; i++) {
        if (dist(this.healthPackets[i].x, this.healthPackets[i].y, tank.pos.x, tank.pos.y) < 22) {
          hp = this.healthPackets[i];
        }
      }
      if (hp != null) {
        hp.pickUp();
      } else {
        // Dropping health packet here
        data.id = generateId();
        var hp = new HealthPacket(data.x, data.y, data.name, data.col, data.id);
        if (team.allowHealthPacket(hp)) {
          if (hp.place()) {
            socket.emit('weapon', data);
            this.healthPackets.push(hp);
          } else {
            notify('not enough health', 100, tank.colour, width / 2);
          }
        }
      }
    }

  }

  this.pushTank = function (x, y, d, direction) {
    var distance = dist(tank.pos.x, tank.pos.y, x, y);
    if (direction == undefined) {
      if (distance < d && distance != 0) {
        if ((tank.pos.y - y) < 0) {
          var dir = -atan((tank.pos.x - x) / (tank.pos.y - y));
        } else {
          var dir = PI - atan((tank.pos.x - x) / (tank.pos.y - y));
        }
        tank.pos.x += (d - distance) * sin(dir);
        tank.pos.y -= (d - distance) * cos(dir);
      }
    } else {
      tank.pos.x += (d) * sin(direction);
      tank.pos.y -= (d) * cos(direction);
    }
  }

  this.limitWeaponAmount = function () {
    if (this.landmineAmount > this.landmineLimit) {
      this.landmineAmount = this.landmineLimit;
    }
    if (this.bombAmount > this.bombLimit) {
      this.bombAmount = this.bombLimit;
    }
    if (this.blastAmount > this.blastLimit) {
      this.blastAmount = this.blastLimit;
    }
    if (this.gunnerAmount > this.gunnerLimit) {
      this.gunnerAmount = this.gunnerLimit;
    }
    if (this.bridgeAmount > this.bridgeLimit) {
      this.bridgeAmount = this.bridgeLimit;
    }
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