var tank;
var tanks = [];

function showTanks() {
  for (var i = 0; i < tanks.length; i++) {
    if(tanks[i].id != tank.id){
      tanks[i].show();
    }
  }
}


function Tank() {
  this.pos = createVector(random(width), random(height));
  this.previousPos = createVector(0, 0);
  this.dir = 0;
  this.gunDir = 0;
  this.speed = 0;
  this.dirVel = 0;
  this.gunDirVel = 0;

  this.w = 30;
  this.h = 30;

  this.id = "";
  this.colour = "yellow";

  this.health = 100;
  this.name = "Kraken";

  //Weaponry
  this.gun = new Gun();

  this.update = function () {
    // UPDATE VARIABLES
    this.pos.x += this.speed * sin(this.dir);
    this.pos.y -= this.speed * cos(this.dir);
    this.dir += this.dirVel;
    this.gunDir += this.gunDirVel;

    // CHECKING
    this.collisions();

    // RESET VARIABLES
    this.speed = 0;
    this.dirVel = 0;
    this.gunDirVel = 0;

    // UPDATE WEAPONRY
    this.gun.update();
  }

  this.show = function () {
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);

    // SHOW HEALTH BAR
    fill(this.colour);
    noStroke();
    rectMode(CENTER);
    rect(0, -30, map(this.health, 0, 100, 0, 30), 1.6);

    // SHOW NAME
    fill(120);
    textAlign(CENTER, CENTER);
    textSize(8);
    text(this.name, 0, -36);

    // SHOW TANK
    rotate(this.dir);
    image(this.image, 0, 0, this.w, this.h);
    rotate(this.gunDir);
    image(this.gunImage, 0, -this.w/4, this.w, this.h);
    pop();
  }

  this.collisions = function () {
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);

    var hit = false;
    for (var i = 0; i < walls.length; i++) {
      if(walls[i].tankColliding(this.pos)){
        hit = true;
      }
    }

    if (hit) {
      this.pos.set(this.previousPos);
      var phit = false;
      for (var i = 0; i < walls.length; i++) {
        if(walls[i].tankColliding(this.previousPos)){
          phit = true;
        }
      }
      while (phit) {
        this.previousPos.set(random(width), random(height));
        for (var i = 0; i < walls.length; i++) {
          if(walls[i].tankColliding(this.previousPos)){
            phit = true;
          }else{
            phit = false;
          }
        }
      }
    } else {
      this.previousPos.set(this.pos);
    }
  }

  this.loadImages = function (col) {
    this.colour = col;
    this.image = loadImage('./assets/' + this.colour + '_body.png');
    this.gunImage = loadImage('./assets/' + this.colour + '_gun.png');
  }
  this.loadImages(this.colour);
}


function EnemyTank() {
  this.pos = createVector(random(width), random(height));
  this.dir = 0;
  this.gunDir = 0;

  this.w = 30;
  this.h = 30;

  this.id = "";
  this.colour = "yellow";
  this.paused = false;

  this.health = 100;
  this.name = 'other';

  this.show = function () {
    if(this.paused){
      return;
    }
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);

    // SHOW HEALTH BAR
    fill(this.colour);
    noStroke();
    rectMode(CENTER);
    rect(0, -30, map(this.health, 0, 100, 0, 30), 1.6);

    // SHOW NAME
    fill(120);
    textAlign(CENTER, CENTER);
    textSize(8);
    text(this.name, 0, -36);

    // SHOW TANK

    rotate(this.dir);
    image(this.image, 0, 0, this.w, this.h);
    rotate(this.gunDir);
    image(this.gunImage, 0, -this.w/4, this.w, this.h);
    pop();
  }

  this.loadImages = function (col) {
    this.colour = col;
    this.image = loadImage('./assets/' + this.colour + '_body.png');
    this.gunImage = loadImage('./assets/' + this.colour + '_gun.png');
  }
  this.loadImages(this.colour);

}
