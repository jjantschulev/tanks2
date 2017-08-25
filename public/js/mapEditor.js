function MapEditor() {
  this.currentWall = [];
  this.allWalls = [];
  this.active = false;
  this.eraser = false;
  this.menu = new MapEditorMenu();
  this.syncedWalls = [];
  this.showMenu = true;

  this.show = function () {
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
    if (this.showMenu) {
      this.menu.show();
    }
  }

  this.changeMode = function () {
      if(this.active){
        this.active = false;
      }else{
        this.loadLines();
        this.active = true;
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
    var buttonClicked = this.menu.mouseClick();
    if (!buttonClicked) {
      if(this.eraser){
        this.removePoint();
      }else {
        this.addPoint();
      }
    }
  }

  this.toggleEraser = function () {
    this.addLine();
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

function MapEditorMenu() {
  this.r = 60;
  this.x = width - this.r/2;
  this.y = this.r/2;

  this.buttons = [];
  this.buttons.push(new Button(this.x, this.y + 0 * this.r, this.r, 'Save', 12))
  this.buttons.push(new Button(this.x, this.y + 1 * this.r, this.r, 'Exit', 12))
  this.buttons.push(new Button(this.x, this.y + 2 * this.r, this.r, 'Clear', 12))
  this.buttons.push(new Button(this.x, this.y + 3 * this.r, this.r, 'Eraser', 12))
  this.buttons.push(new Button(this.x, this.y + 4 * this.r, this.r, 'Load', 12))
  this.buttons.push(new Button(this.x, this.y + 5 * this.r, this.r, 'Add Line', 12))

  this.show = function () {
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].show();
    }
  }

  this.mouseClick = function () {
    for (var i = 0; i < this.buttons.length; i++) {
      if(this.buttons[i].detectPress()){
        this.buttonLogic(i);
        return true;
      }
    }
  }


  this.buttonLogic = function (buttonIndex) {
    switch (buttonIndex) {
      case 0:
        pause.mapEditor.saveMap();
        break;
      case 1:
        pause.mapEditor.changeMode();
        break;
      case 2:
        pause.mapEditor.clearAll();
        break;
      case 3:
        pause.mapEditor.toggleEraser();
        break;
      case 4:
        pause.mapEditor.loadLines();
        break;
      case 5:
        pause.mapEditor.addLine();
        break;
    }
  }
}
