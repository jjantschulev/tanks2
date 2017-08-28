var pause;

function Pause() {
  this.paused = true;
  this.buttons = [];
  this.buttons.push(new Button(1 * width / 6, 2 * height / 3, 200, 'Map Editor', 24));
  this.buttons.push(new Button(3 * width / 6, 2 * height / 3, 200, 'Shop', 24));
  this.buttons.push(new Button(5 * width / 6, 2 * height / 3, 200, 'Change Colour', 24));

  this.mapEditor = new MapEditor();
  this.colorSelect = new ColorSelect();
  this.deathScreen = new DeathScreen();
  this.shop = new Shop();

  this.use = function () {
    if (this.paused) {
      this.show();
    }
  }

  this.show = function () {
    fill(0);
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, height);

    fill(tank.colour);
    textAlign(CENTER, CENTER);
    textSize(100);
    text('Paused', width / 2, height / 4);
    textSize(20);
    fill(120);
    text('(press ESC to return to game)', width / 2, height / 4 + 80);

    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].show();
    }

    if (this.mapEditor.active) {
      this.mapEditor.show();
    }
    if (this.colorSelect.active) {
      this.colorSelect.show();
    }
    if (this.shop.active) {
      this.shop.show();
    }

    this.deathScreen.show();
  }

  this.mouseClick = function () {
    if (this.mapEditor.active) {
      this.mapEditor.mouseClick();
      return;
    } else if (this.colorSelect.active) {
      this.colorSelect.mouseClick();
      return;
    } else if (this.shop.active) {
      this.shop.mouseClick();
      return;
    } else {
      for (var i = 0; i < this.buttons.length; i++) {
        if (this.buttons[i].detectPress()) {
          if (this.buttons[i].text == 'Map Editor') {
            this.mapEditor.changeMode();
          }
          if (this.buttons[i].text == 'Shop') {
            this.shop.toggle();
          }
          if (this.buttons[i].text == 'Change Colour') {
            this.colorSelect.toggleColorSelect();
          }
        }
      }
    }
  }

  this.togglePause = function () {
    if (this.paused) {
      tank.weaponManager.pushTank(tank.pos.x + 1, tank.pos.y + 1, 35, random(TWO_PI));
      this.paused = false;
    } else {
      this.paused = true;
    }
  }

}

function Shop() {
  this.active = false;
  this.buttons = [];
  this.buttons.push(new Button(80, 60, 60, 'Back', 17));
  this.buttons.push(new Button(1 * width / 8, 2 * height / 6, 180, 'LANDMINE \n ' + tank.weaponManager.landminePrice + ' coins', 20));
  this.buttons.push(new Button(3 * width / 8, 2 * height / 6, 180, 'BOMB \n ' + tank.weaponManager.bombPrice + ' coins', 20));
  this.buttons.push(new Button(5 * width / 8, 2 * height / 6, 180, 'BLAST \n ' + tank.weaponManager.blastPrice + ' coins', 20));
  this.buttons.push(new Button(7 * width / 8, 2 * height / 6, 180, 'GUNNER \n ' + tank.weaponManager.gunnerPrice + ' coins', 20));


  this.show = function () {
    // set background
    fill(0);
    noStroke();
    rect(0, 0, width, height);

    // Title
    fill(255, 200, 100);
    textAlign(CENTER);
    textSize(60);
    text('Shop', width / 2, 60);

    //Show Coins
    textAlign(RIGHT);
    textSize(30);
    text('coins: ' + tank.coins, width - 40, 60);

    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].show();
    }

    tank.weaponManager.showInfo();
  }

  this.mouseClick = function () {
    for (var i = 0; i < this.buttons.length; i++) {
      var b = this.buttons[i];
      if (b.detectPress()) {
        switch (i) {
          case 0:
            this.toggle();
            break;
          case 1:
            if (tank.coins - tank.weaponManager.landminePrice >= 0 && tank.weaponManager.landmineAmount < 10) {
              tank.coins -= tank.weaponManager.landminePrice;
              tank.weaponManager.landmineAmount++;
            }
            break;
          case 2:
            if (tank.coins - tank.weaponManager.bombPrice >= 0 && tank.weaponManager.bombAmount < 10) {
              tank.coins -= tank.weaponManager.bombPrice;
              tank.weaponManager.bombAmount++;
            }
            break;
          case 3:
            if (tank.coins - tank.weaponManager.blastPrice >= 0 && tank.weaponManager.blastAmount < 10) {
              tank.coins -= tank.weaponManager.blastPrice;
              tank.weaponManager.blastAmount++;
            }
            break;
          case 4:
            if (tank.coins - tank.weaponManager.gunnerPrice >= 0 && tank.weaponManager.gunnerAmount < 10) {
              tank.coins -= tank.weaponManager.gunnerPrice;
              tank.weaponManager.gunnerAmount++;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  this.toggle = function () {
    if (this.active) {
      this.active = false;
    } else {
      this.active = true;
    }
  }
}

function ColorSelect() {
  this.colours = ['#10802E', '#E40C19', '#CE9621', '#3614A5'];
  this.active = false;

  this.show = function () {
    fill(this.colours[0]);
    rect(0, 0, width / 2, height / 2);
    fill(this.colours[1]);
    rect(0, height / 2, width / 2, height / 2);
    fill(this.colours[2]);
    rect(width / 2, 0, width / 2, height / 2);
    fill(this.colours[3]);
    rect(width / 2, height / 2, width / 2, height / 2);
  }

  this.mouseClick = function () {
    var newColour = "";
    if (collidePointRect(mouseX, mouseY, 0, 0, width / 2, height / 2)) {
      newColour = "green";
    }
    if (collidePointRect(mouseX, mouseY, 0, height / 2, width / 2, height / 2)) {
      newColour = "red";
    }
    if (collidePointRect(mouseX, mouseY, width / 2, 0, width / 2, height / 2)) {
      newColour = "yellow";
    }
    if (collidePointRect(mouseX, mouseY, width / 2, height / 2, width / 2, height / 2)) {
      newColour = "blue";
    }
    if (team.allowColour(newColour)) {
      tank.loadImages(newColour);
      this.toggleColorSelect();
      Cookies.set('tank_colour', tank.colour);
    }
  }

  this.toggleColorSelect = function () {
    if (this.active) {
      this.active = false;
    } else {
      this.active = true;
    }
  }
}

function DeathScreen() {
  this.dead = false;
  this.respawnTimer = 0;
  this.killerName = '';

  this.show = function () {
    this.respawnTimer--;
    if (this.respawnTimer == 0) {
      this.toggleDeathScreen('');
    }
    if (this.dead) {
      fill(0);
      rect(0, 0, width, height);
      fill(tank.colour);
      textAlign(CENTER, CENTER);
      textSize(100);
      text('You Died', width / 2, height / 2);
      fill(120);
      textSize(30);
      text('you were killed by ' + this.killerName, width / 2, height / 2 + 100);
      textSize(20);
      text('respawning in ' + Math.round(this.respawnTimer / 60) + 's', width / 2, height / 2 + 150);
    }
  }

  this.toggleDeathScreen = function (n) {
    if (this.dead) {
      this.dead = false;
      pause.paused = false;
      this.killerName = '';
    } else {
      this.dead = true;
      pause.paused = true;
      this.respawnTimer = 300;
      this.killerName = n;
    }
  }
}

function Button(x, y, r, displayText, textHeight) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.text = displayText;
  this.textHeight = textHeight;
  this.active = false;

  this.show = function () {
    this.effects();
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
    fill(0);
    textSize(this.textHeight);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
  }

  this.detectPress = function () {
    if (dist(mouseX, mouseY, this.x, this.y) < this.r / 2) {
      return true;
    } else {
      return false;
    }
  }

  this.toggleActive = function () {
    if (this.active) {
      this.active = false;
    } else {
      this.active = true;
    }
  }

  this.effects = function () {
    if (this.detectPress() || this.active) {
      fill(tank.colour);
    } else {
      fill(120);
    }
  }
}
