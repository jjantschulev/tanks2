var paused = false;

function setup() {
  createCanvas(1000, 1000);
  tank = new Tank();
  view = new View();
  minimap = new Minimap();
  trackEditor = new TrackEditor();
}

function draw() {
  background(0);

  for (var i = 0; i < keys.length; i++) {
    keyHold(keys[i]);
  }

  push();
  view.update(); // zoom in onto tank

  showBullets();
  showWalls();
  showTanks();
  tank.update();
  tank.show();

  pop();
  minimap.show();
  trackEditor.show();

}
