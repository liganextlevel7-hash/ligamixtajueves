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

async function cargarTablaCompleta(){

const respuesta = await fetch(URL_ESTADISTICAS);
const texto = await respuesta.text();

const filas = texto.trim().split("\n");

const equipos = [];

for(let i=1;i<filas.length;i++){

const c = filas[i].split(",");

const nombre = c[1];

if(nombre === "Descansa") continue;

equipos.push({
ranking: c[10] || "-",
equipo: nombre,
jj: c[2] || 0,
jg: c[3] || 0,
je: c[4] || 0,
jp: c[5] || 0,
gf: c[6] || 0,
gc: c[7] || 0,
dg: c[8] || 0,
pts: c[9] || 0
});

}

equipos.sort((a,b)=>
(Number(a.ranking)||999) -
(Number(b.ranking)||999)
);

let html = `

<table class="tabla">

<thead>
<tr>
<th>#</th>
<th>Equipo</th>
<th>JJ</th>
<th>JG</th>
<th>JE</th>
<th>JP</th>
<th>GF</th>
<th>GC</th>
<th>DG</th>
<th>PTS</th>
</tr>
</thead>

<tbody>
`;

equipos.forEach(e=>{

html += `

<tr>

<td>${e.ranking}</td>

<td style="text-align:left;">
<img src="${logos[e.equipo] || ""}" style="width:90px;height:90px;vertical-align:middle;margin-right:8px;">
${e.equipo}
</td>

<td>${e.jj}</td>
<td>${e.jg}</td>
<td>${e.je}</td>
<td>${e.jp}</td>
<td>${e.gf}</td>
<td>${e.gc}</td>
<td>${e.dg}</td>
<td>${e.pts}</td>

</tr>
`;

});

html += `

</tbody>
</table>
`;

document.getElementById("tabla-general-completa").innerHTML = html;

}

cargarTablaCompleta();
