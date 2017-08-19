var explosions = [];
var gifExplosions = [];

function showExplosions() {
  for (var i = explosions.length-1; i >- 0; i--) {
    explosions[i].show();
    explosions[i].update();
  }
  for (var i = gifExplosions.length-1; i >- 0; i--) {
    gifExplosions[i].show();
    gifExplosions[i].update();
  }
}

function Explosion(x, y, size, col) {
  this.x = x;
  this.y = y;
  this.timer = 30
  this.size = 0;
  this.sizeRate = size / this.timer;
  this.alpha = 255;
  this.alphaRate = this.alpha/this.timer;
  this.col = color(col);

  this.update = function () {
    this.alpha -= this.alphaRate;
    this.timer --;
    this.size += this.sizeRate;

    if(this.timer <= 0){
      explosions.splice(explosions.indexOf(this), 1);
    }
  }

  this.show = function () {
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function GifExplosion() {

  this.update = function () {

  }

  this.show = function () {

  }
}
