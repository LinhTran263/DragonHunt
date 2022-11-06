let socket = io();

socket.on("connect", ()=>{
    console.log("Connection established to server via socket");
});


function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("game_container");
  }

window.addEventListener("load", ()=>{
    socket.on("serverData", (data)=>{
        drawPaint(data);
    })
})
let charX=200;
let charY=200;
let d=40;

let xspeed = 5;
let yspeed = 5;

let charDirection = 1;

function move() {
    if (charDirection ==0) {
        if (charY < windowHeight) {
            charY += yspeed;
        }
    }
    if (charDirection ==1) {
        if (charX < windowWidth) {
            charX += xspeed;
        }
    }
    if (charDirection ==2) {
        if (charY > 0) {
            charY -= yspeed;
        }
    }
    if (charDirection ==3) {
        if (charX > 0) {
            charX -= xspeed;
        }
    }
}
  
function draw() {
    background(220);
    
    // if (keyIsDown) {
        if (keyIsDown(DOWN_ARROW)|| key == 's') {
            charDirection = 0;
            move();
        }
        if (keyIsDown(LEFT_ARROW)|| key == 'a') {
            charDirection = 3;
            move();
        }
        if (keyIsDown(RIGHT_ARROW)|| key == 'd') {
            charDirection = 1;
            move();
        }
        if (keyIsDown(UP_ARROW)|| key == 'w') {
            charDirection = 2;
            move();
        }
    // }
    ellipse(charX,charY,d);
}

function charDragged() {
    let charObj = {
        x : charX,
        y : charY
    }
    socket.emit('charData',charObj);
}

function drawPaint(data) {
    ellipse(data.x, data.y, d);
    stroke(255);
}