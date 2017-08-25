var teams = true;
var team;

function Team() {

  this.allowColour = function(col) {
    // colours is format: | r | g | b | y |
    var colourNames = ['red', 'green', 'blue', 'yellow'];
    var colours = [0, 0, 0, 0];
    for (var i = tanks.length - 1; i >= 0; i--) {
      if(tank.id != tanks[i].id){
        if(tanks[i].colour == 'red'){
          colours[0]++;
        }
        if(tanks[i].colour == 'yellow'){
          colours[3]++;
        }
        if(tanks[i].colour == 'blue'){
          colours[2]++;
        }
        if(tanks[i].colour == 'green'){
          colours[1]++;
        }
      }
    }

    var max = Math.max(colours[0], colours[1], colours[2], colours[3]);
    if (max == 0) {
      max = 1;
    }

    for (var i = colours.length - 1; i >= 0; i--) {
      if (col == colourNames[i]) {
        if (colours[i] == max) {
          notify("Too many people on " + col + " team", 150, 255, width);
          return false;
        }else{
          return true;
        }
      }
    }

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