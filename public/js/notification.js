var notifications = []

function showNotifications() {
  for (var i = 0; i < notifications.length; i++) {
    notifications[i].show();
    notifications[i].update();
  }
}

function Notification(t) {
  this.w = width/3;
  this.h = 40;
  this.x = width/2;
  this.y = -this.h/2;
  this.text = t;
  this.timer = 200;

  this.show = function () {
    fill(tank.colour);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);

    textSize(24);
    fill(20);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
  }

  this.update = function () {
    this.timer --;
    if (this.timer > 180) {
      this.y = map(this.timer, 200, 180, -this.h/2, this.h/2);
    }
    if (this.timer < 20) {
      this.y = map(this.timer, 0, 20, -this.h/2, this.h/2);
    }
    if (this.timer <= 0) {
      notifications.splice(notifications.indexOf(this), 1);
    }
  }
}
