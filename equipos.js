const PUB_HASH = "2PACX-1vQJWh_TR7iUaRe9qfPVxtrGUeAQxXiNXw92l3rk49CNZWix9pW7varCzssaVI21WYP9pZ5UCEpa4iSy";

const URL_EQUIPOS =
`https://docs.google.com/spreadsheets/d/e/${PUB_HASH}/pub?gid=1894947293&single=true&output=csv`;

const URL_ESTADISTICAS =
`https://docs.google.com/spreadsheets/d/e/${PUB_HASH}/pub?gid=979195152&single=true&output=csv`;

let logos = {}; // se llena solo, jalando la hoja "Equipos" — ya no hace falta tocarlo a mano

async function cargarEquipos(){

  // 1) Traemos primero la lista real de equipos (nombre + logo) desde la hoja "Equipos"
  const respEquipos = await fetch(URL_EQUIPOS);
  const textoEquipos = await respEquipos.text();
  const filasEquipos = textoEquipos.trim().split("\n");

  const ordenEquipos = []; // para mostrar las tarjetas en el mismo orden del Sheet
  logos = {};

  for(let i=1;i<filasEquipos.length;i++){
    const c = filasEquipos[i].split(",");
    const nombre = (c[1] || "").trim();
    if(!nombre || nombre === "Descansa") continue;
    const logoUrl = (c[4] || c[3] || "").trim(); // columna "URL" (o "Logo" si esa es la que se usa)
    logos[nombre] = logoUrl;
    ordenEquipos.push(nombre);
  }

  // 2) Traemos las estadísticas y las cruzamos por nombre de equipo
  const respuesta = await fetch(URL_ESTADISTICAS);
  const texto = await respuesta.text();
  const filas = texto.trim().split("\n");

  const datosEquipos = {};

  for(let i=1;i<filas.length;i++){
    const c = filas[i].split(",");
    const nombre = (c[1] || "").trim();
    if(nombre === "Descansa" || !nombre) continue;
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

  const contenedor = document.getElementById("lista-equipos");

  let html = "";

  ordenEquipos.forEach(nombre=>{
    html += `
    <div class="equipo-card" onclick="mostrarEquipo('${nombre}')">
      <img src="${logos[nombre] || ''}" class="equipo-logo">
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

  if(!e){
    // Por si un equipo está en la hoja "Equipos" pero todavía no tiene fila en "Estadísticas"
    document.getElementById("info-equipo").innerHTML = `
      <h2>${nombre}</h2>
      <img src="${logos[nombre] || ''}" style="width:120px;height:120px;object-fit:contain;">
      <p>Sin estadísticas registradas todavía.</p>
    `;
    document.getElementById("popup-equipo").style.display = "flex";
    return;
  }

  document.getElementById("info-equipo").innerHTML = `

  <h2>${nombre}</h2>

  <img src="${logos[nombre] || ''}"
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
