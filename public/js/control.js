function keyHold(k) {
  // Tank Movement
  if (k == 87) {
    tank.speed = 2.0;
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
  if(tank.name == "Jordan") {
    if (k == 188) {
      tank.gun.shoot(2);
    }
  }else{
    if (k == 190) {
      tank.gun.shoot(2);
    }
    if (k == 188) {
      tank.gun.shoot(1);
    }
  }
}

function keyDown(k) {
  // console.log(k);
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
      if (k == 85) {
        pause.mapEditor.undo();
      }
    }
  }else{ // not paused:
    if (k == 220){
      minimap.toggleDisplay();
    }
    // Gun Mode Change
    if (k == 9) {
      tank.gun.toggleType();
    }
    // Add weapons
    if (k == 77) {
      tank.weaponManager.dropWeapon('bomb');
    }
    if (k == 78) {
      tank.weaponManager.dropWeapon('landmine');
    }
    if (k == 66) {
      tank.weaponManager.dropWeapon('blast');
    }
    if (k == 86) {
      tank.weaponManager.dropWeapon('gunner');
    }
    if (k == 72) {
      tank.weaponManager.dropWeapon('healthPacket');
    }

    if (k == 80) {
      tank.setSpawnPoint();
    }

    if (k == 67) {
      tank.gun.toggleTrackMouse();
    }

    if (k == 48) {
      tank.gun.toggleAi();
    }

  }
}

function keyUp(k) {

}

function mousePressed() {
  if(pause.paused){
    pause.mouseClick();
  }
  // tank.weaponManager.gunners.push(new Gunner(view.getRealMousePoints().x, view.getRealMousePoints().y));
  // particleEffects.push(new ParticleEffect(tank.pos.x, tank.pos.y, tank.colour));
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
  if(event.keyCode == 9){
    event.preventDefault();
  }
});
window.addEventListener('keyup', function () {
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == event.keyCode) {
      keys.splice(i, 1);
    }
  }
  keyUp(event.keyCode);
});
