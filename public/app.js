let socket = io();
let canvasWidth = 512;
let canvasHeight = 512;
let bullets = [];

let char1X=32;
let char1Y=32;
let char2X=480;
let char2Y=480;
let d=40;
let player1Pos;
let player2Pos;

let xspeed = 8;
let yspeed = 8;

let bulletSpeed = 2;

let player1Number = 1;
let player2Number = 2;

function char1Move() {
    if (char1Direction ==0) {
        if (char1Y < canvasHeight) {
            char1Y += yspeed;
        }
    }
    if (char1Direction ==1) {
        if (char1X < canvasWidth) {
            char1X += xspeed;
        }
    }
    if (char1Direction ==2) {
        if (char1Y > 0) {
            char1Y -= yspeed;
        }
    }
    if (char1Direction ==3) {
        if (char1X > 0) {
            char1X -= xspeed;
        }
    }
    // console.log(charX, charY);
    char1Dragged();
}



function char2Move() {
    if (char2Direction ==0) {
        if (char2Y < canvasHeight) {
            char2Y += yspeed;
        }
    }
    if (char2Direction ==1) {
        if (char2X < canvasWidth) {
            char2X += xspeed;
        }
    }
    if (char2Direction ==2) {
        if (char2Y > 0) {
            char2Y -= yspeed;
        }
    }
    if (char2Direction ==3) {
        if (char2X > 0) {
            char2X -= xspeed;
        }
    }
    // console.log(charX, charY);
    char2Dragged();
}
socket.on("connect", function(){
    console.log("Connection established to server via socket");
});

class Grid {
    constructor(size, rows, cols) {
        //you can create an actual grid with 0s and 1s and 2s and so on
        // random grid generator
        this.grid =``;
        this.grid+= `0`;
        for(let i = 1; i < 64; i++) {

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
        // console.log(gridX, gridY);
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

function keyPressed(){
        if (key == ' '){
            let bullet = {
                x: char1X,
                y: char1Y,
                z: char1Direction,
                alive: true
            };
            bullets.push(bullet);
            socket.emit("bulletData", bullet)
        }    

    }

let char1Direction = 1;
let char2Direction = 1;


  
function draw() {
    background(220);
    gameGrid.gridDraw(); //draw the grid

    // if (keyIsDown) {
        if (keyIsPressed){
            if ((keyCode === DOWN_ARROW)) {
                char1Direction = 0;
                char1Move();
            }
            else if ((keyCode === LEFT_ARROW)) {
                char1Direction = 3;
                char1Move();
            }
            else if ((keyCode === RIGHT_ARROW)) {
                char1Direction = 1;
                char1Move();
            }
            else if ((keyCode === UP_ARROW)) {
                char1Direction = 2;
                char1Move();
            }

            if (key == 's') {
                char2Direction = 0;
                char2Move();
            }
            else if (key == 'a') {
                char2Direction = 3;
                char2Move();
            }
            else if (key == 'd') {
                char2Direction = 1;
                char2Move();
            }
            else if (key == 'w') {
                char2Direction = 2;
                char2Move();
            }
        }
        // else if (keyIsPressed(LEFT_ARROW)|| key == 'a') {
        //     charDirection = 3;
        //     charMove();
        // }
        // else if (keyIsPressed(RIGHT_ARROW)|| key == 'd') {
        //     charDirection = 1;
        //     charMove();
        // }
        // else if (keyIsPressed(UP_ARROW)|| key == 'w') {
        //     charDirection = 2;
        //     charMove();
        // }
        player1Pos = gameGrid.getCurrValue(char1X, char1Y);
        player2Pos = gameGrid.getCurrValue(char2X, char2Y);
        socket.on("serverData", function(obj){
            // console.log(obj);
            drawChar(obj);
        }) 
    // }
    if(player1Pos==1) {
        fill(255,0,0) 
    } else {
        fill(0);
    }
    ellipse(char1X,char1Y,d);
    if(player2Pos==1) {
        fill(255,0,0) 
    } else {
        fill(0);
    }
    ellipse(char2X,char2Y,d);
    for (let bullet of bullets){
        
        // bullet.x += 2;
        if (bullet.z == 1){
            if (bullet.x < canvasWidth) {
                bullet.x +=bulletSpeed;
            }
            else {
                bullet.alive = false;
            }
        }
        else if (bullet.z == 2){
            if (bullet.y > 0) {
                bullet.y -=bulletSpeed;
            }
            else {
                bullet.alive = false;
            }
        }
        else if (bullet.z == 3){
            if (bullet.x > 0) {
                bullet.x -=bulletSpeed;
            }
            else {
                bullet.alive = false;
            }
        }
        else if(bullet.z == 0){
            if (bullet.y < canvasHeight) {
                bullet.y +=bulletSpeed;
            }
            else {
                bullet.alive = false;
            }
        }
        if (bullet.alive) {
            ellipse(bullet.x,bullet.y,10);
            // console.log(bullet.x,bullet.y);
        }
        
    }
    socket.on("bulletServer", (data)=>{
        for (let bullet of bullets){
            if (bullet.alive) {
                drawBullet(data);
                console.log(data);
            }
            else {
                bullets.remove(bullet);
            }
        }
            
    })  

}
// console.log(charX,charY);

function char1Dragged() {
    let charObj = {
        player: player1Number,
        x : char1X,
        y : char1Y
    };
    socket.emit("clientData",charObj);
    // console.log(charX);
    // console.log(charY);
}
function char2Dragged() {
    let charObj = {
        player: player2Number,
        x : char2X,
        y : char2Y
    };
    socket.emit("clientData",charObj);
    // console.log(charX);
    // console.log(charY);
}
function drawChar(data) {
    // console.log(data);
    if (data.player ==1) {
        player1Number = data.player;
        char1X = data.x;
        char1Y = data.y;
        
    }
    else if (data.player ==2) {
        player2Number = data.player;
        char2X = data.x;
        char2Y = data.y;   
    }
}

function drawBullet(data){
    ellipse(data.x, data.y,10);
}