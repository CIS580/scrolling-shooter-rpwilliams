"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Vector = require('./vector');
const Camera = require('./camera');
const Player = require('./player');
const BulletPool = require('./bullet_pool');
const MissilePool = require('./missile_pool');
const FlappyMonster = require('./flappy-monster');
const Skull = require('./skull');
const FlappyDragon = require('./flappy-dragon');
const FlappyGrumpy = require('./flappy-grumpy');
const FlappyBird = require('./flappy-bird');
const Powerup = require('./powerup');
const Explosion = require('./particle_explosion')

/* Global variables */
var canvas = document.getElementById('screen');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var camera = new Camera(canvas);
var bullets = new BulletPool(20);
var missiles = new MissilePool(10);
var player;

/* Music */
var level1Music = new Audio('assets/music/level-1-music.wav');
var level2Music = new Audio('assets/music/level-2-music.mp3');  
var level3Music = new Audio('assets/music/level-3-music.wav');;

/* Enemies */
var flappyMonsters = [];
var skulls = [];
var flappyDragons = [];
var flappyGrumpys = [];
var flappyBirds = [];

/* Images to preload */
var playerImg = [];
var flappyBirdImg = [];
var flappyMonsterImg = [];
var skullImg = [];
var flappyDragonImg = [];
var flappyGrumpyImg = [];

/* Projectiles */
var shoot = false;
var missileShoot = false;

/* Other */
var winCheck = false;
var gameOverCheck = false;
var explosions = [];
var powerUps = [];
var score = 0;
var backgrounds = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image()
];
var level = 1;
var enemiesKilled = 0;

/* 
  This variable is used as a temporary fix enemies mysteriously getting 
  hit by bullets or missiles that dont actually exist
*/
var initiatedBullet = false;
var initiatedMissile = false; 

/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
      event.preventDefault();
      break;
    case ' ':
      if(player.weapon == "weapon-1")
      {
        if(!shoot)
        {
          bullets.color = "white";
          shoot = true;
          console.log("Pew pew!");
          var audio = new Audio('assets/sounds/weapon-1.wav'); // Created with http://www.bfxr.net/
          audio.play();
          player.fireBullet({x: 1, y: 0});
          initiatedBullet = true;
          break;
        }
      }
      else if(player.weapon == "weapon-2")
      {
        if(!shoot)
        {
          bullets.color = "red"
          shoot = true;
          console.log("Pew pew!");
          var audio = new Audio('assets/sounds/weapon-2.wav'); // Created with http://www.bfxr.net/
          audio.play();
          player.fireBullet({x: 1, y: 0});
          initiatedBullet = true;
          break;
        }
      }
      else if(player.weapon == "weapon-3")
      {
        if(!shoot)
        {
          bullets.color = "blue";
          shoot = true;
          console.log("Pew pew!");
          var audio = new Audio('assets/sounds/weapon-3.wav'); // Created with http://www.bfxr.net/
          audio.play();
          player.fireBullet({x: 1, y: 0});
          initiatedBullet = true;
          break;
        }
      }
      else if(player.weapon == "weapon-4") 
      {
        if(!missileShoot)
        {
          missileShoot = true;
          console.log("BOOM");
          var audio = new Audio('assets/sounds/missile-sound.wav'); // Created with http://www.bfxr.net/
          audio.play();
          player.fireMissile({x: 1, y: 0});
          initiatedMissile = true;
          break;
        }
      }     
  }
}

window.onkeypress=function(event) {
  if(gameOverCheck)
  {
    level = 1;
    score = 0;
    winCheck = false;
    init();
    document.getElementById('game-over').innerHTML = "";
    document.getElementById('continue').innerHTML = "";
    document.getElementById('game-over-black').innerHTML = "";
    document.getElementById('continue-black').innerHTML = "";
    gameOverCheck = false;
  }  
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
      event.preventDefault();
      break;
    case ' ':
      shoot = false;
      missileShoot = false;
      break;
  }
}


/**
 * @function init
 * Initializes the game
 * Loads all animation images BEFORE animation to avoid flickering
 */
function init()
{
  if(level == 1)
  {
    /*
    All images are public domain and from opengameart.org
    */

    // http://www.dl-sounds.com/royalty-free/star-commander1/
    level1Music.pause();
    level2Music.pause();
    level1Music.play();
  
    // Load the background images
    backgrounds[0].src = 'assets/backgrounds/city-foreground-extended.png';
    backgrounds[1].src = 'assets/backgrounds/city-background-extended.png';
    backgrounds[2].src = 'assets/backgrounds/city-sky.png';

    // Level 2 background
    // Used with permission from Ilcho Bogdanovski
    // http://www.makesimpledesigns.com/free-parallax-background-game-graphics-vol1/
    backgrounds[3].src = 'assets/backgrounds/level2-sky-extended.png';
    backgrounds[4].src = 'assets/backgrounds/level2-background-extended.png';
    backgrounds[5].src = 'assets/backgrounds/Front-Layer-1.png';

    // Level 3 Background
    backgrounds[6].src = 'assets/backgrounds/graveyard-background-extended.png';
    backgrounds[7].src = 'assets/backgrounds/layer-2.png';

    // Load the player (cat) images
    playerImg[0] = new Image();
    playerImg[1] = new Image();
    playerImg[2] = new Image();
    playerImg[3] = new Image();
    playerImg[4] = new Image();
    playerImg[5] = new Image();
    playerImg[6] = new Image();
    playerImg[7] = new Image();
    playerImg[8] = new Image();
    playerImg[9] = new Image();
    playerImg[0].src = 'assets/enemies/flappy-cat/flying/frame-1.png';
    playerImg[1].src = 'assets/enemies/flappy-cat/flying/frame-2.png';
    playerImg[2].src = 'assets/enemies/flappy-cat/flying/frame-3.png';
    playerImg[3].src = 'assets/enemies/flappy-cat/flying/frame-4.png';
    playerImg[4].src = 'assets/enemies/flappy-cat/flying/frame-5.png';
    playerImg[5].src = 'assets/enemies/flappy-cat/flying/frame-6.png';
    playerImg[6].src = 'assets/enemies/flappy-cat/flying/frame-7.png';
    playerImg[7].src = 'assets/enemies/flappy-cat/flying/frame-8.png';
    playerImg[8].src = 'assets/enemies/flappy-cat/hit/frame-2.png';
    playerImg[9].src = 'assets/enemies/flappy-cat/hit/frame-1.png';

    // Load the flappy monster images
    flappyMonsterImg[0] = new Image();
    flappyMonsterImg[1] = new Image();
    flappyMonsterImg[2] = new Image();
    flappyMonsterImg[3] = new Image();
    flappyMonsterImg[4] = new Image();
    flappyMonsterImg[5] = new Image();
    flappyMonsterImg[6] = new Image();
    flappyMonsterImg[7] = new Image();
    flappyMonsterImg[0].src = 'assets/enemies/flappy-monster/frame-1.png';
    flappyMonsterImg[1].src = 'assets/enemies/flappy-monster/frame-2.png';
    flappyMonsterImg[2].src = 'assets/enemies/flappy-monster/frame-3.png';
    flappyMonsterImg[3].src = 'assets/enemies/flappy-monster/frame-4.png';
    flappyMonsterImg[4].src = 'assets/enemies/flappy-monster/frame-5.png';
    flappyMonsterImg[5].src = 'assets/enemies/flappy-monster/frame-6.png';
    flappyMonsterImg[6].src = 'assets/enemies/flappy-monster/frame-7.png';
    flappyMonsterImg[7].src = 'assets/enemies/flappy-monster/frame-8.png';

    // Load the flappy bird images
    flappyBirdImg[0] = new Image();
    flappyBirdImg[1] = new Image();
    flappyBirdImg[2] = new Image();
    flappyBirdImg[3] = new Image();
    flappyBirdImg[4] = new Image();
    flappyBirdImg[5] = new Image();
    flappyBirdImg[0].src = 'assets/enemies/flappy-bird/flying/frame-1.png';
    flappyBirdImg[1].src = 'assets/enemies/flappy-bird/flying/frame-2.png';
    flappyBirdImg[2].src = 'assets/enemies/flappy-bird/flying/frame-3.png';
    flappyBirdImg[3].src = 'assets/enemies/flappy-bird/flying/frame-4.png';
    flappyBirdImg[4].src = 'assets/enemies/flappy-bird/hit/frame-1.png';
    flappyBirdImg[5].src = 'assets/enemies/flappy-bird/hit/frame-2.png';

    // Load the skull images
    skullImg[0] = new Image();
    skullImg[1] = new Image();
    skullImg[2] = new Image();
    skullImg[0].src = 'assets/enemies/skull/idle/frame-1.png';
    skullImg[1].src = 'assets/enemies/skull/idle/frame-2.png';
    skullImg[2].src = 'assets/enemies/skull/hit/frame.png';

    // Load the flappy dragon images
    flappyDragonImg[0] = new Image();
    flappyDragonImg[1] = new Image();
    flappyDragonImg[2] = new Image();
    flappyDragonImg[3] = new Image();
    flappyDragonImg[0].src = 'assets/enemies/flappy-dragon/frame-1.png';
    flappyDragonImg[1].src = 'assets/enemies/flappy-dragon/frame-2.png';
    flappyDragonImg[2].src = 'assets/enemies/flappy-dragon/frame-3.png';
    flappyDragonImg[3].src = 'assets/enemies/flappy-dragon/frame-4.png';

    // Load the flappy grumpy images
    flappyGrumpyImg[0] = new Image();
    flappyGrumpyImg[1] = new Image();
    flappyGrumpyImg[2] = new Image();
    flappyGrumpyImg[3] = new Image();
    flappyGrumpyImg[4] = new Image();
    flappyGrumpyImg[5] = new Image();
    flappyGrumpyImg[6] = new Image();
    flappyGrumpyImg[7] = new Image();
    flappyGrumpyImg[0].src = 'assets/enemies/flappy-grumpy/frame-1.png';
    flappyGrumpyImg[1].src = 'assets/enemies/flappy-grumpy/frame-2.png';
    flappyGrumpyImg[2].src = 'assets/enemies/flappy-grumpy/frame-3.png';
    flappyGrumpyImg[3].src = 'assets/enemies/flappy-grumpy/frame-4.png';
    flappyGrumpyImg[4].src = 'assets/enemies/flappy-grumpy/frame-5.png';
    flappyGrumpyImg[5].src = 'assets/enemies/flappy-grumpy/frame-6.png';
    flappyGrumpyImg[6].src = 'assets/enemies/flappy-grumpy/frame-7.png';
    flappyGrumpyImg[7].src = 'assets/enemies/flappy-grumpy/frame-8.png';

    player = new Player(bullets, missiles, "weapon-1", playerImg);
    camera = new Camera(canvas);

    // Randomly generate skulls
    for(var i = 0; i < 20; i++)
    {
      var randomSkullX = Math.floor(Math.random() * 5000) + 0;
      var randomSkullY = Math.floor(Math.random() * 1000) + 1;
      skulls.push(new Skull(randomSkullX, randomSkullY, canvas, skullImg));
    }
    // Randomly generate flappy grumpys
    for(var i = 0; i < 15; i++)
    {
      var randomGrumpyX = Math.floor(Math.random() * 10000) + 0;
      var randomGrumpyY = Math.floor(Math.random() * 700) + 1;
      flappyGrumpys.push(new FlappyGrumpy(randomGrumpyX, randomGrumpyY, flappyGrumpyImg));
    }
  }
  else if(level == 2)
  {
    player = new Player(bullets, missiles, "weapon-1", playerImg);
    camera = new Camera(canvas);
    reinitializeEnemies();
    player.lives = 5;

    // http://www.dl-sounds.com/royalty-free/fantasy-island/
    level1Music.pause();
    level3Music.pause();
    level2Music.play();

    // Randomly generate flappy monsters
    for(var i = 0; i < 30; i++)
    {
      var randomMonsterX = Math.floor(Math.random() * 10000) + 0;
      var randomMonsterY = Math.floor(Math.random() * 700) + 1;
      flappyMonsters.push(new FlappyMonster(randomMonsterX, randomMonsterY, flappyMonsterImg));
    }
    // Randomly generate flappy dragons
    for(var i = 0; i < 75; i++)
    {
      var randomDragonX = Math.floor(Math.random() * 27000) + 1000;
      var randomDragonY = Math.floor(Math.random() * 700) + 1;
      flappyDragons.push(new FlappyDragon(randomDragonX, randomDragonY, flappyDragonImg));
    }
  }
  else if(level == 3)
  {
    player = new Player(bullets, missiles, "weapon-2", playerImg);
    camera = new Camera(canvas);
    reinitializeEnemies();
    player.lives = 5;
    bullets.color = "black";

    // http://www.dl-sounds.com/royalty-free/discotek-loop/
    level1Music.pause();
    level2Music.pause();
    if (typeof level3Music.loop == 'boolean')
    {
        level3Music.loop = true;
    }
    else
    {
        level3Music.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    level3Music.play();
  
    // Randomly generate flappy monsters
    for(var i = 0; i < 15; i++)
    {
      var randomMonsterX = Math.floor(Math.random() * 2500) + 100;
      var randomMonsterY = Math.floor(Math.random() * 700) + 1;
      flappyMonsters.push(new FlappyMonster(randomMonsterX, randomMonsterY, flappyMonsterImg));
    }
    // Randomly generate flappy dragons
    for(var i = 0; i < 15; i++)
    {
      var randomDragonX = Math.floor(Math.random() * 10000) + 5000;
      var randomDragonY = Math.floor(Math.random() * 700) + 1;
      flappyDragons.push(new FlappyDragon(randomDragonX, randomDragonY, flappyDragonImg));
    }
    // Randomly generate skulls
    for(var i = 0; i < 10; i++)
    {
      var randomSkullX = Math.floor(Math.random() * 5000) + 200;
      var randomSkullY = Math.floor(Math.random() * 1000) + 1;
      skulls.push(new Skull(randomSkullX, randomSkullY, canvas, skullImg));
    }
    // Randomly generate flappy grumpys
    for(var i = 0; i < 10; i++)
    {
      var randomGrumpyX = Math.floor(Math.random() * 10000) + 200;
      var randomGrumpyY = Math.floor(Math.random() * 700) + 1;
      flappyGrumpys.push(new FlappyGrumpy(randomGrumpyX, randomGrumpyY, flappyGrumpyImg));
    }
    // Generate three "boss's"
    flappyBirds.push(new FlappyBird(8000, 0, canvas, flappyBirdImg));
    flappyBirds.push(new FlappyBird(8000, 400, canvas, flappyBirdImg));
    flappyBirds.push(new FlappyBird(9000, 400, canvas, flappyBirdImg));
  }
  // Add powerups
  powerUps.push(new Powerup(50,50));
  powerUps.push(new Powerup(1000,50));
  powerUps.push(new Powerup(2000,50));
  powerUps.push(new Powerup(3000,50));
  powerUps.push(new Powerup(4000,50));
  powerUps.push(new Powerup(5000,50));
  powerUps.push(new Powerup(6000,50));
  powerUps.push(new Powerup(7000,50));
  powerUps.push(new Powerup(8000,50));
  powerUps.push(new Powerup(9000,50));  
}
init(); // Create level 1

function initLevel3SecondHalf()
{
  // Randomly generate flappy monsters
    for(var i = 0; i < 15; i++)
    {
      var randomMonsterX = Math.floor(Math.random() * 10000) + 3000;
      var randomMonsterY = Math.floor(Math.random() * 700) + 1;
      flappyMonsters.push(new FlappyMonster(randomMonsterX, randomMonsterY, flappyMonsterImg));
    }
    // Randomly generate flappy dragons
    for(var i = 0; i < 15; i++)
    {
      var randomDragonX = Math.floor(Math.random() * 20000) + 10000;
      var randomDragonY = Math.floor(Math.random() * 700) + 1;
      flappyDragons.push(new FlappyDragon(randomDragonX, randomDragonY, flappyDragonImg));
    }
    // Randomly generate skulls
    for(var i = 0; i < 15; i++)
    {
      var randomSkullX = Math.floor(Math.random() * 10000) + 5000;
      var randomSkullY = Math.floor(Math.random() * 1000) + 1;
      skulls.push(new Skull(randomSkullX, randomSkullY, canvas, skullImg));
    }
    // Randomly generate flappy grumpys
    for(var i = 0; i < 15; i++)
    {
      var randomGrumpyX = Math.floor(Math.random() * 15000) + 10000;
      var randomGrumpyY = Math.floor(Math.random() * 700) + 1;
      flappyGrumpys.push(new FlappyGrumpy(randomGrumpyX, randomGrumpyY, flappyGrumpyImg));
    }
}


/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
    game.loop(timestamp);
    window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  // update the player
  player.update(elapsedTime, input);

  // update the camera
  camera.update(player);

  // update the explosions
  explosions.forEach(function(explosion){
    explosion.update(elapsedTime);
  })

  // Check if reached level 2
  if(player.position.x > 5000 && level == 1)
  {
    console.log("Level 2 reached");
    level = 2;
    init();
  }
  // Check if reached level 3
  else if(camera.position.x > 10000 && level == 2)
  { 

    console.log("Level 2 reached");
    level = 3;
    init();
  }
  // Check if game win
  else if(camera.position.x > 9000 && level == 3 && !gameOverCheck)
  {
    winCheck = true;
    console.log("YOU WIN!");
  }
  updateWin();  // Check if game win

  if(camera.position.x == 5000 && level == 3)
  {
    initLevel3SecondHalf();
  }

  // Check for game over
  if(player.lives < 1)
  {
    gameOver(player);
    player.lives = 5;
  }

  // Display the current level between 0 to 1000 in the x position
  if(camera.position.x > 0  && camera.position.x < 500 && (level == 1 || level == 2))
  {
    document.getElementById('level').innerHTML = "LEVEL: " + level;
    document.getElementById('score-under-level').innerHTML = "ENEMIES KILLED: " + enemiesKilled;
  }
  // Make it black if it is against a white background
  else if(camera.position.x > 0  && camera.position.x < 500 && (level == 3))
  {
    document.getElementById('level-black').innerHTML = "LEVEL: " + level;
    document.getElementById('score-under-level-black').innerHTML = "ENEMIES KILLED: " + enemiesKilled;
  }
  // Get rid of the current level HTML
  else
  {
    document.getElementById('level').innerHTML = "";
    document.getElementById('score-under-level').innerHTML = "";
    document.getElementById('level-black').innerHTML = "";
    document.getElementById('score-under-level-black').innerHTML = "";
  }

  // Update bullet pool
  bullets.update(elapsedTime, function(bullet){
    if(!camera.onScreen(bullet)) return true;
    return false;
  });

  // Update missile pool
  missiles.update(elapsedTime, function(missile){
    if(!camera.onScreen(missile)) return true;
    return false;
  });

  // Update the power ups
  powerUps.forEach(function(power){
    power.update(elapsedTime);
    if(checkCollision(player, power))
    {
      const MAX = 4;  // There are 4 possible weapons 
      const MIN = 1;
      var randomNumber = Math.floor(Math.random() * MAX) + MIN
      power.active = false;
      // Generate a random weapon
      switch(randomNumber)
      {
        case 1:
          player.weapon = "weapon-1";
          break;
        case 2:
          player.weapon = "weapon-2";
          break;
        case 3:
          player.weapon = "weapon-3";
          break;
        case 4:
          player.weapon = "weapon-4";
          break;
      }
    }
  });

  /********************************************/
  /*********** FLAPPY MONSTERS ****************/
  /********************************************/

  flappyMonsters.forEach(function(monster){
    monster.update(elapsedTime);
    // Only check for collisions if the monster is on the screen
    if(Math.abs(player.position.x - monster.position.x) < 500)
    {
      // Check for player collisions
      if(checkCollision(player, monster) && !monster.collidedWithPlayer)
      {
        monster.collidedWithPlayer = true;
        player.lives--;
        player.frame = "frame-10";
        var audio = new Audio('assets/sounds/player_hurt.wav'); // Created with http://www.bfxr.net/
        audio.play();
      }
      // Check for bullet collisions
      for(var i = 0; i < bullets.pool.length; i+=4) {
        if(enemyAndBulletCollision(monster, bullets, i, 2) && initiatedBullet)
        {
          monster.collidedWithPlayer = true;
          monster.health--;
          initiatedBullet = false;
          var audio = new Audio('assets/sounds/enemy_hurt.wav'); // Created with http://www.bfxr.net/
          audio.play();
          // Remove the bullets 
          bullets.update(elapsedTime, function(bullet){
            return true;
          });
        }
      }
      // Check for missile collisions
      for(var j = 0; j < missiles.pool.length; j+=4) {
        if(enemyAndMissileCollision(monster, missiles, j, 64, 64) && initiatedMissile)
        {
          monster.health -= 2;
          initiatedMissile = false;
          // Remove the bullets 
          missiles.update(elapsedTime, function(missile){
            return true;
          });
        }
      }
    }
    
    if(monster.health < 1)
    {
      enemiesKilled++;
      monster.active = false;
      explosions.push(new Explosion(monster.position.x + 2.5, monster.position.y));
      var audio = new Audio('assets/sounds/explosion.wav'); // Created with http://www.bfxr.net/
      audio.play();
    }
  });

  /********************************************/
  /*********** FLAPPY SKULLS ******************/
  /********************************************/

  // Update the flappy skulls
  skulls.forEach(function(skull){
    skull.update(elapsedTime);
    // Only check for collisions if the monster is on the screen
    if(Math.abs(player.position.x - skull.position.x) < 750)
    {
       // Check for player collisions
      if(checkCollision(player, skull) && !skull.collidedWithPlayer)
      {
        skull.collidedWithPlayer = true;
        skull.state = "hit";
        skull.img.src = 'assets/enemies/skull/hit/frame.png';
        player.frame = "frame-10";
        player.lives--;
        var audio = new Audio('assets/sounds/player_hurt.wav'); // Created with http://www.bfxr.net/
        audio.play();
      }
      // Check for bullet collisions
      for(var i = 0; i < bullets.pool.length; i+=4) {
        if(enemyAndBulletCollision(skull, bullets, i, 2) && initiatedBullet)
        {
          skull.health--; 
          initiatedBullet = false;
          // Remove the bullets 
          bullets.update(elapsedTime, function(bullet){
            return true;
          });
        }
      }
      // Check for missile collisions
      for(var j = 0; j < missiles.pool.length; j+=4) {
        if(enemyAndMissileCollision(skull, missiles, j, 64, 64) && initiatedMissile)
        {
          skull.health -= 2;
          console.log("Missile collision!");
          initiatedMissile = false;
          // Remove the bullets 
          missiles.update(elapsedTime, function(missile){
            return true;
          });
        }
      }
    } 
    if(skull.health < 1)
    {
      enemiesKilled++;
      skull.active = false;
      explosions.push(new Explosion(skull.position.x, skull.position.y));
      var audio = new Audio('assets/sounds/explosion.wav'); // Created with http://www.bfxr.net/
      audio.play();
    }
  });

  /********************************************/
  /*********** FLAPPY DRAGONS *****************/
  /********************************************/

  // Update the flappy dragons
  flappyDragons.forEach(function(dragon){
    dragon.update(elapsedTime);
    // Only check for collisions if the monster is on the screen
    if(Math.abs(player.position.x - dragon.position.x) < 750)
    {
      if(checkCollision(player, dragon) && !dragon.collidedWithPlayer)
      {
        dragon.collidedWithPlayer = true;
        player.frame = "frame-10";
        player.lives--;
        var audio = new Audio('assets/sounds/player_hurt.wav'); // Created with http://www.bfxr.net/
        audio.play();
      }
      // Check for bullet collisons 
      for(var i = 0; i < bullets.pool.length; i+=4) {
        if(enemyAndBulletCollision(dragon, bullets, i, 2) && initiatedBullet)
        {
          dragon.health--;
          initiatedBullet = false;
          bullets.update(elapsedTime, function(bullet){
          return true;
          });
        }
      }
      // Check for missile collisions
      for(var j = 0; j < missiles.pool.length; j+=4) {
        if(enemyAndMissileCollision(dragon, missiles, j, 64, 64)  && initiatedMissile)
        {
          dragon.health -= 2;
          initiatedMissile = false;
          console.log("Missile collision!");
          // Remove the bullets (TO DO: fix this so it only removes one)
          missiles.update(elapsedTime, function(missile){
            return true;
          });
        }
      }
      if(dragon.health < 1)
      {
        enemiesKilled++;
        dragon.active = false;
        explosions.push(new Explosion(dragon.position.x - 5, dragon.position.y));
        var audio = new Audio('assets/sounds/explosion.wav'); // Created with http://www.bfxr.net/
        audio.play();
      }
    }
  });

  /********************************************/
  /*********** FLAPPY GRUMPYS *****************/
  /********************************************/

  // Update the flappy grumpys
  flappyGrumpys.forEach(function(grumpy){
    grumpy.update(elapsedTime);
    // Only check for collisions if the monster is on the screen
    if(Math.abs(player.position.x - grumpy.position.x) < 750)
    {
      if(checkCollision(player, grumpy) && !grumpy.collidedWithPlayer)
      {
        grumpy.collidedWithPlayer = true;
        player.frame = "frame-10";
        player.lives--;
        var audio = new Audio('assets/sounds/player_hurt.wav'); // Created with http://www.bfxr.net/
        audio.play();
      }
      for(var i = 0; i < bullets.pool.length; i+=4) {
        if(enemyAndBulletCollision(grumpy, bullets, i, 2) && initiatedBullet)
        {
          var audio = new Audio('assets/sounds/player_hurt.wav'); // Created with http://www.bfxr.net/
          audio.play();
          grumpy.health--;
          initiatedBullet = false;
          bullets.update(elapsedTime, function(bullet){
            return true;
          });
        }
      }
      // Check for missile collisions
      for(var j = 0; j < missiles.pool.length; j+=4) {
        if(enemyAndMissileCollision(grumpy, missiles, j, 64, 64) && initiatedMissile)
        {
          grumpy.health -= 2; 
          initiatedMissile = false;
          console.log("Missile collision!");
          // Remove the bullets 
          missiles.update(elapsedTime, function(missile){
            return true;
          });
        }
      }
    }  
    if(grumpy.health < 1)
    {
      enemiesKilled++;
      grumpy.active = false;
      explosions.push(new Explosion(grumpy.position.x - 2, grumpy.position.y));
      var audio = new Audio('assets/sounds/explosion.wav'); // Created with http://www.bfxr.net/
      audio.play();
    }
  });

  /********************************************/
  /*********** FLAPPY BIRDS   *****************/
  /********************************************/

  // Update the flappy birds
  flappyBirds.forEach(function(bird){
    bird.update(elapsedTime);
    if(Math.abs(player.position.x - bird.position.x) < 750)
    {
      if(checkCollision(player, bird) && !bird.collidedWithPlayer)
      {
        var audio = new Audio('assets/sounds/player_hurt.wav'); // Created with http://www.bfxr.net/
        audio.play();
        bird.collidedWithPlayer = true;
        player.frame = "frame-10";
        bird.state = "hit";
        bird.frame = "frame-5";
        bird.img.src = 'assets/enemies/flappy-bird/hit/frame-2.png';
        player.lives--;
        var audio = new Audio('assets/sounds/player_hurt.wav'); // Created with http://www.bfxr.net/
        audio.play();
      }
      // Check for bullet collisions
      for(var i = 0; i < bullets.pool.length; i+=4) {
        if(enemyAndBulletCollision(bird, bullets, i, 2) && initiatedBullet)
        {
          initiatedBullet = false;
          bird.health--;
          bullets.update(elapsedTime, function(bullet){
            return true;
          });
        }
      }
      // Check for missile collisions
      for(var j = 0; j < missiles.pool.length; j+=4) {
        if(enemyAndMissileCollision(bird, missiles, j, 64, 64) && initiatedMissile)
        {
          bird.health -= 2;
          console.log("Missile collision!");
          initiatedMissile = false;
          // Remove the bullets 
          missiles.update(elapsedTime, function(missile){
            return true;
          });
        }
      }
    }
    
    if(bird.health < 1)
    {
      enemiesKilled++;
      bird.active = false;
      explosions.push(new Explosion(bird.position.x, bird.position.y));
      var audio = new Audio('assets/sounds/explosion.wav'); // Created with http://www.bfxr.net/
      audio.play();
    }
  });

  /* Remove unwanted enemies and powerups */
  flappyMonsters = flappyMonsters.filter(function(monster){ return monster.active; });
  skulls = skulls.filter(function(skull){ return skull.active; });
  flappyDragons = flappyDragons.filter(function(dragon){ return dragon.active; });
  flappyGrumpys = flappyGrumpys.filter(function(grumpy){ return grumpy.active; });
  flappyBirds = flappyBirds.filter(function(bird){ return bird.active; });
  powerUps = powerUps.filter(function(powerup){ return powerup.active; });
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  // Render the background
  if(level == 1)
  {
    ctx.save();
    ctx.translate(-camera.position.x, 0);
    ctx.drawImage(backgrounds[2], 0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 1000, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 2000, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 3000, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 4000, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 5000, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .2, 0);
    ctx.drawImage(backgrounds[1], 0, 0);
    ctx.drawImage(backgrounds[1], 1120 *.2, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .6, 0);
    ctx.drawImage(backgrounds[0], 0, 0);
    ctx.drawImage(backgrounds[0], 1120 * .6, 0);
    ctx.restore();
  }
  else if(level == 2)
  {
    ctx.save();
    ctx.translate(-camera.position.x * .1, 0);
    ctx.drawImage(backgrounds[3], 0, 0, backgrounds[3].width, canvas.height);
    ctx.drawImage(backgrounds[3], 1120 * .1, 0, backgrounds[4].width, canvas.height);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .3, 0);
    ctx.drawImage(backgrounds[4], 0, 0, backgrounds[4].width, canvas.height);
    ctx.drawImage(backgrounds[4], 1120 * .3, 0, backgrounds[4].width, canvas.height);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .8, 0);
    ctx.drawImage(backgrounds[5], 0, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 1120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 2120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 3120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 4120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 5120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 6120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 7120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 8120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 9120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 10120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.restore();
  }
  else if(level == 3)
  {
    ctx.save();
    ctx.translate(-camera.position.x * .4, 0);
    ctx.drawImage(backgrounds[6], 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .8, 0);
    ctx.drawImage(backgrounds[7], 0, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 1120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 2120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 3120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 4120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 5120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 6120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 7120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 8120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 9120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 10120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.restore();
  }

  // Transform the coordinate system using
  // the camera position BEFORE rendering
  // objects in the world - that way they
  // can be rendered in WORLD cooridnates
  // but appear in SCREEN coordinates
  ctx.save();
  ctx.translate(-camera.position.x, -camera.position.y);
  renderWorld(elapsedTime, ctx, camera);
  ctx.restore();

  // Render the GUI without transforming the
  // coordinate system
  renderGUI(elapsedTime, ctx);
}

/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderWorld(elapsedTime, ctx, camera) {

  // Render the bullets
  bullets.render(elapsedTime, ctx);

  // Render the missiles
  missiles.render(elapsedTime, ctx);

  // Render the player
  player.render(elapsedTime, ctx, camera, gameOverCheck);

  // Render the power up
  powerUps.forEach(function(powerup){
    powerup.render(elapsedTime, ctx);
  });

  // Render the flappy monsters
  flappyMonsters.forEach(function(FlappyMonster){
    FlappyMonster.render(elapsedTime, ctx);
  });

  // Render the flappy cats
  skulls.forEach(function(Skull){
    Skull.render(elapsedTime, ctx);
  });

  // Render the flappy dragons
  flappyDragons.forEach(function(FlappyDragon){
    FlappyDragon.render(elapsedTime, ctx);
  });

  // Render the flappy grumpys
  flappyGrumpys.forEach(function(FlappyGrumpy){
    FlappyGrumpy.render(elapsedTime, ctx);
  });

  // Render the flappy grumpys
  flappyBirds.forEach(function(FlappyBird){
    FlappyBird.render(elapsedTime, ctx);
  });

  // Render the explosions
  explosions.forEach(function(explosion){
    explosion.render(elapsedTime, ctx);
  })

}

/**
  * @function renderGUI
  * Renders the game's GUI IN SCREEN COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx
  */
function renderGUI(elapsedTime, ctx) {
  // TODO: Render the GUI
  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: " + enemiesKilled, 32, 32);

  // Lives
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("Lives: " + player.lives, 32, 32);
  
}

/**
  * @function checkCollisions
  * Checks for a collision by drawing a box around the shape
  * Used between a player and an enemy
  * @param {a} the first object
  * @param {b} the second object
  * @return false if no collision, true if collision
  */
function checkCollision(a, b)
{
  return a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.position.y + a.height > b.position.y;
}

/**
  * @function enemyAndBulletCollisions
  * Checks for a collision by drawing a box around the enemy
  * and a circle around the bullet
  * @param {rect} the enemy
  * @param {bullets} the bullet pool 
  * @param {index} the index in the bullet pool array
  * @param {bulletRadius} the radius of the bullet
  * @return false if no collision, true if collision
  */
function enemyAndBulletCollision(rect, bullets, index, bulletRadius)
{
  var distX = Math.abs(bullets.pool[index] - rect.position.x - rect.width / 2);
  var distY = Math.abs(bullets.pool[index+1] - rect.position.y - rect.height / 2);

  if(distX > (rect.width/2 + bulletRadius)) { return false; }
  if(distY > (rect.height/2 + bulletRadius)) { return false; }

  if(distX <= (rect.width/2)) { return true; }
  if(distY <= (rect.height/2)) { return true; }

  var dx = distX - rect.width/2;
  var dy = distY - rect.height/2;
  return (dx*dx+dy*dy<=(bulletRadius*bulletRadius));
}

/**
  * @function enemyAndMissileCollision
  * Checks for a collision by drawing a box around the enemy
  * and a box around the missile
  * @param {rect} the enemy
  * @param {bullets} the missile pool 
  * @param {index} the index in the missile pool array
  * @param {missileWidth} the width of the missle
  * @param {missileWidth} the height of the missle
  * @return false if no collision, true if collision
  */
function enemyAndMissileCollision(rect, missile, index, missileWidth, missileHeight)
{
  return rect.position.x < missile.pool[index] + missileWidth &&
    rect.position.x + rect.width > missile.pool[index] &&
    rect.position.y < missile.pool[index+1] + missileHeight &&
    rect.position.y + rect.height > missile.pool[index+1];
}

/**
  * @function reinitializeEnemies
  * Resets the enemies if player advances to a new level
  */
function reinitializeEnemies()
{
  flappyMonsters = [];
  skulls = [];
  flappyDragons = [];
  flappyGrumpys = [];
  flappyBirds = [];
}

/**
  * @function gameOver
  * Causes player to explode, makes a sound, and renders 
  * an HTML overlay if the player ran out of lives.
  * @param {object} player the
  * player who just died.
  */
function gameOver(player)
{
  console.log("GAME OVER!");
  explosions.push(new Explosion(player.position.x + 3, player.position.y + 3));
  var audio = new Audio('assets/sounds/explosion.wav'); // Created with http://www.bfxr.net/
  audio.play();
  if(level == 3)
  {
    document.getElementById('game-over-black').innerHTML = "GAME OVER";
    document.getElementById('continue-black').innerHTML = "Press any key to continue";
  }
  else
  {
    document.getElementById('game-over').innerHTML = "GAME OVER";
    document.getElementById('continue').innerHTML = "Press any key to continue";
  }
  gameOverCheck = true;
  reinitializeEnemies();
}

/**
  * @function updateWin
  * Check if the player won the game
  * If the player won, create a pop up that tells them they won
  */
function updateWin()
{
  // Get the modal
  var modal = document.getElementById('winModal'); 
  if(winCheck)
  {
    modal.style.display = "block";
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  }
  else
  {
    modal.style.display = "none";
  }
}