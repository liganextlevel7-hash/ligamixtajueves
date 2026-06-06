const URL_ESTADISTICAS =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=979195152&single=true&output=csv";

const logos = {
"Soldados Del Amor":"https://i.imgur.com/gBvmM4v.png",
"Cuervos F.C":"https://i.imgur.com/fGQAhE5.png",
"Unión 8":"https://i.imgur.com/Qrx4JSj.png",
"La Garra":"https://i.imgur.com/8BWFWBW.png",
"Pumas KAP":"https://i.imgur.com/5TAVBS7.png",
"Los Chipotles":"https://i.imgur.com/KTMLCv9.png",
"Deportivo CT":"https://i.imgur.com/hqOAa7J.png",
"Gusanitos":"https://i.imgur.com/5TARJkD.png",
"Bacachitos":"https://i.imgur.com/ddKmNL6.png"
};

async function cargarEquipos(){

const respuesta = await fetch(URL_ESTADISTICAS);
const texto = await respuesta.text();

const filas = texto.trim().split("\n");

const datosEquipos = {};

for(let i=1;i<filas.length;i++){

const c = filas[i].split(",");

const nombre = c[1];

if(nombre === "Descansa") continue;

datosEquipos[nombre] = {
jj: c[2] || 0,
jg: c[3] || 0,
je: c[4] || 0,
jp: c[5] || 0,
gf: c[6] || 0,
gc: c[7] || 0,
dg: c[8] || 0,
pts: c[9] || 0,
ranking: c[10] || "-"
};

}

const contenedor =
document.getElementById("lista-equipos");

let html = "";

Object.keys(logos).forEach(nombre=>{

html += `
<div class="equipo-card" onclick="mostrarEquipo('${nombre}')">

<img src="${logos[nombre]}" class="equipo-logo">

<div class="equipo-nombre">
${nombre}
</div>

</div>
`;

});

contenedor.innerHTML = html;

window.datosEquipos = datosEquipos;

}

function mostrarEquipo(nombre){

const e = window.datosEquipos[nombre];

document.getElementById("info-equipo").innerHTML = `

<h2>${nombre}</h2>

<img src="${logos[nombre]}"
style="width:120px;height:120px;object-fit:contain;">

<p><strong>Posición:</strong> ${e.ranking}</p>

<p><strong>Puntos:</strong> ${e.pts}</p>

<p><strong>JJ:</strong> ${e.jj}</p>

<p><strong>JG:</strong> ${e.jg}</p>

<p><strong>JE:</strong> ${e.je}</p>

<p><strong>JP:</strong> ${e.jp}</p>

<p><strong>GF:</strong> ${e.gf}</p>

<p><strong>GC:</strong> ${e.gc}</p>

<p><strong>DG:</strong> ${e.dg}</p>

`;

document.getElementById("popup-equipo").style.display = "flex";

}

document.addEventListener("click", function(e){

if(e.target.id === "cerrar-popup"){
document.getElementById("popup-equipo").style.display = "none";
}

if(e.target.id === "popup-equipo"){
document.getElementById("popup-equipo").style.display = "none";
}

});

cargarEquipos();
