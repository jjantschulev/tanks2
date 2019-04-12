function EnemyTank() {
  this.pos = createVector(random(width), random(height));
  this.previousPos = this.pos.copy();
  this.viewPos = this.pos.copy();
  this.dir = 0;
  this.gunDir = 0;
  this.viewDir = 0;
  this.viewGunDir = 0;

  this.w = 25.5;
  this.h = 30;

  this.id = '';
  this.colour = 'gold';
  this.paused = false;

  this.health = 100;
  this.maxHealth = 150;
  this.name = 'other';

  this.loadImages(this.colour);
}

EnemyTank.prototype.loadImages = function (col) {
  this.colour = col;
  this.image = loadImage('./assets/' + this.colour + '_body.png');
  this.gunImage = loadImage('./assets/' + this.colour + '_gun.png');
}

EnemyTank.prototype.show = function () {
  if (this.paused) {
    return;
  }
  push();
  imageMode(CENTER);
  // SMOOTHEN TANK MOVEMENT
  this.viewPos.x = lerp(this.viewPos.x, this.pos.x, 0.6);
  this.viewPos.y = lerp(this.viewPos.y, this.pos.y, 0.6);
  this.viewDir = lerp(this.viewDir, this.dir, 0.6);
  this.viewGunDir = lerp(this.viewGunDir, this.gunDir, 0.6);

  translate(this.viewPos.x, this.viewPos.y);

  // SHOW HEALTH BAR
  fill(this.colour);
  noStroke();
  rectMode(CENTER);
  rect(0, -30, map(this.health, 0, 100, 0, 30), 1.6);
  if (this.health > this.maxHealth - 25) {
    rect(-map(this.health, 0, 100, 0, 30) / 2, -30, 1.6, 3.8, 100);
    rect(map(this.health, 0, 100, 0, 30) / 2, -30, 1.6, 3.8, 100);
  }

  // SHOW NAME
  fill(120);
  textAlign(CENTER, CENTER);
  textSize(8);
  text(this.name, 0, -36);

  // SHOW TANK
  rotate(this.viewDir);
  image(this.image, 0, 0, this.w, this.h);
  rotate(this.viewGunDir);
  image(this.gunImage, 0, -this.w / 4, this.w, this.h);
  pop();
};

function generateName() {
  var nouns = ['avogadro','fairy','lad','sebastian','beau','email','letter','parcel','snake','grass','gravel','squirrel','doctor','teacher','developer','cook','bus','skeleton','jumpy-thing','cat','dog','monster','duck','politician','car','auto','truck','rocket','fly','leech','apple','book','frog','spam','eggs','rabbit','elephant','rock','horse','robot','avocado','salad','bread','shoe','donkey','mouse','spinach','german','french','italian','beats','japanese','american','tree','forest','piano','computer','wall','fred','bob','richard','beef','potato','tomato'
  ];
  var adjectives = ['crunchy','bouyant','engorged','fancyful','convoluted','speedy','old','eletrified','corrupt','thick','black','asian','insane','annoying','exciting','boring','sophisticated','educated','lame','deadly','comical','undefined','young','old','middle-aged','radical','putrid','beautiful','primitive','animalistic','relaxing','superb','rude','ruthless','relentless','racist','clever','dumb','interesting','silly','wild','partying','green','blue','red','orange','brown','purple','fat','quick','slow','yummy','electric','charged','sad','stuuupid','cool','uncool','amazing','phat','loud','soft','dead','alive','smart','stinking','clean','large','miniscule','vegetarian','beef-eating','loving','hateful','mediocre'
  ];
  var name =
    '-' +
    adjectives[Math.floor(random(adjectives.length))] +
    '-' +
    adjectives[Math.floor(random(adjectives.length))] +
    '-' +
    nouns[Math.floor(random(nouns.length))] +
    '-';
  console.log(nouns.length * adjectives.length * adjectives.length);
  return name;
}
