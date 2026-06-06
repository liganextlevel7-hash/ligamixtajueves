const URL_JUGADORES = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=1940220650&single=true&output=csv";
const URL_EVENTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=645868286&single=true&output=csv";
const URL_PARTICIPACIONES = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=626975401&single=true&output=csv";

const equiposID = {
  1:"Soldados Del Amor",
  2:"Cuervos F.C",
  3:"Unión 8",
  4:"La Garra",
  5:"Pumas KAP",
  6:"Los Chipotles",
  7:"Deportivo CT",
  8:"Gusanitos",
  9:"Bacachitos"
};

async function cargarJugadores() {
  const jugadoresCSV = await fetch(URL_JUGADORES);
  const eventosCSV = await fetch(URL_EVENTOS);
  const participacionesCSV = await fetch(URL_PARTICIPACIONES);

  const jugadoresTexto = await jugadoresCSV.text();
  const eventosTexto = await eventosCSV.text();
  const participacionesTexto = await participacionesCSV.text();

  const jugadoresFilas = jugadoresTexto.trim().split("\n");
  const eventosFilas = eventosTexto.trim().split("\n");
  const participacionesFilas = participacionesTexto.trim().split("\n");

  const jugadores = [];
  for(let i=1;i<jugadoresFilas.length;i++){
    const c = jugadoresFilas[i].split(",");
    jugadores.push({
      id: c[0],
      nombre: c[1],
      equipo: c[2],
      numero: c[3],
      posicion: c[4],
      logo: c[5],
      foto: c[7] && c[7].trim() ? c[7] : c[5] // URL_Foto si existe
    });
  }

  const selector = document.getElementById("selector-equipo-jugador");
  Object.entries(equiposID).forEach(([id,nombre])=>{
    selector.innerHTML += `<option value="${id}">${nombre}</option>`;
  });

  selector.addEventListener("change",()=>{
    const equipoID = selector.value;
    const lista = jugadores.filter(j =>
  j.equipo === equipoID &&
  j.nombre !== "Penal" &&
  j.nombre !== "Default" &&
  j.nombre !== "Autogol"
);

    let html = '<div class="jugadores-grid">';
    lista.forEach(j=>{
      let goles=0, amarillas=0, rojas=0, asistencias=0;

      eventosFilas.slice(1).forEach(f=>{
        const e=f.split(",");
        if(e[2]===j.id){
          if(e[3]==="Gol") goles++;
          if(e[3]==="Amarilla") amarillas++;
          if(e[3]==="Roja") rojas++;
        }
      });

      participacionesFilas.slice(1).forEach(f=>{
        const p=f.split(",");
        if(p[4]===j.id && p[5]==="TRUE") asistencias++;
      });

      const porcentaje = Math.round((asistencias / 8) * 100);
      const suspendido = rojas>0 ? "Sí" : "No";

      html += `
      <div class="jugador-card">
        <img src="${j.foto}" class="jugador-foto">
        <div class="jugador-info">
          <h3>${j.nombre}</h3>
          <span class="jugador-posicion">${j.posicion}</span>
        </div>
   <div class="jugador-stats">
  <div class="stat"><span>⚽</span><strong>${goles}</strong><small>Goles</small></div>
  <div class="stat"><span>🎯</span><strong>${porcentaje}%</strong><small>Asistencias</small></div>
  <div class="stat"><span>👕</span><strong>${j.numero}</strong><small>Número</small></div>
  <div class="stat"><span>⛔</span><strong>${suspendido}</strong><small>Suspendido</small></div>
</div>
   </div>
      `;
    });

    html += '</div>';
    document.getElementById("lista-jugadores").innerHTML = html;
  });
}

cargarJugadores();
