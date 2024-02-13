let canvasWidth = 720; // Set the width of the canvas
let canvasHeight = 720; // Set the height of the canvas

let background; // background ?



function preload() {
    // background = loadImage('background.png', () => {
    //     const aspectRatio = background.width / background.height;
    //     canvasHeight = windowHeight * 7 / 8; 
    //     canvasWidth = canvasHeight * aspectRatio; 
    //     field.resize(canvasWidth, canvasHeight); 
    //   });
}

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    drawGrid(20, 20);
}

function drawGrid(spacingX, spacingY) {
    stroke(200);
    strokeWeight(1);
  
    for (let x = 0; x <= width; x += spacingX) {
      line(x, 0, x, height);
    }
  
    for (let y = 0; y <= height; y += spacingY) {
      line(0, y, width, y);
    }
}

function positionElements() {

}

function draggable() {

}