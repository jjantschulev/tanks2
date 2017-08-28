function WeaponManager() {
  this.landmines = [];
  this.gunners = [];
  this.bombs = [];
  this.blasts = [];
  this.healthPackets = [];

  this.landmineAmount = 0;
  this.bombAmount = 0;
  this.blastAmount = 0;
  this.gunnerAmount = 10;

  this.blastPrice = 30;
  this.bombPrice = 50;
  this.landminePrice = 80;
  this.gunnerPrice = 250;
  
  this.landmineColour = color(0, 190, 255);
  this.bombColour = color(255, 180, 0);
  this.blastColour = color(15, 255, 150);
  this.gunnerColour = color(200, 0, 255);

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
    for (var i = 0; i < this.gunnerAmount; i++) {
      fill(this.gunnerColour);
      rect(rectSize*3, i*rectSize, rectSize, rectSize);
    }

    fill(255, 200, 100);
    // rect(width - rectSize, 0, rectSize, map(tank.coins, 0, 1000, 0, 100));

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
    for (var i = this.healthPackets.length-1; i >= 0; i--) {
      this.healthPackets[i].show();
      this.healthPackets[i].update();
    }
    for (var i = this.gunners.length-1; i >= 0; i--) {
      this.gunners[i].show();
      this.gunners[i].update();
    }
    for (var i = this.blasts.length-1; i >= 0; i--) {
      this.blasts[i].update();
    }
  }

  this.addWeapon = function (data) {
    if(data.type == 'landmine'){
      this.landmines.push(new Landmine(data.x, data.y, data.name, data.col, data.id));
    }
    if(data.type == 'bomb'){
      this.bombs.push(new Bomb(data.x, data.y, data.name));
    }
    if(data.type == 'blast'){
      this.blasts.push(new Blast(data.x, data.y, data.name));
    }
    if(data.type == 'healthPacket'){
      this.healthPackets.push(new HealthPacket(data.x, data.y, data.name, data.col, data.id));
    }
    if(data.type == 'gunner'){
      this.gunners.push(new Gunner(data.x, data.y, data.col, data.name, data.id));
    }
    if(data.type == 'healthPacketRemove'){
      for (var i = this.healthPackets.length-1; i >= 0; i--) {
        if(this.healthPackets[i].id == data.id){
          this.healthPackets.splice(i, 1);
        }
      }
    }
    if(data.type == 'landmineRemove') {
      for (var i = this.landmines.length-1; i >= 0; i--) {
        if(this.landmines[i].id == data.id){
          this.landmines[i].explode();
        }
      }
    }
    if(data.type == 'gunnerRemove') {
      for (var i = this.gunners.length - 1; i >= 0; i--) {
        if(this.gunners[i].id == data.id){
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
    if(this.landmineAmount > 0 && data.type == 'landmine'){
      data.id = generateId();
      socket.emit('weapon', data);
      this.landmines.push(new Landmine(data.x, data.y, data.name, data.col, data.id));
      this.landmineAmount--;
    }
    if(this.bombAmount > 0 && data.type == 'bomb'){
      socket.emit('weapon', data);
      this.bombs.push(new Bomb(data.x, data.y, data.name));
      this.bombAmount--;
    }
    if(this.blastAmount > 0 && data.type == 'blast'){
      socket.emit('weapon', data);
      this.blasts.push(new Blast(data.x, data.y, data.name));
      this.blastAmount--;
    }
    if (data.type == 'gunner') {
      //deciding whether to drop or pickup gunner
      var g = null;
      for (var i = 0; i < this.gunners.length; i++) {
        if(dist(this.gunners[i].x, this.gunners[i].y, tank.pos.x, tank.pos.y) < this.gunners[i].w) {
          g = this.gunners[i];
        }
      }
      if (g != null) {
        g.pickUp();
      }else{
        // Dropping gunner here
        if(this.gunnerAmount > 0){
          data.id = generateId();
          var newGunner = new Gunner(data.x, data.y, data.col, data.name, data.id);
          if (team.allowGunner(newGunner)) {
            if(newGunner.place()){
              socket.emit('weapon', data);
              this.gunners.push(newGunner);
              this.gunnerAmount--;              
            }
          }
        }
      }
    }
    if(data.type == 'healthPacket'){
      //deciding whether to drop or pickup health packet
      var hp = null;
      for (var i = 0; i < this.healthPackets.length; i++) {
        if(dist(this.healthPackets[i].x, this.healthPackets[i].y, tank.pos.x, tank.pos.y) < 22) {
          hp = this.healthPackets[i];
        }
      }
      if (hp != null) {
        hp.pickUp();
      }else{
        // Dropping health packet here
        data.id = generateId();
        var hp = new HealthPacket(data.x, data.y, data.name, data.col, data.id);
        if (team.allowHealthPacket(hp)) {
          if(hp.place()){
            socket.emit('weapon', data);
            this.healthPackets.push(hp);
          } else {
            notify('not enough health', 100, tank.colour, width/2);
          }
        }
      }
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
    if(this.gunnerAmount > 10){
      this.gunnerAmount = 10;
    }
  }
}
