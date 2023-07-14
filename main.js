const canvas = document.getElementById("Display");
const ctx = canvas.getContext("2d");

let dragging = false;
let cameraOffset = {x:0,y:0};
let scale = 1;

function draw()
{
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  
  console.log(cameraOffset);
  
  ctx.fillStyle = "#00CC00";
  ctx.fillRect(0, 0, 100, 50);
  
  requestAnimationFrame(draw);
}

function onPointerDown(e)
{
  dragging = true;
}

function onPointerOut(e)
{
  //console.log("up");
  dragging = false;
  firstPinch = null;
  lastZoom = scale;
}

function onPointerMove(e)
{
  if (dragging)
  {
    cameraOffset.x += e.movementX/scale;
    cameraOffset.y += e.movementY/scale;
    ctx.translate(e.movementX/scale, e.movementY/scale);
  }
}

let firstPinch = null;
let lastZoom = scale;
let mousePos={x:0,y:0};

function pinch(e)
{
  e.preventDefault();
  
  if (e.touches.length == 2)
  {
    let distance = (e.touches[0].clientX-e.touches[1].clientX)**2 + (e.touches[0].clientY-e.touches[1].clientY)**2;
    
    mousePos.x = (e.touches[0].clientX+e.touches[1].clientX)/2;
    mousePos.y = (e.touches[0].clientY+e.touches[1].clientY)/2;
    
    if (!firstPinch)
      firstPinch = distance;
    else
      zoom(e, null, distance/firstPinch);
  }
}

function zoom(e, amount, factor)
{
  let previousScale = scale;
  
  if (amount)
  {
    let direction = amount > 0 ? 1 : -1;
    scale += 0.05 * direction;
    ctx.scale(0.05*direction, 0.05*direction);
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
  }
  else
  {
    ctx.scale(factor*lastZoom/scale, factor*lastZoom/scale);
    scale = factor * lastZoom;
  }
}

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointerup", onPointerOut);
canvas.addEventListener("pointermove", onPointerMove);

canvas.addEventListener("touchmove", pinch);
canvas.addEventListener("wheel", (e) => zoom(e, e.deltaY));

draw();