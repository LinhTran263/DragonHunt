let socket = io();
let canvasWidth = 512;
let canvasHeight = 512;
let bullets = [];

let char1X=32;
let char1Y=32;
let char2X=480;
let char2Y=480;
let d=50;
let player1Pos;
let player2Pos;

let xspeed = 8;
let yspeed = 8;

let bulletSpeed = 2;

let char1Direction = 1;
let char2Direction = 1;

let gameOn = true;
let gameGrid; 
let playerList=[];
let blocksCounter = [];

let ground;
let blueChar;
let redChar;
let villain;


let tempCounter = 0;
const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1); 

function preload() {
    ground = loadImage("images/ground_tile.jpeg");
    blueChar = loadImage("images/stark_2.png");
    redChar = loadImage("images/targaryan_2.png");
    villain = loadImage("images/white_walker.png");
}

console.log(playerList);
function charDragged(playerSocket) {
    // let charObj;
    if (playerSocket == playerList[0]) {
        let charObj = {
            player: 1,
            x : char1X,
            y : char1Y
        };    
        socket.emit("clientData",charObj);
    }
    else if (playerSocket == playerList[1]){
        let charObj = {
            player: 2,
            x : char2X,
            y : char2Y
        };
        socket.emit("clientData",charObj);
    } 
    
    // console.log(charX);
    // console.log(charY);
}
function charMove( playerSocket) {
    let futureStep;
    if (playerSocket == playerList[0]) {
        if (char1Direction ==0) {
            futureStep = gameGrid.getCurrValue(char1X, (char1Y + d/2)); 
            if (char1Y+d/2 < canvasHeight && futureStep == 0) {
                char1Y += yspeed;
            }
        }
        if (char1Direction ==1) {
            futureStep = gameGrid.getCurrValue((char1X + d/2), char1Y); 
            if (char1X+d/2 < canvasWidth && futureStep == 0) {
                char1X += xspeed;
            }
        }
        if (char1Direction ==2) {
            futureStep = gameGrid.getCurrValue(char1X, (char1Y - d/2)); 
            if (char1Y-d/2 > 0 && futureStep == 0) {
                char1Y -= yspeed;
            }
        }
        if (char1Direction ==3) {
            futureStep = gameGrid.getCurrValue((char1X - d/2), char1Y); 
            if (char1X-d/2 > 0 && futureStep == 0) {
                char1X -= xspeed;
            }
        }
    }
    else if (playerSocket == playerList[1]) {
        if (char2Direction ==0) {
            futureStep = gameGrid.getCurrValue(char2X, (char2Y + d/2)); 
            if (char2Y +d/2 < canvasHeight && futureStep == 0) {
                char2Y += yspeed;
            }
        }
        if (char2Direction ==1) {
            futureStep = gameGrid.getCurrValue((char2X + d/2), char2Y); 
            if (char2X +d/2< canvasWidth && futureStep == 0) {
                char2X += xspeed;
            }
        }
        if (char2Direction ==2) {
            futureStep = gameGrid.getCurrValue(char2X, (char2Y - d/2)); 
            if (char2Y -d/2> 0 && futureStep == 0) {
                char2Y -= yspeed;
            }
        }
        if (char2Direction ==3) {
            futureStep = gameGrid.getCurrValue((char2X - d/2), char2Y); 
            if (char2X -d/2> 0 && futureStep == 0) {
                char2X -= xspeed;
            }
        }  
    }
    else {
        console.log("can't move, not one of the two players");
    }
    
    // console.log(charX, charY);
    charDragged(playerSocket);
}
function keyPressed(){
    if (key == ' '){
        if (socket.id == playerList[0]) {
            let bullet = {
                x: char1X,
                y: char1Y,
                z: char1Direction,
                alive: true
            };
            bullets.push(bullet);
            socket.emit("bulletData", bullet);
        } 
        else if (socket.id == playerList[1]) {
            let bullet = {
                x: char2X,
                y: char2Y,
                z: char2Direction,
                alive: true
            };
            bullets.push(bullet);
            socket.emit("bulletData", bullet);    
        }  
        else {
            console.log("neither sockets attached");
        }

    } 
}


socket.on("connect", function(){
    console.log("Connection established to server via socket");
    if (playerList[0] == socket.id) {
        // player1Socket = socket.id;
        console.log("this is player 1: ",socket.id);
    }
    else if (playerList[1] == socket.id) {
        // player2Socket = socket.id;
        console.log("this is player 2: ",socket.id);
    }
    else {
        console.log("player is not on list");
    }
});
socket.on("playerID", (data)=>{
    tempCounter++;
    console.log("PLAYER ID SCOKET HAS RUN", tempCounter);
    // playerList.push(data);
    for (let i = 0; i < data.length; i++) {
        playerList.push(data[i]);
    }
    // socket.emit("clientSocket",playerList);
    // console.log(data);
});
class Grid {
    constructor(size, rows, cols) {
        //you can create an actual grid with 0s and 1s and 2s and so on
        // random grid generator
        this.grid =``;
        socket.on("gridNumbers", (data)=>{
            this.grid += data;
        });
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
                    fill(200);
                    // background(50);
                    // image(ground, i * this.size, j * this.size, this.size, this.size);
                    rect(i * this.size, j * this.size, this.size, this.size);
                } else if (gridVal == 1) {
                    // fill(128);
                    image(villain, i * this.size, j * this.size, this.size, this.size)
                    // rect(i * this.size, j * this.size, this.size, this.size);
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
    getIndex(x,y) {
        let gridX = floor(x / this.size);
        let gridY = floor(y / this.size);
        return gridY * this.cols + gridX;
    }
    recolorBlock(x,y) {
        let gridX = floor(x / this.size);
        let gridY = floor(y / this.size);
        let temp = ``;
        for (let i = 0; i < gridY * this.cols + gridX; i++) {
            temp += this.grid[i];
        }
        temp+= `0`;
        for (let i = gridY * this.cols + gridX + 1; i< 64; i++) {
            temp += this.grid[i];
        }
        this.grid = temp;

    }
}

function setup() {
    
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.id = "canvas";
    canvas.parent("game_container");
    gameGrid = new Grid(64, 8,8); //create a new Grid object
    for (let j = 0; j < 64; j++) {
        blocksCounter[j] = 0;
    }
  }
  
function draw() {
    background(220);
    gameGrid.gridDraw(); //draw the grid
    
    // if (keyIsDown) {
        if (keyIsPressed){
            if ((keyCode === DOWN_ARROW)) {
                if (socket.id == playerList[0]) {
                    char1Direction = 0;
                    charMove(socket.id);
                }
                else if (socket.id == playerList[1]) {
                    char2Direction =0;
                    charMove(socket.id);
                }
            }
            else if ((keyCode === LEFT_ARROW) || (key == 'a')) {
                if (socket.id == playerList[0]) {
                    char1Direction = 3;
                    charMove(socket.id);
                }
                else if (socket.id == playerList[1]) {
                    char2Direction = 3;
                    charMove(socket.id);
                }
            }
            else if ((keyCode === RIGHT_ARROW) || (key == 'd')) {
                if (socket.id == playerList[0]) {
                    char1Direction = 1;
                    charMove(socket.id);
                }
                else if (socket.id == playerList[1]) {
                    char2Direction = 1;
                    charMove(socket.id);
                }
            }
            else if ((keyCode === UP_ARROW) || (key == 'w')) {
                if (socket.id == playerList[0]) {
                    char1Direction = 2; 
                    charMove(socket.id);      
                }
                else if (socket.id == playerList[1]) {
                    char2Direction = 2;
                    charMove(socket.id);
                }
            }

        }
        player1Pos = gameGrid.getCurrValue(char1X, char1Y);
        player2Pos = gameGrid.getCurrValue(char2X, char2Y);
        socket.on("serverData", function(obj){
            if (socket.id ==  playerList[0]) {
                drawChar(obj, socket.id);
            }
            else if (socket.id == playerList[1]) {
                drawChar(obj, socket.id);
            }
            // console.log(obj);
            
        }) 
    // }
    if(player1Pos==1) {
        fill(255,0,0) 
    } else {
        fill(0);
    }
    image(blueChar, char1X - d/2,char1Y - d/2, d,d);
    // ellipse(char1X,char1Y,d);
    if(player2Pos==1) {
        fill(255,0,0) 
    } else {
        fill(0);
    }
    image(redChar, char2X - d/2,char2Y - d/2, d,d);
    for (let bullet of bullets){
        
        let bulletPos = gameGrid.getCurrValue(bullet.x,bullet.y);
        let blockIndex;
        if (bullet.alive) {
            ellipse(bullet.x,bullet.y,10);
            if (bulletPos == 0) {
                if (bullet.z == 1){
                    if (bullet.x < canvasWidth) {
                        bullet.x +=bulletSpeed;
                    }
                    else {
                        bullet.alive = false;
                    }
                }
                else if (bullet.z == 2 ){
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
            }
            else {
                
                blockIndex = gameGrid.getIndex(bullet.x,bullet.y);

                if (gameGrid.grid[blockIndex] == 1) {
                    blocksCounter[blockIndex]++;
                    if (blocksCounter[blockIndex] >2) {
                        gameGrid.recolorBlock(bullet.x,bullet.y);
                    } 
                }
                bullet.alive = false;
                bullets.splice(blockIndex,1);
                console.log(blocksCounter);
            }
        } 
        
    }
    socket.on("bulletServer", (data)=>{
        for (let bullet of bullets){
            if (bullet.alive) {
                drawBullet(data);
                // console.log(data);
            }
            // else {
            //     bullets.remove(bullet);
            // }
        }
            
    });  
}

function drawChar(data, playerSocket) {
    // console.log(data);
    if (playerSocket == playerList[0]) {
        // player1Number = data.player;
        char1X = data.x;
        char1Y = data.y;
        
    }
    else if (playerSocket == playerList[1]) {
        // player2Number = data.player;
        char2X = data.x;
        char2Y = data.y;   
    }
}

function drawBullet(data){
    ellipse(data.x, data.y,10);
    // keyPressed();
}