let socket = io();

socket.on("connect", ()=>{
    console.log("Connection established to server via socket");
});
