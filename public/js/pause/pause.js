var pause;

function Pause() {
  this.paused = true;
  this.onHomeScreen = true;
  this.buttons = [];
  this.buttons.push(new Button(1 * width / 10, 2 * height / 3, 160, 'Map Editor', 20));
  this.buttons.push(new Button(3 * width / 10, 2 * height / 3, 160, 'Shop', 20));
  this.buttons.push(new Button(5 * width / 10, 2 * height / 3, 160, 'Resume', 20));
  this.buttons.push(new Button(7 * width / 10 - 43, 2 * height / 3 - 43, 70, 'Change \n Gun \n Control', 12));
  this.buttons.push(new Button(7 * width / 10 + 43, 2 * height / 3 + 43, 70, 'Remove \n Name', 12));
  this.buttons.push(new Button(7 * width / 10 - 43, 2 * height / 3 + 43, 70, 'Remove \n Spawn', 12));
  this.buttons.push(new Button(7 * width / 10 + 43, 2 * height / 3 - 43, 70, 'Change \n Name', 12));
  this.buttons.push(new Button(9 * width / 10, 2 * height / 3, 160, 'Change Colour', 20));

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
          if (this.buttons[i].text == 'Resume') {
            this.togglePause();
          }
          if (this.buttons[i].text == 'Change \n Gun \n Control') {
            tank.gun.toggleTrackMouse();
          }
          if (this.buttons[i].text == 'Change \n Name') {
            var newName = prompt('Enter Your Name');
            tank.changeName(newName);
          }
          if (this.buttons[i].text == 'Remove \n Name') {
            tank.removeName();
          }
          if (this.buttons[i].text == 'Remove \n Spawn') {
            Cookies.remove('spawn');
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


function ColorSelect() {
  this.colours = ['seagreen', 'gold', 'firebrick', 'cornflowerblue'];
  this.active = false;
  this.backButton = new Button(60, 60, 80, 'Back', 20);

  this.show = function () {
    fill(this.colours[0]);
    rect(0, 0, width / 2, height / 2);
    fill(this.colours[1]);
    rect(0, height / 2, width / 2, height / 2);
    fill(this.colours[2]);
    rect(width / 2, 0, width / 2, height / 2);
    fill(this.colours[3]);
    rect(width / 2, height / 2, width / 2, height / 2);
    this.backButton.show();
  }

  this.mouseClick = function () {
    if (this.backButton.detectPress()) {
      this.toggleColorSelect();
      return;
    }
    var newColour = "";
    if (collidePointRect(mouseX, mouseY, 0, 0, width / 2, height / 2)) {
      newColour = this.colours[0];
    }
    if (collidePointRect(mouseX, mouseY, 0, height / 2, width / 2, height / 2)) {
      newColour = this.colours[1];
    }
    if (collidePointRect(mouseX, mouseY, width / 2, 0, width / 2, height / 2)) {
      newColour = this.colours[2];
    }
    if (collidePointRect(mouseX, mouseY, width / 2, height / 2, width / 2, height / 2)) {
      newColour = this.colours[3];
    }
    if (team.allowColour(newColour)) {
      tank.loadImages(newColour);
      this.toggleColorSelect();
      Cookies.set('tank_colour', tank.colour);
    }
  }

  this.toggleColorSelect = function () {
    if (this.active) {
      pause.onHomeScreen = true;
      this.active = false;
    } else {
      pause.onHomeScreen = false;
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
    stroke(0);
    strokeWeight(2);
    ellipse(this.x, this.y, this.r, this.r);
    noStroke();
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
      fill(150);
    }
  }
}
