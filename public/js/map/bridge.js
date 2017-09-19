function Bridge(x, y, a, col, id) {
  this.x1 = x + 30 * sin(a);
  this.y1 = y - 30 * cos(a);
  this.x2 = x + 70 * sin(a);
  this.y2 = y - 70 * cos(a);
  this.road_x1 = x + 10 * sin(a);
  this.road_y1 = y - 10 * cos(a);
  this.road_x2 = x + 90 * sin(a);
  this.road_y2 = y - 90 * cos(a);

  this.a = a;
  this.colour = col;
  this.health = 300;
  this.id = id;


  this.x = (this.x1 + this.x2) / 2;
  this.y = (this.y1 + this.y2) / 2;



  this.show = function () {
    noStroke();
    push();
    translate(this.x, this.y);
    rotate(this.a);
    rectMode(CENTER);

    var len = 65;

    fill(0);
    rect(0, 0, 40, len, 0);

    fill(this.colour);
    rect(0, 0, 2, map(this.health, 0, 1000, 0, 50), 100);
    rect(-20, 0, 2, len, 100);
    rect(20, 0, 2, len, 100);

    strokeWeight(2);
    stroke(this.colour);
    line(-20, len / 2, -23, len / 2 + 3);
    line(20, len / 2, 23, len / 2 + 3);
    line(-20, -len / 2, -23, -len / 2 - 3);
    line(20, -len / 2, 23, -len / 2 - 3);

    pop();
  }

  this.ontop = function () {
    var hit = collideLineCircle(this.x1, this.y1, this.x2, this.y2, tank.pos.x, tank.pos.y, tank.h);
    return hit;
  }

  this.colliding = function () {
    var hit = collideLineCircle(this.x1, this.y1, this.x2, this.y2, tank.pos.x, tank.pos.y, tank.h * 2);
    return hit;
  }

  this.onRoad = function () {
    var hit = collideLineCircle(this.road_x1, this.road_y1, this.road_x2, this.road_y2, tank.pos.x, tank.pos.y, tank.h * 0.99);
    return hit;
  }

  this.update = function () {

  }

  this.pickUp = function () {
    if (this.colour == tank.colour && this.health > 250) {
      tank.weaponManager.bridgeAmount++;
      var data = {
        id: this.id,
        type: "bridgeRemove",
      }
      socket.emit('weapon', data);
      particleEffects.push(new ParticleEffect(this.x, this.y, this.colour));
      tank.weaponManager.bridges.splice(tank.weaponManager.bridges.indexOf(this), 1);
      return;
    }
  }

  this.checkDeath = function () {
    if (this.health <= 0) {
      particleEffects.push(new ParticleEffect(this.x, this.y, this.colour));
      if (this.colour == tank.colour) {
        simpleNotify("Your team's bridge has been destroyed");
      }

      var removeData = {
        type: "bridgeRemove",
        id: this.id,
      }
      socket.emit("weapon", removeData);

      tank.weaponManager.bridges.splice(tank.weaponManager.bridges.indexOf(this), 1);

    }
  }
}

