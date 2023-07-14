//
// VARIABLES
//

const canvas = document.getElementById("Display");
const ctx = canvas.getContext("2d");

let dragging = false;
let cameraOffset = {x:0,y:0};
let scale = 1;

let firstPinch = null;
let lastZoom = scale;
let mousePos = {x:0,y:0};
let startPos = {x:0,y:0};

//
// FUNCTIONS
//

function draw()
{
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.restore();
  
  let matrix = ctx.getTransform();
  ctx.setTransform(1, 0, matrix.c, 1, 0, 0);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, (canvas.height/2-5+cameraOffset.y)*scale, canvas.width, 10*scale);
  
  let firstPos = 0 - (50 - (canvas.width/2 + cameraOffset.x) % 50);
  
  for (let i = 0; i < Math.ceil(canvas.width/50/scale)+2; i++)
  {
    let x = firstPos+i*50;
    
    if (Math.round(x - cameraOffset.x) == canvas.width/2)
    {
      ctx.beginPath();
      ctx.arc(x*scale, (canvas.height/2 + cameraOffset.y)*scale, 15*scale, 0, 2*Math.PI);
      ctx.fill();
      continue;
    }
    
    ctx.beginPath();
    ctx.arc(x*scale, (canvas.height/2 + cameraOffset.y)*scale, 10*scale, 0, 2*Math.PI);
    ctx.fill();
  }
  
  ctx.fillStyle = "#00CC00";
  ctx.fillRect((0+cameraOffset.x)*scale, (0+cameraOffset.y)*scale, 100*scale, 50*scale);
  
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
  startPos = cameraOffset;
}

function onPointerMove(e)
{
  if (dragging)
  {
    cameraOffset.x += e.movementX/scale;
    cameraOffset.y += e.movementY/scale;
    //ctx.translate(e.movementX/scale, e.movementY/scale);
  }
}

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
    //ctx.scale(0.05*direction, 0.05*direction);
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
  }
  else
  {
    //ctx.scale(factor*lastZoom/scale, factor*lastZoom/scale);
    scale = factor * lastZoom;
  }
  console.log(cameraOffset);
  
  cameraOffset.x -= (cameraOffset.x+mousePos.x)*(scale/previousScale-1)
  cameraOffset.y -= (cameraOffset.y+mousePos.y)*(scale/previousScale-1)
}

//
// EVENTS
//

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointerup", onPointerOut);
canvas.addEventListener("pointermove", onPointerMove);

canvas.addEventListener("touchmove", pinch);
canvas.addEventListener("wheel", (e) => zoom(e, e.deltaY));

document.getElementById("import").onclick = function() {
  var files = document.getElementById("jsonFile").files;
  if (files.length <= 0)
    return false;
  
  var fr = new FileReader();
  
  fr.onload = function(e) {
    timeline = JSON.parse(e.target.result);
    load();
  }
  
  fr.readAsText(files.item(0));
}

draw();