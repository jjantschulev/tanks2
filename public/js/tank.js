var tank;
var tanks = [];

function showTanks() {
  for (var i = 0; i < tanks.length; i++) {
    if (tanks[i].id != tank.id) {
      tanks[i].show();
    }
  }
}

function Tank() {
  this.pos = createVector(random(-fullWidth / 2, fullWidth / 2), random(-fullHeight / 2, fullHeight / 2));
  this.spawn = Cookies.getJSON('spawn');
  if (this.spawn != undefined) {
    this.pos.set(this.spawn.x, this.spawn.y);
  }
  this.previousPos = this.pos.copy();
  this.viewPos = this.pos.copy();
  this.dir = 0;
  this.gunDir = 0;
  this.speed = 0;
  this.dirVel = 0;
  this.gunDirVel = 0;
  this.useAi = false;
  this.speedMultiplyer = 1;

  this.w = 25.5;
  this.h = 30;

  this.id = '';

  this.colour = Cookies.get('tank_colour');
  if (this.colour == undefined) {
    var colours = ['seagreen', 'gold', 'firebrick', 'cornflowerblue'];
    var col = colours[Math.floor(random(4))];
    console.log(col);
    this.colour = col;
  }

  this.health = 100;
  this.maxHealth = 150;

  this.coins = 0;

  this.name = Cookies.get('name');
  if (this.name == undefined) {
    this.name = generateName();
  }
  this.displayName = generateName();

  //Weaponry
  this.gun = new Gun();
  this.weaponManager = new WeaponManager();
  this.ai = new AI();
  this.boostTimer = 0;
  this.boostLength = 400;

  this.update = function () {
    // UPDATE VARIABLES
    this.pos.x += this.speed * sin(this.dir);
    this.pos.y -= this.speed * cos(this.dir);
    this.dir += this.dirVel;
    this.gunDir += this.gunDirVel;
    this.respawnTimer--;
    this.boostTimer--;

    team.payForFlags();

    // SMOOTHEN TANK MOVEMENT
    this.viewPos.x = lerp(this.viewPos.x, this.pos.x, 0.6);
    this.viewPos.y = lerp(this.viewPos.y, this.pos.y, 0.6);

    // CHECKING
    this.collisions();

    // RESET VARIABLES
    this.speed = 0;
    this.dirVel = 0;
    this.gunDirVel = 0;
    this.useAi = false;
    if (this.speedMultiplyer <= 0.9) {
      this.speedMultiplyer += 0.1;
    } else {
      this.speedMultiplyer = 1;
    }

    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }

    // UPDATE WEAPONRY
    this.gun.update();
    if (this.useAi) {
      this.ai.update();
    }
  }

  this.show = function () {
    push();
    imageMode(CENTER);
    translate(this.viewPos.x, this.viewPos.y);

    // SHOW HEALTH BAR
    fill(color(this.colour));
    noStroke();
    rectMode(CENTER);
    rect(0, -30, map(this.health, 0, 100, 0, 30), 1.6);
    if (this.health > this.maxHealth - 25) {
      rect(-map(this.health, 0, 100, 0, 30) / 2, -30, 1.6, 3.8, 100);
      rect(map(this.health, 0, 100, 0, 30) / 2, -30, 1.6, 3.8, 100);
    }
    // SHOW NAME
    fill(120);
    textAlign(CENTER, CENTER);
    textSize(8);
    text(this.name, 0, -36);

    this.gun.showReloadTimers();

    // SHOW TANK
    rotate(this.dir);
    image(this.image, 0, 0, this.w, this.h);
    rotate(this.gunDir);
    image(this.gunImage, 0, -this.w / 4, this.w, this.h);
    pop();
    if (this.useAi) {
      this.ai.show();
    }
  }

  this.collisions = function () {
    this.pos.x = constrain(this.pos.x, -fullWidth / 2, fullWidth / 2);
    this.pos.y = constrain(this.pos.y, -fullHeight / 2, fullHeight / 2);

    var hit = false;
    for (var i = 0; i < walls.length; i++) {
      if (walls[i].tankColliding(this.pos)) {
        hit = true;
      }
    }
    for (var i = 0; i < this.weaponManager.bridges.length; i++) {
      if (this.weaponManager.bridges[i].colour != this.colour) {
        if (this.weaponManager.bridges[i].colliding()) {
          hit = true;
        }
      } else {
        if (this.weaponManager.bridges[i].colliding() && !this.weaponManager.bridges[i].onRoad()) {
          hit = true;
        }
      }
    }
    // 

    this.ai.colliding = hit;

    if (hit) {
      this.pos.set(this.previousPos);
      var phit = true;
      while (phit) {
        for (var i = 0; i < walls.length; i++) {
          if (walls[i].tankColliding(this.previousPos)) {
            phit = true;
            this.previousPos.set(random(width), random(height));
          } else {
            phit = false;
          }
        }
      }
    } else {
      this.previousPos.set(this.pos);
    }
  }

  this.death = function (name) {
    var deathData = {
      killerName: name,
      victimName: this.name,
      victimX: this.pos.x,
      victimY: this.pos.y
    }
    socket.emit('death', deathData);
    this.health = 100;
    if (this.spawn == undefined) {
      this.pos.set(random(width), random(height));
    } else {
      this.pos.set(this.spawn.x, this.spawn.y);
    }
    this.previousPos.set(this.pos);
    pause.deathScreen.toggleDeathScreen(name);
  }

  this.checkDeath = function (name) {
    if (this.health <= 0) {
      this.death(name);
    }
  }

  this.kill = function (name) {
    notify('You killed ' + name, 200, this.colour, width / 2);
    if (name != tank.name) {
      switch (team.getTeamPlayers(this.colour)) {
        case 1:
          this.health += 70;
          this.coins += 120;
          break;
        case 2:
          this.health += 50;
          this.coins += 100;
          break;
        default:
          this.health += 30;
          this.coins += 80;
          break;
      }
    } else {
      this.weaponManager.landmineAmount -= 2;
      this.weaponManager.bombAmount -= 2;
      this.weaponManager.blastAmount -= 2;
    }
  }

  this.teamKill = function (name) {
    notify('Your team gunner killed ' + name, 200, this.colour, width - width / 3);
    this.health += 30;
  }

  this.removeHealth = function (amount) {
    if (!pause.paused) {
      this.health -= amount;
    }
  }

  this.loadImages = function (col) {
    this.colour = col;
    this.image = loadImage('./assets/' + this.colour + '_body.png');
    this.gunImage = loadImage('./assets/' + this.colour + '_gun.png');
  }
  this.loadImages(this.colour);

  this.changeName = function (name) {
    if (name != null && name != undefined && name.length > 2) {
      this.name = name;
      Cookies.set('name', name);
      window.location.reload();
    } else {
      simpleNotify('invalid name');
    }
  }

  this.removeName = function () {
    Cookies.remove('name');
    window.location.reload();
  }

  this.setColour = function () {
    var colourAllowed = team.allowColour(tank.colour);
    if (colourAllowed) {
      return;
    } else {
      var colours = ['red', 'green', 'yellow', 'blue'];
      while (!colourAllowed) {
        col = colours[Math.floor(random(4))];
        colourAllowed = team.allowColour(col);
      }
      tank.loadImages(col);
    }
  }

  this.setSpawnPoint = function () {
    simpleNotify("Spawn point set here");
    Cookies.set('spawn', { x: this.pos.x, y: this.pos.y });
    this.spawn = { x: this.pos.x, y: this.pos.y };
  }
}

function EnemyTank() {
  this.pos = createVector(random(width), random(height));
  this.viewPos = this.pos.copy();
  this.dir = 0;
  this.gunDir = 0;
  this.viewDir = 0;
  this.viewGunDir = 0;

  this.w = 25.5;
  this.h = 30;

  this.id = "";
  this.colour = "yellow";
  this.paused = false;

  this.health = 100;
  this.maxHealth = 150;
  this.name = 'other';

  this.show = function () {
    if (this.paused) {
      return;
    }
    push();
    imageMode(CENTER);
    // SMOOTHEN TANK MOVEMENT
    this.viewPos.x = lerp(this.viewPos.x, this.pos.x, 0.6);
    this.viewPos.y = lerp(this.viewPos.y, this.pos.y, 0.6);
    this.viewDir = lerp(this.viewDir, this.dir, 0.6);
    this.viewGunDir = lerp(this.viewGunDir, this.gunDir, 0.6);

    translate(this.viewPos.x, this.viewPos.y);

    // SHOW HEALTH BAR
    fill(this.colour);
    noStroke();
    rectMode(CENTER);
    rect(0, -30, map(this.health, 0, 100, 0, 30), 1.6);
    if (this.health > this.maxHealth - 25) {
      rect(-map(this.health, 0, 100, 0, 30) / 2, -30, 1.6, 3.8, 100);
      rect(map(this.health, 0, 100, 0, 30) / 2, -30, 1.6, 3.8, 100);
    }

    // SHOW NAME
    fill(120);
    textAlign(CENTER, CENTER);
    textSize(8);
    text(this.name, 0, -36);

    // SHOW TANK
    rotate(this.viewDir);
    image(this.image, 0, 0, this.w, this.h);
    rotate(this.viewGunDir);
    image(this.gunImage, 0, -this.w / 4, this.w, this.h);
    pop();
  }

  this.loadImages = function (col) {
    this.colour = col;
    this.image = loadImage('./assets/' + this.colour + '_body.png');
    this.gunImage = loadImage('./assets/' + this.colour + '_gun.png');
  }
  this.loadImages(this.colour);
}

function generateName() {
  var nouns = ['avogadro', 'fairy', 'lad', 'sebastian', 'beau', 'email', 'letter', 'parcel', 'snake', 'grass', 'gravel', 'squirrel', 'doctor', 'teacher', 'developer', 'cook', 'bus', 'skeleton', 'jumpy-thing', 'cat', 'dog', 'monster', 'duck', 'politician', 'car', 'auto', 'truck', 'rocket', 'fly', 'leech', 'apple', 'book', 'frog', 'spam', 'eggs', 'rabbit', 'elephant', 'rock', 'horse', 'robot', 'avocado', 'salad', 'bread', 'shoe', 'donkey', 'mouse', 'spinach', 'german', 'french', 'italian', 'beats', 'japanese', 'american', 'tree', 'forest', 'piano', 'computer', 'wall', 'fred', 'bob', 'richard', 'beef', 'potato', 'tomato'];
  var adjectives = ['crunchy', 'bouyant', 'engorged', 'fancyful', 'convoluted', 'speedy', 'old', 'eletrified', 'corrupt', 'thick', 'black', 'asian', 'insane', 'annoying', 'exciting', 'boring', 'sophisticated', 'educated', 'lame', 'deadly', 'comical', 'undefined', 'young', 'old', 'middle-aged', 'radical', 'putrid', 'beautiful', 'primitive', 'animalistic', 'relaxing', 'superb', 'rude', 'ruthless', 'relentless', 'racist', 'clever', 'dumb', 'interesting', 'silly', 'wild', 'partying', 'green', 'blue', 'red', 'orange', 'brown', 'purple', 'fat', 'quick', 'slow', 'yummy', 'electric', 'charged', 'sad', 'stuuupid', 'cool', 'uncool', 'amazing', 'phat', 'loud', 'soft', 'dead', 'alive', 'smart', 'stinking', 'clean', 'large', 'miniscule', 'vegetarian', 'beef-eating', 'loving', 'hateful', 'mediocre'];
  var name = '-' + adjectives[Math.floor(random(adjectives.length))]
    + '-' + adjectives[Math.floor(random(adjectives.length))]
    + '-' + nouns[Math.floor(random(nouns.length))] + '-';
  console.log(nouns.length * adjectives.length * adjectives.length);
  return name;
}
