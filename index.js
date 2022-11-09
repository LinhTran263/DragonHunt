//initialising express app
let express = require("express");
let app = express();
app.use("/", express.static("public"))
let playerCount = 0;
let players = ["-1","-1"];

let grid =``;
grid+= `0`;
for(let i = 1; i < 64; i++) {
    grid+=(`${Math.floor(Math.random() * 2)}`);
}



//creating an http server ON the express app
let http = require("http");
let server = http.createServer(app);
server.listen(3000, ()=>{
    console.log("listening on 3000")
})


//add sockets on top of the http server
let io = require("socket.io");
io = new io.Server(server);



//when socket is connected
io.sockets.on("connect", (socket)=>{
    console.log("New Connection: ", socket.id);
    playerCount++;
    console.log("Player Count: ", playerCount);
    io.sockets.emit("gridNumbers", grid);

    if (playerCount == 1) {
        // if (players[0] == "-1") {
        //     players[0] = socket.id;
        // }
        players[0] = socket.id;
        // players.push(socket.id);
        io.sockets.emit("playerID", players);
        
    }
    else if (playerCount == 2) {
        io.sockets.emit("gridNumbers", grid);
        for (let i = 0; i < players.length; i++) {
            if (players[i] == "-1") {
                players[i] = socket.id;
                break;
            }
            
        }
        // players.push(socket.id);
        io.sockets.emit("playerID", players);
        socket.on("clientData", function(data) {
            // console.log(data);
            io.sockets.emit("serverData",data);
        });

        socket.on("bulletData", function(bullet) {
            io.sockets.emit("bulletServer", bullet);
        });
    }

    
    
    //when socket is disconneted
    socket.on("disconnect", ()=>{
        for (let i = 0; i < players.length; i++) {
            if (players[i] == socket.id) {
                players[i] = "-1";
                break;
            }
        }
         console.log("Socket Disconnected: ", socket.id);
        playerCount--;
        console.log("Player Count: ", playerCount);
    });
    
});

