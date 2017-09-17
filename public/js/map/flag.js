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

  this.show = function () {
    fill(this.colour);
    stroke("lightgrey");
    strokeWeight(3);
    ellipse(this.x, this.y, 20, 20);

  }

  this.update = function () {
    if (dist(this.x, this.y, tank.pos.x, tank.pos.y) < 20) {
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