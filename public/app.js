let socket = io();

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("game_container");
  }
  
  function draw() {
    background(220);
  }

socket.on("connect", ()=>{
    console.log("Connection established to server via socket");
});
