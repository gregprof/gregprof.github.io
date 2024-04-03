var n_power = document.querySelector("#n_power");
var nb_turn = document.querySelector("#nb_turn");
var G_coeff = document.querySelector("#G_coeff");
var G_print = document.querySelector("#G_print");
var realTrajectoryCheckbox = document.getElementById('real_trajectory_checkbox');

var M=2e30
var x0 = 50e9
var v0 = 65e3
var C = x0*v0
var G_kepler = 6.67e-11
var ua = 150e9
var p=C**2/(G_kepler*M)
var e=p/x0-1
    p=p/ua

var x_kepler = new Array();
var y_kepler = new Array();
var rho_kepler = new Array();
var theta_kepler = new Array();

for (let i=0; i<360; i++){
  theta_kepler[i] = i*Math.PI/180
  rho_kepler[i] = p/(1+e*Math.cos(theta_kepler[i]))
  x_kepler[i] = rho_kepler[i]*Math.cos(theta_kepler[i])
  y_kepler[i] = rho_kepler[i]*Math.sin(theta_kepler[i])
}

var trace_kepler = {
  x: x_kepler,
  y: y_kepler,
  mode: 'lines',
  line: {
    color : 'grey'
  }
};

var data = [trace_kepler];
var layout = {
  xaxis: {range: [-2, 2]},
  yaxis: {range: [-2, 2]},
  equalaspectratio: true,    
  showlegend : false,  
};

update(n_power.value=0,nb_turn.value=1,G_coeff.value=1);

function update(n,nt,G_c) {

  var x_array = new Array();
  var y_array = new Array();
  var rho_array = new Array();
  var thetaf = 2*nt*Math.PI
  var dtheta = Math.PI/180
  var nb_theta = thetaf/dtheta
  var theta_array = new Array();

  var m=(3-n)*11
  var G=G_c*6.67*Math.pow(10, -m)
  var G_decimal = G.toExponential(2);
      G_print.value = G_decimal    

  var u= new Array();
  var du= new Array();
  var urk2
  var durk2

  u[0]=1/x0
  du[0]=0
  for (let i=0; i<nb_theta; i++){
    theta_array[i]=i*dtheta
    urk2  = u[i] + 0.5*dtheta*du[i]
    durk2 = du[i] + 0.5*dtheta* (G*M/C**2*u[i]**(n-2)-u[i])
    u[i+1]  = u[i] + dtheta*durk2
    du[i+1] = du[i] + dtheta* (G*M/C**2*urk2**(n-2)-urk2)
    rho_array[i] = 1/u[i]/ua
    x_array[i] = rho_array[i]*Math.cos(theta_array[i])
    y_array[i] = rho_array[i]*Math.sin(theta_array[i])    
  }

  var trace_line = {
    x: x_array,
    y: y_array,
    mode: 'lines',
    line: {
      color : 'black'
    }
  };

  var trace_markers = {
    x: x_array,
    y: y_array,
    mode: 'markers',  // Utiliser des points
    marker: {
        size: 5,  // Taille des points
        color: 'red'  // Couleur des points
    }
  };  

  console.log(realTrajectoryCheckbox.checked)

  if (realTrajectoryCheckbox.checked==true){
    var data = [trace_kepler,trace_markers];
  }
  else{
    var data = [trace_markers];
  }
  var layout = {
    xaxis: {range: [-2, 2]},
    yaxis: {range: [-2, 2]},
    equalaspectratio: true,    
    showlegend : false,  
  };

  Plotly.newPlot('graph', data, layout);  

}

// Initialisation du slider
function onSliderInput(event) {
  n = parseFloat(n_power.value);
  nt = parseFloat(nb_turn.value);  
  G_c = parseFloat(G_coeff.value);    
  update(n,nt,G_c);  
}

n_power.addEventListener("input", onSliderInput);
nb_turn.addEventListener("input", onSliderInput);
G_coeff.addEventListener("input", onSliderInput);
realTrajectoryCheckbox.addEventListener('change', onSliderInput);