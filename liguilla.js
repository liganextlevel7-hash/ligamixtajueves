// ==================== liguilla.js ====================

const URL_LIGUILLA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRs55yHIAY-lWfU6XccheWIPHUjF4aRue0jy68FbZ9fNtPJfeO1glwsWI46cWv-6cxXy2slGty-DgMd/pub?gid=1783955716&single=true&output=csv";

async function cargarLiguilla() {
    const respuesta = await fetch(URL_LIGUILLA);
    const texto = await respuesta.text();
    const filas = texto.trim().split("\n");
    const partidos = [];
    for (let i = 1; i < filas.length; i++) {
        const c = filas[i].split(",");
        partidos.push({
            id: c[0], ronda: c[1], idLocal: c[2], equipoLocal: c[3],
            golesLocal: c[4], idVisita: c[5], equipoVisita: c[6],
            golesVisita: c[7], ganador: c[8], urlLocal: c[9],
            urlVisita: c[10], rankingLocal: c[11], rankingVisita: c[12],
            estado: c[13], fecha: c[14]
        });
    }
    const selector = document.getElementById("selector-ronda");
    selector.innerHTML = `
        <option value="Completa">Liguilla Completa</option>
        <option value="Cuartos">Cuartos</option>
        <option value="Semifinal">Semifinales</option>
        <option value="Final">Final</option>
    `;
    selector.addEventListener("change", () => {
        const valor = selector.value;
        let filtrados = valor === "Completa" ? partidos : partidos.filter(p => p.ronda.toLowerCase() === valor.toLowerCase());
        renderBracket(filtrados, valor);
    });
    renderBracket(partidos, "Completa");
}

// Colores solo borde neón por cuarto
const coloresCuartos = [
    { border:"#ffd700", glow:"rgba(255,215,0,0.7)"  },  // 1-8 oro
    { border:"#c0c0c0", glow:"rgba(192,192,192,0.7)"},  // 2-7 plata
    { border:"#b87333", glow:"rgba(184,115,51,0.7)" },  // 3-6 cobre
    { border:"#39ff14", glow:"rgba(57,255,20,0.7)"  },  // 4-5 verde neón
];
const colorSemi  = { border:"rgba(255,255,255,0.5)", glow:"rgba(255,255,255,0.2)" };
const colorFinal = { border:"#ff9800", glow:"rgba(255,152,0,0.6)" };

function esPorDefinir(val) {
    if (!val) return true;
    return val.trim().toLowerCase().replace(/p+or/, "por") === "por definir";
}

// Equipo: escudo libre + píldora solo en nombre
function crearEquipo(nombre, url, color) {
    const nom = esPorDefinir(nombre) ? "Por Definir" : nombre.trim();
    const logoHTML = (url && url.trim().startsWith("http"))
        ? `<img src="${url.trim()}" style="width:52px;height:52px;object-fit:contain;border-radius:50%;filter:drop-shadow(0 0 6px ${color.border});" onerror="this.style.display='none'">`
        : `<div style="width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:20px;">⚽</div>`;
    return `<div style="display:flex;align-items:center;gap:10px;margin:5px 0;">
        ${logoHTML}
        <div style="
            border:2px solid ${color.border};
            border-radius:25px;
            padding:7px 16px;
            box-shadow:0 0 10px ${color.glow};
            background:transparent;
            flex:1;min-width:0;
        ">
            <span style="color:#fff;font-weight:800;font-size:13px;letter-spacing:0.5px;
                text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;">
                ${nom}
            </span>
        </div>
    </div>`;
}

function crearMarcador(p) {
    const esJugado = (p.estado||"").trim().toLowerCase() === "jugado";
    return `<div style="text-align:center;padding:4px 0 4px 62px;font-weight:900;font-size:14px;
        color:${esJugado ? '#ffd700' : 'rgba(255,255,255,0.25)'};">
        ${esJugado ? `${p.golesLocal} - ${p.golesVisita}` : "VS"}
    </div>`;
}

function crearCardEquipos(p, color) {
    const card = document.createElement("div");
    card.style.cssText = `
        background:rgba(0,0,0,0.3);
        border:2px solid ${color.border};
        border-radius:14px;
        padding:12px 14px;
        box-shadow:0 0 16px ${color.glow};
        flex:1;
    `;
    card.innerHTML += crearEquipo(p.equipoLocal, p.urlLocal, color);
    card.innerHTML += crearMarcador(p);
    card.innerHTML += crearEquipo(p.equipoVisita, p.urlVisita, color);
    return card;
}

function crearCampeon(ganador) {
    const hay = !esPorDefinir(ganador);
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;">
        <div style="font-size:clamp(50px,8vw,80px);line-height:1;filter:drop-shadow(0 0 12px rgba(255,215,0,0.7));">🏆</div>
        <div style="
            color:${hay ? '#ffd700' : 'rgba(255,255,255,0.4)'};
            font-weight:900;
            font-size:${hay ? 'clamp(14px,2.5vw,20px)' : '13px'};
            letter-spacing:2px;
            text-transform:uppercase;
            text-shadow:0 0 10px rgba(255,215,0,0.5);
        ">${hay ? ganador.trim() : 'Por Definir'}</div>
        <div style="color:#fff;font-weight:900;font-size:clamp(16px,3vw,24px);letter-spacing:3px;">CAMPEÓN</div>
    </div>`;
}

function renderBracket(partidos, vista) {
    const contenedor = document.getElementById("contenedor-bracket");
    contenedor.innerHTML = "";
    const cuartos = partidos.filter(p => p.ronda.toLowerCase().trim() === "cuartos");
    const semi    = partidos.filter(p => p.ronda.toLowerCase().trim() === "semifinal");
    const finalP  = partidos.filter(p => p.ronda.toLowerCase().trim() === "final");

    if (vista === "Completa" || vista === "Cuartos") renderCompleta(contenedor, cuartos, semi, finalP, vista);
    else if (vista === "Semifinal") renderSemis(contenedor, semi);
    else if (vista === "Final") renderFinalView(contenedor, finalP);
}

function renderCompleta(contenedor, cuartos, semi, finalP, vista) {
    const scroll = document.createElement("div");
    scroll.style.cssText = "overflow-x:auto;padding:10px 0 20px;";

    const row = document.createElement("div");
    // align-items:stretch para que todo tenga la misma altura
    row.style.cssText = "display:flex;flex-direction:row;align-items:stretch;gap:0;min-width:760px;";

    // ---- CUARTOS ----
    const colQ = document.createElement("div");
    colQ.style.cssText = "display:flex;flex-direction:column;gap:10px;min-width:250px;padding:10px;";
    const titQ = document.createElement("div");
    titQ.style.cssText = "color:#ffd700;font-weight:900;font-size:11px;letter-spacing:3px;text-align:center;margin-bottom:6px;";
    titQ.textContent = "CUARTOS DE FINAL";
    colQ.appendChild(titQ);
    cuartos.forEach((p, i) => {
        colQ.appendChild(crearCardEquipos(p, coloresCuartos[i % 4]));
    });
    row.appendChild(colQ);

    if (vista === "Cuartos" || !semi.length) { scroll.appendChild(row); contenedor.appendChild(scroll); return; }

    // ---- CONECTOR Q→S ----
    // Necesitamos que semi[0] esté al nivel de cuartos[0]+cuartos[1] y semi[1] al nivel de cuartos[2]+cuartos[3]
    const connQS = document.createElement("div");
    connQS.style.cssText = "display:flex;flex-direction:column;justify-content:space-around;align-self:stretch;min-width:30px;padding:32px 0;";
    connQS.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-around;align-items:flex-end;">
            <div style="width:25px;height:2px;background:rgba(255,255,255,0.18);"></div>
            <div style="width:25px;height:2px;background:rgba(255,255,255,0.18);"></div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-around;align-items:flex-end;">
            <div style="width:25px;height:2px;background:rgba(255,255,255,0.18);"></div>
            <div style="width:25px;height:2px;background:rgba(255,255,255,0.18);"></div>
        </div>
    `;
    row.appendChild(connQS);

    // ---- SEMIS ----
    const colS = document.createElement("div");
    // justify-content:space-around centra cada semi entre sus dos cuartos
    colS.style.cssText = "display:flex;flex-direction:column;justify-content:space-around;gap:10px;min-width:230px;padding:10px;align-self:stretch;";
    const titS = document.createElement("div");
    titS.style.cssText = "color:#ffd700;font-weight:900;font-size:11px;letter-spacing:3px;text-align:center;margin-bottom:6px;font-style:italic;";
    titS.textContent = "SEMIFINALES";
    colS.appendChild(titS);
    semi.forEach((p, i) => {
        const card = crearCardEquipos(p, colorSemi);
        const tit = document.createElement("div");
        tit.style.cssText = "color:rgba(255,255,255,0.4);font-size:9px;letter-spacing:2px;text-align:center;margin-bottom:6px;font-weight:700;font-style:italic;";
        tit.textContent = `SEMIFINAL ${i+1}`;
        card.insertBefore(tit, card.firstChild);
        colS.appendChild(card);
    });
    row.appendChild(colS);

    if (!finalP.length) { scroll.appendChild(row); contenedor.appendChild(scroll); return; }

    // ---- CONECTOR S→F ----
    const connSF = document.createElement("div");
    connSF.style.cssText = "display:flex;flex-direction:column;justify-content:center;align-items:center;align-self:stretch;min-width:30px;";
    connSF.innerHTML = `
        <div style="flex:1;width:2px;background:rgba(255,152,0,0.35);"></div>
        <div style="width:25px;height:2px;background:rgba(255,152,0,0.35);"></div>
        <div style="flex:1;width:2px;background:rgba(255,152,0,0.35);"></div>
    `;
    row.appendChild(connSF);

    // ---- FINAL + CAMPEÓN (centrado verticalmente) ----
    const colF = document.createElement("div");
    colF.style.cssText = "display:flex;flex-direction:row;align-items:center;justify-content:center;min-width:280px;padding:10px;gap:20px;align-self:stretch;";

    const f = finalP[0];
    if (f) {
        // Tarjeta final a la izquierda
        const wrapFinal = document.createElement("div");
        wrapFinal.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:8px;";
        const titF = document.createElement("div");
        titF.style.cssText = "color:#fff;font-weight:900;font-size:clamp(13px,2vw,18px);letter-spacing:4px;font-style:italic;text-align:center;";
        titF.textContent = "FINAL";
        wrapFinal.appendChild(titF);
        wrapFinal.appendChild(crearCardEquipos(f, colorFinal));
        colF.appendChild(wrapFinal);

        // Copa + campeón a la derecha, centrado
        const wrapCampeon = document.createElement("div");
        wrapCampeon.style.cssText = "display:flex;align-items:center;";
        // Línea conectora
        wrapCampeon.innerHTML = `<div style="width:20px;height:2px;background:rgba(255,152,0,0.5);"></div>`;
        const divCampeon = document.createElement("div");
        divCampeon.innerHTML = crearCampeon(f.ganador);
        wrapCampeon.appendChild(divCampeon);
        colF.appendChild(wrapCampeon);
    }
    row.appendChild(colF);
    scroll.appendChild(row);
    contenedor.appendChild(scroll);
}

function renderSemis(contenedor, semi) {
    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;flex-direction:column;gap:20px;padding:20px;max-width:440px;margin:0 auto;";
    const tit = document.createElement("div");
    tit.style.cssText = "color:#ffd700;font-weight:900;font-size:16px;letter-spacing:3px;text-align:center;font-style:italic;";
    tit.textContent = "SEMIFINALES";
    wrap.appendChild(tit);
    semi.forEach((p, i) => {
        const card = crearCardEquipos(p, colorSemi);
        const stit = document.createElement("div");
        stit.style.cssText = "color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:2px;text-align:center;margin-bottom:8px;font-weight:700;font-style:italic;";
        stit.textContent = `SEMIFINAL ${i+1}`;
        card.insertBefore(stit, card.firstChild);
        wrap.appendChild(card);
    });
    contenedor.appendChild(wrap);
}

function renderFinalView(contenedor, finalP) {
    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:14px;padding:20px;max-width:500px;margin:0 auto;";
    wrap.innerHTML = `<div style="text-align:center;margin-bottom:4px;">
        <div style="color:#fff;font-weight:900;font-size:clamp(20px,5vw,34px);letter-spacing:4px;font-style:italic;line-height:1;">NEXT LEVEL 7</div>
        <div style="color:#ff9800;font-weight:900;font-size:clamp(12px,3vw,18px);letter-spacing:2px;font-style:italic;">CAMPEÓN TORNEO DOMINICAL</div>
    </div>`;
    if (finalP[0]) {
        const f = finalP[0];
        const row = document.createElement("div");
        row.style.cssText = "display:flex;flex-direction:row;align-items:center;gap:20px;flex-wrap:wrap;justify-content:center;";
        const card = crearCardEquipos(f, colorFinal);
        const stit = document.createElement("div");
        stit.style.cssText = "color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:2px;text-align:center;margin-bottom:8px;font-weight:700;font-style:italic;";
        stit.textContent = "FINAL";
        card.insertBefore(stit, card.firstChild);
        row.appendChild(card);
        row.innerHTML += `<div style="width:2px;height:60px;background:rgba(255,152,0,0.5);"></div>`;
        const divC = document.createElement("div");
        divC.innerHTML = crearCampeon(f.ganador);
        row.appendChild(divC);
        wrap.appendChild(row);
    }
    contenedor.appendChild(wrap);
}

cargarLiguilla();
