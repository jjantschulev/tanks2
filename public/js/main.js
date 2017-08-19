function setup() {
  createCanvas(1000, 1000);
  tank = new Tank();
  view = new View();
  minimap = new Minimap();
  trackEditor = new TrackEditor();
  pause = new Pause();
  colourSelector = new ColourSelector();
}

function draw() {
  background(0);
  pause.use();
  trackEditor.show();
  colourSelector.show();
  if(pause.paused){
    return;
  }

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
}
