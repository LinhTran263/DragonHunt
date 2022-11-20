# DragonHunt
# Dragon Hunt

## Inspiration
Taking the theme from Game of Thrones, our game revolves around the themes of the renowned TV show. In our game, the players represent the main houses and they compete with each other. The characters include house Stark, house Targaryan, and the White Walkers.

The mechanism of our game was inspired by Linh’s childhood game “Bomb it”. It is a multiplayer game in which the players have to destroy obstacles and kill the opponents.

## The project
As mentioned before, the graphics of our games contain the characters from the Game of Thrones series/book. For the game mechanism, the players can move around by the key arrows or by “aswd”. The game’s map will generate randomly everytime the page is refreshed and the map will be the same for both players. We are restricting the game to only 2 players. Any other person joining will be the “observer”; they can not move any characters on the screen but they can still see the progress of the game.

## Progress
First, we initialized the sockets and the connection between the servers and the clients.
```
//initialising express app
let express = require("express");
let app = express();
app.use("/", express.static("public"));
```
### The grid
Then, we created a Grid class based on the code that the professor provided. We also made it possible to generate a random map for every time the page is reloaded. We made sure that we generated the random map on the server side so that we could emit the same map to all players of the game. The grid will have paths and obstacles. The players can not pass through the obstacles but can destroy them by shooting it 3 times. The initial positions of the players always do not contain obstacles.
```
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
                    image(ground, i * this.size, j * this.size, this.size, this.size);
                    // rect(i * this.size, j * this.size, this.size, this.size);
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
        // console.log(gridX, gridY, this.grid,gridY * this.cols + gridX, this.grid[gridY * this.cols + gridX]);
        return this.grid[gridY * this.cols + gridX];
    }
    getCoordinates(x,y) {
        let gridX = floor(x / this.size);
        let gridY = floor(y / this.size);

      return [gridX,gridY];
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
```

### The player
Our game will have two players and only two users can control the characters in the game. Any person other than two players will be an observer, they can see the characters moving and playing but they can not control any character on the screen. The players have the following functions to control and move them around.
```
function directionUpdate(player, direction) {}
function playerMove(player) {}
function showPlayers() {}
```
By this, we created an object called player and added the information of x-coordinates, y-coordinates, moving direction, player role, and the scores. Using this object, we continuously emit the object to the server and back to the client so that the position of both players can be seen on different screens.
```
let player = {
  role: "",
  direction: 0,
  x: 32,
  y: 32,
  score: 0,
};

socket.emit("clientPlayerUpdated", playerValues); //call after the character moves
```
The players can also shoot bullets to destroy the obstacles and gain points. The bullets are shot by pressing the space and the direction of the bullets will follow the last direction of the characters. We also emit the bullets data to the server and receive back on the client side to display the bullets on every screen. The functions for the bullets are the following:
```
function keyPressed() {
   if (key == " ") {
      if (player.role == "player1" || player.role == "player2") {
        let bullet = {
          x: player.x,
          y: player.y,
          z: player.direction,
          alive: true,
        };
        bullets.push(bullet);
        socket.emit("clientBulletData", bullets);
      }
    } 
  return false;
}

function drawBullet(bullet) {}
function updateBullets() {}

```
### The layout
We designed the layout in html along with the pages for win and lose. The scores are updated whenever a block is hit. The codes we implemented it as follow:
```
if (gameGrid.grid[blockIndex] == 1) {
  blocksCounter[blockIndex]++;
  if (blocksCounter[blockIndex] > 2) {
    gameGrid.recolorBlock(bullet.x, bullet.y);
    socket.emit("update grid", gameGrid);
    player.score += 1;
```
## Difficulties and Solutions
Initially, we did not know how to make the server recognize the two separate players. Our initial approach was having 2 functions for the 2 different players. To distinguish between 2 players, we used socket.id to recognize the two players. However, this implementation had a few problems. Only the second player recognizes the first player, the first player never recognizes the newly joined second player. This creates a problem that player 2 can see player 1 but player 1 can not see player 2. Secondly, since we did not know the difference between `socket.emit` and `io.emit`, we were confused as to why only 1 screen is getting updated with the grid.

However, this was resolved by acknowledging the difference between them and using `socket.broadcast.emit("serverPlayerUpdated",playerValues, 1);`, we have successfully emitted the positions of both players to both screens accordingly. The grid was also resolved by creating the grid on the server side instead of the client side and then emitting all of the information to the server side. Our initial mistake with the grid was that it only emits it when there are two people. However, this way is incorrect since the first player joining will never have 2 players in the game. Therefore, the grid will never be emitted to the first player.

## Challenges

Although we were able to resolve many of the issues we were facing initially, some problems still persist. One problem we have is that the characters are glitching whenever there are 2 players moving at the same time. We are yet to figure out how to handle this issue.

Additionally, the method of computing the score seems to be incorrect often so we need to rethink our approach in order to make it consistent and logical so that ending the game makes sense.

Our last challenge, and the most important one, is getting the game to end. For some reason, the game end condition is always entered every time the bullets are shot, so we had to comment out ending the game until the issue is resolved.

## Future

We just hope to resolve the above issues in the future, with the possibility of adding coins that increase the score of players and conditions such that killing a Night Walker gives you one point while killing the opponent gives you 10 points, so players should try to strategize how they can the game. We also hope to add more games to the application and to better style and design the other win/lose pages and main menu.



