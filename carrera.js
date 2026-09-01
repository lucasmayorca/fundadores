/* The career: offers, mandates, promotions, skills and equity with vesting.
   Each company is a 12-to-18-month role. Strict ES5 (Safari 9). */

var Carrera = (function () {
  'use strict';

  var MAX_PUESTOS = 8;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function elegir(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* Which mandate fits each trade and each stage. */
  var MANDATO_SECTOR = {
    datapol:['descubrir','ingresos','abismo'],
    biogen:['abismo','estabilidad','descubrir'],
    banco:['abismo','crecer','estabilidad'],
    renov:['abismo','ingresos','descubrir'],
    devtools:['ingresos','activacion','retencion'],
    apuestas:['crecer','ingresos','retencion'],
    saludgold:['retencion','ingresos','abismo']
  };
  var MANDATO_ETAPA = {
    semilla:['descubrir','retencion','crecer'],
    serieA:['crecer','ingresos','activacion'],
    serieB:['abismo','ingresos','estabilidad'],
    serieC:['estabilidad','deuda','retencion']
  };

  function nueva(nombre, nivel0) {
    var n0 = Math.max(0, Math.min(7, nivel0 || 0));
    /* starting mid-ladder seeds seniority: reputation and skills scale with
       the level you bring in, so the world treats you like you have a past */
    var habBase = 8 + n0 * 6;
    return {
      nombre:nombre || 'you',
      mes:0, nivel:n0, nivelInicial:n0, reputacion:35 + n0 * 4,
      hab:{ producto:habBase, tecnologia:Math.round(habBase * 0.6),
            negocio:Math.round(habBase * 0.7), liderazgo:Math.round(habBase * 0.8) },
      puestos:[], equities:[], ahorros:0,
      trabajadas:{}, codex:{}, dilemasVistos:{},
      ofertas:null, ofertaActual:null,
      retirado:false, final:null
    };
  }

  /* ---------------- offers ----------------
     The rule this teaches: early stage gives you more title and more equity
     because you're the one carrying the risk. Late stage gives you money and
     stability, and you climb slower. */
  function ofertas(c, mundo) {
    var libres = [], i;
    for (i = 0; i < EMPRESAS.length; i++) if (!c.trabajadas[EMPRESAS[i].id]) libres.push(EMPRESAS[i]);
    if (libres.length < 3) { c.trabajadas = {}; libres = EMPRESAS.slice(); }

    var out = [], usadas = {};
    var intentos = 0;
    while (out.length < 3 && intentos++ < 60) {
      var emp = elegir(libres);
      if (usadas[emp.id]) continue;
      usadas[emp.id] = true;
      out.push(armarOferta(c, emp, mundo));
    }

    /* Founding: shows up once you have mileage and a name. */
    if (c.nivel >= 5 && c.reputacion >= 62 && !c.yaFundo) {
      out[2] = ofertaFundar(c);
    }
    c.ofertas = out;
    return out;
  }

  function armarOferta(c, emp, mundo) {
    var et = ETAPAS[emp.etapa], sec = sectorPorId(emp.sector);
    var temprana = (emp.etapa === 'semilla' || emp.etapa === 'serieA');
    var calor = mundo ? Mundo.calorSector(mundo, emp.sector) : 0;
    var capitalEra = mundo ? Mundo.modCapital(mundo) : 1;

    /* level offered */
    var rolN = c.nivel;
    if (temprana && Math.random() < (c.reputacion > 50 ? 0.62 : 0.4) + (calor > 0 ? 0.15 : 0)) rolN = c.nivel + 1;
    else if (!temprana && Math.random() < 0.35) rolN = Math.max(0, c.nivel - 1);
    rolN = clamp(rolN, 0, 6);
    var niv = nivelPorN(rolN);

    /* money: late stage pays more for the same title */
    var factorEtapa = { semilla:0.72, serieA:0.9, serieB:1.12 }[emp.etapa];
    var sueldo = Math.round(niv.sueldo * factorEtapa * (calor > 0 ? 1.18 : calor < 0 ? 0.92 : 1) / 1000) * 1000;

    var eq = rnd(et.equity[0], et.equity[1]) * (1 + rolN * 0.14) * (2 - capitalEra) ;
    var pool = (MANDATO_SECTOR[emp.sector] || []).concat(MANDATO_ETAPA[emp.etapa] || []);
    /* the mandate has to be reachable with the role's levers */
    var REQUIERE = { descubrir:'desc', deuda:'plat', estabilidad:'fiab', crecer:'crec', ingresos:'crec' };
    var filtrado = [], fi;
    for (fi = 0; fi < pool.length; fi++) {
      if (pool[fi] === 'abismo' && (rolN < 2 || c.puestos.length === 0)) continue;
      var req = REQUIERE[pool[fi]];
      if (!req || niv.palancas.indexOf(req) >= 0) filtrado.push(pool[fi]);
    }
    if (!filtrado.length) filtrado = ['retencion','activacion'];
    var mandatoId = elegir(filtrado);

    var riesgo = et.caos * (0.6 + sec.competidor * 0.5);
    return {
      empresaId:emp.id, nombre:emp.nombre, pitch:emp.pitch,
      sector:emp.sector, sectorNombre:sec.nombre, sectorCorto:sec.corto, eje:sec.eje,
      etapa:emp.etapa, etapaNombre:et.nombre,
      rolN:rolN, rol:niv.rol, mando:niv.mando, notaRol:niv.nota,
      mandatoId:mandatoId, mandatoTxt:mandatoPorId(mandatoId).txt,
      /* the first role is short: the first promotion has to come fast */
      meses:c.puestos.length === 0 ? Math.round(rnd(8, 10)) : Math.round(rnd(10, 14)),
      sueldo:sueldo, equity:Math.round(eq * 1000) / 1000,
      riesgo:riesgo, calor:calor,
      perfil:emp.perfil || 'parejo', techo:et.techo, slots:et.slots || 3,
      riesgoTxt:riesgo > 1.35 ? 'Very high' : riesgo > 1.05 ? 'High' : riesgo > 0.85 ? 'Medium' : 'Low',
      fundar:false
    };
  }

  function ofertaFundar(c) {
    var sec = elegir(SECTORES);
    return {
      empresaId:'propia_' + sec.id, nombre:'Your own company', pitch:'Everything you\'ve been learning, but yours.',
      sector:sec.id, sectorNombre:sec.nombre, sectorCorto:sec.corto, eje:sec.eje,
      etapa:'semilla', etapaNombre:'You found it',
      rolN:7, rol:'Founder', mando:1.0, notaRol:nivelPorN(7).nota,
      mandatoId:'ingresos', mandatoTxt:mandatoPorId('ingresos').txt,
      meses:Math.round(rnd(20, 26)),
      sueldo:70000, equity:100, riesgo:1.6, riesgoTxt:'All yours',
      perfil:'incierto', techo:22, slots:2,
      cajaPropia:Math.round(300000 + Math.min(1200000, c.ahorros * 0.5)),
      fundar:true
    };
  }

  function aceptar(c, of, mundo) {
    if (of.fundar) c.yaFundo = true;
    c.ofertaActual = of;
    c.trabajadas[of.empresaId] = true;
    return Motor.nuevoPuesto(of, c, mundo);
  }

  /* ---------------- closing out a role ---------------- */

  function cerrar(c, e, mundo) {
    var of = c.ofertaActual;
    var prog = Motor.progresoMandato(e);
    var cumplido = prog >= 1;
    var m = mandatoPorId(e.mandatoId);

    var r = {
      empresa:e.empresa, sector:e.sector, rol:e.rol, meses:e.mesPuesto,
      mandato:m.txt, progreso:prog, cumplido:cumplido, final:e.final,
      valorMandato:m.fmt(m.valor(e)), metaMandato:m.fmt(m.meta(e)),
      politico:Math.round(e.politico), libro:m.libro,
      promocion:false, despido:false, dRep:0, notas:[]
    };

    /* reputation and movement */
    if (e.final === 'imputado') {
      r.despido = true; r.imputado = true; r.dRep = -22;
      c.nivel = Math.max(0, c.nivel - 2);
      r.notas.push(['An indictment with your name on it. This business forgives failure; a rap sheet, never.', 'hard']);
    } else if (e.final === 'venta') {
      r.dRep = 15; r.promocion = true;
      r.notas.push(['You sold the company. On your CV that\'s worth more than any title.', 'deals']);
    } else if (e.final === 'despido') {
      r.despido = true; r.dRep = -14;
      r.notas.push(['You ran out of political capital. In an organization that costs you the job, whether you were right or not.', 'hard']);
    } else if (e.final === 'quiebra') {
      r.dRep = cumplido ? -2 : -6;
      r.notas.push(['The company ran out of cash while you were there. It counts less than a firing, but it counts.', 'lean']);
    } else if (cumplido && e.politico >= 45) {
      r.promocion = true; r.dRep = 12;
      r.notas.push(['You delivered the mandate and finished with internal credit. That\'s a promotion.', 'grove']);
    } else if (prog >= 0.7) {
      r.dRep = 4;
      r.notas.push(['You came close. They renew you, they don\'t promote you.', 'grove']);
    } else {
      r.dRep = -8;
      r.notas.push(['You didn\'t move the metric they hired you to move.', 'trap']);
    }

    /* equity: cliff at 12 months, 4-year vesting */
    var vestida = 0;
    if (e.esFundador) vestida = e.capTable.fund * 100 * Math.min(1, e.mesPuesto / 48);
    else if (e.mesPuesto >= 12) vestida = of.equity * Math.min(1, e.mesPuesto / 48) * (e.dilucion || 1);
    var valorPapel = 0;
    if (vestida > 0 && e.final !== 'quiebra') {
      valorPapel = (vestida / 100) * e.valoracion * 0.35;
      c.equities.push({ empresa:e.empresa, sector:e.sector, pct:vestida, papel:valorPapel,
                        salud:saludEmpresa(e) });
    }
    r.equityOfrecida = of.equity;
    r.equityVestida = vestida;
    r.valorPapel = valorPapel;
    if (of.equity > 0 && e.mesPuesto < 12) {
      r.notas.push(['You left before 12 months: the cliff left you with zero of your equity.', 'deals']);
    }

    /* accumulated salary */
    var neto = of.sueldo * (e.mesPuesto / 12) * 0.45;
    c.ahorros += neto + (e.ventaSecundaria || 0);
    c.lupaMax = Math.max(c.lupaMax || 0, e.lupaMax || 0);
    r.ahorrado = neto;

    /* skills: you learn from what you do, not from where you are */
    var tot = e.acum.desc + e.acum.cons + e.acum.plat + e.acum.fiab + e.acum.crec;
    if (tot < 1) tot = 1;
    var esf = e.mesPuesto / 14;
    var antes = { producto:c.hab.producto, tecnologia:c.hab.tecnologia, negocio:c.hab.negocio, liderazgo:c.hab.liderazgo };
    subir(c.hab, 'producto',  ((e.acum.desc * 1.6 + e.acum.cons * 0.5) / tot) * 22 * esf + (cumplido ? 2 : 0));
    subir(c.hab, 'tecnologia',((e.acum.plat * 1.4 + e.acum.fiab * 1.4) / tot) * 22 * esf);
    subir(c.hab, 'negocio',   ((e.acum.crec * 1.7) / tot) * 20 * esf + (cumplido ? 3 : 0) + (e.esFundador ? 5 : 0));
    subir(c.hab, 'liderazgo', (e.rolN * 0.9 + (e.politico > 60 ? 3 : 0)) * esf);
    r.dHab = {
      producto:Math.round(c.hab.producto - antes.producto),
      tecnologia:Math.round(c.hab.tecnologia - antes.tecnologia),
      negocio:Math.round(c.hab.negocio - antes.negocio),
      liderazgo:Math.round(c.hab.liderazgo - antes.liderazgo)
    };

    c.reputacion = clamp(c.reputacion + r.dRep, 0, 100);
    if (r.promocion) c.nivel = Math.min(7, Math.max(c.nivel, e.rolN) + 1);
    else if (e.final === 'plazo' && prog >= 0.7) c.nivel = Math.max(c.nivel, e.rolN);
    else if (r.despido && e.final !== 'imputado') c.nivel = Math.max(0, c.nivel - (Math.random() < 0.4 ? 1 : 0));

    c.mes += e.mesPuesto;
    c.puestos.push(r);
    c.ofertaActual = null;

    if (e.esFundador && e.final === 'venta') {
      r.cascada = Motor.cascada(e);
      c.ahorros += r.cascada.aFund;
      /* you already cashed out: that equity doesn't stay on paper */
      if (c.equities.length && c.equities[c.equities.length - 1].empresa === e.empresa) c.equities.pop();
      r.notas.push(['Your exit went through the liquidation waterfall before any of it reached you.', 'deals']);
    } else if (e.esFundador && e.final === 'plazo') {
      r.notas.push(['Nobody bought the company: your stake stays on paper. Founder wealth is illiquid until someone pays.', 'deals']);
    }
    if (mundo) {
      var avanzo = Mundo.avanzarRival(mundo, e.mesPuesto, r.despido || e.final === 'quiebra');
      if (avanzo) {
        var rv = mundo.rival;
        r.rivalTxt = rv.nombre + ' ' + rv.hitos[rv.hitos.length - 1] + '.';
      }
    }
    if (c.puestos.length >= MAX_PUESTOS) c.final = 'plazo';
    return r;
  }

  function subir(hab, k, cuanto) {
    /* diminishing returns: going from 80 to 90 costs a lot more */
    var margen = (100 - hab[k]) / 100;
    hab[k] = clamp(hab[k] + cuanto * (0.35 + margen * 0.75), 0, 100);
  }

  function saludEmpresa(e) {
    var s = 0;
    s += Motor.runwayMeses(e) > 12 ? 1 : 0;
    s += Motor.retencionMedia(e) > 0.88 ? 1 : 0;
    s += Motor.compuerta(e, 'pragm') >= 1 ? 1 : 0;
    s += e.deuda < 45 ? 1 : 0;
    return s; /* 0..4 */
  }

  /* ---------------- end of career ---------------- */

  function boletin(c) {
    var i, realizado = 0, detalle = [];
    for (i = 0; i < c.equities.length; i++) {
      var q = c.equities[i];
      /* the equity lottery: most of it is worth nothing, some is worth a lot */
      var base = [0, 0.05, 0.25, 0.9, 2.4][q.salud];
      var factor = base * rnd(0.3, 1.7);
      var val = Math.round(q.papel * factor);
      realizado += val;
      detalle.push({ empresa:q.empresa, pct:q.pct, papel:q.papel, valor:val });
    }
    var niv = nivelPorN(c.nivel);
    var cumplidos = 0, despidos = 0;
    for (i = 0; i < c.puestos.length; i++) {
      if (c.puestos[i].cumplido) cumplidos++;
      if (c.puestos[i].despido) despidos++;
    }
    return {
      nivel:niv, reputacion:Math.round(c.reputacion), anios:(c.mes / 12).toFixed(1),
      hab:c.hab, puestos:c.puestos.length, cumplidos:cumplidos, despidos:despidos,
      ahorros:Math.round(c.ahorros), equityRealizado:realizado,
      patrimonio:Math.round(c.ahorros + realizado),
      detalleEquity:detalle, libros:0
    };
  }

  return { nueva:nueva, ofertas:ofertas, aceptar:aceptar, cerrar:cerrar, boletin:boletin,
           MAX_PUESTOS:MAX_PUESTOS };
})();
