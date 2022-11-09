//initialising express app
let express = require("express");
let app = express();
app.use("/", express.static("public"))
let playerCount = 0;


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

    // let playerNo = {
    //     number: playerNumber
    // }
    // socket.emit("playerJoin",playerNo);
    if (playerCount <= 2) {
        socket.on("clientData", function(data) {
            // console.log(data);
            io.sockets.emit("serverData",data);
        });
        
        socket.on("bulletData", function(data) {
            io.sockets.emit("bulletServer", data);
        });
    }

    
    
    //when socket is disconneted
    socket.on("disconnect", ()=>{
        console.log("Socket Disconnected: ", socket.id);
        playerCount--;
        console.log("Player Count: ", playerCount);
    });
    
});

