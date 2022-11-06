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

let xspeed = 5;
let yspeed = 5;

let charDirection = 1;

function move() {
    if (charDirection ==0) {
        if (y < windowHeight) {
            y += yspeed;
        }
    }
    if (charDirection ==1) {
        if (x < windowWidth) {
            x += xspeed;
        }
    }
    if (charDirection ==2) {
        if (y > 0) {
            y -= yspeed;
        }
    }
    if (charDirection ==3) {
        if (x > 0) {
            x -= xspeed;
        }
    }
}
  
function draw() {
    background(220);
    
    if (keyIsPressed) {
        if (keyCode == DOWN_ARROW|| key == 's') {
            charDirection = 0;
            move();
        }
        else if (keyCode == LEFT_ARROW|| key == 'a') {
            charDirection = 3;
            move();
        }
        else if (keyCode == RIGHT_ARROW|| key == 'd') {
            charDirection = 1;
            move();
        }
        else if (keyCode == UP_ARROW|| key == 'w') {
            charDirection = 2;
            move();
        }
    }
    ellipse(x,y,d);
}
