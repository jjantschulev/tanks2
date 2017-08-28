var notifications = []

function showNotifications() {
  for (var i = notifications.length-1; i >= 0; i--) {
    notifications[i].show();
    notifications[i].update();
  }
}

function notify(t, time, col, w) {
  notifications.unshift(new Notification(t, time, col, width - width/4));
}

function simpleNotify(text) {
  notify(text, 150, 150, width);
}

function Notification(t, time, col, w) {
  this.w = w;
  this.h = 40;
  this.x = width/2;
  this.y = -this.h/2;
  this.text = t;
  this.timer = time;
  this.timerLength = time;
  this.colour = col;

  this.show = function () {
    fill(this.colour);
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
    if (this.timer > this.timerLength - 15) {
      this.y = map(this.timer, this.timerLength, this.timerLength-15, -this.h/2, this.h/2);
    }
    if (this.timer < 15) {
      this.y = map(this.timer, 0, 15, -this.h/2, this.h/2);
    }
    if (this.timer <= 0) {
      notifications.splice(notifications.indexOf(this), 1);
    }
  }
}
