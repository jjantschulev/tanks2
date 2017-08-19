var pause;
var colourSelector;

function Pause() {
  this.paused = false;
  this.buttons = [];
  this.buttons.push(new Button(1*width/6, 2*height/3, 200, 'Map Editor', 24));
  this.buttons.push(new Button(3*width/6, 2*height/3, 200, 'Resume', 24));
  this.buttons.push(new Button(5*width/6, 2*height/3, 200, 'Change Colour', 24));


  this.use = function () {
    if(this.paused){
      this.showPauseMenu();

    }

  }

  this.showPauseMenu = function () {
    fill(tank.colour);
    textAlign(CENTER, CENTER);
    textSize(100);
    text('Paused', width/2, height/4);
    textSize(20);
    fill(120);
    text('(press ESC to return to game)', width/2, height/4 + 80);

    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].show();
    }
  }

  this.mouseClick = function () {
    if(!this.paused && !trackEditor.creatingTrack){
      return;
    }
    for (var i = 0; i < this.buttons.length; i++) {
      if(this.buttons[i].detectPress()){
        if(this.buttons[i].text == 'Map Editor'){
          trackEditor.changeMode();
        }
        if(this.buttons[i].text == 'Resume'){
          this.togglePause();
        }
        if(this.buttons[i].text == 'Change Colour'){
          colourSelector.toggleColourSelector();
        }
      }
    }
  }

  this.togglePause = function () {
    if(!trackEditor.creatingTrack){
      if(this.paused){
        this.paused = false;
      } else {
        this.paused = true;
      }
    }
  }
}

function ColourSelector() {
  this.colours = ['#10802E', '#E40C19', '#CE9621', '#3614A5'];
  this.selectingColour = false;

  this.show = function () {
    if (!this.selectingColour) {
      return;
    }
    fill(this.colours[0]);
    rect(0, 0, width/2, height/2);
    fill(this.colours[1]);
    rect(0, height/2, width/2, height/2);
    fill(this.colours[2]);
    rect(width/2, 0, width/2, height/2);
    fill(this.colours[3]);
    rect(width/2, height/2, width/2, height/2);
  }

  this.press = function () {
    if (!this.selectingColour) {
      return;
    }
    if(collidePointRect(mouseX, mouseY, 0, 0, width/2, height/2)){
      tank.loadImages('green');
    }
    if(collidePointRect(mouseX, mouseY, 0, height/2, width/2, height/2)){
      tank.loadImages('red');
    }
    if(collidePointRect(mouseX, mouseY, width/2, 0, width/2, height/2)){
      tank.loadImages('yellow');
    }
    if(collidePointRect(mouseX, mouseY, width/2, height/2, width/2, height/2)){
      tank.loadImages('blue');
    }
    this.toggleColourSelector();
  }

  this.toggleColourSelector = function () {
    if (this.selectingColour) {
      this.selectingColour = false;
    } else {
      this.selectingColour = true;
    }
  }
}

function Button(x, y, r, displayText, textHeight) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.text = displayText;
  this.textHeight = textHeight;

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
    if(dist(mouseX, mouseY, this.x, this.y) < this.r/2){
      return true;
    } else {
      return false;
    }
  }

  this.effects = function () {
    if(this.detectPress()){
      fill(tank.colour);
    } else {
      fill(120);
    }
  }
}
