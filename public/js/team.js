var teams = true;
var team;

function Team() {
	this.names = [];
	this.colours = [];

  this.allowColour = function(col) {
    var maxColour = 0;
    var c;
    var r, g, b, y = 0;
    for (var i = tanks.length - 1; i >= 0; i--) {
      if(tanks[i].colour == 'red'){
        r ++;
      }
      if(tanks[i].colour == 'yellow'){
        y ++;
      }
      if(tanks[i].colour == 'blue'){
        b ++;
      }
      if(tanks[i].colour == 'green'){
        g ++;
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