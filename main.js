const canvas = document.getElementById("Display");
const ctx = canvas.getContext("2d");

let dragging = false;
let dragStart = {x:0,y:0};
let cameraOffset = {x:0,y:0}

function draw()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(cameraOffset.x, cameraOffset.y);
  ctx.fillStyle = "#00CC00";
  ctx.fillRect(0, 0, 100, 50);
}

function onPointerDown(e)
{
  dragging = true;
  console.log("h");
}

function onPointerOut(e)
{
  console.log("up");
  dragging = false;
  cameraOffset = {x:0,y:0};
}

function onPointerMove(e)
{
  if (dragging)
  {
    cameraOffset.x = e.movementX;
    cameraOffset.y = e.movementY;
  }
}

setInterval(draw, 20);
canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointerup", onPointerOut);
canvas.addEventListener("pointermove", onPointerMove);