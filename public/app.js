let socket = io();

socket.on("connect", ()=>{
    console.log("Connection established to server via socket");
});


function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("game_container");
  }


let x=200;
let y=200;
let d=40;
  
function draw() {
    background(220);
    if (keyIsPressed){
    if (keyCode == LEFT_ARROW){
        x--;
    }
    else if (keyCode == RIGHT_ARROW){
        x++;
    }
    else if (keyCode == UP_ARROW){
        y--;
    }
    else if(keyCode == DOWN_ARROW){
        y++;
    }
    }
    ellipse(x,y,d);
}