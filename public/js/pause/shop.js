function Shop() {
  this.active = false;
  this.buttons = [];
  this.items = [];
  // this.items.push(new Item(width / 2, height / 2, "landmine", 100));
  this.buttons.push(new Button(80, 60, 60, 'Back', 17));
  this.buttons.push(new Button(1 * width / 8, 320, 150, 'LANDMINE\n' + tank.weaponManager.landminePrice + ' coins', 20));
  this.buttons.push(new Button(3 * width / 8, 320, 150, 'BOMB\n' + tank.weaponManager.bombPrice + ' coins', 20));
  this.buttons.push(new Button(5 * width / 8, 320, 150, 'BLAST\n' + tank.weaponManager.blastPrice + ' coins', 20));
  this.buttons.push(new Button(7 * width / 8, 320, 150, 'GUNNER\n' + tank.weaponManager.gunnerPrice + ' coins', 20));


  this.buttons.push(new Button(1 * width / 8, 690, 150, 'LANDMINE\n' + tank.weaponManager.landminePrice + ' coins', 20));
  this.buttons.push(new Button(3 * width / 8, 690, 150, 'BOMB\n' + tank.weaponManager.bombPrice + ' coins', 20));
  this.buttons.push(new Button(5 * width / 8, 690, 150, 'BLAST\n' + tank.weaponManager.blastPrice + ' coins', 20));
  this.buttons.push(new Button(7 * width / 8, 690, 150, 'GUNNER\n' + tank.weaponManager.gunnerPrice + ' coins', 20));


  this.show = function () {
    // set background
    fill(0);
    noStroke();
    rect(0, 0, width, height);
    fill(tank.colour);
    rect(0, 0, width, 120)

    // Title
    fill(0);
    textAlign(CENTER);
    textSize(60);
    text('Shop', width / 2, 60);

    //Show Coins
    textAlign(RIGHT);
    textSize(30);
    text('coins: ' + Math.round(tank.coins), width - 40, 60);
    fill(tank.colour);

    //Buy and sell text
    textSize(40);
    textAlign(CENTER);
    text('Buy', width / 2, 180);
    text('Sell', width / 2, 550);
    rect(60, 220, width - 120, 2);
    rect(60, 590, width - 120, 2);

    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].show();
    }
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].show();
    }

    tank.weaponManager.showInfo();
  }

  this.mouseClick = function () {
    for (var i = 0; i < this.buttons.length; i++) {
      var b = this.buttons[i];
      if (b.detectPress()) {
        switch (i) {
          //Back button
          case 0:
            this.toggle();
            break;

          // Buying Stuff
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

          // Selling stuff
          case 5:
            if (tank.weaponManager.landmineAmount > 0) {
              tank.coins += tank.weaponManager.landminePrice;
              tank.weaponManager.landmineAmount--;
            }
            break;
          case 6:
            if (tank.weaponManager.bombAmount > 0) {
              tank.coins += tank.weaponManager.bombPrice;
              tank.weaponManager.bombAmount--;
            }
            break;
          case 7:
            if (tank.weaponManager.blastAmount > 0) {
              tank.coins += tank.weaponManager.blastPrice;
              tank.weaponManager.blastAmount--;
            }
            break;
          case 8:
            if (tank.weaponManager.gunnerAmount > 0) {
              tank.coins += tank.weaponManager.gunnerPrice;
              tank.weaponManager.gunnerAmount--;
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
      pause.onHomeScreen = true;
      this.active = false;
    } else {
      pause.onHomeScreen = false;
      this.active = true;
    }
  }
}


function Item(x, y, type, price) {
  this.x = x;
  this.y = y;
  this.w = 200;
  this.h = 250;
  this.type = type;
  this.price = price;
  this.buttons = [];
  this.buttons.push(new Button(1 * width / 8, 690, 150, 'LANDMINE\n' + tank.weaponManager.landminePrice + ' coins', 20));


  this.show = function () {
    rectMode(CENTER);
    fill(50);
    rect(this.x, this.y, this.w, this.h);
    fill(tank.colour);
    textSize(40);
    text(this.type, this.x, this.y - 70);
    textSize(20);
    text(this.price, this.x, this.y - 35);
  }

  this.buy = function () {

  }

  this.sell = function () {

  }

}