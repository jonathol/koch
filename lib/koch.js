let iteration = 3;
let verticies = {};
let counter;
let deviate;
let side = 600;
let sideStr = side+"px";
let dx = 480/Math.sqrt(3);
let dy = (dx/2)*Math.sqrt(3);
let x = 0;
let y = 0;
let rounds;
let sfWidth = 300;
let pattern = false;

function calcKPerimeter(){
  let num = 3 * sfWidth * Math.pow(4/3,iteration);
  return  num.toFixed(2);
};

function calcPerimeter(){
  return sfWidth*3;
};

function calcArea(){
  return Math.pow(sfWidth,2)*Math.sqrt(3)/4;
};

function calcKArea(){
  let a0 = Math.pow(sfWidth,2)*Math.sqrt(3)/4;
  let num = (a0/5)*(8-3*(Math.pow(4/9,iteration)));
  return num.toFixed(2);
};

function setIteration(e) {
  iteration = parseInt(e.currentTarget.value);
};

function snowflakeWidth(e){
  sfWidth = parseInt(e.currentTarget.value);
};

function setPattern(e){
  pattern = e.currentTarget.checked;
}

function disable(dis){
  let inputs = document.getElementsByTagName("input");

  for (let i = 0; i < inputs.length; i++) {
    if (dis) {
      inputs[i].disabled = true;
    }
    else {
      inputs[i].disabled = false;
    }
  };

  let selects = document.getElementsByTagName("select");

  for (let i = 0; i < selects.length; i++) {
    if (dis) {
      selects[i].disabled = true;
    }
    else {
      selects[i].disabled = false;
    }
  };
};


function reset() {
  let canvas = document.getElementById("canvas");
  canvas.width=side;
  canvas.height=side;
  canvas.style.width=sideStr;
  canvas.style.height=sideStr;
  let ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  disable(true);

  dx = sfWidth;
  dy = (dx/2)*Math.sqrt(3);

  deviate = 1;
  rounds = parseInt((600/dx))+4;

  let oP = document.getElementById("original-perimeter");
  oP.innerHTML = "Original Perimeter: " + calcPerimeter() + ".00" + "px";

  let cP = document.getElementById("current-perimeter");
  cP.innerHTML = "Current Perimeter: " + calcKPerimeter() + "px";

  let oA = document.getElementById("original-area");
  oA.innerHTML = "Original Area: " + calcArea().toFixed(2) + "px" + "<sup>2</sup>";


  let cA = document.getElementById("current-area");
  cA.innerHTML = "Current Area: " + calcKArea() + "px"+ "<sup>2</sup>";

  if (pattern) {
    counter = 0;
    verticies = {};
    x = 0;
    y = 0;
    draw(ctx,x,y,dx,dy,counter);
    disable(false);
  } else {
    x = 300-dx/2;
    y = 300-(dy - ((dx/3)*Math.sqrt(3)));
    setTimeout(function(){drawOne(ctx,x,y,dx,dy);},deviate);
  }
};

function drawOne(ctx,x,y,dx,dy) {
  fractal([x,y], [x+dx,y], iteration, ctx);
  fractal([x+dx,y], [(x+dx)-(dx/2),y + dy],iteration, ctx);
  fractal([(x+dx)-(dx/2),y + dy],[x,y],iteration, ctx);
  if (iteration === 5) {
    setTimeout(function(){disable(false);},4400);
  } else if (iteration === 4) {
    setTimeout(function(){disable(false);},1500);
  }else {
    setTimeout(function(){disable(false);},400);
  }
};

function draw(ctx,x,y,dx,dy,counter) {

  fractal([x,y], [x+dx,y], iteration, ctx);
  fractal([x+dx,y], [(x+dx)-(dx/2),y + dy],iteration, ctx);
  fractal([(x+dx)-(dx/2),y + dy],[x,y],iteration, ctx);

  var branches = [];

  if (x + dx > 0-dx && x + dx < side && y - 2*((dx/6)*Math.sqrt(3)) > 0-dy && y - 2*((dx/6)*Math.sqrt(3)) < side+(dy - ((dx/6)*Math.sqrt(3)))) {
    branches.push([x + dx, y - 2*((dx/6)*Math.sqrt(3))]);
  }
  if (x + dx > 0-dx && x + dx < side && y + (dy - ((dx/6)*Math.sqrt(3))) > 0-dy && y + (dy - ((dx/6)*Math.sqrt(3))) < side+(dy - ((dx/6)*Math.sqrt(3)))) {
    branches.push([x + dx, y + (dy - ((dx/6)*Math.sqrt(3)))]);
  }
  if (x > 0-dx && x < side && y + dy + ((dx/6)*Math.sqrt(3)) > 0-dy && y + dy + ((dx/6)*Math.sqrt(3)) < side+(dy - ((dx/6)*Math.sqrt(3)))) {
    branches.push([x, y + dy + ((dx/6)*Math.sqrt(3))]);
  }


  counter++;
  if (counter < rounds && branches.length > 0) {
    branches.forEach(branch => {
      let branchX = branch[0];
      let branchY = branch[1];
      if (verticies[[Math.floor(branchX),Math.floor(branchY)]] !== true){
        verticies[[Math.floor(branchX),Math.floor(branchY)]] = true;
        deviate++;
        draw(ctx,branchX,branchY,dx,dy,counter);
      }
    });
  }
};

function fractal(A, B, iteration, context){
    if (iteration < 0){
        return null;
    }

    let C = divide(add(multiply(A, 2), B), 3);
    let D = divide(add(multiply(B, 2), A), 3);

    let F = divide(add(A, B), 2);

    let V1 = divide(minus(F, A), length(F, A));
    let V2 = [V1[1], -V1[0]];

    let E = add(multiply(V2, Math.sqrt(3)/6 * length(B, A)), F);

    let color = "#"+((1<<24)*Math.random()|0).toString(16);

    if (pattern) {
      drawLine(A, B, color,context);

      if (iteration !=0){
          for (let i=0;i<10;i++) {
            drawLine(C, D, "#93D4D6",context);
          }
      }
    } else {
      setTimeout(function(){drawLine(A, B, color,context);},deviate);

      if (iteration !=0){
        for (let i=0;i<10;i++) {
          setTimeout(function(){drawLine(C, D, "#93D4D6",context);},deviate);
        }
      }
      deviate++;
    }

    fractal(A, C, iteration-1, context);
    fractal(C, E, iteration-1, context);
    fractal(E, D, iteration-1, context);
    fractal(D, B, iteration-1, context);
};

function multiply(v, num){
    return [v[0]*num, v[1]*num];
};

function divide(v, num){
    return [v[0]/num, v[1]/num];
};

function add(a, b){
    return [a[0]+b[0], a[1]+b[1]];
};

function minus(a, b){
    return [a[0]-b[0], a[1]-b[1]];
};

function length(a, b){
    return Math.sqrt(Math.pow(a[0] - b[0],2) +
                     Math.pow(a[1] - b[1],2));
};

function drawLine(a, b, c, context){
    context.beginPath();
    context.moveTo(a[0], a[1]);
    context.lineTo(b[0], b[1]);
    context.closePath();
    context.lineWidth = 2;
    context.strokeStyle = c;
    context.stroke();
};
