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

function jerseySVG(numero) {
  return `
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    <defs>
      <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0d0d1a;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Camiseta base -->
    <path fill="url(#jerseyGrad)" stroke="#39ff14" stroke-width="6" d="M369.656,476.269h-227.31c-27.913,0-50.622-22.708-50.622-50.622V223.836
      c-5.662,3.533-12.161,5.594-19.048,5.959c-11.077,0.585-21.6-3.281-29.655-10.895l-30.459-28.789
      c-14.842-14.026-16.774-36.908-4.498-53.226L71.68,52.326c7.236-9.617,21.224-16.597,33.258-16.597h51.088
      c9.351,0,17.572,5.032,22.557,13.806c8.006,14.096,37.169,28.365,77.416,28.365c11.392,0,22.428-1.163,32.797-3.458
      c7.373-1.628,14.666,3.023,16.296,10.392c1.63,7.37-3.022,14.666-10.392,16.296c-12.304,2.722-25.326,4.101-38.701,4.101
      c-46.89,0-86.594-16.552-101.167-42.171h-49.892c-3.398,0-9.373,2.982-11.417,5.698l-63.616,84.558
      c-3.905,5.191-3.29,12.468,1.43,16.929l30.459,28.789c2.562,2.42,5.926,3.65,9.431,3.464c3.521-0.187,6.72-1.764,9.01-4.443
      l11.167-13.054c5.621-6.571,12.719-6.951,17.488-5.121c10.842,4.167,10.537,15.758,10.242,26.967
      c-0.038,1.465-0.077,2.858-0.077,4.053v214.744c0,12.841,10.448,23.289,23.289,23.289h227.311
      c12.841,0,23.289-10.448,23.289-23.289c0-7.548,6.118-13.667,13.667-13.667s13.667,6.118,13.667,13.667
      C420.278,453.561,397.569,476.269,369.656,476.269z"/>
    <path fill="url(#jerseyGrad)" stroke="#39ff14" stroke-width="6" d="M406.612,350.299c-7.548,0-13.667-6.119-13.667-13.667v-125.73c0-1.196-0.038-2.59-0.078-4.053
      c-0.294-11.209-0.599-22.8,10.243-26.967c4.77-1.831,11.868-1.45,17.486,5.122l11.166,13.052c2.292,2.679,5.491,4.257,9.012,4.443
      c3.522,0.198,6.87-1.043,9.431-3.464l30.459-28.789c4.72-4.461,5.335-11.738,1.431-16.927L418.477,68.76
      c-2.043-2.716-8.018-5.698-11.417-5.698h-51.377c-7.548,0-13.667-6.119-13.667-13.667s6.119-13.667,13.667-13.667h51.377
      c12.035,0,26.023,6.98,33.258,16.598l63.618,84.559c12.277,16.317,10.343,39.2-4.498,53.226l-30.46,28.789
      c-8.056,7.614-18.581,11.474-29.655,10.895c-6.888-0.366-13.385-2.424-19.048-5.959v112.797
      C420.278,344.181,414.16,350.299,406.612,350.299z"/>
    <!-- Numero en el centro -->
    <text x="256" y="370" text-anchor="middle" font-family="Arial" font-weight="900" font-size="160" fill="#39ff14" opacity="0.9"
      style="text-shadow:0 0 20px #39ff14;">${numero}</text>
  </svg>`;
}

// Inyectar estilos
(function() {
  if (document.getElementById("jugadores-card-style")) return;
  const style = document.createElement("style");
  style.id = "jugadores-card-style";
  style.textContent = `
    .jugadores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .jugador-card {
      background: rgba(0,0,0,0.75);
      border: 2px solid #39ff14;
      border-radius: 18px;
      padding: 12px;
      text-align: center;
      color: white;
      box-shadow: 0 0 12px #39ff14;
      transition: 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .jugador-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 0 22px #39ff14;
    }
    .jugador-jersey-wrap {
      position: relative;
      width: 130px;
      height: 140px;
    }
    .jugador-jersey-svg {
      width: 100%;
      height: 100%;
    }
    .jugador-foto-circle {
      position: absolute;
      top: -28px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #39ff14;
      box-shadow: 0 0 10px #39ff14;
      background: #111;
    }
    .jugador-info h3 {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: #fff;
      font-weight: bold;
    }
    .jugador-posicion {
      display: inline-block;
      background: #39ff14;
      color: black;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      margin-top: 4px;
    }
    .jugador-stats {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 4px;
      width: 100%;
      margin-top: 4px;
    }
    .jugador-stats .stat {
      background: rgba(255,255,255,0.07);
      border-radius: 8px;
      padding: 5px 3px;
      text-align: center;
    }
    .jugador-stats .stat span { display: block; font-size: 14px; }
    .jugador-stats .stat strong { display: block; font-size: 13px; color: #39ff14; font-weight: 900; }
    .jugador-stats .stat small { display: block; font-size: 9px; color: #aaa; }
    @media(max-width: 600px) {
      .jugadores-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .jugador-jersey-wrap { width: 110px; height: 118px; }
      .jugador-foto-circle { width: 50px; height: 50px; top: -24px; }
      .jugador-info h3 { font-size: 11px; }
    }
  `;
  document.head.appendChild(style);
})();

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
  for(let i = 1; i < jugadoresFilas.length; i++) {
    const c = jugadoresFilas[i].split(",");
    jugadores.push({
      id: c[0],
      nombre: c[1],
      equipo: c[2],
      numero: c[3],
      posicion: c[4],
      logo: c[5],
      foto: c[7] && c[7].trim() ? c[7] : c[5]
    });
  }

  const selector = document.getElementById("selector-equipo-jugador");
  Object.entries(equiposID).forEach(([id, nombre]) => {
    selector.innerHTML += `<option value="${id}">${nombre}</option>`;
  });

  selector.addEventListener("change", () => {
    const equipoID = selector.value;
    const lista = jugadores.filter(j =>
      j.equipo === equipoID &&
      j.nombre !== "Penal" &&
      j.nombre !== "Default" &&
      j.nombre !== "Autogol"
    );

    let html = '<div class="jugadores-grid">';
    lista.forEach(j => {
      let goles = 0, rojas = 0, asistencias = 0;
      eventosFilas.slice(1).forEach(f => {
        const e = f.split(",");
        if (e[2] === j.id) {
          if (e[3] === "Gol") goles++;
          if (e[3] === "Roja") rojas++;
        }
      });
      participacionesFilas.slice(1).forEach(f => {
        const p = f.split(",");
        if (p[4] === j.id && p[5] === "TRUE") asistencias++;
      });
      const porcentaje = Math.round((asistencias / 8) * 100);
      const suspendido = rojas > 0 ? "Sí" : "No";

      html += `
      <div class="jugador-card">
        <div class="jugador-jersey-wrap">
          <div class="jugador-jersey-svg">${jerseySVG(j.numero)}</div>
          <img src="${j.foto}" class="jugador-foto-circle" onerror="this.src='${j.logo}'">
        </div>
        <div class="jugador-info">
          <h3>${j.nombre}</h3>
          <span class="jugador-posicion">${j.posicion}</span>
        </div>
        <div class="jugador-stats">
          <div class="stat"><span>⚽</span><strong>${goles}</strong><small>Goles</small></div>
          <div class="stat"><span>🎯</span><strong>${porcentaje}%</strong><small>Asist</small></div>
          <div class="stat"><span>⛔</span><strong>${suspendido}</strong><small>Susp</small></div>
        </div>
      </div>`;
    });

    html += '</div>';
    document.getElementById("lista-jugadores").innerHTML = html;
  });
}

cargarJugadores();
