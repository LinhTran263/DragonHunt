//initialising express app
let express = require("express");
let app = express();
app.use("/", express.static("public"))


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

    socket.on("data", function(data) {
        // console.log(data);
        io.sockets.emit("data",data);
    });
    //when socket is disconneted
    socket.on("disconnect", ()=>{
        console.log("Socket Disconnected: ", socket.id)
    });
    
});

