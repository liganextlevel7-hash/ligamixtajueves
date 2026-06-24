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
    selector.addEventListener("change", () => renderBracket(partidos, selector.value));
    renderBracket(partidos, "Completa");
}

const coloresCuartos = [
    { border:"#ffd700", glow:"rgba(255,215,0,0.7)"   },
    { border:"#c0c0c0", glow:"rgba(192,192,192,0.7)" },
    { border:"#b87333", glow:"rgba(184,115,51,0.7)"  },
    { border:"#39ff14", glow:"rgba(57,255,20,0.7)"   },
];
const colorSemi  = { border:"rgba(255,255,255,0.5)", glow:"rgba(255,255,255,0.2)" };
const colorFinal = { border:"#ff9800", glow:"rgba(255,152,0,0.6)" };

function esPD(val) {
    if (!val) return true;
    return val.trim().toLowerCase().replace(/p+or/,"por") === "por definir";
}

function crearEquipo(nombre, url, color) {
    const nom = esPD(nombre) ? "Por Definir" : nombre.trim();
    const logo = (url && url.trim().startsWith("http"))
        ? `<img src="${url.trim()}" style="width:52px;height:52px;object-fit:contain;border-radius:50%;flex-shrink:0;filter:drop-shadow(0 0 6px ${color.border});" onerror="this.style.display='none'">`
        : `<div style="width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">⚽</div>`;
    return `<div style="display:flex;align-items:center;gap:10px;margin:5px 0;">
        ${logo}
        <div style="border:2px solid ${color.border};border-radius:25px;padding:7px 16px;
            box-shadow:0 0 10px ${color.glow};background:transparent;flex:1;min-width:0;">
            <span style="color:#fff;font-weight:800;font-size:13px;letter-spacing:0.5px;
                text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;">
                ${nom}</span>
        </div>
    </div>`;
}

function crearVS(p) {
    const esJ = (p.estado||"").trim().toLowerCase() === "jugado";
    const gl = (p.golesLocal||"0").trim();
    const gv = (p.golesVisita||"0").trim();
    return `<div style="text-align:center;padding:4px 0 4px 62px;font-weight:900;font-size:14px;
        color:${esJ ? '#ffd700' : 'rgba(255,255,255,0.25)'};">
        ${esJ ? `${gl} - ${gv}` : "VS"}</div>`;
}

function crearCard(p, color, subtitulo) {
    const card = document.createElement("div");
    card.style.cssText = `background:rgba(0,0,0,0.3);border:2px solid ${color.border};
        border-radius:14px;padding:12px 14px;box-shadow:0 0 16px ${color.glow};`;
    if (subtitulo) {
        const s = document.createElement("div");
        s.style.cssText = "color:rgba(255,255,255,0.4);font-size:9px;letter-spacing:2px;text-align:center;margin-bottom:6px;font-weight:700;font-style:italic;";
        s.textContent = subtitulo;
        card.appendChild(s);
    }
    card.innerHTML += crearEquipo(p.equipoLocal, p.urlLocal, color);
    card.innerHTML += crearVS(p);
    card.innerHTML += crearEquipo(p.equipoVisita, p.urlVisita, color);
    return card;
}

function crearCopa(ganador) {
    const hay = !esPD(ganador);
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;min-width:160px;">
        <div style="font-size:clamp(70px,10vw,120px);line-height:1;filter:drop-shadow(0 0 20px rgba(255,215,0,0.9));">🏆</div>
        ${hay
            ? `<div style="display:flex;align-items:center;gap:8px;justify-content:center;">
                <div style="width:40px;height:40px;border-radius:50%;border:2px solid #ffd700;overflow:hidden;flex-shrink:0;box-shadow:0 0 8px rgba(255,215,0,0.6);">
                </div>
               </div>
               <div style="color:#ffd700;font-weight:900;font-size:clamp(13px,2vw,17px);letter-spacing:2px;text-transform:uppercase;text-shadow:0 0 10px rgba(255,215,0,0.6);">${ganador.trim()}</div>`
            : `<div style="color:rgba(255,255,255,0.35);font-weight:700;font-size:12px;letter-spacing:2px;">Por Definir</div>`
        }
        <div style="color:#fff;font-weight:900;font-size:clamp(20px,3.5vw,30px);letter-spacing:3px;text-shadow:0 0 10px rgba(255,255,255,0.3);">CAMPEÓN</div>
    </div>`;
}

function renderBracket(partidos, vista) {
    const contenedor = document.getElementById("contenedor-bracket");
    contenedor.innerHTML = "";

    const cuartos = partidos.filter(p => p.ronda.toLowerCase().trim() === "cuartos");
    const semi    = partidos.filter(p => p.ronda.toLowerCase().trim() === "semifinal");
    const finalP  = partidos.filter(p => p.ronda.toLowerCase().trim() === "final");

    // Opacidades según vista
    const opQ = (vista === "Semifinal" || vista === "Final") ? 0.15 : 1;
    const opS = (vista === "Final") ? 0.15 : 1;
    const opF = 1;

    // Usamos SVG para las líneas conectoras — control total
    // Layout con posicionamiento absoluto dentro de un contenedor relativo

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "overflow-x:auto;padding:10px 0 30px;";

    // Contenedor con grid de 4 columnas: cuartos | conn | semis | conn | final+copa
    const grid = document.createElement("div");
    grid.style.cssText = `
        display:grid;
        grid-template-columns:260px 40px 240px 40px 1fr;
        align-items:stretch;
        min-width:760px;
        gap:0;
    `;

    // ===== CUARTOS =====
    const colQ = document.createElement("div");
    colQ.style.cssText = `display:flex;flex-direction:column;gap:10px;padding:10px;opacity:${opQ};transition:opacity 0.4s;`;
    const titQ = document.createElement("div");
    titQ.style.cssText = "color:#ffd700;font-weight:900;font-size:11px;letter-spacing:3px;text-align:center;margin-bottom:6px;";
    titQ.textContent = "CUARTOS DE FINAL";
    colQ.appendChild(titQ);
    cuartos.forEach((p, i) => colQ.appendChild(crearCard(p, coloresCuartos[i%4])));

    // ===== CONECTOR Q→S con SVG =====
    // El SVG dibuja 2 brackets: uno para Q0+Q1→S1, otro para Q2+Q3→S2
    const connQS = document.createElement("div");
    connQS.style.cssText = `position:relative;opacity:${opQ};transition:opacity 0.4s;`;
    connQS.innerHTML = `<svg width="40" height="100%" style="position:absolute;top:0;left:0;width:100%;height:100%;" preserveAspectRatio="none">
        <!-- Línea superior par 1: de 25% hacia el centro -->
        <line x1="0" y1="25%" x2="20" y2="25%" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        <!-- Línea vertical par 1 -->
        <line x1="20" y1="25%" x2="20" y2="50%" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        <!-- Línea inferior par 1 -->
        <line x1="0" y1="50%" x2="20" y2="50%" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        <!-- Horizontal hacia semi 1 -->
        <line x1="20" y1="37.5%" x2="40" y2="37.5%" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>

        <!-- Línea superior par 2 -->
        <line x1="0" y1="75%" x2="20" y2="75%" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        <!-- Línea vertical par 2 -->
        <line x1="20" y1="75%" x2="20" y2="100%" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        <!-- Línea inferior par 2 -->
        <line x1="0" y1="100%" x2="20" y2="100%" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        <!-- Horizontal hacia semi 2 -->
        <line x1="20" y1="87.5%" x2="40" y2="87.5%" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    </svg>`;

    // ===== SEMIS =====
    const colS = document.createElement("div");
    colS.style.cssText = `display:flex;flex-direction:column;padding:10px;opacity:${opS};transition:opacity 0.4s;`;
    const titS = document.createElement("div");
    titS.style.cssText = "color:#ffd700;font-weight:900;font-size:11px;letter-spacing:3px;text-align:center;margin-bottom:6px;font-style:italic;";
    titS.textContent = "SEMIFINALES";
    colS.appendChild(titS);

    // Semi 1 en el primer cuarto del espacio (centrado entre Q0 y Q1)
    const wrapS1 = document.createElement("div");
    wrapS1.style.cssText = "flex:1;display:flex;align-items:center;justify-content:center;padding:5px 0;";
    if (semi[0]) wrapS1.appendChild(crearCard(semi[0], colorSemi, "SEMIFINAL 1"));
    colS.appendChild(wrapS1);

    // Espacio entre semis
    const spacer = document.createElement("div");
    spacer.style.cssText = "flex:1;";
    colS.appendChild(spacer);

    // Semi 2 en el segundo cuarto
    const wrapS2 = document.createElement("div");
    wrapS2.style.cssText = "flex:1;display:flex;align-items:center;justify-content:center;padding:5px 0;";
    if (semi[1]) wrapS2.appendChild(crearCard(semi[1], colorSemi, "SEMIFINAL 2"));
    colS.appendChild(wrapS2);

    // ===== CONECTOR S→F con SVG =====
    const connSF = document.createElement("div");
    connSF.style.cssText = `position:relative;opacity:${opS};transition:opacity 0.4s;`;
    connSF.innerHTML = `<svg width="40" height="100%" style="position:absolute;top:0;left:0;width:100%;height:100%;" preserveAspectRatio="none">
        <!-- Línea desde semi 1 -->
        <line x1="0" y1="30%" x2="20" y2="30%" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>
        <!-- Línea vertical uniendo semis -->
        <line x1="20" y1="30%" x2="20" y2="70%" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>
        <!-- Línea desde semi 2 -->
        <line x1="0" y1="70%" x2="20" y2="70%" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>
        <!-- Horizontal hacia final -->
        <line x1="20" y1="50%" x2="40" y2="50%" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>
    </svg>`;

    // ===== FINAL + COPA =====
    const colF = document.createElement("div");
    colF.style.cssText = `display:flex;flex-direction:row;align-items:center;justify-content:center;padding:10px;gap:20px;opacity:${opF};transition:opacity 0.4s;`;

    const f = finalP[0];
    if (f) {
        const wFinal = document.createElement("div");
        wFinal.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:8px;";
        const titF = document.createElement("div");
        titF.style.cssText = "color:#fff;font-weight:900;font-size:clamp(13px,2vw,18px);letter-spacing:4px;font-style:italic;text-align:center;";
        titF.textContent = "FINAL";
        wFinal.appendChild(titF);
        wFinal.appendChild(crearCard(f, colorFinal));
        colF.appendChild(wFinal);

        colF.innerHTML += `<div style="width:20px;height:2px;background:rgba(255,152,0,0.5);flex-shrink:0;"></div>`;

        const wCopa = document.createElement("div");
        wCopa.innerHTML = crearCopa(f.ganador);
        colF.appendChild(wCopa);
    }

    // Ensamblar grid
    grid.appendChild(colQ);
    grid.appendChild(connQS);
    grid.appendChild(colS);
    grid.appendChild(connSF);
    grid.appendChild(colF);

    wrapper.appendChild(grid);
    contenedor.appendChild(wrapper);
}

cargarLiguilla();
