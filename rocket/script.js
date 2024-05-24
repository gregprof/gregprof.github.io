var CTX = document.querySelector("canvas").getContext("2d");
var t = 0
var last_ms = null
var  g = 9.81
var lambda=0
var height=0
var dt=0
var m=10
var az=0
var vz=0
var z=0
var Ec
var Ep
var Efm=0
var Efrot=0
var Fm=0
var Fmoteur = 2.5*m*g
var x_array = new Array()
var y_array = Array.from({length: 8}, () => []);
var play=false
var engine=false
var tk=true
var Tank=40000
var action = 0

var button_lacher = document.getElementById("lacher");
var button_play = document.getElementById("play");
var button_stop = document.getElementById("stop");
var checkBox_frottements = document.getElementById("frot");
var fire = document.getElementById("fire");
var rocket = document.getElementById("rocket");
var fuel = document.getElementById("fuel");

var button_EcL = document.getElementById("EcL");
var button_EpL = document.getElementById("EpL");
var button_WmL = document.getElementById("WmL");
var button_WfL = document.getElementById("WfL");
var button_EmL = document.getElementById("EmL");
var button_TankL = document.getElementById("TankL");
var button_QL = document.getElementById("QL");
var button_actionL = document.getElementById("actionL");

var button_EcR = document.getElementById("EcR");
var button_EpR = document.getElementById("EpR");
var button_WmR = document.getElementById("WmR");
var button_WfR = document.getElementById("WfR");
var button_EmR = document.getElementById("EmR");
var button_TankR = document.getElementById("TankR");
var button_QR = document.getElementById("QR");
var button_actionR = document.getElementById("actionR");

var buttonsL = [button_EcL,button_EpL,button_WmL,button_WfL,button_EmL,button_TankL,button_QL,button_actionL];
var buttonsR = [button_EcR,button_EpR,button_WmR,button_WfR,button_EmR,button_TankR,button_QR,button_actionR];
var colors  = ["red","blue","yellow","green","black","purple","orange","pink"];
var names = ["Energie cinétique", "Energie potentielle","Travail poussée","Travail frottements", "Energie mécanique", "Energie chimique ergols", "Chaleur dissipée dans l'air","Action"]

rocket.style.top = 500 + "px";
plot_hist([0],colors,buttonsL,"histogramL");
plot_hist([0],colors,buttonsR,"histogramR");
plot_graph(0,0,colors,buttonsL,buttonsR);

axe(200, 8, 'down');

function axe(x0, x_ticks,direction){

  CTX.beginPath();
  CTX.setLineDash([]);
  CTX.moveTo(x0,0);
  CTX.lineTo(x0,600);
  CTX.stroke();

  for (let i=1;i<7;i++){
    CTX.beginPath();
    CTX.setLineDash([]);
    CTX.moveTo(x0-5,100*i);
    CTX.lineTo(x0+5,100*i);
    CTX.stroke();
    CTX.font = '16px serif';

    if (direction=='up'){
      n= (i-1)*100
    }
    else if (direction=='down'){
      n= 500-(i-1)*100
    }    

    if (i==6){
      CTX.fillText(2*n +' m', x0 + x_ticks, 100*i-2);
    }
    else {
      CTX.fillText(2*n +' m', x0 + x_ticks, 100*i+3);
    }
  }
}

function timer(ms){

var z_px

  if (!play){return}

  if (Tank<0){
    tk=false;
    Fm = 0
    fire.style.visibility = "hidden";
    engine=false;
    button_lacher.style.backgroundColor = "grey";

    fuel.style.visibility="visible";
  }

  if (last_ms==null){
    last_ms = ms;
  }

  if (z<0){
    vz=0
    z=0
    last_ms = null;
  }
  else{
    dt = (ms - last_ms)/1000;

    last_ms = ms;
    t = t + dt

    P = -m*g

    if (checkBox_frottements.checked==true){
      lambda=0.05
    }
    else{
      lambda=0
    }

    F = -lambda*Math.abs(vz)*vz

    //Euler scheme
    for (let i=0; i<100; i++){    
    vz = vz + dt/100*(P+Fm+F)/m
    z = z + dt/100*vz
    Efm = Efm + Fm*dt/100*vz
    Efrot = Efrot + F*dt/100*vz  
    Tank = Tank - Math.abs(Fm*dt/100*vz)
    }   

    z_px = -z*2 + 500

    Ec = 0.5*m*vz**2
    Ep = m*g*z

    chaleur = -Efrot

    action = action + (Ec - Ep)*dt

    y=[Ec,Ep,Efm,Efrot,Ec+Ep,Tank,chaleur,action]

    plot_hist(y,colors,buttonsL,"histogramL");
    plot_hist(y,colors,buttonsR,"histogramR");  
    plot_graph(t,y,colors,buttonsL,buttonsR);
    rocket.style.top = z_px + "px";
    fire.style.top = z_px + 85 + "px";

    requestAnimationFrame(timer)
}
}

function plot_hist(y_hist,colors,but,hist) {
 
  var trace=[];
  var data = [];

  for (let i = 0; i < y_hist.length; i++) {
    trace[i] = {
      y: [y_hist[i]],
      type: "bar",
      marker: {color: colors[i]}     
    }
    if (but[i].checked){data.push(trace[i])}
  }  

var layout = {
  barmode: 'stack', // Mode empilé
  yaxis: {
      range: [-50000, 50000], 
      gridcolor: 'lightgray',
      showticklabels: false, 
      showline: false, 
  },
  xaxis: {
    tickvals: [], zeroline: false
},
showlegend: false,
paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)'
};

  Plotly.newPlot(hist, data, layout);
}

function plot_graph(t,y,colors,butL,butR) {

  var trace=[];
  var data = [];

      x_array.push(t);
      for (let i = 0; i < y.length; i++) {
        y_array[i].push(y[i]);
      } 

      for (let i = 0; i < y.length; i++) {
        trace[i] = {
          x: x_array,
          y: y_array[i],
          mode: 'lines',
          line: {
            color : colors[i],
          },
          name : names[i]
        };
      }
  
for (let i = 0; i < y.length; i++) {
  if (butL[i].checked||butR[i].checked==true){data.push(trace[i])}
}       


  var layout = {
    xaxis: {range: [0, 30], showticklabels: false},
    yaxis: {range: [-50000, 50000], gridcolor: 'lightgray'},
    showlegend : true
  };

  Plotly.newPlot('plot', data, layout);  
}

lacher.addEventListener("click", function() {
  if (!engine*tk){
    Fm = Fmoteur
    fire.style.visibility = "visible";
    button_play.src="img/pause.png";    
    play=true;  
    engine=true;  
    button_lacher.style.backgroundColor = "red";
  }
  else{
    Fm = 0
    fire.style.visibility = "hidden";
    engine=false;
    button_lacher.style.backgroundColor = "grey";
  }

});

button_play.addEventListener("click", function() {
  if(play) 
    {play=false;
    last_ms = null;      
    button_play.src="img/play.png";
  }
  else 
  {play=true;
    button_play.src="img/pause.png";
    last_ms = null;
    requestAnimationFrame(timer)
  }
});

button_stop.addEventListener("click", function() {
  play=false;
  engine=false;
  tk=true;
  Fm = 0;
  rocket.style.top = 500 + "px"
  fire.style.visibility = "hidden";
  z=0;
  vz=0;
  Efrot = 0;
  Efm=0;
  Tank=40000;
  chaleur=0;
  
  t=0;
  x_array = new Array()
  y_array = Array.from({length: 8}, () => []);

  console.log(x_array);

  plot_hist([0,0],colors,buttonsL,"histogramL");
  plot_hist([0,0],colors,buttonsR,"histogramR");
  plot_graph(0,0,0,0,0);
  last_ms = null;
  button_play.src="img/pause.png";  
  engine=false;
  button_lacher.style.backgroundColor = "grey";
  fuel.style.visibility="hidden";
});
