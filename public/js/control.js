function keyHold(k) {
  // Tank Movement
  if (k == 87) {
    tank.speed = 2.2;
  }
  if (k == 83) {
    tank.speed = -1.7;
  }
  // Tank Rotation
  if (k == 65) {
    tank.dirVel = -0.06;
  }
  if (k == 68) {
    tank.dirVel = 0.06;
  }
  // Gun Rotation
  if (k == 69 || k == 39) {
    tank.gunDirVel = 0.04;
  }
  if (k == 81 || k == 37) {
    tank.gunDirVel = -0.04;
  }
  // Gun Shooting
  if (k == 32) {
    tank.gun.shoot();
  }
}

function keyDown(k) {
  if (k == 27 && !pause.deathScreen.dead) {
    pause.togglePause();
  }
  if(pause.paused){
    if(pause.mapEditor.active){
      if (k == 65) {
        pause.mapEditor.addLine();
      }
      if (k == 83) {
        pause.mapEditor.saveMap()
      }
      if (k == 69) {
        pause.mapEditor.toggleEraser();
      }
      if (k == 67) {
        pause.mapEditor.clearAll();
      }
      if (k == 32) {
        pause.mapEditor.mouseClick();
      }
      if (k == 76) {
        pause.mapEditor.loadLines();
      }
    }
  }else{ // not paused:
    if (k == 220){
      minimap.toggleDisplay();
    }
    // Gun Mode Change
    if (k == 49) {
      tank.gun.type = 1;
    }
    if (k == 50) {
      tank.gun.type = 2;
    }
  }
}

function keyUp(k) {

}

function mousePressed() {
  if(pause.paused){
    pause.mouseClick();
  }
}

var keys = [];
window.addEventListener('keydown', function () {
  var addKeyToArray = true;
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == event.keyCode) {
      addKeyToArray = false;
    }
  }
  if (addKeyToArray) {
    keys.push(event.keyCode);
  }
  keyDown(event.keyCode);
});
window.addEventListener('keyup', function () {
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == event.keyCode) {
      keys.splice(i, 1);
    }
  }
  keyUp(event.keyCode);
});
