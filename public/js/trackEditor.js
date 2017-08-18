var trackEditor;

function TrackEditor() {
  this.currentWall = [];
  this.allWalls = [];
  this.creatingTrack = false;
  this.eraser = false;
  this.menu = new TrackEditorMenu();
  this.syncedWalls = [];

  this.show = function () {
    if (this.creatingTrack) {
      noStroke();
      fill(20);
      rect(0, 0, width, height);
      stroke(100);
      strokeWeight(15);
      for (var j = 0; j < this.allWalls.length; j++) {
        if (this.allWalls[j].length == 1) {
          fill(100);
          noStroke();
          ellipse(this.allWalls[j][0].x, this.allWalls[j][0].y, 15, 15);
        }
        for (var i = 0; i < this.allWalls[j].length-1; i++) {
          line(this.allWalls[j][i].x, this.allWalls[j][i].y, this.allWalls[j][i+1].x, this.allWalls[j][i+1].y);
        }
      }
      stroke(140);
      fill(140);
      if(this.currentWall.length == 1){
        noStroke();
        ellipse(this.currentWall[0].x, this.currentWall[0].y, 15, 15);
      }
      for (var i = 0; i < this.currentWall.length-1; i++) {
        line(this.currentWall[i].x, this.currentWall[i].y, this.currentWall[i+1].x, this.currentWall[i+1].y);
      }

      if (this.eraser) {
        stroke(255, 0, 0);
        strokeWeight(3);
        line(mouseX - 10, mouseY - 10, mouseX + 10, mouseY + 10);
        line(mouseX + 10, mouseY - 10, mouseX - 10, mouseY + 10);
      }
      this.menu.show();
    }

  }

  this.changeMode = function () {
    if(this.creatingTrack){
      this.creatingTrack = false;
    }else{
      this.creatingTrack = true;
    }
  }

  this.addLine = function () {
    this.allWalls.push(this.currentWall);
    this.currentWall = [];
  }

  this.addPoint = function () {
    this.currentWall.push({
      x: mouseX,
      y: mouseY
    });
  }

  this.removePoint = function () {
    for (var i = 0; i < this.allWalls.length; i++) {
      for (var j = 0; j < this.allWalls[i].length; j++) {
        if(dist(this.allWalls[i][j].x, this.allWalls[i][j].y, mouseX, mouseY) < 10){
          var newArrayLess = [];
          var newArrayMore = [];
          for (var k = 0; k < j; k++){
            newArrayLess.push(this.allWalls[i][k]);
          }
          for (var l = j+1; l < this.allWalls[i].length; l++) {
            newArrayMore.push(this.allWalls[i][l]);
          }
          this.allWalls.splice(i, 1);
          this.allWalls.push(newArrayLess);
          this.allWalls.push(newArrayMore);
          break;
        }
      }
    }
  }

  this.clearAll = function () {
    this.currentWall = [];
    this.allWalls = [];
    this.eraser = false;
  }

  this.mouseClick = function () {
    if(this.creatingTrack){
      var buttonClicked = false;
      var whichButton;
      for (var i = 0; i < 6; i++) {
        if (this.menu.buttonPressed(this.menu.y + this.menu.r * i)){
          buttonClicked = true;
          whichButton = i;
        }
      }
      if (buttonClicked) {
        this.menu.buttonLogic(whichButton);
      }else if(this.eraser){
        this.removePoint();
      }else {
        this.addPoint();
      }
    }
  }

  this.toggleEraser = function () {
    if(this.eraser){
      this.eraser = false;
    }else {
      this.eraser = true;
    }
  }

  this.saveMap = function () {
    this.addLine();
    this.syncedWalls = this.allWalls;
    this.createWallsFromArray(this.allWalls);
    socket.emit("new_map", this.allWalls);
    this.changeMode();
  }

  this.newMap = function (data) {
    this.syncedWalls = data;
    this.createWallsFromArray(data);
  }

  this.loadLines = function () {
    this.allWalls = this.syncedWalls;
  }

  this.createWallsFromArray = function (wallData) {
    walls = [];
    for (var j = 0; j < wallData.length; j++) {
      for (var i = 0; i < wallData[j].length-1; i++) {
        walls.push(new Wall(wallData[j][i].x, wallData[j][i].y, wallData[j][i+1].x, wallData[j][i+1].y));
      }
    }
  }
}

function TrackEditorMenu() {
  this.r = 60;
  this.x = width - this.r/2;
  this.y = this.r/2;

  this.show = function () {
    noStroke();
    this.showButton('Save', this.y + this.r * 0, 0);
    this.showButton('Exit', this.y + this.r * 1), 0;
    this.showButton('Clear', this.y + this.r * 2, 0);
    if (trackEditor.eraser) {
      this.showButton('Eraser', this.y + this.r * 3, 3);
    }else{
      this.showButton('Eraser', this.y + this.r * 3, 0);
    }
    this.showButton('Add Line', this.y + this.r * 4, 0);
    this.showButton('Load', this.y + this.r * 5, 0);

    this.effects();
  }

  this.showButton = function (t, y, highlight) {
    fill(100);
    if(highlight == 3){
      fill(255, 100, 0);
    }
    if(highlight == 2){
      fill(255, 100, 0, 200);
    }
    if(highlight == 1){
      fill(255, 100, 0, 100);
    }
    ellipse(this.x, y, this.r-5, this.r-5);
    fill(0);
    textAlign(CENTER, CENTER);
    text(t, this.x, y);
  }

  this.buttonPressed = function (y) {
    if(dist(this.x, y, mouseX, mouseY)<this.r/2){
      return true;
    }else{
      return false;
    }
  }

  this.buttonLogic = function (whichButton) {
    switch (whichButton) {
      case 0:
        trackEditor.saveMap();
        break;
      case 1:
        trackEditor.changeMode();
        break;
      case 2:
        trackEditor.clearAll();
        break;
      case 3:
        trackEditor.toggleEraser();
        break;
      case 4:
        trackEditor.addLine();
        break;
      case 5:
        trackEditor.loadLines();
        break;
    }
  }

  this.effects = function () {
    if (mouseIsPressed) {
      for (var i = 0; i < 6; i++) {
        if (this.buttonPressed(this.y + this.r * i)){
          this.showButton('', this.y + this.r * i, 2);
        }
      }
    }else{
      for (var i = 0; i < 6; i++) {
        if (this.buttonPressed(this.y + this.r * i)){
          this.showButton('', this.y + this.r * i, 1);
        }
      }
    }
  }
}
