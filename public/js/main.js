var fullWidth = 1200,
  fullHeight = 1200;

var frameCompensate;
var font;

function setup() {
  createCanvas(1000, 1000);
  font = loadFont("./assets/Raleway/Raleway-Regular.ttf");
  textFont(font);

  team = new Team();
  tank = new Tank();
  view = new View();
  minimap = new Minimap();
  pause = new Pause();
  onLoad();

  //Prevent Right Click Menu
  var canvas = document.querySelector('#defaultCanvas0');
  canvas.oncontextmenu = function (e) {
    e.preventDefault();
  };
  var win = document.querySelector('#window');
  win.oncontextmenu = function (e) {
    e.preventDefault();
  }
}

function draw() {
  background(0);
  frameCompensate = 60 / frameRate();

  if (!pause.paused) {
    for (var i = 0; i < keys.length; i++) {
      keyHold(keys[i]);
    }
  }

  push();
  view.update(); // zoom in onto tank
  showWater();
  tank.weaponManager.showWeapons();
  showFlags();
  showBullets();
  showWalls();
  showTanks();
  tank.update();
  tank.show();
  showExplosions();
  pop();
  minimap.show();
  tank.weaponManager.showInfo();

  pause.use();
  showDisconnectedInfo();
  showNotifications();

  // showFrameRate();
}

function showFrameRate() {
  fill(255);
  textAlign(RIGHT);
  textSize(23);
  text(int(frameRate()), width - 8, 18);

}
