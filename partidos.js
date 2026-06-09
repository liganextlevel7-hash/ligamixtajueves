document.getElementById('flyerBg').src = 'fondo-partidos.png';

const CSV_PARTIDOS = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=1362473459&single=true&output=csv';
const CSV_EQUIPOS  = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=1894947293&single=true&output=csv';
const CSV_JUGADORES = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=1940220650&single=true&output=csv';
const CSV_PARTICIPACIONES = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=626975401&single=true&output=csv';
const CSV_EVENTOS = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=645868286&single=true&output=csv';

let todosPartidos = [], todosEquipos = [], todosJugadores = [], todasParticipaciones = [], todosEventos = [];

function parseCSV(text) {
  const lines = text.replace(/\r/g, '').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g,''));
  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    const vals = []; let cur = '', inQ = false;
    for (let ch of line) {
      if (ch === '"') inQ = !inQ;
      else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    vals.push(cur.trim());
    const obj = {};
    headers.forEach((h,i) => obj[h] = (vals[i]||'').replace(/^"|"$/g,'').trim());
    return obj;
  });
}

function formatHora(t) {
  if (!t) return '';
  const parts = t.split(':');
  let h = parseInt(parts[0]);
  const m = parts[1] || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function phSVG() {
  return `<svg style="width:36px;height:36px;opacity:0.22;" viewBox="0 0 60 60"><circle cx="30" cy="22" r="12" fill="white" opacity="0.4"/><path d="M10 54c0-11 9-18 20-18s20 7 20 18" fill="white" opacity="0.4"/></svg>`;
}

function cambiarFiltro() {
  const tipo = document.getElementById('filterTipo').value;
  document.getElementById('groupJornada').style.display = tipo === 'jornada' ? 'flex' : 'none';
  document.getElementById('groupFecha').style.display = tipo === 'fecha' ? 'flex' : 'none';
  document.getElementById('groupEquipo').style.display = tipo === 'equipo' ? 'flex' : 'none';
  document.getElementById('statusMsg').textContent = 'Selecciona opción y presiona Cargar Datos';
  document.getElementById('encFlyer').innerHTML = '';
  document.getElementById('jornadaDisplay').textContent = 'DOMINICAL';
}

async function cargarFechasYEquipos() {
  try {
    const [resP, resE, resJ, resPart, resEv] = await Promise.all([
      fetch(CSV_PARTIDOS), fetch(CSV_EQUIPOS), fetch(CSV_JUGADORES),
      fetch(CSV_PARTICIPACIONES), fetch(CSV_EVENTOS)
    ]);
    todosPartidos       = parseCSV(await resP.text());
    todosEquipos        = parseCSV(await resE.text());
    todosJugadores      = parseCSV(await resJ.text());
    todasParticipaciones= parseCSV(await resPart.text());
    todosEventos        = parseCSV(await resEv.text());

    const fechas = [...new Set(todosPartidos.filter(p => p['Fecha'] && p['Fecha'].trim() !== '').map(p => p['Fecha'].trim()))];
    const selFecha = document.getElementById('filterFecha');
    selFecha.innerHTML = '<option value="">— Selecciona una fecha —</option>';
    fechas.forEach(f => selFecha.innerHTML += `<option value="${f}">${f}</option>`);

    const equiposSet = new Set();
    todosEquipos.forEach(e => { if (e['Nombre']) equiposSet.add(e['Nombre'].toUpperCase()); });
    const selEquipo = document.getElementById('filterEquipo');
    selEquipo.innerHTML = '<option value="">— Selecciona un equipo —</option>';
    Array.from(equiposSet).sort().forEach(eq => selEquipo.innerHTML += `<option value="${eq}">${eq}</option>`);

    document.getElementById('statusMsg').textContent = 'Selecciona filtro y presiona Cargar Datos';
  } catch(e) {
    document.getElementById('statusMsg').textContent = '❌ Error: ' + e.message;
  }
}

// ===== POPUP =====
function crearPopupStyles() {
  if (document.getElementById('partido-popup-style')) return;
  const style = document.createElement('style');
  style.id = 'partido-popup-style';
  style.textContent = `
    .partido-popup-overlay {
      display: none; position: fixed; top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.9); z-index: 99999;
      justify-content: center; align-items: center;
      padding: 16px; box-sizing: border-box;
    }
    .partido-popup-overlay.active { display: flex; }
    .partido-popup {
      background: #080c14; border: 2px solid rgba(184,240,48,0.4);
      border-radius: 18px; width: 100%; max-width: 560px;
      max-height: 90vh; overflow-y: auto;
      box-shadow: 0 0 30px rgba(184,240,48,0.2);
    }
    .pp-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px 10px;
      border-bottom: 1px solid rgba(184,240,48,0.2);
      position: sticky; top:0; background: #080c14; z-index: 1;
    }
    .pp-encuentro {
      font-size: 11px; font-weight: 700; color: rgba(184,240,48,0.6);
      letter-spacing: 2px; text-transform: uppercase; text-align: center; flex:1;
    }
    .pp-close {
      background: none; border: none; color: rgba(255,255,255,0.4);
      font-size: 22px; cursor: pointer; line-height:1; padding: 0 4px;
    }
    .pp-close:hover { color: #b8f030; }
    .pp-teams {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; gap: 8px;
      border-bottom: 1px solid rgba(184,240,48,0.15);
    }
    .pp-team {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      flex: 1;
    }
    .pp-team-logo { width: 52px; height: 52px; object-fit: contain; }
    .pp-team-name {
      font-size: 11px; font-weight: 700; color: #fff;
      text-transform: uppercase; text-align: center; letter-spacing: 0.5px;
    }
    .pp-score {
      font-size: 38px; font-weight: 900; color: #d4f030;
      text-shadow: 0 0 12px rgba(120,220,0,0.5);
      letter-spacing: 2px; text-align: center; min-width: 90px;
    }
    .pp-score.programado { font-size: 20px; color: rgba(255,255,255,0.3); }
    .pp-players {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 0; padding: 0;
    }
    .pp-col {
      padding: 12px 10px;
    }
    .pp-col:first-child { border-right: 1px solid rgba(184,240,48,0.15); }
    .pp-col-title {
      font-size: 9px; font-weight: 700; color: rgba(184,240,48,0.5);
      letter-spacing: 2px; text-transform: uppercase;
      margin-bottom: 8px; text-align: center;
    }
    .pp-player {
      display: flex; align-items: center; gap: 6px;
      padding: 5px 4px; border-radius: 6px;
      border-bottom: 0.5px solid rgba(255,255,255,0.04);
    }
    .pp-player-num {
      font-size: 11px; font-weight: 700; color: rgba(184,240,48,0.6);
      min-width: 20px; text-align: right;
    }
    .pp-player-name {
      font-size: 11px; color: rgba(255,255,255,0.85); flex:1;
    }
    .pp-player-icons { display: flex; gap: 2px; flex-wrap: wrap; }
    .pp-icon { font-size: 11px; }
  `;
  document.head.appendChild(style);
}

function abrirPopupPartido(partido) {
  const estado = (partido.Estado || '').trim();
  if (estado === 'Pendiente') return;

  crearPopupStyles();

  let overlay = document.getElementById('partido-popup-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'partido-popup-overlay';
    overlay.id = 'partido-popup-overlay';
    overlay.innerHTML = `<div class="partido-popup" id="partido-popup-inner"></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) cerrarPopupPartido(); });
  }

  const eqMap = {};
  todosEquipos.forEach(e => { eqMap[String(e['ID_Equipo']).trim()] = e; });

  const eqL = eqMap[String(partido.Equipo_Local).trim()] || {};
  const eqV = eqMap[String(partido.Equipo_Visita).trim()] || {};
  const nomL = (eqL['Nombre'] || `Equipo ${partido.Equipo_Local}`).toUpperCase();
  const nomV = (eqV['Nombre'] || `Equipo ${partido.Equipo_Visita}`).toUpperCase();
  const urlL = eqL['URL'] || '';
  const urlV = eqV['URL'] || '';
  const idPartido = String(partido.ID_Partido).trim();
  const gL = partido.Goles_Local !== '' ? partido.Goles_Local : '-';
  const gV = partido.Goles_Visita !== '' ? partido.Goles_Visita : '-';
  const jornada = partido.Jornada ? `Encuentro · Jornada ${partido.Jornada}` : 'Encuentro · Jornada ?';

  // Jugadores que participaron en este partido
  const partLocal  = todasParticipaciones.filter(p => String(p.Partido).trim() === idPartido && String(p.Equipo).trim() === String(partido.Equipo_Local).trim());
  const partVisita = todasParticipaciones.filter(p => String(p.Partido).trim() === idPartido && String(p.Equipo).trim() === String(partido.Equipo_Visita).trim());

  // Eventos de este partido
  const eventosPartido = todosEventos.filter(e => String(e.Partido).trim() === idPartido);

  function getJugador(id) {
    return todosJugadores.find(j => String(j.ID_Jugador).trim() === String(id).trim()) || {};
  }

  function renderJugadores(participaciones) {
    if (!participaciones.length) return '<div style="color:rgba(255,255,255,0.3);font-size:11px;text-align:center;padding:8px;">Sin registro</div>';
    return participaciones.map(p => {
      const jug = getJugador(p.Jugador);
      const nombre = jug.Nombre || `#${p.Jugador}`;
      const numero = jug.Numero || '';
      const evJug = eventosPartido.filter(e => String(e.Jugador).trim() === String(p.Jugador).trim());
      const goles     = evJug.filter(e => e.Tipo_Evento === 'Gol').length;
      const amarillas = evJug.filter(e => e.Tipo_Evento === 'Amarilla').length;
      const rojas     = evJug.filter(e => e.Tipo_Evento === 'Roja').length;
      const iconos = '⚽'.repeat(goles) + (amarillas ? '🟡' : '') + (rojas ? '🔴' : '');
      return `
        <div class="pp-player">
          <span class="pp-player-num">${numero}</span>
          <span class="pp-player-name">${nombre}</span>
          ${iconos ? `<span class="pp-player-icons">${iconos}</span>` : ''}
        </div>`;
    }).join('');
  }

  const scoreHTML = estado === 'Jugado'
    ? `<div class="pp-score">${gL} - ${gV}</div>`
    : `<div class="pp-score programado">VS</div>`;

  document.getElementById('partido-popup-inner').innerHTML = `
    <div class="pp-header">
      <div style="width:28px;"></div>
      <div class="pp-encuentro">${jornada}</div>
      <button class="pp-close" onclick="cerrarPopupPartido()">✕</button>
    </div>
    <div class="pp-teams">
      <div class="pp-team">
        <img class="pp-team-logo" src="${urlL}" onerror="this.style.opacity='0.3'">
        <div class="pp-team-name">${nomL}</div>
      </div>
      ${scoreHTML}
      <div class="pp-team">
        <img class="pp-team-logo" src="${urlV}" onerror="this.style.opacity='0.3'">
        <div class="pp-team-name">${nomV}</div>
      </div>
    </div>
    <div class="pp-players">
      <div class="pp-col">
        <div class="pp-col-title">${nomL}</div>
        ${renderJugadores(partLocal)}
      </div>
      <div class="pp-col">
        <div class="pp-col-title">${nomV}</div>
        ${renderJugadores(partVisita)}
      </div>
    </div>
  `;

  overlay.classList.add('active');
}

function cerrarPopupPartido() {
  const overlay = document.getElementById('partido-popup-overlay');
  if (overlay) overlay.classList.remove('active');
}

async function cargarDatos() {
  const tipo = document.getElementById('filterTipo').value;
  const statusEl = document.getElementById('statusMsg');
  statusEl.textContent = '⏳ Cargando datos...';

  try {
    let filtrados = [];
    if (tipo === 'jornada') {
      const jornada = document.getElementById('filterJornada').value;
      if (!jornada) { statusEl.textContent = '⚠️ Selecciona una jornada'; return; }
      filtrados = todosPartidos.filter(p => p['Jornada'] && String(p['Jornada']).trim() === String(jornada));
      if (!filtrados.length) { statusEl.textContent = `⚠️ No hay partidos para Jornada ${jornada}`; return; }
      document.getElementById('jornadaDisplay').textContent = `DOMINICAL — JORNADA ${jornada}`;
    } else if (tipo === 'fecha') {
      const fecha = document.getElementById('filterFecha').value;
      if (!fecha) { statusEl.textContent = '⚠️ Selecciona una fecha'; return; }
      filtrados = todosPartidos.filter(p => p['Jornada'] && p['Fecha'].trim() === fecha);
      if (!filtrados.length) { statusEl.textContent = `⚠️ No hay partidos para el ${fecha}`; return; }
      document.getElementById('jornadaDisplay').textContent = `DOMINICAL — ${fecha}`;
    } else if (tipo === 'equipo') {
      const equipoSel = document.getElementById('filterEquipo').value.trim().toUpperCase();
      if (!equipoSel) { statusEl.textContent = '⚠️ Selecciona un equipo'; return; }
      filtrados = todosPartidos.filter(p => {
        const eqLocal  = (todosEquipos.find(e => String(e.ID_Equipo) === String(p.Equipo_Local))?.Nombre || '').toUpperCase();
        const eqVisita = (todosEquipos.find(e => String(e.ID_Equipo) === String(p.Equipo_Visita))?.Nombre || '').toUpperCase();
        return eqLocal === equipoSel || eqVisita === equipoSel;
      });
      if (!filtrados.length) { statusEl.textContent = `⚠️ No hay partidos para el equipo ${equipoSel}`; return; }
      document.getElementById('jornadaDisplay').textContent = `DOMINICAL — EQUIPO ${equipoSel}`;
    } else {
      statusEl.textContent = '⚠️ Selecciona un tipo de filtro';
      return;
    }

    let jornadasFaltantes = [];
    let jornadaFaltanteIdx = 0;
    if (tipo === 'equipo') {
      const jornadasUsadas = new Set(filtrados.filter(p => p['Jornada']).map(p => Number(p['Jornada'])));
      jornadasFaltantes = [1,2,3,4,5,6,7,8,9].filter(j => !jornadasUsadas.has(j));
    }

    const eqMap = {};
    todosEquipos.forEach(e => { eqMap[String(e['ID_Equipo']).trim()] = e; });

    const cont = document.getElementById('encFlyer');
    cont.innerHTML = '';

    filtrados.forEach((p, idx) => {
      const eqL = eqMap[String(p['Equipo_Local']).trim()] || {};
      const eqV = eqMap[String(p['Equipo_Visita']).trim()] || {};
      const nomL = (eqL['Nombre'] || `Equipo ${p['Equipo_Local']}`).toUpperCase();
      const nomV = (eqV['Nombre'] || `Equipo ${p['Equipo_Visita']}`).toUpperCase();
      const urlL = eqL['URL'] || '';
      const urlV = eqV['URL'] || '';
      const logoL = urlL ? `<img src="${urlL}" onerror="this.style.display='none'" style="width:100%;height:100%;object-fit:cover;">` : phSVG();
      const logoV = urlV ? `<img src="${urlV}" onerror="this.style.display='none'" style="width:100%;height:100%;object-fit:cover;">` : phSVG();
      const gL = p['Goles_Local'] !== '' ? p['Goles_Local'] : '-';
      const gV = p['Goles_Visita'] !== '' ? p['Goles_Visita'] : '-';
      const ganPor = (p['Ganado_Por'] || '').trim().toUpperCase();
      const ganPorClass = ganPor.toLowerCase();
      const hora = formatHora(p['Hora']);
      const estado = (p['Estado'] || '').trim();

      let jornada;
      if (p['Jornada']) {
        jornada = `Jornada ${p['Jornada']}`;
      } else if (tipo === 'equipo' && jornadasFaltantes.length > 0) {
        const jNum = jornadasFaltantes[jornadaFaltanteIdx % jornadasFaltantes.length];
        jornadaFaltanteIdx++;
        jornada = `Jornada ${jNum}`;
      } else {
        jornada = 'Jornada ?';
      }

      const cancha2 = p['Cancha'] || '';
      const fecha2  = p['Fecha'] || '';

      // Solo clickeable si es Jugado o Programado
      const clickable = (estado === 'Jugado' || estado === 'Programado');
      const clickAttr = clickable ? `onclick="abrirPopupPartido(todosPartidos[${todosPartidos.indexOf(p)}])" style="cursor:pointer;"` : '';
      const infoBtn   = clickable ? `<div style="font-size:10px;color:rgba(184,240,48,0.5);letter-spacing:1px;margin-top:4px;">👆 VER DETALLE</div>` : '';

      cont.innerHTML += `
      <div class="enc-row" ${clickAttr}>
        <div class="teams-section">
          <div class="team-block">
            <div class="team-logo-sm">${logoL}</div>
            <div class="team-name-sm">${nomL}</div>
          </div>
          <div class="score-block">
            <div class="score-nums">${gL} - ${gV}</div>
            ${infoBtn}
          </div>
          <div class="team-block">
            <div class="team-logo-sm">${logoV}</div>
            <div class="team-name-sm">${nomV}</div>
          </div>
        </div>
        <div class="enc-divider-v"></div>
        <div class="info-section">
          <div class="info-col">
            ${jornada === 'Jornada ?' ? `<div class="info-item"><span class="icon">🏆</span><span class="val" style="color:#ffd700;">${jornada}</span></div>` : jornada ? `<div class="info-item"><span class="icon">🏆</span><span class="val">${jornada}</span></div>` : ''}
            ${cancha2 ? `<div class="info-item"><span class="icon">📍</span><span class="val">${cancha2}</span></div>` : ''}
          </div>
          <div class="info-col">
            ${fecha2 ? `<div class="info-item"><span class="icon">📅</span><span class="val">${fecha2}</span></div>` : ''}
            ${hora ? `<div class="info-item"><span class="icon">⏰</span><span class="val">${hora}</span></div>` : ''}
          </div>
          ${ganPor ? `<div class="ganado-badge ${ganPorClass}">${ganPor}</div>` : ''}
        </div>
      </div>`;
    });

    statusEl.textContent = `✅ ${filtrados.length} partido(s) cargado(s)`;

  } catch(e) {
    statusEl.textContent = '❌ Error: ' + e.message;
  }
}

async function downloadPNG() {
  const btn = document.getElementById('dlBtn');
  const panel = document.querySelector('.editor-panel');
  const wrapper = document.getElementById('flyerRoot');
  const container = document.getElementById('flyerScaleContainer');
  panel.style.display = 'none';
  btn.textContent = '⏳ Generando...';
  btn.disabled = true;
  wrapper.style.transform = 'scale(1)';
  wrapper.style.transformOrigin = 'top left';
  container.style.width = '900px';
  container.style.height = '1270px';
  const imgs = document.getElementById('flyerRoot').querySelectorAll('img');
  await Promise.all(Array.from(imgs).map(img => new Promise(resolve => {
    if (img.complete) resolve(); else { img.onload = resolve; img.onerror = resolve; }
  })));
  await new Promise(r => setTimeout(r, 800));
  try {
    const canvas = await html2canvas(document.getElementById('flyerRoot'), {
      useCORS: true, allowTaint: true, scale: 2,
      width: 900, height: 1600, backgroundColor: '#000', imageTimeout: 20000, logging: false
    });
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'dominical.png';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    }, 'image/png');
  } catch(e) { alert('❌ Error: ' + e.message); }
  panel.style.display = 'block';
  btn.textContent = '⬇ Descargar Flyer como PNG';
  btn.disabled = false;
  escalarFlyer();
}

function escalarFlyer() {
  const wrapper = document.getElementById('flyerRoot');
  const container = document.getElementById('flyerScaleContainer');
  const disponible = document.documentElement.clientWidth - 16;
  const escala = disponible < 900 ? disponible / 900 : 1;
  wrapper.style.transform = `scale(${escala})`;
  wrapper.style.transformOrigin = 'top left';
  container.style.height = Math.round(1600 * escala) + 'px';
  container.style.width = Math.round(900 * escala) + 'px';
  container.style.overflow = 'hidden';
}

escalarFlyer();
window.addEventListener('resize', escalarFlyer);
cargarFechasYEquipos();
