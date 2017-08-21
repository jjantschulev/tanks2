var view;
var minimap;
var walls = [];

function View() {
  this.zoom = 2.6;
  this.x = 0;
  this.y = 0;

  this.update = function () {
    translate(width/2, height/2);
    this.x = lerp(this.x, tank.pos.x, 0.08);
    this.y = lerp(this.y, tank.pos.y, 0.08);
    this.x = constrain(this.x, width/2/this.zoom, width - width/2/this.zoom);
    this.y = constrain(this.y, height/2/this.zoom, height - height/2/this.zoom);
    // this.zoom = lerp(this.zoom, 1.1 - 0.2*(car.speed/10.8516614), 0.05);
    scale(this.zoom);
    translate(-this.x, -this.y);
  }

  this.getRealMousePoints = function () {
    var mdata = {
      x: map(mouseX, 0, width, this.x - width/this.zoom/2, this.x + width/this.zoom/2),
      y: map(mouseY, 0, height, this.y - height/this.zoom/2, this.y + height/this.zoom/2),
    }
    return mdata;
  }
}

function showWalls() {
  for (var i = 0; i < walls.length; i++) {
    walls[i].show();
  }
}

function Wall(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.thickness = 15;

  this.show = function () {
    stroke(100);
    strokeWeight(this.thickness);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  this.tankColliding = function (vector) {
    var hit = collideLineCircle(this.x1, this.y1, this.x2, this.y2, vector.x, vector.y, tank.h);
    return hit;
  }

  this.bulletColliding = function (x, y, r) {
    var hit = collideLineCircle(this.x1, this.y1, this.x2, this.y2, x, y, r);
    return hit;
  }
}

function Minimap() {
  this.display = true;
  this.show = function () {
    if(!this.display){
      return;
    }
    push();
    translate(0, height);
    scale(0.14);
    translate(0, -height);
    fill(30, 180);
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, height);
    noFill();
    stroke(120);
    strokeWeight(20);
    for (var i = 0; i < walls.length; i++) {
      line(walls[i].x1, walls[i].y1, walls[i].x2, walls[i].y2);
    }
    noStroke();
    for (var i = 0; i < tanks.length; i++) {
      if(tanks[i].id != tank.id && !tanks[i].paused){
        fill(tanks[i].colour);
        ellipse(tanks[i].pos.x, tanks[i].pos.y, 40, 40);
      }
    }
    fill(tank.colour);
    ellipse(tank.pos.x, tank.pos.y, 40, 40);
    pop();
  }

  this.toggleDisplay = function () {
    if(this.display){
      this.display = false;
    }else{
      this.display = true;
    }
  }
}
