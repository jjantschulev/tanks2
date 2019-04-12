var flags = [];

function showFlags() {
  for (var i = 0; i < flags.length; i++) {
    flags[i].show();
    flags[i].update();
  }
}

function Flag(x, y, teamCol, id) {
  this.colour = teamCol;
  var testCol = color(this.colour);
  this.darkColour = color(red(testCol) - 50, green(testCol) - 50, blue(testCol) - 50);
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
    arc(0, 0, this.r, this.r, PI, 1.5 * PI);
    arc(0, 0, this.r, this.r, 0, PI / 2);
    fill(this.darkColour);
    arc(0, 0, this.r, this.r, PI / 2, PI);
    arc(0, 0, this.r, this.r, 1.5 * PI, TWO_PI);
    pop();
  }

  this.update = function () {
    this.a += 0.02;
    if (dist(this.x, this.y, tank.pos.x, tank.pos.y) < this.r) {
      this.changeColour(tank.colour);
    }
  }

  this.changeColour = function (col, force) {
    if(team.getUnpausedTankCount() > 1 || force == true){
      if (this.colour != col) {
        this.colour = col;
        var testCol = color(this.colour);
        this.darkColour = color(red(testCol) - 50, green(testCol) - 50, blue(testCol) - 50);
        var data = {
          col: this.colour,
          id: this.id,
        }
        socket.emit("flag_changed", data);
      }
    }
  }
}

function resetAllFlags(col) {
  var colorToResetTo = col || "grey";
  for (var i = 0; i < flags.length; i++) {
    flags[i].changeColour(colorToResetTo, true);
  }
}
