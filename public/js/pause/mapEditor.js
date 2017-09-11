function MapEditor() {
  this.currentWall = [];
  this.allWalls = [];
  this.currentWater = [];
  this.allWaters = [];

  this.active = false;
  this.eraser = false;
  this.watering = false;

  this.menu = new MapEditorMenu();
  this.syncedWalls = [];
  this.syncedWaters = [];
  this.showMenu = true;

  this.viewScale = 1;
  this.tx = 0;
  this.ty = 0;

  this.show = function () {
    // pan around
    if (mouseIsPressed) {
      if (mouseButton == RIGHT) {
        this.tx += pmouseX - mouseX;
        this.ty += pmouseY - mouseY;
      }
    }

    push()
    translate(width / 2, height / 2);
    scale(this.viewScale);
    this.tx = constrain(this.tx, -fullWidth / 2 + width / 2 / this.viewScale, fullWidth / 2 - width / 2 / this.viewScale);
    this.ty = constrain(this.ty, -fullHeight / 2 + height / 2 / this.viewScale, fullHeight / 2 - height / 2 / this.viewScale);
    translate(-this.tx, -this.ty);

    //background:
    noStroke();
    fill(20);
    rect(-fullWidth / 2, -fullHeight / 2, fullWidth, fullHeight);


    //show waters
    stroke(50, 50, 255);
    fill(50, 50, 255);
    strokeWeight(35);
    if (this.currentWater.length == 1) {
      noStroke();
      ellipse(this.currentWater[0].x, this.currentWater[0].y, 35, 35);
    }
    for (var i = 0; i < this.currentWater.length - 1; i++) {
      line(this.currentWater[i].x, this.currentWater[i].y, this.currentWater[i + 1].x, this.currentWater[i + 1].y);
    }


    stroke(0, 0, 255);
    for (var j = 0; j < this.allWaters.length; j++) {
      for (var i = 0; i < this.allWaters[j].length - 1; i++) {
        line(this.allWaters[j][i].x, this.allWaters[j][i].y, this.allWaters[j][i + 1].x, this.allWaters[j][i + 1].y);
      }
    }

    //show walls
    stroke(100);
    strokeWeight(15);
    for (var j = 0; j < this.allWalls.length; j++) {
      for (var i = 0; i < this.allWalls[j].length - 1; i++) {
        line(this.allWalls[j][i].x, this.allWalls[j][i].y, this.allWalls[j][i + 1].x, this.allWalls[j][i + 1].y);
      }
    }

    stroke(140);
    fill(140);
    if (this.currentWall.length == 1) {
      noStroke();
      ellipse(this.currentWall[0].x, this.currentWall[0].y, 15, 15);
    }
    for (var i = 0; i < this.currentWall.length - 1; i++) {
      line(this.currentWall[i].x, this.currentWall[i].y, this.currentWall[i + 1].x, this.currentWall[i + 1].y);
    }



    if (this.eraser) {
      stroke(255, 0, 0);
      strokeWeight(3);
      line(this.grmp().x - 10, this.grmp().y - 10, this.grmp().x + 10, this.grmp().y + 10);
      line(this.grmp().x + 10, this.grmp().y - 10, this.grmp().x - 10, this.grmp().y + 10);
    }

    pop();


    if (this.showMenu) {
      this.menu.show();
    }
  }

  this.grmp = function () {
    return {
      x: map(mouseX, 0, width, this.tx - width / this.viewScale / 2, this.tx + width / this.viewScale / 2),
      y: map(mouseY, 0, height, this.ty - height / this.viewScale / 2, this.ty + height / this.viewScale / 2),
    }
  }

  this.changeMode = function () {
    if (this.active) {
      this.currentWall = [];
      this.currentWater = [];
      pause.onHomeScreen = true;
      this.active = false;
    } else {
      this.loadLines();
      pause.onHomeScreen = false;
      this.active = true;
    }
  }

  this.addLine = function () {
    if (this.eraser) {
      this.menu.buttons[3].active = false;
      this.eraser = false;
    }
    if (this.currentWall.length > 1) {
      this.allWalls.push(this.currentWall);
    }
    this.currentWall = [];
    this.addWaterLine();
  }

  this.addWaterLine = function () {
    if (this.eraser) {
      this.menu.buttons[3].active = false;
      this.eraser = false;
    }
    if (this.currentWater.length > 1) {
      this.allWaters.push(this.currentWater);
    }
    this.currentWater = [];
  }

  this.addPoint = function () {
    this.currentWall.push({
      x: this.grmp().x,
      y: this.grmp().y
    });
  }

  this.addWaterPoint = function () {
    this.currentWater.push({
      x: this.grmp().x,
      y: this.grmp().y
    });
  }

  this.removePoint = function () {
    for (var i = this.allWalls.length - 1; i >= 0; i--) {
      for (var j = 0; j < this.allWalls[i].length; j++) {
        if (dist(this.allWalls[i][j].x, this.allWalls[i][j].y, this.grmp().x, this.grmp().y) < 10) {
          if (this.allWalls[i].length > 2) {
            var newArrayLess = this.allWalls[i].slice(0, j);
            var newArrayMore = this.allWalls[i].slice(j + 1, this.allWalls[i].length);
            this.allWalls.push(newArrayLess);
            this.allWalls.push(newArrayMore);
          }
          this.allWalls.splice(i, 1);
        }
      }
    }

    for (var i = this.allWaters.length - 1; i >= 0; i--) {
      for (var j = 0; j < this.allWaters[i].length; j++) {
        if (dist(this.allWaters[i][j].x, this.allWaters[i][j].y, this.grmp().x, this.grmp().y) < 10) {
          if (this.allWaters[i].length > 2) {
            var newArrayLess = this.allWaters[i].slice(0, j);
            var newArrayMore = this.allWaters[i].slice(j + 1, this.allWaters[i].length);
            this.allWaters.push(newArrayLess);
            this.allWaters.push(newArrayMore);
          }
          this.allWaters.splice(i, 1);
        }
      }
    }
  }

  this.undo = function () {
    if (this.currentWall.length == 1) {
      this.currentWall = [];
    } else {
      this.addLine();
      this.allWalls.splice(-1, 1);
    }
  }

  this.clearAll = function () {
    this.currentWall = [];
    this.currentWater = [];
    this.allWalls = [];
    this.allWaters = [];
  }

  this.mouseClick = function () {
    if (mouseButton == LEFT) {
      var buttonClicked = this.menu.mouseClick();
      if (!buttonClicked) {
        if (this.eraser) {
          this.removePoint();
        } else if (this.watering) {
          this.addWaterPoint();
        } else {
          this.addPoint();
        }
      }
    }
  }

  this.toggleEraser = function () {
    if (this.eraser) {
      this.eraser = false;
      this.menu.buttons[3].active = false;
    } else {
      this.menu.buttons[3].active = true;
      this.eraser = true;
    }
    if (this.currentWall.length > 1) {
      this.allWalls.push(this.currentWall);
    }
    if (this.currentWater.length > 1) {
      this.allWaters.push(this.currentWater);
    }
    this.currentWall = [];
    this.currentWater = [];
  }

  this.toggleWater = function () {
    if (this.watering) {
      this.watering = false;
      this.menu.buttons[6].active = false;
    } else {
      this.menu.buttons[6].active = true;
      this.watering = true;
    }
  }

  this.saveMap = function () {
    this.addLine();
    this.addWaterLine();
    this.syncedWalls = this.allWalls;
    this.syncedWaters = this.allWaters;
    this.createWallsFromArray(this.allWalls);
    this.createWatersFromArray(this.allWaters);
    socket.emit("new_map", this.allWalls, this.allWaters);
    this.changeMode();
  }

  this.newMap = function (dataWalls, dataWaters) {
    this.syncedWalls = dataWalls;
    this.syncedWaters = dataWaters;
    this.createWallsFromArray(dataWalls);
    this.createWatersFromArray(dataWaters)
  }

  this.loadLines = function () {
    this.allWalls = this.syncedWalls;
    this.allWaters = this.syncedWaters;
  }

  this.createWallsFromArray = function (wallData) {
    walls = [];
    for (var j = 0; j < wallData.length; j++) {
      if (wallData[j].length > 1) {
        for (var i = 0; i < wallData[j].length - 1; i++) {
          walls.push(new Wall(wallData[j][i].x, wallData[j][i].y, wallData[j][i + 1].x, wallData[j][i + 1].y));
        }
      }
    }
  }

  this.createWatersFromArray = function (waterData) {
    waters = [];
    for (var j = 0; j < waterData.length; j++) {
      if (waterData[j].length > 1) {
        for (var i = 0; i < waterData[j].length - 1; i++) {
          waters.push(new Water(waterData[j][i].x, waterData[j][i].y, waterData[j][i + 1].x, waterData[j][i + 1].y));
        }
      }
    }
  }
}

function MapEditorMenu() {
  this.r = 60;
  this.x = width - this.r / 2;
  this.y = this.r / 2;

  this.buttons = [];
  this.buttons.push(new Button(this.x, this.y + 0 * this.r, this.r, 'Save', 12))
  this.buttons.push(new Button(this.x, this.y + 1 * this.r, this.r, 'Exit', 12))
  this.buttons.push(new Button(this.x, this.y + 2 * this.r, this.r, 'Clear', 12))
  this.buttons.push(new Button(this.x, this.y + 3 * this.r, this.r, 'Eraser', 12))
  this.buttons.push(new Button(this.x, this.y + 4 * this.r, this.r, 'Undo', 12))
  this.buttons.push(new Button(this.x, this.y + 5 * this.r, this.r, 'Add Line', 12))
  this.buttons.push(new Button(this.x, this.y + 6 * this.r, this.r, 'Water', 12))

  this.show = function () {
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].show();
    }
  }

  this.mouseClick = function () {
    for (var i = 0; i < this.buttons.length; i++) {
      if (this.buttons[i].detectPress()) {
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
        pause.mapEditor.undo();
        break;
      case 5:
        pause.mapEditor.addLine();
        break;
      case 6:
        pause.mapEditor.toggleWater();
        break;
    }
  }
}
