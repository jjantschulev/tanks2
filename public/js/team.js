var teams = true;
var team;

function Team() {

  this.allowColour = function (col) {
    // colours is format: | r | g | b | y |
    var colourNames = ['seagreen', 'gold', 'firebrick', 'cornflowerblue'];
    var colourInts = [0, 0, 0, 0];
    for (var i = tanks.length - 1; i >= 0; i--) {
      if (tank.id != tanks[i].id) {
        colourInts = this.colourToInt(tanks[i].colour, colourInts);
      }
    }
    var sortedInts = colourInts.slice();
    sortedInts.sort(function (a, b) {
      return b - a;
    });
    var difference = sortedInts[0] - sortedInts[1];
    for (var i = colourInts.length - 1; i >= 0; i--) {
      if (col == colourNames[i]) {
        if (colourInts[i] == sortedInts[0] && difference > 0) {
          notify("Too many people on " + col + " team", 150, 255, width);
          return false;
        } else {
          return true;
        }
      }
    }

  }

  this.colourToInt = function (col, array) {
    var colourInts = array;
    if (col == 'seagreen') {
      colourInts[0]++;
    }
    if (col == 'gold') {
      colourInts[1]++;
    }
    if (col == 'firebrick') {
      colourInts[2]++;
    }
    if (col == 'cornflowerblue') {
      colourInts[3]++;
    }
    return colourInts;
  }

  this.allowGunner = function (g) {
    var col = g.colour;
    var count = 0;

    for (var i = tank.weaponManager.gunners.length - 1; i >= 0; i--) {
      if (tank.weaponManager.gunners[i].colour == col) {
        count++;
      }
    }

    if (count >= 4) {
      notify("too many " + g.colour + " gunners on the field", 150, g.colour, width - width / 3);
      return false;
    } else {
      return true;
    }
  }

  this.allowHealthPacket = function (hp) {
    var col = hp.colour;
    var count = 0;

    for (var i = tank.weaponManager.healthPackets.length - 1; i >= 0; i--) {
      if (tank.weaponManager.healthPackets[i].colour == col) {
        count++;
      }
    }

    if (count >= 10) {
      notify("too many " + hp.colour + " health packets on the field", 150, hp.colour, width - width / 3);
      return false;
    } else {
      return true;
    }
  }


  this.getTeamPlayers = function (col) {
    var count = 0;
    for (var i = 0; i < tanks.length; i++) {
      if (tanks[i].colour == col) {
        count++;
      }
    }
    return count;
  }

  this.getClosestTank = function () {
    var closestTank = null;
    var distanceToTank = Infinity;
    for (var i = 0; i < tanks.length; i++) {
      if (tanks[i].id != tank.id && tanks[i].colour != tank.colour && !tanks[i].paused) {
        var distance = dist(tanks[i].pos.x, tanks[i].pos.y, tank.pos.x, tank.pos.y);
        if (distance < distanceToTank) {
          distanceToTank = distance;
          closestTank = {
            x: tanks[i].pos.x,
            y: tanks[i].pos.y
          }
        }
      }
    }

    for (var i = 0; i < tank.weaponManager.gunners.length; i++) {
      if (tank.weaponManager.gunners[i].colour != tank.colour) {
        var distance = dist(tank.weaponManager.gunners[i].x, tank.weaponManager.gunners[i].y, tank.pos.x, tank.pos.y);
        if (distance < distanceToTank) {
          distanceToTank = distance;
          closestTank = {
            x: tank.weaponManager.gunners[i].x,
            y: tank.weaponManager.gunners[i].y
          }
        }
      }
    }
    return closestTank;
  }


  this.getFlagCount = function () {
    var flagCount = 0;
    for (var i = 0; i < flags.length; i++) {
      if (flags[i].colour == tank.colour) {
        flagCount++
      }
    }
    return flagCount;
  }

  this.payForFlags = function () {
    var cc = this.getFlagCount();
    var tp = this.getTeamPlayers(tank.colour);
    if (tp != 0 && cc != 0) {
      var amount = 0.006 / tp;
      log(amount)
      tank.coins += amount * cc;
    }
  }
}