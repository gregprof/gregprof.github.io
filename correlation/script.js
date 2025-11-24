var CTX = document.querySelector("canvas").getContext("2d");
var POWER = document.querySelector("#power");
var HEIGHT = document.querySelector("#height");
var DIAM = document.querySelector("#diam");

var g=9.81;
var Tinf=20;

var nu;
var rho;
var cp;
var alpha;
var lambda;
var a;
var alpha;
var nu;
var Nuss;
var Pr;
var Gr;
var Ra;
var h_conv;

var P;
var D;
var H;

drawHotPlate(20);
drawFluid(50);
drawPan(100);

function drawPan(L) {
  CTX.beginPath();
  CTX.strokeStyle='black';
  CTX.lineWidth = 4 ;  
  CTX.moveTo(150-0.5*L,20);
  CTX.lineTo(150-0.5*L,100);
  CTX.lineTo(150+0.5*L,100);
  CTX.lineTo(150+0.5*L,20); 
  CTX.lineTo(150+0.5*L,30); 
  CTX.lineTo(250+0.5*L,30);  
  CTX.stroke();
}

function drawFluid(h,L) {
  CTX.beginPath();
  if (water.checked) {
    CTX.strokeStyle='blue';
    CTX.fillStyle='blue';    
  }
  if (oil.checked) {
    CTX.strokeStyle='green';
    CTX.fillStyle='green';    
  } 

  if (mercury.checked) {
    CTX.strokeStyle='silver';
    CTX.fillStyle='silver';    
  }   


  CTX.lineWidth = 1 ;   
  CTX.rect(150-0.5*L, 100-h, L, h);
  CTX.fill();
  CTX.stroke();
}

function drawHotPlate(P) {
  CTX.beginPath();
  CTX.strokeStyle='black';
  CTX.lineWidth = 1 ;  
  CTX.fillStyle='rgb('+0.03*P+',0,0)';   
  CTX.rect(30, 100, 240, 20);
  CTX.fill();
  CTX.stroke();
}

function update(P,H,D) {

  fluid();

  CTX.clearRect(0, 0, 400, 200);
  drawHotPlate(P);
  drawFluid(4*H,4*D);
  drawPan(4*D);

  loop();

  Tp = Math.round(100*Tp)/100;
  document.getElementById("Tp").innerHTML = Tp;
  document.getElementById("Tinf").innerHTML = Tinf;
  if (P==0) {
    document.getElementById("Tp").innerHTML = Tinf;
  }
  h_conv = Math.round(100*h_conv)/100;
  document.getElementById("h_conv").innerHTML = h_conv;
  
  document.getElementById("rho").innerHTML = rho.toExponential(2);   
  document.getElementById("cp").innerHTML = cp.toExponential(2);   
  document.getElementById("lambda").innerHTML = lambda.toExponential(2);   
  document.getElementById("alpha").innerHTML = alpha.toExponential(2);   
  document.getElementById("nu").innerHTML = nu.toExponential(2);   

  document.getElementById("Nusselt").innerHTML = Nuss.toExponential(2);
  document.getElementById("Pr").innerHTML = Pr.toExponential(2);   
  document.getElementById("Ra").innerHTML = Ra.toExponential(2);   

}

function loop() {
  S=Math.PI*(0.5*D)**2;  
  Tp = Tinf + P/(200*S);
  for (let it=0; it<10; it++) {
    Pr = nu/a;
    Ra = alpha*g*((0.01*0.25*D)**3)*(Tp-Tinf)/(a*nu);
    Nuss = 0.15*Ra**(1/3);
    h_conv= lambda*Nuss/(0.01*0.25*D);
    Tp = Tinf + P/(h_conv*S);       
  }  
}

function print_val(id_val,arr) {
  val = id_val.value;
  document.getElementById(id_val).innerHTML = val;
}

function fluid () {
  if (water.checked) {
    rho=1000;
    cp=4200;    
    alpha=2.1e-4;
    lambda=0.6;
    a=lambda/(rho*cp); 
    nu=1e-6;   
  }

  if (oil.checked) {
    rho=800;
    cp=1700;
    alpha=7e-4;
    lambda=0.12;
    a=lambda/(rho*cp);
    nu=43.e-6;
  }

  if (mercury.checked) {
    rho=5400;
    cp=1400;
    alpha=1.8e-4;
    lambda=7.9;
    a=lambda/(rho*cp);
    nu=0.12e-6;
  } 

}

// Initialisation du slider
function onSliderInput(event) {
  P = parseFloat(POWER.value);
  H = parseFloat(HEIGHT.value);
  D = parseFloat(DIAM.value);  
  update(P,H,D);
}

POWER.addEventListener("input", onSliderInput);
HEIGHT.addEventListener("input", onSliderInput);
DIAM.addEventListener("input", onSliderInput);
water.addEventListener("input", onSliderInput);
oil.addEventListener("input", onSliderInput);
mercury.addEventListener("input", onSliderInput);
HEIGHT.value = 10;
DIAM.value = 30;
POWER.value = 0;
onSliderInput();