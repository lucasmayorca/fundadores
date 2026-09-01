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
    usab:'How little users need to think. Multiplies the conversion of ALL traffic you bring.'
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

  function renderInicio() {
    var hay = false;
    try { hay = !!localStorage.getItem(CLAVE); } catch (e) {}
    var h = '<div class="h1">Founders</div>' +
      '<div class="pq mut" style="margin-top:8px;max-width:680px">A career in product: from analyst to the big ' +
      'chair, company by company, in a world that changes eras without warning you. The game doesn\'t explain ' +
      'mistakes up front: it charges you for them, then tells you which book had it written down.</div>';

    h += '<div class="caja2" style="margin-top:18px;max-width:680px"><div class="rot" style="margin-bottom:6px">Who are you? <span class="mut" style="text-transform:none;letter-spacing:0">(optional — you can always start from zero)</span></div>' +
      '<input type="text" id="perfil-in" placeholder="Paste your LinkedIn URL or your current title..." ' +
      'value="' + esc(inicioSel.texto || '') + '">' +
      '<div style="margin-top:8px">';
    for (var ti = 0; ti < ESCALAFON.length; ti++) {
      h += '<span class="rolchip' + (inicioSel.nivel === ti ? ' sel' : '') + '" data-rol="' + ti + '">' +
           esc(ESCALAFON[ti].corto) + '</span>';
    }
    h += '</div><div class="pq mut" style="margin-top:7px" id="perfil-eco">' +
      (inicioSel.buscando ? '<span class="azul">Reading your LinkedIn profile…</span> · ' : '') +
      (inicioSel.deLinkedin ? '<span class="verde">From LinkedIn:</span> ' + esc(inicioSel.deLinkedin) + ' · ' : '') +
      (inicioSel.nombre ? 'Starting as <b>' + esc(inicioSel.nombre) + '</b> · ' : '') +
      'You start the career as <b>' + esc(nivelPorN(inicioSel.nivel).rol) + '</b>' +
      (inicioSel.nivel > 0 ? ' — your real rung. Or tap APM to run the whole ladder.' : ' — the full climb, from the bottom.') +
      '</div></div>';

    h += '<div style="display:-webkit-flex;display:flex;margin-top:18px">';
    h += '<div style="width:560px;padding-right:30px">';
    h += '<div class="rot" style="margin-bottom:8px">Hall of records</div>';
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
    h += '<div style="margin-top:22px">' +
      '<span class="btn pri" data-act="nueva">New career</span> ' +
      (hay ? '<span class="btn" data-act="continuar">Continue</span> ' : '') +
      '<span class="btn sec" data-act="biblio">Library</span></div>';
    h += '</div>';

    h += '<div style="width:360px"><div class="rot" style="margin-bottom:8px">Achievements</div>';
    var k, n = 0;
    for (k = 0; k < Logros.DEFS.length; k++) {
      var d = Logros.DEFS[k], ok = !!R.logros[d.id];
      if (ok) n++;
      h += '<div class="req ' + (ok ? 'verde' : 'mut') + '" style="' + (ok ? '' : 'opacity:0.45') + '">' +
           (ok ? '★ ' : '☆ ') + esc(d.n) + ' <span class="mut" style="font-size:11px">— ' + esc(d.d) + '</span></div>';
    }
    h += '<div class="pq mut" style="margin-top:6px">' + n + ' of ' + Logros.DEFS.length + '</div></div>';
    h += '</div>';
    $('p-inicio').innerHTML = h;
  }

  /* ================= OFFERS ================= */

  function renderOfertas(cierreExtra) {
    var era = Mundo.era(M), ofs = C.ofertas, i;
    var h = '<div class="rot">Month ' + M.mes + ' of your career · ' + esc(nivelPorN(C.nivel).rol) +
            ' · reputation ' + Math.round(C.reputacion) + '</div>' +
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
        '<div class="mandato"><div class="rot">Your mandate · ' + o.meses + ' months</div>' + esc(o.mandatoTxt) + '</div>' +
        '<div class="fila">Salary <b>' + money(o.sueldo) + '/yr</b> · Equity <b>' +
          (o.fundar ? 'yours' : o.equity + '%') + '</b></div>' +
        '<div class="fila">Risk <b>' + esc(o.riesgoTxt) + '</b> · Project slots <b>' + (o.slots || 3) + '</b></div>' +
        '<div class="fila">Bets: <b>' + (o.perfil === 'grandes' ? 'few and big' : o.perfil === 'chicas' ? 'many and small' : o.perfil === 'incierto' ? 'hard to estimate' : 'balanced portfolio') + '</b></div>' +
        '</div>';
    }
    h += '</div>';

    h += '<div style="margin-top:18px">' +
      '<span class="btn pri' + (ofertaSel >= 0 ? '' : ' off') + '" data-act="aceptar">Take the job</span> ' +
      '<span class="btn sec" data-act="biblio">Library ' + Object.keys(C.codex).length + '/' + LIBROS.length + '</span></div>';
    $('p-ofertas').innerHTML = h;
    ir('p-ofertas');
  }

  /* ================= BRIEFING (day one) ================= */

  function faseClase(fc) {
    return fc === 'PRE-PMF' ? 'ambar' : fc === 'VALIDATING PMF' ? 'azul' : 'verde';
  }

  function mostrarBrief() {
    var era = Mundo.era(M);
    var calorTxt = J.calor > 0 ? '<span class="hot2">hot</span>' :
                   J.calor < 0 ? '<span class="frio2">cold</span>' : 'steady';
    var m2 = mandatoPorId(J.mandatoId);
    var h = '<div class="rot">' + esc(J.sector) + ' · ' + esc(ETAPAS[J.etapa].nombre) + ' · your day one as ' + esc(J.rol) + '</div>' +
      '<div class="h1">' + esc(J.empresa) + '</div>';

    h += '<div class="fasebox"><span class="fasechip ' + faseClase(J.faseCorta) + '">' + esc(J.faseCorta) + '</span>' +
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
    h += '<div class="rot" style="margin-bottom:6px">What pays off at this stage</div><div>';
    for (i = 0; i < J.prima.length; i++) {
      nec = null;
      for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === J.prima[i]) nec = NECESIDADES[k];
      if (nec) h += '<span class="tagobj up">▲ ' + esc(nec.nombre) + '</span>';
    }
    h += '</div>';
    if (J.castiga.length) {
      h += '<div class="rot" style="margin:10px 0 6px 0">Barely matters yet</div><div>';
      for (i = 0; i < J.castiga.length; i++) {
        nec = null;
        for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === J.castiga[i]) nec = NECESIDADES[k];
        if (nec) h += '<span class="tagobj down">▽ ' + esc(nec.nombre) + '</span>';
      }
      h += '</div>';
    }
    h += '<div class="pq mut" style="margin-top:8px">Bets marked ▲ push this goal: their real impact pays ×1.3. The ▽ ones pay half.</div>';

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
         '<div class="rot" style="margin-bottom:4px">Where this stage comes from</div>' +
         '<div class="pq" style="line-height:1.5">' + teo + '</div>' +
         '<div class="pq caso-linea">' + caso + '</div></div>';
    h += '</div>';

    h += '<div style="width:400px"><div class="rot" style="margin-bottom:8px">Who you\'ll be working with</div>';
    var elencoKeys = ['ceo','cto','ventas','estrella'];
    for (i = 0; i < elencoKeys.length; i++) {
      var per = J.elenco[elencoKeys[i]];
      h += '<div class="quien" style="margin:4px 0"><div class="avatar">' + esc(per.nombre.charAt(0)) + '</div>' +
           '<div><div class="qn">' + esc(per.nombre) + '</div><div class="qc">' + esc(per.cargo) + '</div></div></div>';
    }
    h += '</div></div>';

    h += '<div style="margin-top:16px"><span class="btn pri" data-act="empezar-puesto">' + (J.briefVisto ? 'Back to the month' : 'Start month 1') + '</span></div>';
    $('p-brief').innerHTML = h;
    ir('p-brief');
  }

  /* ================= GAME ================= */

  function nuevoMes() {
    plan = { desc:0, plat:0, fiab:0, crec:0, apuestas:[] };
    notasEvento = [];
    renderJuego();
    evActual = eventoAplicable(J);
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
    var h = '<span class="fasechip mini ' + faseClase(J.faseCorta) + '" data-act="ver-objetivo">' + esc(J.faseCorta) + '</span>' +
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
    { k:'desc', n:'Discover', ic:'◎', col:'#5aa9f0', req:'desc', lib:'torres',
      rinde:function (v) { return '+' + Math.round(v * 1.1 * J.calidadDesc * (1 + J.hab.producto / 200)) + ' evidence'; } },
    { k:'plat', n:'Platform', ic:'⚙', col:'#35c46a', req:'plat', lib:'fowler',
      rinde:function (v) { return '−' + Math.round(v * 0.55 * (1 + J.hab.tecnologia / 150)) + ' debt'; } },
    { k:'fiab', n:'Reliability', ic:'⚖', col:'#4ecdc4', req:'fiab', lib:'sre',
      rinde:function (v) { return '+' + Math.round(v * 0.45) + ' uptime'; } },
    { k:'crec', n:'Growth', ic:'↗', col:'#e86ba3', req:'crec', lib:'chasm',
      rinde:function (v) { return '+reach · $' + Math.round(v * 0.9) + 'k spend'; } }
  ];

  function asignado() { return plan.desc + plan.plat + plan.fiab + plan.crec; }
  function paraBuild() { return Math.max(0, Motor.capacidadPropia(J) - asignado()); }

  function renderAsignacion() {
    var mio = Motor.capacidadPropia(J), build = paraBuild();
    var h = '<div class="rot" style="margin-bottom:6px">1 · Station your team · ' +
            '<b class="num">' + mio + ' pts</b> this month</div>';

    /* the energy bar: every point accounted, colored by station */
    h += '<div class="ebar">';
    var i;
    for (i = 0; i < ESTACIONES.length; i++) {
      var v = plan[ESTACIONES[i].k];
      if (v > 0) h += '<i style="width:' + (v / mio * 100) + '%;background:' + ESTACIONES[i].col + '"></i>';
    }
    h += '<i style="width:' + (build / mio * 100) + '%;background:#e8a33d"></i></div>';

    h += '<div class="estaciones">';
    for (i = 0; i < ESTACIONES.length; i++) {
      var st = ESTACIONES[i], vv = plan[st.k];
      if (J.palancas.indexOf(st.req) < 0) {
        var falta = '';
        for (var k = 0; k < ESCALAFON.length; k++) {
          if (ESCALAFON[k].palancas.indexOf(st.req) >= 0) { falta = ESCALAFON[k].corto; break; }
        }
        h += '<div class="stcard bloq"><div class="stn">' + st.ic + ' ' + st.n + '</div><div class="strinde">with ' + falta + '</div></div>';
        continue;
      }
      h += '<div class="stcard' + (vv > 0 ? ' viva' : '') + '">' +
        '<div class="stn" style="color:' + (vv > 0 ? st.col : '#8b93a1') + '">' + st.ic + ' ' + st.n + chip(st.lib) + '</div>' +
        '<div class="ctrl" style="margin-top:5px">' +
        '<div class="b' + (vv <= 0 ? ' off' : '') + '" data-menos="' + st.k + '">−</div>' +
        '<div class="n num">' + vv + '</div>' +
        '<div class="b' + (build <= 0 ? ' off' : '') + '" data-mas="' + st.k + '">+</div>' +
        '</div>' +
        '<div class="strinde">' + (vv > 0 ? st.rinde(vv) : '—') + '</div></div>';
    }
    /* build: donde va todo lo que no estacionaste */
    h += '<div class="stcard viva build"><div class="stn" style="color:#e8a33d">⚒ Build</div>' +
      '<div class="n num" style="font-size:21px;margin-top:4px">' + build + '</div>' +
      '<div class="strinde">pushes your projects below</div></div>';
    h += '</div>';
    $('capa').innerHTML = h;
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
    var n = plan.apuestas.length, id;
    for (id in J.enVuelo) if (J.enVuelo.hasOwnProperty(id)) n++;
    return n;
  }

  function renderBacklog() {
    var usados = slotsUsados(), i2, cajas = '';
    for (i2 = 0; i2 < J.slots; i2++) cajas += '<span class="slot' + (i2 < usados ? ' lleno' : '') + '"></span>';
    var h = '<div class="rot" style="margin:8px 0 7px 0">2 · Pick your projects · slots ' + cajas +
      ' <span class="pill libro" data-lib="momtest">confidence ' + Motor.confianza(J) + '</span></div>';
    var id, i, a, d;
    for (id in J.enVuelo) if (J.enVuelo.hasOwnProperty(id)) {
      a = Motor.apuesta(id);
      var cst = Motor.costoDe(J, id);
      var prog = Math.min(100, Math.round((J.enVuelo[id] / cst) * 100));
      h += '<div class="ap vuelo"><div class="t"><div class="n2">' + esc(a.n) + '</div>' +
        '<div class="track" style="margin-top:4px;width:200px"><i class="a" style="width:' + prog + '%"></i></div></div>' +
        '<div class="c"><div class="imp ambar num">' + prog + '%</div></div></div>';
    }
    for (i = 0; i < J.backlog.length; i++) {
      id = J.backlog[i]; a = Motor.apuesta(id);
      var nec = null, k;
      for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === a.nec) nec = NECESIDADES[k];
      var sel = plan.apuestas.indexOf(id) >= 0;
      d = Motor.estimacionDetalle(J, id);
      var cabe = sel || slotsUsados() < J.slots;
      var obj = J.prima.indexOf(a.nec) >= 0 ? '<span class="tagobj mini">▲</span>' :
                J.castiga.indexOf(a.nec) >= 0 ? '<span class="tagobj down mini">▽</span>' : '';
      var DA = { core:'→ product value', flujo:'→ +usability', datos:'→ +evidence',
                 integra:'→ gate', soporte:'→ gate', segur:'→ gate', escala:'→ +capacity' };
      var da = '<span class="da">' + DA[a.nec] + '</span>';
      h += '<div class="ap' + (sel ? ' sel' : '') + (cabe ? '' : ' nocabe') + '" data-ap="' + id + '">' +
        '<div class="t"><div class="n2">' + esc(a.n) + '<span class="pill">' + esc(nec.corto) + '</span>' + obj + '</div>' +
        '<div class="viz">' +
          '<span class="vlbl">' + tip('prob','prob') + '</span>' + dots(d.prob) +
          '<span class="vlbl">' + tip('impact','impact') + '</span>' + blocks(d.mag) + da +
        '</div></div>' +
        '<div class="c"><span class="esf e' + d.esf + '">' + d.esf + '</span>' +
        '<div class="cst num">' + d.costo + ' pts</div></div></div>';
    }
    $('backlog').innerHTML = h;
  }

  function palabra(v, cortes, palabras) {
    if (v >= cortes[0]) return '<span class="verde">' + palabras[0] + '</span>';
    if (v >= cortes[1]) return '<span class="ambar">' + palabras[1] + '</span>';
    return '<span class="rojo">' + palabras[2] + '</span>';
  }

  function barraEstado(lbl, v, invertido, libro) {
    var x = invertido ? 100 - v : v;
    var cls = x >= 62 ? 'v' : x >= 38 ? 'a' : 'r';
    return '<div class="est"><span class="elbl">' + lbl + (libro ? chip(libro) : '') + '</span>' +
      '<span class="etrk"><span class="track"><i class="' + cls + '" style="width:' + Math.round(Math.max(4, Math.min(100, v))) + '%"></i></span></span></div>';
  }

  function renderPanel() {
    var h = '', i;

    h += '<div class="caja2"><div class="rot" style="margin-bottom:6px">Where we stand</div>';
    h += barraEstado(tip('evid','Evidence'), J.evidencia, false, 'lean');
    h += barraEstado(tip('debt','Debt'), J.deuda, true, 'fowler');
    h += barraEstado(tip('morale','Morale'), J.moral, false, null);
    if ((J.lupa || 0) >= 25) h += barraEstado(tip('heat','The Heat'), J.lupa, true, null);
    if (J.rolN >= 2) {
      h += barraEstado(tip('load','Load'), Motor.carga(J) * 100, true, 'ddia');
      h += barraEstado(tip('usab','Usability'), J.usabilidad, false, 'krug');
    }
    if (J.rolN >= 3) {
      h += barraEstado(tip('ebudget','Error budget'), J.presupuestoError, false, 'sre');
      h += barraEstado(tip('focus','Focus'), J.foco, false, 'grove');
    }
    h += '<div class="pq mut" style="margin-top:6px">' + J.ing + ' eng · ' + J.prod + ' prod · ' + J.gtm + ' gtm' +
         (J.rampa.length ? ' · <span class="ambar">' + J.rampa.length + ' ramping up</span>' : '') + '</div></div>';

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
    var h = '<div class="pts"><span class="ambar">⚒ ' + paraBuild() + ' pts</span> on ' +
      slotsUsados() + ' project' + (slotsUsados() === 1 ? '' : 's') + ' this month</div>';
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
    var quien = ev.quien && J.elenco[ev.quien] ? J.elenco[ev.quien] : null;
    var h = '<div class="rot">Month ' + (J.mesPuesto + 1) + ' at ' + esc(J.empresa) + '</div>' +
            '<h2>' + esc(ev.titulo) + '</h2>';
    if (quien) {
      h += '<div class="quien"><div class="avatar">' + esc(quien.nombre.charAt(0)) + '</div>' +
           '<div><div class="qn">' + esc(quien.nombre) + '</div><div class="qc">' + esc(quien.cargo) + '</div></div></div>';
    }
    h += '<div class="pq mut" style="margin-bottom:4px">' + esc(ev.texto) + '</div><div class="cuerpo2 scroll">';
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
    var reparto = { desc:plan.desc, plat:plan.plat, fiab:plan.fiab, crec:plan.crec,
                    cons:paraBuild(), apuestas:plan.apuestas };
    var log = Motor.simular(J, reparto, M);
    var nuevas = fichasNuevas(J, C), fi;
    for (fi = 0; fi < nuevas.length; fi++) {
      log.push({ tipo:'nota', texto:'A card opened in the library: the moment you\'re living has a name.',
                 libro:nuevas[fi].id });
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
      ic = log[i].tipo === 'bueno' ? '<span class="verde">▲</span>' :
           log[i].tipo === 'malo'  ? '<span class="rojo">▼</span>' :
           log[i].tipo === 'nota'  ? '<span class="azul">✎</span>' : '<span class="mut">•</span>';
      h += '<div class="linea"><div class="ic">' + ic + '</div><div class="tx">' +
           esc(log[i].texto) + ' ' + (log[i].libro ? chip(log[i].libro) : '') + '</div></div>';
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

    var titulo = cierre.final === 'imputado' ? 'You left in handcuffs through the glass door' :
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
    h += '<div class="nota" style="width:300px"><div class="nk">Your rival: ' + esc(rv.nombre) + '</div>' +
         '<div class="nv" style="font-size:22px;margin-top:8px" class="num">' +
         (ganaste ? '<span class="verde">You came out on top</span>' : '<span class="rojo">They beat you</span>') + '</div>' +
         '<div class="pq mut">' + esc(rv.nombre) + ' ended as ' + esc(nivelPorN(rv.nivel).rol) +
         (rv.fundo ? ' and founded their own company' : '') + '</div></div>';
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
    h += '<div class="pq mut" style="margin-top:8px">You opened ' + Object.keys(C.codex).length + ' of 20 cards.</div>';
    h += '</div></div>';

    h += '<div style="margin-top:16px"><span class="btn pri" data-act="reiniciar">Another career</span> ' +
         '<span class="btn" data-act="biblio">Library</span></div>';
    $('p-final').innerHTML = h;
    try { localStorage.removeItem(CLAVE); } catch (e2) {}
    ir('p-final');
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
    if (!t || t.id !== 'perfil-in') return;
    inicioSel.texto = t.value;
    var p = parsearPerfil(t.value);
    if (p.nombre) inicioSel.nombre = p.nombre;
    if (p.nivel !== null) { inicioSel.nivel = p.nivel; inicioSel.rol = p.rol; }
    if (/linkedin\.com\/in\//i.test(t.value)) consultarLinkedin(t.value);
    /* scale the 1024x768 stage to the viewport, centered. iPad 3 lands at 1. */
  function escalar() {
    var st = document.getElementById('stage');
    if (!st) return;
    var w = window.innerWidth || 1024, h2 = window.innerHeight || 768;
    var s = Math.min(w / 1024, h2 / 768);
    if (s > 0.98 && s < 1.02) s = 1;
    var t = 'translate(-50%,-50%) scale(' + s + ')';
    st.style.webkitTransform = t;
    st.style.transform = t;
    st.className = s === 1 ? '' : 'suelto';
  }
  window.onresize = escalar;
  escalar();

  renderInicio();
  }, false);

  document.addEventListener('click', function (ev) {
    var t = ev.target, v;

    v = attr(t, 'data-rol');
    if (v !== null) {
      inicioSel.nivel = parseInt(v, 10);
      inicioSel.rol = nivelPorN(inicioSel.nivel).rol;
      var inp = $('perfil-in');
      if (inp) inicioSel.texto = inp.value;
      /* scale the 1024x768 stage to the viewport, centered. iPad 3 lands at 1. */
  function escalar() {
    var st = document.getElementById('stage');
    if (!st) return;
    var w = window.innerWidth || 1024, h2 = window.innerHeight || 768;
    var s = Math.min(w / 1024, h2 / 768);
    if (s > 0.98 && s < 1.02) s = 1;
    var t = 'translate(-50%,-50%) scale(' + s + ')';
    st.style.webkitTransform = t;
    st.style.transform = t;
    st.className = s === 1 ? '' : 'suelto';
  }
  window.onresize = escalar;
  escalar();

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
      if (paraBuild() > 0) { plan[v]++; renderAsignacion(); renderBarra(); }
      return;
    }
    v = attr(t, 'data-menos');
    if (v && J) {
      if (plan[v] > 0) { plan[v]--; renderAsignacion(); renderBarra(); }
      return;
    }

    v = attr(t, 'data-ap');
    if (v && J) {
      var i = plan.apuestas.indexOf(v);
      if (i >= 0) plan.apuestas.splice(i, 1);
      else if (slotsUsados() < J.slots && J.enVuelo[v] === undefined) plan.apuestas.push(v);
      renderBacklog(); renderBarra();
      return;
    }

    v = attr(t, 'data-act');
    if (!v) return;

    if (v === 'nueva') {
      var inp2 = $('perfil-in');
      if (inp2 && inp2.value) {
        inicioSel.texto = inp2.value;
        var p2 = parsearPerfil(inp2.value);
        if (p2.nombre) inicioSel.nombre = p2.nombre;
        if (p2.nivel !== null) { inicioSel.nivel = p2.nivel; inicioSel.rol = p2.rol; }
      }
      C = Carrera.nueva(inicioSel.nombre, inicioSel.nivel); M = Mundo.nuevo(); J = null; ofertaSel = -1;
      if (M.rival) { M.rival.nivel = C.nivel; M.rival.reputacion = C.reputacion; }
      Carrera.ofertas(C, M); guardar();
      var sabe = false;
      try { sabe = !!localStorage.getItem('fundadores.sabe'); } catch (e2) {}
      if (!sabe) mostrarIntro(); else renderOfertas();
    }
    else if (v === 'cerrar-intro') {
      try { localStorage.setItem('fundadores.sabe', '1'); } catch (e3) {}
      ov('ov-intro', false);
      renderOfertas();
    }
    else if (v === 'empezar-puesto') {
      if (J) {
        var yaVisto = J.briefVisto;
        J.briefVisto = true; guardar();
        if (yaVisto) renderJuego(); else nuevoMes();
      }
    }
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
    else if (v === 'biblio') { mostrarBiblio(); }
    else if (v === 'cerrar-biblio') { ov('ov-biblio', false); }
    else if (v === 'cerrar-libro') { ov('ov-libro', false); }
    else if (v === 'ejecutar') { ejecutar(); }
    else if (v === 'ronda') { if (J) { J.levantando = true; evActual = eventoAplicable(J); if (evActual) mostrarEvento(evActual); } }
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
    var t = 'translate(-50%,-50%) scale(' + s + ')';
    st.style.webkitTransform = t;
    st.style.transform = t;
    st.className = s === 1 ? '' : 'suelto';
  }
  window.onresize = escalar;
  escalar();

  renderInicio();
})();
