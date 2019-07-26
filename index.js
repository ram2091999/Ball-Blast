//jshint esversion:6
var score=0;
var highScore=(localStorage.getItem("highScore")!=null)?JSON.parse(localStorage.getItem("highScore")):0;
var doAnim=true;
var cannonImage=new Image();
cannonImage.src="https://media.giphy.com/media/l378g63KNpsdmJOP6/giphy.gif";


class Cannon {

  constructor(GAME_WIDTH, GAME_HEIGHT) {
    this.width = 70;
    this.height = 100;
    this.maxSpeed = 30;
    this.speed = 0;
    this.position = {
      x: GAME_WIDTH / 2 - this.width / 2,
      y: GAME_HEIGHT - this.height
    };

  }
  moveLeft() {
    this.speed = -this.maxSpeed;
  }
  moveRight() {
    this.speed = this.maxSpeed;
  }
  stop() {
    this.speed = 0;
  }


  draw(ctx) {
    ctx.fillStyle = "#0ff";
    //ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.drawImage(cannonImage,this.position.x, this.position.y, this.width, this.height);

  }




  update(dt) {
    if (!dt) return;
    this.position.x += this.speed;


    if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.x + this.width > GAME_WIDTH) {
      this.position.x = GAME_WIDTH - this.width;
    }




  }


}
var bulletImage=new Image();
bulletImage.src="http://pixelartmaker.com/art/61b1cd1b05f8c4e.png";

class Bullet {
  constructor(x, y) {
    this.position = {
      x: x,
      y: y
    };
    this.speed = 20;
    this.radius=20;
  }
  draw(ctx) {
    //ctx.beginPath();
    //ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
    //ctx.fillStyle="#ff0";
    //ctx.fill();
    //ctx.closePath();
    ctx.drawImage(bulletImage,this.position.x-this.radius/2,this.position.y-this.radius/2,this.radius,this.radius*1.3);
  }
  update(dt,rocks) {
    if (!dt) return;
    for(let i=0;i<rocks.length;i++){
      if(distance(this.position.x,this.position.y,rocks[i].position.x,rocks[i].position.y)<=this.radius+rocks[i].radius/2+10){
      this.radius=0;
      rocks[i].radius-=1;
      score++;

    }
  }
    this.position.x += 0;
    this.position.y -= this.speed;

  }
}
var rockImage=new Image();
rockImage.src="https://media.giphy.com/media/2Y7jWoJEmPB0qj6dRG/giphy.gif";


class Rock {
  constructor(x,y,r){
    this.radius=r;
    this.initialRadius=r;
    this.position={
      x:x,
      y:y
    };
    this.speed={
      x:(Math.random()-0.5)*20,
      y:(Math.random()-0.5)*20
    };

  }
  draw(ctx){
    ctx.beginPath();
    //ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
    //ctx.fillStyle="#eee";
    //ctx.fill();
    ctx.drawImage(rockImage,this.position.x-this.radius,this.position.y-this.radius,2*this.radius,2*this.radius);
    ctx.font = "30px Roboto";
    ctx.fillStyle="#000";
    let score=this.radius.toString();
    ctx.fillText(score,this.position.x-this.radius/4,this.position.y+3,this.radius*0.8);
    ctx.closePath();
  }
  update(dt,cannon){
    if(!dt)return;
    this.position.x+=this.speed.x;
    this.position.y+=this.speed.y;
    this.speed.y+=0.1;
    if (this.position.x-this.radius/2 < 0&&this.speed.x<0) {
      this.speed.x*=-1 ;
    }
    if (this.position.x + this.radius/2 > GAME_WIDTH&&this.speed.x>0) {
      this.speed.x*= -1;
    }
    if((this.position.y+this.radius/2+this.speed.y>=GAME_HEIGHT)||(this.position.y-this.radius/2<=0&&this.speed.y<0)){
      this.speed.y*=-1;
    }
    if(this.position.y+this.radius/2>GAME_HEIGHT-cannon.height&&(this.position.x>cannon.position.x&&this.position.x<cannon.position.x+cannon.width))
    gameOver();
  }
}

function gameOver(){
  doAnim=false;
  if(score>highScore){
    highScore=score;
    localStorage.setItem("highScore",JSON.stringify(highScore));
      document.getElementsByTagName("h1")[1].classList.add("blinking");
  }
  document.getElementsByClassName("gameOver")[0].style.display="block";
  canvas.style.display="none";
  document.getElementsByTagName("h1")[0].innerHTML="Your Score is "+score;
  document.getElementsByTagName("h1")[1].innerHTML="Your HighScore is "+highScore;
  var button=document.getElementById("abc");
  button.addEventListener("click",function(){location.reload();});
}
//document.getElementById("abc").addEventListener("click",function(){alert("hi");});



class InputHandler {
  constructor(cannon) {
    document.addEventListener("keydown", (event) => {
      if (event.keyCode == 37||event.keyCode==65) {
        cannon.moveLeft();
      } else if (event.keyCode == 39||event.keyCode==68) {
        cannon.moveRight();
      }
    });
    document.addEventListener("keyup", (event) => {
      if ((event.keyCode == 37||event.keyCode==65) && cannon.speed < 0) {
        cannon.stop();
      } else if ((event.keyCode == 39||event.keyCode==68) && cannon.speed > 0) {
        cannon.stop();
      }
    });
  }
}
function distance(x1,y1,x2,y2){
  return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, 800, 600);
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
var cannon = new Cannon(GAME_WIDTH, GAME_HEIGHT);
var bullets = [];
var rocks=[];
var bullet = new Bullet(cannon.position.x + cannon.width / 2, cannon.position.y + cannon.height / 2);
var inputRock=[-10,GAME_WIDTH+10];
var inputIndex;
new InputHandler(cannon);


var lastTime = 0;
cannon.draw(ctx);
var ticker=0;
function gameLoop(timeStamp) {
  if(!doAnim){return;}
  dt = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  var bullet = new Bullet(cannon.position.x + cannon.width / 2, cannon.position.y + cannon.height / 2);
  if(ticker%200==0){
    inputIndex=Math.floor(Math.random()*2);
    let y=inputRock[inputIndex];
    var rock=new Rock(y,Math.random()*GAME_HEIGHT-GAME_HEIGHT/2,Math.floor(Math.random()*50)+50);
    console.log(y);
    rocks.push(rock);}
  ticker++;
  for(var h=0;h<3+Math.floor(score/200);h++)
   bullets.push(bullet);
  cannon.update(dt);
  cannon.draw(ctx);
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[0].position.y < 0)
      bullets.shift();
      if(bullets[i].radius!=0){
    bullets[i].update(dt,rocks);
    bullets[i].draw(ctx);}

  }
  for(var j=0;j<rocks.length;j++){
    if(rocks[j].radius>=15){
    rocks[j].update(dt,cannon);
    rocks[j].draw(ctx);}
    else{
      if(rocks[j].initialRadius>=30){
      rocks.push(new Rock(rocks[j].position.x,rocks[j].position.y,rocks[j].initialRadius/2));
      rocks.push(new Rock(rocks[j].position.x,rocks[j].position.y,rocks[j].initialRadius/2));
    }rocks.splice(j,1);
    }
  }


  updateScore();
  requestAnimationFrame(gameLoop);
}
function updateScore(){
  score.toString();
  ctx.fillStyle="#866ec7";
  ctx.font="30px Montserrat";
  ctx.fillText(score,0.9*GAME_WIDTH,30);
  ctx.closePath();
}
gameLoop();
