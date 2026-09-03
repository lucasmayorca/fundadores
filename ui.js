/* Interfaz del modo carrera. Sin build ni dependencias.
   Un solo manejador de clicks delegado. Motor/Carrera/Mundo nunca tocan el DOM. */
(function () {
  'use strict';

  /* v3: la usabilidad del mandato pasó de ser una métrica suelta a un índice
     compuesto (50% activación, 30% retención, 20% confiabilidad). Una partida
     guardada con el modelo viejo tiene su línea de partida en la escala vieja,
     así que el mandato se leería mal — y un mandato que miente es peor que
     empezar de nuevo. Se corta el save en vez de migrarlo a ciegas. */
  var CLAVE = 'fundadores.carrera.v3';
  var C = null;        /* carrera */
  var M = null;        /* mundo */
  var J = null;        /* puesto actual */
  var R = Logros.cargar();
  var plan = null, evActual = null, notasEvento = [], ofertaSel = -1, detalleAbierto = {};
  /* filtro del backlog: ver solo los proyectos que mueven el eje del mandato */
  var soloMandato = false;
  /* el cuerpo de "La teoría" en el cierre del mes: plegado por defecto */
  var teoriaAbierta = false;
  /* secciones plegadas del panel derecho: por defecto solo se ve lo que decide
     el mes; el resto está a un click, no a la vista */
  var secAbierta = {};
  var hudPrev = {};
  var rankingVolver = 'p-inicio';
  /* Salon de la Fama: pestana activa y ultima carga traida, para que cambiar
     de tabla no vuelva a pedir el ranking al servidor */
  var rkTab = 'patrimonio', rkDatos = null;

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
    for (i = s.length - 1; i >= 0; i--) { out = s.charAt(i) + out; if (++c % 3 === 0 && i > 0) out = '.' + out; }
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

  /* ================= MÓVIL =================
     En un teléfono no sirve escalar el escenario de 1024x768 (el texto queda
     a ~0.38x). Con el lado corto por debajo de 700px el escenario suelta el
     tamaño fijo, <body> se marca `movil` y el CSS reordena todo; acá solo
     vive lo que no se puede resolver con CSS: las dos pestañas de la
     pantalla de juego y la geometría del tour. */
  var esMovil = false;
  var tabJuego = 'trabajo';

  function modoMovil(w, h2) { return Math.min(w, h2) < 700; }

  /* En un teléfono las barras fijas se comen la pantalla. Ritmo y era son
     contexto que se lee una vez al empezar el mes, no cosas que necesites a la
     vista mientras mueves puntos — así que en móvil se mudan adentro del
     scroll de la columna izquierda. Quedan clavados la cabecera, las pestañas
     y el cierre del mes. */
  function acomodarBarras() {
    var pj = $('p-juego'), capa = $('capa'), hud = $('hud'), ritmo = $('ritmo');
    var izq = pj ? pj.getElementsByClassName('izq')[0] : null;
    if (!pj || !izq || !capa || !hud || !ritmo) return;
    /* en ancho la alerta de ritmo va ARRIBA DE TODO: lo primero que hay que
       saber del mes es si vas a llegar. En teléfono no se puede clavar una
       barra más, así que baja al scroll de la columna izquierda — sigue siendo
       lo primero que se lee, solo que dentro del scroll. */
    var destino = esMovil ? izq : pj, ancla = esMovil ? capa : hud;
    if (ritmo.parentNode !== destino || ritmo.nextSibling !== ancla) destino.insertBefore(ritmo, ancla);
  }

  function renderTabs() {
    var tb = $('tabsm'), cu = $('cuerpo');
    if (!tb || !cu) return;
    acomodarBarras();
    if (!esMovil) { tb.innerHTML = ''; cu.className = 'cuerpo'; return; }
    tb.innerHTML =
      '<div class="tabm' + (tabJuego === 'trabajo' ? ' on' : '') + '" data-tab="trabajo">Tu mes</div>' +
      '<div class="tabm' + (tabJuego === 'empresa' ? ' on' : '') + '" data-tab="empresa">La empresa</div>';
    cu.className = 'cuerpo t-' + tabJuego;
  }

  /* cambiar de modo (rotar el teléfono, redimensionar la ventana) repinta la
     pantalla que esté arriba: los renders son puros, así que es seguro */
  function repintar() {
    var ps = document.getElementsByClassName('pantalla'), i, viva = null;
    for (i = 0; i < ps.length; i++) if (ps[i].className.indexOf('on') >= 0) viva = ps[i].id;
    if (viva === 'p-juego' && J && plan) { renderJuego(); return; }
    renderTabs();
    if (viva === 'p-inicio') renderInicio();
    else if (viva === 'p-perfil') renderPerfil();
  }

  /* ================= PRIMER MES GUIADO =================
     No es una clase — es un reflector. La pantalla se oscurece salvo la zona
     activa, el coach te dice qué HACER, y los pasos de acción avanzan solos. */
  var TOUR = [
    { el:'hud', texto:'Este es el pulso de la empresa. <b>Retención</b> es el número que lo decide todo: de 100 usuarios este mes, cuántos siguen aquí el próximo.', accion:null },
    { el:'mandato', texto:'Te contrataron para hacer <b>una sola cosa</b> — esta barra es tu trabajo. El <b>capital político</b> es tu oxígeno: se gasta cuando trabajas fuera del mandato. En cero, estás fuera.', accion:null },
    { el:'capa', texto:'Tu equipo produce <b>puntos</b> cada mes. Los puntos que pones en estaciones producen evidencia, menos deuda, fiabilidad o alcance. <b>Lo que no estaciones va a los proyectos de abajo.</b>', accion:'estacion',
      textoAccion:'Pruébalo: toca <b>+</b> en una estación.' },
    { el:'backlog', texto:'El corazón del trabajo: <b>toca un proyecto</b> para poner ahí tus puntos restantes. Lee las tarjetas primero — <b>prob</b> (cuánto confiar en la estimación), <b>impacto</b> (lo que paga si es cierta), <b>tamaño</b> (S ~3 días... XL ~un mes).', accion:'proyecto',
      textoAccion:'Toca un proyecto para sumarlo.' },
    { el:'backlog', texto:'Verde es lo construido, <b>ámbar es el empuje de este mes</b>. Cuando un proyecto dice SALE ESTE MES, entrega ahora — y le da a la empresa una capacidad permanente.', accion:null },
    { el:'panel', texto:'Los signos vitales de la empresa. La <b>evidencia</b> alimenta cada estimación que ves. La <b>deuda</b> come capacidad cada mes. La <b>moral</b> lo multiplica todo. Más paneles se desbloquean al subir.', accion:null },
    { el:'barra', texto:'Ese es todo el ciclo: coloca puntos, elige apuestas, cierra el mes. El juego no frena tus errores — <b>te los cobra</b>, y luego te dice qué libro lo tenía escrito.', accion:'cerrar',
      textoAccion:'Cierra tu primer mes.' }
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
    if (esMovil) {
      var quiere = (paso.el === 'panel') ? 'empresa' : 'trabajo';
      if (tabJuego !== quiere) { tabJuego = quiere; renderTabs(); }
    }
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

    var sw = sr.width / esc2, sh = sr.height / esc2;
    var abajo = y + h2 + 150 < sh;
    var coach = $('coach');
    var cw = Math.min(420, sw - 24);
    coach.className = 'on';
    coach.style.width = cw + 'px';
    coach.style.left = Math.max(12, Math.min(sw - cw - 12, x + w / 2 - cw / 2)) + 'px';
    if (abajo) { coach.style.top = Math.min(sh - 200, y + h2 + 14) + 'px'; coach.style.bottom = 'auto'; }
    else { coach.style.top = Math.max(8, y - 200) + 'px'; coach.style.bottom = 'auto'; }
    coach.innerHTML = '<div class="cpaso">' + (tourPaso + 1) + ' / ' + TOUR.length + '</div>' +
      '<div class="ctx">' + paso.texto + '</div>' +
      (paso.accion ? '<div class="chace">' + paso.textoAccion + '</div>' :
        '<div style="margin-top:10px"><span class="btn chico pri" data-act="tour-sigo">Entendido</span></div>') +
      '<div class="csalir" data-act="tour-salir">saltar el tour</div>';
  }

  /* los pasos de acción avanzan cuando el jugador de verdad hace la cosa */
  function tourEvento(tipo) {
    if (!tourActivo()) return;
    var paso = TOUR[tourPaso];
    if (paso.accion !== tipo) return;
    tourPaso++;
    if (tourPaso >= TOUR.length) tourFin();
    else tourRender();
  }

  /* un Analista aún no tiene estaciones: el paso 3 se vuelve informativo */
  function tourAjustarRol() {
    if (!J) return;
    var alguna = false, i;
    for (i = 0; i < ESTACIONES.length; i++) if (J.palancas.indexOf(ESTACIONES[i].req) >= 0) alguna = true;
    if (!alguna) {
      TOUR[2].accion = null;
      TOUR[2].texto = 'Las estaciones producen evidencia, menos deuda, fiabilidad o alcance — <b>se desbloquean con cada ascenso</b>. Por ahora, todo tu mes va a proyectos.';
    }
  }

  /* tooltips táctiles: toca una etiqueta punteada y sale una explicación de una línea */
  var TIPS = {
    ret:'De cada 100 usuarios que tienes este mes, cuántos siguen el mes que viene. El número más honesto de todo el juego.',
    runway:'Meses de caja que quedan al ritmo de gasto actual. Bajo 4, todo lo demás deja de importar.',
    mrr:'Ingreso recurrente mensual. Lo que los clientes pagan de verdad, cada mes.',
    pol:'Tu crédito con la organización. Gastar tus puntos fuera del mandato lo drena - incluso cuando tienes razón. En cero, estás fuera.',
    edad:'Tu Edad es el escalón del ESCALAFON en el que estás: ocho en total, y cada uno desbloquea una palanca nueva del mes. Los pips llenos son los que ya subiste.',
    heat:'Atención del regulador. Los atajos sucios la suben. Desde 40: inspecciones sorpresa y multas. En 85: llegan con una orden judicial.',
    compro:'Slots de proyecto: cuántas construcciones puede mantener abiertas esta empresa a la vez. Entrega una para liberar su slot.',
    prob:'Cuánto confiar en la estimación. Se llena al hablar con usuarios; baja en empresas difíciles de estimar.',
    impact:'Cuánto mueve las cosas si la estimación es correcta. Las apuestas marcadas con la flecha de etapa pegan x1,3.',
    evid:'Cuánto sabes de verdad sobre tus usuarios. Da forma a cada estimación que ves - y decae cada mes.',
    debt:'Deuda técnica. Cobra intereses: se come una parte de la capacidad de tu equipo todos los meses.',
    morale:'Cómo está el equipo. La moral baja encoge en silencio todo lo que intentas.',
    fit:'Qué tan bien resuelves lo que este grupo necesita. La barra ES el encaje; la conversión y la retención la siguen.',
    load:'Usuarios versus lo que aguanta la arquitectura. Pasado ~85% las probabilidades de caída crecen de forma no lineal.',
    ebudget:'Presupuesto de error del trimestre. Los incidentes lo drenan; en cero, el mes siguiente es un congelamiento de features.',
    focus:'Qué tan alineada está la organización en pocas cosas. Baja sola con el tiempo; las decisiones de liderazgo la empujan hacia arriba.',
    usab:'Qué tan poco necesitan pensar los usuarios. Multiplica la conversión de TODO el tráfico que traes.',
    esf:'El tamaño es tiempo, para tu equipo, este mes: XS ~un día, S ~3 días, M ~una semana, L ~2 semanas, XL ~el mes entero.',
    vec:'Cuánto mueve cada eje si sale. Son los MISMOS ocho ejes del panel de la derecha, con los mismos nombres: lo que dice el chip es lo que sube o baja en el panel de la derecha. El chip con borde es el eje por el que te miden, y sale siempre — si dice “—”, este proyecto no lo mueve. Los chips rojos son efectos secundarios reales: construir agrega Deuda, y la superficie nueva cuesta Fiabilidad o Usabilidad. Las estimaciones se afinan con evidencia.',
    eje:'El eje en el que vive tu mandato. Busca ese mismo nombre en los chips de los proyectos del backlog y en la estación marcada arriba: esas son todas las formas de moverlo.',
    funnel:'Los ocho ejes medibles de la empresa, con los mismos nombres que llevan los chips de cada proyecto. Los marcados son los que te están midiendo este puesto. Ganancia = ingresos menos gasto.',
    capfondeo:'Las capacidades de la empresa se componen desde iniciativas fondeadas: necesitan capital levantado detrás para crecer, y sin él se erosionan en silencio. Cada una tiene una habilidad gemela en tu perfil que acelera su crecimiento.',
    cap_prod:'El músculo propio de producto/discovery de la empresa. Compone las ganancias de descubrimiento más allá de lo que hagas este mes. Tu habilidad de Producto lo acelera.',
    cap_tec:'Madurez de ingeniería que se compone con el tiempo: frena el crecimiento de la deuda y acelera su pago. Tu habilidad de Tecnología la acelera.',
    cap_gtm:'Qué tan eficiente es la organización convirtiendo gasto de crecimiento en alcance, más allá del empuje de este mes. Tu habilidad de Negocio la acelera.',
    cap_gente:'Cuánto equipo puede cargar la organización antes de que muerdan la carga cognitiva y la política. Tu habilidad de Liderazgo la acelera.',
    cap_cap:'Oficio para levantar capital: solo crece cuando cierras una ronda, y los mejores términos llegan en la siguiente.',
    st_desc:'Entrevistas y datos. Suma Evidencia: con más evidencia, la probabilidad de que tus iniciativas salgan como planeaste sube. Sin evidencia, construyes a ciegas.',
    st_plat:'Paga deuda técnica. Con deuda alta, cada punto de esfuerzo rinde menos; bajarla hace que las mismas iniciativas avancen más rápido.',
    st_fiab:'Sube Confiabilidad (uptime). Protege Retención — los usuarios no se van por caídas — y es requisito de la compuerta al mercado grande.',
    st_crec:'Amplía alcance: mueve Adquisición directamente. No toca tu mandato de usabilidad, pero alimenta el embudo desde arriba.',
    st_build:'Lo que no estacionas va aquí, a tus apuestas del backlog — esto es lo que de verdad sale este mes.',
    /* textos del handoff de diseño, copiados tal cual */
    mandato:'El objetivo real de tu puesto — recién lo conoces el día uno. Alinear tus apuestas paga ×1.3; ir en contra paga ×0.5.',
    capital:'Se gasta cuando actúas fuera del mandato, incluso con razón. En cero, estás despedido.',
    lupa:'Tu nivel de sospecha. En 40, inspecciones. En 55, un trato. En 85, allanamiento — y si encuentran algo, imputación.',
    apuestas:'Prob es la chance de que la apuesta salga como la planeaste. Esfuerzo son los puntos de equipo que consume. El impacto se paga distinto según si está alineado a tu mandato.',
    aarrr:'Métricas pirata (AARRR): ADQ Adquisición · ACT Activación · RET Retención · CONF Confiabilidad · Ingresos · Referidos — los números con los que te van a juzgar al cierre del mes.',
    gate:'La compuerta al mercado grande: cada sector exige algo distinto para dejarte crecer en serio. No cumplirla te deja pegado a tu nicho actual.',
    usabilidad:'Usabilidad no es una métrica suelta: es 50% Activación + 30% Retención + 20% Confiabilidad. Cada iniciativa mueve esas tres, y de ahí sale cuánto aporta al mandato. Las iniciativas alineadas a la etapa rinden un 30% más.'
  };
  var tipTimer = null;
  function mostrarTip(clave) {
    var t = TIPS[clave];
    if (!t) return;
    var el = $('tipbar');
    el.innerHTML = '<div class="tipt">¿Qué es esto?</div>' + esc(t);
    el.className = 'on';
    if (tipTimer) clearTimeout(tipTimer);
    tipTimer = setTimeout(function () { el.className = ''; }, 5000);
  }
  /* el circulito "?" del rediseno: la misma barra de tooltip de siempre, pero
     con un disparador propio en vez de subrayar la palabra */
  function ayuda(clave) {
    return '<span class="ayuda" data-tip="' + clave + '">?</span>';
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
      if (J) Motor.capacidad(J); /* migra partidas viejas: siembra J.capacidades/capFondeo si faltan */
      return !!(C && M);
    } catch (e) { return false; }
  }

  /* ================= INICIO ================= */

  /* Inicio personalizado opcional: pega una URL de LinkedIn y/o tu cargo.
     La URL nos da tu nombre (el slug /in/); el texto del cargo mapea a un
     escalón de la escalera de producto. Cada posición de producto que
     conocemos cae en la escala 0-7. Empezar de cero siempre es una opción. */
  var TITULOS = [
    { re:/(co-?founder|founder|ceo|chief executive|fundador|fundadora|cofundador)/i, n:7, rol:'Fundador/a' },
    { re:/(cpo|chief product)/i, n:6, rol:'CPO' },
    { re:/(vp|vice ?president|vicepresidente).*(product|producto)|(product|producto).*(vp|vice ?president|vicepresidente)/i, n:5, rol:'VP de Producto' },
    { re:/(head of product|director.*product|product.*director|director[a]? de producto|jefe de producto)/i, n:4, rol:'Director de Producto' },
    { re:/(group product manager|gpm|principal product|product lead|lead product manager|staff product|l[ií]der de producto)/i, n:3, rol:'Group PM' },
    { re:/(senior|sr\.?)\s*(product manager|pm|gerente de producto)/i, n:2, rol:'Senior PM' },
    { re:/(product manager|product owner|\bpm\b|gerente de producto|due[ñn][oa] de producto)/i, n:1, rol:'Product Manager' },
    { re:/(associate product|apm|product analyst|analista|intern.*product|junior.*product|product designer|ux|business analyst|data analyst|dise[ñn]ador de producto|practicante)/i, n:0, rol:'Analista de Producto' }
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
    if (/design|ux|\bui\b|dise[ñn]/i.test(texto)) out.bg = 'design';
    else if (/engineer|developer|cto|software|swe|ingenier|desarrollador/i.test(texto)) out.bg = 'eng';
    else if (/sales|marketing|mba|business|growth|commercial|finance|ventas|negocio|comercial|finanzas/i.test(texto)) out.bg = 'biz';
    else if (/data|analytics|scientist|datos|anal[ií]tica/i.test(texto)) out.bg = 'data';
    else if (out.nivel !== null) out.bg = 'product';
    return out;
  }

  var inicioSel = { nivel:0, rol:'Analista de Producto', nombre:null, deLinkedin:null, buscando:false, modo:'manual' };

  /* En el deploy público, el servidor puede leer la página PÚBLICA de LinkedIn
     y darnos nombre + titular (/api/perfil). En el servidor LAN del iPad ese
     endpoint no existe: el XHR falla y nos quedamos, en silencio, con el parseo
     local de slug + cargo. Mejor esfuerzo por diseño. */
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
          inicioSel.deLinkedin = 'perfil encontrado';
        }
      }
      var pantalla = document.getElementById('p-perfil');
      if (pantalla && pantalla.className.indexOf('on') >= 0) renderPerfil();
    };
    try { x.send(null); } catch (e2) { inicioSel.buscando = false; }
  }

  /* una capa del explicador de la portada: indentación = profundidad */
  /* un paso de "cómo funciona": el mismo patrón de líneas numeradas que la
     intro del juego ("Cuatro cosas. Nada más.") — probadamente legible, así
     que se reusa tal cual en vez de inventar un layout nuevo. */
  function pasoHtml(n, col, tit, txt) {
    return '<div class="linea"><div class="ic" style="color:' + col + '">' + n + '</div>' +
      '<div class="tx"><b>' + tit + '.</b> ' + txt + '</div></div>';
  }

  /* La escalera de la portada: los 8 niveles del ESCALAFON como barras
     clicables. La altura de cada barra ES el mando real del puesto (12% a
     100%), asi que la silueta cuenta la carrera antes de leer una etiqueta.
     Toca el mismo data-rol que los chips del perfil. */
  function escaleraHtml() {
    var h = '<div class="rot" style="margin-bottom:12px">La escalera — ' + ESCALAFON.length +
            ' niveles, tu mando real</div><div class="escalera">';
    var i, lv;
    for (i = 0; i < ESCALAFON.length; i++) {
      lv = ESCALAFON[i];
      h += '<div class="escalon' + (i === inicioSel.nivel ? ' sel' : i < inicioSel.nivel ? ' pasado' : '') +
           '" data-rol="' + i + '">' +
           '<div class="ebarra" style="height:' + Math.round(18 + lv.mando * 84) + 'px"></div>' +
           '<div class="elabel">' + esc(lv.corto) + '</div></div>';
    }
    h += '</div>';
    var sel = nivelPorN(inicioSel.nivel);
    h += '<div class="escalondet"><div class="edcab">' +
         '<div class="rot">' + esc(sel.rol) + '</div>' +
         '<span class="tagout num">Mando ' + Math.round(sel.mando * 100) + '%</span></div>' +
         '<div class="ednota">' + esc(sel.nota) + '</div></div>';
    return h;
  }

  /* Los 9 pilares de la biblioteca con el conteo real de LIBROS: la
     biblioteca deja de ser un boton al pie y pasa a ser una promesa medible. */
  function pilaresHtml() {
    var cuenta = {}, max = 1, i, c;
    for (i = 0; i < LIBROS.length; i++) cuenta[LIBROS[i].pilar] = (cuenta[LIBROS[i].pilar] || 0) + 1;
    for (i = 0; i < PILARES.length; i++) max = Math.max(max, cuenta[PILARES[i].id] || 0);
    var h = '<div class="rot" style="margin-bottom:10px">Una biblioteca de ' + LIBROS.length +
            ' tarjetas, ' + PILARES.length + ' pilares</div>' +
      '<div class="pq mut" style="margin-bottom:14px">Cada dilema y cada libro trae “En tu partida, hoy”: ' +
      'la teoría calculada en vivo con tus números, no una cita suelta.</div><div class="pilares">';
    for (i = 0; i < PILARES.length; i++) {
      c = cuenta[PILARES[i].id] || 0;
      h += '<div class="pilfila" data-act="biblio"><div class="pilnom">' + esc(PILARES[i].nombre) + '</div>' +
           '<div class="pilpozo"><i style="width:' + Math.round(c / max * 100) + '%"></i></div>' +
           '<div class="pilnum num">' + c + '</div></div>';
    }
    return h + '</div>';
  }

  function rungChipsHtml() {
    var h = '', ti;
    for (ti = 0; ti < ESCALAFON.length; ti++) {
      h += '<span class="rolchip' + (inicioSel.nivel === ti ? ' sel' : '') + '" data-rol="' + ti + '">' +
           esc(ESCALAFON[ti].corto) + '</span>';
    }
    return h;
  }

  /* ruido determinista: el mismo dibujo en cada render, sin Math.random */
  function ruido(a, b) {
    var s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
    return s - Math.floor(s);
  }

  /* ¿el visitante pidió menos movimiento? en Safari 9 matchMedia existe pero
     no conoce la consulta y devuelve false — justo el valor correcto acá */
  function reducirMovimiento() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }

  /* El perfil de cada escalón: del galpón de una planta a la torre con aguja,
     faro y bandera. Cada uno tiene su silueta — la carrera se lee de un
     vistazo sin necesitar las etiquetas. */
  var TORRES = [
    { h:20,  w:48, remate:'techo' },    /* APM   — el galpón a dos aguas */
    { h:34,  w:36, remate:'chimenea' }, /* PM    — la primera oficina */
    { h:48,  w:38, remate:'parapeto' }, /* Sr PM — cornisa */
    { h:62,  w:34, remate:'tanque' },   /* GPM   — tanque de agua */
    { h:78,  w:40, remate:'escalon' },  /* Dir   — primer retranqueo */
    { h:94,  w:36, remate:'antena' },   /* VP    — mástil */
    { h:110, w:42, remate:'cupula' },   /* CPO   — la cúpula */
    { h:128, w:48, remate:'aguja' }     /* Fndr  — aguja, faro, bandera */
  ];

  var skyId = 0, portadaAnimada = false;

  /* El visual héroe: una ciudad que crece de izquierda a derecha, un edificio
     por escalón, con la trayectoria de la carrera trazada sobre los techos.
     En la portada es decorativa y entra animada (las torres emergen del suelo
     recortadas por el horizonte, después se dibuja la trayectoria). En el
     perfil es interactiva: cada torre es un blanco táctil grande cableado al
     mismo data-rol que los chips de rol. */
  function skylineSvg(sel, interactivo) {
    var vw = 600, vh = 200, baseY = 168, n = ESCALAFON.length;
    var margen = 16, span = (vw - margen * 2) / n;
    var animar = !interactivo && !portadaAnimada && !reducirMovimiento();
    var u = 'sk' + (++skyId);
    var i, c, f, s = '';

    function geo(k) {
      var t = TORRES[k], cx = margen + span * k + span / 2;
      return { cx:cx, x:cx - t.w / 2, w:t.w, h:t.h, y:baseY - t.h, t:t };
    }

    /* ventanas: retícula irregular, más vida a medida que subís de escalón */
    function ventanas(g, k, viva) {
      var paso = 11, vw2 = 6, vh2 = 4.6;
      var cols = Math.max(2, Math.floor((g.w - 8) / paso));
      var filas = Math.max(1, Math.floor((g.h - 11) / paso));
      var ox = g.x + (g.w - (cols * vw2 + (cols - 1) * (paso - vw2))) / 2;
      var out = '', r, wx, wy, lit, op;
      for (f = 0; f < filas; f++) {
        for (c = 0; c < cols; c++) {
          wx = ox + c * paso; wy = g.y + 6.5 + f * paso;
          r = ruido(k * 13 + c, f * 7 + 1);
          lit = r > (viva ? 0.36 : 0.54);
          op = lit ? (0.5 + r * 0.5) : 0.42;
          out += '<rect x="' + wx.toFixed(1) + '" y="' + wy.toFixed(1) + '" width="' + vw2 + '" height="' + vh2 +
                 '" fill="' + (lit ? (viva ? '#ffd27a' : '#e8bb6a') : '#2f3040') +
                 '" opacity="' + op.toFixed(2) + '">';
          /* un puñado de ventanas parpadea: alguien todavía trabajando */
          if (lit && animar && r > 0.962) {
            out += '<animate attributeName="opacity" values="' + op.toFixed(2) + ';0.15;' + op.toFixed(2) +
                   ';' + op.toFixed(2) + '" dur="' + (3.4 + r * 3).toFixed(1) + 's" begin="' +
                   (r * 4).toFixed(1) + 's" repeatCount="indefinite"></animate>';
          }
          out += '</rect>';
        }
      }
      return out;
    }

    /* la coronación de cada torre: lo que la hace reconocible de lejos */
    function remate(g, col, viva) {
      var t = g.t, cx = g.cx, y = g.y, o = '';
      if (t.remate === 'techo') {
        o += '<path d="M' + (g.x - 2.5) + ' ' + y + ' L' + cx + ' ' + (y - 7) + ' L' + (g.x + g.w + 2.5) +
             ' ' + y + ' Z" fill="' + col.techo + '"></path>';
      } else if (t.remate === 'chimenea') {
        o += '<rect x="' + (cx - 7) + '" y="' + (y - 6) + '" width="13" height="6" fill="' + col.techo + '"></rect>' +
             '<rect x="' + (cx + 7.5) + '" y="' + (y - 10) + '" width="2.6" height="10" fill="' + col.techo + '"></rect>';
      } else if (t.remate === 'parapeto') {
        o += '<rect x="' + (g.x - 2.5) + '" y="' + (y - 3.5) + '" width="' + (g.w + 5) + '" height="3.5" fill="' + col.techo + '"></rect>';
      } else if (t.remate === 'cupula') {
        o += '<path d="M' + (cx - 11) + ' ' + y + ' Q' + cx + ' ' + (y - 25) + ' ' + (cx + 11) + ' ' + y +
             ' Z" fill="' + col.cuerpo + '" stroke="' + col.borde + '" stroke-width="1"></path>' +
             '<rect x="' + (cx - 1) + '" y="' + (y - 19) + '" width="2" height="8" fill="' + col.techo + '"></rect>' +
             '<circle cx="' + cx + '" cy="' + (y - 20) + '" r="2" fill="' + col.acento + '" opacity="0.85"></circle>';
      } else if (t.remate === 'tanque') {
        o += '<rect x="' + (cx - 7) + '" y="' + (y - 10) + '" width="14" height="8" rx="1" fill="' + col.techo + '"></rect>' +
             '<rect x="' + (cx - 5.5) + '" y="' + (y - 2) + '" width="1.6" height="2" fill="' + col.techo + '"></rect>' +
             '<rect x="' + (cx + 4) + '" y="' + (y - 2) + '" width="1.6" height="2" fill="' + col.techo + '"></rect>';
      } else if (t.remate === 'escalon') {
        o += '<rect x="' + (cx - g.w / 4) + '" y="' + (y - 11) + '" width="' + (g.w / 2) + '" height="11" fill="' + col.cuerpo +
             '" stroke="' + col.borde + '" stroke-width="1"></rect>' +
             '<rect x="' + (cx - g.w / 8) + '" y="' + (y - 17) + '" width="' + (g.w / 4) + '" height="6" fill="' + col.cuerpo +
             '" stroke="' + col.borde + '" stroke-width="1"></rect>';
      } else if (t.remate === 'antena') {
        o += '<line x1="' + cx + '" y1="' + y + '" x2="' + cx + '" y2="' + (y - 18) + '" stroke="' + col.techo + '" stroke-width="1.4"></line>' +
             '<line x1="' + (cx - 4) + '" y1="' + (y - 12) + '" x2="' + (cx + 4) + '" y2="' + (y - 12) + '" stroke="' + col.techo + '" stroke-width="1"></line>' +
             '<line x1="' + (cx - 2.5) + '" y1="' + (y - 16) + '" x2="' + (cx + 2.5) + '" y2="' + (y - 16) + '" stroke="' + col.techo + '" stroke-width="1"></line>';
      } else if (t.remate === 'aguja') {
        /* la torre del fundador: coronación, aguja, faro y bandera propia */
        o += '<rect x="' + (cx - 9) + '" y="' + (y - 9) + '" width="18" height="9" fill="' + col.cuerpo +
             '" stroke="' + col.borde + '" stroke-width="1"></rect>';
        o += '<line x1="' + cx + '" y1="' + (y - 9) + '" x2="' + cx + '" y2="' + (y - 30) + '" stroke="' + col.acento + '" stroke-width="1.6"></line>';
        /* bandera que ondea */
        o += '<path d="M' + cx + ' ' + (y - 30) + ' q7 2 13 0 q-6 5 0 9 q-7 2 -13 0 Z" fill="' + col.acento + '" opacity="0.95">';
        if (animar) {
          o += '<animate attributeName="d" dur="3.2s" repeatCount="indefinite" values="' +
               'M' + cx + ' ' + (y - 30) + ' q7 2 13 0 q-6 5 0 9 q-7 2 -13 0 Z;' +
               'M' + cx + ' ' + (y - 30) + ' q7 -2 13 1 q-6 4 0 9 q-7 1 -13 -1 Z;' +
               'M' + cx + ' ' + (y - 30) + ' q7 2 13 0 q-6 5 0 9 q-7 2 -13 0 Z"></animate>';
        }
        o += '</path>';
        /* faro de aviación */
        o += '<circle cx="' + cx + '" cy="' + (y - 32) + '" r="2.4" fill="#ff6b5e">';
        if (animar) o += '<animate attributeName="opacity" values="1;0.15;1" dur="2.4s" repeatCount="indefinite"></animate>';
        o += '</circle>';
      }
      return o;
    }

    s += '<svg viewBox="0 0 ' + vw + ' ' + vh + '" class="skysvg" preserveAspectRatio="xMidYMax meet">';

    s += '<defs>' +
      '<linearGradient id="' + u + 'cielo" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#101220"></stop>' +
        '<stop offset="0.5" stop-color="#181a2c"></stop>' +
        '<stop offset="1" stop-color="#232541"></stop></linearGradient>' +
      '<radialGradient id="' + u + 'brillo" cx="0.5" cy="1" r="0.85">' +
        '<stop offset="0" stop-color="#9a742a" stop-opacity="0.40"></stop>' +
        '<stop offset="0.45" stop-color="#5a4418" stop-opacity="0.15"></stop>' +
        '<stop offset="1" stop-color="#5a4418" stop-opacity="0"></stop></radialGradient>' +
      '<radialGradient id="' + u + 'halo" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#e7e5fe" stop-opacity="0.22"></stop>' +
        '<stop offset="1" stop-color="#e7e5fe" stop-opacity="0"></stop></radialGradient>' +
      '<linearGradient id="' + u + 'bordes" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#141527" stop-opacity="0.85"></stop>' +
        '<stop offset="0.055" stop-color="#141527" stop-opacity="0"></stop>' +
        '<stop offset="0.945" stop-color="#141527" stop-opacity="0"></stop>' +
        '<stop offset="1" stop-color="#141527" stop-opacity="0.85"></stop></linearGradient>' +
      '<clipPath id="' + u + 'suelo"><rect x="0" y="0" width="' + vw + '" height="' + baseY + '"></rect></clipPath>' +
      '</defs>';

    /* cielo, resplandor del horizonte y luna */
    s += '<rect x="0" y="0" width="' + vw + '" height="' + vh + '" fill="url(#' + u + 'cielo)"></rect>';
    s += '<rect x="0" y="0" width="' + vw + '" height="' + vh + '" fill="url(#' + u + 'brillo)"></rect>';
    /* luna creciente: disco claro y encima otro del color del cielo */
    s += '<circle cx="82" cy="34" r="27" fill="url(#' + u + 'halo)"></circle>' +
         '<circle cx="82" cy="34" r="8.5" fill="#cfd3e5" opacity="0.82"></circle>' +
         '<circle cx="87.5" cy="30.5" r="8.5" fill="#141527"></circle>';

    /* estrellas: unas cuantas titilan */
    for (i = 0; i < 22; i++) {
      var ex = ruido(i, 1) * vw, ey = 8 + ruido(i, 2) * 78, er = 0.6 + ruido(i, 5) * 0.7;
      var eo = 0.25 + ruido(i, 8) * 0.5;
      s += '<circle cx="' + ex.toFixed(1) + '" cy="' + ey.toFixed(1) + '" r="' + er.toFixed(1) +
           '" fill="#b2b6ca" opacity="' + eo.toFixed(2) + '">';
      if (animar && i % 6 === 0) {
        s += '<animate attributeName="opacity" values="' + eo.toFixed(2) + ';0.08;' + eo.toFixed(2) +
             '" dur="' + (2.8 + ruido(i, 9) * 2.6).toFixed(1) + 's" repeatCount="indefinite"></animate>';
      }
      s += '</circle>';
    }

    /* capa lejana: siluetas fuera de foco, la ciudad detrás de la ciudad */
    for (i = 0; i < 20; i++) {
      var fx = ruido(i, 3) * (vw + 30) - 15;
      var fh = 18 + ruido(i, 7) * 52, fw = 15 + ruido(i, 11) * 24;
      s += '<rect x="' + fx.toFixed(1) + '" y="' + (baseY - fh).toFixed(1) + '" width="' + fw.toFixed(1) +
           '" height="' + fh.toFixed(1) + '" fill="#181a2c"></rect>';
    }
    for (i = 0; i < 12; i++) {
      var mx = ruido(i, 17) * (vw + 20) - 10;
      var mh = 14 + ruido(i, 19) * 34, mw = 18 + ruido(i, 23) * 20;
      s += '<rect x="' + mx.toFixed(1) + '" y="' + (baseY - mh).toFixed(1) + '" width="' + mw.toFixed(1) +
           '" height="' + mh.toFixed(1) + '" fill="#1d1f33"></rect>';
    }

    /* ---- las ocho torres, recortadas por el horizonte para que emerjan ---- */
    s += '<g clip-path="url(#' + u + 'suelo)">';
    for (i = 0; i < n; i++) {
      var g = geo(i), esSel = (i === sel), esFnd = (i === n - 1);
      var col = esSel
        ? { cuerpo:'#2b2741', borde:(esFnd ? '#b5abfc' : '#796cbf'), techo:'#423a6a', acento:(esFnd ? '#b5abfc' : '#9184d9') }
        : { cuerpo:'#20223a', borde:'#353749', techo:'#292b31', acento:'#9184d9' };

      /* el transform base los deja hundidos: sin él, SMIL los muestra en su
         sitio final hasta que arranca su turno y ahí saltan hacia abajo */
      var caida = (g.h + 34).toFixed(0);
      s += interactivo ? '<g class="skycol" data-rol="' + i + '">'
                       : (animar ? '<g transform="translate(0,' + caida + ')">' : '<g>');
      if (animar) {
        s += '<animateTransform attributeName="transform" type="translate" ' +
             'values="0 ' + caida + ';0 0" keyTimes="0;1" calcMode="spline" ' +
             'keySplines="0.16 0.84 0.24 1" dur="0.85s" begin="' + (0.05 + i * 0.075).toFixed(3) +
             's" fill="freeze"></animateTransform>';
      }
      if (interactivo) {
        s += '<rect x="' + g.x + '" y="' + (baseY - 132) + '" width="' + g.w + '" height="132" ' +
             'fill="#000" opacity="0" pointer-events="all"></rect>';
      }
      s += '<rect class="skybar" x="' + g.x + '" y="' + g.y + '" width="' + g.w + '" height="' + g.h +
           '" fill="' + col.cuerpo + '" stroke="' + col.borde + '" stroke-width="' + (esSel ? 1.5 : 1) + '"></rect>';
      s += remate(g, col, esSel);
      s += ventanas(g, i, esSel);
      s += '</g>';
    }
    s += '</g>';

    /* La trayectoria y las etiquetas van sobre las torres, fuera del recorte:
       en la portada aparecen recién cuando la ciudad terminó de aterrizar,
       si no quedarían flotando en el aire sobre un edificio que no llegó. */
    s += animar ? '<g pointer-events="none" opacity="0"><animate attributeName="opacity" ' +
                  'values="0;0;1;1" keyTimes="0;0.35;0.52;1" dur="2.6s" fill="freeze"></animate>'
                : '<g pointer-events="none">';

    /* La trayectoria es una escalera, no una curva: recorre el borde de cada
       techo y sube por la pared del siguiente. Es la metáfora del juego
       dibujada literal, y así nunca cruza por delante de una fachada.
       El largo se calcula a mano para que el trazo se dibuje parejo. */
    var d = '', largo = 0, g0 = geo(0), ax = g0.x, ay = g0.y;
    d += 'M' + ax.toFixed(1) + ' ' + ay.toFixed(1);
    for (i = 0; i < n; i++) {
      var gt = geo(i);
      if (i) {
        /* llegar al pie de la torre y trepar por su pared hasta el techo */
        d += ' L' + gt.x.toFixed(1) + ' ' + ay.toFixed(1) + ' L' + gt.x.toFixed(1) + ' ' + gt.y.toFixed(1);
        largo += Math.abs(gt.x - ax) + Math.abs(gt.y - ay);
        ax = gt.x; ay = gt.y;
      }
      d += ' L' + (gt.x + gt.w).toFixed(1) + ' ' + gt.y.toFixed(1);
      largo += gt.w;
      ax = gt.x + gt.w; ay = gt.y;
    }
    largo = Math.ceil(largo) + 2;
    s += '<path d="' + d + '" fill="none" stroke="#9184d9" stroke-width="1.4" ' +
         'opacity="0.62" stroke-linejoin="round" stroke-linecap="round"' +
         (animar ? ' stroke-dasharray="' + largo + '" stroke-dashoffset="' + largo + '"' : '') + '>';
    if (animar) {
      s += '<animate attributeName="stroke-dashoffset" values="' + largo + ';' + largo + ';0" ' +
           'keyTimes="0;0.3;1" dur="2.8s" fill="freeze"></animate>';
    }
    s += '</path>';
    /* un pip por escalón, en el vértice donde la escalera alcanza cada techo */
    for (i = 0; i < n; i++) {
      var gp = geo(i), ult = (i === n - 1);
      s += '<circle cx="' + gp.x.toFixed(1) + '" cy="' + gp.y.toFixed(1) + '" r="' +
           (ult ? 2.8 : 1.9) + '" fill="' + (ult ? '#b5abfc' : '#9184d9') + '" opacity="' +
           (ult ? '1' : '0.75') + '"></circle>';
    }

    /* etiqueta del escalón elegido: despejada por encima de su coronación.
       La torre del fundador llega al techo del lienzo, así que ahí la
       etiqueta va al costado de la aguja, del lado libre de la bandera. */
    if (sel >= 0 && sel < n) {
      var gs = geo(sel), lab = esc(ESCALAFON[sel].corto);
      var ALTO = { techo:7, chimenea:10, parapeto:4, tanque:10, escalon:17, antena:18, cupula:22, aguja:35 };
      var alto = ALTO[gs.t.remate] || 0, fnd2 = (gs.t.remate === 'aguja');
      s += '<text x="' + (fnd2 ? (gs.cx - 11).toFixed(1) : gs.cx.toFixed(1)) +
           '" y="' + (fnd2 ? (gs.y - 19).toFixed(1) : (gs.y - alto - 9).toFixed(1)) +
           '" text-anchor="' + (fnd2 ? 'end' : 'middle') +
           '" font-size="11" font-weight="500" letter-spacing="0.8" fill="' +
           (fnd2 ? '#e7e5fe' : '#d2cefd') + '">' + lab + '</text>';
    }
    s += '</g>';

    /* suelo, neblina cálida y desvanecido en los bordes. Todo esto va encima
       de las torres, así que no puede robarles el toque: pointer-events none. */
    s += '<g pointer-events="none">';
    s += '<rect x="0" y="' + baseY + '" width="' + vw + '" height="' + (vh - baseY) + '" fill="#101220"></rect>';
    s += '<line x1="0" y1="' + baseY + '" x2="' + vw + '" y2="' + baseY + '" stroke="#3f424d" stroke-width="1"></line>';
    for (i = 0; i < 16; i++) {
      var lx = 12 + ruido(i, 29) * (vw - 24);
      s += '<circle cx="' + lx.toFixed(1) + '" cy="' + (baseY + 5 + ruido(i, 31) * 14).toFixed(1) +
           '" r="0.9" fill="#e8bb6a" opacity="' + (0.12 + ruido(i, 37) * 0.22).toFixed(2) + '"></circle>';
    }
    s += '<rect x="0" y="0" width="' + vw + '" height="' + vh + '" fill="url(#' + u + 'bordes)"></rect>';
    s += '</g>';

    s += '</svg>';
    if (animar) portadaAnimada = true;
    return s;
  }

  function renderInicio() {
    var hay = false;
    try { hay = !!localStorage.getItem(CLAVE); } catch (e) {}

    /* ---- héroe: el gancho y un solo camino hacia adelante. nunca hace scroll ---- */
    var sel0 = nivelPorN(inicioSel.nivel);
    var h = '<div class="landhero"><div class="landcol" style="max-width:912px">';
    h += '<div class="rot">Founder Mode</div>' +
      '<div class="h1" style="margin-top:8px;max-width:660px">¿Puedes llegar a CPO sin romper el ' +
      'producto ni quemar a tu equipo?</div>' +
      '<div class="hook" style="margin-top:8px;max-width:600px">Ocho puestos, de Analista de Producto a ' +
      'Fundador/a. Cada decisión mueve tu mando real, y cada error tiene un libro que ya lo explicó.</div>';
    /* dos columnas: la escalera manda, la biblioteca acompaña */
    h += '<div class="dosc" style="display:-webkit-flex;display:flex;margin-top:22px">' +
      '<div class="colx" style="width:520px;padding-right:36px">' + escaleraHtml() + '</div>' +
      '<div class="colx" style="-webkit-flex:1;flex:1;min-width:0">' + pilaresHtml() + '</div>' +
      '</div>';
    h += '<div style="margin-top:20px">' +
      '<span class="btn pri xl" data-act="nueva">Empezar como ' + esc(sel0.corto) + '</span> ' +
      '<span class="btn sec" data-act="ir-perfil">o pega tu LinkedIn</span>' +
      (hay ? ' <span class="btn" data-act="continuar">Continuar</span>' : '') + '</div>';
    h += '</div></div>'; /* landcol, landhero */

    /* ---- todo lo demás: profundidad, el salón de la fama. hace scroll por su cuenta ---- */
    h += '<div class="landmore scroll"><div class="landchevron">⌄</div>';
    /* mismo ancho que el heroe: si el "mas" se centra en 640 y el heroe mide
       912, las dos mitades de la portada arrancan en columnas distintas */
    h += '<div class="landcol" style="max-width:912px">';

    h += '<div class="h2">Cómo funciona</div>' +
      '<div class="pq mut" style="margin-bottom:6px">Cinco cosas pasando a la vez, cada mes.</div>';
    h += pasoHtml(1, '#5aa9f0', 'El mes, tu turno',
      'Coloca los puntos del equipo en estaciones — Descubrir, Plataforma, Fiabilidad, Crecimiento — o en ' +
      'apuestas del backlog: probabilidad × impacto ÷ esfuerzo.');
    h += pasoHtml(2, '#35c46a', 'El puesto, un mandato',
      'Mueve un número antes de una fecha límite. La etapa — pre-PMF, validando, escalando — decide qué paga; ' +
      'el capital político, qué tanto puedes salirte del guion.');
    h += pasoHtml(3, '#e8a33d', 'La carrera, la escalera',
      'Ocho escalones, de Analista de Producto a Fundador. Los escalones desbloquean palancas, la reputación abre mesas, y ' +
      'el equity — que vale algo o nada — hace la fortuna.');
    h += pasoHtml(4, '#a98ff0', 'El mundo, el tablero',
      'Las eras reescriben las reglas sin aviso: burbujas, inviernos, reguladores. Los sectores se calientan y se congelan. ' +
      'Un rival sube la misma escalera, con el mismo reloj.');
    h += pasoHtml(5, '#7fa8d8', 'La biblioteca, los recibos',
      LIBROS.length + ' libros reales de producto alimentan las reglas. Cada error se cobra primero — ' +
      'y después se abre la tarjeta exacta que lo predijo.');

    h += '<div class="pq mut" style="margin:16px 0;max-width:580px">Desafío semanal: todos juegan el mismo ' +
      'mundo esta semana (' + esc(Ranking.semana()) + ') — mismas eras, mismas tormentas, mismo timing del rival. Una tabla ' +
      'pública, siete días, sin más ventaja que tus decisiones. Y la semana deja huella: los 8 primeros ' +
      'puntúan (10-8-6-5-4-3-2-1) para la <b>tabla histórica</b>, y el campeón queda en el palmarés para siempre.</div>';

    h += '<div class="h2" style="margin-top:14px">Salón de la Fama</div>' +
      '<div class="pq mut" style="margin-bottom:6px">Tus mejores partidas, los logros de todos, una tabla pública.</div>';

    var fac = Ranking.faccion();
    h += '<div class="caja2"><div class="rot" style="margin-bottom:5px">Bando ' +
      '<span class="mut" style="text-transform:none;letter-spacing:0">(opcional, para el ranking público)</span></div>' +
      '<div class="pq mut" style="margin-bottom:7px">No cambia cómo jugás: solo suma tus mandatos cumplidos al ' +
      'marcador de tu bando en el Salón de la Fama.</div>' +
      '<span class="rolchip' + (fac === 'growth' ? ' sel' : '') + '" data-fac="growth">Legión del Crecimiento</span>' +
      '<span class="rolchip' + (fac === 'craft' ? ' sel' : '') + '" data-fac="craft">Gremio del Oficio</span></div>';

    h += '<div class="caja2" style="margin-top:10px"><div class="rot" style="margin-bottom:6px">Tus récords</div>';
    if (R.records.carreras > 0) {
      h += '<div class="req"><span class="mut">Carreras jugadas</span> <b class="num"> ' + R.records.carreras + '</b></div>' +
           '<div class="req"><span class="mut">Mejor patrimonio</span> <b class="num verde"> ' + money(R.records.patrimonio) + '</b></div>' +
           '<div class="req"><span class="mut">Mejor rol alcanzado</span> <b> ' + esc(nivelPorN(R.records.nivel).rol) + '</b></div>';
      var i;
      for (i = 0; i < Math.min(3, R.historia.length); i++) {
        var hh = R.historia[i];
        h += '<div class="req mut" style="font-size:12px">· ' + esc(hh.nombre) + ' — ' + money(hh.patrimonio) +
             ', ' + esc(hh.nivel) + ' · rival: ' + esc(hh.rival) + ' (nivel ' + hh.rivalNivel + ')</div>';
      }
    } else {
      h += '<div class="pq mut">Nadie ha jugado todavía. Los récords viven aquí.</div>';
    }
    h += '<div class="pq" style="margin-top:8px"><span class="linklike" data-act="ranking">Ver el ranking público →</span></div>';
    h += '</div>';

    var items = '', k, n = 0;
    for (k = 0; k < Logros.DEFS.length; k++) {
      var d = Logros.DEFS[k], ok = !!R.logros[d.id];
      if (ok) n++;
      items += '<div class="req ' + (ok ? 'verde' : 'mut') + '" style="' + (ok ? '' : 'opacity:0.45') + '">' +
           (ok ? '★ ' : '☆ ') + esc(d.n) + ' <span class="mut" style="font-size:11px">— ' + esc(d.d) + '</span></div>';
    }
    h += '<div class="caja2" style="margin-top:10px"><div class="rot" style="margin-bottom:6px">Logros · ' +
      n + ' de ' + Logros.DEFS.length + '</div>' + items + '</div>';

    h += '</div>'; /* landcol */
    h += '</div>'; /* landmore */

    $('p-inicio').innerHTML = h;
  }

  /* ================= PERFIL (elegí tu escalón y quién eres) ================= */

  function renderPerfil() {
    var h = '<div class="landhero"><div class="landcol">';
    h += '<div class="pq"><span class="linklike" data-act="volver-inicio">‹ Volver</span></div>';
    h += '<div class="skycard" style="margin-top:10px">' + skylineSvg(inicioSel.nivel, true) +
      '<div class="skyhint">Toca un edificio para elegir tu escalón</div></div>';
    h += '<div class="rot" style="margin:16px 0 6px 0">Empieza como</div><div>' + rungChipsHtml() + '</div>';
    h += '<div class="pq mut" style="margin-top:8px" id="perfil-eco">' +
      (inicioSel.buscando ? '<span class="azul">Leyendo tu perfil de LinkedIn…</span> · ' : '') +
      (inicioSel.deLinkedin ? '<span class="verde">De LinkedIn:</span> ' + esc(inicioSel.deLinkedin) + ' · ' : '') +
      (inicioSel.nombre ? 'Juegas como <b>' + esc(inicioSel.nombre) + '</b> · ' : '') +
      'Empiezas la carrera como <b>' + esc(nivelPorN(inicioSel.nivel).rol) + '</b>' +
      (inicioSel.nivel > 0 ? ' — tu escalón real. O toca APM para correr toda la escalera.' : ' — la escalada completa, desde abajo.') +
      '</div>';
    h += '<div style="margin-top:16px"><span class="btn pri xl" data-act="nueva">Empezar mi carrera</span></div>';
    h += '<div class="pq mut" style="margin-top:10px"><span class="linklike" data-act="semanal">Desafío semanal (' +
      esc(Ranking.semana()) + ')</span></div>';

    h += '<div class="caja2" style="margin-top:20px"><div class="rot" style="margin-bottom:5px">¿Quién eres? ' +
      '<span class="mut" style="text-transform:none;letter-spacing:0">(opcional — siempre puedes empezar de cero)</span></div>';
    h += '<div style="margin-bottom:9px">' +
      '<span class="rolchip' + (inicioSel.modo !== 'linkedin' ? ' sel' : '') + '" data-modo="manual">Configurar manual</span>' +
      '<span class="rolchip' + (inicioSel.modo === 'linkedin' ? ' sel' : '') + '" data-modo="linkedin">Pegar mi LinkedIn</span></div>';
    if (inicioSel.modo === 'linkedin') {
      h += '<input type="text" id="perfil-in" placeholder="Pega tu URL de LinkedIn..." ' +
        'value="' + esc(inicioSel.texto || '') + '">';
      h += '<div class="pq mut" style="margin-top:7px">' +
        (inicioSel.buscando ? '<span class="azul">Leyendo tu perfil…</span>' :
         inicioSel.nombre || inicioSel.deLinkedin ?
           '<span class="verde">Detectado:</span> ' + (inicioSel.nombre ? esc(inicioSel.nombre) : 'perfil encontrado') +
           (inicioSel.deLinkedin && inicioSel.deLinkedin !== 'perfil encontrado' ? ' — ' + esc(inicioSel.deLinkedin) : '') +
           ' · escalón <b>' + esc(nivelPorN(inicioSel.nivel).rol) + '</b>' :
         'Leemos tu nombre y cargo para ubicarte en el escalón correcto — lo podés ajustar arriba en cualquier momento.') +
        '</div>';
    } else {
      h += '<input type="text" id="nombre-in" placeholder="Tu nombre (opcional)" ' +
        'value="' + esc(inicioSel.nombre || '') + '">';
      h += '<div class="rot" style="margin:9px 0 4px 0">¿De dónde vienes?</div><div>' + (function () {
        var BGS = [['product','Producto'],['design','Diseño'],['eng','Ingeniería'],['biz','Negocio'],['data','Datos']];
        var hb = '';
        for (var bi = 0; bi < BGS.length; bi++) {
          hb += '<span class="rolchip' + ((inicioSel.bg || 'product') === BGS[bi][0] ? ' sel' : '') + '" data-bg="' + BGS[bi][0] + '">' + BGS[bi][1] + '</span>';
        }
        return hb;
      })() + '</div>';
    }
    h += '</div>';

    h += '</div></div>'; /* landcol, landhero */
    $('p-perfil').innerHTML = h;
  }

  /* ================= OFERTAS ================= */

  function renderOfertas(cierreExtra) {
    var era = Mundo.era(M), ofs = C.ofertas, i;
    var h = '<div class="rot">Mes ' + M.mes + ' de tu carrera · ' + esc(nivelPorN(C.nivel).rol) +
            ' · reputación ' + Math.round(C.reputacion) +
            (C.semana ? ' · <span class="lila">desafío semanal ' + esc(C.semana) + '</span>' : '') + '</div>' +
            '<div class="h1" style="margin-top:2px">Sobre la mesa</div>';

    h += '<div class="era-banner"><span class="nombre-era">' + esc(era.nombre) + '</span>' +
         '<div class="pq mut">' + esc(era.desc) + '</div>' +
         (M.noticias.length ? '<div class="pq" style="margin-top:5px;color:var(--color-neutral-600)">◈ ' + esc(M.noticias[0].txt) + '</div>' : '') +
         '</div>';

    /* Age track: la progresión del jugador (ESCALAFON/C.nivel), separada de
       la Era del mundo de arriba. Un pip por nivel, relleno hasta donde llegaste. */
    var pips = '', sig2 = siguienteDesbloqueo(C.nivel);
    for (i = 0; i < ESCALAFON.length; i++) pips += '<i class="' + (i <= C.nivel ? 'on' : '') + '"></i>';
    h += '<div class="age-banner"><span class="rot">Edad · <b>' + esc(ESCALAFON[C.nivel].rol) + '</b></span>' +
         '<span class="agepips">' + pips + '</span>' +
         (sig2 ? '<div class="pq mut" style="margin-top:4px">La próxima Edad desbloquea <b>' + esc(NOMBRE_PALANCA[sig2.palanca] || sig2.palanca) + '</b></div>' : '') +
         '</div>';

    h += '<div class="tarjetas">';
    for (i = 0; i < ofs.length; i++) {
      var o = ofs[i];
      var calor = o.calor > 0 ? '<span class="pill hot">sector caliente</span>' :
                  o.calor < 0 ? '<span class="pill frio">sector frío</span>' : '';
      h += '<div class="oferta' + (ofertaSel === i ? ' sel' : '') + '" data-oferta="' + i + '">' +
        '<div class="cab ' + (o.fundar ? 'lila' : 'azul') + '">' + esc(o.sectorCorto) + ' · ' + esc(o.etapaNombre) + calor + '</div>' +
        '<h3>' + esc(o.nombre) + '</h3>' +
        '<div class="rolof">' + esc(o.rol) + ' · control ' + Math.round(o.mando * 100) + '%</div>' +
        '<div class="desc">' + esc(o.pitch) + '<br><br><i>' + esc(o.eje) + '</i></div>' +
        '<div class="mandato"><div class="rot" style="margin-bottom:3px">Mandato · se revela al aceptar</div>' +
        '<div style="font-size:15px;letter-spacing:2px" class="mut">???</div>' +
        '<div class="pq mut" style="font-size:11px;margin-top:4px">Contrato de ' + o.meses +
        ' meses. El trabajo real nunca te lo dicen en la entrevista.</div></div>' +
        '<div class="fila">Sueldo <b>' + money(o.sueldo) + '/año</b> · Equity <b>' +
          (o.fundar ? 'tuyo' : o.equity + '%') + '</b></div>' +
        '<div class="fila">Riesgo <b>' + esc(o.riesgoTxt) + '</b> · Slots de proyecto <b>' + (o.slots || 3) + '</b></div>' +
        '<div class="fila">Apuestas: <b>' + (o.perfil === 'grandes' ? 'pocas y grandes' : o.perfil === 'chicas' ? 'muchas y chicas' : o.perfil === 'incierto' ? 'difíciles de estimar' : 'cartera pareja') + '</b></div>' +
        '</div>';
    }
    h += '</div>';

    h += '<div style="margin-top:18px">' +
      '<span class="btn pri' + (ofertaSel >= 0 ? '' : ' off') + '" data-act="aceptar">Aceptar el puesto</span> ' +
      '<span class="btn sec" data-act="biblio">Biblioteca ' + Object.keys(C.codex).length + '/' + LIBROS.length + '</span> ' +
      '<span class="btn" data-act="volver-inicio">Volver</span></div>';
    $('p-ofertas').innerHTML = h;
    ir('p-ofertas');
  }

  /* ================= BRIEFING (día uno) ================= */

  function faseClase(fc) {
    return fc === 'PRE-PMF' ? 'ambar' : fc === 'VALIDANDO PMF' ? 'azul' : 'verde';
  }
  function faseIcono(fc) {
    return fc === 'PRE-PMF' ? 'validating' : fc === 'VALIDANDO PMF' ? 'pmf' : 'scaling';
  }

  /* El libro que la situacion de hoy dispara. Usa los mismos gatillos
     `cuando` de libros.js que abren fichas durante el mes, pero en modo
     lectura: no marca el codex — el briefing muestra la teoria, no la
     desbloquea. Si nada dispara, cae al libro canonico de la etapa. */
  var LIBRO_ETAPA = { 'PRE-PMF':'lean', 'VALIDANDO PMF':'hooked' };
  function libroDelDia(e, c) {
    var i, l, ok;
    for (i = 0; i < LIBROS.length; i++) {
      l = LIBROS[i];
      if (!l.cuando) continue;
      ok = false;
      try { ok = l.cuando(e, c); } catch (err) { ok = false; }
      if (ok) return l;
    }
    return libroPorId(LIBRO_ETAPA[e.faseCorta] || 'chasm');
  }

  function libroHoyHtml(e, c) {
    var l = libroDelDia(e, c);
    if (!l) return '';
    var pil = pilarDe(l.pilar);
    var ap = aplicarLibro(l.id, e);
    return '<div class="seccion-tit">Libro disparado hoy</div>' +
      '<div class="libhoy" data-lib="' + esc(l.id) + '" style="cursor:pointer">' +
      '<div class="rot">' + esc(pil.nombre) + '</div>' +
      '<div class="lhtit">' + esc(l.titulo) + ' — ' + esc(l.autor) + '</div>' +
      (l.concepto ? '<div class="pq" style="color:var(--color-accent-300);margin-bottom:5px">' +
        esc(l.concepto) + '</div>' : '') +
      '<div class="lhtx">' + esc(ap || primeraOracion(l.idea)) + '</div>' +
      '<div class="pq" style="margin-top:7px"><span class="linklike">Abrir la tarjeta →</span></div></div>';
  }

  function indBarra(nombre, valor, objetivo, mayorMejor) {
    var pasa = mayorMejor ? valor >= objetivo : valor <= objetivo;
    var cls = pasa ? 'ok' : 'no';
    var estado = pasa ? 'En camino' : 'Todavía no';
    var meta = mayorMejor ? ('necesita ' + Math.round(objetivo) + '%') : ('debe quedar bajo ' + Math.round(objetivo) + '%');
    return '<div class="indicador">' +
      '<div class="ind-cab"><span class="ind-nom">' + esc(nombre) + '</span>' +
      '<span class="ind-badge ' + cls + '">' + estado + '</span></div>' +
      '<div class="ind-track"><i class="ind-fill ' + cls + '" style="width:' + Math.max(0, Math.min(100, valor)) + '%"></i>' +
      '<i class="ind-obj" style="left:' + Math.max(0, Math.min(100, objetivo)) + '%"></i></div>' +
      '<div class="ind-meta"><b class="' + cls + '">' + Math.round(valor) + '%</b> ahora · ' + meta + ' para superar esta etapa</div></div>';
  }

  function mostrarBrief() {
    var era = Mundo.era(M);
    var calorTxt = J.calor > 0 ? '<span class="hot2">caliente</span>' :
                   J.calor < 0 ? '<span class="frio2">frío</span>' : 'estable';
    var m2 = mandatoPorId(J.mandatoId);
    var fclase = faseClase(J.faseCorta);
    var h = '<div class="mision-cinta ' + fclase + '"><span class="raya"></span><b>Briefing de misión</b></div>' +
      '<div class="rot">' + esc(J.sector) + ' · ' + esc(ETAPAS[J.etapa].nombre) + ' · tu día uno como ' + esc(J.rol) + '</div>' +
      '<div class="h1">' + esc(J.empresa) + '</div>';

    var calorSit = J.calor > 0 ? 'un sector caliente que todos persiguen' : J.calor < 0 ? 'un sector frío que nadie quiere fondear' : 'un sector que no se mueve para ningún lado';
    h += '<div class="situacion ' + fclase + '">Caes en paracaídas como <b>' + esc(J.rol) + '</b> en <b>' + esc(J.empresa) +
      '</b>: ' + mil(Motor.usuarios(J)) + ' usuarios, un equipo de ' + (J.ing + J.prod + J.gtm) + ', parado en ' + calorSit +
      ' durante ' + esc(era.nombre) + '. Tienes <b>' + J.meses + ' meses</b> en el reloj. ' + esc(m2.txt) + '</div>';

    var sec2 = sectorPorId(J.sectorId), emp2 = empresaPorId(J.empresaId);
    var mix = Motor.mixSegmentos(J), icpTxt = 'Todavía sin usuarios propios.';
    if (mix.length) {
      icpTxt = '<b>' + Math.round(mix[0].pct * 100) + '% ' + esc(mix[0].seg.nombre) + '</b> — “' + esc(mix[0].seg.desc) + '”';
      if (mix.length > 1) {
        var resto = [];
        for (var mi = 1; mi < mix.length; mi++) resto.push(Math.round(mix[mi].pct * 100) + '% ' + esc(mix[mi].seg.nombre));
        icpTxt += ' <span class="mut">· ' + resto.join(' · ') + '</span>';
      }
    }
    h += '<div class="seccion-tit">La empresa, hoy</div>';
    h += '<div class="caja2">' +
      '<div class="rot" style="margin-bottom:4px">A qué se dedica ' + esc(J.empresa) + '</div>' +
      '<div class="pq">' + (emp2 ? esc(emp2.pitch) + ' ' : '') + (sec2 ? esc(sec2.desc) : '') + '</div>' +
      '<div class="rot" style="margin:10px 0 4px 0">A quién le vende hoy</div>' +
      '<div class="pq">' + icpTxt + '</div></div>';

    h += '<div class="fasebox"><span class="fasechip ' + fclase + '">' + svgIc(faseIcono(J.faseCorta)) + esc(J.faseCorta) + '</span>' +
         '<div class="faseobj">' + esc(J.objetivo) + '</div></div>';

    h += '<div class="notas" style="margin-top:14px">';
    h += '<div class="nota" style="width:170px"><div class="nk">Usuarios</div><div class="nv" style="font-size:30px">' + mil(Motor.usuarios(J)) + '</div></div>';
    h += '<div class="nota" style="width:170px"><div class="nk">Equipo</div><div class="nv" style="font-size:30px">' + (J.ing + J.prod + J.gtm) + '</div></div>';
    h += '<div class="nota" style="width:170px"><div class="nk">Sector</div><div class="nv" style="font-size:22px;margin-top:8px">' + calorTxt + '</div><div class="pq mut" style="font-size:10.5px">' + esc(era.nombre) + '</div></div>';
    h += '<div class="nota" style="width:280px"><div class="nk">Tu mandato · ' + J.meses + ' meses</div><div class="nv" style="font-size:17px;margin-top:8px;line-height:1.3">' + esc(m2.txt) + '</div></div>';
    h += '</div>';

    var i, k, nec;
    h += '<div class="dosc" style="display:-webkit-flex;display:flex;margin-top:8px">';
    h += '<div class="colx" style="width:470px;padding-right:26px">';
    h += '<div class="seccion-tit">Qué importa esta etapa</div>';
    h += '<div class="rot" style="margin-bottom:6px">Apuestas que cuentan doble para tu mandato</div><div>';
    for (i = 0; i < J.prima.length; i++) {
      nec = null;
      for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === J.prima[i]) nec = NECESIDADES[k];
      if (nec) h += '<span class="tagobj up">▲ ' + esc(nec.nombre) + ' <b>×1.3</b></span>';
    }
    h += '</div>';
    if (J.castiga.length) {
      h += '<div class="rot" style="margin:10px 0 6px 0">Apuestas que apenas cuentan ahora mismo</div><div>';
      for (i = 0; i < J.castiga.length; i++) {
        nec = null;
        for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === J.castiga[i]) nec = NECESIDADES[k];
        if (nec) h += '<span class="tagobj down">▽ ' + esc(nec.nombre) + ' <b>×0.5</b></span>';
      }
      h += '</div>';
    }

    /* indicadores que de verdad tienes que mover para superar esta etapa */
    h += '<div class="rot" style="margin-top:16px;margin-bottom:2px">Qué supera esta etapa</div>';
    h += '<div class="indicadores">';
    if (J.faseCorta === 'PRE-PMF') {
      h += indBarra('Encaje producto-mercado', Motor.fitMax(J) * 100, 50, true);
      h += indBarra('Evidencia reunida', J.evidencia, 70, true);
    } else if (J.faseCorta === 'VALIDANDO PMF') {
      h += indBarra('Retención mensual', Motor.retencionMedia(J) * 100, 90, true);
      h += indBarra('Evidencia reunida', J.evidencia, 85, true);
    } else {
      var rg2 = Motor.requisitosGate(J), okg2 = 0, gi2;
      for (gi2 = 0; gi2 < rg2.length; gi2++) if (rg2[gi2].ok) okg2++;
      h += indBarra('Requisitos de "' + esc(J.gateNombre) + '" cumplidos', rg2.length ? (okg2 / rg2.length * 100) : 100, 100, true);
      h += indBarra('Carga del sistema', Motor.carga(J) * 100, 90, false);
    }
    h += '</div>';

    /* la teoría detrás de la etapa, y el veredicto sobre ESTA empresa */
    var teo = '', caso = '';
    if (J.faseCorta === 'PRE-PMF') {
      teo = 'Steve Blank: antes del encaje, una startup no es una empresa chica — es una búsqueda. El estudio ' +
        'Startup Genome midió la causa número uno de muerte: escalar demasiado pronto (contratar, crecer, endurecer ' +
        'procesos antes de validar que el problema arde). Por eso aquí el juego premia Core y Flow y castiga Scale.';
      var fx = Math.round(Motor.fitMax(J) * 100);
      caso = esc(J.empresa) + ' hoy: ' + mil(Motor.usuarios(J)) + ' usuarios, evidencia ' + Math.round(J.evidencia) +
        ', mejor encaje ' + fx + '%. ' + (fx < 50 ? 'Traducción: todavía no sabes si alguien quiere esto. Descubre antes de construir.' :
        'El encaje asoma: valídalo con retención antes de pisar el acelerador.');
    } else if (J.faseCorta === 'VALIDANDO PMF') {
      teo = 'Andy Rachleff (acuñó el término): el encaje producto-mercado no se declara, se nota — la curva de retención ' +
        'se aplana en vez de caer a cero, y el crecimiento empieza a llegar solo, sin comprarlo. La curva plana es LA ' +
        'prueba; los acumulados son teatro. Por eso aquí mandan Flow (activar mejor) y Data (ver las cohortes).';
      var rr = Math.round(Motor.retencionMedia(J) * 100);
      caso = esc(J.empresa) + ' retiene ' + rr + '% al mes. ' + (rr >= 90 ? 'La curva se está aplanando: esto empieza a ser encaje real.' :
        'De cada 100 que entran, a los 6 meses quedan ' + Math.round(Math.pow(Motor.retencionMedia(J), 6) * 100) + '. Esa curva todavía cae: el encaje no está probado.');
    } else {
      teo = 'Geoffrey Moore: el mercado grande no compra promesas — compra el producto completo: integraciones, ' +
        'soporte, garantías, referencias. Y Accelerate suma la otra mitad: a escala, velocidad y estabilidad se ' +
        'construyen juntas o se pierden juntas. Por eso aquí mandan Integr., Support, Security y Scale.';
      var rg = Motor.requisitosGate(J), okg = 0, gi;
      for (gi = 0; gi < rg.length; gi++) if (rg[gi].ok) okg++;
      caso = esc(J.empresa) + ' cumple ' + okg + ' de ' + rg.length + ' requisitos de "' + esc(J.gateNombre) +
        '" y la carga del sistema está en ' + Math.round(Motor.carga(J) * 100) + '%. Lo que falte de esa lista ES tu roadmap.';
    }
    h += '<div class="teoria-caso" style="margin-top:10px">' +
         '<div class="rot" style="margin-bottom:4px">El manual que sigue esta etapa</div>' +
         '<div class="pq" style="line-height:1.5">' + teo + '</div>' +
         '<div class="rot" style="margin:10px 0 4px 0">' + esc(J.empresa) + ', ahora mismo</div>' +
         '<div class="pq caso-linea" style="border-top:none;margin-top:0;padding-top:0">' + caso + '</div></div>';
    h += '</div>';

    h += '<div class="colx" style="width:400px"><div class="seccion-tit">Tu equipo</div>' +
      '<div class="rot" style="margin-bottom:4px">Con quiénes vas a trabajar</div>' +
      '<div class="pq mut" style="margin-bottom:10px">Pueden ayudarte a aterrizar las apuestas ▲ de arriba — o bloquearlas.</div>';
    var elencoKeys = ['ceo','cto','ventas','estrella'];
    for (i = 0; i < elencoKeys.length; i++) {
      var per = J.elenco[elencoKeys[i]];
      h += '<div class="quien" style="margin:4px 0"><div class="avatar">' + esc(per.nombre.charAt(0)) + '</div>' +
           '<div><div class="qn">' + esc(per.nombre) + '</div><div class="qc">' + esc(per.cargo) + '</div></div></div>';
    }
    h += libroHoyHtml(J, C);
    h += '</div></div>';

    h += '<div style="margin-top:16px"><span class="btn pri" data-act="empezar-puesto">' + (J.briefVisto ? 'Volver al mes' : 'Empezar el mes 1') + '</span>' +
      (!J.briefVisto ? ' <span class="btn" data-act="volver-ofertas">Volver a las ofertas</span>' : '') + '</div>';
    $('p-brief').innerHTML = h;
    ir('p-brief');
  }

  /* ================= JUEGO ================= */

  function nuevoMes() {
    plan = { desc:0, plat:0, fiab:0, crec:0, asig:{}, orden:[] };
    /* los proyectos ya en vuelo llegan precargados con puntos, en orden */
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

  /* ---------- la cabecera del mes ----------
     Una sola fila: fase, mandato con su barra segmentada, capital politico y
     el Regulador. La barra no es un relleno liso — se parte en los ejes que
     COMPONEN el mandato, con el mismo color que despues llevan los chips de
     las iniciativas y el riel de las metricas del panel. Ese color compartido
     es toda la explicacion: no hay que leer una formula para ver que una
     iniciativa con el chip celeste encendido empuja la parte celeste de la
     barra. Y el tramo rayado del final es la proyeccion: hasta donde llegaria
     el mandato si cerraras el mes con el plan que tenes puesto ahora. */
  var SEG_COLOR = { act:'var(--color-accent-300)', ret:'var(--color-accent-500)',
                    rel:'var(--color-accent-700)', adq:'var(--color-accent-400)',
                    rev:'var(--color-accent-600)', ref:'var(--color-accent-500)',
                    evid:'var(--color-accent-400)', deuda:'var(--color-accent-600)',
                    gate:'var(--color-accent-500)' };

  /* Cuanto avanzaria el mandato si el mes cerrara con el plan de ahora: las
     iniciativas que van a salir este mes, mas lo que rinden las estaciones.
     Es una proyeccion sobre los MISMOS numeros esperados que ve el jugador en
     las tarjetas — no espia el resultado real. */
  function proyeccionMandato() {
    var m = mandatoPorId(J.mandatoId);
    if (!m || !m.fuentes) return 0;
    var total = 0, i, f, id, d;
    for (i = 0; i < plan.orden.length; i++) {
      id = plan.orden[i];
      if ((J.enVuelo[id] || 0) + (plan.asig[id] || 0) < Motor.costoDe(J, id)) continue;
      d = Motor.estimacionDetalle(J, id);
      var alineada = J.prima.indexOf(Motor.apuesta(id).nec) >= 0;
      for (f = 0; f < m.fuentes.length; f++) {
        var k = m.fuentes[f][0], w = m.fuentes[f][1], v = d.vec[k] || 0;
        /* los chips estan en la escala de la metrica, no del indice */
        if (k === 'act') v = v * 0.8;
        else if (k === 'ret') v = v * 0.15;
        else if (k === 'rel') v = v * 0.4;
        total += v * w * (alineada ? 1.3 : 1);
      }
    }
    /* las estaciones tambien mueven el mandato, y eso es justo lo que el
       jugador no ve si solo mira las tarjetas */
    for (f = 0; f < m.fuentes.length; f++) {
      var kk = m.fuentes[f][0], ww = m.fuentes[f][1];
      if (kk === 'act') total += plan.desc * 0.14 * ww;
      else if (kk === 'rel') total += plan.fiab * 0.45 * ww;
      else if (kk === 'evid') total += plan.desc * 1.1 * J.calidadDesc * ww;
      else if (kk === 'deuda') total += plan.plat * 0.55 * ww;
    }
    return Math.round(total * 10) / 10;
  }

  var LUPA_ESTADOS = ['tranquilo', 'te mira', 'inspecciones', 'te ofrece un trato', 'allanamiento'];

  function reguladorHtml() {
    var lupa = Math.max(0, Math.min(100, Math.round(J.lupa || 0)));
    var nivel = lupa <= 0 ? 0 : Math.min(4, Math.ceil(lupa / 20) - 1);
    var cls = nivel >= 3 ? 'alto' : nivel >= 2 ? 'medio' : '';
    var h = '<div class="regu ' + cls + '">' + svgIc('focus') +
      '<div><div class="k">Regulador' + ayuda('lupa') + '</div>' +
      '<div class="regur"><span class="regupips">';
    for (var i = 0; i < 5; i++) h += '<i class="' + (i <= nivel && lupa > 0 ? 'on' : '') + '"></i>';
    return h + '</span><span class="regue">' + LUPA_ESTADOS[lupa > 0 ? nivel : 0] + '</span></div></div></div>';
  }

  function renderHud() {
    var m = mandatoPorId(J.mandatoId);
    var prog = Motor.progresoMandato(J);
    var pol = Math.round(J.politico);
    var val = m.valor(J), meta = m.meta(J), base = valorMandatoInicio();
    var i, f;

    /* la barra va de donde arrancaste a la meta, partida por los ejes que
       componen el mandato */
    var span = Math.abs(meta - base) || 1;
    var hechoPct = Math.max(0, Math.min(100, Math.abs(val - base) / span * 100));
    var proy = proyeccionMandato();
    var proyPct = Math.max(0, Math.min(100 - hechoPct, proy / span * 100));
    var fuentes = m.fuentes || [[ejeDe(J.mandatoId) || 'act', 1]];

    var segs = '', leyenda = '';
    for (f = 0; f < fuentes.length; f++) {
      var k = fuentes[f][0], w = fuentes[f][1], col = SEG_COLOR[k] || 'var(--color-accent)';
      segs += '<i style="width:' + (hechoPct * w) + '%;background:' + col + '"></i>';
      if (fuentes.length > 1) {
        leyenda += '<span><i style="background:' + col + '"></i>' + esc(nombreEje(k)) + '</span>';
      }
    }
    if (proyPct > 0) segs += '<i class="ghost" style="width:' + proyPct + '%"></i>';
    if (proyPct > 0) leyenda += '<span><i class="ghost"></i>si cierras el mes así</span>';

    var h = '<span class="fasechip mini ' + faseClase(J.faseCorta) + '" data-act="ver-objetivo">' +
      svgIc(faseIcono(J.faseCorta)) + esc(J.faseCorta) + '</span>';
    h += '<div class="hmand">' +
      '<div class="hmt"><span class="mut">Mandato:</span> <b>' + esc(m.txt) + '</b>' + ayuda('mandato') + '</div>' +
      '<div class="hmb"><span class="track segs">' + segs + '</span>' +
      vHud('mand', m.fmt(val), '<span class="mut">' + esc(m.fmt(base)) + ' → </span>' + esc(m.fmt(val)) +
        (proy > 0 ? '<span class="proy"> → ' + esc(m.fmt(Math.min(meta, val + proy))) + '</span>' : '') +
        '<span class="mut"> · meta ' + esc(m.fmt(meta)) + '</span>', 'hmv') +
      ayuda(m.id === 'activacion' ? 'usabilidad' : 'mandato') +
      '</div>' +
      (leyenda ? '<div class="hmleg">' + leyenda + '</div>' : '') +
      '</div>';
    h += '<div class="hudi der">' +
      '<div class="hi"><div class="k">Mes</div><div class="v num">' + (J.mesPuesto + 1) +
        '<span class="mut" style="font-size:13px"> de ' + J.meses + '</span></div></div>' +
      '<div class="hi"><div class="k">Capital político' + ayuda('capital') + '</div>' +
        '<div class="v num ' + (pol < 25 ? 'rojo' : pol < 45 ? 'ambar' : '') + '">' + pol + '</div></div>' +
      reguladorHtml() +
      '</div>';
    $('hud').innerHTML = h;
  }

  /* de donde arrancó el mandato: el punto cero de la barra */
  function valorMandatoInicio() {
    var m = mandatoPorId(J.mandatoId);
    if (m.id === 'activacion') return J.usabilidadInicio;
    if (m.id === 'retencion') return J.retencionInicio !== undefined ? J.retencionInicio : 0;
    if (m.id === 'crecer') return J.usuariosInicio;
    if (m.id === 'ingresos') return J.mrrInicio;
    if (m.id === 'descubrir') return J.evidenciaInicio;
    if (m.id === 'deuda') return J.deudaInicio !== undefined ? J.deudaInicio : 100;
    return 0;
  }

  /* la alerta de ritmo va arriba de todo, en ámbar: es lo primero que hay que
     saber del mes — vas a llegar o no. El "lo mueve: ..." no vive acá: es una
     instrucción sobre el backlog, y su lugar es el backlog. */
  function renderRitmo() {
    var r = Motor.ritmoMandato(J);
    var runTxt = r.runway > 90 ? '∞' : r.runway.toFixed(1) + ' meses';
    var txt, tono;
    if (r.cumplido) {
      tono = 'ok';
      txt = 'Mandato cumplido. Asegúralo — runway ' + runTxt + '.';
    } else {
      var nm = Math.max(1, Math.ceil(r.mesesMeta));
      var mesesTxt = isFinite(r.mesesMeta) ? ('~' + nm + (nm === 1 ? ' mes' : ' meses')) : 'nunca';
      if (r.ritmo <= 0.0005) { tono = 'mal'; txt = 'A este ritmo no estás moviendo la aguja: esto no se cumple solo.'; }
      else if (!r.llegaAntesDeCash) { tono = 'mal'; txt = 'Te quedas sin caja antes de lograrlo: necesitas ' + mesesTxt + ', runway ' + runTxt + '.'; }
      else if (!r.llegaEnPlazo) { tono = 'ojo'; txt = 'A este ritmo llegas en ' + mesesTxt + ' — tu plazo es ' + r.restantesPuesto + '.'; }
      else { tono = 'ok'; txt = 'A este ritmo llegas en ' + mesesTxt + ' — la caja aguanta ' + runTxt + '.'; }
    }
    $('ritmo').className = 'ritmobar ' + tono;
    $('ritmo').innerHTML = svgIc(tono === 'ok' ? 'check' : 'warning') +
      '<span class="rtx">' + txt + '</span>' + chip('pgdefault');
  }

  /* Age track: el ESCALAFON de carrera (8 niveles, cada uno desbloquea una
     Iniciativa) es, sin tocarlo, exactamente la progresión estilo Age of
     Empires que pide el diseño — solo hacía falta mostrarla como tal. Esto
     es progresión del JUGADOR (C.nivel), distinta de la Era del mundo
     (exógena, arriba en #era). */
  var NOMBRE_PALANCA = { desc:'Descubrir', plat:'Plataforma', fiab:'Fiabilidad', crec:'Crecimiento' };
  function siguienteDesbloqueo(nivel) {
    for (var k = nivel + 1; k < ESCALAFON.length; k++) {
      var nuevas = ESCALAFON[k].palancas.filter(function (p) { return ESCALAFON[nivel].palancas.indexOf(p) < 0; });
      if (nuevas.length) return { nivel:k, palanca:nuevas[0] };
    }
    return null;
  }

  /* El mes como recurso, estilo Age of Empires: tu equipo produce puntos;
     tú los estacionas. Lo que no estaciones va a CONSTRUIR y empuja tus
     proyectos elegidos. Cada punto es visible y está contado. */
  var ESTACIONES = [
    { k:'desc', n:'Descubrir', svg:'discover', col:'var(--color-accent-400)', req:'desc', lib:'torres', tipk:'st_desc',
      rinde:function (v) { return '+' + Math.round(v * 1.1 * J.calidadDesc * (1 + J.hab.producto / 200)) + ' evid'; } },
    { k:'plat', n:'Plataforma', svg:'platform', col:'var(--color-accent-500)', req:'plat', lib:'fowler', tipk:'st_plat',
      rinde:function (v) { return '−' + Math.round(v * 0.55 * (1 + J.hab.tecnologia / 150)) + ' deuda'; } },
    { k:'fiab', n:'Fiabilidad', svg:'reliability', col:'var(--color-accent-600)', req:'fiab', lib:'sre', tipk:'st_fiab',
      rinde:function (v) { return '+' + Math.round(v * 0.45) + ' uptime'; } },
    { k:'crec', n:'Crecimiento', svg:'growth', col:'var(--color-accent-700)', req:'crec', lib:'chasm', tipk:'st_crec',
      rinde:function (v) { return '+alcance · $' + Math.round(v * 0.9) + 'k'; } }
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
    var i, k;

    /* El equipo pasa a una tira de chips de una línea. Las estaciones son un
       ajuste, no el protagonista — el protagonista son las iniciativas de
       abajo. Cada chip lleva su "?" porque lo que hace cada estación no se
       deduce de su nombre. */
    var abiertas = [], cerradas = [];
    for (i = 0; i < ESTACIONES.length; i++) {
      if (J.palancas.indexOf(ESTACIONES[i].req) >= 0) abiertas.push(ESTACIONES[i]);
      else cerradas.push(ESTACIONES[i]);
    }

    var h = '<div class="equipo"><span class="eqk">Equipo</span>';
    for (i = 0; i < abiertas.length; i++) {
      var st = abiertas[i], vv = plan[st.k];
      h += '<span class="eqchip' + (vv > 0 ? ' viva' : '') + '">' + svgIc(st.svg) +
        '<span class="eqn">' + esc(st.n) + '</span>' + ayuda(st.tipk) +
        '<span class="b' + (vv <= 0 ? ' off' : '') + '" data-menos="' + st.k + '">−</span>' +
        '<span class="eqv num">' + vv + '</span>' +
        '<span class="b' + (ocio <= 0 ? ' off' : '') + '" data-mas="' + st.k + '">+</span>' +
        (vv > 0 ? '<span class="eqr">' + st.rinde(vv) + '</span>' : '') + '</span>';
    }
    if (cerradas.length) {
      var partes = [];
      for (i = 0; i < cerradas.length; i++) {
        var falta = '';
        for (k = 0; k < ESCALAFON.length; k++) {
          if (ESCALAFON[k].palancas.indexOf(cerradas[i].req) >= 0) { falta = ESCALAFON[k].corto; break; }
        }
        partes.push(cerradas[i].n + ' (' + falta + ')');
      }
      h += '<span class="eqlock">🔒 ' + partes.join(' · ') + '</span>';
    }
    h += '</div>';
    $('capa').innerHTML = h;
  }

  /* ---------------- un solo vocabulario ----------------
     El problema no era que faltaran palancas: era que la misma variable tenía
     tres nombres distintos según dónde la miraras. El mandato decía
     "usabilidad", el panel decía "Activación" y el chip de la apuesta decía
     "ACT" — y nadie podía atar los tres. Ahora hay UN eje por cosa medible, con
     UN nombre, y ese nombre aparece igual en el mandato, en el chip
     de cada proyecto y en la estación que lo mueve.

     `est` es la estación del mes que empuja ese eje sin construir nada: es la
     respuesta a "¿y si ninguna apuesta lo mueve?". */
  /* ---------- vocabulario de ejes ----------
     Seis ejes de estado (los AARRR + confiabilidad) con su abreviatura, mas
     tres cosas que tambien mueven mandatos pero no son del embudo. La
     abreviatura y el color son lo que ata el chip de una iniciativa con el
     segmento de la barra del mandato y con el riel de la metrica en el panel:
     el mismo eje se ve igual en los tres lugares. */
  var EJES = {
    adq:   { n:'Adquisición',  ab:'ADQ',  ic:'acquisition', est:'crec' },
    act:   { n:'Activación',   ab:'ACT',  ic:'activation',  est:'desc' },
    ret:   { n:'Retención',    ab:'RET',  ic:'retention',   est:null   },
    rel:   { n:'Confiabilidad',ab:'CONF', ic:'reliability', est:'fiab' },
    rev:   { n:'Ingresos',     ab:'REV',  ic:'revenue',     est:'crec' },
    ref:   { n:'Referidos',    ab:'REF',  ic:'referral',    est:'crec' },
    gate:  { n:'Compuerta',    ab:'Compuerta', ic:'pmf',    est:null   },
    evid:  { n:'Evidencia',    ab:'Evidencia', ic:'evidence', est:'desc' },
    deuda: { n:'Deuda',        ab:'Deuda', ic:'debt',       est:'plat', invertido:true }
  };
  /* los seis del embudo, en el orden en que se leen de arriba abajo */
  var EJES_EMBUDO = ['adq','act','ret','rel','rev','ref'];
  var ORDEN_EJES = ['adq','act','ret','rel','rev','gate','evid','deuda'];
  var MET_MANDATO = { retencion:'ret', crecer:'adq', ingresos:'rev', activacion:'act',
                      estabilidad:'rel', deuda:'deuda', abismo:'gate', descubrir:'evid' };
  var COMO_MOVER = {
    retencion:'iniciativas con <b>RET +</b>',
    crecer:'iniciativas con <b>ADQ +</b> · estación <b>Crecimiento</b>',
    ingresos:'iniciativas con <b>REV +</b> · estación <b>Crecimiento</b>',
    activacion:'iniciativas con <b>ACT</b>, <b>RET</b> o <b>CONF</b> · estaciones <b>Descubrir</b> y <b>Fiabilidad</b>',
    estabilidad:'iniciativas con <b>CONF +</b> · estación <b>Fiabilidad</b>',
    deuda:'estación <b>Plataforma</b> — y ojo: <b>cada iniciativa que construyes la sube</b>',
    abismo:'iniciativas con <b>Compuerta +</b> (los requisitos, abajo a la derecha)',
    descubrir:'estación <b>Descubrir</b> · iniciativas de datos'
  };
  function ejeDe(mandatoId) { return MET_MANDATO[mandatoId] || null; }
  function nombreEje(k) { return (EJES[k] && EJES[k].n) || k; }
  function abrevEje(k) { return (EJES[k] && EJES[k].ab) || k; }

  /* los ejes que ALIMENTAN el mandato, con su peso. Es la misma lista que
     parte la barra de la cabecera y la que decide qué chip va encendido. */
  function fuentesMandato() {
    var m = J && mandatoPorId(J.mandatoId);
    if (m && m.fuentes) return m.fuentes;
    var k = J ? ejeDe(J.mandatoId) : null;
    return k ? [[k, 1]] : [];
  }
  function pesoEje(k) {
    var f = fuentesMandato(), i;
    for (i = 0; i < f.length; i++) if (f[i][0] === k) return f[i][1];
    return 0;
  }
  function ejesEnJuego() {
    var s2 = {}, f = fuentesMandato(), i;
    for (i = 0; i < f.length; i++) s2[f[i][0]] = 'mandato';
    return s2;
  }

  /* Un chip por eje. Los que alimentan el mandato van encendidos y con el
     anillo del color de SU segmento en la barra de arriba: ese color es toda
     la explicación de por qué esa iniciativa mueve la aguja. */
  function chipEje(mk, v, alimenta) {
    var eje = EJES[mk] || { n:mk, ab:mk }, cls, txt;
    if (!v) { cls = 'vnull'; txt = eje.ab + ' —'; }
    else if (eje.invertido) {
      /* la deuda es el único eje donde el número que sube es el malo */
      cls = v < 0 ? 'vneg' : 'vpos';
      txt = eje.ab + ' ' + (v < 0 ? '+' : '−') + Math.abs(v);
    } else {
      cls = v > 0 ? 'vpos' : 'vneg';
      txt = eje.ab + ' ' + (v > 0 ? '+' : '') + v;
    }
    var brillo = alimenta && v > 0 && cls === 'vpos';
    return '<span class="vchip ' + cls + (brillo ? ' vmeta' : '') +
      (brillo ? '" style="box-shadow:0 0 0 1.5px ' + (SEG_COLOR[mk] || 'var(--color-accent)') +
        ',0 0 8px color-mix(in srgb,' + (SEG_COLOR[mk] || 'var(--color-accent)') + ' 45%, transparent)' : '') +
      '">' + txt + '</span>';
  }

  /* Solo los chips que valen algo. Los que alimentan el mandato van
     encendidos; que una iniciativa no lo mueva lo dice el sello del pie, no
     tres chips en cero. */
  function chipsVec(vec, ejes) {
    var h = '', i, mk, otros = 0, alimenta;
    for (i = 0; i < ORDEN_EJES.length; i++) {
      mk = ORDEN_EJES[i];
      if (!vec[mk]) continue;
      alimenta = !!(ejes && ejes[mk]);
      if (!alimenta && mk !== 'deuda' && otros >= 2) continue;
      if (!alimenta && mk !== 'deuda') otros++;
      h += chipEje(mk, vec[mk], alimenta);
    }
    return h || '<span class="vchip vnull">sin efecto medible</span>';
  }

  /* Cuánto aporta una iniciativa al mandato: sus chips × el peso de cada eje,
     ×1.3 si está alineada a lo que premia la etapa. Es el número que decide si
     la tarjeta lleva el sello "↑ mandato". */
  function aporteMandato(vec, alineada) {
    var f = fuentesMandato(), t = 0, i;
    for (i = 0; i < f.length; i++) t += (vec[f[i][0]] || 0) * f[i][1];
    return Math.round(t * (alineada ? 1.3 : 1) * 10) / 10;
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
    var h = '';
    var id, i, a, d;
    /* el rotulo de "Tus proyectos" con la fila de slots vacia y nada debajo
       era una seccion fantasma en el mes 1: solo aparece cuando hay algo */
    if (plan.orden.length) h += '<div class="rot" style="margin:8px 0 7px 0">Tus proyectos ' + cajas + '</div>';

    /* tu tablero: los proyectos que reciben puntos este mes */
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
        (sale ? '<span class="shiptag">SALE ESTE MES</span>' :
          (pts === 0 ? '<span class="pill">en pausa</span>' : '')) + '</div>' +
        '<div class="prog"><i class="pdone" style="width:' + pDone + '%"></i><i class="pprev" style="width:' + pPrev + '%"></i></div>' +
        '<div class="d2">faltan ' + falta + ' de ' + cst + ' pts</div></div>' +
        '<div class="ctrl">' +
        '<div class="b' + (pts <= 0 ? ' off' : '') + '" data-pmenos="' + id + '">−</div>' +
        '<div class="n num">' + pts + '</div>' +
        '<div class="b' + (sinUsar() <= 0 || sale ? ' off' : '') + '" data-pmas="' + id + '">+</div>' +
        '</div>' +
        (J.enVuelo[id] === undefined ? '<div class="quitar" data-quitar="' + id + '">✕</div>' : '<div class="quitar mut" style="visibility:hidden">✕</div>') +
        '</div>';
    }
    /* Cuántas iniciativas del backlog mueven de verdad el mandato, y un filtro
       para ver solo esas. */
    var ejesAqui = ejesEnJuego(), mueven = [], di;
    for (i = 0; i < J.backlog.length; i++) {
      id = J.backlog[i];
      if (plan.orden.indexOf(id) >= 0) continue;
      di = Motor.estimacionDetalle(J, id);
      if (aporteMandato(di.vec, J.prima.indexOf(Motor.apuesta(id).nec) >= 0) > 0) mueven.push(id);
    }
    h += '<div class="rot inicrot" style="margin:' + (plan.orden.length ? '14px' : '2px') + ' 0 10px 0">' +
      '<span class="init">Iniciativas · ' + J.slots + ' slots' + ayuda('apuestas') + '</span>' +
      '<span class="inihint">' + (mueven.length ?
        '<span class="filtroeje' + (soloMandato ? ' on' : '') + '" data-act="filtro-eje">' +
          (soloMandato ? '✓ ' : '') + 'solo las ' + mueven.length + ' que mueven tu mandato</span>' :
        'ninguna mueve tu mandato') +
      '</span></div>';
    if (ejesAqui.deuda) {
      h += '<div class="avisoeje">Ninguna iniciativa <b>baja</b> la deuda — todas la suben, y el chip lo dice. ' +
        'Se baja con la estación <b>Plataforma</b>.</div>';
    } else if (!mueven.length && COMO_MOVER[J.mandatoId]) {
      h += '<div class="avisoeje">Nada de acá mueve tu mandato. Lo mueve: ' + COMO_MOVER[J.mandatoId] + '.</div>';
    }

    for (i = 0; i < J.backlog.length; i++) {
      id = J.backlog[i]; a = Motor.apuesta(id);
      if (plan.orden.indexOf(id) >= 0) continue;
      if (soloMandato && mueven.length && mueven.indexOf(id) < 0) continue;
      d = Motor.estimacionDetalle(J, id);
      var cabe = slotsUsados() < J.slots && sinUsar() > 0;
      var nec = null, k2;
      for (k2 = 0; k2 < NECESIDADES.length; k2++) if (NECESIDADES[k2].id === a.nec) nec = NECESIDADES[k2];
      var alineada = J.prima.indexOf(a.nec) >= 0;
      var aporte = aporteMandato(d.vec, alineada);
      var esNueva = J.backlogNuevo && J.backlogNuevo[id] === J.mesPuesto;
      /* La iniciativa es la protagonista de la pantalla, así que se le da
         tamaño: título grande, la descripción entera, y una fila de decisión
         separada por una regla donde los chips que alimentan el mandato van
         encendidos. El sello final dice, sin rodeos, si mueve la aguja. */
      h += '<div class="ini' + (cabe ? '' : ' nocabe') + (aporte > 0 ? ' aporta' : '') + '" data-ap="' + id + '">' +
        '<div class="inih"><span class="inin">' + esc(a.n) + '</span>' +
          (esNueva ? '<span class="pill nueva">nuevo</span>' : '') +
          (nec ? '<span class="pill">' + esc(nec.corto) + (alineada ? ' ▲' : '') + '</span>' : '') + '</div>' +
        '<div class="inid">' + esc(a.d) + (a.d2 ? ' <span class="masdet" data-detalle="' + id + '">' +
          (detalleAbierto[id] ? 'menos' : 'más') + '</span>' : '') +
          (detalleAbierto[id] && a.d2 ? '<span class="inid2">' + esc(a.d2) + '</span>' : '') + '</div>' +
        '<div class="inim">' +
          '<span class="ml">Prob</span>' + dots(d.prob) +
          '<span class="ml">Esfuerzo</span><span class="tipped" data-tip="esf"><span class="esf e' + d.esf + '">' + d.esf + '</span></span>' +
          '<span class="mut">' + d.tiempo + ' · ' + d.costo + ' pts</span>' +
        '</div>' +
        '<div class="inie">' +
          '<span class="ml">Esperado</span>' + chipsVec(d.vec, ejesAqui) +
          '<span class="sello' + (aporte > 0 ? ' on' : '') + '">' +
            (aporte > 0 ? '↑ mandato' : 'no mueve el mandato') + '</span>' +
        '</div></div>';
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
    return '<div class="est">' +
      '<div class="estl">' + (icono ? '<span class="esti ' + cls + '">' + svgIc(icono) + '</span>' : '') +
      '<span class="elbl">' + lbl + '</span></div>' +
      (libro ? '<div class="estchip">' + chip(libro) + '</div>' : '') +
      '<div class="etrk"><span class="track"><i class="' + cls + '" style="width:' + Math.round(Math.max(4, Math.min(100, v))) + '%"></i></span></div>' +
      '</div>';
  }

  /* Cabecera de sección plegable. El panel tenía 26 números con el mismo peso
     visual: los tres que deciden el mes y los veintitrés que no. Ahora cada
     caja muestra lo que decide y guarda el resto detrás de un click. */
  function rotPleg(id, titulo, cuantos) {
    var ab = !!secAbierta[id];
    return '<div class="rot rotpleg" data-sec="' + id + '">' + titulo +
      '<span class="verplus">' + (ab ? 'ver menos' : '+' + cuantos + ' más') + '</span></div>';
  }

  /* Radar de los seis ejes: relleno = hoy, punteado = mes pasado. Las
     etiquetas de los ejes que componen el mandato van en acento — el mismo
     color con el que salen sus chips y su segmento de la barra. */
  function radarEstado() {
    var w = 268, hgt = 196, cx = w / 2, cy = 96, r = 66, N = EJES_EMBUDO.length, i;
    var prev = J.ejesPrev || null;
    function pt(k, f) {
      var ang = -Math.PI / 2 + k * 2 * Math.PI / N;
      return [cx + Math.cos(ang) * r * f, cy + Math.sin(ang) * r * f];
    }
    function poly(fn) {
      var out = [], k, q;
      for (k = 0; k < N; k++) { q = pt(k, fn(k)); out.push(q[0].toFixed(1) + ',' + q[1].toFixed(1)); }
      return out.join(' ');
    }
    var val = function (k) { return Math.max(0.04, Math.min(1, Motor.ejeValor(J, EJES_EMBUDO[k]) / 100)); };
    var h = '<svg class="radar2" width="' + w + '" height="' + hgt + '" viewBox="0 0 ' + w + ' ' + hgt + '">';
    h += '<polygon class="rg" points="' + poly(function () { return 1; }) + '"/>';
    h += '<polygon class="rg" points="' + poly(function () { return 0.5; }) + '"/>';
    if (prev) {
      h += '<polygon class="rp" points="' + poly(function (k) {
        return Math.max(0.04, Math.min(1, (prev[EJES_EMBUDO[k]] || 0) / 100)); }) + '"/>';
    }
    h += '<polygon class="rn" points="' + poly(val) + '"/>';
    for (i = 0; i < N; i++) {
      var lp = pt(i, 1.24), dx = lp[0] - cx;
      var anc = Math.abs(dx) < 8 ? 'middle' : dx > 0 ? 'start' : 'end';
      var mide = pesoEje(EJES_EMBUDO[i]) > 0;
      h += '<text class="rl' + (mide ? ' mide' : '') + '" x="' + lp[0].toFixed(1) + '" y="' +
        (lp[1] + 3).toFixed(1) + '" text-anchor="' + anc + '">' + esc(nombreEje(EJES_EMBUDO[i])) + '</text>';
    }
    return h + '</svg>';
  }

  function renderPanel() {
    var h = '', i;
    var ejes = ejesEnJuego();

    /* ---- Estado de la empresa: el radar y las seis métricas del embudo.
       Las que componen el mandato llevan riel de acento a la izquierda; el
       resto va neutro. Es la tercera aparición del mismo código de color:
       barra de arriba, chips de las iniciativas, y acá. ---- */
    h += '<div class="caja2"><div class="rot">Estado de la empresa' + ayuda('aarrr') + '</div>';
    h += radarEstado();
    h += '<div class="rleg"><span>— hoy</span><span class="mut">- - mes pasado</span></div>';
    var VALOR = {
      adq: '+' + mil(J.adqMes || 0) + '<span class="mut fsub">/mes</span>',
      act: Math.round(0.35 * 100 + (J.usabilidad / 100) * 65) + '%',
      ret: Math.round(Motor.retencionMedia(J) * 100) + '%',
      rel: Math.round(J.fiabPercibida) + '%',
      rev: money(J.mrr) + '<span class="mut fsub">/mes</span>',
      ref: (Math.round(J.viral * Motor.fitMax(J) * 100) / 100)
    };
    for (i = 0; i < EJES_EMBUDO.length; i++) {
      var k = EJES_EMBUDO[i], mide = pesoEje(k) > 0;
      h += '<div class="fun' + (mide ? ' funmide' : '') + '"' +
        (mide ? ' style="border-left-color:' + (SEG_COLOR[k] || 'var(--color-accent)') + '"' : '') + '>' +
        '<span class="funic' + (mide ? ' mide' : '') + '"' +
          (mide ? ' style="color:' + (SEG_COLOR[k] || 'var(--color-accent)') + '"' : '') + '>' +
          svgIc(EJES[k].ic) + '</span>' +
        '<span class="fk">' + nombreEje(k) + '</span>' +
        '<span class="fv num">' + VALOR[k] + '</span></div>';
    }
    h += '<div class="rleg2"><i></i>lo que mide tu mandato</div>';
    var run = Motor.runwayMeses(J);
    h += '<div class="pq mut" style="margin-top:8px">Caja ' + money(J.caja) + ' · runway ' +
      (run > 90 ? '∞' : run.toFixed(0) + ' m') + ' · valoración ' + money(J.valoracion) + '</div>';
    h += '</div>';

    /* ---- Impacto reciente: lo último entregado, real contra esperado ---- */
    if (J.historialImpacto && J.historialImpacto.length) {
      h += '<div class="caja2"><div class="rot">Impacto reciente</div>';
      for (i = 0; i < Math.min(3, J.historialImpacto.length); i++) {
        var hi = J.historialImpacto[i];
        var ok = hi.real >= hi.esperado * 0.8;
        h += '<div class="imp"><span class="' + (ok ? 'verde' : 'rojo') + '">' + (ok ? '▲' : '▼') + '</span>' +
          '<span class="impn">' + esc(hi.n) + '</span>' +
          '<span class="vchip ' + (ok ? 'vpos' : 'vneg') + '">real ' + hi.real + ' de ' + hi.esperado + '</span></div>';
      }
      h += '</div>';
    }

    /* ---- Compuerta al mercado ---- */
    if (J.gateRevelado) {
      var rq = Motor.requisitosGate(J), okn = 0;
      for (i = 0; i < rq.length; i++) if (rq[i].ok) okn++;
      h += '<div class="caja2"><div class="rot">Compuerta al mercado' + ayuda('gate') +
        '<span class="rotv">' + okn + ' de ' + rq.length + '</span></div>';
      for (i = 0; i < rq.length; i++) {
        h += '<div class="req' + (rq[i].ok ? ' ok' : '') + '">' + svgIc(rq[i].ok ? 'check' : 'ring') +
          '<span>' + esc(rq[i].txt) + '</span></div>';
      }
      h += '</div>';
    }

    /* ---- Lo que no decide el mes, plegado ---- */
    h += '<div class="caja2">' + rotPleg('mas', 'Más', 6);
    if (secAbierta.mas) {
      h += '<div class="fun"><span class="fk">Usuarios</span><span class="fv num">' + mil(Motor.usuarios(J)) + '</span></div>';
      var profit = J.mrr - Motor.burnMensual(J);
      h += '<div class="fun"><span class="fk">Ganancia</span><span class="fv num ' + (profit >= 0 ? 'verde' : 'rojo') + '">' + (profit >= 0 ? '+' : '') + money(profit) + '</span></div>';
      h += '<div class="fun"><span class="fk">Reputación</span><span class="fv num">' + Math.round(C.reputacion) + '</span></div>';
      h += '<div class="subrot">Salud</div>';
      h += barraEstado(tip('evid','Evidencia'), J.evidencia, false, 'lean', 'evidence');
      h += barraEstado(tip('debt','Deuda'), J.deuda, true, 'fowler', 'debt');
      h += barraEstado(tip('morale','Moral'), J.moral, false, null, 'morale');
      if (J.rolN >= 2) h += barraEstado(tip('load','Carga'), Motor.carga(J) * 100, true, 'ddia', 'load');
      if (J.rolN >= 3) {
        h += barraEstado(tip('ebudget','Presupuesto de error'), J.presupuestoError, false, 'sre', 'errorbudget');
        h += barraEstado(tip('focus','Foco'), J.foco, false, 'grove', 'focus');
      }
      h += '<div class="pq mut" style="margin-top:8px">' + J.ing + ' ing · ' + J.prod + ' prod · ' + J.gtm + ' gtm' +
        (J.rampa.length ? ' · <span class="ambar">' + J.rampa.length + ' en rampa</span>' : '') + '</div>';
    }
    if (!(J.capFondeo > 0)) {
      h += '<div class="alarma">' + svgIc('warning') + '<span><b>Sin combustible de fondeo</b> — las capacidades se erosionan. Levanta una ronda para reactivar el crecimiento.</span></div>';
    }
    h += '</div>';

    $('panel').innerHTML = h;
  }

  function renderBarra() {
    var ocio = sinUsar(), saliendo = 0, id;
    for (id in plan.asig) if (plan.asig.hasOwnProperty(id)) {
      if ((J.enVuelo[id] || 0) + plan.asig[id] >= Motor.costoDe(J, id)) saliendo++;
    }
    /* una sola cuenta: cuantos de tus puntos estan colocados. Lo demas
       (proyectos abiertos, cuantos salen) ya se ve en las tarjetas. */
    var total = Motor.capacidadPropia(J), puestos = total - ocio;
    var h = '<div class="pts"><b class="num' + (ocio > 0 ? ' ambar' : '') + '">' + puestos + ' de ' + total +
      '</b> puntos asignados' + (saliendo ? ' · <span class="verde">' + saliendo + ' sale' + (saliendo === 1 ? '' : 'n') + ' este mes</span>' : '') + '</div>';
    if (J.esFundador && !J.levantando) h += '<span class="btn chico" data-act="ronda" style="margin-right:10px">Salir a levantar</span>';
    h += '<span class="btn pri" data-act="ejecutar">Cerrar el mes</span>';
    $('barra').innerHTML = h;
  }

  /* todo lo que depende del plan del mes: las estaciones, las tarjetas, el
     pie — y la cabecera, porque la proyección de la barra de mandato sale de
     lo que tengas puesto ahora mismo */
  function replanificar() {
    renderAsignacion(); renderBacklog(); renderBarra(); renderHud();
  }

  function renderJuego() {
    ir('p-juego');
    renderHud(); renderRitmo();
    renderTabs();
    renderAsignacion(); renderBacklog(); renderPanel(); renderBarra();
  }

  /* ================= dilemas ================= */

  function primeraOracion(txt) {
    if (!txt) return '';
    var m = txt.match(/^[^.]{0,140}\./);
    if (m) return m[0];
    return txt.length > 140 ? txt.slice(0, 140) + '…' : txt;
  }

  function mostrarEvento(ev) {
    var tx = eventoTexto(ev, J);
    var quien = ev.quien && J.elenco[ev.quien] ? J.elenco[ev.quien] : null;
    var h = '<div class="rot">Mes ' + (J.mesPuesto + 1) + ' en ' + esc(J.empresa) + '</div>' +
            '<h2>' + esc(tx.titulo) + '</h2>';
    if (quien) {
      h += '<div class="quien"><div class="avatar">' + esc(quien.nombre.charAt(0)) + '</div>' +
           '<div><div class="qn">' + esc(quien.nombre) + '</div><div class="qc">' + esc(quien.cargo) + '</div></div></div>';
    }
    h += '<div class="pq mut" style="margin-bottom:4px">' + esc(tx.texto) + '</div>';
    var libroEv = ev.libro ? libroPorId(ev.libro) : null;
    if (libroEv) {
      var yaLeido = !!C.codex[ev.libro];
      h += '<div class="teoria-caso" style="margin:8px 0">' +
        '<div class="rot" style="margin-bottom:4px">' + (yaLeido ? 'Esto pone a prueba un concepto que conoces' : 'Antes de decidir') + '</div>' +
        '<div class="pq" style="line-height:1.5">' + esc(primeraOracion(libroEv.idea)) + ' ' + chip(ev.libro) + '</div>' +
        '</div>';
    }
    h += '<div class="cuerpo2 scroll">';
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
    var decisionTxt = op.txt;
    evActual = null;
    ov('ov-evento', false);
    renderJuego();
    mostrarResultado(log, 'Lo que dejó la decisión', true, libroTeoria, decisionTxt);
  }

  /* ================= cerrar el mes ================= */

  /* Cuánto del camino llevas — medido desde DONDE ARRANCASTE, no desde cero.
     Es el mismo denominador que la barra segmentada de la cabecera: si las dos
     pantallas cuentan distinto, el jugador no le cree a ninguna. */
  function pctMandato(m0, valor, meta) {
    if (!m0) return null;
    if (m0.invertido) {
      if (meta <= 0) return valor <= 0 ? 100 : Math.max(0, Math.round(100 - Math.min(valor, 5) * 20));
      if (valor <= meta) return 100;
    }
    var base = valorMandatoInicio();
    var span = Math.abs(meta - base);
    if (span < 0.0001) return valor >= meta ? 100 : 0;
    return Math.max(0, Math.min(100, Math.round(Math.abs(valor - base) / span * 100)));
  }

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
        mandato:{ antes:m0.fmt(valorAntes), despues:m0.fmt(valorDespues), meta:m0.fmt(m0.meta(J)), txt:m0.txt,
                  pct:pctMandato(m0, valorDespues, m0.meta(J)) } });
    }
    var fichas2 = fichasNuevas(J, C), fi;
    for (fi = 0; fi < fichas2.length; fi++) {
      log.push({ tipo:'nota', texto:'Se abrió una tarjeta en la biblioteca: el momento que estás viviendo tiene nombre.',
                 libro:fichas2[fi].id });
    }
    var cambioEra = Mundo.tick(M);
    if (cambioEra) {
      log.push({ tipo:'neutro', texto:'Cambió la era: empieza "' + cambioEra.nombre + '". ' + cambioEra.desc, libro:null });
    }
    marcarCodex(log);
    var todo = notasEvento.concat(log);
    guardar();
    if (!J.vivo) { cerrarPuesto(); return; }
    mostrarResultado(todo, 'Mes ' + J.mesPuesto + ' en ' + esc(J.empresa), false);
  }

  /* La jugada del mes: elige el titular entre lo que paso. Prioriza la
     entrega que mas se paso de lo esperado; si no hubo entregas, el mandato
     cumplido; y si tampoco, el mejor evento del mes. */
  function jugadaDelMes(mandatoItem, ships, eventos) {
    var mejor = null, i, s2, sobre;
    for (i = 0; i < ships.length; i++) {
      s2 = ships[i].ship;
      sobre = s2.esperado > 0 ? (s2.real / s2.esperado) : 1;
      if (!mejor || sobre > mejor.sobre) mejor = { s:s2, sobre:sobre };
    }
    if (mejor && mejor.sobre >= 1) {
      return 'Jugada del mes: <b>' + esc(mejor.s.n) + '</b> salió con impacto ' + mejor.s.real +
             ' — ' + (mejor.sobre >= 1.25 ? 'un ' + Math.round((mejor.sobre - 1) * 100) + '% por encima de lo que estimabas.'
                                          : 'justo lo que habías estimado.');
    }
    if (mandatoItem && mandatoItem.tipo === 'bueno') {
      return 'Jugada del mes: moviste tu mandato de <b>' + esc(mandatoItem.mandato.antes) + '</b> a <b>' +
             esc(mandatoItem.mandato.despues) + '</b> sin entregar nada — el equipo estacionado hizo el trabajo.';
    }
    for (i = 0; i < eventos.length; i++) {
      if (eventos[i].tipo === 'bueno') return 'Jugada del mes: ' + esc(primeraOracion(eventos[i].texto));
    }
    if (mejor) {
      return 'Jugada del mes: ninguna. <b>' + esc(mejor.s.n) + '</b> rindió ' + mejor.s.real +
             ' contra los ' + mejor.s.esperado + ' que esperabas — un mes que se paga en aprendizaje.';
    }
    return null;
  }

  /* el ultimo cierre mostrado, para poder repintarlo cuando se abre o cierra
     el bloque de teoria sin volver a simular nada */
  var ultimoResultado = null;
  function mostrarResultado(log, titulo, esDecision, libroTeoria, decisionTxt) {
    ultimoResultado = [log, titulo, esDecision, libroTeoria, decisionTxt];
    var h = '<div class="rot">' + titulo + '</div><h2>' +
            (esDecision ? 'Decidido' : 'Qué pasó') + '</h2><div class="cuerpo2 scroll">';
    if (!log.length) h += '<div class="pq mut">Un mes sin sorpresas. A veces es justo lo que necesitas.</div>';

    var mandatoItem = null, ships = [], notas = [], eventos = [], i;
    for (i = 0; i < log.length; i++) {
      var le = log[i];
      if (le.mandato) mandatoItem = le;
      else if (le.ship) ships.push(le);
      else if (le.tipo === 'nota') notas.push(le);
      else eventos.push(le);
    }

    if (mandatoItem) {
      var cls2 = mandatoItem.tipo === 'bueno' ? 'verde' : mandatoItem.tipo === 'malo' ? 'rojo' : 'mut';
      var pct = typeof mandatoItem.mandato.pct === 'number' ? Math.max(0, Math.min(100, mandatoItem.mandato.pct)) : null;
      h += '<div class="res-mandato"><span class="rot" style="margin-right:10px">Tu mandato</span>' +
        esc(mandatoItem.mandato.txt) +
        '<div style="margin-top:6px"><b class="num ' + cls2 + '">' + esc(mandatoItem.mandato.antes) + ' → ' + esc(mandatoItem.mandato.despues) + '</b>' +
        '<span class="mut num"> · meta ' + esc(mandatoItem.mandato.meta) + '</span></div>' +
        (pct !== null ? '<div class="mand-bar"><div class="mand-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="mut num" style="margin-top:3px;font-size:11px">' + pct + '% del camino a la meta</div>' : '') +
        '</div>';
    }

    /* Jugada del mes: un solo renglon con lo que de verdad movio la aguja —
       la entrega que mas rindio, y si no hubo entregas, el mejor evento. Sale
       antes de la lista para que el mes tenga titular, no solo inventario. */
    var jug = jugadaDelMes(mandatoItem, ships, eventos);
    if (jug) {
      h += '<div class="jugada">' + svgIc('trophy') + '<div class="jtx">' + jug + '</div></div>';
    }

    /* Lo entregado en grilla de dos columnas, como el diseno guardado: cuatro
       entregas ocupaban cuatro filas anchas y empujaban todo lo demas fuera de
       la pantalla. Cada tarjeta dice nombre, real contra esperado, y los
       chips — nada mas. */
    if (ships.length) {
      h += '<div class="rot" style="margin:14px 0 6px">Salió este mes</div><div class="shipgrid">';
      for (i = 0; i < ships.length; i++) {
        var s2 = ships[i].ship;
        var metaMet3 = ejeDe(J.mandatoId);
        var ciego = s2.real < s2.esperado * 0.55;
        h += '<div class="shipc' + (ships[i].tipo === 'bueno' ? ' ok' : ' mal') + '">' +
          '<div class="sn">' + (ships[i].tipo === 'bueno' ? '<span class="verde">▲</span>' : '<span class="rojo">▼</span>') +
            '<b>' + esc(s2.n) + '</b></div>' +
          '<div class="sm mut">real <b class="num">' + s2.real + '</b> · esperabas ' + s2.esperado +
            (ciego ? ' <span class="rojo">(a ciegas)</span>' : '') + '</div>' +
          '<div class="sc">' + chipsVec(s2.vec, ejesEnJuego()) + '</div></div>';
      }
      h += '</div>';
    }

    /* Los eventos y las fichas nuevas de la biblioteca eran dos secciones con
       dos titulos para el mismo tipo de renglon. Van juntas. */
    if (eventos.length || notas.length) {
      h += '<div class="rot" style="margin:14px 0 4px">' + (esDecision ? 'Lo que siguió' : 'También este mes') + '</div>';
      for (i = 0; i < eventos.length; i++) {
        var l = eventos[i];
        var ic = l.tipo === 'bueno' ? '<span class="verde">▲</span>' :
             l.tipo === 'malo' ? '<span class="rojo">▼</span>' : '<span class="mut">•</span>';
        h += '<div class="linea"><div class="ic">' + ic + '</div><div class="tx">' +
             esc(l.texto) + ' ' + (l.libro ? chip(l.libro) : '') + '</div></div>';
      }
      if (notas.length) {
        var chipsN = '';
        for (i = 0; i < notas.length; i++) if (notas[i].libro) chipsN += chip(notas[i].libro) + ' ';
        h += '<div class="linea"><div class="ic"><span class="azul">✎</span></div><div class="tx mut">' +
             notas.length + (notas.length === 1 ? ' tarjeta nueva' : ' tarjetas nuevas') + ' en la biblioteca ' + chipsN + '</div></div>';
      }
    }

    /* La teoria del mes ocupaba un bloque de cinco renglones al pie de cada
       cierre. Queda el titular — el libro y su autor — y el cuerpo se abre
       tocandolo. En una decision arranca abierto: ahi el porque ES el premio. */
    if (!esDecision && !libroTeoria && J) {
      var lm = libroDelDia(J, C);
      if (lm) libroTeoria = lm.id;
    }
    if (libroTeoria) {
      var lt = libroPorId(libroTeoria);
      var ap2 = J ? aplicarLibro(libroTeoria, J) : null;
      if (lt) {
        var abierto = esDecision || teoriaAbierta;
        h += '<div class="teoria-caso' + (abierto ? ' on' : '') + '" style="margin-top:12px">' +
          (decisionTxt ? '<div class="pq mut" style="margin-bottom:6px">Elegiste: “' + esc(decisionTxt) + '”</div>' : '') +
          '<div class="rot teoriat" data-act="teoria">La teoría · ' + esc(lt.titulo) + ' — ' + esc(lt.autor) +
            (esDecision ? '' : '<span class="verplus">' + (abierto ? 'ocultar' : 'leer') + '</span>') + '</div>' +
          (abierto ? '<div class="pq" style="line-height:1.5;margin-top:6px">' + esc(lt.idea) + '</div>' +
            (ap2 ? '<div class="pq caso-linea">' + esc(ap2) + '</div>' : '') : '') +
          '</div>';
      }
    }
    h += '</div><div style="margin-top:14px"><span class="btn pri" data-act="cerrar-result">' +
         (esDecision ? 'Seguir con el mes' : 'Mes siguiente') + '</span></div>';
    $('t-result').innerHTML = h;
    $('t-result').setAttribute('data-decision', esDecision ? '1' : '0');
    ov('ov-result', true);
  }

  /* ================= fin de un puesto ================= */

  function cerrarPuesto() {
    var e = J;
    var nivelAntes = C.nivel;
    var cierre = Carrera.cerrar(C, e, M);
    var nuevos = Logros.evaluarPuesto(R, C, e, cierre);
    J = null;

    var titulo = cierre.final === 'renuncia' ? 'Tomaste la llamada, y después la salida' :
                 cierre.final === 'imputado' ? 'Saliste esposado por la puerta de vidrio' :
                 cierre.final === 'quiebra' ? 'A la empresa se le acabó la caja' :
                 cierre.final === 'despido' ? 'Te pidieron la renuncia' :
                 cierre.final === 'venta' ? 'La empresa se vendió' :
                 'Fin de tu mandato en ' + cierre.empresa;
    var h = '<div class="rot">' + esc(cierre.rol) + ' · ' + cierre.meses + ' meses · ' + esc(cierre.sector) + '</div>' +
      '<div class="h1">' + esc(titulo) + '</div>';

    h += '<div class="notas">';
    h += '<div class="nota"><div class="nk">Mandato</div><div class="nv ' +
         (cierre.cumplido ? 'verde' : 'rojo') + '" style="font-size:26px;margin-top:8px">' +
         (cierre.cumplido ? 'Cumplido' : 'Te quedaste corto') + '</div>' +
         '<div class="pq mut">' + esc(cierre.valorMandato) + ' de ' + esc(cierre.metaMandato) + '</div></div>';
    h += '<div class="nota"><div class="nk">Reputación</div><div class="nv ' +
         (cierre.dRep >= 0 ? 'verde' : 'rojo') + '">' + (cierre.dRep >= 0 ? '+' : '') + cierre.dRep + '</div>' +
         '<div class="pq mut">ahora ' + Math.round(C.reputacion) + '</div></div>';
    h += '<div class="nota"><div class="nk">Movida</div><div class="nv" style="font-size:22px;margin-top:10px">' +
         (cierre.promocion ? '<span class="verde">Ascenso</span>' : cierre.imputado ? '<span class="rojo">Imputación</span>' : cierre.despido ? '<span class="rojo">Despido</span>' : 'Lateral') +
         '</div><div class="pq mut">' + esc(nivelPorN(C.nivel).rol) + '</div></div>';
    h += '<div class="nota" style="width:280px"><div class="nk">Tu bolsillo</div>' +
         '<div class="nv" style="font-size:26px;margin-top:6px">' + money(cierre.ahorrado + (cierre.cascada ? cierre.cascada.aFund : 0)) + '</div>' +
         '<div class="pq mut">Equity consolidado: ' + (Math.round(cierre.equityVestida * 100) / 100) + '% (en papel ' + money(cierre.valorPapel) + ')</div></div>';
    h += '</div>';
    if (cierre.promocion && C.nivel > nivelAntes) {
      var nuevasPalancas = ESCALAFON[C.nivel].palancas.filter(function (p) { return ESCALAFON[nivelAntes].palancas.indexOf(p) < 0; });
      h += '<div class="age-up"><div class="rot">⬆ Subiste de Edad</div>' +
        '<h3 style="margin:4px 0">' + esc(ESCALAFON[C.nivel].rol) + '</h3>' +
        '<div class="pq">' + esc(ESCALAFON[C.nivel].nota) + '</div>' +
        (nuevasPalancas.length ? '<div class="pq mut" style="margin-top:4px">Desbloqueaste: <b>' +
          esc(nuevasPalancas.map(function (p) { return NOMBRE_PALANCA[p] || p; }).join(', ')) + '</b></div>' : '') +
        '</div>';
    }

    h += '<div class="dosc" style="display:-webkit-flex;display:flex">';
    h += '<div class="colx" style="width:520px;padding-right:24px">';
    var i;
    for (i = 0; i < cierre.notas.length; i++) {
      h += '<div class="linea"><div class="ic mut">•</div><div class="tx">' + esc(cierre.notas[i][0]) + ' ' + chip(cierre.notas[i][1]) + '</div></div>';
    }
    if (cierre.cascada) {
      var cs = cierre.cascada;
      h += '<div class="rot" style="margin:12px 0 4px 0">Cascada de salida</div>' +
        '<div class="req"><span class="mut">Valor de salida</span> <b>' + money(cs.salida) + '</b></div>' +
        '<div class="req"><span class="mut">Preferencias de liquidación</span> <b>' + money(cs.pref) + '</b></div>' +
        '<div class="req"><span class="mut">Inversionistas</span> <b>' + money(cs.aInv) + '</b></div>' +
        '<div class="req"><span class="mut">Tú</span> <b class="verde">' + money(cs.aFund) + '</b></div>';
    }
    if (cierre.rivalTxt) {
      h += '<div class="linea" style="margin-top:8px"><div class="ic lila">◆</div><div class="tx lila">' +
           esc(cierre.rivalTxt) + '</div></div>';
    }
    h += '</div>';

    h += '<div class="colx" style="width:380px"><div class="rot" style="margin-bottom:6px">Lo que te llevas</div>';
    var HH = [['producto','Producto'],['tecnologia','Tecnología'],['negocio','Negocio'],['liderazgo','Liderazgo']];
    for (i = 0; i < HH.length; i++) {
      var k = HH[i][0], v = Math.round(C.hab[k]), d = cierre.dHab[k];
      h += '<div class="hab"><div class="hk">' + HH[i][1] +
           (d > 0 ? ' <span class="verde">+' + d + '</span>' : '') + '<b class="num">' + v + '</b></div>' +
           '<div class="track"><i class="l" style="width:' + v + '%"></i></div></div>';
    }
    h += '<div class="pq mut" style="margin-top:4px">Cada una acelera la capacidad gemela en tu próxima empresa — Producto, Tecnología, GTM y Org crecen más rápido donde tu propia habilidad es más alta.</div>';
    for (i = 0; i < nuevos.length; i++) {
      h += '<div class="logro"><div class="med">' + svgIc('trophy') + '</div><div><div class="ln">' + esc(nuevos[i].n) + '</div>' +
           '<div class="ld">' + esc(nuevos[i].d) + '</div></div></div>';
    }
    h += '</div></div>';

    h += '<div style="margin-top:16px"><span class="btn pri" data-act="ver-ofertas">' +
         (C.final ? 'Ver cómo termina tu carrera' : 'Ver qué hay sobre la mesa') + '</span></div>';
    $('p-cierre').innerHTML = h;
    guardar();
    ir('p-cierre');
    if (cierre.promocion && C.nivel > nivelAntes && Propuestas.debeMostrarse()) {
      Propuestas.marcarVista();
      Propuestas.listar(function (data) { mostrarPropuestas(data); });
    }
  }

  /* ================= fin de la carrera ================= */

  /* Radar de 5 ejes — producto / tecnologia / GTM / gente / capital: el
     perfil con el que cerraste la carrera. Los cuatro primeros son tus
     habilidades (C.hab); capital es el patrimonio en escala logaritmica,
     porque la diferencia entre $10k y $1M importa mas que entre $80M y $90M.
     SVG inline, sin dependencias. */
  function radarHtml(ejes, ancho) {
    var w = ancho || 240, hgt = 220, cx = w / 2, cy = 108, r = 78, N = ejes.length, i;
    function pt(k, f) {
      var a = -Math.PI / 2 + k * 2 * Math.PI / N;
      return [ (cx + Math.cos(a) * r * f), (cy + Math.sin(a) * r * f) ];
    }
    function poly(f) {
      var out = [], k, q;
      for (k = 0; k < N; k++) { q = pt(k, f); out.push(q[0].toFixed(1) + ',' + q[1].toFixed(1)); }
      return out.join(' ');
    }
    var h = '<svg class="radar" width="' + w + '" height="' + hgt + '" viewBox="0 0 ' + w + ' ' + hgt + '">';
    h += '<polygon class="rgrid" points="' + poly(1) + '"/>';
    h += '<polygon class="rgrid" points="' + poly(0.66) + '"/>';
    h += '<polygon class="rgrid" points="' + poly(0.33) + '"/>';
    for (i = 0; i < N; i++) {
      var ej = pt(i, 1);
      h += '<line class="reje" x1="' + cx + '" y1="' + cy + '" x2="' + ej[0].toFixed(1) + '" y2="' + ej[1].toFixed(1) + '"/>';
    }
    var pts = [];
    for (i = 0; i < N; i++) {
      var q2 = pt(i, Math.max(0.05, Math.min(1, ejes[i].v / 100)));
      pts.push(q2[0].toFixed(1) + ',' + q2[1].toFixed(1));
    }
    h += '<polygon class="rarea" points="' + pts.join(' ') + '"/>';
    for (i = 0; i < N; i++) {
      var lp = pt(i, 1.2), dx = lp[0] - cx;
      var anc = Math.abs(dx) < 6 ? 'middle' : dx > 0 ? 'start' : 'end';
      h += '<text class="rlbl" x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 3).toFixed(1) +
           '" text-anchor="' + anc + '">' + esc(ejes[i].k) + '</text>';
      h += '<text class="rval" x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 15).toFixed(1) +
           '" text-anchor="' + anc + '">' + Math.round(ejes[i].v) + '</text>';
    }
    return h + '</svg>';
  }

  /* el eje de capital: $10k = 0, $1M = 50, $100M = 100 */
  function ejeCapital(pat) {
    if (!pat || pat <= 10000) return 0;
    return Math.max(0, Math.min(100, Math.round(Math.log(pat / 10000) / Math.log(10) / 4 * 100)));
  }

  function mostrarFinal() {
    var b = Carrera.boletin(C);
    var nuevos = Logros.evaluarCarrera(R, C, b, M);
    var rv = M.rival, i;
    var ganaste = C.nivel >= rv.nivel;

    var h = '<div class="rot">' + b.anios + ' años · ' + b.puestos + ' puestos · ' +
            b.cumplidos + ' mandatos cumplidos · ' + b.despidos + ' despidos</div>' +
      '<div class="h1">Tu carrera terminó como ' + esc(b.nivel.rol) + '</div>';

    h += '<div class="notas">';
    h += '<div class="nota"><div class="nk">Patrimonio</div><div class="nv" style="font-size:30px;margin-top:6px">' +
         money(b.patrimonio) + '</div><div class="pq mut">sueldos ' + money(b.ahorros) + ' + equity ' + money(b.equityRealizado) + '</div></div>';
    h += '<div class="nota"><div class="nk">Reputación</div><div class="nv">' + b.reputacion + '</div></div>';
    h += '<div class="nota" style="width:300px"><div class="nk">Tu rival: ' + esc(rv.nombre) +
         (rv.fantasma ? ' <span class="pill frio">jugador real</span>' : '') + '</div>' +
         '<div class="nv" style="font-size:22px;margin-top:8px" class="num">' +
         (ganaste ? '<span class="verde">Quedaste arriba</span>' : '<span class="rojo">Te ganó</span>') + '</div>' +
         '<div class="pq mut">' + esc(rv.nombre) + ' terminó como ' + esc(nivelPorN(rv.nivel).rol) +
         (rv.fundo ? ' y fundó su propia empresa' : '') + '</div>' +
         (rv.fantasma ? '<div class="pq lila" style="margin-top:4px">Una carrera real del Salón de la Fama: llegó a ' +
           esc(nivelPorN(rv.nivelReal !== undefined ? rv.nivelReal : rv.nivel).rol) + ' con ' + money(rv.patReal || 0) + '.</div>' : '') +
         '</div>';
    h += '</div>';

    h += '<div class="dosc" style="display:-webkit-flex;display:flex">';
    h += '<div class="colx" style="width:460px;padding-right:26px">';
    h += '<div class="rot" style="margin-bottom:6px">Perfil final</div>';
    h += radarHtml([
      { k:'Producto',   v:C.hab.producto },
      { k:'Tecnología', v:C.hab.tecnologia },
      { k:'GTM',        v:C.hab.negocio },
      { k:'Gente',      v:C.hab.liderazgo },
      { k:'Capital',    v:ejeCapital(b.patrimonio) }
    ], 300);
    h += '<div class="pq mut" style="margin-bottom:14px">Las cuatro habilidades son las que te llevaste de cada ' +
         'puesto; capital es tu patrimonio en escala logarítmica — $1M es la mitad del eje, $100M lo llena.</div>';
    h += '<div class="rot" style="margin-bottom:5px">El equity, al final</div>';
    if (!b.detalleEquity.length) h += '<div class="pq mut">No consolidaste equity en ninguna parte.</div>';
    for (i = 0; i < b.detalleEquity.length; i++) {
      var q = b.detalleEquity[i];
      h += '<div class="req"><span class="mut">' + esc(q.empresa) + ' (' + (Math.round(q.pct*100)/100) + '%)</span> <b class="num ' +
           (q.valor > 0 ? 'verde' : 'mut') + '">' + (q.valor > 0 ? money(q.valor) : 'no vale nada') + '</b></div>';
    }
    h += '<div class="pq mut" style="margin-top:8px">La mayoría del equity muere en cero. El equity que paga cubre todo lo demás. ' +
         'Por eso importa la salud de la empresa cuando te vas — y los términos que firmó antes de que llegaras.</div>';
    h += '</div>';

    h += '<div class="colx" style="width:420px"><div class="rot" style="margin-bottom:5px">Puesto por puesto</div>';
    for (i = 0; i < C.puestos.length; i++) {
      var p = C.puestos[i];
      h += '<div class="req">' + (p.cumplido ? '<span class="verde">✓</span>' : p.despido ? '<span class="rojo">✕</span>' : '<span class="mut">○</span>') +
           ' <b>' + esc(p.rol) + '</b> <span class="mut">en ' + esc(p.empresa) + ' — ' + esc(p.mandato) + '</span></div>';
    }
    /* Vitrina en vez de lista: todos los logros desbloqueados, y los que se
       abrieron justo ahora marcados — antes los nuevos se repetian abajo. */
    var desbl = [], dk, esNuevo = {};
    for (dk = 0; dk < nuevos.length; dk++) esNuevo[nuevos[dk].id] = true;
    for (dk = 0; dk < Logros.DEFS.length; dk++) if (R.logros[Logros.DEFS[dk].id]) desbl.push(Logros.DEFS[dk]);
    if (desbl.length) {
      h += '<div class="rot" style="margin:16px 0 8px 0">Logros desbloqueados · ' + desbl.length +
           ' de ' + Logros.DEFS.length + '</div><div class="logrosgrid">';
      for (dk = 0; dk < desbl.length; dk++) {
        h += '<div class="logrotile' + (esNuevo[desbl[dk].id] ? ' nuevo' : '') + '">' + svgIc('trophy') +
             '<div class="ltn">' + esc(desbl[dk].n) + '</div>' +
             (esNuevo[desbl[dk].id] ? '<div class="ltnuevo">recién</div>' : '') + '</div>';
      }
      h += '</div>';
    }
    h += '<div class="pq mut" style="margin-top:8px">Abriste ' + Object.keys(C.codex).length + ' de ' + LIBROS.length + ' tarjetas.</div>';
    h += '</div></div>';

    h += '<div id="rk-final" class="pq mut" style="margin-top:14px">Enviando tu carrera al Salón de la Fama público…</div>';
    h += '<div style="margin-top:12px"><span class="btn pri" data-act="reiniciar">Otra carrera</span> ' +
         '<span class="btn" data-act="ranking">Salón de la Fama</span> ' +
         '<span class="btn" data-act="biblio">Biblioteca</span></div>';
    $('p-final').innerHTML = h;
    try { localStorage.removeItem(CLAVE); } catch (e2) {}
    ir('p-final');
    enviarRanking(b);
  }

  function mostrarIntro() {
    $('t-intro').innerHTML = '<div class="rot">Cómo se juega</div>' +
      '<h2>Cuatro cosas. Nada más.</h2>' +
      '<div class="cuerpo2" style="margin-top:6px">' +
      '<div class="linea"><div class="ic azul">1</div><div class="tx"><b>Elige un puesto.</b> Te contratan para UNA cosa: el mandato. La barra de arriba es tu trabajo. Cúmplelo y subes.</div></div>' +
      '<div class="linea"><div class="ic azul">2</div><div class="tx"><b>Cada mes, estaciona los puntos de tu equipo.</b> Lo que no estaciones va a Construir y empuja tus proyectos — que caben en slots limitados, y cada uno entregado le da a la empresa una capacidad nueva.</div></div>' +
      '<div class="linea"><div class="ic azul">3</div><div class="tx"><b>Prioriza por probabilidad × impacto ÷ esfuerzo.</b> Los puntos y bloques son estimaciones: mientras más hables con usuarios, menos te mienten.</div></div>' +
      '<div class="linea"><div class="ic azul">4</div><div class="tx"><b>Todo lo demás lo aprendes perdiendo.</b> Cuando el juego te cobra algo, te dice qué libro lo tenía escrito.</div></div>' +
      '</div>' +
      '<div style="margin-top:18px"><span class="btn pri" data-act="cerrar-intro">Ver las ofertas</span></div>';
    ov('ov-intro', true);
  }

  /* ================= biblioteca ================= */

  function mostrarPropuestas(data) {
    if (!data || !data.ok) return;
    var i, h = '<div class="rot">🗳️ Construí Founder Mode</div>' +
      '<h2>Proponé y votá la próxima mejora</h2>' +
      '<div class="pq mut" style="margin-bottom:10px">La más votada de la semana la implementa un agente y abre un PR — si Lucas lo aprueba, sale para todos.</div>';

    var ultima = data.historial && data.historial.length ? data.historial[data.historial.length - 1] : null;
    if (ultima && ultima.prUrl) {
      h += '<div class="pq mut" style="margin-bottom:10px">La semana pasada ganó: "' + esc(ultima.texto) +
           '" (' + ultima.votos + ' votos) — <a href="' + esc(ultima.prUrl) + '" target="_blank" rel="noopener">ver PR</a></div>';
    }

    var yaPropuso = false;
    h += '<div class="cuerpo2 scroll" style="max-height:280px">';
    if (!data.propuestas.length) {
      h += '<div class="pq mut">Nadie propuso nada todavía esta semana. Sé el primero.</div>';
    }
    for (i = 0; i < data.propuestas.length; i++) {
      var p = data.propuestas[i];
      if (p.esTuya) yaPropuso = true;
      h += '<div class="linea"><div class="tx">' + esc(p.texto) +
           (p.esTuya ? ' <span class="pq mut">(la tuya)</span>' : '') + '</div>' +
           '<span class="btn' + (p.votaste ? ' pri' : '') + '" data-act="votar-propuesta" data-id="' + esc(p.id) + '">' +
           (p.votaste ? '✓ ' : '') + p.votos + ' voto' + (p.votos === 1 ? '' : 's') + '</span></div>';
    }
    h += '</div>';

    if (!yaPropuso) {
      h += '<div style="margin-top:12px"><textarea id="prop-texto" maxlength="280" placeholder="Tu propuesta para el juego (10-280 caracteres)" style="width:100%;min-height:64px"></textarea>' +
           '<div style="margin-top:6px"><span class="btn pri" data-act="proponer">Proponer</span></div></div>';
    }
    h += '<div style="margin-top:12px"><span class="btn" data-act="cerrar-propuestas">Cerrar</span></div>';
    $('t-propuestas').innerHTML = h;
    ov('ov-propuestas', true);
  }

  function mostrarBiblio() {
    var codex = C ? C.codex : {};
    var abiertos = 0, i, j;
    for (i = 0; i < LIBROS.length; i++) if (codex[LIBROS[i].id]) abiertos++;
    var h = '<div class="rot">Biblioteca</div><h2>' + abiertos + ' de ' + LIBROS.length + ' tarjetas</h2>' +
      '<div class="pq mut" style="margin-bottom:8px">Cada tarjeta se abre cuando el concepto te golpea en tu carrera. Toca una abierta para leerla.</div>' +
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
          '<div class="lc ' + pil.cls + '">' + esc(ab ? l.concepto : 'sin abrir') + '</div></div>';
      }
      h += '<div class="rot ' + pil.cls + '" style="margin:10px 0 6px 0">' + esc(pil.nombre) +
           ' · ' + n + '/' + tot + '</div><div class="libs">' + cuerpo + '</div>';
    }
    h += '</div><div style="margin-top:12px"><span class="btn" data-act="cerrar-biblio">Cerrar</span></div>';
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
      '<div class="rot" style="margin:16px 0 5px 0">Cómo lo modela el juego</div>' +
      '<div class="pq" style="font-size:14px;line-height:1.55">' + esc(l.juego) + '</div>' +
      (function () {
        var ap = J ? aplicarLibro(l.id, J) : null;
        if (!ap) return '';
        return '<div class="teoria-caso"><div class="rot" style="margin-bottom:4px">En tu partida, hoy</div>' +
               '<div class="pq" style="font-size:14px;line-height:1.55">' + esc(ap) + '</div></div>';
      })() + '</div>' +
      '<div style="margin-top:14px"><span class="btn" data-act="cerrar-libro">Volver</span></div>';
    ov('ov-libro', true);
  }

  /* ================= ranking público ================= */

  /* Empezar una carrera, normal o semanal. La semanal siembra el mundo con la
     semana ISO, así todos en internet enfrentan la misma secuencia de eras; la
     partida queda etiquetada con la semana y cae en la tabla pública de esa semana. */
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

  /* El rival fantasma: la carrera de un jugador real del ranking reemplaza al
     NPC. Sube con los dados de siempre pero se detiene en el nivel que de
     verdad alcanzó. Llega async; si nunca llega, se queda el NPC. */
  function pedirRivalReal() {
    var id = C.rkId;
    Ranking.rival(C.nivel, function (g) {
      if (!g || !g.ok || !g.nombre || !C || C.rkId !== id || !M) return;
      M.rival = {
        /* el rival siempre es Lucas M; la carrera real lo posee */
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
      nombre:C.nombre && C.nombre !== 'you' && C.nombre !== 'tú' ? C.nombre : 'Anónimo',
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
        el.innerHTML = 'El Salón de la Fama público está fuera de alcance ahora mismo — tu carrera igual cuenta en casa.';
        return;
      }
      var t = 'Salón de la Fama público: eres <b class="verde">#' + r.pos + '</b> de ' + r.total + ' jugadores por patrimonio.';
      if (r.posSemanal) t += ' Esta semana: <b class="verde">#' + r.posSemanal + '</b> de ' + r.totalSemanal + '.';
      if (r.posHistorica) t += ' Tabla histórica: <b class="lila">#' + r.posHistorica + '</b> con ' + r.puntosHistoricos + ' puntos de campeonato.';
      if (r.destronaste) {
        t += ' <span class="lila">Destronaste a ' + esc(r.destronaste) + ' del #1.</span>';
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
    if (!arr || !arr.length) return '<div class="pq mut">Nadie todavía. Sé el primero.</div>';
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

  /* Las cuatro tablas historicas viven en pestanas, no apiladas: una tabla
     a la vez se lee de arriba abajo; cuatro columnas solo se hojean. La
     semanal y la guerra de facciones se quedan siempre a la vista — son el
     estado del mundo, no una tabla mas. */
  var RK_TABS = [
    { id:'patrimonio', lbl:'Patrimonio', tit:'Ranking mundial · patrimonio',
      val:function (e) { return money(e.patrimonio); } },
    { id:'nivel', lbl:'Rol más alto', tit:'Rol más alto alcanzado',
      val:function (e) { return esc(nivelPorN(e.nivel).corto); } },
    { id:'racha', lbl:'Racha', tit:'Racha de mandatos cumplidos',
      val:function (e) { return e.racha + ' seguidos'; } },
    { id:'logros', lbl:'Logros', tit:'Logros desbloqueados',
      val:function (e) { return e.logros + ' de ' + Logros.DEFS.length; } }
  ];
  function rkTabDef(id) {
    for (var i = 0; i < RK_TABS.length; i++) if (RK_TABS[i].id === id) return RK_TABS[i];
    return RK_TABS[0];
  }

  function renderRanking(d, cargando) {
    if (!cargando) rkDatos = d;
    var h = '<div class="rot">Salón de la Fama</div>' +
            '<div class="h1" style="margin-top:2px">Ranking público</div>';
    if (cargando) {
      h += '<div class="pq mut" style="margin-top:14px">Buscando el Salón de la Fama…</div>';
    } else if (!d || !d.ok) {
      h += '<div class="pq mut" style="margin-top:14px">El Salón de la Fama está fuera de alcance ahora mismo. Vive en internet — intenta de nuevo en un rato.</div>';
    } else {
      h += '<div class="pq mut" style="margin-top:4px">Desafío semanal ' + esc(d.semana) +
           ' — todos enfrentan la misma secuencia de eras. ' +
           d.jugadores + ' jugadores · ' + d.carreras + ' carreras terminadas' +
           (d.tu && d.tu.pos ? ' · eres <b class="verde">#' + d.tu.pos + '</b> por patrimonio' : '') + '</div>';
      if (d.bounty) {
        h += '<div class="caja2" style="margin-top:12px;max-width:660px"><span class="rot">Recompensa</span> · vence a <b>' +
             esc(d.bounty.nombre) + '</b> (' + money(d.bounty.patrimonio) +
             ') y el logro <b>Regicidio</b> es tuyo.</div>';
      }
      var td = rkTabDef(rkTab), i;
      h += '<div class="rktabs">';
      for (i = 0; i < RK_TABS.length; i++) {
        h += '<div class="rktab' + (RK_TABS[i].id === rkTab ? ' on' : '') + '" data-rktab="' +
             RK_TABS[i].id + '">' + esc(RK_TABS[i].lbl) + '</div>';
      }
      h += '</div>';

      h += '<div class="rkcols dosc scroll" style="-webkit-flex:1;flex:1;min-height:0">';
      h += '<div class="colx" style="width:440px;padding-right:28px">';
      h += '<div class="rot" style="margin-bottom:8px">' + esc(td.tit) + '</div>';
      h += filasRk(d.tablas[td.id], td.val);
      h += '</div>';

      h += '<div class="colx" style="width:330px">';
      h += '<div class="rot" style="margin-bottom:8px">Esta semana · ' + esc(d.semana) + '</div>';
      h += filasRk(d.tablas.semanal, function (e) { return money(e.patrimonio); });
      if (d.semanaPasada) {
        h += '<div class="pq mut" style="margin-top:8px">' + svgIc('trophy', 'acento') +
             ' Ganador de la semana pasada: <b>' + esc(d.semanaPasada.nombre) +
             '</b> con ' + money(d.semanaPasada.patrimonio) + '.</div>';
      }
      var g2 = d.facciones.growth, c2 = d.facciones.craft;
      var totalC = g2.cumplidos + c2.cumplidos;
      var pg = totalC ? Math.round(g2.cumplidos / totalC * 100) : 50;
      h += '<div class="rot" style="margin:18px 0 6px 0">Guerra de facciones · mandatos cumplidos</div>';
      h += '<div class="facbar"><i style="width:' + pg + '%;background:var(--color-accent)"></i>' +
           '<i style="width:' + (100 - pg) + '%;background:var(--color-accent-800)"></i></div>';
      h += '<div class="pq mut" style="margin-top:4px">Legión del Crecimiento ' + pg + '% · ' +
           'Gremio del Oficio ' + (100 - pg) + '%</div>';
      h += '</div></div>';
    }
    h += '<div style="margin-top:14px"><span class="btn" data-act="cerrar-ranking">Volver</span></div>';
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
    renderPerfil();
  }, false);

  document.addEventListener('click', function (ev) {
    var t = ev.target, v;

    v = attr(t, 'data-modo');
    if (v !== null && !J) {
      var inpN3 = $('nombre-in'); if (inpN3 && inpN3.value) { inicioSel.nombre = inpN3.value; inicioSel.nombreManual = true; }
      var inpU3 = $('perfil-in'); if (inpU3) inicioSel.texto = inpU3.value;
      inicioSel.modo = v;
      renderPerfil();
      return;
    }

    v = attr(t, 'data-bg');
    if (v !== null && !J) {
      inicioSel.bg = v; inicioSel.bgManual = true;
      var inpN0 = $('nombre-in'); if (inpN0 && inpN0.value) { inicioSel.nombre = inpN0.value; inicioSel.nombreManual = true; }
      var inpU0 = $('perfil-in'); if (inpU0) inicioSel.texto = inpU0.value;
      renderPerfil();
      return;
    }

    v = attr(t, 'data-rol');
    if (v !== null) {
      inicioSel.nivel = parseInt(v, 10);
      inicioSel.rol = nivelPorN(inicioSel.nivel).rol;
      var inp = $('perfil-in');
      if (inp) inicioSel.texto = inp.value;
      var inpN1 = $('nombre-in'); if (inpN1 && inpN1.value) { inicioSel.nombre = inpN1.value; inicioSel.nombreManual = true; }
      /* la escalera vive en la portada y los chips en el perfil: repinta la
         pantalla que esta a la vista, no siempre el perfil */
      var pi = $('p-inicio');
      if (pi && pi.className.indexOf('on') >= 0) renderInicio(); else renderPerfil();
      return;
    }

    v = attr(t, 'data-fac');
    if (v !== null) {
      Ranking.setFaccion(Ranking.faccion() === v ? null : v);
      renderInicio();
      return;
    }

    v = attr(t, 'data-tab');
    if (v) { tabJuego = v; renderTabs(); if (tourActivo()) tourRender(); return; }

    v = attr(t, 'data-rktab');
    if (v) { rkTab = v; renderRanking(rkDatos, !rkDatos); return; }

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
      if (sinUsar() > 0) { plan[v]++; replanificar(); tourEvento('estacion'); }
      return;
    }
    v = attr(t, 'data-menos');
    if (v && J) {
      if (plan[v] > 0) { plan[v]--; replanificar(); }
      return;
    }
    v = attr(t, 'data-pmas');
    if (v && J) {
      var falta1 = Math.ceil(Motor.costoDe(J, v) - (J.enVuelo[v] || 0)) - (plan.asig[v] || 0);
      if (sinUsar() > 0 && falta1 > 0) { plan.asig[v] = (plan.asig[v] || 0) + 1; replanificar(); }
      return;
    }
    v = attr(t, 'data-pmenos');
    if (v && J) {
      if ((plan.asig[v] || 0) > 0) { plan.asig[v]--; replanificar(); }
      return;
    }
    v = attr(t, 'data-quitar');
    if (v && J) {
      var qi = plan.orden.indexOf(v);
      if (qi >= 0) { plan.orden.splice(qi, 1); delete plan.asig[v]; }
      replanificar();
      return;
    }

    v = attr(t, 'data-detalle');
    if (v !== null && J) {
      detalleAbierto[v] = !detalleAbierto[v];
      renderBacklog();
      return;
    }

    v = attr(t, 'data-sec');
    if (v !== null && J) {
      secAbierta[v] = !secAbierta[v];
      renderPanel();
      return;
    }

    v = attr(t, 'data-ap');
    if (v && J) {
      if (slotsUsados() < J.slots && plan.orden.indexOf(v) < 0 && sinUsar() > 0) {
        plan.orden.push(v);
        plan.asig[v] = Math.min(sinUsar(), Math.ceil(Motor.costoDe(J, v)));
        tourEvento('proyecto');
      }
      replanificar();
      return;
    }

    v = attr(t, 'data-act');
    if (!v) return;

    if (v === 'filtro-eje') { soloMandato = !soloMandato; renderBacklog(); return; }
    if (v === 'teoria') {
      teoriaAbierta = !teoriaAbierta;
      if (ultimoResultado) mostrarResultado.apply(null, ultimoResultado);
      return;
    }
    if (v === 'ir-perfil') { renderPerfil(); ir('p-perfil'); }
    else if (v === 'nueva') { empezarCarrera(false); }
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
      bld.innerHTML = '<div class="bld-in"><div class="bld-t">Construyendo<span class="bdots"><i>.</i><i>.</i><i>.</i></span></div>' +
        '<div class="bld-s">El mes corre: el código sale, los usuarios deciden, el mercado responde.</div></div>';
      setTimeout(function () { bld.className = ''; ejecutar(); }, 1100);
    }
    else if (v === 'ronda') { if (J) { J.levantando = true; evActual = eventoAplicable(J, C); if (evActual) mostrarEvento(evActual); } }
    else if (v === 'cerrar-result') {
      var esDec = $('t-result').getAttribute('data-decision') === '1';
      ov('ov-result', false);
      if (esDec) renderJuego(); else nuevoMes();
    }
    else if (v === 'reiniciar') { C = null; M = null; J = null; R = Logros.cargar(); renderInicio(); ir('p-inicio'); }
    else if (v === 'votar-propuesta') {
      var idProp = attr(t, 'data-id');
      Propuestas.votar(idProp, function () { Propuestas.listar(function (data) { mostrarPropuestas(data); }); });
    }
    else if (v === 'proponer') {
      var txProp = $('prop-texto') ? $('prop-texto').value : '';
      Propuestas.proponer(txProp, function () { Propuestas.listar(function (data) { mostrarPropuestas(data); }); });
    }
    else if (v === 'cerrar-propuestas') { ov('ov-propuestas', false); }
  }, false);

  /* escala el escenario de 1024x768 al viewport, centrado. El iPad 3 cae en 1.
     En móvil no hay escenario fijo que escalar: el CSS lo estira al viewport. */
  function escalar() {
    var st = document.getElementById('stage');
    if (!st) return;
    var w = window.innerWidth || 1024, h2 = window.innerHeight || 768;
    var mov = modoMovil(w, h2), cambio = (mov !== esMovil);
    esMovil = mov;
    /* teléfono de lado: la pantalla de juego pide vertical (ver estilos.css) */
    var paisaje = mov && w > h2 && h2 < 500;
    document.body.className = mov ? (paisaje ? 'movil paisaje' : 'movil') : '';

    if (mov) {
      escalaActual = 1;
      st.style.webkitTransform = 'none';
      st.style.transform = 'none';
      st.className = '';
    } else {
      var s = Math.min(w / 1024, h2 / 768);
      if (s > 0.98 && s < 1.02) s = 1;
      escalaActual = s;
      var t = 'translate(-50%,-50%) scale(' + s + ')';
      st.style.webkitTransform = t;
      st.style.transform = t;
      st.className = s === 1 ? '' : 'suelto';
    }
    if (cambio) repintar();
    if (tourActivo()) tourRender();
  }
  window.onresize = escalar;
  window.onorientationchange = function () { setTimeout(escalar, 120); };
  escalar();

  renderInicio();
})();
