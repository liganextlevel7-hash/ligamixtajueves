const PUB_HASH_TABLA = "2PACX-1vQJWh_TR7iUaRe9qfPVxtrGUeAQxXiNXw92l3rk49CNZWix9pW7varCzssaVI21WYP9pZ5UCEpa4iSy";

const URL_EQUIPOS_TABLA =
  `https://docs.google.com/spreadsheets/d/e/${PUB_HASH_TABLA}/pub?gid=1894947293&single=true&output=csv`;

const URL_ESTADISTICAS =
  `https://docs.google.com/spreadsheets/d/e/${PUB_HASH_TABLA}/pub?gid=979195152&single=true&output=csv`;

const URL_PARTIDOS =
  `https://docs.google.com/spreadsheets/d/e/${PUB_HASH_TABLA}/pub?gid=1362473459&single=true&output=csv`;

let logos = {};       // nombre -> logo, se llena solo desde la hoja "Equipos"
let equiposID = {};   // ID_Equipo -> nombre, se llena solo desde la hoja "Equipos"

let _catalogoTablaPromise = null;
function cargarCatalogoTabla(){
  if(!_catalogoTablaPromise){
    _catalogoTablaPromise = fetch(URL_EQUIPOS_TABLA)
      .then(r => r.text())
      .then(texto => {
        const filas = texto.trim().split("\n");
        const logosTmp = {}, idTmp = {};
        for(let i=1;i<filas.length;i++){
          const c = filas[i].split(",");
          const id = Number(c[0]);
          const nombre = (c[1] || "").trim();
          if(!nombre) continue;
          const logoUrl = (c[4] || c[3] || "").trim();
          logosTmp[nombre] = logoUrl;
          if(id) idTmp[id] = nombre;
        }
        logos = logosTmp;
        equiposID = idTmp;
      });
  }
  return _catalogoTablaPromise;
}

// ==================== TABLA GENERAL ====================
async function cargarTablaGeneral(){
  try{
    const respuesta = await fetch(URL_ESTADISTICAS);
    const texto = await respuesta.text();
    const filas = texto.trim().split("\n");
    const equipos = [];

    for(let i=1;i<filas.length;i++){
      const c = filas[i].split(",");
      const nombre = c[1];
      if(nombre === "Descansa") continue;
      equipos.push({
        ranking: Number(c[10]) || 999,
        equipo: nombre,
        pts: Number(c[9]) || 0,
        dg: Number(c[8]) || 0
      });
    }

  equipos.sort((a,b)=>a.ranking-b.ranking);
const top3equipos = equipos.slice(0, 3);
    
    let html = `
      <table class="tabla">
      <thead>
        <tr>
          <th>#</th>
          <th>Equipo</th>
          <th>PTS</th>
          <th>DG</th>
        </tr>
      </thead>
      <tbody>
    `;

  equipos.slice(0,3).forEach((e,index)=>{

  let posicion =
    e.ranking == 1 ? "🥇" :
    e.ranking == 2 ? "🥈" :
    e.ranking == 3 ? "🥉" :
    e.ranking;

  html += `
    <tr>

      <td style="font-size:13px;font-weight:bold;">
        ${posicion}
      </td>

      <td style="text-align:left;font-size:14px;">
        <img
          src="${logos[e.equipo] || ""}"
          style="
            width:70px;
            height:70px;
            object-fit:contain;
            margin-right:12px;
            vertical-align:middle;
          "
        >
        ${e.equipo}
      </td>

      <td style="font-size:14px;font-weight:bold;">
        ${e.pts}
      </td>

      <td style="font-size:14px;font-weight:bold;">
        ${e.dg}
      </td>

    </tr>
  `;
});

html += `
  </tbody>
</table>
`;

document.getElementById("tabla-general").innerHTML = html;

  }catch(error){
    console.error(error);
    document.getElementById("tabla-general").innerHTML = "Error cargando tabla";
  }
}

// ==================== PARTIDOS ====================
async function cargarPartidos(){
  try{
    const respuesta = await fetch(URL_PARTIDOS);
    const texto = await respuesta.text();
    const filas = texto.trim().split("\n");
    const programados = [];
    const jugados = [];

    for(let i=1;i<filas.length;i++){
      const c = filas[i].split(",");
      const estado = (c[6] || "").trim();
      const local = equiposID[Number(c[2])] || "";
      const visita = equiposID[Number(c[3])] || "";
      const partido = {
        local,
        visita,
        gl: c[4] || "",
        gv: c[5] || "",
         fecha: c[8] || ""
      };
      if(estado === "Programado") programados.push(partido);
      if(estado === "Jugado") jugados.push(partido);
    }

// Próxima Jornada
if(programados.length > 0){

  const fechaProxima = programados[0].fecha;

  const lista = programados
    .filter(p => p.fecha === fechaProxima)
    .slice(0,4);

  let html = `<div class="fecha-bloque">${fechaProxima}</div>`;

  lista.forEach(p=>{

    html += `
    <div class="partido">
      <div class="partido-top">

        <div class="equipo">
          <img src="${logos[p.local] || ""}" style="width:100px;height:100px;object-fit:contain;">
          <div class="nombre" style="font-size:12px;">${p.local}</div>
        </div>

        <div class="centro">
          <strong class="marcador" style="font-size:18px;">VS</strong>
        </div>

        <div class="equipo">
          <img src="${logos[p.visita] || ""}" style="width:80px;height:80px;object-fit:contain;">
          <div class="nombre" style="font-size:12px;">${p.visita}</div>
        </div>

      </div>
    </div>
    `;

  });

  document.getElementById("proxima-jornada").innerHTML = html;
}

// Últimos Resultados
if(jugados.length > 0){

  const fechaResultado = jugados[jugados.length - 1].fecha;

  const lista = jugados
    .filter(p => p.fecha === fechaResultado)
    .slice(0,4);

  let html = `<div class="fecha-bloque">${fechaResultado}</div>`;

  lista.forEach(p=>{

    html += `
    <div class="partido">
      <div class="partido-top">

        <div class="equipo">
          <img src="${logos[p.local] || ""}" style="width:80px;height:80px;object-fit:contain;">
          <div class="nombre" style="font-size:12px;">${p.local}</div>
        </div>

        <div class="centro">
          <strong class="marcador" style="font-size:18px;">${p.gl} - ${p.gv}</strong>
        </div>

        <div class="equipo">
          <img src="${logos[p.visita] || ""}" style="width:80px;height:80px;object-fit:contain;">
          <div class="nombre" style="font-size:12px;">${p.visita}</div>
        </div>

      </div>
    </div>
    `;

  });

  document.getElementById("ultimos-resultados").innerHTML = html;
}

  }catch(error){
    console.error(error);
  }
}

// ==================== EQUIPOS ====================
function cargarEquipos(){
  const contenedor = document.getElementById("lista-equipos");
  if(!contenedor) return;
  let html = "";
  Object.keys(logos).forEach(nombre=>{
    html += `
    <div class="equipo-card">
      <img src="${logos[nombre]}" class="equipo-logo">
      <div class="equipo-nombre">${nombre}</div>
    </div>
    `;
  });
  contenedor.innerHTML = html;
}

// ==================== INICIO ====================
async function iniciarTabla(){
  await cargarCatalogoTabla(); // primero traemos equipos/logos/IDs del Sheet
  cargarTablaGeneral();
  cargarPartidos();
  cargarEquipos();
}
iniciarTabla();
