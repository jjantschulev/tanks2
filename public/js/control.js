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
  // TrackEditor Key Logic
  if (k == 220) {
    trackEditor.changeMode();
  }
  if(trackEditor.creatingTrack){
    if (k == 65) {
      trackEditor.addLine();
    }
    if (k == 83) {
      trackEditor.saveMap()
    }
    if (k == 69) {
      trackEditor.toggleEraser();
    }
    if (k == 67) {
      trackEditor.clearAll();
    }
    if (k == 32) {
      trackEditor.mouseClick();
    }
    return;
  }
  // Executes only when not in editor
  if (k == 48){
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

function keyUp(k) {

}

function mousePressed() {
  trackEditor.mouseClick();
}

var keys = [];
window.addEventListener('keydown', function () {
  var addKeyToArray = true;
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == event.which) {
      addKeyToArray = false;
    }
  }
  if (addKeyToArray) {
    keys.push(event.which);
  }
  keyDown(event.which);
});
window.addEventListener('keyup', function () {
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == event.which) {
      keys.splice(i, 1);
    }
  }
  keyUp(event.which);
});
