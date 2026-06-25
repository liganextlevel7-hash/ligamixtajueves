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
        ? `<img src="${url.trim()}" style="width:48px;height:48px;object-fit:contain;border-radius:50%;flex-shrink:0;filter:drop-shadow(0 0 6px ${color.border});" onerror="this.style.display='none'">`
        : `<div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">⚽</div>`;
    return `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
        ${logo}
        <div style="border:2px solid ${color.border};border-radius:25px;padding:6px 14px;
            box-shadow:0 0 10px ${color.glow};background:transparent;flex:1;">
            <span style="color:#fff;font-weight:800;font-size:12px;letter-spacing:0.5px;
                text-transform:uppercase;white-space:nowrap;display:block;">
                ${nom}</span>
        </div>
    </div>`;
}

function crearVS(p) {
    const esJ = (p.estado||"").trim().toLowerCase() === "jugado";
    const gl = (p.golesLocal||"0").trim();
    const gv = (p.golesVisita||"0").trim();
    return `<div style="text-align:center;padding:3px 0 3px 56px;font-weight:900;font-size:13px;
        color:${esJ ? '#ffd700' : 'rgba(255,255,255,0.25)'};">
        ${esJ ? `${gl} - ${gv}` : "VS"}</div>`;
}

function crearCard(p, color, subtitulo) {
    const card = document.createElement("div");
    card.style.cssText = `background:rgba(0,0,0,0.3);border:2px solid ${color.border};
        border-radius:14px;padding:10px 12px;box-shadow:0 0 16px ${color.glow};width:100%;box-sizing:border-box;`;
    if (subtitulo) {
        const s = document.createElement("div");
        s.style.cssText = "color:rgba(255,255,255,0.4);font-size:9px;letter-spacing:2px;text-align:center;margin-bottom:5px;font-weight:700;font-style:italic;";
        s.textContent = subtitulo;
        card.appendChild(s);
    }
    card.innerHTML += crearEquipo(p.equipoLocal, p.urlLocal, color);
    card.innerHTML += crearVS(p);
    card.innerHTML += crearEquipo(p.equipoVisita, p.urlVisita, color);
    return card;
}

function crearCopa(ganador, urlGanador) {
    const hay = !esPD(ganador);
    const logo = (hay && urlGanador && urlGanador.trim().startsWith("http"))
        ? `<img src="${urlGanador.trim()}" style="width:54px;height:54px;object-fit:contain;border-radius:50%;border:2px solid #ffd700;box-shadow:0 0 12px rgba(255,215,0,0.8);" onerror="this.style.display='none'">`
        : `<div style="width:54px;height:54px;border-radius:50%;background:rgba(255,255,255,0.1);border:2px dashed rgba(255,215,0,0.4);display:flex;align-items:center;justify-content:center;font-size:22px;">⚽</div>`;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;">
        <div style="font-size:90px;line-height:1;filter:drop-shadow(0 0 22px rgba(255,215,0,0.9));">🏆</div>
        ${logo}
        <div style="color:${hay ? '#ffd700' : 'rgba(255,255,255,0.35)'};font-weight:900;
            font-size:14px;letter-spacing:2px;text-transform:uppercase;
            text-shadow:0 0 10px rgba(255,215,0,0.6);margin-top:2px;">
            ${hay ? ganador.trim() : 'Por Definir'}</div>
        <div style="color:#fff;font-weight:900;font-size:26px;letter-spacing:3px;
            text-shadow:0 0 10px rgba(255,255,255,0.3);">CAMPEÓN</div>
    </div>`;
}

function renderBracket(partidos, vista) {
    const contenedor = document.getElementById("contenedor-bracket");
    contenedor.innerHTML = "";

    const cuartos = partidos.filter(p => p.ronda.toLowerCase().trim() === "cuartos");
    const semi    = partidos.filter(p => p.ronda.toLowerCase().trim() === "semifinal");
    const finalP  = partidos.filter(p => p.ronda.toLowerCase().trim() === "final");

    const opQ = (vista === "Semifinal" || vista === "Final") ? 0.15 : 1;
    const opS = (vista === "Final") ? 0.15 : 1;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "overflow-x:auto;padding:10px 0 30px;";

    // Layout principal con posición absoluta para controlar centrado exacto
    // Usamos un contenedor con altura fija para poder posicionar todo
    const outer = document.createElement("div");
    outer.style.cssText = "position:relative;min-width:900px;min-height:600px;";

    // Cada card de cuartos tiene aprox 160px de alto
    // Con gap de 10px entre cards y padding de 8px top
    // Total colQ height: 8(pad) + 22(tit) + 4(mb) + 4*(160+10) = 34 + 680 = ~714px
    // Pero usamos flexbox con position:absolute para las semis

    // ===== CUARTOS (posición absoluta izquierda) =====
    const colQ = document.createElement("div");
    colQ.style.cssText = `position:absolute;left:0;top:0;width:270px;display:flex;flex-direction:column;gap:10px;padding:8px;opacity:${opQ};transition:opacity 0.4s;`;
    const titQ = document.createElement("div");
    titQ.style.cssText = "color:#ffd700;font-weight:900;font-size:11px;letter-spacing:3px;text-align:center;margin-bottom:4px;";
    titQ.textContent = "CUARTOS DE FINAL";
    colQ.appendChild(titQ);
    cuartos.forEach((p, i) => colQ.appendChild(crearCard(p, coloresCuartos[i%4])));
    outer.appendChild(colQ);

    // Para calcular posición de semis necesitamos saber la altura de las cards
    // Usamos requestAnimationFrame para obtener medidas reales después del render
    wrapper.appendChild(outer);
    contenedor.appendChild(wrapper);

    // Posicionamos después del render
    requestAnimationFrame(() => {
        const cards = colQ.querySelectorAll("div[style*='border-radius:14px']");
        if (cards.length < 4) return;

        const colQRect = colQ.getBoundingClientRect();
        const c0 = cards[0].getBoundingClientRect();
        const c1 = cards[1].getBoundingClientRect();
        const c2 = cards[2].getBoundingClientRect();
        const c3 = cards[3].getBoundingClientRect();

        // Centro entre card0 y card1 (relativo a colQ)
        const midS1 = ((c0.top + c0.bottom)/2 + (c1.top + c1.bottom)/2) / 2 - colQRect.top;
        // Centro entre card2 y card3
        const midS2 = ((c2.top + c2.bottom)/2 + (c3.top + c3.bottom)/2) / 2 - colQRect.top;
        // Centro entre Semi1 y Semi2 (para Final)
        const midF = (midS1 + midS2) / 2;

        const totalH = Math.max(c3.bottom - colQRect.top + 20, 600);
        outer.style.minHeight = totalH + "px";

        const leftS = 278; // después de cuartos + conector
        const leftF = 278 + 260 + 36; // después de semis + conector
        const leftCopa = leftF + 260 + 20; // después de final

        // ===== TÍTULO SEMIS =====
        const titS = document.createElement("div");
        titS.style.cssText = `position:absolute;left:${leftS}px;top:8px;width:255px;color:#ffd700;font-weight:900;font-size:11px;letter-spacing:3px;text-align:center;font-style:italic;opacity:${opS};transition:opacity 0.4s;`;
        titS.textContent = "SEMIFINALES";
        outer.appendChild(titS);

        // ===== SEMI 1 =====
        if (semi[0]) {
            const cardS1 = crearCard(semi[0], colorSemi, "SEMIFINAL 1");
            const s1H = 160; // altura estimada
            cardS1.style.cssText += `position:absolute;left:${leftS}px;top:${midS1 - s1H/2}px;width:255px;opacity:${opS};transition:opacity 0.4s;`;
            outer.appendChild(cardS1);
        }

        // ===== SEMI 2 =====
        if (semi[1]) {
            const cardS2 = crearCard(semi[1], colorSemi, "SEMIFINAL 2");
            const s2H = 160;
            cardS2.style.cssText += `position:absolute;left:${leftS}px;top:${midS2 - s2H/2}px;width:255px;opacity:${opS};transition:opacity 0.4s;`;
            outer.appendChild(cardS2);
        }

        // ===== LÍNEAS CONECTOR Q→S (SVG) =====
        const svgQS = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svgQS.style.cssText = `position:absolute;left:270px;top:0;width:36px;height:${totalH}px;opacity:${opQ};transition:opacity 0.4s;overflow:visible;`;
        svgQS.setAttribute("xmlns","http://www.w3.org/2000/svg");

        const midC0 = (c0.top + c0.bottom)/2 - colQRect.top;
        const midC1 = (c1.top + c1.bottom)/2 - colQRect.top;
        const midC2 = (c2.top + c2.bottom)/2 - colQRect.top;
        const midC3 = (c3.top + c3.bottom)/2 - colQRect.top;

        const linesQS = [
            // Par superior → semi1
            `<line x1="0" y1="${midC0}" x2="20" y2="${midC0}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
            `<line x1="20" y1="${midC0}" x2="20" y2="${midS1}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
            `<line x1="0" y1="${midC1}" x2="20" y2="${midC1}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
            `<line x1="20" y1="${midC1}" x2="20" y2="${midS1}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
            `<line x1="20" y1="${midS1}" x2="36" y2="${midS1}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
            // Par inferior → semi2
            `<line x1="0" y1="${midC2}" x2="20" y2="${midC2}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
            `<line x1="20" y1="${midC2}" x2="20" y2="${midS2}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
            `<line x1="0" y1="${midC3}" x2="20" y2="${midC3}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
            `<line x1="20" y1="${midC3}" x2="20" y2="${midS2}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
            `<line x1="20" y1="${midS2}" x2="36" y2="${midS2}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
        ];
        svgQS.innerHTML = linesQS.join("");
        outer.appendChild(svgQS);

        // ===== LÍNEAS CONECTOR S→F (SVG) =====
        const svgSF = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svgSF.style.cssText = `position:absolute;left:${leftS+255}px;top:0;width:36px;height:${totalH}px;opacity:${opS};transition:opacity 0.4s;overflow:visible;`;

        const linesSF = [
            `<line x1="0" y1="${midS1}" x2="20" y2="${midS1}" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>`,
            `<line x1="20" y1="${midS1}" x2="20" y2="${midF}" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>`,
            `<line x1="0" y1="${midS2}" x2="20" y2="${midS2}" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>`,
            `<line x1="20" y1="${midS2}" x2="20" y2="${midF}" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>`,
            `<line x1="20" y1="${midF}" x2="36" y2="${midF}" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>`,
        ];
        svgSF.innerHTML = linesSF.join("");
        outer.appendChild(svgSF);

        // ===== FINAL =====
        const titF = document.createElement("div");
        titF.style.cssText = `position:absolute;left:${leftF}px;top:${midF - 110}px;width:255px;color:#fff;font-weight:900;font-size:18px;letter-spacing:4px;font-style:italic;text-align:center;`;
        titF.textContent = "FINAL";
        outer.appendChild(titF);

        if (finalP[0]) {
            const f = finalP[0];
            const cardF = crearCard(f, colorFinal);
            const fH = 160;
            cardF.style.cssText += `position:absolute;left:${leftF}px;top:${midF - fH/2}px;width:255px;`;
            outer.appendChild(cardF);

            // Línea final → copa
            const svgFC = document.createElementNS("http://www.w3.org/2000/svg","svg");
            svgFC.style.cssText = `position:absolute;left:${leftF+255}px;top:0;width:20px;height:${totalH}px;overflow:visible;`;
            svgFC.innerHTML = `<line x1="0" y1="${midF}" x2="20" y2="${midF}" stroke="rgba(255,152,0,0.5)" stroke-width="2"/>`;
            outer.appendChild(svgFC);

            // Copa centrada verticalmente
            const urlGanador = !esPD(f.ganador) ? (f.urlLocal||"") : "";
            const copaDiv = document.createElement("div");
            copaDiv.style.cssText = `position:absolute;left:${leftCopa}px;top:0;height:${totalH}px;display:flex;align-items:center;justify-content:center;padding:10px;`;
            copaDiv.innerHTML = crearCopa(f.ganador, urlGanador);
            outer.appendChild(copaDiv);
        }

        outer.style.minWidth = (leftCopa + 200) + "px";
    });
}

cargarLiguilla();
