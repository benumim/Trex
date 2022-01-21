var trex ;

var ground;

var trex_running, groundImage;

var edges;

var marks=[30,40,45,35];

var sum = 0;

var invisible_ground;
var invisible_ceiling;

var cloud;
var cloudAnimation;
var cloudsGroup;

var cactus1, cactus2, cactus4, cactus5;
var cactus;
var cactusGroup;

var score = 0;

var gameState = 0;

var gameOverImage;
var restartImage;

var gameOver;
var restart;

var trexDeadImage;
var deadTrex;

var deathSound;
var jumpSound;
var checkpointSound;

var jumpPowerUp;
var jumpPower = 0;

function generateClouds(){
  if (frameCount % 60 === 0){
    cloud = createSprite(1366,Math.round(random(230,425)),60,45);
    cloud.addImage(cloudAnimation);
    cloud.velocityX = -6;
    cloud.depht = trex.depht;
    trex.depht = trex.depht + 1;
    cloud.lifetime = 280;
    cloudsGroup.add(cloud);
  }
}

function generateCactus(){
  if (frameCount % 250 === 0 || frameCount % 840 === 0){
    cactus = createSprite(1366,550,20,60);
    cactus.velocityX = -(5 + score/50);
    var randomImage = Math.round(random(1,4));
    switch(randomImage){
      case 1: cactus.addImage(cactus1);
      break;
      case 2: cactus.addImage(cactus2);
      break;
      case 3: cactus.addImage(cactus4);
      break;
      case 4: cactus.addImage(cactus5);
      break;
      default: break;
    }
    cactus.lifetime = 280;
    cactus.debug = false;
    cactusGroup.add(cactus);
  }
}

function generateJumpPowerUps(){
  if (frameCount % 650 === 0){
    jumpPowerUp = createSprite(1366,random(550,475),10,10);
    jumpPowerUp.velocityX = -(5 + score/ 50);
  }
}

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");

  groundImage = loadImage("ground2.png");

  cloudAnimation = loadImage("cloud.png");

  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");

  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");

  trexDeadImage = loadAnimation("trex_collided.png");

  deathSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);

  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("trex_running", trex_running);
	trex.addAnimation("trex_dead", trexDeadImage);

  ground = createSprite(width/2,height-60,width,25);
  ground.addImage(groundImage);
  ground.scale = 1.5;

  edges = createEdgeSprites();

  invisible_ground = createSprite(width/2,height-45,width,20);
  invisible_ground.visible = false;

	invisible_ceiling = createSprite(50,100,1366,20);
	invisible_ceiling.visible = false;


  cactusGroup = new Group();
  cloudsGroup = new Group();

  trex.setCollider("circle",0,0,40);
  trex.debug = false;

  gameOver = createSprite(700,200);
  gameOver.addImage("game over", gameOverImage);

  restart = createSprite(700,310);
  restart.addImage("restart", restartImage);
}


function draw(){
  //definir a cor do plano de fundo 
  background("white");
  
  //registrando a posição y do trex
  console.log(trex.y)
  drawSprites();

  //fazendo o trex colidir com o solo invisível
  trex.collide(invisible_ground);


  //criando gravidade
  trex.velocityY=trex.velocityY+0.2;

   //gerando o power up
   //generateJumpPowerUps();
 
  if (gameState === 0){
     //fazendo o trex pular
    if (touches.lenght > 0 || keyDown("space")&&trex.y>height-100){
      trex.velocityY=-7;
      jumpSound.play();
      touches = [];
    }

    //if (trex.isTouching(jumpPowerUp)){
       //jumpPower = 1;
    //}

    //if(keyDown("space")&&trex.y>542&&jumpPower === 1){
      //trex.velocityY=-15;
      //jumpSound.play();
    //}
   


   if (score % 100 === 0){
     checkpointSound.play();
   }


	 trex.changeAnimation("trex_running");
    
    //fazendo o solo infinito
    ground.velocityX=-(5+score/50);
    if (ground.x<0){
      ground.x=1000;
    }
    //gerando as nuvens
    generateClouds();

    //gerando os cactus
    generateCactus();

   

     //fazendo pontuação
     score = score + Math.round(getFrameRate()/60);



     if (trex.isTouching(cactusGroup)){
       gameState = 1;
       deathSound.play();
     }
    
   trex.visible = true;

   gameOver.visible = false;
   restart.visible = false;

	 if (trex.isTouching(invisible_ceiling)){
		 trex.velocityY = 0.2 * score/150;
	 }
  }

  else if (gameState === 1){
    ground.velocityX=0;
    cactusGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cactusGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("trex_dead");
		trex.velocityX = 0;
		trex.velocityY = 0;
    gameOver.visible = true;
    restart.visible = true;
     if (mousePressedOver(restart)){
       restartFunction();
     }
  }

  //mostrando a pontuação
  textSize(25);
  text("Score: " + score,1000,40);

	
}



function restartFunction(){
  gameState = 0;
  score = 0;
  cactusGroup.setLifetimeEach(0);
  cloudsGroup.setLifetimeEach(0);
}