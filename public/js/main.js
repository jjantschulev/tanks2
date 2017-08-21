var teams = true;

function setup() {
  createCanvas(1000, 1000);
  tank = new Tank();
  view = new View();
  minimap = new Minimap();
  pause = new Pause();
  onLoad();
}

function draw() {
  background(0);

  if(!pause.paused){
    for (var i = 0; i < keys.length; i++) {
      keyHold(keys[i]);
    }
  }

  push();
  view.update(); // zoom in onto tank

  showBullets();
  showWalls();
  tank.weaponManager.showWeapons();
  showTanks();
  tank.update();
  tank.show();
  showExplosions();
  pop();
  minimap.show();
  tank.weaponManager.showInfo();

  pause.use();
  showNotifications();
}
