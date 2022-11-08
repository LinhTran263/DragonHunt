let socket = io();
let canvasWidth = 512;
let canvasHeight = 512;

socket.on("connect", function(){
    console.log("Connection established to server via socket");
});

class Grid {
    constructor(size, rows, cols) {
        //you can create an actual grid with 0s and 1s and 2s and so on
        // random grid generator
        this.grid =``;
        for(let i = 0; i < 64; i++) {

            this.grid+=(`${Math.floor(Math.random() * 2)}`);
        }
        this.grid = this.grid.replace(/\s/g, ""); // IMP : This step removes all the whitespaces in the grid.
        this.size = size;
        this.rows = rows;
        this.cols = cols;
        this.currVal = 0;
    }
  
    gridDraw() {
        //each number in your grid can be a particular element or colour - depends on your game logic
        //loop through the rows and columns and find the grid value at that position in the array
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
            //get the grid value - is it 0 or 1
            let gridVal = this.grid[j * this.rows + i];
    
            // depending on the value, you can give it the appropriate colour/shape/image
            if (gridVal == 0) {
                fill(255);
                rect(i * this.size, j * this.size, this.size, this.size);
            } else if (gridVal == 1) {
                fill(128);
                rect(i * this.size, j * this.size, this.size, this.size);
            }
            }
        }
    }
    getCurrValue(x, y) {
        let gridX = floor(x / this.size);
        let gridY = floor(y / this.size);
        print(gridX, gridY);
        return this.grid[gridY * this.cols + gridX];
    }
}
let gameGrid; 
function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.id = "canvas";
    canvas.parent("game_container");
    gameGrid = new Grid(64, 8,8); //create a new Grid object
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
        if (charY < canvasHeight) {
            charY += yspeed;
        }
    }
    if (charDirection ==1) {
        if (charX < canvasWidth) {
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
    gameGrid.gridDraw(); //draw the grid
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
    // ellipse(200,200,d);

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