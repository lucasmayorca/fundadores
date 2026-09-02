/* Career mode interface. Strict ES5 for Safari 9.
   A single delegated click handler. Motor/Carrera/Mundo never touch the DOM. */
(function () {
  'use strict';

  var CLAVE = 'fundadores.carrera.v2';
  var C = null;        /* career */
  var M = null;        /* world */
  var J = null;        /* current job */
  var R = Logros.cargar();
  var plan = null, evActual = null, notasEvento = [], ofertaSel = -1;
  var hudPrev = {};
  var rankingVolver = 'p-inicio';

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function mil(n) {
    n = Math.round(n);
    var neg = n < 0; n = Math.abs(n);
    var s = String(n), out = '', c = 0, i;
    for (i = s.length - 1; i >= 0; i--) { out = s.charAt(i) + out; if (++c % 3 === 0 && i > 0) out = ',' + out; }
    return (neg ? '-' : '') + out;
  }
  function money(n) {
    if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (Math.abs(n) >= 10000) return '$' + Math.round(n / 1000) + 'k';
    return '$' + mil(n);
  }
  function pct(x) { return Math.round(x * 100) + '%'; }
  function ir(id) {
    var ps = document.getElementsByClassName('pantalla'), i;
    for (i = 0; i < ps.length; i++) ps[i].className = 'pantalla' + (ps[i].id === id ? ' on' : '');
  }
  function ov(id, on) { $(id).className = 'ov' + (on ? ' on' : ''); }
  var escalaActual = 1;

  /* ================= GUIDED FIRST MONTH =================
     Not a lecture — a spotlight. The screen dims except the active zone,
     the coach tells you what to DO, and action steps advance themselves. */
  var TOUR = [
    { el:'hud', texto:'This is the company\'s pulse. <b>Retention</b> is the number that decides everything: of 100 users this month, how many are still here next month.', accion:null },
    { el:'mandato', texto:'You were hired to do <b>one thing</b> — this bar is your job. <b>Political capital</b> is your oxygen: it drains when you work off-mandate. At zero, you\'re out.', accion:null },
    { el:'capa', texto:'Your team produces <b>points</b> every month. Points you place on stations produce evidence, less debt, reliability or reach. <b>Whatever you don\'t station goes on projects below.</b>', accion:'estacion',
      textoAccion:'Try it: tap <b>+</b> on a station.' },
    { el:'backlog', texto:'The core of the job: <b>tap a project</b> to place your remaining points on it. Read the cards first — <b>prob</b> (how much to trust the estimate), <b>impact</b> (payoff if true), <b>size</b> (S ~3 days... XL ~a month).', accion:'proyecto',
      textoAccion:'Tap a project to add it.' },
    { el:'backlog', texto:'Green is built, <b>amber is this month\'s push</b>. When a project says SHIPS THIS MONTH, it delivers now — and grants the company a permanent capability.', accion:null },
    { el:'panel', texto:'The company\'s vitals. <b>Evidence</b> feeds every estimate you see. <b>Debt</b> eats capacity monthly. <b>Morale</b> multiplies everything. More panels unlock as you climb.', accion:null },
    { el:'barra', texto:'That\'s the whole loop: place points, pick bets, close the month. The game won\'t stop your mistakes — <b>it bills them</b>, then tells you which book had it written down.', accion:'cerrar',
      textoAccion:'Close your first month.' }
  ];
  var tourPaso = -1;

  function tourActivo() { return tourPaso >= 0 && tourPaso < TOUR.length; }

  function tourEmpezar() {
    var visto = false;
    try { visto = !!localStorage.getItem('fundadores.tour'); } catch (e) {}
    if (visto) return;
    tourPaso = 0;
    tourRender();
  }

  function tourFin(guardar2) {
    tourPaso = -1;
    $('spot').className = '';
    $('coach').className = '';
    if (guardar2 !== false) { try { localStorage.setItem('fundadores.tour', '1'); } catch (e) {} }
  }

  function tourRender() {
    if (!tourActivo()) return;
    var paso = TOUR[tourPaso];
    var el = $(paso.el), st = $('stage');
    if (!el || !st) return;
    var er = el.getBoundingClientRect(), sr = st.getBoundingClientRect();
    var esc2 = escalaActual || 1;
    var x = (er.left - sr.left) / esc2, y = (er.top - sr.top) / esc2;
    var w = er.width / esc2, h2 = er.height / esc2;

    var spot = $('spot');
    spot.className = 'on';
    spot.style.left = (x - 6) + 'px';
    spot.style.top = (y - 6) + 'px';
    spot.style.width = (w + 12) + 'px';
    spot.style.height = (h2 + 12) + 'px';

    var abajo = y + h2 + 150 < 768;
    var coach = $('coach');
    coach.className = 'on';
    coach.style.left = Math.max(16, Math.min(1024 - 436, x + w / 2 - 210)) + 'px';
    if (abajo) { coach.style.top = Math.min(768 - 190, y + h2 + 14) + 'px'; coach.style.bottom = 'auto'; }
    else { coach.style.top = Math.max(10, y - 200) + 'px'; coach.style.bottom = 'auto'; }
    coach.innerHTML = '<div class="cpaso">' + (tourPaso + 1) + ' / ' + TOUR.length + '</div>' +
      '<div class="ctx">' + paso.texto + '</div>' +
      (paso.accion ? '<div class="chace">' + paso.textoAccion + '</div>' :
        '<div style="margin-top:10px"><span class="btn chico pri" data-act="tour-sigo">Got it</span></div>') +
      '<div class="csalir" data-act="tour-salir">skip the tour</div>';
  }

  /* action steps advance when the player actually does the thing */
  function tourEvento(tipo) {
    if (!tourActivo()) return;
    var paso = TOUR[tourPaso];
    if (paso.accion !== tipo) return;
    tourPaso++;
    if (tourPaso >= TOUR.length) tourFin();
    else tourRender();
  }

  /* an Analyst has no stations yet: step 3 becomes informational */
  function tourAjustarRol() {
    if (!J) return;
    var alguna = false, i;
    for (i = 0; i < ESTACIONES.length; i++) if (J.palancas.indexOf(ESTACIONES[i].req) >= 0) alguna = true;
    if (!alguna) {
      TOUR[2].accion = null;
      TOUR[2].texto = 'Stations produce evidence, less debt, reliability or reach — <b>they unlock as you get promoted</b>. For now, your whole month goes on projects.';
    }
  }

  /* touch tooltips: tap a dotted label, get a one-line explainer */
  var TIPS = {
    ret:'Of every 100 users you have this month, how many are still around next month. The single most honest number in the game.',
    runway:'Months of cash left at the current burn rate. Under 4 and everything else stops mattering.',
    mrr:'Monthly recurring revenue. What customers actually pay, every month.',
    pol:'Your credit with the organization. Spending your points off-mandate drains it - even when you are right. At zero, you are out.',
    heat:'Regulator attention. Dirty shortcuts raise it. From 40: surprise inspections and fines. At 85: they show up with a warrant.',
    compro:'Project slots: how many builds this company can keep open at once. Ship one to free its slot.',
    prob:'How much to trust the estimate. Fills up as you talk to users; drops in hard-to-estimate companies.',
    impact:'How much this moves things if the estimate is right. Bets marked with the stage arrow hit x1.3.',
    evid:'How much you actually know about your users. It shapes every estimate you see - and it decays every month.',
    debt:'Technical debt. Charges interest: eats a share of your team\'s capacity every single month.',
    morale:'How the team is doing. Low morale quietly shrinks everything you try.',
    fit:'How well you solve what this group needs. The bar IS the fit; conversion and retention follow it.',
    load:'Users versus what the architecture can carry. Past ~85% the crash odds grow non-linearly.',
    ebudget:'Error budget for the quarter. Incidents drain it; at zero the next month is a feature freeze.',
    focus:'How aligned the org is on few things. Drifts down on its own; leadership choices push it up.',
    usab:'How little users need to think. Multiplies the conversion of ALL traffic you bring.',
    esf:'Size is time, for your team, this month: XS ~a day, S ~3 days, M ~a week, L ~2 weeks, XL ~the whole month.',
    vec:'Expected impact per product metric (ACQ acquisition, ACT activation, RET retention, REV revenue, REL reliability). Negative chips are real side effects. The glowing chip is YOUR mandate\'s metric. Estimates sharpen with evidence.',
    funnel:'The pirate funnel (AARRR): acquisition brings them, activation converts them, retention keeps them, revenue charges them, referral multiplies them. Profit = revenue minus burn.',
    capfondeo:'Company capabilities compound from funded initiatives: they need raised capital behind them to grow, and quietly erode without it. Each one has a matching skill on your profile that accelerates its growth.',
    cap_prod:'The company\'s own product/discovery muscle. Compounds discovery gains beyond what you do this month. Your Product skill accelerates it.',
    cap_tec:'Engineering maturity that compounds over time: it slows debt growth and speeds up paydown. Your Tech skill accelerates it.',
    cap_gtm:'How efficiently the org turns growth spend into reach, beyond this month\'s push. Your Business skill accelerates it.',
    cap_gente:'How much team the org can carry before cognitive load and politics bite. Your Leadership skill accelerates it.',
    cap_cap:'Fundraising savvy: it only grows when you close a round, and better terms follow on the next one.'
  };
  var tipTimer = null;
  function mostrarTip(clave) {
    var t = TIPS[clave];
    if (!t) return;
    var el = $('tipbar');
    el.innerHTML = '<div class="tipt">What is this?</div>' + esc(t);
    el.className = 'on';
    if (tipTimer) clearTimeout(tipTimer);
    tipTimer = setTimeout(function () { el.className = ''; }, 5000);
  }
  function tip(clave, txt) {
    return '<span class="tipped" data-tip="' + clave + '">' + txt + '</span>';
  }

  function chip(libroId) {
    var l = libroPorId(libroId);
    if (!l) return '';
    return '<span class="pill libro" data-lib="' + libroId + '">' + esc(l.titulo) + '</span>';
  }
  function color(v, bueno, malo) { return v >= bueno ? 'verde' : v <= malo ? 'rojo' : 'ambar'; }
  function marcarCodex(log) {
    for (var i = 0; i < log.length; i++) if (log[i].libro) C.codex[log[i].libro] = true;
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify({ c:C, m:M, j:J })); } catch (e) {}
  }
  function cargar() {
    try {
      var s = localStorage.getItem(CLAVE);
      if (!s) return false;
      var o = JSON.parse(s);
      C = o.c; M = o.m; J = o.j;
      if (J) Motor.capacidad(J); /* migrates older saves: seeds J.capacidades/capFondeo if missing */
      return !!(C && M);
    } catch (e) { return false; }
  }

  /* ================= START ================= */

  /* Optional personalized start: paste a LinkedIn URL and/or your title.
     The URL gives us your name (the /in/ slug); the title text maps to a
     rung on the product ladder. Every product position we know lands
     somewhere on the 0-7 scale. Starting from zero is always an option. */
  var TITULOS = [
    { re:/(co-?founder|founder|ceo|chief executive)/i, n:7, rol:'Founder' },
    { re:/(cpo|chief product)/i, n:6, rol:'CPO' },
    { re:/(vp|vice ?president).*(product)|product.*(vp|vice ?president)/i, n:5, rol:'VP of Product' },
    { re:/(head of product|director.*product|product.*director)/i, n:4, rol:'Director of Product' },
    { re:/(group product manager|gpm|principal product|product lead|lead product manager|staff product)/i, n:3, rol:'Group PM' },
    { re:/(senior|sr\.?)\s*(product manager|pm)/i, n:2, rol:'Senior PM' },
    { re:/(product manager|product owner|\bpm\b)/i, n:1, rol:'Product Manager' },
    { re:/(associate product|apm|product analyst|analista|intern.*product|junior.*product|product designer|ux|business analyst|data analyst)/i, n:0, rol:'Product Analyst' }
  ];

  function parsearPerfil(texto) {
    var out = { nombre:null, nivel:null, rol:null };
    if (!texto) return out;
    var m = /linkedin\.com\/in\/([a-z0-9\-_.]+)/i.exec(texto);
    if (m) {
      var partes = m[1].replace(/[0-9]+/g, '').split(/[-_.]+/), ns = [], i;
      for (i = 0; i < partes.length; i++) {
        if (partes[i].length > 1) ns.push(partes[i].charAt(0).toUpperCase() + partes[i].slice(1));
      }
      if (ns.length) out.nombre = ns.slice(0, 2).join(' ');
    }
    for (var k = 0; k < TITULOS.length; k++) {
      if (TITULOS[k].re.test(texto)) { out.nivel = TITULOS[k].n; out.rol = TITULOS[k].rol; break; }
    }
    if (/design|ux|\bui\b/i.test(texto)) out.bg = 'design';
    else if (/engineer|developer|cto|software|swe/i.test(texto)) out.bg = 'eng';
    else if (/sales|marketing|mba|business|growth|commercial|finance/i.test(texto)) out.bg = 'biz';
    else if (/data|analytics|scientist/i.test(texto)) out.bg = 'data';
    else if (out.nivel !== null) out.bg = 'product';
    return out;
  }

  var inicioSel = { nivel:0, rol:'Product Analyst', nombre:null, deLinkedin:null, buscando:false };

  /* On the public deploy, the server can read the PUBLIC LinkedIn page and
     hand us name + headline (/api/perfil). On the iPad's LAN server that
     endpoint doesn't exist: the XHR fails and we quietly keep the local
     slug + title parsing. Best-effort by design. */
  function consultarLinkedin(url) {
    if (!window.XMLHttpRequest || inicioSel.buscando) return;
    inicioSel.buscando = true;
    var x = new XMLHttpRequest();
    x.open('GET', 'api/perfil?u=' + encodeURIComponent(url), true);
    x.timeout = 7000;
    x.onreadystatechange = function () {
      if (x.readyState !== 4) return;
      inicioSel.buscando = false;
      var r = null;
      try { r = JSON.parse(x.responseText); } catch (e) {}
      if (r && r.ok) {
        if (r.nombre) inicioSel.nombre = r.nombre;
        if (r.titular) {
          inicioSel.deLinkedin = r.titular;
          var p = parsearPerfil(r.titular);
          if (p.nivel !== null) { inicioSel.nivel = p.nivel; inicioSel.rol = p.rol; }
        } else {
          inicioSel.deLinkedin = 'profile found';
        }
      }
      var pantalla = document.getElementById('p-inicio');
      if (pantalla && pantalla.className.indexOf('on') >= 0) renderInicio();
    };
    try { x.send(null); } catch (e2) { inicioSel.buscando = false; }
  }

  /* one layer of the landing explainer: indent = nesting depth */
  /* one step of "how it works": same numbered-line pattern as the in-game
     intro ("Four things. That's it.") — proven readable, so reused as-is
     instead of a new one-off layout. */
  function pasoHtml(n, col, tit, txt) {
    return '<div class="linea"><div class="ic" style="color:' + col + '">' + n + '</div>' +
      '<div class="tx"><b>' + tit + '.</b> ' + txt + '</div></div>';
  }

  function rungChipsHtml() {
    var h = '', ti;
    for (ti = 0; ti < ESCALAFON.length; ti++) {
      h += '<span class="rolchip' + (inicioSel.nivel === ti ? ' sel' : '') + '" data-rol="' + ti + '">' +
           esc(ESCALAFON[ti].corto) + '</span>';
    }
    return h;
  }

  /* The hero visual: a skyline that grows with the ladder, from a one-desk
     garage to a tower with your own flag on top. Every building is a big,
     tappable hit target wired to the same data-rol the role chips use, so
     picking a rung and reading the story are the same motion. */
  function skylineSvg(sel) {
    var n = ESCALAFON.length, vw = 320, vh = 210, baseY = 178, topPad = 34;
    var colW = vw / n, barW = 24, maxH = baseY - topPad, minH = 28, i;
    var svg = '<svg viewBox="0 0 ' + vw + ' ' + vh + '" class="skysvg" preserveAspectRatio="xMidYMax meet">' +
      '<defs><linearGradient id="skysky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#0a0f1c"></stop><stop offset="1" stop-color="#131b2c"></stop>' +
      '</linearGradient><radialGradient id="skyglow" cx="0.5" cy="1" r="0.75">' +
      '<stop offset="0" stop-color="#3a2e12" stop-opacity="0.55"></stop>' +
      '<stop offset="1" stop-color="#3a2e12" stop-opacity="0"></stop></radialGradient></defs>' +
      '<rect x="0" y="0" width="' + vw + '" height="' + vh + '" fill="url(#skysky)"></rect>' +
      '<rect x="0" y="0" width="' + vw + '" height="' + vh + '" fill="url(#skyglow)"></rect>' +
      '<circle cx="44" cy="34" r="8" fill="#232c40"></circle>' +
      '<circle cx="48" cy="31" r="8" fill="#0a0f1c"></circle>' +
      '<circle cx="18" cy="52" r="1" fill="#2a313d"></circle>' +
      '<circle cx="72" cy="46" r="1" fill="#2a313d"></circle>' +
      '<circle cx="108" cy="26" r="1.1" fill="#3a4456"></circle>' +
      '<circle cx="150" cy="42" r="1" fill="#2a313d"></circle>' +
      '<circle cx="192" cy="18" r="1" fill="#2a313d"></circle>' +
      '<circle cx="235" cy="20" r="1.2" fill="#3a4456"></circle>' +
      '<circle cx="296" cy="34" r="1" fill="#2a313d"></circle>' +
      '<line x1="0" y1="' + baseY + '" x2="' + vw + '" y2="' + baseY + '" stroke="#1c2438"></line>';

    for (i = 0; i < n; i++) {
      var h2 = minH + (maxH - minH) * (i / (n - 1));
      var cx = colW * i + colW / 2, x = cx - barW / 2, y = baseY - h2;
      var sel2 = (i === sel), fnd = (i === n - 1);
      var fill = sel2 ? '#182b46' : '#141922';
      var stroke = sel2 ? (fnd ? '#a98ff0' : '#3f82e6') : '#232a35';
      svg += '<g class="skycol" data-rol="' + i + '">';
      svg += '<rect x="' + x + '" y="' + topPad + '" width="' + barW + '" height="' + (baseY - topPad) +
             '" fill="#000" opacity="0" pointer-events="all"></rect>';
      svg += '<rect class="skybar" x="' + x + '" y="' + y + '" width="' + barW + '" height="' + h2 +
             '" rx="1.5" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (sel2 ? 1.6 : 1) + '"></rect>';
      var rows = Math.max(1, Math.floor((h2 - 8) / 11)), r;
      for (r = 0; r < rows; r++) {
        var wy = y + 6 + r * 11, wfill = sel2 ? '#ffd479' : '#2a313d', wop = sel2 ? 0.9 : 0.55;
        svg += '<rect x="' + (x + 4) + '" y="' + wy + '" width="3.4" height="4.2" fill="' + wfill + '" opacity="' + wop + '"></rect>';
        svg += '<rect x="' + (x + barW - 7.4) + '" y="' + wy + '" width="3.4" height="4.2" fill="' + wfill + '" opacity="' + wop + '"></rect>';
      }
      if (sel2) {
        if (fnd) {
          svg += '<line x1="' + cx + '" y1="' + (y - 2) + '" x2="' + cx + '" y2="' + (y - 16) + '" stroke="#a98ff0" stroke-width="1.6"></line>' +
                 '<path d="M' + cx + ' ' + (y - 16) + ' l11 4 l-11 4 z" fill="#a98ff0"></path>';
        } else {
          svg += '<circle cx="' + cx + '" cy="' + (y - 9) + '" r="3.6" fill="#5aa9f0"></circle>' +
                 '<line x1="' + cx + '" y1="' + (y - 5.6) + '" x2="' + cx + '" y2="' + (y - 1) + '" stroke="#5aa9f0" stroke-width="1.8"></line>';
        }
        svg += '<line x1="' + cx + '" y1="' + (y - 18) + '" x2="' + cx + '" y2="' + baseY + '" stroke="' +
               (fnd ? '#a98ff0' : '#5aa9f0') + '" stroke-width="1" stroke-dasharray="2,2" opacity="0.35"></line>' +
               '<text x="' + cx + '" y="' + (y - 22) + '" text-anchor="middle" font-size="9" font-weight="700" fill="' +
               (fnd ? '#a98ff0' : '#7fa8d8') + '">' + esc(ESCALAFON[i].corto) + '</text>';
      }
      svg += '</g>';
    }
    svg += '</svg>';
    return svg;
  }

  function renderInicio() {
    var hay = false;
    try { hay = !!localStorage.getItem(CLAVE); } catch (e) {}

    /* ---- hero: title, skyline, pick a rung, go. always in view, never scrolls ---- */
    var h = '<div class="landhero"><div class="landtop">';
    h += '<div class="landleft">';
    h += '<div class="h1">Founder Mode</div>' +
      '<div class="hook" style="margin-top:8px;max-width:520px">Can you make CPO without breaking the ' +
      'product or burning out your team?</div>' +
      '<div class="pq mut" style="margin-top:6px;max-width:500px">Make real calls. Survive CEOs, crises ' +
      'and competitors. Then see how your career stacks up against everyone else who played.</div>';
    h += '<div class="rot" style="margin:16px 0 6px 0">Start as</div><div>' + rungChipsHtml() + '</div>';
    h += '<div class="pq mut" style="margin-top:8px" id="perfil-eco">' +
      (inicioSel.buscando ? '<span class="azul">Reading your LinkedIn profile…</span> · ' : '') +
      (inicioSel.deLinkedin ? '<span class="verde">From LinkedIn:</span> ' + esc(inicioSel.deLinkedin) + ' · ' : '') +
      (inicioSel.nombre ? 'Starting as <b>' + esc(inicioSel.nombre) + '</b> · ' : '') +
      'You start the career as <b>' + esc(nivelPorN(inicioSel.nivel).rol) + '</b>' +
      (inicioSel.nivel > 0 ? ' — your real rung. Or tap APM to run the whole ladder.' : ' — the full climb, from the bottom.') +
      '</div>';
    h += '<div style="margin-top:16px">' +
      '<span class="btn pri xl" data-act="nueva">New career</span>' +
      (hay ? ' <span class="btn" data-act="continuar">Continue</span>' : '') + '</div>';
    h += '<div class="pq mut" style="margin-top:10px">' +
      '<span class="linklike" data-act="semanal">Weekly challenge</span>' +
      '<span class="mut"> · </span>' +
      '<span class="linklike" data-act="biblio">Library</span></div>';
    h += '</div>'; /* landleft */

    h += '<div class="landright"><div class="skycard">' + skylineSvg(inicioSel.nivel) +
      '<div class="skyhint">Tap a building to pick your rung</div></div></div>';
    h += '</div></div>'; /* landtop, landhero */

    /* ---- everything else: depth, personalization, the hall of fame. scrolls on its own ---- */
    h += '<div class="landmore scroll"><div class="landchevron">⌄</div>';
    h += '<div class="landcols">';

    h += '<div class="lcL">';
    h += '<div class="h2">How it works</div>' +
      '<div class="pq mut" style="margin-bottom:6px">Five things happening at once, every month.</div>';
    h += pasoHtml(1, '#5aa9f0', 'The month, your turn',
      'Place the team\'s points on stations — Discover, Platform, Reliability, Growth — or on ' +
      'backlog bets: probability × impact ÷ effort.');
    h += pasoHtml(2, '#35c46a', 'The job, one mandate',
      'Move one number by a deadline. The stage — pre-PMF, validating, scaling — decides what pays; ' +
      'political capital, how far off-script you can go.');
    h += pasoHtml(3, '#e8a33d', 'The career, the ladder',
      'Eight rungs, Product Analyst to Founder. Rungs unlock levers, reputation opens tables, and ' +
      'equity — worth something or nothing — makes the fortune.');
    h += pasoHtml(4, '#a98ff0', 'The world, the board',
      'Eras rewrite the rules without warning: bubbles, winters, regulators. Sectors heat and freeze. ' +
      'A rival climbs the same ladder, on the same clock.');
    h += pasoHtml(5, '#7fa8d8', 'The library, the receipts',
      LIBROS.length + ' real product books power the rules. Every mistake gets charged first — ' +
      'then the exact card that predicted it opens.');

    h += '<div class="caja2" style="margin-top:14px"><div class="rot" style="margin-bottom:5px">Who are you? <span class="mut" style="text-transform:none;letter-spacing:0">(optional — you can always start from zero)</span></div>' +
      '<input type="text" id="perfil-in" placeholder="Paste your LinkedIn URL or your current title..." ' +
      'value="' + esc(inicioSel.texto || '') + '">' +
      '<input type="text" id="nombre-in" placeholder="Your name (or we\'ll take it from the URL)" ' +
      'style="margin-top:7px" value="' + esc(inicioSel.nombreManual ? (inicioSel.nombre || '') : '') + '">' +
      '<div class="rot" style="margin:9px 0 4px 0">Where do you come from?</div><div>' + (function () {
        var BGS = [['product','Product'],['design','Design'],['eng','Engineering'],['biz','Business'],['data','Data']];
        var hb = '';
        for (var bi = 0; bi < BGS.length; bi++) {
          hb += '<span class="rolchip' + ((inicioSel.bg || 'product') === BGS[bi][0] ? ' sel' : '') + '" data-bg="' + BGS[bi][0] + '">' + BGS[bi][1] + '</span>';
        }
        return hb;
      })() + '</div></div>';

    var fac = Ranking.faccion();
    h += '<div class="caja2" style="margin-top:10px"><div class="rot" style="margin-bottom:5px">Pick a side</div>' +
      '<span class="rolchip' + (fac === 'growth' ? ' sel' : '') + '" data-fac="growth">Growth Legion</span>' +
      '<span class="rolchip' + (fac === 'craft' ? ' sel' : '') + '" data-fac="craft">Craft Guild</span>' +
      '<div class="pq mut" style="margin-top:6px">Every finished career — yours included — adds its delivered ' +
      'mandates to your faction\'s total on the public ranking.</div></div>';

    h += '<div class="pq mut" style="margin-top:10px;max-width:540px">Weekly challenge: everyone plays the same ' +
      'world this week (' + esc(Ranking.semana()) + ') — same eras, same storms, same rival timing. One public ' +
      'table, seven days, no edge but the calls you make.</div>';
    h += '</div>'; /* lcL */

    h += '<div class="lcR">';
    h += '<div class="h2">Hall of Fame</div>' +
      '<div class="pq mut" style="margin-bottom:6px">Your best runs, everyone\'s achievements, one public leaderboard.</div>';

    h += '<div class="caja2"><div class="rot" style="margin-bottom:6px">Your records</div>';
    if (R.records.carreras > 0) {
      h += '<div class="req"><span class="mut">Careers played</span> <b class="num"> ' + R.records.carreras + '</b></div>' +
           '<div class="req"><span class="mut">Best net worth</span> <b class="num verde"> ' + money(R.records.patrimonio) + '</b></div>' +
           '<div class="req"><span class="mut">Best role reached</span> <b> ' + esc(nivelPorN(R.records.nivel).rol) + '</b></div>';
      var i;
      for (i = 0; i < Math.min(3, R.historia.length); i++) {
        var hh = R.historia[i];
        h += '<div class="req mut" style="font-size:12px">· ' + esc(hh.nombre) + ' — ' + money(hh.patrimonio) +
             ', ' + esc(hh.nivel) + ' · rival: ' + esc(hh.rival) + ' (level ' + hh.rivalNivel + ')</div>';
      }
    } else {
      h += '<div class="pq mut">Nobody\'s played yet. Records live here.</div>';
    }
    h += '<div class="pq" style="margin-top:8px"><span class="linklike" data-act="ranking">See the public ranking →</span></div>';
    h += '</div>';

    var items = '', k, n = 0;
    for (k = 0; k < Logros.DEFS.length; k++) {
      var d = Logros.DEFS[k], ok = !!R.logros[d.id];
      if (ok) n++;
      items += '<div class="req ' + (ok ? 'verde' : 'mut') + '" style="' + (ok ? '' : 'opacity:0.45') + '">' +
           (ok ? '★ ' : '☆ ') + esc(d.n) + ' <span class="mut" style="font-size:11px">— ' + esc(d.d) + '</span></div>';
    }
    h += '<div class="caja2" style="margin-top:10px"><div class="rot" style="margin-bottom:6px">Achievements · ' +
      n + ' of ' + Logros.DEFS.length + '</div>' + items + '</div>';
    h += '</div>'; /* lcR */

    h += '</div>'; /* landcols */
    h += '</div>'; /* landmore */

    $('p-inicio').innerHTML = h;
  }

  /* ================= OFFERS ================= */

  function renderOfertas(cierreExtra) {
    var era = Mundo.era(M), ofs = C.ofertas, i;
    var h = '<div class="rot">Month ' + M.mes + ' of your career · ' + esc(nivelPorN(C.nivel).rol) +
            ' · reputation ' + Math.round(C.reputacion) +
            (C.semana ? ' · <span class="lila">weekly challenge ' + esc(C.semana) + '</span>' : '') + '</div>' +
            '<div class="h1" style="margin-top:2px">On the table</div>';

    h += '<div class="era-banner"><span class="nombre-era">' + esc(era.nombre) + '</span>' +
         '<div class="pq mut">' + esc(era.desc) + '</div>' +
         (M.noticias.length ? '<div class="pq" style="margin-top:5px;color:#767f8d">◈ ' + esc(M.noticias[0].txt) + '</div>' : '') +
         '</div>';

    h += '<div class="tarjetas">';
    for (i = 0; i < ofs.length; i++) {
      var o = ofs[i];
      var calor = o.calor > 0 ? '<span class="pill hot">hot sector</span>' :
                  o.calor < 0 ? '<span class="pill frio">cold sector</span>' : '';
      h += '<div class="oferta' + (ofertaSel === i ? ' sel' : '') + '" data-oferta="' + i + '">' +
        '<div class="cab ' + (o.fundar ? 'lila' : 'azul') + '">' + esc(o.sectorCorto) + ' · ' + esc(o.etapaNombre) + calor + '</div>' +
        '<h3>' + esc(o.nombre) + '</h3>' +
        '<div class="rolof">' + esc(o.rol) + ' · control ' + Math.round(o.mando * 100) + '%</div>' +
        '<div class="desc">' + esc(o.pitch) + '<br><br><i>' + esc(o.eje) + '</i></div>' +
        '<div class="mandato"><div class="rot">Contract · ' + o.meses + ' months</div><span class="mut">The mandate is revealed on day one — they never tell you the real job in the interview.</span></div>' +
        '<div class="fila">Salary <b>' + money(o.sueldo) + '/yr</b> · Equity <b>' +
          (o.fundar ? 'yours' : o.equity + '%') + '</b></div>' +
        '<div class="fila">Risk <b>' + esc(o.riesgoTxt) + '</b> · Project slots <b>' + (o.slots || 3) + '</b></div>' +
        '<div class="fila">Bets: <b>' + (o.perfil === 'grandes' ? 'few and big' : o.perfil === 'chicas' ? 'many and small' : o.perfil === 'incierto' ? 'hard to estimate' : 'balanced portfolio') + '</b></div>' +
        '</div>';
    }
    h += '</div>';

    h += '<div style="margin-top:18px">' +
      '<span class="btn pri' + (ofertaSel >= 0 ? '' : ' off') + '" data-act="aceptar">Take the job</span> ' +
      '<span class="btn sec" data-act="biblio">Library ' + Object.keys(C.codex).length + '/' + LIBROS.length + '</span> ' +
      '<span class="btn" data-act="volver-inicio">Back</span></div>';
    $('p-ofertas').innerHTML = h;
    ir('p-ofertas');
  }

  /* ================= BRIEFING (day one) ================= */

  function faseClase(fc) {
    return fc === 'PRE-PMF' ? 'ambar' : fc === 'VALIDATING PMF' ? 'azul' : 'verde';
  }
  function faseIcono(fc) {
    return fc === 'PRE-PMF' ? 'validating' : fc === 'VALIDATING PMF' ? 'pmf' : 'scaling';
  }

  function indBarra(nombre, valor, objetivo, mayorMejor) {
    var pasa = mayorMejor ? valor >= objetivo : valor <= objetivo;
    var cls = pasa ? 'ok' : 'no';
    var estado = pasa ? 'On track' : 'Not there yet';
    var meta = mayorMejor ? ('needs ' + Math.round(objetivo) + '%') : ('must stay under ' + Math.round(objetivo) + '%');
    return '<div class="indicador">' +
      '<div class="ind-cab"><span class="ind-nom">' + esc(nombre) + '</span>' +
      '<span class="ind-badge ' + cls + '">' + estado + '</span></div>' +
      '<div class="ind-track"><i class="ind-fill ' + cls + '" style="width:' + Math.max(0, Math.min(100, valor)) + '%"></i>' +
      '<i class="ind-obj" style="left:' + Math.max(0, Math.min(100, objetivo)) + '%"></i></div>' +
      '<div class="ind-meta"><b class="' + cls + '">' + Math.round(valor) + '%</b> now · ' + meta + ' to clear this stage</div></div>';
  }

  function mostrarBrief() {
    var era = Mundo.era(M);
    var calorTxt = J.calor > 0 ? '<span class="hot2">hot</span>' :
                   J.calor < 0 ? '<span class="frio2">cold</span>' : 'steady';
    var m2 = mandatoPorId(J.mandatoId);
    var fclase = faseClase(J.faseCorta);
    var h = '<div class="mision-cinta ' + fclase + '"><span class="raya"></span><b>Mission briefing</b></div>' +
      '<div class="rot">' + esc(J.sector) + ' · ' + esc(ETAPAS[J.etapa].nombre) + ' · your day one as ' + esc(J.rol) + '</div>' +
      '<div class="h1">' + esc(J.empresa) + '</div>';

    var calorSit = J.calor > 0 ? 'a hot sector everyone is chasing' : J.calor < 0 ? 'a cold sector nobody wants to fund' : 'a sector that isn\'t moving either way';
    h += '<div class="situacion ' + fclase + '">You\'re parachuted in as <b>' + esc(J.rol) + '</b> at <b>' + esc(J.empresa) +
      '</b>: ' + mil(Motor.usuarios(J)) + ' users, a team of ' + (J.ing + J.prod + J.gtm) + ', sitting in ' + calorSit +
      ' during ' + esc(era.nombre) + '. You have <b>' + J.meses + ' months</b> on the clock. ' + esc(m2.txt) + '</div>';

    h += '<div class="fasebox"><span class="fasechip ' + fclase + '">' + svgIc(faseIcono(J.faseCorta)) + esc(J.faseCorta) + '</span>' +
         '<div class="faseobj">' + esc(J.objetivo) + '</div></div>';

    h += '<div class="notas" style="margin-top:14px">';
    h += '<div class="nota" style="width:170px"><div class="nk">Users</div><div class="nv" style="font-size:30px">' + mil(Motor.usuarios(J)) + '</div></div>';
    h += '<div class="nota" style="width:170px"><div class="nk">Team</div><div class="nv" style="font-size:30px">' + (J.ing + J.prod + J.gtm) + '</div></div>';
    h += '<div class="nota" style="width:170px"><div class="nk">Sector</div><div class="nv" style="font-size:22px;margin-top:8px">' + calorTxt + '</div><div class="pq mut" style="font-size:10.5px">' + esc(era.nombre) + '</div></div>';
    h += '<div class="nota" style="width:280px"><div class="nk">Your mandate · ' + J.meses + ' months</div><div class="nv" style="font-size:17px;margin-top:8px;line-height:1.3">' + esc(m2.txt) + '</div></div>';
    h += '</div>';

    var i, k, nec;
    h += '<div style="display:-webkit-flex;display:flex;margin-top:8px">';
    h += '<div style="width:470px;padding-right:26px">';
    h += '<div class="rot" style="margin-bottom:6px">Bets that count double toward your mandate</div><div>';
    for (i = 0; i < J.prima.length; i++) {
      nec = null;
      for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === J.prima[i]) nec = NECESIDADES[k];
      if (nec) h += '<span class="tagobj up">▲ ' + esc(nec.nombre) + ' <b>×1.3</b></span>';
    }
    h += '</div>';
    if (J.castiga.length) {
      h += '<div class="rot" style="margin:10px 0 6px 0">Bets that barely count right now</div><div>';
      for (i = 0; i < J.castiga.length; i++) {
        nec = null;
        for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === J.castiga[i]) nec = NECESIDADES[k];
        if (nec) h += '<span class="tagobj down">▽ ' + esc(nec.nombre) + ' <b>×0.5</b></span>';
      }
      h += '</div>';
    }

    /* indicators you actually have to move to clear this stage */
    h += '<div class="rot" style="margin-top:16px;margin-bottom:2px">What clears this stage</div>';
    h += '<div class="indicadores">';
    if (J.faseCorta === 'PRE-PMF') {
      h += indBarra('Product-market fit', Motor.fitMax(J) * 100, 50, true);
      h += indBarra('Evidence gathered', J.evidencia, 70, true);
    } else if (J.faseCorta === 'VALIDATING PMF') {
      h += indBarra('Monthly retention', Motor.retencionMedia(J) * 100, 90, true);
      h += indBarra('Evidence gathered', J.evidencia, 85, true);
    } else {
      var rg2 = Motor.requisitosGate(J), okg2 = 0, gi2;
      for (gi2 = 0; gi2 < rg2.length; gi2++) if (rg2[gi2].ok) okg2++;
      h += indBarra('"' + esc(J.gateNombre) + '" requirements met', rg2.length ? (okg2 / rg2.length * 100) : 100, 100, true);
      h += indBarra('System load', Motor.carga(J) * 100, 90, false);
    }
    h += '</div>';

    /* the theory behind the stage, and the verdict on THIS company */
    var teo = '', caso = '';
    if (J.faseCorta === 'PRE-PMF') {
      teo = 'Steve Blank: before fit, a startup isn\'t a small company — it\'s a search. The Startup Genome ' +
        'study measured the number one cause of death: scaling too early (hiring, growing, hardening ' +
        'processes before validating that the problem burns). That\'s why here the game rewards Core and Flow and punishes Scale.';
      var fx = Math.round(Motor.fitMax(J) * 100);
      caso = esc(J.empresa) + ' today: ' + mil(Motor.usuarios(J)) + ' users, evidence ' + Math.round(J.evidencia) +
        ', best fit ' + fx + '%. ' + (fx < 50 ? 'Translation: you still don\'t know if anyone wants this. Discover before you build.' :
        'Fit is showing: validate it with retention before you hit the gas.');
    } else if (J.faseCorta === 'VALIDATING PMF') {
      teo = 'Andy Rachleff (coined the term): product-market fit isn\'t declared, it shows — the retention curve ' +
        'flattens instead of falling to zero, and growth starts arriving on its own, without buying it. The flat curve is THE ' +
        'proof; cumulative totals are theater. That\'s why Flow (activate better) and Data (see the cohorts) rule here.';
      var rr = Math.round(Motor.retencionMedia(J) * 100);
      caso = esc(J.empresa) + ' retains ' + rr + '% per month. ' + (rr >= 90 ? 'The curve is flattening: this is starting to be real fit.' :
        'Of every 100 who come in, after 6 months ' + Math.round(Math.pow(Motor.retencionMedia(J), 6) * 100) + ' remain. That curve still falls: fit isn\'t proven.');
    } else {
      teo = 'Geoffrey Moore: the big market doesn\'t buy promises — it buys the whole product: integrations, ' +
        'support, guarantees, references. And Accelerate adds the other half: at scale, speed and stability get ' +
        'built together or lost together. That\'s why Integrations, Support, Security and Scale rule here.';
      var rg = Motor.requisitosGate(J), okg = 0, gi;
      for (gi = 0; gi < rg.length; gi++) if (rg[gi].ok) okg++;
      caso = esc(J.empresa) + ' meets ' + okg + ' of ' + rg.length + ' requirements of "' + esc(J.gateNombre) +
        '" and system load is at ' + Math.round(Motor.carga(J) * 100) + '%. Whatever\'s missing from that list IS your roadmap.';
    }
    h += '<div class="teoria-caso" style="margin-top:10px">' +
         '<div class="rot" style="margin-bottom:4px">The playbook this stage follows</div>' +
         '<div class="pq" style="line-height:1.5">' + teo + '</div>' +
         '<div class="rot" style="margin:10px 0 4px 0">' + esc(J.empresa) + ', right now</div>' +
         '<div class="pq caso-linea" style="border-top:none;margin-top:0;padding-top:0">' + caso + '</div></div>';
    h += '</div>';

    h += '<div style="width:400px"><div class="rot" style="margin-bottom:4px">Who you\'ll be working with</div>' +
      '<div class="pq mut" style="margin-bottom:10px">They can help you land the ▲ bets above — or block them.</div>';
    var elencoKeys = ['ceo','cto','ventas','estrella'];
    for (i = 0; i < elencoKeys.length; i++) {
      var per = J.elenco[elencoKeys[i]];
      h += '<div class="quien" style="margin:4px 0"><div class="avatar">' + esc(per.nombre.charAt(0)) + '</div>' +
           '<div><div class="qn">' + esc(per.nombre) + '</div><div class="qc">' + esc(per.cargo) + '</div></div></div>';
    }
    h += '</div></div>';

    h += '<div style="margin-top:16px"><span class="btn pri" data-act="empezar-puesto">' + (J.briefVisto ? 'Back to the month' : 'Start month 1') + '</span>' +
      (!J.briefVisto ? ' <span class="btn" data-act="volver-ofertas">Back to offers</span>' : '') + '</div>';
    $('p-brief').innerHTML = h;
    ir('p-brief');
  }

  /* ================= GAME ================= */

  function nuevoMes() {
    plan = { desc:0, plat:0, fiab:0, crec:0, asig:{}, orden:[] };
    /* projects already in flight come pre-loaded with points, in order */
    var idsVuelo = [], iv;
    for (iv in J.enVuelo) if (J.enVuelo.hasOwnProperty(iv)) idsVuelo.push(iv);
    var libres = Motor.capacidadPropia(J);
    for (iv = 0; iv < idsVuelo.length; iv++) {
      var falta0 = Math.ceil(Motor.costoDe(J, idsVuelo[iv]) - J.enVuelo[idsVuelo[iv]]);
      var pongo = Math.max(0, Math.min(libres, falta0));
      plan.asig[idsVuelo[iv]] = pongo;
      plan.orden.push(idsVuelo[iv]);
      libres -= pongo;
    }
    notasEvento = [];
    renderJuego();
    evActual = eventoAplicable(J, C);
    if (evActual) mostrarEvento(evActual);
  }

  function vHud(id, val, txt, cls) {
    var cambio = hudPrev[id] !== undefined && hudPrev[id] !== val;
    hudPrev[id] = val;
    return '<div class="v num ' + (cls || '') + (cambio ? ' latido' : '') + '">' + txt + '</div>';
  }

  function renderHud() {
    var u2 = Motor.usuarios(J), run = Motor.runwayMeses(J);
    var h = '';
    h += '<div class="hudi"><div class="k">' + esc(J.empresa) + '</div><div class="v num">' +
         'Month ' + (J.mesPuesto + 1) + '<span class="mut" style="font-size:13px"> of ' + J.meses + '</span></div></div>';
    h += '<div class="hudi"><div class="k">Users</div>' + vHud('u', Math.round(u2 / 10), mil(u2), '') + '</div>';
    h += '<div class="hudi"><div class="k">' + tip('ret','Retention') + '</div>' + vHud('ret', Math.round(Motor.retencionMedia(J) * 100), pct(Motor.retencionMedia(J)), '') + '</div>';
    if (J.rolN >= 1) {
      h += '<div class="hudi"><div class="k">' + tip('mrr','Revenue/mo') + '</div>' + vHud('mrr', Math.round(J.mrr / 1000), money(J.mrr), '') + '</div>';
    }
    if (J.rolN >= 3) {
      h += '<div class="hudi"><div class="k">Cash</div>' + vHud('caja', Math.round(J.caja / 10000), money(J.caja), J.caja < Motor.burnMensual(J) * 3 ? 'rojo' : '') + '</div>';
      h += '<div class="hudi"><div class="k">' + tip('runway','Runway') + '</div>' + vHud('run', Math.round(run), run > 90 ? '∞' : run.toFixed(1) + ' mo', run < 4 ? 'rojo' : run < 8 ? 'ambar' : '') + '</div>';
    } else if (run < 5) {
      h += '<div class="hudi"><div class="k">&nbsp;</div><div class="v rojo" style="font-size:13px">The hallways are talking about cash</div></div>';
    }
    h += '<div class="hudi der"><span class="btn chico" data-act="biblio">Library ' + Object.keys(C.codex).length + '/' + LIBROS.length + '</span></div>';
    $('hud').innerHTML = h;
  }

  function renderMandato() {
    var m = mandatoPorId(J.mandatoId);
    var prog = Motor.progresoMandato(J);
    var esperado = (J.mesPuesto + 1) / J.meses;
    var cls = prog >= 1 ? 'v' : prog >= esperado ? 'a' : 'r';
    var pol = Math.round(J.politico);
    var lupa = Math.round(J.lupa || 0);
    var lupaCls = lupa >= 60 ? 'rojo' : 'ambar';
    var h = '<span class="fasechip mini ' + faseClase(J.faseCorta) + '" data-act="ver-objetivo">' + svgIc(faseIcono(J.faseCorta)) + esc(J.faseCorta) + '</span>' +
      '<span class="mut">Mandate:</span>&nbsp;<b>' + esc(m.txt) + '</b>' +
      '<div class="track"><i class="' + cls + '" style="width:' + Math.round(Math.min(1, prog) * 100) + '%"></i></div>' +
      '<span class="num ' + (pol < 25 ? 'rojo' : pol < 45 ? 'ambar' : 'mut') + '">' + tip('pol','Political capital ' + pol) + '</span>' +
      (lupa >= 25 ? '<span class="num ' + lupaCls + '" style="margin-left:14px">◉ They\'re watching you</span>' : '');
    $('mandato').innerHTML = h;
  }

  function renderEra() {
    var era = Mundo.era(M);
    var not = M.noticias.length ? M.noticias[0].txt : '';
    var calor = J.calor > 0 ? ' <span class="pill hot">your sector is hot</span>' :
                J.calor < 0 ? ' <span class="pill frio">your sector is cold</span>' : '';
    $('era').innerHTML = '<span class="nombre-era">' + esc(era.nombre) + '</span>' + calor +
      (not ? '<span class="noticia" style="margin-left:14px">◈ ' + esc(not) + '</span>' : '');
  }

  /* The month as a resource, Age-of-Empires style: your team produces
     points; you station them. Whatever you don't station goes to BUILD and
     pushes your selected projects. Every point is visible and accounted. */
  var ESTACIONES = [
    { k:'desc', n:'Discover', svg:'discover', col:'#5aa9f0', req:'desc', lib:'torres',
      rinde:function (v) { return '+' + Math.round(v * 1.1 * J.calidadDesc * (1 + J.hab.producto / 200)) + ' evid'; } },
    { k:'plat', n:'Platform', svg:'platform', col:'#35c46a', req:'plat', lib:'fowler',
      rinde:function (v) { return '−' + Math.round(v * 0.55 * (1 + J.hab.tecnologia / 150)) + ' debt'; } },
    { k:'fiab', n:'Reliability', svg:'reliability', col:'#4ecdc4', req:'fiab', lib:'sre',
      rinde:function (v) { return '+' + Math.round(v * 0.45) + ' uptime'; } },
    { k:'crec', n:'Growth', svg:'growth', col:'#e86ba3', req:'crec', lib:'chasm',
      rinde:function (v) { return '+reach · $' + Math.round(v * 0.9) + 'k'; } }
  ];

  function svgIc(id, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '"><use xlink:href="#ic-' + id + '"></use></svg>';
  }

  function enEstaciones() { return plan.desc + plan.plat + plan.fiab + plan.crec; }
  function enProyectos() {
    var t = 0, id;
    for (id in plan.asig) if (plan.asig.hasOwnProperty(id)) t += plan.asig[id];
    return t;
  }
  function sinUsar() { return Math.max(0, Motor.capacidadPropia(J) - enEstaciones() - enProyectos()); }

  function renderAsignacion() {
    var mio = Motor.capacidadPropia(J), ocio = sinUsar();
    var h = '<div class="rot" style="margin-bottom:6px">1 · Place your team\'s ' +
            '<b class="num">' + mio + ' points</b> · stations first, the rest goes on projects below</div>';

    h += '<div class="ebar">';
    var i;
    for (i = 0; i < ESTACIONES.length; i++) {
      var v = plan[ESTACIONES[i].k];
      if (v > 0) h += '<i style="width:' + (v / mio * 100) + '%;background:' + ESTACIONES[i].col + '"></i>';
    }
    if (enProyectos() > 0) h += '<i style="width:' + (enProyectos() / mio * 100) + '%;background:#e8a33d"></i>';
    if (ocio > 0) h += '<i style="width:' + (ocio / mio * 100) + '%;background:#20242e"></i>';
    h += '</div>';

    h += '<div class="estaciones">';
    for (i = 0; i < ESTACIONES.length; i++) {
      var st = ESTACIONES[i], vv = plan[st.k];
      if (J.palancas.indexOf(st.req) < 0) {
        var falta = '';
        for (var k = 0; k < ESCALAFON.length; k++) {
          if (ESCALAFON[k].palancas.indexOf(st.req) >= 0) { falta = ESCALAFON[k].corto; break; }
        }
        h += '<div class="stcard bloq"><div class="sticon">' + svgIc(st.svg) + '</div>' +
          '<div class="stn">' + st.n + '</div><div class="stlock">🔒 ' + falta + '</div></div>';
        continue;
      }
      var pctFill = mio > 0 ? Math.round(vv / mio * 100) : 0;
      h += '<div class="stcard' + (vv > 0 ? ' viva' : '') + '">' +
        '<div class="stfill" style="height:' + pctFill + '%;background:' + st.col + '"></div>' +
        '<div class="sticon" style="' + (vv > 0 ? 'background:' + st.col + '26;color:' + st.col : '') + '">' + svgIc(st.svg) + '</div>' +
        '<div class="stn">' + st.n + '</div>' +
        '<div class="ctrl">' +
        '<div class="b' + (vv <= 0 ? ' off' : '') + '" data-menos="' + st.k + '">−</div>' +
        '<div class="n num">' + vv + '</div>' +
        '<div class="b' + (ocio <= 0 ? ' off' : '') + '" data-mas="' + st.k + '">+</div>' +
        '</div>' +
        '<div class="strinde">' + (vv > 0 ? st.rinde(vv) : '—') + '</div></div>';
    }
    h += '<div class="stcard viva build">' +
      '<div class="sticon" style="background:#e8a33d26;color:#e8a33d">' + svgIc('build') + '</div>' +
      '<div class="stn">On projects</div>' +
      '<div class="n num" style="font-size:19px;margin-top:1px">' + enProyectos() + '</div>' +
      '<div class="strinde">' + (ocio > 0 ? '<span class="ambar">' + ocio + ' idle</span>' : 'all busy') + '</div></div>';
    h += '</div>';
    $('capa').innerHTML = h;
  }

  /* the through-line: your mandate IS one of the pirate metrics */
  var MET_MANDATO = { retencion:'ret', crecer:'adq', ingresos:'rev',
                      activacion:'act', estabilidad:'rel', deuda:'rel', abismo:'adq' };
  var MET_NOMBRE = { adq:'ACQ', act:'ACT', ret:'RET', rev:'REV', rel:'REL' };

  function chipsVec(vec, metaMet) {
    var h = '', mk, mostrados = 0;
    var orden = ['adq','act','ret','rev','rel'];
    for (var i = 0; i < orden.length && mostrados < 3; i++) {
      mk = orden[i];
      var v = vec[mk];
      if (!v) continue;
      mostrados++;
      var cls = v > 0 ? 'vpos' : 'vneg';
      var star = mk === metaMet ? ' vmeta' : '';
      h += '<span class="vchip ' + cls + star + '">' + MET_NOMBRE[mk] + ' ' + (v > 0 ? '+' : '') + v + '</span>';
    }
    return h;
  }

  function dots(n) {
    var h = '<span class="dots">', i;
    for (i = 1; i <= 5; i++) h += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return h + '</span>';
  }
  function blocks(n) {
    var h = '<span class="blocks">', i;
    for (i = 1; i <= 5; i++) h += '<i class="b' + i + (i <= n ? ' on' : '') + '"></i>';
    return h + '</span>';
  }

  function slotsUsados() {
    var n = 0, id;
    for (id in J.enVuelo) if (J.enVuelo.hasOwnProperty(id)) n++;
    for (var i = 0; i < plan.orden.length; i++) if (J.enVuelo[plan.orden[i]] === undefined) n++;
    return n;
  }

  function renderBacklog() {
    var usados = slotsUsados(), i2, cajas = '';
    for (i2 = 0; i2 < J.slots; i2++) cajas += '<span class="slot' + (i2 < usados ? ' lleno' : '') + '"></span>';
    var h = '<div class="rot" style="margin:8px 0 7px 0">2 · Put points on your projects · slots ' + cajas +
      ' <span class="pill libro" data-lib="momtest">confidence ' + Motor.confianza(J) + '</span></div>';

    var id, i, a, d;

    /* your board: projects taking points this month */
    for (i = 0; i < plan.orden.length; i++) {
      id = plan.orden[i]; a = Motor.apuesta(id);
      var cst = Motor.costoDe(J, id);
      var hecho = J.enVuelo[id] || 0;
      var pts = plan.asig[id] || 0;
      var falta = Math.max(0, Math.ceil(cst - hecho));
      var sale = hecho + pts >= cst;
      var pDone = Math.min(100, Math.round(hecho / cst * 100));
      var pPrev = Math.min(100 - pDone, Math.round(pts / cst * 100));
      h += '<div class="ap tuyo' + (sale ? ' sale' : '') + '">' +
        '<div class="t"><div class="n2">' + esc(a.n) +
        (sale ? '<span class="shiptag">SHIPS THIS MONTH</span>' :
          (pts === 0 ? '<span class="pill">paused</span>' : '')) + '</div>' +
        '<div class="prog"><i class="pdone" style="width:' + pDone + '%"></i><i class="pprev" style="width:' + pPrev + '%"></i></div>' +
        '<div class="d2">' + falta + ' of ' + cst + ' pts left</div></div>' +
        '<div class="ctrl">' +
        '<div class="b' + (pts <= 0 ? ' off' : '') + '" data-pmenos="' + id + '">−</div>' +
        '<div class="n num">' + pts + '</div>' +
        '<div class="b' + (sinUsar() <= 0 || sale ? ' off' : '') + '" data-pmas="' + id + '">+</div>' +
        '</div>' +
        (J.enVuelo[id] === undefined ? '<div class="quitar" data-quitar="' + id + '">✕</div>' : '<div class="quitar mut" style="visibility:hidden">✕</div>') +
        '</div>';
    }
    if (plan.orden.length) h += '<div class="rot" style="margin:10px 0 6px 0">Backlog · tap to add</div>';

    for (i = 0; i < J.backlog.length; i++) {
      id = J.backlog[i]; a = Motor.apuesta(id);
      if (plan.orden.indexOf(id) >= 0) continue;
      var nec = null, k;
      for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === a.nec) nec = NECESIDADES[k];
      d = Motor.estimacionDetalle(J, id);
      var cabe = slotsUsados() < J.slots && sinUsar() > 0;
      var obj = J.prima.indexOf(a.nec) >= 0 ? '<span class="tagobj mini">▲</span>' :
                J.castiga.indexOf(a.nec) >= 0 ? '<span class="tagobj down mini">▽</span>' : '';
      var metaMet = MET_MANDATO[J.mandatoId] || null;
      h += '<div class="ap' + (cabe ? '' : ' nocabe') + '" data-ap="' + id + '">' +
        '<div class="t"><div class="n2">' + esc(a.n) + '<span class="pill">' + esc(nec.corto) + '</span>' + obj + '</div>' +
        '<div class="d2" style="margin-top:2px">' + esc(a.d) + '</div>' +
        '<div class="viz">' +
          '<span class="vlbl">' + tip('prob','prob') + '</span>' + dots(d.prob) +
          '<span class="vlbl">' + tip('vec','expected') + '</span>' + chipsVec(d.vec, metaMet) +
        '</div></div>' +
        '<div class="c"><span class="tipped" data-tip="esf"><span class="esf e' + d.esf + '">' + d.esf + '</span></span>' +
        '<div class="cst num">' + d.tiempo + ' · ' + d.costo + ' pts</div></div></div>';
    }
    $('backlog').innerHTML = h;
  }

  function palabra(v, cortes, palabras) {
    if (v >= cortes[0]) return '<span class="verde">' + palabras[0] + '</span>';
    if (v >= cortes[1]) return '<span class="ambar">' + palabras[1] + '</span>';
    return '<span class="rojo">' + palabras[2] + '</span>';
  }

  function barraEstado(lbl, v, invertido, libro, icono) {
    var x = invertido ? 100 - v : v;
    var cls = x >= 62 ? 'v' : x >= 38 ? 'a' : 'r';
    return '<div class="est">' + (icono ? '<span class="esti ' + cls + '">' + svgIc(icono) + '</span>' : '') +
      '<span class="elbl">' + lbl + (libro ? chip(libro) : '') + '</span>' +
      '<span class="etrk"><span class="track"><i class="' + cls + '" style="width:' + Math.round(Math.max(4, Math.min(100, v))) + '%"></i></span></span></div>';
  }

  function renderPanel() {
    var h = '', i;

    /* the pirate funnel: the numbers you decide with */
    var actPct = Math.round((0.35 + (J.usabilidad / 100) * 0.65) * 100);
    var retPct = Math.round(Motor.retencionMedia(J) * 100);
    var profit = J.mrr - Motor.burnMensual(J);
    var refCoef = Math.round(J.viral * Motor.fitMax(J) * 100) / 100;
    var funIc = function (id, cls) { return '<span class="funic' + (cls ? ' ' + cls : '') + '">' + svgIc(id) + '</span>'; };
    h += '<div class="caja2"><div class="rot" style="margin-bottom:6px">' + tip('funnel','Funnel') + ' · AARRR</div>';
    h += '<div class="fun"><span class="fk">' + funIc('acquisition') + 'Acquisition</span><span class="fv num">+' + mil(J.adqMes || 0) + '<span class="mut fsub"> new/mo</span></span></div>';
    h += '<div class="fun"><span class="fk">' + funIc('activation') + 'Activation</span><span class="fv num">' + actPct + '%</span></div>';
    h += '<div class="fun"><span class="fk">' + funIc('retention', retPct >= 88 ? 'verde' : retPct >= 80 ? '' : 'rojo') + 'Retention</span><span class="fv num ' + (retPct >= 88 ? 'verde' : retPct >= 80 ? '' : 'rojo') + '">' + retPct + '%</span></div>';
    if (J.rolN >= 1) {
      h += '<div class="fun"><span class="fk">' + funIc('revenue') + 'Revenue</span><span class="fv num">' + money(J.mrr) + '<span class="mut fsub">/mo</span></span></div>';
      h += '<div class="fun"><span class="fk">' + funIc('revenue', profit >= 0 ? 'verde' : 'rojo') + 'Profit</span><span class="fv num ' + (profit >= 0 ? 'verde' : 'rojo') + '">' + (profit >= 0 ? '+' : '') + money(profit) + '</span></div>';
    }
    h += '<div class="fun"><span class="fk">' + funIc('referral') + 'Referral</span><span class="fv num">' + refCoef + '<span class="mut fsub"> coef</span></span></div>';
    var metaMet2 = MET_MANDATO[J.mandatoId];
    if (metaMet2) h += '<div class="pq mut" style="font-size:11px;margin-top:5px">Your mandate lives in <b class="azul">' + MET_NOMBRE[metaMet2] + '</b>. Bets with that chip glowing move it.</div>';
    h += '</div>';

    h += '<div class="caja2"><div class="rot" style="margin-bottom:6px">Where we stand</div>';
    h += barraEstado(tip('evid','Evidence'), J.evidencia, false, 'lean', 'evidence');
    h += barraEstado(tip('debt','Debt'), J.deuda, true, 'fowler', 'debt');
    h += barraEstado(tip('morale','Morale'), J.moral, false, null, 'morale');
    if ((J.lupa || 0) >= 25) h += barraEstado(tip('heat','The Heat'), J.lupa, true, null, 'heat');
    if (J.rolN >= 2) {
      h += barraEstado(tip('load','Load'), Motor.carga(J) * 100, true, 'ddia', 'load');
      h += barraEstado(tip('usab','Usability'), J.usabilidad, false, 'krug', 'usability');
    }
    if (J.rolN >= 3) {
      h += barraEstado(tip('ebudget','Error budget'), J.presupuestoError, false, 'sre', 'errorbudget');
      h += barraEstado(tip('focus','Focus'), J.foco, false, 'grove', 'focus');
    }
    h += '<div class="pq mut" style="margin-top:6px">' + J.ing + ' eng · ' + J.prod + ' prod · ' + J.gtm + ' gtm' +
         (J.rampa.length ? ' · <span class="ambar">' + J.rampa.length + ' ramping up</span>' : '') + '</div></div>';

    h += '<div class="caja2"><div class="rot" style="margin-bottom:6px">' + tip('capfondeo','Company capabilities') + '</div>';
    h += barraEstado(tip('cap_prod','Product'), J.capacidades.producto, false, null, null);
    h += barraEstado(tip('cap_tec','Tech'), J.capacidades.tecnologia, false, null, null);
    h += barraEstado(tip('cap_gtm','GTM'), J.capacidades.gtm, false, null, null);
    h += barraEstado(tip('cap_gente','Org'), J.capacidades.gente, false, null, null);
    h += barraEstado(tip('cap_cap','Fundraising'), J.capacidades.capital, false, null, null);
    h += '<div class="pq mut" style="margin-top:6px">' + (J.capFondeo > 0 ?
      'Funded to build: ' + money(J.capFondeo) + ' of raised capital left to convert into capability.' :
      '<span class="rojo">No funding fuel left</span> — capabilities are drifting down. Raise to restart growth.') + '</div></div>';

    if (J.rolN >= 1) {
      h += '<div class="caja2"><div class="rot" style="margin-bottom:4px">Who you\'re reaching · ' + tip('fit','fit') + '</div>';
      for (i = 0; i < SEGMENTOS.length; i++) {
        var s = SEGMENTOS[i], u2 = J.usuarios[s.id] || 0, f = Motor.fit(J, s.id);
        var ab = Motor.abierto(J, s.id), g = Motor.compuerta(J, s.id);
        var cls = f > 0.65 ? 'v' : f > 0.35 ? 'a' : 'r';
        h += '<div class="seg"><div class="l"><span class="nm">' + esc(s.nombre) +
          (!ab ? ' <span class="pill">not yet</span>' : (g < 0.5 ? ' <span class="pill rojo">blocked</span>' : '')) +
          '</span><span class="num mut">' + mil(u2) + '</span></div>' +
          '<div class="track"><i class="' + cls + '" style="width:' + Math.round(f * 100) + '%"></i></div></div>';
      }
      h += '</div>';
    }

    if (J.gateRevelado) {
      var r = Motor.requisitosGate(J);
      h += '<div class="caja2"><div class="rot" style="margin-bottom:5px">' + esc(J.gateNombre) + ' ' + chip('chasm') + '</div>';
      for (i = 0; i < r.length; i++) {
        h += '<div class="req ' + (r[i].ok ? 'verde' : 'mut') + '">' + (r[i].ok ? '✓' : '○') + ' ' + esc(r[i].txt) + '</div>';
      }
      h += '</div>';
    }


    $('panel').innerHTML = h;
  }

  function renderBarra() {
    var ocio = sinUsar(), saliendo = 0, id;
    for (id in plan.asig) if (plan.asig.hasOwnProperty(id)) {
      if ((J.enVuelo[id] || 0) + plan.asig[id] >= Motor.costoDe(J, id)) saliendo++;
    }
    var h = '<div class="pts"><span class="ambar">⚒ ' + enProyectos() + ' pts</span> on ' +
      plan.orden.length + ' project' + (plan.orden.length === 1 ? '' : 's') +
      (saliendo ? ' · <span class="verde">' + saliendo + ' shipping</span>' : '') +
      (ocio > 0 ? ' · <span class="rojo">' + ocio + ' idle</span>' : '') + '</div>';
    if (J.esFundador && !J.levantando) h += '<span class="btn chico" data-act="ronda" style="margin-right:10px">Go raise</span>';
    h += '<span class="btn pri" data-act="ejecutar">3 · Close the month</span>';
    $('barra').innerHTML = h;
  }

  function renderJuego() {
    ir('p-juego');
    renderHud(); renderMandato(); renderEra();
    renderAsignacion(); renderBacklog(); renderPanel(); renderBarra();
  }

  /* ================= dilemmas ================= */

  function mostrarEvento(ev) {
    var tx = eventoTexto(ev, J);
    var quien = ev.quien && J.elenco[ev.quien] ? J.elenco[ev.quien] : null;
    var h = '<div class="rot">Month ' + (J.mesPuesto + 1) + ' at ' + esc(J.empresa) + '</div>' +
            '<h2>' + esc(tx.titulo) + '</h2>';
    if (quien) {
      h += '<div class="quien"><div class="avatar">' + esc(quien.nombre.charAt(0)) + '</div>' +
           '<div><div class="qn">' + esc(quien.nombre) + '</div><div class="qc">' + esc(quien.cargo) + '</div></div></div>';
    }
    h += '<div class="pq mut" style="margin-bottom:4px">' + esc(tx.texto) + '</div><div class="cuerpo2 scroll">';
    var i;
    for (i = 0; i < ev.opciones.length; i++) {
      h += '<div class="opt" data-op="' + i + '"><div class="ot">' + esc(ev.opciones[i].txt) + '</div></div>';
    }
    h += '</div>';
    $('t-evento').innerHTML = h;
    ov('ov-evento', true);
  }

  function elegirOpcion(i) {
    var ev = evActual, op = ev.opciones[i], log = [];
    J.eventosVistos[ev.id] = true;
    C.dilemasVistos[ev.id] = (C.dilemasVistos[ev.id] || 0) + 1;
    op.ef(J, log);
    if (op.nota) log.push({ tipo:'nota', texto:op.nota, libro:op.libro || ev.libro });
    marcarCodex(log);
    notasEvento = log;
    var libroTeoria = op.libro || ev.libro;
    evActual = null;
    ov('ov-evento', false);
    renderJuego();
    mostrarResultado(log, 'What the decision left behind', true, libroTeoria);
  }

  /* ================= close the month ================= */

  function ejecutar() {
    var m0 = mandatoPorId(J.mandatoId);
    var valorAntes = m0 ? m0.valor(J) : 0;
    var nuevas = [], ni;
    for (ni = 0; ni < plan.orden.length; ni++) if (J.enVuelo[plan.orden[ni]] === undefined) nuevas.push(plan.orden[ni]);
    var reparto = { desc:plan.desc, plat:plan.plat, fiab:plan.fiab, crec:plan.crec,
                    cons:enProyectos() + sinUsar() * 0, asig:plan.asig, apuestas:nuevas };
    var log = Motor.simular(J, reparto, M);
    if (m0) {
      var valorDespues = m0.valor(J);
      var mejor = m0.invertido ? valorDespues < valorAntes : valorDespues > valorAntes;
      var igual = m0.fmt(valorDespues) === m0.fmt(valorAntes);
      log.unshift({ tipo: igual ? 'neutro' : (mejor ? 'bueno' : 'malo'),
        mandato:{ antes:m0.fmt(valorAntes), despues:m0.fmt(valorDespues), meta:m0.fmt(m0.meta(J)), txt:m0.txt } });
    }
    var fichas2 = fichasNuevas(J, C), fi;
    for (fi = 0; fi < fichas2.length; fi++) {
      log.push({ tipo:'nota', texto:'A card opened in the library: the moment you\'re living has a name.',
                 libro:fichas2[fi].id });
    }
    var cambioEra = Mundo.tick(M);
    if (cambioEra) {
      log.push({ tipo:'neutro', texto:'The era changed: "' + cambioEra.nombre + '" begins. ' + cambioEra.desc, libro:null });
    }
    marcarCodex(log);
    var todo = notasEvento.concat(log);
    guardar();
    if (!J.vivo) { cerrarPuesto(); return; }
    mostrarResultado(todo, 'Month ' + J.mesPuesto + ' at ' + esc(J.empresa), false);
  }

  function mostrarResultado(log, titulo, esDecision, libroTeoria) {
    var h = '<div class="rot">' + titulo + '</div><h2>' +
            (esDecision ? 'Decided' : 'What happened') + '</h2><div class="cuerpo2 scroll">';
    if (!log.length) h += '<div class="pq mut">A month with no surprises. Sometimes that\'s exactly what you need.</div>';
    var i, ic;
    for (i = 0; i < log.length; i++) {
      var l = log[i];
      if (l.mandato) {
        var cls2 = l.tipo === 'bueno' ? 'verde' : l.tipo === 'malo' ? 'rojo' : 'mut';
        h += '<div class="res-mandato"><span class="rot" style="margin-right:10px">Your mandate</span>' +
          esc(l.mandato.txt) + ': <b class="num ' + cls2 + '">' + esc(l.mandato.antes) + ' → ' + esc(l.mandato.despues) + '</b>' +
          '<span class="mut num"> · target ' + esc(l.mandato.meta) + '</span></div>';
        continue;
      }
      if (l.ship) {
        var s2 = l.ship;
        var metaMet3 = MET_MANDATO[J.mandatoId] || null;
        h += '<div class="res-ship"><div class="ic">' + (l.tipo === 'bueno' ? '<span class="verde">▲</span>' : '<span class="rojo">▼</span>') + '</div>' +
          '<div class="tx"><b>Shipped: ' + esc(s2.n) + '</b> — real impact ' + s2.real + ', you expected ' + s2.esperado +
          (s2.real < s2.esperado * 0.55 ? ' <span class="rojo">(you built without knowing)</span>' : '') +
          '<div style="margin-top:4px">' + chipsVec(s2.vec, metaMet3) + '</div></div></div>';
        continue;
      }
      ic = l.tipo === 'bueno' ? '<span class="verde">▲</span>' :
           l.tipo === 'malo' ? '<span class="rojo">▼</span>' :
           l.tipo === 'nota' ? '<span class="azul">✎</span>' : '<span class="mut">•</span>';
      h += '<div class="linea"><div class="ic">' + ic + '</div><div class="tx">' +
           esc(l.texto) + ' ' + (l.libro ? chip(l.libro) : '') + '</div></div>';
    }
    if (esDecision && libroTeoria) {
      var lt = libroPorId(libroTeoria);
      var ap2 = J ? aplicarLibro(libroTeoria, J) : null;
      if (lt) {
        h += '<div class="teoria-caso" style="margin-top:8px">' +
          '<div class="rot" style="margin-bottom:4px">The theory · ' + esc(lt.titulo) + ' — ' + esc(lt.autor) + '</div>' +
          '<div class="pq" style="line-height:1.5">' + esc(lt.idea) + '</div>' +
          (ap2 ? '<div class="pq caso-linea">' + esc(ap2) + '</div>' : '') +
          '</div>';
      }
    }
    h += '</div><div style="margin-top:14px"><span class="btn pri" data-act="cerrar-result">' +
         (esDecision ? 'On with the month' : 'Next month') + '</span></div>';
    $('t-result').innerHTML = h;
    $('t-result').setAttribute('data-decision', esDecision ? '1' : '0');
    ov('ov-result', true);
  }

  /* ================= end of a job ================= */

  function cerrarPuesto() {
    var e = J;
    var cierre = Carrera.cerrar(C, e, M);
    var nuevos = Logros.evaluarPuesto(R, C, e, cierre);
    J = null;

    var titulo = cierre.final === 'renuncia' ? 'You took the call, and then the exit' :
                 cierre.final === 'imputado' ? 'You left in handcuffs through the glass door' :
                 cierre.final === 'quiebra' ? 'The company ran out of cash' :
                 cierre.final === 'despido' ? 'They asked for your resignation' :
                 cierre.final === 'venta' ? 'The company got sold' :
                 'End of your mandate at ' + cierre.empresa;
    var h = '<div class="rot">' + esc(cierre.rol) + ' · ' + cierre.meses + ' months · ' + esc(cierre.sector) + '</div>' +
      '<div class="h1">' + esc(titulo) + '</div>';

    h += '<div class="notas">';
    h += '<div class="nota"><div class="nk">Mandate</div><div class="nv ' +
         (cierre.cumplido ? 'verde' : 'rojo') + '" style="font-size:26px;margin-top:8px">' +
         (cierre.cumplido ? 'Delivered' : 'You fell short') + '</div>' +
         '<div class="pq mut">' + esc(cierre.valorMandato) + ' of ' + esc(cierre.metaMandato) + '</div></div>';
    h += '<div class="nota"><div class="nk">Reputation</div><div class="nv ' +
         (cierre.dRep >= 0 ? 'verde' : 'rojo') + '">' + (cierre.dRep >= 0 ? '+' : '') + cierre.dRep + '</div>' +
         '<div class="pq mut">now ' + Math.round(C.reputacion) + '</div></div>';
    h += '<div class="nota"><div class="nk">Move</div><div class="nv" style="font-size:22px;margin-top:10px">' +
         (cierre.promocion ? '<span class="verde">Promotion</span>' : cierre.imputado ? '<span class="rojo">Indictment</span>' : cierre.despido ? '<span class="rojo">Fired</span>' : 'Lateral') +
         '</div><div class="pq mut">' + esc(nivelPorN(C.nivel).rol) + '</div></div>';
    h += '<div class="nota" style="width:280px"><div class="nk">Your pocket</div>' +
         '<div class="nv" style="font-size:26px;margin-top:6px">' + money(cierre.ahorrado + (cierre.cascada ? cierre.cascada.aFund : 0)) + '</div>' +
         '<div class="pq mut">Vested equity: ' + (Math.round(cierre.equityVestida * 100) / 100) + '% (paper ' + money(cierre.valorPapel) + ')</div></div>';
    h += '</div>';

    h += '<div style="display:-webkit-flex;display:flex">';
    h += '<div style="width:520px;padding-right:24px">';
    var i;
    for (i = 0; i < cierre.notas.length; i++) {
      h += '<div class="linea"><div class="ic mut">•</div><div class="tx">' + esc(cierre.notas[i][0]) + ' ' + chip(cierre.notas[i][1]) + '</div></div>';
    }
    if (cierre.cascada) {
      var cs = cierre.cascada;
      h += '<div class="rot" style="margin:12px 0 4px 0">Exit waterfall</div>' +
        '<div class="req"><span class="mut">Exit value</span> <b>' + money(cs.salida) + '</b></div>' +
        '<div class="req"><span class="mut">Liquidation preferences</span> <b>' + money(cs.pref) + '</b></div>' +
        '<div class="req"><span class="mut">Investors</span> <b>' + money(cs.aInv) + '</b></div>' +
        '<div class="req"><span class="mut">You</span> <b class="verde">' + money(cs.aFund) + '</b></div>';
    }
    if (cierre.rivalTxt) {
      h += '<div class="linea" style="margin-top:8px"><div class="ic lila">◆</div><div class="tx lila">' +
           esc(cierre.rivalTxt) + '</div></div>';
    }
    h += '</div>';

    h += '<div style="width:380px"><div class="rot" style="margin-bottom:6px">What you take with you</div>';
    var HH = [['producto','Product'],['tecnologia','Tech'],['negocio','Business'],['liderazgo','Leadership']];
    for (i = 0; i < HH.length; i++) {
      var k = HH[i][0], v = Math.round(C.hab[k]), d = cierre.dHab[k];
      h += '<div class="hab"><div class="hk">' + HH[i][1] +
           (d > 0 ? ' <span class="verde">+' + d + '</span>' : '') + '<b class="num">' + v + '</b></div>' +
           '<div class="track"><i class="l" style="width:' + v + '%"></i></div></div>';
    }
    h += '<div class="pq mut" style="margin-top:4px">Every one of these accelerates the matching capability at your next company — Product, Tech, GTM and Org grow faster wherever your own skill is higher.</div>';
    for (i = 0; i < nuevos.length; i++) {
      h += '<div class="logro"><div class="med">★</div><div><div class="ln">' + esc(nuevos[i].n) + '</div>' +
           '<div class="ld">' + esc(nuevos[i].d) + '</div></div></div>';
    }
    h += '</div></div>';

    h += '<div style="margin-top:16px"><span class="btn pri" data-act="ver-ofertas">' +
         (C.final ? 'See how your career ends' : 'See what\'s on the table') + '</span></div>';
    $('p-cierre').innerHTML = h;
    guardar();
    ir('p-cierre');
  }

  /* ================= career end ================= */

  function mostrarFinal() {
    var b = Carrera.boletin(C);
    var nuevos = Logros.evaluarCarrera(R, C, b, M);
    var rv = M.rival, i;
    var ganaste = C.nivel >= rv.nivel;

    var h = '<div class="rot">' + b.anios + ' years · ' + b.puestos + ' jobs · ' +
            b.cumplidos + ' mandates delivered · ' + b.despidos + ' firings</div>' +
      '<div class="h1">Your career ended as ' + esc(b.nivel.rol) + '</div>';

    h += '<div class="notas">';
    h += '<div class="nota"><div class="nk">Net worth</div><div class="nv" style="font-size:30px;margin-top:6px">' +
         money(b.patrimonio) + '</div><div class="pq mut">salaries ' + money(b.ahorros) + ' + equity ' + money(b.equityRealizado) + '</div></div>';
    h += '<div class="nota"><div class="nk">Reputation</div><div class="nv">' + b.reputacion + '</div></div>';
    h += '<div class="nota" style="width:300px"><div class="nk">Your rival: ' + esc(rv.nombre) +
         (rv.fantasma ? ' <span class="pill frio">real player</span>' : '') + '</div>' +
         '<div class="nv" style="font-size:22px;margin-top:8px" class="num">' +
         (ganaste ? '<span class="verde">You came out on top</span>' : '<span class="rojo">They beat you</span>') + '</div>' +
         '<div class="pq mut">' + esc(rv.nombre) + ' ended as ' + esc(nivelPorN(rv.nivel).rol) +
         (rv.fundo ? ' and founded their own company' : '') + '</div>' +
         (rv.fantasma ? '<div class="pq lila" style="margin-top:4px">A real career from the Hall of Fame: they reached ' +
           esc(nivelPorN(rv.nivelReal !== undefined ? rv.nivelReal : rv.nivel).rol) + ' with ' + money(rv.patReal || 0) + '.</div>' : '') +
         '</div>';
    h += '</div>';

    h += '<div style="display:-webkit-flex;display:flex">';
    h += '<div style="width:460px;padding-right:26px">';
    h += '<div class="rot" style="margin-bottom:5px">The equity, in the end</div>';
    if (!b.detalleEquity.length) h += '<div class="pq mut">You didn\'t vest equity anywhere.</div>';
    for (i = 0; i < b.detalleEquity.length; i++) {
      var q = b.detalleEquity[i];
      h += '<div class="req"><span class="mut">' + esc(q.empresa) + ' (' + (Math.round(q.pct*100)/100) + '%)</span> <b class="num ' +
           (q.valor > 0 ? 'verde' : 'mut') + '">' + (q.valor > 0 ? money(q.valor) : 'worth nothing') + '</b></div>';
    }
    h += '<div class="pq mut" style="margin-top:8px">Most equity dies at zero. The equity that pays covers everything else. ' +
         'That\'s why the company\'s health when you leave matters — and the terms it signed before you got there.</div>';
    h += '<div class="rot" style="margin:14px 0 5px 0">Final skills</div>';
    var HH = [['producto','Product'],['tecnologia','Tech'],['negocio','Business'],['liderazgo','Leadership']];
    for (i = 0; i < HH.length; i++) {
      var v = Math.round(C.hab[HH[i][0]]);
      h += '<div class="hab"><div class="hk">' + HH[i][1] + '<b class="num">' + v + '</b></div>' +
           '<div class="track"><i class="l" style="width:' + v + '%"></i></div></div>';
    }
    h += '</div>';

    h += '<div style="width:420px"><div class="rot" style="margin-bottom:5px">Job by job</div>';
    for (i = 0; i < C.puestos.length; i++) {
      var p = C.puestos[i];
      h += '<div class="req">' + (p.cumplido ? '<span class="verde">✓</span>' : p.despido ? '<span class="rojo">✕</span>' : '<span class="mut">○</span>') +
           ' <b>' + esc(p.rol) + '</b> <span class="mut">at ' + esc(p.empresa) + ' — ' + esc(p.mandato) + '</span></div>';
    }
    for (i = 0; i < nuevos.length; i++) {
      h += '<div class="logro"><div class="med">★</div><div><div class="ln">' + esc(nuevos[i].n) + '</div>' +
           '<div class="ld">' + esc(nuevos[i].d) + '</div></div></div>';
    }
    h += '<div class="pq mut" style="margin-top:8px">You opened ' + Object.keys(C.codex).length + ' of ' + LIBROS.length + ' cards.</div>';
    h += '</div></div>';

    h += '<div id="rk-final" class="pq mut" style="margin-top:14px">Sending your career to the public Hall of Fame…</div>';
    h += '<div style="margin-top:12px"><span class="btn pri" data-act="reiniciar">Another career</span> ' +
         '<span class="btn" data-act="ranking">Hall of Fame</span> ' +
         '<span class="btn" data-act="biblio">Library</span></div>';
    $('p-final').innerHTML = h;
    try { localStorage.removeItem(CLAVE); } catch (e2) {}
    ir('p-final');
    enviarRanking(b);
  }

  function mostrarIntro() {
    $('t-intro').innerHTML = '<div class="rot">How to play</div>' +
      '<h2>Four things. That\'s it.</h2>' +
      '<div class="cuerpo2" style="margin-top:6px">' +
      '<div class="linea"><div class="ic azul">1</div><div class="tx"><b>Pick a job.</b> They hire you for ONE thing: the mandate. The bar up top is your job. Deliver it and you climb.</div></div>' +
      '<div class="linea"><div class="ic azul">2</div><div class="tx"><b>Every month, station your team\'s points.</b> Whatever you don\'t station goes to Build and pushes your projects — which fit in limited slots, and each one shipped grants the company a new capability.</div></div>' +
      '<div class="linea"><div class="ic azul">3</div><div class="tx"><b>Prioritize by probability × impact ÷ effort.</b> The dots and blocks are estimates: the more you talk to users, the less they lie to you.</div></div>' +
      '<div class="linea"><div class="ic azul">4</div><div class="tx"><b>Everything else you learn by losing.</b> When the game charges you for something, it tells you which book had it written down.</div></div>' +
      '</div>' +
      '<div style="margin-top:18px"><span class="btn pri" data-act="cerrar-intro">See the offers</span></div>';
    ov('ov-intro', true);
  }

  /* ================= library ================= */

  function mostrarBiblio() {
    var codex = C ? C.codex : {};
    var abiertos = 0, i, j;
    for (i = 0; i < LIBROS.length; i++) if (codex[LIBROS[i].id]) abiertos++;
    var h = '<div class="rot">Library</div><h2>' + abiertos + ' of ' + LIBROS.length + ' cards</h2>' +
      '<div class="pq mut" style="margin-bottom:8px">Each card opens when the concept hits you in your career. Tap an open one to read it.</div>' +
      '<div class="cuerpo2 scroll">';
    for (j = 0; j < PILARES.length; j++) {
      var pil = PILARES[j], n = 0, tot = 0, cuerpo = '';
      for (i = 0; i < LIBROS.length; i++) {
        var l = LIBROS[i];
        if (l.pilar !== pil.id) continue;
        tot++;
        var ab = !!codex[l.id];
        if (ab) n++;
        cuerpo += '<div class="lib' + (ab ? '' : ' blq') + '"' + (ab ? ' data-lib="' + l.id + '"' : '') + '>' +
          '<div class="lt">' + esc(l.titulo) + '</div>' +
          '<div class="la">' + esc(l.autor) + '</div>' +
          '<div class="lc ' + pil.cls + '">' + esc(ab ? l.concepto : 'unopened') + '</div></div>';
      }
      h += '<div class="rot ' + pil.cls + '" style="margin:10px 0 6px 0">' + esc(pil.nombre) +
           ' · ' + n + '/' + tot + '</div><div class="libs">' + cuerpo + '</div>';
    }
    h += '</div><div style="margin-top:12px"><span class="btn" data-act="cerrar-biblio">Close</span></div>';
    $('t-biblio').innerHTML = h;
    ov('ov-biblio', true);
  }

  function mostrarLibro(id) {
    var l = libroPorId(id);
    if (!l) return;
    var p2 = pilarDe(l.pilar);
    var pil = p2.nombre, cls = p2.cls;
    $('t-libro').innerHTML = '<div class="rot ' + cls + '">' + pil + ' · ' + esc(l.concepto) + '</div>' +
      '<h2>' + esc(l.titulo) + '</h2>' +
      '<div class="pq mut" style="margin-bottom:12px">' + esc(l.autor) + '</div>' +
      '<div class="cuerpo2 scroll"><div style="font-size:15px;line-height:1.6">' + esc(l.idea) + '</div>' +
      '<div class="rot" style="margin:16px 0 5px 0">How the game models it</div>' +
      '<div class="pq" style="font-size:14px;line-height:1.55">' + esc(l.juego) + '</div>' +
      (function () {
        var ap = J ? aplicarLibro(l.id, J) : null;
        if (!ap) return '';
        return '<div class="teoria-caso"><div class="rot" style="margin-bottom:4px">In your run, today</div>' +
               '<div class="pq" style="font-size:14px;line-height:1.55">' + esc(ap) + '</div></div>';
      })() + '</div>' +
      '<div style="margin-top:14px"><span class="btn" data-act="cerrar-libro">Back</span></div>';
    ov('ov-libro', true);
  }

  /* ================= public ranking ================= */

  /* Starting a career, normal or weekly. Weekly seeds the world with the ISO
     week, so everyone on the internet faces the same era sequence; the run
     is tagged with the week and lands on that week's public table. */
  function empezarCarrera(semanal) {
    var inp2 = $('perfil-in');
    if (inp2 && inp2.value) {
      inicioSel.texto = inp2.value;
      var p2 = parsearPerfil(inp2.value);
      if (p2.nombre && !inicioSel.nombreManual) inicioSel.nombre = p2.nombre;
      if (p2.nivel !== null) { inicioSel.nivel = p2.nivel; inicioSel.rol = p2.rol; }
      if (p2.bg && !inicioSel.bgManual) inicioSel.bg = p2.bg;
    }
    var inpN2 = $('nombre-in');
    if (inpN2 && inpN2.value) inicioSel.nombre = inpN2.value;
    C = Carrera.nueva(inicioSel.nombre, inicioSel.nivel, inicioSel.bg);
    if (semanal) {
      C.semana = Ranking.semana();
      M = Mundo.nuevo(Ranking.semilla(C.semana));
    } else {
      M = Mundo.nuevo();
    }
    C.rkId = Ranking.token() + '-' + new Date().getTime();
    J = null; ofertaSel = -1;
    if (M.rival) { M.rival.nivel = C.nivel; M.rival.reputacion = C.reputacion; }
    pedirRivalReal();
    Carrera.ofertas(C, M); guardar();
    var sabe = false;
    try { sabe = !!localStorage.getItem('fundadores.sabe'); } catch (e2) {}
    if (!sabe) mostrarIntro(); else renderOfertas();
  }

  /* The ghost rival: a real player's career from the ranking replaces the
     NPC. They climb with the usual dice but stop at the level they actually
     reached. Arrives async; if it never does, the NPC stays. */
  function pedirRivalReal() {
    var id = C.rkId;
    Ranking.rival(C.nivel, function (g) {
      if (!g || !g.ok || !g.nombre || !C || C.rkId !== id || !M) return;
      M.rival = {
        /* the rival is always Lucas M; the real career possesses him */
        nombre:'Lucas M', nivel:C.nivel,
        reputacion:Math.round(g.reputacion || 38),
        hitos:[], fundo:false, fantasma:true,
        tope:Math.max(g.nivel || 0, C.nivel),
        nivelReal:g.nivel || 0, patReal:g.patrimonio || 0
      };
      guardar();
    });
  }

  function rachaDe(c) {
    var mx = 0, s = 0, i;
    for (i = 0; i < c.puestos.length; i++) {
      if (c.puestos[i].cumplido) { s++; if (s > mx) mx = s; } else s = 0;
    }
    return mx;
  }
  function huboVenta(c) {
    for (var i = 0; i < c.puestos.length; i++) if (c.puestos[i].final === 'venta') return true;
    return false;
  }

  function enviarRanking(b) {
    if (!C || C.rkEnviado) return;
    C.rkEnviado = true;
    var nLogros = 0, k;
    for (k in R.logros) if (R.logros.hasOwnProperty(k) && R.logros[k]) nLogros++;
    var datos = {
      id:C.rkId || (Ranking.token() + '-x'), token:Ranking.token(),
      nombre:C.nombre && C.nombre !== 'you' ? C.nombre : 'Anonymous',
      faccion:Ranking.faccion(), semana:C.semana || null,
      patrimonio:b.patrimonio, nivel:C.nivel, reputacion:b.reputacion,
      anios:parseFloat(b.anios) || 0, puestos:b.puestos,
      cumplidos:b.cumplidos, despidos:b.despidos, racha:rachaDe(C),
      logros:nLogros, fundo:!!C.yaFundo, vendio:huboVenta(C)
    };
    Ranking.enviar(datos, function (r) {
      var el = $('rk-final');
      if (!el) return;
      if (!r || !r.ok) {
        el.innerHTML = 'The public Hall of Fame is out of reach right now — your career still counts at home.';
        return;
      }
      var t = 'Public Hall of Fame: you\'re <b class="verde">#' + r.pos + '</b> of ' + r.total + ' players by net worth.';
      if (r.posSemanal) t += ' This week: <b class="verde">#' + r.posSemanal + '</b> of ' + r.totalSemanal + '.';
      if (r.destronaste) {
        t += ' <span class="lila">You dethroned ' + esc(r.destronaste) + ' as the #1.</span>';
        var g = Logros.dar(R, 'regicidio');
        Logros.guardar(R);
        if (g) {
          t += '<div class="logro"><div class="med">★</div><div><div class="ln">' + esc(g.n) + '</div>' +
               '<div class="ld">' + esc(g.d) + '</div></div></div>';
        }
      }
      el.innerHTML = t;
    });
  }

  function filasRk(arr, valor) {
    if (!arr || !arr.length) return '<div class="pq mut">Nobody yet. Be the first.</div>';
    var h = '', i;
    for (i = 0; i < arr.length; i++) {
      var e = arr[i];
      var fac = e.faccion === 'growth' ? ' <span class="pill hot">G</span>' :
                e.faccion === 'craft' ? ' <span class="pill frio">C</span>' : '';
      h += '<div class="req rkfila' + (e.vos ? ' rkvos' : '') + '"><span class="mut num">' + (i + 1) + '.</span> ' +
           '<b>' + esc(e.nombre) + '</b>' + fac +
           '<span class="rkval num verde">' + valor(e) + '</span></div>';
    }
    return h;
  }

  function renderRanking(d, cargando) {
    var h = '<div class="rot">Public ranking · everyone who ever finished a career</div>' +
            '<div class="h1">Hall of Fame</div>';
    if (cargando) {
      h += '<div class="pq mut" style="margin-top:14px">Reaching the Hall of Fame…</div>';
    } else if (!d || !d.ok) {
      h += '<div class="pq mut" style="margin-top:14px">The Hall of Fame is out of reach right now. It lives on the internet — try again in a bit.</div>';
    } else {
      h += '<div class="pq mut" style="margin-top:4px">' + d.jugadores + ' players · ' + d.carreras + ' careers finished' +
           (d.tu && d.tu.pos ? ' · you\'re <b class="verde">#' + d.tu.pos + '</b> by net worth' : '') + '</div>';
      if (d.bounty) {
        h += '<div class="caja2" style="margin-top:12px;max-width:660px"><span class="lila">BOUNTY</span> · beat <b>' +
             esc(d.bounty.nombre) + '</b> (' + money(d.bounty.patrimonio) +
             ') and the <b>Regicide</b> achievement is yours.</div>';
      }
      h += '<div class="rkcols scroll" style="-webkit-flex:1;flex:1;min-height:0">';
      h += '<div style="width:330px;padding-right:26px">';
      h += '<div class="rot" style="margin-bottom:6px">World ranking · net worth · all ' + d.jugadores + ' players</div>';
      h += filasRk(d.tablas.patrimonio, function (e) { return money(e.patrimonio); });
      h += '</div>';
      h += '<div style="width:310px;padding-right:26px">';
      h += '<div class="rot" style="margin-bottom:6px">This week · ' + esc(d.semana) + '</div>';
      h += filasRk(d.tablas.semanal, function (e) { return money(e.patrimonio); });
      if (d.semanaPasada) {
        h += '<div class="pq mut" style="margin-top:6px">Last week: <b>' + esc(d.semanaPasada.nombre) +
             '</b> won with ' + money(d.semanaPasada.patrimonio) + '.</div>';
      }
      var g2 = d.facciones.growth, c2 = d.facciones.craft;
      var totalC = g2.cumplidos + c2.cumplidos;
      var pg = totalC ? Math.round(g2.cumplidos / totalC * 100) : 50;
      h += '<div class="rot" style="margin:14px 0 4px 0">Faction war · mandates delivered</div>';
      h += '<div class="facbar"><i style="width:' + pg + '%;background:#e8a33d"></i>' +
           '<i style="width:' + (100 - pg) + '%;background:#5aa9f0"></i></div>';
      h += '<div class="pq"><span style="color:#e8a33d"><b>Growth Legion</b> ' + g2.cumplidos + '</span> · ' +
           '<span style="color:#5aa9f0"><b>Craft Guild</b> ' + c2.cumplidos + '</span></div>';
      h += '</div>';
      h += '<div style="width:260px">';
      h += '<div class="rot" style="margin-bottom:6px">Highest role</div>';
      h += filasRk(d.tablas.nivel, function (e) { return esc(nivelPorN(e.nivel).corto); });
      h += '<div class="rot" style="margin:12px 0 6px 0">Mandate streak</div>';
      h += filasRk(d.tablas.racha, function (e) { return e.racha + ' in a row'; });
      h += '<div class="rot" style="margin:12px 0 6px 0">Achievements</div>';
      h += filasRk(d.tablas.logros, function (e) { return e.logros + ' of ' + Logros.DEFS.length; });
      h += '</div></div>';
    }
    h += '<div style="margin-top:14px"><span class="btn" data-act="cerrar-ranking">Back</span></div>';
    $('p-ranking').innerHTML = h;
  }

  function abrirRanking() {
    var ps = document.getElementsByClassName('pantalla'), i;
    for (i = 0; i < ps.length; i++) {
      if (ps[i].className.indexOf('on') >= 0 && ps[i].id !== 'p-ranking') rankingVolver = ps[i].id;
    }
    renderRanking(null, true);
    ir('p-ranking');
    Ranking.traer(function (d) {
      var pr = $('p-ranking');
      if (pr && pr.className.indexOf('on') >= 0) renderRanking(d, false);
    });
  }

  /* ================= clicks ================= */

  function attr(nodo, a) {
    while (nodo && nodo !== document) {
      if (nodo.getAttribute) { var v = nodo.getAttribute(a); if (v !== null) return v; }
      nodo = nodo.parentNode;
    }
    return null;
  }

  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t && t.id === 'nombre-in') {
      inicioSel.nombre = t.value || null;
      inicioSel.nombreManual = !!t.value;
      return;
    }
    if (!t || t.id !== 'perfil-in') return;
    inicioSel.texto = t.value;
    var p = parsearPerfil(t.value);
    if (p.nombre && !inicioSel.nombreManual) inicioSel.nombre = p.nombre;
    if (p.nivel !== null) { inicioSel.nivel = p.nivel; inicioSel.rol = p.rol; }
    if (p.bg && !inicioSel.bgManual) inicioSel.bg = p.bg;
    if (/linkedin\.com\/in\//i.test(t.value)) consultarLinkedin(t.value);
    renderInicio();
  }, false);

  document.addEventListener('click', function (ev) {
    var t = ev.target, v;

    v = attr(t, 'data-bg');
    if (v !== null && !J) {
      inicioSel.bg = v; inicioSel.bgManual = true;
      var inpN0 = $('nombre-in'); if (inpN0 && inpN0.value) { inicioSel.nombre = inpN0.value; inicioSel.nombreManual = true; }
      var inpU0 = $('perfil-in'); if (inpU0) inicioSel.texto = inpU0.value;
      renderInicio();
      return;
    }

    v = attr(t, 'data-rol');
    if (v !== null) {
      inicioSel.nivel = parseInt(v, 10);
      inicioSel.rol = nivelPorN(inicioSel.nivel).rol;
      var inp = $('perfil-in');
      if (inp) inicioSel.texto = inp.value;
      var inpN1 = $('nombre-in'); if (inpN1 && inpN1.value) { inicioSel.nombre = inpN1.value; inicioSel.nombreManual = true; }
      renderInicio();
      return;
    }

    v = attr(t, 'data-fac');
    if (v !== null) {
      Ranking.setFaccion(Ranking.faccion() === v ? null : v);
      var inpF = $('perfil-in');
      if (inpF) inicioSel.texto = inpF.value;
      renderInicio();
      return;
    }

    v = attr(t, 'data-tip');
    if (v) { mostrarTip(v); return; }

    v = attr(t, 'data-lib');
    if (v) { mostrarLibro(v); return; }

    v = attr(t, 'data-oferta');
    if (v !== null) { ofertaSel = parseInt(v, 10); renderOfertas(); return; }

    v = attr(t, 'data-op');
    if (v !== null && evActual) { elegirOpcion(parseInt(v, 10)); return; }

    v = attr(t, 'data-mas');
    if (v && J) {
      if (sinUsar() > 0) { plan[v]++; renderAsignacion(); renderBacklog(); renderBarra(); tourEvento('estacion'); }
      return;
    }
    v = attr(t, 'data-menos');
    if (v && J) {
      if (plan[v] > 0) { plan[v]--; renderAsignacion(); renderBacklog(); renderBarra(); }
      return;
    }
    v = attr(t, 'data-pmas');
    if (v && J) {
      var falta1 = Math.ceil(Motor.costoDe(J, v) - (J.enVuelo[v] || 0)) - (plan.asig[v] || 0);
      if (sinUsar() > 0 && falta1 > 0) { plan.asig[v] = (plan.asig[v] || 0) + 1; renderAsignacion(); renderBacklog(); renderBarra(); }
      return;
    }
    v = attr(t, 'data-pmenos');
    if (v && J) {
      if ((plan.asig[v] || 0) > 0) { plan.asig[v]--; renderAsignacion(); renderBacklog(); renderBarra(); }
      return;
    }
    v = attr(t, 'data-quitar');
    if (v && J) {
      var qi = plan.orden.indexOf(v);
      if (qi >= 0) { plan.orden.splice(qi, 1); delete plan.asig[v]; }
      renderAsignacion(); renderBacklog(); renderBarra();
      return;
    }

    v = attr(t, 'data-ap');
    if (v && J) {
      if (slotsUsados() < J.slots && plan.orden.indexOf(v) < 0 && sinUsar() > 0) {
        plan.orden.push(v);
        plan.asig[v] = Math.min(sinUsar(), Math.ceil(Motor.costoDe(J, v)));
        tourEvento('proyecto');
      }
      renderAsignacion(); renderBacklog(); renderBarra();
      return;
    }

    v = attr(t, 'data-act');
    if (!v) return;

    if (v === 'nueva') { empezarCarrera(false); }
    else if (v === 'semanal') { empezarCarrera(true); }
    else if (v === 'ranking') { abrirRanking(); }
    else if (v === 'cerrar-ranking') { ir(rankingVolver); }
    else if (v === 'cerrar-intro') {
      try { localStorage.setItem('fundadores.sabe', '1'); } catch (e3) {}
      ov('ov-intro', false);
      renderOfertas();
    }
    else if (v === 'empezar-puesto') {
      if (J) {
        var yaVisto = J.briefVisto;
        J.briefVisto = true; guardar();
        if (yaVisto) renderJuego(); else { nuevoMes(); tourAjustarRol(); tourEmpezar(); }
      }
    }
    else if (v === 'tour-sigo') { tourPaso++; if (tourPaso >= TOUR.length) tourFin(); else tourRender(); }
    else if (v === 'tour-salir') { tourFin(); }
    else if (v === 'ver-objetivo') { if (J) mostrarBrief(); }
    else if (v === 'continuar') {
      if (cargar()) {
        if (J && !J.briefVisto) { mostrarBrief(); }
        else if (J) { nuevoMes(); }
        else if (C.final) { mostrarFinal(); }
        else { ofertaSel = -1; if (!C.ofertas) Carrera.ofertas(C, M); renderOfertas(); }
      }
    }
    else if (v === 'aceptar') {
      if (ofertaSel >= 0 && C.ofertas) {
        J = Carrera.aceptar(C, C.ofertas[ofertaSel], M);
        hudPrev = {};
        guardar();
        mostrarBrief();
      }
    }
    else if (v === 'ver-ofertas') {
      if (C.final) { mostrarFinal(); return; }
      ofertaSel = -1;
      Carrera.ofertas(C, M);
      guardar();
      renderOfertas();
    }
    else if (v === 'volver-inicio') { renderInicio(); ir('p-inicio'); }
    else if (v === 'volver-ofertas') {
      if (J && !J.briefVisto) {
        delete C.trabajadas[J.empresaId];
        C.ofertaActual = null;
        J = null;
        guardar();
        renderOfertas();
      }
    }
    else if (v === 'biblio') { mostrarBiblio(); }
    else if (v === 'cerrar-biblio') { ov('ov-biblio', false); }
    else if (v === 'cerrar-libro') { ov('ov-libro', false); }
    else if (v === 'ejecutar') {
      if (tourActivo()) tourFin();
      var bld = $('building');
      bld.className = 'on';
      bld.innerHTML = '<div class="bld-in"><div class="bld-t">Building<span class="bdots"><i>.</i><i>.</i><i>.</i></span></div>' +
        '<div class="bld-s">The month runs: code ships, users decide, the market answers.</div></div>';
      setTimeout(function () { bld.className = ''; ejecutar(); }, 1100);
    }
    else if (v === 'ronda') { if (J) { J.levantando = true; evActual = eventoAplicable(J, C); if (evActual) mostrarEvento(evActual); } }
    else if (v === 'cerrar-result') {
      var esDec = $('t-result').getAttribute('data-decision') === '1';
      ov('ov-result', false);
      if (esDec) renderJuego(); else nuevoMes();
    }
    else if (v === 'reiniciar') { C = null; M = null; J = null; R = Logros.cargar(); renderInicio(); ir('p-inicio'); }
  }, false);

  /* scale the 1024x768 stage to the viewport, centered. iPad 3 lands at 1. */
  function escalar() {
    var st = document.getElementById('stage');
    if (!st) return;
    var w = window.innerWidth || 1024, h2 = window.innerHeight || 768;
    var s = Math.min(w / 1024, h2 / 768);
    if (s > 0.98 && s < 1.02) s = 1;
    escalaActual = s;
    var t = 'translate(-50%,-50%) scale(' + s + ')';
    st.style.webkitTransform = t;
    st.style.transform = t;
    st.className = s === 1 ? '' : 'suelto';
  }
  window.onresize = escalar;
  escalar();

  renderInicio();
})();
