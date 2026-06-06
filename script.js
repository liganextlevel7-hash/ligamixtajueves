const URL_ESTADISTICAS =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=979195152&single=true&output=csv";

const URL_PARTIDOS =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=1362473459&single=true&output=csv";

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

const equiposID = {
  1:"Soldados Del Amor",
  2:"Cuervos F.C",
  3:"Unión 8",
  4:"La Garra",
  5:"Pumas KAP",
  6:"Los Chipotles",
  7:"Deportivo CT",
  8:"Gusanitos",
  9:"Bacachitos",
  10:"Descansa"
};

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
      const lista = programados.filter(p => p.fecha === fechaProxima).slice(0,4);
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
        </div>`;
      });
      document.getElementById("proxima-jornada").innerHTML = html;
    }

    // Últimos Resultados
    if(jugados.length > 0){
      const fechaResultado = jugados[jugados.length - 1].fecha;
      const lista = jugados.filter(p => p.fecha === fechaResultado).slice(0,4);
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
        </div>`;
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
    </div>`;
  });
  contenedor.innerHTML = html;
}

// ==================== INICIO ====================
cargarPartidos();
cargarEquipos();
