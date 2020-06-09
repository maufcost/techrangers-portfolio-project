var socket;

function setup() {
    // put setup code here
    const canvas = createCanvas(400, 200);
    canvas.parent("canvas-holder");
    background(37, 39, 51);

    socket = io.connect("https://vast-mountain-31312.herokuapp.com/");

    socket.on("mouse", newDrawing);
}

function newDrawing(data) {
    fill(255, 1, 100);
    noStroke();
    ellipse(data.x, data.y, 10, 10);
}

function mouseDragged() {

    var data = {
        x: mouseX,
        y: mouseY
    }

    socket.emit("mouse", data);

    fill(255, 193, 109);
    noStroke();
    ellipse(mouseX, mouseY, 10, 10);
}
