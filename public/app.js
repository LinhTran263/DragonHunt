let socket = io();

socket.on("connect", function(){
    console.log("Connection established to server via socket");
});

function setParentToCanvas(item) {
    item.parentNode("canvas");
}
function setParent(element, newParent) {
    newParent.appendChild(element);
}
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.id = "canvas";
    canvas.parent("game_container");
    
    let grids = document.getElementsByClassName("grid-block");
    // for each let i in grids) {
    //     grids[i].parent("canvas");
    // }
    // grids.forEach(setParentToCanvas);
    for (i in grids) {
        setParent(grids[i],document.getElementById("canvas"));
    }
    // grids.forEach(setParentToCanvas);
    
  }

// window.addEventListener("load", ()=>{
       
// })
let charX=200;
let charY=200;
let d=40;

let xspeed = 5;
let yspeed = 5;

let charDirection = 1;

function charMove() {
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
    // console.log(charX, charY);
    charDragged();
}
  
function draw() {
    background(220);
    
    // if (keyIsDown) {
        if (keyIsDown(DOWN_ARROW)|| key == 's') {
            charDirection = 0;
            charMove();
        }
        else if (keyIsDown(LEFT_ARROW)|| key == 'a') {
            charDirection = 3;
            charMove();
        }
        else if (keyIsDown(RIGHT_ARROW)|| key == 'd') {
            charDirection = 1;
            charMove();
        }
        else if (keyIsDown(UP_ARROW)|| key == 'w') {
            charDirection = 2;
            charMove();
        }
        socket.on("data", function(obj){
            // console.log(obj);
            drawPaint(obj);
        }) 
    // }
    ellipse(charX,charY,d);
    ellipse(200,200,d);

}
// console.log(charX,charY);

function charDragged() {
    let charObj = {
        x : charX,
        y : charY
    };
    socket.emit('data',charObj);
    // console.log(charX);
    // console.log(charY);
}

function drawPaint(data) {
    // console.log(data);
    fill(0);
    ellipse(data.x, data.y, d);
    charX = data.x;
    charY = data.y;
    // stroke(255);
}