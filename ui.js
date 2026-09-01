/* Interfaz del modo carrera. ES5 estricto para Safari 9.
   Un solo manejador de clicks delegado. Motor/Carrera/Mundo no tocan el DOM. */
(function () {
  'use strict';

  var CLAVE = 'fundadores.carrera.v2';
  var C = null;        /* carrera */
  var M = null;        /* mundo */
  var J = null;        /* puesto en curso */
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

  /* ================= INICIO ================= */

  function renderInicio() {
    var hay = false;
    try { hay = !!localStorage.getItem(CLAVE); } catch (e) {}
    var h = '<div class="h1">Fundadores</div>' +
      '<div class="pq mut" style="margin-top:8px;max-width:680px">Una carrera en producto: de analista a la silla ' +
      'grande, empresa por empresa, en un mundo que cambia de era sin avisarte. El juego no explica los errores ' +
      'antes: te los cobra, y después te dice en qué libro estaba escrito.</div>';

    h += '<div style="display:-webkit-flex;display:flex;margin-top:24px">';
    h += '<div style="width:560px;padding-right:30px">';
    h += '<div class="rot" style="margin-bottom:8px">Sala de récords</div>';
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
      h += '<div class="pq mut">Nadie jugó todavía. Los récords se guardan acá.</div>';
    }
    h += '<div style="margin-top:22px">' +
      '<span class="btn pri" data-act="nueva">Nueva carrera</span> ' +
      (hay ? '<span class="btn" data-act="continuar">Continuar</span> ' : '') +
      '<span class="btn sec" data-act="biblio">Biblioteca</span></div>';
    h += '</div>';

    h += '<div style="width:360px"><div class="rot" style="margin-bottom:8px">Logros</div>';
    var k, n = 0;
    for (k = 0; k < Logros.DEFS.length; k++) {
      var d = Logros.DEFS[k], ok = !!R.logros[d.id];
      if (ok) n++;
      h += '<div class="req ' + (ok ? 'verde' : 'mut') + '" style="' + (ok ? '' : 'opacity:0.45') + '">' +
           (ok ? '★ ' : '☆ ') + esc(d.n) + ' <span class="mut" style="font-size:11px">— ' + esc(d.d) + '</span></div>';
    }
    h += '<div class="pq mut" style="margin-top:6px">' + n + ' de ' + Logros.DEFS.length + '</div></div>';
    h += '</div>';
    $('p-inicio').innerHTML = h;
  }

  /* ================= OFERTAS ================= */

  function renderOfertas(cierreExtra) {
    var era = Mundo.era(M), ofs = C.ofertas, i;
    var h = '<div class="rot">Mes ' + M.mes + ' de tu carrera · ' + esc(nivelPorN(C.nivel).rol) +
            ' · reputación ' + Math.round(C.reputacion) + '</div>' +
            '<div class="h1" style="margin-top:2px">Sobre la mesa</div>';

    h += '<div class="era-banner"><span class="nombre-era">' + esc(era.nombre) + '</span>' +
         '<div class="pq mut">' + esc(era.desc) + '</div>' +
         (M.noticias.length ? '<div class="pq" style="margin-top:5px;color:#767f8d">◈ ' + esc(M.noticias[0].txt) + '</div>' : '') +
         '</div>';

    h += '<div class="tarjetas">';
    for (i = 0; i < ofs.length; i++) {
      var o = ofs[i];
      var calor = o.calor > 0 ? '<span class="pill hot">sector caliente</span>' :
                  o.calor < 0 ? '<span class="pill frio">sector frío</span>' : '';
      h += '<div class="oferta' + (ofertaSel === i ? ' sel' : '') + '" data-oferta="' + i + '">' +
        '<div class="cab ' + (o.fundar ? 'lila' : 'azul') + '">' + esc(o.sectorCorto) + ' · ' + esc(o.etapaNombre) + calor + '</div>' +
        '<h3>' + esc(o.nombre) + '</h3>' +
        '<div class="rolof">' + esc(o.rol) + ' · mando ' + Math.round(o.mando * 100) + '%</div>' +
        '<div class="desc">' + esc(o.pitch) + '<br><br><i>' + esc(o.eje) + '</i></div>' +
        '<div class="mandato"><div class="rot">Tu mandato · ' + o.meses + ' meses</div>' + esc(o.mandatoTxt) + '</div>' +
        '<div class="fila">Sueldo <b>' + money(o.sueldo) + '/año</b> · Equity <b>' +
          (o.fundar ? 'la tuya' : o.equity + '%') + '</b></div>' +
        '<div class="fila">Riesgo <b>' + esc(o.riesgoTxt) + '</b> \u00b7 Techo <b>' + o.techo + ' pts</b></div>' +
        '<div class="fila">Apuestas: <b>' + (o.perfil === 'grandes' ? 'pocas y grandes' : o.perfil === 'chicas' ? 'muchas y chicas' : o.perfil === 'incierto' ? 'dif\u00edciles de estimar' : 'cartera pareja') + '</b></div>' +
        '</div>';
    }
    h += '</div>';

    h += '<div style="margin-top:18px">' +
      '<span class="btn pri' + (ofertaSel >= 0 ? '' : ' off') + '" data-act="aceptar">Aceptar el puesto</span> ' +
      '<span class="btn sec" data-act="biblio">Biblioteca ' + Object.keys(C.codex).length + '/' + LIBROS.length + '</span></div>';
    $('p-ofertas').innerHTML = h;
    ir('p-ofertas');
  }

  /* ================= BRIEFING (dia uno) ================= */

  function faseClase(fc) {
    return fc === 'PRE-PMF' ? 'ambar' : fc === 'VALIDANDO PMF' ? 'azul' : 'verde';
  }

  function mostrarBrief() {
    var era = Mundo.era(M);
    var calorTxt = J.calor > 0 ? '<span class="hot2">caliente</span>' :
                   J.calor < 0 ? '<span class="frio2">frío</span>' : 'estable';
    var m2 = mandatoPorId(J.mandatoId);
    var h = '<div class="rot">' + esc(J.sector) + ' · ' + esc(ETAPAS[J.etapa].nombre) + ' · tu día uno como ' + esc(J.rol) + '</div>' +
      '<div class="h1">' + esc(J.empresa) + '</div>';

    h += '<div class="fasebox"><span class="fasechip ' + faseClase(J.faseCorta) + '">' + esc(J.faseCorta) + '</span>' +
         '<div class="faseobj">' + esc(J.objetivo) + '</div></div>';

    h += '<div class="notas" style="margin-top:14px">';
    h += '<div class="nota" style="width:170px"><div class="nk">Usuarios</div><div class="nv" style="font-size:30px">' + mil(Motor.usuarios(J)) + '</div></div>';
    h += '<div class="nota" style="width:170px"><div class="nk">Equipo</div><div class="nv" style="font-size:30px">' + (J.ing + J.prod + J.gtm) + '</div></div>';
    h += '<div class="nota" style="width:170px"><div class="nk">Sector</div><div class="nv" style="font-size:22px;margin-top:8px">' + calorTxt + '</div><div class="pq mut" style="font-size:10.5px">' + esc(era.nombre) + '</div></div>';
    h += '<div class="nota" style="width:280px"><div class="nk">Tu mandato · ' + J.meses + ' meses</div><div class="nv" style="font-size:17px;margin-top:8px;line-height:1.3">' + esc(m2.txt) + '</div></div>';
    h += '</div>';

    var i, k, nec;
    h += '<div style="display:-webkit-flex;display:flex;margin-top:8px">';
    h += '<div style="width:470px;padding-right:26px">';
    h += '<div class="rot" style="margin-bottom:6px">En esta etapa rinde más</div><div>';
    for (i = 0; i < J.prima.length; i++) {
      nec = null;
      for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === J.prima[i]) nec = NECESIDADES[k];
      if (nec) h += '<span class="tagobj up">▲ ' + esc(nec.nombre) + '</span>';
    }
    h += '</div>';
    if (J.castiga.length) {
      h += '<div class="rot" style="margin:10px 0 6px 0">Todavía pesa poco</div><div>';
      for (i = 0; i < J.castiga.length; i++) {
        nec = null;
        for (k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === J.castiga[i]) nec = NECESIDADES[k];
        if (nec) h += '<span class="tagobj down">▽ ' + esc(nec.nombre) + '</span>';
      }
      h += '</div>';
    }
    h += '<div class="pq mut" style="margin-top:8px">Las apuestas marcadas con ▲ empujan este objetivo: su impacto real rinde ×1,3. Las ▽ rinden la mitad.</div>';

    /* la teoría detrás de la etapa, y el veredicto sobre ESTA empresa */
    var teo = '', caso = '';
    if (J.faseCorta === 'PRE-PMF') {
      teo = 'Steve Blank: antes del fit, una startup no es una empresa chica — es una búsqueda. El estudio de ' +
        'Startup Genome midió la causa de muerte número uno: escalar antes de tiempo (contratar, crecer, endurecer ' +
        'procesos antes de validar que el problema arde). Por eso acá el juego premia Núcleo y Flujo y castiga Escala.';
      var fx = Math.round(Motor.fitMax(J) * 100);
      caso = esc(J.empresa) + ' hoy: ' + mil(Motor.usuarios(J)) + ' usuarios, evidencia ' + Math.round(J.evidencia) +
        ', mejor fit ' + fx + '%. ' + (fx < 50 ? 'Traducción: todavía no sabés si esto lo quiere alguien. Descubrí antes de construir.' :
        'El fit asoma: validalo con retención antes de pisar el acelerador.');
    } else if (J.faseCorta === 'VALIDANDO PMF') {
      teo = 'Andy Rachleff (acuñó el término): el product-market fit no se declara, se nota — la curva de retención ' +
        'se aplana en vez de caer a cero, y el crecimiento empieza a llegar solo, sin comprarlo. La curva plana es LA ' +
        'prueba; los totales acumulados son teatro. Por eso acá priman Flujo (activar mejor) y Datos (ver las cohortes).';
      var rr = Math.round(Motor.retencionMedia(J) * 100);
      caso = esc(J.empresa) + ' retiene ' + rr + '% por mes. ' + (rr >= 90 ? 'La curva se está aplanando: esto empieza a ser fit de verdad.' :
        'De cada 100 que entran, en 6 meses quedan ' + Math.round(Math.pow(Motor.retencionMedia(J), 6) * 100) + '. Esa curva todavía cae: el fit no está probado.');
    } else {
      teo = 'Geoffrey Moore: el mercado grande no compra promesas — compra el producto completo: integraciones, ' +
        'soporte, garantías, referencias. Y Accelerate suma la otra mitad: al escalar, velocidad y estabilidad se ' +
        'construyen juntas o se pierden juntas. Por eso acá priman Integraciones, Soporte, Seguridad y Escala.';
      var rg = Motor.requisitosGate(J), okg = 0, gi;
      for (gi = 0; gi < rg.length; gi++) if (rg[gi].ok) okg++;
      caso = esc(J.empresa) + ' cumple ' + okg + ' de ' + rg.length + ' requisitos de "' + esc(J.gateNombre) +
        '" y la carga del sistema está al ' + Math.round(Motor.carga(J) * 100) + '%. Lo que falte de esa lista ES tu roadmap.';
    }
    h += '<div class="teoria-caso" style="margin-top:10px">' +
         '<div class="rot" style="margin-bottom:4px">De dónde sale esta etapa</div>' +
         '<div class="pq" style="line-height:1.5">' + teo + '</div>' +
         '<div class="pq caso-linea">' + caso + '</div></div>';
    h += '</div>';

    h += '<div style="width:400px"><div class="rot" style="margin-bottom:8px">Con quiénes vas a trabajar</div>';
    var elencoKeys = ['ceo','cto','ventas','estrella'];
    for (i = 0; i < elencoKeys.length; i++) {
      var per = J.elenco[elencoKeys[i]];
      h += '<div class="quien" style="margin:4px 0"><div class="avatar">' + esc(per.nombre.charAt(0)) + '</div>' +
           '<div><div class="qn">' + esc(per.nombre) + '</div><div class="qc">' + esc(per.cargo) + '</div></div></div>';
    }
    h += '</div></div>';

    h += '<div style="margin-top:16px"><span class="btn pri" data-act="empezar-puesto">' + (J.briefVisto ? 'Volver al mes' : 'Arrancar el mes 1') + '</span></div>';
    $('p-brief').innerHTML = h;
    ir('p-brief');
  }

  /* ================= JUEGO ================= */

  function nuevoMes() {
    plan = { postura:'construir', apuestas:[] };
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
         'Mes ' + (J.mesPuesto + 1) + '<span class="mut" style="font-size:13px"> de ' + J.meses + '</span></div></div>';
    h += '<div class="hudi"><div class="k">Usuarios</div>' + vHud('u', Math.round(u2 / 10), mil(u2), '') + '</div>';
    h += '<div class="hudi"><div class="k">Retenci\u00f3n</div>' + vHud('ret', Math.round(Motor.retencionMedia(J) * 100), pct(Motor.retencionMedia(J)), '') + '</div>';
    if (J.rolN >= 1) {
      h += '<div class="hudi"><div class="k">Ingresos/mes</div>' + vHud('mrr', Math.round(J.mrr / 1000), money(J.mrr), '') + '</div>';
    }
    if (J.rolN >= 3) {
      h += '<div class="hudi"><div class="k">Caja</div>' + vHud('caja', Math.round(J.caja / 10000), money(J.caja), J.caja < Motor.burnMensual(J) * 3 ? 'rojo' : '') + '</div>';
      h += '<div class="hudi"><div class="k">Runway</div>' + vHud('run', Math.round(run), run > 90 ? '\u221e' : run.toFixed(1) + ' m', run < 4 ? 'rojo' : run < 8 ? 'ambar' : '') + '</div>';
    } else if (run < 5) {
      h += '<div class="hudi"><div class="k">&nbsp;</div><div class="v rojo" style="font-size:13px">Se habla de la caja en los pasillos</div></div>';
    }
    h += '<div class="hudi der"><span class="btn chico" data-act="biblio">Biblioteca ' + Object.keys(C.codex).length + '/' + LIBROS.length + '</span></div>';
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
      '<span class="mut">Mandato:</span>&nbsp;<b>' + esc(m.txt) + '</b>' +
      '<div class="track"><i class="' + cls + '" style="width:' + Math.round(Math.min(1, prog) * 100) + '%"></i></div>' +
      '<span class="num ' + (pol < 25 ? 'rojo' : pol < 45 ? 'ambar' : 'mut') + '">Capital político ' + pol + '</span>' +
      (lupa >= 25 ? '<span class="num ' + lupaCls + '" style="margin-left:14px">\u25c9 Te est\u00e1n mirando</span>' : '');
    $('mandato').innerHTML = h;
  }

  function renderEra() {
    var era = Mundo.era(M);
    var not = M.noticias.length ? M.noticias[0].txt : '';
    var calor = J.calor > 0 ? ' <span class="pill hot">tu sector está caliente</span>' :
                J.calor < 0 ? ' <span class="pill frio">tu sector está frío</span>' : '';
    $('era').innerHTML = '<span class="nombre-era">' + esc(era.nombre) + '</span>' + calor +
      (not ? '<span class="noticia" style="margin-left:14px">◈ ' + esc(not) + '</span>' : '');
  }

  var POSTURAS = [
    { k:'construir', n:'Construir', ic:'\u2699', s:'Avanzar las apuestas',
      req:'cons', lib:'inspired', mix:{ cons:1 } },
    { k:'descubrir', n:'Descubrir', ic:'\u25ce', s:'Hablar con usuarios',
      req:'desc', lib:'torres', mix:{ desc:0.6, cons:0.4 } },
    { k:'sanear', n:'Sanear', ic:'\u2696', s:'Deuda y fiabilidad',
      req:'plat', lib:'fowler', mix:{ plat:0.6, fiab:0.4 } },
    { k:'crecer', n:'Crecer', ic:'\u2197', s:'Salir a buscar mercado',
      req:'crec', lib:'chasm', mix:{ crec:0.5, cons:0.5 } }
  ];

  function posturaPorK(k) {
    for (var i = 0; i < POSTURAS.length; i++) if (POSTURAS[i].k === k) return POSTURAS[i];
    return POSTURAS[0];
  }

  /* postura -> reparto de puntos, respetando las palancas del rol */
  function planDePostura(k) {
    var p = posturaPorK(k), mio = Motor.capacidadPropia(J);
    var out = { desc:0, cons:0, plat:0, fiab:0, crec:0 }, kk, resto = mio;
    for (kk in p.mix) {
      if (!p.mix.hasOwnProperty(kk)) continue;
      if (J.palancas.indexOf(kk) < 0) continue;
      var v = Math.round(mio * p.mix[kk]);
      out[kk] = v; resto -= v;
    }
    out.cons += Math.max(0, resto);
    return out;
  }

  function renderPostura() {
    var h = '<div class="rot" style="margin-bottom:7px">1 \u00b7 Tu postura del mes</div><div class="posturas">';
    var i, desbloqueadas = 0;
    for (i = 0; i < POSTURAS.length; i++) {
      var p = POSTURAS[i];
      var puede = J.palancas.indexOf(p.req) >= 0;
      if (puede) desbloqueadas++;
      if (!puede) {
        var falta = '';
        for (var k = 0; k < ESCALAFON.length; k++) {
          if (ESCALAFON[k].palancas.indexOf(p.req) >= 0) { falta = ESCALAFON[k].corto; break; }
        }
        h += '<div class="post bloq"><div class="pic">' + p.ic + '</div><div class="pn">' + p.n + '</div>' +
             '<div class="ps">con ' + falta + '</div></div>';
        continue;
      }
      h += '<div class="post' + (plan.postura === p.k ? ' sel' : '') + '" data-postura="' + p.k + '">' +
           '<div class="pic">' + p.ic + '</div><div class="pn">' + p.n + '</div>' +
           '<div class="ps">' + esc(p.s) + '</div></div>';
    }
    h += '</div>';
    if (desbloqueadas === 1) h += '<div class="pq mut" style="margin-top:4px">M\u00e1s posturas al ascender.</div>';
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

  function compromisoPlan() {
    var t = Motor.comprometido(J), i;
    for (i = 0; i < plan.apuestas.length; i++) {
      if (!J.enVuelo[plan.apuestas[i]]) t += Motor.costoDe(J, plan.apuestas[i]);
    }
    return t;
  }

  function renderBacklog() {
    var techo = J.techoPts, usado = compromisoPlan();
    var pctU = Math.min(100, Math.round(usado / techo * 100));
    var h = '<div class="rot" style="margin:8px 0 5px 0">2 \u00b7 Eleg\u00ed apuestas \u00b7 compromiso ' +
      '<b class="num ' + (usado >= techo ? 'ambar' : '') + '">' + usado + '/' + techo + '</b>' +
      ' <span class="pill libro" data-lib="momtest">confianza ' + Motor.confianza(J) + '</span></div>' +
      '<div class="track" style="margin-bottom:8px"><i class="' + (pctU >= 100 ? 'a' : '') + '" style="width:' + pctU + '%"></i></div>';

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
      var cabe = sel || (usado + d.costo <= techo);
      var obj = J.prima.indexOf(a.nec) >= 0 ? '<span class="tagobj mini">▲</span>' :
                J.castiga.indexOf(a.nec) >= 0 ? '<span class="tagobj down mini">▽</span>' : '';
      h += '<div class="ap' + (sel ? ' sel' : '') + (cabe ? '' : ' nocabe') + '" data-ap="' + id + '">' +
        '<div class="t"><div class="n2">' + esc(a.n) + '<span class="pill">' + esc(nec.corto) + '</span>' + obj + '</div>' +
        '<div class="viz">' +
          '<span class="vlbl">prob</span>' + dots(d.prob) +
          '<span class="vlbl">impacto</span>' + blocks(d.mag) +
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

    h += '<div class="caja2"><div class="rot" style="margin-bottom:6px">C\u00f3mo estamos</div>';
    h += barraEstado('Evidencia', J.evidencia, false, 'lean');
    h += barraEstado('Deuda', J.deuda, true, 'fowler');
    h += barraEstado('\u00c1nimo', J.moral, false, null);
    if ((J.lupa || 0) >= 25) h += barraEstado('La Lupa', J.lupa, true, null);
    h += '<div class="pq mut" style="margin-top:6px">' + J.ing + ' ing \u00b7 ' + J.prod + ' prod \u00b7 ' + J.gtm + ' gtm' +
         (J.rampa.length ? ' \u00b7 <span class="ambar">' + J.rampa.length + ' en rampa</span>' : '') + '</div></div>';

    if (J.rolN >= 1) {
      h += '<div class="caja2"><div class="rot" style="margin-bottom:4px">A qui\u00e9n le lleg\u00e1s</div>';
      for (i = 0; i < SEGMENTOS.length; i++) {
        var s = SEGMENTOS[i], u2 = J.usuarios[s.id] || 0, f = Motor.fit(J, s.id);
        var ab = Motor.abierto(J, s.id), g = Motor.compuerta(J, s.id);
        var cls = f > 0.65 ? 'v' : f > 0.35 ? 'a' : 'r';
        h += '<div class="seg"><div class="l"><span class="nm">' + esc(s.nombre) +
          (!ab ? ' <span class="pill">todav\u00eda no</span>' : (g < 0.5 ? ' <span class="pill rojo">bloqueado</span>' : '')) +
          '</span><span class="num mut">' + mil(u2) + '</span></div>' +
          '<div class="track"><i class="' + cls + '" style="width:' + Math.round(f * 100) + '%"></i></div></div>';
      }
      h += '</div>';
    }

    if (J.gateRevelado) {
      var r = Motor.requisitosGate(J);
      h += '<div class="caja2"><div class="rot" style="margin-bottom:5px">' + esc(J.gateNombre) + ' ' + chip('chasm') + '</div>';
      for (i = 0; i < r.length; i++) {
        h += '<div class="req ' + (r[i].ok ? 'verde' : 'mut') + '">' + (r[i].ok ? '\u2713' : '\u25cb') + ' ' + esc(r[i].txt) + '</div>';
      }
      h += '</div>';
    }

    if (J.rolN >= 2) {
      var carga = Motor.carga(J);
      h += '<div class="caja2"><div class="rot" style="margin-bottom:5px">Sala de m\u00e1quinas</div>';
      h += barraEstado('Carga', carga * 100, true, 'ddia');
      h += barraEstado('Usabilidad', J.usabilidad, false, 'krug');
      if (J.rolN >= 3) {
        h += barraEstado('Presup. error', J.presupuestoError, false, 'sre');
        h += barraEstado('Foco', J.foco, false, 'grove');
      }
      h += '</div>';
    }
    $('panel').innerHTML = h;
  }

  function renderBarra() {
    var p = posturaPorK(plan.postura);
    var h = '<div class="pts">Postura: <b>' + p.n + '</b> \u00b7 ' + plan.apuestas.length + ' apuesta' +
      (plan.apuestas.length === 1 ? '' : 's') + ' nueva' + (plan.apuestas.length === 1 ? '' : 's') + '</div>';
    if (J.esFundador && !J.levantando) h += '<span class="btn chico" data-act="ronda" style="margin-right:10px">Salir a levantar</span>';
    h += '<span class="btn pri" data-act="ejecutar">3 \u00b7 Cerrar el mes</span>';
    $('barra').innerHTML = h;
  }

  function renderJuego() {
    ir('p-juego');
    renderHud(); renderMandato(); renderEra();
    renderPostura(); renderBacklog(); renderPanel(); renderBarra();
  }

  /* ================= dilemas ================= */

  function mostrarEvento(ev) {
    var quien = ev.quien && J.elenco[ev.quien] ? J.elenco[ev.quien] : null;
    var h = '<div class="rot">Mes ' + (J.mesPuesto + 1) + ' en ' + esc(J.empresa) + '</div>' +
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
    mostrarResultado(log, 'Lo que dejó la decisión', true, libroTeoria);
  }

  /* ================= cerrar el mes ================= */

  function ejecutar() {
    var reparto = planDePostura(plan.postura);
    reparto.apuestas = plan.apuestas;
    var log = Motor.simular(J, reparto, M);
    var nuevas = fichasNuevas(J, C), fi;
    for (fi = 0; fi < nuevas.length; fi++) {
      log.push({ tipo:'nota', texto:'Se abrió una ficha en la biblioteca: el momento que estás viviendo tiene nombre.',
                 libro:nuevas[fi].id });
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

  function mostrarResultado(log, titulo, esDecision, libroTeoria) {
    var h = '<div class="rot">' + titulo + '</div><h2>' +
            (esDecision ? 'Decidido' : 'Qué pasó') + '</h2><div class="cuerpo2 scroll">';
    if (!log.length) h += '<div class="pq mut">Mes sin sobresaltos. A veces eso es exactamente lo que hace falta.</div>';
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
          '<div class="rot" style="margin-bottom:4px">La teoría · ' + esc(lt.titulo) + ' — ' + esc(lt.autor) + '</div>' +
          '<div class="pq" style="line-height:1.5">' + esc(lt.idea) + '</div>' +
          (ap2 ? '<div class="pq caso-linea">' + esc(ap2) + '</div>' : '') +
          '</div>';
      }
    }
    h += '</div><div style="margin-top:14px"><span class="btn pri" data-act="cerrar-result">' +
         (esDecision ? 'Seguir con el mes' : 'Mes siguiente') + '</span></div>';
    $('t-result').innerHTML = h;
    $('t-result').setAttribute('data-decision', esDecision ? '1' : '0');
    ov('ov-result', true);
  }

  /* ================= cierre de puesto ================= */

  function cerrarPuesto() {
    var e = J;
    var cierre = Carrera.cerrar(C, e, M);
    var nuevos = Logros.evaluarPuesto(R, C, e, cierre);
    J = null;

    var titulo = cierre.final === 'imputado' ? 'Saliste esposado por la puerta de vidrio' :
                 cierre.final === 'quiebra' ? 'La empresa se quedó sin caja' :
                 cierre.final === 'despido' ? 'Te pidieron la renuncia' :
                 cierre.final === 'venta' ? 'Vendieron la empresa' :
                 'Fin del mandato en ' + cierre.empresa;
    var h = '<div class="rot">' + esc(cierre.rol) + ' · ' + cierre.meses + ' meses · ' + esc(cierre.sector) + '</div>' +
      '<div class="h1">' + esc(titulo) + '</div>';

    h += '<div class="notas">';
    h += '<div class="nota"><div class="nk">Mandato</div><div class="nv ' +
         (cierre.cumplido ? 'verde' : 'rojo') + '" style="font-size:26px;margin-top:8px">' +
         (cierre.cumplido ? 'Cumplido' : 'No llegaste') + '</div>' +
         '<div class="pq mut">' + esc(cierre.valorMandato) + ' de ' + esc(cierre.metaMandato) + '</div></div>';
    h += '<div class="nota"><div class="nk">Reputación</div><div class="nv ' +
         (cierre.dRep >= 0 ? 'verde' : 'rojo') + '">' + (cierre.dRep >= 0 ? '+' : '') + cierre.dRep + '</div>' +
         '<div class="pq mut">ahora ' + Math.round(C.reputacion) + '</div></div>';
    h += '<div class="nota"><div class="nk">Movimiento</div><div class="nv" style="font-size:22px;margin-top:10px">' +
         (cierre.promocion ? '<span class="verde">Ascenso</span>' : cierre.imputado ? '<span class="rojo">Imputación</span>' : cierre.despido ? '<span class="rojo">Despido</span>' : 'Lateral') +
         '</div><div class="pq mut">' + esc(nivelPorN(C.nivel).rol) + '</div></div>';
    h += '<div class="nota" style="width:280px"><div class="nk">Tu bolsillo</div>' +
         '<div class="nv" style="font-size:26px;margin-top:6px">' + money(cierre.ahorrado + (cierre.cascada ? cierre.cascada.aFund : 0)) + '</div>' +
         '<div class="pq mut">Equity vestida: ' + (Math.round(cierre.equityVestida * 100) / 100) + '% (papel ' + money(cierre.valorPapel) + ')</div></div>';
    h += '</div>';

    h += '<div style="display:-webkit-flex;display:flex">';
    h += '<div style="width:520px;padding-right:24px">';
    var i;
    for (i = 0; i < cierre.notas.length; i++) {
      h += '<div class="linea"><div class="ic mut">•</div><div class="tx">' + esc(cierre.notas[i][0]) + ' ' + chip(cierre.notas[i][1]) + '</div></div>';
    }
    if (cierre.cascada) {
      var cs = cierre.cascada;
      h += '<div class="rot" style="margin:12px 0 4px 0">Cascada de salida</div>' +
        '<div class="req"><span class="mut">Valor de salida</span> <b>' + money(cs.salida) + '</b></div>' +
        '<div class="req"><span class="mut">Preferencias de liquidación</span> <b>' + money(cs.pref) + '</b></div>' +
        '<div class="req"><span class="mut">Inversores</span> <b>' + money(cs.aInv) + '</b></div>' +
        '<div class="req"><span class="mut">Vos</span> <b class="verde">' + money(cs.aFund) + '</b></div>';
    }
    if (cierre.rivalTxt) {
      h += '<div class="linea" style="margin-top:8px"><div class="ic lila">◆</div><div class="tx lila">' +
           esc(cierre.rivalTxt) + '</div></div>';
    }
    h += '</div>';

    h += '<div style="width:380px"><div class="rot" style="margin-bottom:6px">Lo que te llevás</div>';
    var HH = [['producto','Producto'],['tecnologia','Tecnología'],['negocio','Negocio'],['liderazgo','Liderazgo']];
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
         (C.final ? 'Ver el final de tu carrera' : 'Ver qué hay sobre la mesa') + '</span></div>';
    $('p-cierre').innerHTML = h;
    guardar();
    ir('p-cierre');
  }

  /* ================= final de carrera ================= */

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
    h += '<div class="nota" style="width:300px"><div class="nk">Tu rival: ' + esc(rv.nombre) + '</div>' +
         '<div class="nv" style="font-size:22px;margin-top:8px" class="num">' +
         (ganaste ? '<span class="verde">Quedaste arriba</span>' : '<span class="rojo">Te ganó</span>') + '</div>' +
         '<div class="pq mut">' + esc(rv.nombre) + ' terminó como ' + esc(nivelPorN(rv.nivel).rol) +
         (rv.fundo ? ' y fundó su empresa' : '') + '</div></div>';
    h += '</div>';

    h += '<div style="display:-webkit-flex;display:flex">';
    h += '<div style="width:460px;padding-right:26px">';
    h += '<div class="rot" style="margin-bottom:5px">El equity, al final</div>';
    if (!b.detalleEquity.length) h += '<div class="pq mut">No vestiste equity en ningún lado.</div>';
    for (i = 0; i < b.detalleEquity.length; i++) {
      var q = b.detalleEquity[i];
      h += '<div class="req"><span class="mut">' + esc(q.empresa) + ' (' + (Math.round(q.pct*100)/100) + '%)</span> <b class="num ' +
           (q.valor > 0 ? 'verde' : 'mut') + '">' + (q.valor > 0 ? money(q.valor) : 'no valió nada') + '</b></div>';
    }
    h += '<div class="pq mut" style="margin-top:8px">La mayoría del equity muere en cero. El que vale, paga todo el resto. ' +
         'Por eso importan la salud de la empresa cuando te vas — y los términos que firmó antes que vos.</div>';
    h += '<div class="rot" style="margin:14px 0 5px 0">Habilidades finales</div>';
    var HH = [['producto','Producto'],['tecnologia','Tecnología'],['negocio','Negocio'],['liderazgo','Liderazgo']];
    for (i = 0; i < HH.length; i++) {
      var v = Math.round(C.hab[HH[i][0]]);
      h += '<div class="hab"><div class="hk">' + HH[i][1] + '<b class="num">' + v + '</b></div>' +
           '<div class="track"><i class="l" style="width:' + v + '%"></i></div></div>';
    }
    h += '</div>';

    h += '<div style="width:420px"><div class="rot" style="margin-bottom:5px">Puesto por puesto</div>';
    for (i = 0; i < C.puestos.length; i++) {
      var p = C.puestos[i];
      h += '<div class="req">' + (p.cumplido ? '<span class="verde">✓</span>' : p.despido ? '<span class="rojo">✕</span>' : '<span class="mut">○</span>') +
           ' <b>' + esc(p.rol) + '</b> <span class="mut">en ' + esc(p.empresa) + ' — ' + esc(p.mandato) + '</span></div>';
    }
    for (i = 0; i < nuevos.length; i++) {
      h += '<div class="logro"><div class="med">★</div><div><div class="ln">' + esc(nuevos[i].n) + '</div>' +
           '<div class="ld">' + esc(nuevos[i].d) + '</div></div></div>';
    }
    h += '<div class="pq mut" style="margin-top:8px">Abriste ' + Object.keys(C.codex).length + ' de 20 fichas.</div>';
    h += '</div></div>';

    h += '<div style="margin-top:16px"><span class="btn pri" data-act="reiniciar">Otra carrera</span> ' +
         '<span class="btn" data-act="biblio">Biblioteca</span></div>';
    $('p-final').innerHTML = h;
    try { localStorage.removeItem(CLAVE); } catch (e2) {}
    ir('p-final');
  }

  function mostrarIntro() {
    $('t-intro').innerHTML = '<div class="rot">C\u00f3mo se juega</div>' +
      '<h2>Cuatro cosas. Nada m\u00e1s.</h2>' +
      '<div class="cuerpo2" style="margin-top:6px">' +
      '<div class="linea"><div class="ic azul">1</div><div class="tx"><b>Eleg\u00ed un trabajo.</b> Te contratan para UNA cosa: el mandato. La barra de arriba es tu trabajo. Cumplilo y ascend\u00e9s.</div></div>' +
      '<div class="linea"><div class="ic azul">2</div><div class="tx"><b>Cada mes: una postura y tus apuestas.</b> Eleg\u00eds en qu\u00e9 gasta el mes tu equipo, y qu\u00e9 constru\u00eds del backlog hasta llenar el techo de compromiso.</div></div>' +
      '<div class="linea"><div class="ic azul">3</div><div class="tx"><b>Prioriz\u00e1 por probabilidad \u00d7 impacto \u00f7 esfuerzo.</b> Los puntos y bloques son estimaciones: cuanto m\u00e1s habl\u00e1s con usuarios, menos te mienten.</div></div>' +
      '<div class="linea"><div class="ic azul">4</div><div class="tx"><b>Todo lo dem\u00e1s se aprende perdiendo.</b> Cuando el juego te cobre algo, te dice en qu\u00e9 libro estaba escrito.</div></div>' +
      '</div>' +
      '<div style="margin-top:18px"><span class="btn pri" data-act="cerrar-intro">Ver las ofertas</span></div>';
    ov('ov-intro', true);
  }

  /* ================= biblioteca ================= */

  function mostrarBiblio() {
    var codex = C ? C.codex : {};
    var abiertos = 0, i, j;
    for (i = 0; i < LIBROS.length; i++) if (codex[LIBROS[i].id]) abiertos++;
    var h = '<div class="rot">Biblioteca</div><h2>' + abiertos + ' de ' + LIBROS.length + ' fichas</h2>' +
      '<div class="pq mut" style="margin-bottom:8px">Cada ficha se abre cuando el concepto te toca en la carrera. Tocá una abierta para leerla.</div>' +
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
           ' \u00b7 ' + n + '/' + tot + '</div><div class="libs">' + cuerpo + '</div>';
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

  /* ================= clicks ================= */

  function attr(nodo, a) {
    while (nodo && nodo !== document) {
      if (nodo.getAttribute) { var v = nodo.getAttribute(a); if (v !== null) return v; }
      nodo = nodo.parentNode;
    }
    return null;
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target, v;

    v = attr(t, 'data-lib');
    if (v) { mostrarLibro(v); return; }

    v = attr(t, 'data-oferta');
    if (v !== null) { ofertaSel = parseInt(v, 10); renderOfertas(); return; }

    v = attr(t, 'data-op');
    if (v !== null && evActual) { elegirOpcion(parseInt(v, 10)); return; }

    v = attr(t, 'data-postura');
    if (v && J) { plan.postura = v; renderPostura(); renderBarra(); return; }

    v = attr(t, 'data-ap');
    if (v && J) {
      var i = plan.apuestas.indexOf(v);
      if (i >= 0) plan.apuestas.splice(i, 1);
      else if (compromisoPlan() + Motor.costoDe(J, v) <= J.techoPts && !J.enVuelo[v]) plan.apuestas.push(v);
      renderBacklog(); renderBarra();
      return;
    }

    v = attr(t, 'data-act');
    if (!v) return;

    if (v === 'nueva') {
      C = Carrera.nueva(); M = Mundo.nuevo(); J = null; ofertaSel = -1;
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

  renderInicio();
})();
