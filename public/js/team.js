var teams = true;
var team;

function Team() {

  this.allowColour = function(col) {
    // colours is format: | r | g | b | y |
    var colourNames = ['red', 'green', 'blue', 'yellow'];
    var colourInts = [0, 0, 0, 0];
    for (var i = tanks.length - 1; i >= 0; i--) {
      if(tank.id != tanks[i].id){
        colourInts = this.colourToInt(tanks[i].colour, colourInts);
      }
    }
    var sortedInts = colourInts.slice();
    sortedInts.sort(function(a, b) {
      return b - a;
    });
    var difference = sortedInts[0] - sortedInts[1];
    for (var i = colourInts.length - 1; i >= 0; i--) {
      if (col == colourNames[i]) {
        if (colourInts[i] == sortedInts[0] && difference > 0) {
          notify("Too many people on " + col + " team", 150, 255, width);
          return false;
        }else{
          return true;
        }
      }
    }

  }

  this.colourToInt = function(col, array) {
    var colourInts = array;
    if(col == 'red'){
      colourInts[0]++;
    }
    if(col == 'yellow'){
      colourInts[3]++;
    }
    if(col == 'blue'){
      colourInts[2]++;
    }
    if(col == 'green'){
      colourInts[1]++;
    }
    return colourInts;
  }

  this.allowGunner = function(g) {
    var col = g.colour;
    var count = 0;

    for (var i = tank.weaponManager.gunners.length - 1; i >= 0; i--) {
      if(tank.weaponManager.gunners[i].colour == col){
        count ++;
      }
    }

    if(count >= 4){
      notify("too many "+ g.colour +" gunners on the field", 150, g.colour, width - width/3);
      return false;
    }else{
      return true;
    }
  }
}