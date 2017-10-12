var view;
var minimap;
var walls = [];

function View() {
  this.zoom = 2.6;
  this.zoomed = false;
  this.x = 0;
  this.y = 0;
  this.object = tank.pos;
  this.trackingSpeed = 0.1

  this.update = function () {
    translate(width / 2, height / 2);
    if (this.object) {
      this.track(this.object);
    }
    scale(this.zoom);
    translate(-this.x, -this.y);
  }

  this.track = function (vector) {
    this.x = lerp(this.x, vector.x, this.trackingSpeed);
    this.y = lerp(this.y, vector.y, this.trackingSpeed);
    this.x = constrain(this.x, -fullWidth / 2 + width / 2 / this.zoom, fullWidth / 2 - width / 2 / this.zoom);
    this.y = constrain(this.y, -fullHeight / 2 + height / 2 / this.zoom, fullHeight / 2 - height / 2 / this.zoom);
  }

  this.getRealMousePoints = function () {
    var mdata = {
      x: map(mouseX, 0, width, this.x - width / this.zoom / 2, this.x + width / this.zoom / 2),
      y: map(mouseY, 0, height, this.y - height / this.zoom / 2, this.y + height / this.zoom / 2),
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
}

Wall.prototype.show = function () {
  stroke(100);
  strokeWeight(this.thickness);
  line(this.x1, this.y1, this.x2, this.y2);
};

Wall.prototype.tankColliding = function (vector) {
  return collideLineCircle(this.x1, this.y1, this.x2, this.y2, vector.x, vector.y, tank.h);
};

Wall.prototype.bulletColliding = function (x, y, r) {
  return collideLineCircle(this.x1, this.y1, this.x2, this.y2, x, y, r);
};

function Minimap() {
  this.display = true;
  this.viewScale = width / fullWidth;
  this.size = 0.14;
  this.alpha = 180;
  this.show = function () {
    if (!this.display) {
      return;
    }
    push();
    translate(0, height);
    scale(this.size);
    translate(0, -height);

    // show rectangle
    fill(30, this.alpha);
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, height);

    translate(width / 2, height / 2);
    var tx = constrain(tank.pos.x, -fullWidth / 2 + width / 2 / this.viewScale, fullWidth / 2 - width / 2 / this.viewScale);
    var ty = constrain(tank.pos.y, -fullWidth / 2 + width / 2 / this.viewScale, fullWidth / 2 - width / 2 / this.viewScale);

    scale(this.viewScale);
    translate(-tx, -ty);
    // show map contents
    noFill();
    stroke(255, 145, 0);
    strokeWeight(35);
    for (var i = 0; i < waters.length; i++) {
      if (abs(waters[i].x1 - tx) < width / 2 / this.viewScale || abs(waters[i].x2 - tx) < width / 2 / this.viewScale) {
        if (abs(waters[i].y1 - ty) < height / 2 / this.viewScale || abs(waters[i].y2 - ty) < height / 2 / this.viewScale) {
          strokeWeight(waters[i].width);
          line(waters[i].x1, waters[i].y1, waters[i].x2, waters[i].y2);
        }
      }
    }
    stroke(120);
    strokeWeight(15);
    for (var i = 0; i < walls.length; i++) {
      if (abs(walls[i].x1 - tx) < width / 2 / this.viewScale || abs(walls[i].x2 - tx) < width / 2 / this.viewScale) {
        if (abs(walls[i].y1 - ty) < height / 2 / this.viewScale || abs(walls[i].y2 - ty) < height / 2 / this.viewScale) {
          line(walls[i].x1, walls[i].y1, walls[i].x2, walls[i].y2);
        }
      }
    }
    if (this.zoomed) {
      strokeWeight(10);
      for (var i = 0; i < tank.weaponManager.bridges.length; i++) {
        var b = tank.weaponManager.bridges[i];
        stroke(b.colour);
        line(b.x1, b.y1, b.x2, b.y2);
      }
    }

    noStroke();
    for (var i = 0; i < tanks.length; i++) {
      if (tanks[i].id != tank.id && !tanks[i].paused) {
        if (abs(tanks[i].pos.x - tx) < width / 2 / this.viewScale) {
          if (abs(tanks[i].pos.y - ty) < height / 2 / this.viewScale) {
            fill(tanks[i].colour);
            ellipse(tanks[i].pos.x, tanks[i].pos.y, 40, 40);
          }
        }
      }
    }

    if (this.zoomed) {
      for (var i = 0; i < flags.length; i++) {
        rectMode(CENTER);
        fill(flags[i].colour);
        rect(flags[i].x, flags[i].y, 20, 20);
      }
    }

    fill(tank.colour);
    ellipse(tank.pos.x, tank.pos.y, 40, 40);
    pop();

    if (this.zoomed) {
      if (this.size < 0.95) {
        this.size += 0.05;
      } else {
        this.size = 1;
      }
      this.alpha = 255;
    } else {
      if (this.size > 0.20) {
        this.size -= 0.05;
      } else {
        this.size = 0.14;
      }
      this.alpha = 180;
    }
  }

  this.toggleDisplay = function () {
    if (this.zoomed) {
      this.zoomed = false;
    } else {
      this.zoomed = true;
    }
  }
}
