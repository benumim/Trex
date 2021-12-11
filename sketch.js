var trex ;

var ground;

var trex_running, groundImage;

var edges;

var marks=[30,40,45,35];

var sum = 0;

var invisible_ground;

var cloud;
var cloudAnimation;

var cactus1, cactus2, cactus4, cactus5;
var cactus;

var score = 0;

var gameState = 0;

function generateClouds(){
  if (frameCount % 60 === 0){
    cloud = createSprite(1366,Math.round(random(190,425)),60,45);
    cloud.addImage(cloudAnimation);
    cloud.velocityX = -6;
    cloud.depht = trex.depht;
    trex.depht = trex.depht + 1;
    cloud.lifetime = 280;
  }
}

function generateCactus(){
  if (frameCount % 150 === 0 || frameCount % 210 === 0){
    cactus = createSprite(1366,550,20,60);
    cactus.velocityX = -5;
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
}

function setup(){
  createCanvas(1366,623);

  trex = createSprite(50,360,20,50);
  trex.addAnimation("trex_running", trex_running);

  ground = createSprite(200,575,400,25);
  ground.addImage(groundImage);

  edges = createEdgeSprites();

  invisible_ground = createSprite(50,600,1366,20);
  invisible_ground.visible = false;

  cactusGroup = new Group();
  cloudsGroup = new Group();
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

  if (gameState === 0){
     //fazendo o trex pular
    if (keyDown("space")&&trex.y>542){
    trex.velocityY=-7;
   }

    
    //fazendo o solo infinito
    ground.velocityX=-5;
    if (ground.x<0){
      ground.x=1000;
    }
    //gerando as nuvens
    generateClouds();

    //gerando os cactus
    generateCactus();

     //fazendo pontuação
     score = score + Math.round(frameCount/60);

     if (trex.isTouching(cactus)){
       gameState = 1;
     }
  }

  else if (gameState === 1){
    ground.velocityX=0;
  }

  //mostrando a pontuação
  textSize(25);
  text("Score: " + score,1000,40);
}