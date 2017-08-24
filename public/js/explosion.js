var explosions = [];
var gifExplosions = [];
var explosionGIF;
var particleEffects = [];

function showExplosions() {
  for (var i = explosions.length-1; i >= 0; i--) {
    explosions[i].show();
    explosions[i].update();
  }
  for (var i = particleEffects.length-1; i >= 0; i--) {
    particleEffects[i].show();
    particleEffects[i].update();
  }
  for (var i = gifExplosions.length-1; i >= 0; i--) {
    gifExplosions[i].show();
    gifExplosions[i].update();
  }
}

function Explosion(x, y, size, col, time) {
  this.x = x;
  this.y = y;
  this.timer = time;
  this.size = 0;
  this.sizeRate = size / this.timer;
  this.alpha = 180;
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

function ParticleEffect(x, y, col) {
  this.particles = [];
  this.x = x;
  this.y = y;
  this.colour = color(col);
  this.alpha = 255;
  this.timer = 30;
  this.alphaRate = this.alpha / this.timer;


  this.makeParticles = function () {
    for (var i = 0; i < 30; i++) {
      this.particles.push({
        x: this.x,
        y: this.y,
        speed: random(0.5, 2),
        dir: random(TWO_PI),
        size: random(3, 4)
      });
    }
  }
  this.makeParticles();
  this.update = function () {
    this.alpha -= this.alphaRate;
    this.timer --;
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].x += this.particles[i].speed * sin(this.particles[i].dir);
      this.particles[i].y -= this.particles[i].speed * cos(this.particles[i].dir);
    }
    if (this.timer <= 0) {
      particleEffects.splice(particleEffects.indexOf(this), 1);
      return;
    }
  }

  this.show = function () {
    for (var i = 0; i < this.particles.length; i++) {
      fill(red(this.colour), green(this.colour), blue(this.colour), this.alpha);
      noStroke();
      ellipse(this.particles[i].x, this.particles[i].y, this.particles[i].size, this.particles[i].size);
    }
  }
}

function GifExplosion(x, y) {
  this.x = x;
  this.y = y;
  this.timer = 80;
  this.image = loadGif('./assets/explosion.gif');

  this.update = function () {
    this.timer --;
    if(this.timer <= 0){
      gifExplosions.splice(gifExplosions.indexOf(this), 1);
    }
  }

  this.show = function () {
    imageMode(CENTER);
    image(this.image, this.x, this.y, 45, 45);
  }
}
