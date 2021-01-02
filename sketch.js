var Micheal_running, Micheal_jumping, Micheal_hitting;
var groundImg,cloud1,cloud2,cloud3,MoonImg,backgroundImg;
var obstacle1,obstacle2 , obstacle3, enemy1, enemy2, enemy3, enemy4;
var cloudsGroup,obstaclesGroup,enemyGroup,invisibleblockGroup;
var jumpSound, gameOverSound, checkpointSound, HitSound;

var END = 0;
var PLAY = 1;
var gameState = PLAY;
var restartImg, score , HighestScore;

function preload(){

  Micheal_running = loadAnimation("Micheal(1).png","Micheal(2).png","Micheal(3).png","Micheal(4).png","Micheal(5).png","Micheal(6).png","Micheal(7).png","Micheal(8).png")
  Micheal_jumping = loadAnimation("Micheal(1).png");
  Micheal_hitting = loadAnimation("Micheal(5).png");

  groundImg = loadImage("ground.png");
  cloud1 = loadImage("cloud(1).png");
  cloud2 = loadImage("cloud(2).png");
  cloud3 = loadImage("cloud(3).png");
  backgroundImg = loadImage("city.png");

  obstacle1 = loadImage("spikes.png");
  obstacle2 = loadImage("rock.png");
  obstacle3 = loadAnimation("spring(1).png","spring(2).png","spring(3).png");
  enemy1 = loadImage("enemy(1).png");
  enemy2 = loadImage("enemy(2).png");
  enemy3 = loadImage("enemy(3).png");
  enemy4 = loadImage("enemy(4).png");

  restartImg = loadImage("RESTART.png");

  jumpSound = loadSound("jump.wav");
  gameOverSound = loadSound("gameOver.wav");
  checkpointSound = loadSound("checkpoint.wav");
  HitSound = loadSound("hit.mp3");
}

function setup(){
  createCanvas(600,500);

//Making the moving ground
  ground = createSprite(300, 460, 400, 20);
  ground.addImage(groundImg);
  ground.scale = 0.4;
  
//Making the Main character of the Game 
  Micheal = createSprite(70,0);
  Micheal.addAnimation("running",Micheal_running);
  Micheal.addAnimation("jumping",Micheal_jumping);
  Micheal.addAnimation("hitting",Micheal_hitting);
  Micheal.scale = 1.2;

  restart = createSprite(300,255);
  restart.addImage(restartImg);

//Making groups
  cloudsGroup = new Group;
  obstaclesGroup = new Group;
  enemyGroup = new Group;
  invisibleblockGroup = new Group;

  score = 0;
  HighestScore = 0;

}

function draw(){
  background(backgroundImg);
  
  if(gameState === PLAY){

    restart.visible = false;

//Making the ground endless
  if(ground.x < 0){
    ground.x = 300;
  }
  
  if(keyWentDown("space") && Micheal.y >= 270){
    jumpSound.play();
  }

  if(keyDown("space") && Micheal.y >= 270){
    Micheal.velocityY = -10;
    Micheal.changeAnimation("jumping",Micheal_jumping);
  }
  else if(Micheal.isTouching(ground)){
    Micheal.changeAnimation("running",Micheal_running);
  }
  Micheal.velocityY = Micheal.velocityY + 0.8;
  
  if(Micheal.y > 200){
  score = score + Math.round(getFrameRate() / 60);
  ground.velocityX = -5;
  }

  if(score>0 && score % 100 === 0){
    checkpointSound.play();
  }

  if(HighestScore < score || HighestScore === score){
    HighestScore = HighestScore + Math.round(getFrameRate() / 60);
  }

 //Function for hitting the enemies
  if(keyDown("A") && Micheal.isTouching(invisibleblockGroup)){
    Micheal.changeAnimation("hitting",Micheal_hitting);
    enemyGroup.setVelocityXEach(6);
  }

  if(keyWentDown("A") && Micheal.isTouching(invisibleblockGroup)){
    HitSound.play();
  }

  Micheal.collide(ground);

  spawnobstacles();
  spawnclouds();
  enemy();

  if(obstaclesGroup.isTouching(Micheal) || enemyGroup.isTouching(Micheal)){
    gameState = END;
    gameOverSound.play();
    Micheal.velocityX = -10;
  }

}

  if(gameState === END){
    
    restart.visible = true;

    if(Micheal.x < -60){
      Micheal.velocityX = 0;
      Micheal.collide(ground);
    }

    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    enemyGroup.setVelocityXEach(0);
    invisibleblockGroup.setVelocityXEach(0);

    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    enemyGroup.setLifetimeEach(-1);
    invisibleblockGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  drawSprites();
  strokeWeight(1.5);
  stroke("white");
  fill("white");
  textSize(20);
  text("Score : " + score,20,50);

  strokeWeight(1.5);
  stroke("white");
  fill("white");
  textSize(20);
  text("Highest Score : " + HighestScore,20,80);
}

function reset(){

  Micheal.x = 70;
  Micheal.y = 0;
  gameState = PLAY;

  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  enemyGroup.destroyEach();
  invisibleblockGroup.destroyEach();

  frameCount = 0;
  score = 0;
}

function spawnclouds(){
  if(frameCount % 60 === 0){
    Cloud = createSprite(700,Math.round(random(120,250)));
    Cloud.velocityX = -5;
    r = Math.round(random(1,3));
    switch(r){
      case 1:
        Cloud.addImage(cloud1);
        break;
      case 2:
        Cloud.addImage(cloud2);
        break;
      case 3:
        Cloud.addImage(cloud3);
        break;
      default:
        break;
    }
    Cloud.scale = 1.5;
    Cloud.lifetime = 140;
    cloudsGroup.add(Cloud);
    Cloud.depth = Micheal.depth;
    Micheal.depth += 1;
  }
}

function spawnobstacles(){
  if(frameCount % 180 === 0){
    obstacle = createSprite(700,390);
    obstacle.scale = 0.7;
    obstacle.velocityX = -5;
    r2 = Math.round(random(1,3));
    switch(r2){
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addAnimation("moving",obstacle3);
        obstacle.y = 400;
        break;
      default:
        break;
    }

    obstacle.lifetime = 140;
    obstaclesGroup.add(obstacle);
  }

}

function enemy(){
  if(frameCount % 260 === 0){
    robot = createSprite(850,370);
    robot.velocityX = -5;

    invisibleblock = createSprite(660,370,150,50);
    invisibleblock.velocityX = -5;
    invisibleblock.visible = false;
    r3 = Math.round(random(1,4));
  switch(r3){
    case 1:
      robot.addImage(enemy1);
      break;
    case 2:
      robot.addImage(enemy2);
      break;
    case 3:
      robot.addImage(enemy3);
      break;
    case 4:
      robot.addImage(enemy4);
      break;
    default:
      break;
  }
  robot.lifetime = 170;
  enemyGroup.add(robot);
  invisibleblockGroup.add(invisibleblock);
  }
}