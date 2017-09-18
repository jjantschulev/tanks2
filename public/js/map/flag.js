var flags = [];

function showFlags() {
  for (var i = 0; i < flags.length; i++) {
    flags[i].show();
    flags[i].update();
  }
}

function Flag(x, y, teamCol, id) {
  this.colour = teamCol;
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = 25;
  this.a = 0;

  this.show = function () {
    push();
    translate(this.x, this.y);
    rotate(this.a);
    fill(this.colour);
    noStroke();
    var testCol = color(this.colour);
    arc(0, 0, this.r, this.r, PI, 1.5 * PI);
    arc(0, 0, this.r, this.r, 0, PI / 2);
    fill(red(testCol) - 50, green(testCol) - 50, blue(testCol) - 50);
    arc(0, 0, this.r, this.r, PI / 2, PI);
    arc(0, 0, this.r, this.r, 1.5 * PI, TWO_PI);
    pop();
  }

  this.update = function () {
    this.a += 0.02;
    if (dist(this.x, this.y, tank.pos.x, tank.pos.y) < this.r) {
      if (this.colour != tank.colour) {
        this.colour = tank.colour;
        var data = {
          col: this.colour,
          id: this.id,
        }
        socket.emit("flag_changed", data);
      }
    }
  }
}