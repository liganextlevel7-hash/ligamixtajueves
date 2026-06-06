// ==================== TOP GOLEADORES ====================

const URL_JUGADORES =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=1940220650&single=true&output=csv";

const URL_EVENTOS =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=645868286&single=true&output=csv";

const URL_PARTICIPACIONES =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=626975401&single=true&output=csv";

// Logos de equipos (mismo objeto que ya tienes en script.js)
const logosEquipos = {
  1: "https://i.imgur.com/gBvmM4v.png", // Soldados Del Amor
  2: "https://i.imgur.com/fGQAhE5.png", // Cuervos F.C
  3: "https://i.imgur.com/Qrx4JSj.png", // Unión 8
  4: "https://i.imgur.com/8BWFWBW.png", // La Garra
  5: "https://i.imgur.com/5TAVBS7.png", // Pumas KAP
  6: "https://i.imgur.com/KTMLCv9.png", // Los Chipotles
  7: "https://i.imgur.com/hqOAa7J.png", // Deportivo CT
  8: "https://i.imgur.com/5TARJkD.png", // Gusanitos
  9: "https://i.imgur.com/ddKmNL6.png"  // Bacachitos
};

const nombresEquipos = {
  1: "Soldados Del Amor",
  2: "Cuervos F.C",
  3: "Unión 8",
  4: "La Garra",
  5: "Pumas KAP",
  6: "Los Chipotles",
  7: "Deportivo CT",
  8: "Gusanitos",
  9: "Bacachitos"
};

function parseCSV(texto) {
  const filas = texto.trim().split("\n");
  const headers = filas[0].split(",").map(h => h.trim().replace(/\r/g, ""));
  return filas.slice(1).map(fila => {
    const cols = fila.split(",").map(c => c.trim().replace(/\r/g, ""));
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i] || "");
    return obj;
  });
}

// Posiciones abreviadas estilo FIFA
function abreviarPosicion(pos) {
  const mapa = {
    "Portero": "POR",
    "Defensa": "DEF",
    "Medio": "MED",
    "Delantero": "DEL",
    "": "JUG"
  };
  return mapa[pos] || pos.substring(0, 3).toUpperCase();
}

// Silueta SVG estilo FIFA con brazos cruzados
function siluetaSVG(color) {
  return `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <defs>
        <radialGradient id="bgGrad${color}" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="${color === 'gold' ? '#fff8c0' : color === 'silver' ? '#e8e8e8' : color === 'blue' ? '#c0d8ff' : '#888'}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="44" rx="18" ry="20" fill="currentColor" opacity="0.5"/>
      <path d="M30 160 Q35 100 60 95 Q85 100 90 160Z" fill="currentColor" opacity="0.45"/>
      <path d="M22 115 Q28 95 42 105 Q50 90 60 95 Q70 90 78 105 Q92 95 98 115" fill="currentColor" opacity="0.5" stroke="none"/>
      <path d="M38 108 Q50 120 60 115 Q70 120 82 108" fill="currentColor" opacity="0.4"/>
    </svg>
  `;
}

// Genera el gradiente y estilos de la carta según ranking
function estilosCarta(rank) {
  if (rank === 1) return {
    bg: "linear-gradient(160deg, #f5d020 0%, #f0a500 30%, #c97b00 60%, #f5d020 100%)",
    border: "2px solid #ffd700",
    shadow: "0 0 30px #ffd700, 0 0 60px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
    textColor: "#3d2200",
    accentColor: "#3d2200",
    silhouetteColor: "rgba(180,120,0,0.5)",
    shimmer: "rgba(255,255,255,0.15)",
    label: "ORO"
  };
  if (rank === 2) return {
    bg: "linear-gradient(160deg, #e0e0e0 0%, #b0b0b0 30%, #888 60%, #d8d8d8 100%)",
    border: "2px solid #c0c0c0",
    shadow: "0 0 25px #c0c0c0, 0 0 50px rgba(192,192,192,0.3), inset 0 1px 0 rgba(255,255,255,0.5)",
    textColor: "#1a1a1a",
    accentColor: "#1a1a1a",
    silhouetteColor: "rgba(100,100,100,0.5)",
    shimmer: "rgba(255,255,255,0.2)",
    label: "PLATA"
  };
  if (rank === 3) return {
    bg: "linear-gradient(160deg, #4fc3f7 0%, #0288d1 30%, #01579b 60%, #29b6f6 100%)",
    border: "2px solid #29b6f6",
    shadow: "0 0 25px #29b6f6, 0 0 50px rgba(41,182,246,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
    textColor: "#fff",
    accentColor: "#fff",
    silhouetteColor: "rgba(255,255,255,0.3)",
    shimmer: "rgba(255,255,255,0.15)",
    label: "BRONCE"
  };
  return {
    bg: "linear-gradient(160deg, #3a3a3a 0%, #222 40%, #111 100%)",
    border: "1px solid #39ff14",
    shadow: "0 0 15px rgba(57,255,20,0.3)",
    textColor: "#fff",
    accentColor: "#39ff14",
    silhouetteColor: "rgba(255,255,255,0.2)",
    shimmer: "rgba(57,255,20,0.05)",
    label: ""
  };
}

function crearCartaGoleador(jugador, rank) {
  const s = estilosCarta(rank);
  const logoEquipo = logosEquipos[jugador.equipoID] || "";
  const pos = abreviarPosicion(jugador.posicion);
  const pct = jugador.partidos > 0
    ? Math.round((jugador.asistencias / jugador.partidos) * 100)
    : 0;

  const colorKey = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'blue' : 'dark';

  return `
    <div class="fifa-card" style="
      background: ${s.bg};
      border: ${s.border};
      box-shadow: ${s.shadow};
      border-radius: 18px 18px 10px 10px;
      width: 160px;
      min-height: 240px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: default;
      flex-shrink: 0;
    "
    onmouseenter="this.style.transform='translateY(-8px) scale(1.04)';this.style.boxShadow='${s.shadow.replace('30px','45px')}';"
    onmouseleave="this.style.transform='';this.style.boxShadow='${s.shadow}';"
    >
      <!-- Shimmer overlay -->
      <div style="
        position:absolute;top:0;left:0;right:0;bottom:0;
        background: linear-gradient(135deg, ${s.shimmer} 0%, transparent 50%, ${s.shimmer} 100%);
        pointer-events:none;border-radius:inherit;
      "></div>

      <!-- Top row: posición + número + escudo -->
      <div style="
        width:100%;display:flex;justify-content:space-between;
        align-items:flex-start;padding:10px 10px 0 10px;
        box-sizing:border-box;position:relative;z-index:1;
      ">
        <div style="text-align:center;">
          <div style="font-size:11px;font-weight:900;color:${s.textColor};letter-spacing:1px;opacity:0.9;">${pos}</div>
          <div style="font-size:20px;font-weight:900;color:${s.textColor};line-height:1;">${jugador.numero || "—"}</div>
        </div>
        <img src="${logoEquipo}" style="width:32px;height:32px;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
      </div>

      <!-- Silueta jugador -->
      <div style="
        width:100px;height:110px;
        color:${s.silhouetteColor};
        position:relative;z-index:1;
        margin-top:-5px;
      ">
        ${siluetaSVG(colorKey)}
      </div>

      <!-- Nombre jugador -->
      <div style="
        font-size:11px;font-weight:900;
        color:${s.textColor};
        text-align:center;
        padding:4px 8px 0;
        line-height:1.2;
        position:relative;z-index:1;
        text-transform:uppercase;
        letter-spacing:0.5px;
        max-width:150px;
        word-break:break-word;
      ">${jugador.nombre}</div>

      <!-- Separador -->
      <div style="width:80%;height:1px;background:${s.textColor};opacity:0.3;margin:6px 0;"></div>

      <!-- Stats: Goles y % Asistencias -->
      <div style="
        display:flex;gap:16px;
        position:relative;z-index:1;
        margin-bottom:10px;
      ">
        <div style="text-align:center;">
          <div style="font-size:18px;font-weight:900;color:${s.textColor};line-height:1;">${jugador.goles}</div>
          <div style="font-size:9px;color:${s.textColor};opacity:0.8;letter-spacing:0.5px;">GOLES</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:18px;font-weight:900;color:${s.textColor};line-height:1;">${pct}%</div>
          <div style="font-size:9px;color:${s.textColor};opacity:0.8;letter-spacing:0.5px;">ASIST</div>
        </div>
      </div>

      ${rank <= 3 ? `
      <!-- Badge ranking -->
      <div style="
        position:absolute;bottom:8px;right:8px;
        font-size:8px;font-weight:900;
        color:${s.textColor};opacity:0.6;
        letter-spacing:1px;
      ">${s.label}</div>` : ''}
    </div>
  `;
}

async function cargarTopGoleadores() {
  const contenedor = document.getElementById("top-goleadores");
  if (!contenedor) return;
  contenedor.innerHTML = `<div style="text-align:center;color:#39ff14;padding:20px;">Cargando goleadores...</div>`;

  try {
    const [resJugadores, resEventos, resParticipaciones] = await Promise.all([
      fetch(URL_JUGADORES),
      fetch(URL_EVENTOS),
      fetch(URL_PARTICIPACIONES)
    ]);

    const [txtJugadores, txtEventos, txtParticipaciones] = await Promise.all([
      resJugadores.text(),
      resEventos.text(),
      resParticipaciones.text()
    ]);

    const jugadores = parseCSV(txtJugadores);
    const eventos = parseCSV(txtEventos);
    const participaciones = parseCSV(txtParticipaciones);

    // Contar goles por jugador (solo Tipo_Evento = "Gol")
    const golesMap = {};
    eventos.forEach(e => {
      if (e.Tipo_Evento === "Gol") {
        const id = e.Jugador;
        golesMap[id] = (golesMap[id] || 0) + 1;
      }
    });

    // Contar partidos jugados por jugador (Asistio = TRUE)
    const partidosMap = {};
    participaciones.forEach(p => {
      if (p.Asistio === "TRUE") {
        const id = p.Jugador;
        partidosMap[id] = (partidosMap[id] || 0) + 1;
      }
    });

    // Construir lista de goleadores
    const goleadores = jugadores
      .filter(j => golesMap[j.ID_Jugador] > 0)
      .map(j => ({
        id: j.ID_Jugador,
        nombre: j.Nombre,
        equipoID: Number(j.Equipo),
        numero: j.Numero,
        posicion: j.Posicion || "",
        goles: golesMap[j.ID_Jugador] || 0,
        asistencias: partidosMap[j.ID_Jugador] || 0,
        partidos: partidosMap[j.ID_Jugador] || 0
      }))
      .sort((a, b) => b.goles - a.goles)
      .slice(0, 8);

    if (goleadores.length === 0) {
      contenedor.innerHTML = `<div style="text-align:center;color:#aaa;padding:20px;">Sin goleadores aún</div>`;
      return;
    }

    // Render cartas
    let html = `
      <div style="
        display:flex;
        flex-wrap:wrap;
        gap:16px;
        justify-content:center;
        padding:10px 0;
      ">
    `;

    goleadores.forEach((j, i) => {
      html += crearCartaGoleador(j, i + 1);
    });

    html += `</div>`;
    contenedor.innerHTML = html;

  } catch (err) {
    console.error("Error cargando goleadores:", err);
    contenedor.innerHTML = `<div style="text-align:center;color:#ff4444;padding:20px;">Error cargando goleadores</div>`;
  }
}

cargarTopGoleadores();
