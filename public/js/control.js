function keyHold(k) {
  // Tank Movement
  if (k == 87) {
    if (tank.boostTimer >= 0) {
      tank.speed = tank.speedMultiplyer * 4.0 * frameCompensate;
    } else {
      tank.speed = tank.speedMultiplyer * 2.0 * frameCompensate;
    }
  }
  if (k == 83) {
    if (tank.boostTimer >= 0) {
      tank.speed = tank.speedMultiplyer * -3.5 * frameCompensate;
    } else {
      tank.speed = tank.speedMultiplyer * -1.7 * frameCompensate;
    }
  }
  // Tank Rotation
  if (k == 65) {
    tank.dirVel = tank.speedMultiplyer * -0.06 * frameCompensate;
  }
  if (k == 68) {
    tank.dirVel = tank.speedMultiplyer * 0.06 * frameCompensate;
  }
  // Gun Rotation
  if (k == 69 || k == 39) {
    tank.gunDirVel = tank.speedMultiplyer * 0.04 * frameCompensate;
  }
  if (k == 81 || k == 37) {
    tank.gunDirVel = tank.speedMultiplyer * -0.04 * frameCompensate;
  }
  // Gun Shooting
  if (k == 32) {
    tank.gun.shoot();
    tank.gun.shooting = true;
  }
  if (k == 190) {
    tank.gun.shooting = true;
    tank.gun.shoot(2);
  }
  if (k == 188) {
    tank.gun.shoot(1);
    tank.gun.shooting = true;
  }
  //Adjust Missile Strength;
  if (k == 222) {
    tank.weaponManager.missileStrength += 0.15;
  }
}

function keyDown(k) {
  // console.log(k);
  if (k == 27 && !pause.deathScreen.dead && pause.onHomeScreen) {
    pause.togglePause();
  }
  if (pause.paused) {
    if (pause.mapEditor.active) {
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
      if (k == 87) {
        pause.mapEditor.toggleWater();
      }
    }
  } else { // not paused:
    if (k == 220) {
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
    if (k == 67) {
      tank.weaponManager.dropWeapon('bridge');
    }

    if (k == 80) {
      tank.setSpawnPoint();
    }
    if (k == 48) {
      tank.gun.toggleAi();
    }

  }
}

function keyUp(k) {
  if (!pause.paused) {
    if (k == 222) {
      if (tank.weaponManager.missileStrength <= 25) {
        tank.weaponManager.dropWeapon('missile');
      }
      tank.weaponManager.missileStrength = 12;
    }
  }
}

function mousePressed() {
  if (pause.paused) {
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
  if (event.keyCode == 9) {
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
