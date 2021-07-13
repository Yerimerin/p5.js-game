var gameStates = {
  START: 0,
  INGAME: 2,
  SUCCESS: 1,
  FAILURE: -1,
};

var cnv;
var shootsBullet = true;

let game = {
  score: 0,
  life: 3,
  gameState: gameStates.START,
};

let enemyImg;
let civilianImg;
let gunImg;
let hitEnemySound;
let hitCivilianSound;

function preload() {
  enemyImg = loadImage("enemy.png");
  gunImg = loadImage("gun.png");
  civilianImg = loadImage("civilian.png");
  hitEnemySound = loadSound("hit_enemy.wav");
  hitCivilianSound = loadSound("hit_civilian.wav");
}

function setup() {
  cnv = createCanvas(500, 600);
  cnv.mousePressed(shooting);

  enemy = new Enemy();
  bullet = new Bullet();
  civilian = new Civilian();
  gun = new Gun();
}

function draw() {
  
  ////////// Starting Screen //////////

  if (game.gameState == gameStates.START) {
    background(255);

    button.display();

    let titleX = 100;
    let titleY = 70;

    textSize(40);
    stroke(0);
    strokeWeight(1.5);
    textStyle(BOLD);
    fill(255, 0, 0);
    text("Sold", titleX, titleY);
    fill(255, 165, 0);
    text("ier", titleX + 86, titleY);
    fill(255, 255, 0);
    text("on", titleX + 143, titleY);
    fill(0, 128, 0);
    text("Du", titleX + 200, titleY);
    fill(0, 0, 255);
    text("ty", titleX + 253, titleY);

    let imgX = 155;
    let imgY = 150;

    image(enemyImg, imgX, imgY, 90, 60);
    textSize(15);
    stroke(1);
    strokeWeight(0.7);
    fill(90, 0, 90);
    text("Enemy", imgX + 20, imgY + 70);

    image(civilianImg, imgX + 100, imgY, 90, 60);
    textSize(15);
    stroke(0);
    strokeWeight(0.7);
    fill(0, 80, 240);
    text("Civilian", imgX + 120, imgY + 70);

    // how to play //
    
    let textX = 66;
    let textY = 270;

    textSize(20);
    stroke(100, 180, 100);
    strokeWeight(2.5);
    fill(220, 220, 0);
    text("How To Play", textX, textY);

    noFill();
    rect(textX - 5, textY - 30, textX + 310, 170);

    textSize(15);
    stroke(0);
    strokeWeight(0.2);
    fill(0);
    text("Load a gun by mouseclick before firing.", textX, textY + 30);
    text("Don't shoot civilians on your side.", textX, textY + 50);
    text(
      "If you shoot the civilian, you will lose your 1 life.",
      textX,
      textY + 70
    );
    text("If you shoot the enemy, you will get score 1.", textX, textY + 90);

    stroke(200);
    textSize(16);
    strokeWeight(0.7);
    fill(255, 100, 200);
    text(
      "Earn score 10 to protect civilians and your land!",
      textX,
      textY + 120
    );

    
    ///////////// Ingame /////////////
    
  } else {
    game.gameState = gameStates.INGAME;

    background(255, 255, 240);

    // drawing setting //
    bullet.display();
    gun.display();
    enemy.display();
    civilian.display();

    //score
    push();
    textSize(30);
    stroke(0);
    strokeWeight(1);
    fill(60, 179, 113);
    text("Score: " + game.score, width - 130, 40);

    //life
    textSize(30);
    stroke(0);
    fill(220, 20, 60);
    text("Life: " + game.life, 20, 40);
    pop();

    // game logic //
    bullet.moves();
    enemy.moves();
    civilian.moves();

    if (bullet.hitsEnemy(enemy)) {
      game.score++;
    }

    if (bullet.hitsCivilian(civilian)) {
      game.life--;
    }

    if (game.score == 10) {
      game.gameState = gameStates.SUCCESS;
    }

    if (game.life == 0) {
      game.gameState = gameStates.FAILURE;
    }

    if (game.gameState == gameStates.SUCCESS) {
      background(144, 238, 144);
      textSize(30);
      stroke(0);
      strokeWeight(1.4);
      fill(0);
      text("You have protected your land!", width / 2 - 220, height / 2 + 30);
      image(civilianImg, width / 2 - 100, 100, 200, 150);
    }

    if (game.gameState == gameStates.FAILURE) {
      background(250, 0, 0);
      textSize(30);
      stroke(0);
      strokeWeight(1.4);
      fill(0);
      text("You have lost your land", width / 2 - 170, height / 2 + 30);
      image(enemyImg, width / 2 - 100, 100, 200, 150);
    }
  }
}

function Enemy() {
  this.x = 1;
  this.y = 80;
  this.w = 70;
  this.h = 50;
  this.vx = 3;
  this.r = sqrt(7400);

  this.display = function () {
    image(enemyImg, this.x, this.y, this.w, this.h);

    this.moves = function () {
      this.x = this.x + this.vx;
      if (this.x > 500) {
        this.x = this.x * -1;
        this.x = random(0, 50);
      }
    };
  };
}

function Civilian() {
  this.x = 100;
  this.y = 80;
  this.w = 70;
  this.h = 50;
  this.vx = 1;
  this.r = sqrt(7400);

  this.display = function () {
    image(civilianImg, this.x, this.y, this.w, this.h);

    this.moves = function () {
      this.x = this.x + this.vx;
      if (this.x > width) {
        this.x = this.x * -1;
        this.x = random(0, 50);
      }
    };
  };
}

function Bullet() {
  this.x = 0;
  this.y = height - 80;
  this.size = 20;
  this.r = this.size / 2;
  this.vy = 10;

  this.display = function () {
    fill(255, 105, 180);
    stroke(0);
    ellipse(this.x, this.y, this.size, this.size);
  };

  this.moves = function () {
    if (shootsBullet) {
      this.y -= this.vy;
    } else {
      this.y = height - 80;
      this.x = mouseX - 7;
    }
  };

  this.hitsEnemy = function (enemy) {
    if (enemy.x <= this.x && this.x <= enemy.x + enemy.w) {
      if (this.y - this.r === enemy.y + enemy.h) {
        enemy.vx = enemy.vx * 1.1;
        hitEnemySound.play();
        return true;
      } else {
        return false;
      }
    }

    this.hitsCivilian = function (civilian) {
      if (civilian.x <= this.x && this.x <= civilian.x + civilian.w) {
        if (this.y - this.r === civilian.y + civilian.h) {
          civilian.vx = civilian.vx * 1.5;
          hitCivilianSound.play();
          return true;
        } else {
          return false;
        }
      }
    };
  };
}

var button = {
  x: 250,
  y: 500,
  w: 100,
  h: 85,
  r: 50,

  display: function () {
    stroke(240, 128, 128);
    fill(240, 128, 128);
    ellipse(this.x, this.y, this.w, this.h);
    stroke(250, 160, 160);
    strokeWeight(8.5);
    fill(255, 200, 200);
    ellipse(this.x, this.y - 2, this.w - 40, this.h - 40);

    textSize(16);
    stroke(255, 255, 100);
    strokeWeight(2);
    fill(255, 0, 0);
    text("Click to play", this.x - 47, this.y);
  },

  click: function () {
    var distance = dist(mouseX, mouseY, this.x, this.y);
    if (distance < this.r) {
      game.gameState = gameStates.INGAME;
    }
  },
};

function Gun() {
  this.x = 0;
  this.y = height - 70;
  this.w = 50;
  this.h = 70;

  this.display = function () {
    this.x = mouseX - this.w / 2;
    image(gunImg, this.x, this.y, this.w, this.h);
  };
}

function shooting() {
  shootsBullet = !shootsBullet;
}

function mousePressed() {
  button.click();
}
