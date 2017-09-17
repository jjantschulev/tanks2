function Shop() {
  this.active = false;
  this.items = [];
  this.items.push(new Item(1 * width / 4 - 125, 320, "Landmine"));
  this.items.push(new Item(2 * width / 4 - 125, 320, "Bomb"));
  this.items.push(new Item(3 * width / 4 - 125, 320, "Boost"));
  this.items.push(new Item(4 * width / 4 - 125, 320, "Gunner"));
  this.items.push(new Item(1 * width / 4 - 125, 620, "Bridge"));
  this.backButton = new Button(80, 60, 60, 'Back', 17);

  this.show = function () {
    // set background
    fill(0);
    noStroke();
    rect(0, 0, width, height);

    // Title
    fill(tank.colour);
    textAlign(CENTER);
    textSize(60);
    text('Shop', width / 2, 60);



    for (var i = 0; i < this.items.length; i++) {
      this.items[i].show();
    }
    this.backButton.show();

    tank.weaponManager.showInfo();
  }

  this.mouseClick = function () {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].mClick();
    }
    if (this.backButton.detectPress()) {
      this.toggle();
    }
  }

  this.toggle = function () {
    if (this.active) {
      pause.onHomeScreen = true;
      this.active = false;
    } else {
      pause.onHomeScreen = false;
      this.active = true;
    }
  }
}


function Item(x, y, type) {
  this.x = x;
  this.y = y;
  this.w = 200;
  this.h = 250;
  this.type = type;
  this.price = 0;

  if (this.type == "Landmine") {
    this.price = tank.weaponManager.landminePrice;
  }
  if (this.type == "Bomb") {
    this.price = tank.weaponManager.bombPrice;
  }
  if (this.type == "Boost") {
    this.price = tank.weaponManager.blastPrice;
  }
  if (this.type == "Gunner") {
    this.price = tank.weaponManager.gunnerPrice;
  }
  if (this.type == "Bridge") {
    this.price = tank.weaponManager.bridgePrice;
  }

  this.buyButton = new Button(this.x - 45, this.y + 60, 70, 'Buy', 20);
  this.sellButton = new Button(this.x + 45, this.y + 60, 70, 'Sell', 20);


  this.show = function () {
    rectMode(CENTER);
    fill(tank.colour);
    rect(this.x, this.y, this.w, this.h, 10);
    fill(0);
    textSize(40);
    textAlign(CENTER);
    text(this.type, this.x, this.y - 70);
    textSize(24);
    text(this.price + " coins", this.x, this.y - 20);

    this.buyButton.show();
    this.sellButton.show();
  }

  this.mClick = function () {
    if (this.buyButton.detectPress()) {
      if (this.type == "Landmine") {
        if (tank.coins - this.price >= 0 && tank.weaponManager.landmineAmount < tank.weaponManager.landmineLimit) {
          tank.weaponManager.landmineAmount++;
          tank.coins -= this.price;
        }
      }
      if (this.type == "Bomb") {
        if (tank.coins - this.price >= 0 && tank.weaponManager.bombAmount < tank.weaponManager.bombLimit) {
          tank.weaponManager.bombAmount++;
          tank.coins -= this.price;
        }
      }
      if (this.type == "Boost") {
        if (tank.coins - this.price >= 0 && tank.weaponManager.blastAmount < tank.weaponManager.blastLimit) {
          tank.weaponManager.blastAmount++;
          tank.coins -= this.price;
        }
      }
      if (this.type == "Gunner") {
        if (tank.coins - this.price >= 0 && tank.weaponManager.gunnerAmount < tank.weaponManager.gunnerLimit) {
          tank.weaponManager.gunnerAmount++;
          tank.coins -= this.price;
        }
      }
      if (this.type == "Bridge") {
        if (tank.coins - this.price >= 0 && tank.weaponManager.bridgeAmount < tank.weaponManager.bridgeLimit) {
          tank.weaponManager.bridgeAmount++;
          tank.coins -= this.price;
        }
      }
    }

    if (this.sellButton.detectPress()) {
      if (this.type == "Landmine") {
        if (tank.weaponManager.landmineAmount > 0) {
          tank.weaponManager.landmineAmount--;
          tank.coins += this.price;
        }
      }
      if (this.type == "Bomb") {
        if (tank.weaponManager.bombAmount > 0) {
          tank.weaponManager.bombAmount--;
          tank.coins += this.price;
        }
      }
      if (this.type == "Boost") {
        if (tank.weaponManager.blastAmount > 0) {
          tank.weaponManager.blastAmount--;
          tank.coins += this.price;
        }
      }
      if (this.type == "Gunner") {
        if (tank.weaponManager.gunnerAmount > 0) {
          tank.weaponManager.gunnerAmount--;
          tank.coins += this.price;
        }
      }
      if (this.type == "Bridge") {
        if (tank.weaponManager.bridgeAmount > 0) {
          tank.weaponManager.bridgeAmount--;
          tank.coins += this.price;
        }
      }
    }
  }
}