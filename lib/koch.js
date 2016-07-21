let iteration = 3;
let verticies = {};
let counter = 0;
let deviate = 100;
let sideW = 600;
let sideWStr = sideW+"px";
let sideH = 600;
let sideHStr = sideH+"px";
let dx = 480/Math.sqrt(3);
let dy = (dx/2)*Math.sqrt(3);
let x = 0;
let y = 0;
let numRow = 2;
let rounds;


function setIteration() {
  iteration = parseInt(event.currentTarget.value);
};

function setSideW(){
  sideW = parseInt(event.currentTarget.value);
  sideWStr = sideW+"px";
};

function setSideH(){
  sideH = parseInt(event.currentTarget.value);
  sideHStr = sideH+"px";
};

function setNumRow(){
  numRow = parseInt(event.currentTarget.value);
};

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
};


function reset() {
  let canvas = document.getElementById("canvas");
  canvas.width=sideW;
  canvas.height=sideH;
  canvas.style.width=sideWStr;
  canvas.style.height=sideHStr;
  let ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  disable(true);

  counter = 0;
  verticies = {};
  deviate = 1;

  x = 0;
  y = 0;

  dx = (sideW/numRow)/Math.sqrt(3);
  dy = (dx/2)*Math.sqrt(3);

  rounds = 30;

  setTimeout(function(){draw(ctx,x,y,dx,dy,counter);},deviate);
};

function draw(ctx,x,y,dx,dy,counter) {

  fractal([x,y], [x+dx,y], iteration, ctx);
  fractal([x+dx,y], [(x+dx)-(dx/2),y + dy],iteration, ctx);
  fractal([(x+dx)-(dx/2),y + dy],[x,y],iteration, ctx);

  let branches = [
    [x + dx, y - 2*((dx/6)*Math.sqrt(3))],
    [x + dx, y + (dy - ((dx/6)*Math.sqrt(3)))],
    [x, y + dy + ((dx/6)*Math.sqrt(3))]
  ];
  deviate++;
  if (counter < rounds) {
    counter++;
    branches.forEach(branch => {
      if (verticies[[Math.floor(branch[0]),Math.floor(branch[1])]] !== true) {
        setTimeout(function(){draw(ctx,branch[0],branch[1],dx,dy,counter);},deviate);
        verticies[[Math.floor(branch[0]),Math.floor(branch[1])]] = true;
      }
    });
  } else {
    disable(false);
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

    setTimeout(function(){drawLine(A, B, color,context);},1);

    if (iteration !=0){
        for (let i=0;i<10;i++) {
          setTimeout(function(){drawLine(C, D, "#93D4D6",context);},1);
        }
    };

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
