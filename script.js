var POV_1 = document.querySelector("#pov1");
var POV_2 = document.querySelector("#pov2");
var CTX_1 = POV_1.querySelector("canvas").getContext("2d");
var CTX_2 = POV_2.querySelector("canvas").getContext("2d");
var SLIDER = document.querySelector("#slider");
var vx = 20
var x0 = 88
var z0 = 58
var x0_boat = 10
var x0_island = 255

var checkBox_ref = document.getElementById("ref");
var checkBox_trajectories = document.getElementById("trajectories");

function x(t){

    new_x = x0 + vx*t
    return(new_x)

}

function z(t){

    new_z = t/4
    return(new_z)

}

function drawArrow(ctx, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  }

function drawRef(ctx,x,z,alpha) {
    ctx.beginPath();     
    drawArrow(ctx,x,z,x+Math.cos(alpha*Math.PI/180)*50,z-Math.sin(alpha*Math.PI/180)*50);
    drawArrow(ctx,x,z,x-Math.sin(alpha*Math.PI/180)*50,z-Math.cos(alpha*Math.PI/180)*50);        
}


function draw_1(alpha) {
     CTX_1.clearRect(0, 0, 400, 400);

    if (checkBox_trajectories.checked == true) {
    CTX_1.beginPath();
    CTX_1.strokeStyle='red';  
    CTX_1.lineWidth = 3 ; 
    temps=0
    dt=1
    CTX_1.moveTo(195+z(temps),235-z(temps));
    while(temps<alpha)  {     
        CTX_1.lineTo(195+Math.sin(temps*Math.PI/180)*z(temps),235-Math.cos(temps*Math.PI/180)*z(temps));
        CTX_1.stroke();
        temps = temps +dt
    } 
    }    

    if (checkBox_ref.checked ==true ){
    drawRef(CTX_1, 196, 231,0); 
    CTX_1.strokeStyle='green';
    CTX_1.lineWidth = 3 ;     
    CTX_1.stroke();
    
    CTX_1.beginPath();
    drawRef(CTX_1, 196, 231,90-alpha);  
    CTX_1.strokeStyle='brown';
    CTX_1.lineWidth = 3 ;    
    CTX_1.stroke();    
    }  
}

function draw_2(alpha) {
  CTX_2.clearRect(0, 0, 400, 400);

  if (checkBox_trajectories.checked == true) {
  CTX_2.beginPath();
  CTX_2.strokeStyle='red';  
  CTX_2.lineWidth = 3 ;
  temps=0
  dt=1
  CTX_2.moveTo(195,220-z(temps));
  while(temps<alpha)  {  
     CTX_2.lineTo(195,220-z(temps));
     CTX_2.stroke();
     temps = temps +dt
     } 
    }

 if (checkBox_ref.checked == true) {
  drawRef(CTX_2, 196, 231,alpha); 
  CTX_2.strokeStyle='green';
  CTX_2.lineWidth = 3 ;     
  CTX_2.stroke();
  
  CTX_2.beginPath();
  drawRef(CTX_2, 196, 231,90);  
  CTX_2.strokeStyle='brown';
  CTX_2.lineWidth = 3 ;    
  CTX_2.stroke();  
 }   

}

function update(alpha) {
  // Rotation de l'aiguille (pov1)
  POV_1.querySelector(".hand").style.transform = "rotate("+alpha+"deg)";
  r=42
  POV_1.querySelector(".hand").style.left = (178+r*Math.sin(alpha*Math.PI/180)) + "px";
  POV_1.querySelector(".hand").style.top = (170-r*Math.cos(alpha*Math.PI/180)) + "px";   
  
  //Rotation de la fourmi
  POV_1.querySelector(".ant").style.transform = "rotate("+(-90+alpha)+"deg)";

  //Translation de la fourmi
  POV_1.querySelector(".ant").style.left = 180 + Math.sin(alpha*Math.PI/180)*alpha/4 + "px";
  POV_1.querySelector(".ant").style.top = 220 - Math.cos(alpha*Math.PI/180)*alpha/4 + "px";


  // Dessin sur le canevas (pov1)
  draw_1(alpha);

//Rotation du cadran (pov2)
POV_2.querySelector(".chrono").style.transform = "rotate(-"+alpha+"deg)";
r=32
POV_2.querySelector(".chrono").style.left = (39-r*Math.sin(alpha*Math.PI/180)) + "px";
POV_2.querySelector(".chrono").style.top = (41-r*Math.cos(alpha*Math.PI/180)) + "px";

//Déplacement de la fourmi
POV_2.querySelector(".ant").style.top = 220 - alpha/4 + "px";

  // Dessin sur le canevas (pov2)
  draw_2(alpha);
}

// Initialisation du slider
function onSliderInput(event) {
  alpha = parseFloat(SLIDER.value);
  update(alpha);
}
SLIDER.addEventListener("input", onSliderInput);
SLIDER.value = 0;
onSliderInput();

checkBox_ref.addEventListener("input", onSliderInput);
checkBox_trajectories.addEventListener("input", onSliderInput);