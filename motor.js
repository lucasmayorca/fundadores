/* Simulation engine for a single role. One turn = one month.
   The laws from the books are baked in as physics of the world, not as text.
   Strict ES5 (Safari 9). No dependencies, never touches the DOM. */

var Motor = (function () {
  'use strict';

  var COBERTURA_PLENA = 80;
  var SAL_ING = 11000, SAL_PROD = 11000, SAL_GTM = 8500;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function seg(id) {
    for (var i = 0; i < SEGMENTOS.length; i++) if (SEGMENTOS[i].id === id) return SEGMENTOS[i];
    return null;
  }
  function apuesta(id) {
    for (var i = 0; i < APUESTAS.length; i++) if (APUESTAS[i].id === id) return APUESTAS[i];
    return null;
  }

  /* ---------------- starting a role ---------------- */

  function nuevoPuesto(oferta, carrera, mundo) {
    var sec = sectorPorId(oferta.sector), et = ETAPAS[oferta.etapa], niv = nivelPorN(oferta.rolN), i;
    var emp = empresaPorId(oferta.empresaId);
    var nombreEmp = emp ? emp.nombre : (oferta.fundar ? 'your company' : oferta.nombre);

    var e = {
      /* identity of the role */
      empresaId:oferta.empresaId, empresa:nombreEmp, sectorId:sec.id, sector:sec.nombre,
      etapa:oferta.etapa, rolN:oferta.rolN, rol:niv.rol, mando:niv.mando, palancas:niv.palancas,
      esFundador:oferta.rolN >= 7,
      mandatoId:oferta.mandatoId, meses:oferta.meses, mesPuesto:0,

      /* physics of the sector */
      precio:sec.precio, escalaSec:sec.escala, viral:sec.viral, cac:sec.cac,
      capex:sec.capex, gateReqs:sec.gateReqs, gateNombre:sec.gate,
      tipoIncidente:sec.incidente, retMod:sec.retMod,

      /* state of the company */
      caja:oferta.cajaPropia || et.caja, mrr:0, valoracion:et.valoracion,
      ing:et.ing, prod:et.prod, gtm:et.gtm, rampa:[],
      deuda:et.deuda, arquitectura:et.arq, usabilidad:et.usab, marca:22 + et.arq * 0.2,
      fiabPercibida:78, presupuestoError:100,
      evidencia:18 + (et.arq * 0.15), calidadDesc:0.7, sesgo:0.4,
      moral:72, foco:52, politico:clamp(50 + carrera.reputacion / 4, 20, 85),

      cobertura:{}, impactos:{}, ruidos:{}, hechas:{}, enVuelo:{}, backlog:[],
      usuarios:{}, tam:{},
      competidor:{ fuerza:sec.competidor, atencion:0.05 + et.arq * 0.002 },
      capTable:{ fund:oferta.rolN >= 7 ? 1.0 : 0, inv:0, pool:0 },
      preferencias:[], rondas:[],

      /* the player's skills, already applied as modifiers */
      hab:{ producto:carrera.hab.producto, tecnologia:carrera.hab.tecnologia,
            negocio:carrera.hab.negocio, liderazgo:carrera.hab.liderazgo },

      lupa:0, lupaBase:0, lupaMax:0, imputado:false, zafo:false,
      perfil:oferta.perfil || 'parejo', techoPts:oferta.techo || et.techo || 30, costos:{},
      fase:et.fase || '', faseCorta:et.faseCorta || '', objetivo:et.objetivo || '',
      slots:oferta.slots || et.slots || 3,
      prima:et.prima || [], castiga:et.castiga || [], briefVisto:false,
      teamTopo:false, cd:false, cadenciaDesc:false, empoderado:false, fabrica:false,
      refactorFijo:false, reescritura:0, congelado:false, capacidadReservada:0,
      gateRevelado:false, levantando:false,
      riesgoExtra:0, retBonus:0, gtmBonus:0, infraExtra:0, penalCap:0,
      incidentesPuesto:0, apuestasCompletadas:0, gastoPropio:{},
      acum:{ desc:0, cons:0, plat:0, fiab:0, crec:0 },
      eventosVistos:{}, hist:[], vivo:true, final:null,
      elenco:Mundo.elenco(), calor:mundo ? Mundo.calorSector(mundo, sec.id) : 0,
      eraId:mundo ? mundo.eraId : '', rivalNombre:mundo ? mundo.rival.nombre : ''
    };

    var LUPA_BASE = { apuestas:15, datapol:10, banco:8, biogen:6, saludgold:5 };
    e.lupaBase = LUPA_BASE[sec.id] || 0;
    e.lupa = e.lupaBase;

    for (i = 0; i < NECESIDADES.length; i++) e.cobertura[NECESIDADES[i].id] = 0;

    /* the company already ships with product built: the stage defines how much */
    var arranque = et.arq * 0.55 + 10;
    e.cobertura.core = arranque;
    e.cobertura.flujo = arranque * 0.7;
    e.cobertura.datos = arranque * 0.5;
    e.cobertura.integra = arranque * 0.3;
    e.cobertura.soporte = arranque * 0.3;
    e.cobertura.segur = arranque * 0.25;
    e.cobertura.escala = arranque * 0.4;

    for (i = 0; i < SEGMENTOS.length; i++) {
      var s = SEGMENTOS[i];
      e.tam[s.id] = Math.max(60, Math.round(s.tam * sec.escala));
      e.usuarios[s.id] = 0;
    }
    var sem = et.usuariosBase;
    e.usuarios.innov = e.tam.innov * Math.min(0.9, sem * 9);
    e.usuarios.visio = e.tam.visio * Math.min(0.6, sem * 4);
    e.usuarios.pragm = e.tam.pragm * Math.min(0.25, sem * 0.5);

    /* The company's profile defines its prioritization game:
       'grandes'  = a few bets dominate, the rest is worth little;
       'chicas'   = everything cheaper and evenly sized, nothing moves the needle alone;
       'incierto' = the estimates come with extra noise. */
    for (i = 0; i < APUESTAS.length; i++) {
      var a = APUESTAS[i];
      var f = a.senuelo ? rnd(0.03, 0.20) : rnd(0.15, 1.25);
      if (et.prima && et.prima.indexOf(a.nec) >= 0) f *= 1.3;
      else if (et.castiga && et.castiga.indexOf(a.nec) >= 0) f *= 0.5;
      var costo = a.costo;
      if (e.perfil === 'grandes') {
        f = a.senuelo ? f : (Math.random() < 0.28 ? rnd(1.2, 2.0) : rnd(0.1, 0.5));
        costo = Math.round(a.costo * 1.25);
      } else if (e.perfil === 'chicas') {
        f = a.senuelo ? f : rnd(0.4, 0.95);
        costo = Math.max(4, Math.round(a.costo * 0.7));
      }
      e.impactos[a.id] = Math.max(2, Math.round(a.imp * f));
      e.ruidos[a.id] = rnd(-1, 1) * (e.perfil === 'incierto' ? 1.6 : 1);
      /* no bet can be bigger than the ceiling: it always has to fit */
      e.costos[a.id] = Math.min(costo, e.techoPts);
    }
    /* the company made it here alive: its architecture holds what it already has,
       with little headroom. The headroom is yours to build. */
    var uIni = usuarios(e);
    if (uIni > 0) {
      var arqMin = 15 * Math.log(uIni / (400 * 0.72)) / Math.log(2);
      if (e.arquitectura < arqMin) e.arquitectura = Math.round(arqMin);
    }
    rellenarBacklog(e);

    e.mrr = calcularMrr(e);
    e.usuariosInicio = usuarios(e);
    e.usabilidadInicio = e.usabilidad;
    e.moralMin = e.moral;
    e.precioInicio = e.precio;
    e.mrrInicio = e.mrr;
    e.evidenciaInicio = e.evidencia;
    return e;
  }

  /* The backlog mixes the generic with the sector-specific: at a neobank the
     license IS the product; in silicon, the respin. */
  function rellenarBacklog(e) {
    var sec = sectorPorId(e.sectorId), pool = [], i, id;
    for (i = 0; i < sec.apuestas.length; i++) {
      id = sec.apuestas[i];
      if (!e.hechas[id] && !e.enVuelo[id] && e.backlog.indexOf(id) < 0) pool.push(id);
    }
    var propias = pool.length;
    for (i = 0; i < APUESTAS.length; i++) {
      id = APUESTAS[i].id;
      if (sec.apuestas.indexOf(id) >= 0) continue;
      if (esDeOtroSector(id, sec)) continue;
      if (!e.hechas[id] && !e.enVuelo[id] && e.backlog.indexOf(id) < 0) pool.push(id);
    }
    /* the sector's own bets go in first so the backlog feels like the trade */
    var i2 = 0;
    while (e.backlog.length < 8 && pool.length) {
      var k = (i2++ < propias && propias > 0) ? 0 : Math.floor(Math.random() * pool.length);
      e.backlog.push(pool[k]);
      pool.splice(k, 1);
      if (k === 0) propias--;
    }
  }

  function esDeOtroSector(id, sec) {
    for (var i = 0; i < SECTORES.length; i++) {
      if (SECTORES[i].id === sec.id) continue;
      if (SECTORES[i].apuestas.indexOf(id) >= 0) return true;
    }
    return false;
  }

  /* ---------------- readings ---------------- */

  function usuarios(e) {
    var t = 0;
    for (var i = 0; i < SEGMENTOS.length; i++) t += e.usuarios[SEGMENTOS[i].id] || 0;
    return Math.round(t);
  }

  function nomina(e) { return e.ing * SAL_ING + e.prod * SAL_PROD + e.gtm * SAL_GTM; }
  function capacidadSistema(e) { return 400 * Math.pow(2, e.arquitectura / 15); }
  function carga(e) { return usuarios(e) / capacidadSistema(e); }

  function infra(e) {
    var u = usuarios(e), sobre = Math.max(0, carga(e) - 1);
    return 1200 + u * 0.30 * (1 + sobre * 2) + (e.infraExtra || 0) + (e.capex || 0);
  }
  function burnMensual(e) { return nomina(e) + infra(e); }
  function runwayMeses(e) {
    var neto = burnMensual(e) - e.mrr;
    if (neto <= 0) return 99;
    return e.caja / neto;
  }
  function calcularMrr(e) {
    var m = 0, i;
    for (i = 0; i < SEGMENTOS.length; i++) {
      var s = SEGMENTOS[i];
      m += (e.usuarios[s.id] || 0) * e.precio * s.paga;
    }
    return Math.round(m);
  }

  function fit(e, segId) {
    var s = seg(segId), suma = 0, i;
    for (i = 0; i < s.requiere.length; i++) {
      suma += Math.min(1, (e.cobertura[s.requiere[i]] || 0) / COBERTURA_PLENA);
    }
    var base = suma / s.requiere.length;
    var usa = 0.55 + (e.usabilidad / 100) * 0.45;
    var fia = 1 - s.exigFiab * (1 - e.fiabPercibida / 100);
    return clamp(base * usa * fia, 0, 1);
  }
  function fitMax(e) {
    var m = 0;
    for (var i = 0; i < SEGMENTOS.length; i++) m = Math.max(m, fit(e, SEGMENTOS[i].id));
    return m;
  }
  function retencion(e, segId) {
    var s = seg(segId);
    var r = s.retBase + (e.retMod || 0) + fit(e, segId) * 0.13 + (e.retBonus || 0);
    r -= (1 - e.fiabPercibida / 100) * s.exigFiab * 0.25;
    return clamp(r, 0.35, 0.99);
  }
  function retencionMedia(e) {
    var tot = usuarios(e), acc = 0, i;
    if (!tot) return retencion(e, 'innov');
    for (i = 0; i < SEGMENTOS.length; i++) {
      var id = SEGMENTOS[i].id;
      acc += retencion(e, id) * (e.usuarios[id] || 0);
    }
    return acc / tot;
  }

  /* The gate to the big market. Each sector asks for something different and
     calls it something different, but it always works the same: without it,
     reach doesn't convert. */
  function requisitosGate(e) {
    var r = [], i, nec;
    r.push({ txt:'References from people like them',
             ok:(e.usuarios.visio || 0) >= e.tam.visio * 0.05 && fit(e, 'visio') >= 0.55 });
    for (i = 0; i < e.gateReqs.length; i++) {
      nec = null;
      for (var k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === e.gateReqs[i][0]) nec = NECESIDADES[k];
      r.push({ txt:nec.nombre + ' (' + e.gateReqs[i][1] + ')',
               ok:(e.cobertura[e.gateReqs[i][0]] || 0) >= e.gateReqs[i][1] });
    }
    r.push({ txt:'Reliable service (75)', ok:e.fiabPercibida >= 75 });
    return r;
  }
  function compuerta(e, segId) {
    if (segId !== 'pragm' && segId !== 'conse') return 1;
    var r = requisitosGate(e), ok = 0, i;
    for (i = 0; i < r.length; i++) if (r[i].ok) ok++;
    if (ok === r.length) return segId === 'conse' ? 0.8 : 1;
    return 0.05 + 0.10 * (ok / r.length);
  }
  function abierto(e, segId) {
    if (segId === 'innov') return true;
    if (segId === 'visio') return (e.usuarios.innov || 0) >= e.tam.innov * 0.15;
    if (segId === 'pragm') return (e.usuarios.visio || 0) >= e.tam.visio * 0.08;
    return (e.usuarios.pragm || 0) >= e.tam.pragm * 0.10;
  }

  /* ---------------- capacity ---------------- */

  function capacidad(e) {
    var base = e.ing * 20 + e.prod * 14;
    var fDeuda = 1 - (e.deuda / 100) * 0.55;
    var fMoral = 0.75 + (e.moral / 100) * 0.35;
    var fFoco = 0.85 + (clamp(e.foco, 0, 100) / 100) * 0.30;
    var tam = e.ing + e.prod;
    var umbral = (e.teamTopo ? 12 : 8) + Math.round(e.hab.liderazgo / 12);
    var fCarga = tam <= umbral ? 1 : Math.max(0.55, 1 - 0.05 * (tam - umbral));
    var fCd = e.cd ? 1.12 : 1;
    var p = base * fDeuda * fMoral * fFoco * fCarga * fCd;
    p -= e.rampa.length * 6;
    p -= (e.capacidadReservada > 0 ? 8 : 0);
    p -= (e.penalCap || 0);
    return Math.max(4, Math.round(p));
  }
  /* What answers to you. The rest of the organization keeps moving without
     asking your permission: that's what having little command means. */
  function capacidadPropia(e) { return Math.max(2, Math.round(capacidad(e) * e.mando)); }

  function desgloseCapacidad(e) {
    var base = e.ing * 20 + e.prod * 14, d = [];
    d.push({ k:'Org capacity', v:base });
    d.push({ k:'Under your command (' + Math.round(e.mando * 100) + '%)', v:capacidadPropia(e) });
    if (e.deuda > 0) d.push({ k:'Technical debt', v:-Math.round(base * (e.deuda/100) * 0.55), libro:'fowler' });
    if (e.rampa.length) d.push({ k:'Mentoring new hires', v:-e.rampa.length * 6, libro:'brooks' });
    if (e.ing + e.prod > (e.teamTopo ? 12 : 8) + Math.round(e.hab.liderazgo/12)) d.push({ k:'Cognitive load', v:'-', libro:'topologies' });
    if (e.moral < 60) d.push({ k:'Low morale', v:'-', libro:'grove' });
    if (e.foco < 45) d.push({ k:'Lack of focus', v:'-', libro:'grove' });
    if (e.cd) d.push({ k:'Continuous deployment', v:'+12%', libro:'accelerate' });
    if (e.penalCap) d.push({ k:'Incident hangover', v:-e.penalCap, libro:'sre' });
    if (e.capacidadReservada > 0) d.push({ k:'Custom-work commitment', v:-8, libro:'trap' });
    return d;
  }

  /* With low evidence this is noise wearing a number's face. And if you also
     interviewed badly, it's optimistic noise. Product skill helps. */
  function costoDe(e, id) {
    if (e.costos && e.costos[id]) return e.costos[id];
    var a = apuesta(id);
    return a ? a.costo : 10;
  }

  function comprometido(e) {
    var t = 0, id;
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) t += Math.max(0, costoDe(e, id) - e.enVuelo[id]);
    return t;
  }

  /* Disaggregated estimate for prioritizing: probability that the number
     is real (1-5), magnitude if it lands (1-5) and effort (S/M/L/XL). */
  function estimacionDetalle(e, id) {
    var est = estimacion(e, id);
    var incert = (100 - e.evidencia) / 100;
    var cert = 1 - Math.min(1, Math.abs(e.ruidos[id] || 0) * incert * 0.9 + (e.sesgo || 0) * 0.3 * incert);
    var prob = Math.max(1, Math.min(5, 1 + Math.round(cert * 4)));
    var mag = est >= 30 ? 5 : est >= 22 ? 4 : est >= 15 ? 3 : est >= 8 ? 2 : 1;
    var cst = costoDe(e, id);
    var esf = cst <= 10 ? 'S' : cst <= 15 ? 'M' : cst <= 21 ? 'L' : 'XL';
    return { est:est, prob:prob, mag:mag, esf:esf, costo:cst };
  }

  function estimacion(e, id) {
    var real = e.impactos[id];
    var incert = ((100 - e.evidencia) / 100) * (1 - e.hab.producto / 220);
    var sesgo = (e.sesgo || 0) * 20 * incert;
    return Math.max(1, Math.round(real + (e.ruidos[id] || 0) * 40 * incert + sesgo));
  }
  function confianza(e) {
    if (e.evidencia >= 70) return 'high';
    if (e.evidencia >= 40) return 'medium';
    return 'low';
  }

  /* ---------------- mandate and political capital ---------------- */

  function progresoMandato(e) {
    var m = mandatoPorId(e.mandatoId);
    if (!m) return 1;
    var meta = m.meta(e), val = m.valor(e);
    if (m.invertido) {
      if (m.id === 'estabilidad') return val <= meta ? 1 : Math.max(0, 1 - val * 0.34);
      var ini = e.deuda > meta ? Math.max(e.deuda, meta + 1) : meta;
      return clamp((ini - val) / Math.max(1, ini - meta), 0, 1.5);
    }
    if (m.id === 'abismo') return val;
    return clamp(val / Math.max(0.0001, meta), 0, 1.5);
  }

  function alineacion(e, plan) {
    var m = mandatoPorId(e.mandatoId), total = 0, alin = 0, k;
    var buckets = ['desc','cons','plat','fiab','crec'];
    for (k = 0; k < buckets.length; k++) {
      var v = plan[buckets[k]] || 0;
      total += v;
      if (m && m.alinea.indexOf(buckets[k]) >= 0) alin += v;
    }
    return total > 0 ? alin / total : 0.5;
  }

  /* ---------------- one-off actions ---------------- */

  function contratar(e, rol) { e.rampa.push({ rol:rol, listoEn:2 }); }

  function ronda(e, monto, pre, mult, participativa, pool, poolPre) {
    var post = pre + monto, fInv = monto / post;
    var f = e.capTable.fund, inv = e.capTable.inv, p = e.capTable.pool;
    if (poolPre !== false) {
      var resto = 1 - fInv - pool, suma = f + inv;
      if (suma <= 0) suma = 1;
      f = (f / suma) * resto; inv = (inv / suma) * resto + fInv; p = p + pool;
    } else {
      f = f * (1 - fInv) * (1 - pool);
      inv = inv * (1 - fInv) * (1 - pool) + fInv * (1 - pool);
      p = p * (1 - fInv) * (1 - pool) + pool;
    }
    e.capTable = { fund:f, inv:inv, pool:p };
    e.caja += monto;
    e.valoracion = post;
    e.preferencias.push({ monto:monto, mult:mult, part:!!participativa });
    e.rondas.push({ mes:e.mesPuesto, monto:monto, pre:pre, mult:mult, part:!!participativa, pool:pool });
    e.levantando = false;
  }

  function pivotar(e) {
    var i;
    for (i = 0; i < NECESIDADES.length; i++) {
      var id = NECESIDADES[i].id;
      e.cobertura[id] = Math.round(e.cobertura[id] * 0.45);
    }
    for (i = 0; i < APUESTAS.length; i++) {
      var a = APUESTAS[i];
      var f = a.senuelo ? rnd(0.03, 0.20) : rnd(0.15, 1.25);
      e.impactos[a.id] = Math.max(2, Math.round(a.imp * f));
      e.ruidos[a.id] = rnd(-1, 1);
      delete e.hechas[a.id];
    }
    e.backlog = []; e.enVuelo = {}; rellenarBacklog(e);
    e.moral -= 8;
    e.pivoteHecho = true;
    e.usuarios.visio = Math.round((e.usuarios.visio || 0) * 0.5);
  }

  /* ---------------- the month ---------------- */

  function simular(e, plan, mundo) {
    var log = [], i, id;
    if (mundo) { e.calor = Mundo.calorSector(mundo, e.sectorId); e.eraId = mundo.eraId; }

    /* 1. new hires: two months until they produce */
    var quedan = [];
    for (i = 0; i < e.rampa.length; i++) {
      e.rampa[i].listoEn--;
      if (e.rampa[i].listoEn <= 0) {
        if (e.rampa[i].rol === 'ing') e.ing++; else if (e.rampa[i].rol === 'prod') e.prod++; else e.gtm++;
        log.push({ tipo:'bueno', texto:'A new hire finished ramping up and is producing.', libro:'brooks' });
      } else quedan.push(e.rampa[i]);
    }
    e.rampa = quedan;
    e.penalCap = 0;

    /* 2. what's yours + what the rest of the organization does without you */
    var capTotal = capacidad(e), mio = capacidadPropia(e);
    var p = { desc:plan.desc||0, cons:plan.cons||0, plat:plan.plat||0, fiab:plan.fiab||0, crec:plan.crec||0 };
    var mioUsado = p.desc + p.cons + p.plat + p.fiab + p.crec;
    e.gastoPropio = { desc:plan.desc||0, cons:plan.cons||0, plat:plan.plat||0, fiab:plan.fiab||0, crec:plan.crec||0 };
    e.acum.desc += e.gastoPropio.desc; e.acum.cons += e.gastoPropio.cons;
    e.acum.plat += e.gastoPropio.plat; e.acum.fiab += e.gastoPropio.fiab;
    e.acum.crec += e.gastoPropio.crec;

    var resto = Math.max(0, capTotal - mio);
    if (resto > 0) {
      p.desc += Math.round(resto * 0.10);
      p.cons += Math.round(resto * 0.50);
      p.plat += Math.round(resto * 0.14);
      p.fiab += Math.round(resto * 0.10);
      p.crec += Math.round(resto * 0.16);
    }

    if (e.refactorFijo) { var mv = Math.round(capTotal * 0.2); p.cons = Math.max(0, p.cons - mv); p.plat += mv; }
    if (e.reescritura > 0) {
      p.plat += p.cons; p.cons = 0; e.reescritura--;
      e.deuda -= 14;
      log.push({ tipo:'neutro', texto:'Rewrite month: zero features. ' + e.reescritura + ' to go.', libro:'fowler' });
    }
    if (e.congelado) {
      var tope = Math.round(capTotal * 0.25);
      if (p.cons > tope) { p.fiab += p.cons - tope; p.cons = tope; }
      log.push({ tipo:'neutro', texto:'Error-budget freeze: almost nothing gets built.', libro:'sre' });
    }
    if (e.deudaPendiente) { e.deuda += e.deudaPendiente; e.deudaPendiente = 0; }

    /* 3. discovery */
    if (p.desc > 0) {
      var gan = p.desc * 1.1 * e.calidadDesc * (1 + e.hab.producto / 200);
      e.evidencia = clamp(e.evidencia + gan, 0, 100);
      for (id in e.ruidos) if (e.ruidos.hasOwnProperty(id)) e.ruidos[id] *= 0.88;
      e.usabilidad += p.desc * 0.14;
      if (e.calidadDesc < 0.6) log.push({ tipo:'malo', texto:'You interviewed asking for opinions. You got compliments, not data.', libro:'momtest' });
      else log.push({ tipo:'bueno', texto:'Discovery: evidence +' + Math.round(gan) + '.', libro:'torres' });
    }

    /* 4. build */
    var enVuelo = 0;
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) enVuelo++;
    var sel = plan.apuestas || [];
    var n = enVuelo + sel.length;
    if (plan.asig) {
      n = 0;
      var kk;
      for (kk in plan.asig) if (plan.asig.hasOwnProperty(kk) && plan.asig[kk] > 0) n++;
      if (!n) n = enVuelo + sel.length;
    }
    var wip = n > 2 ? Math.max(0.5, 1 - 0.15 * (n - 2)) : 1;
    if (n > 2) log.push({ tipo:'malo', texto:n + ' bets in parallel: context switching ate ' +
      Math.round((1 - wip) * 100) + '% of the effort.', libro:'grove' });
    /* project slots, Catan-style: only so many builds open at once */
    var abiertos = 0;
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) abiertos++;
    for (i = 0; i < sel.length; i++) {
      if (e.enVuelo[sel[i]] !== undefined) continue;
      if (abiertos >= e.slots) continue;
      abiertos++;
      e.enVuelo[sel[i]] = 0;
    }

    var lista = [];
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) lista.push(id);
    /* directed allocation: the player put points ON specific projects.
       The wider org's build effort helps whatever you prioritized, spread
       evenly across the projects that got any of your points. */
    var asig = plan.asig || null;
    var activos = [];
    if (asig) {
      for (i = 0; i < lista.length; i++) if ((asig[lista[i]] || 0) > 0) activos.push(lista[i]);
      if (!activos.length) activos = lista.slice();
    } else activos = lista.slice();
    var propio = 0;
    if (asig) for (id in asig) if (asig.hasOwnProperty(id)) propio += asig[id];
    var deOrg = Math.max(0, p.cons - (asig ? propio : 0));
    var porApuesta = activos.length ? (deOrg * wip) / activos.length : 0;
    for (i = 0; i < lista.length; i++) {
      id = lista[i];
      var empuje = (asig && activos.indexOf(id) >= 0 ? porApuesta : (asig ? 0 : porApuesta));
      if (asig) empuje += (asig[id] || 0) * wip;
      e.enVuelo[id] += empuje;
      var a = apuesta(id);
      if (e.enVuelo[id] >= costoDe(e, id)) {
        var esperado = estimacion(e, id);
        delete e.enVuelo[id];
        e.hechas[id] = true;
        e.apuestasCompletadas++;
        var real = e.impactos[id];
        e.cobertura[a.nec] = (e.cobertura[a.nec] || 0) + real;
        var idx = e.backlog.indexOf(id); if (idx >= 0) e.backlog.splice(idx, 1);
        /* every shipped project hands the company a permanent capability */
        var regalo = '';
        if (a.nec === 'escala') {
          e.arquitectura += real * 0.25;
          regalo = ' Grants: +' + Math.round(real * 0.25) + ' system capacity.';
        } else if (a.nec === 'datos') {
          e.evidencia = clamp(e.evidencia + 4, 0, 100);
          regalo = ' Grants: +4 evidence.';
        } else if (a.nec === 'flujo') {
          e.usabilidad = clamp(e.usabilidad + 3, 0, 100);
          regalo = ' Grants: +3 usability.';
        } else if (a.nec === 'soporte' || a.nec === 'segur' || a.nec === 'integra') {
          regalo = ' Grants: a tick toward the big-market gate.';
        }
        var frase = 'You shipped "' + a.n + '": real impact ' + real + ' (you expected ' + esperado + ').' + regalo;
        if (real < esperado * 0.55) {
          log.push({ tipo:'malo', texto:frase + ' You built without knowing.', libro:e.evidencia < 45 ? 'lean' : 'trap' });
        } else {
          log.push({ tipo:real >= esperado * 0.8 ? 'bueno' : 'malo', texto:frase, libro:'inspired' });
        }
      }
    }
    e.deuda += p.cons * 0.15 * (1 - e.hab.tecnologia / 180);
    if (e.fabrica) e.deuda += 2;

    /* 5. platform */
    if (p.plat > 0) {
      e.deuda -= p.plat * 0.55 * (1 + e.hab.tecnologia / 150);
      e.arquitectura += p.plat * 0.28;
    }
    e.deuda += 2.5;
    e.deuda = clamp(e.deuda, 0, 100);

    /* 6. reliability */
    var escudo = Math.min(0.30, p.fiab * 0.018);
    if (p.fiab > 0) {
      e.fiabPercibida = clamp(e.fiabPercibida + p.fiab * 0.45, 0, 100);
      e.presupuestoError = clamp(e.presupuestoError + p.fiab * 0.6, -50, 100);
    }

    /* 7. incidents: every sector breaks in its own way */
    var c = carga(e);
    var pInc = 0.05 + Math.max(0, c - 0.8) * 0.5 + e.deuda / 400 + (e.riesgoExtra || 0) - escudo - (e.cd ? 0.05 : 0);
    if (Math.random() < clamp(pInc, 0, 0.9)) resolverIncidente(e, log, c);
    e.riesgoExtra = (e.riesgoExtra || 0) * 0.5;

    /* 7b. the regulator's Heat: the dirtier you play, the harder they look.
       Decays slowly; with the Heat high come inspections, fines, and worse. */
    if (e.lupa > e.lupaBase) e.lupa = Math.max(e.lupaBase, e.lupa - 1);
    if (e.lupa > e.lupaMax) e.lupaMax = e.lupa;
    if (e.lupa >= 40) {
      var pIns = Math.pow(e.lupa / 100, 2) * 0.4 * (e.eraId === 'regulacion' ? 1.7 : 1);
      if (Math.random() < pIns) {
        var multa = Math.round(burnMensual(e) * rnd(0.8, 2.2));
        e.caja -= multa;
        e.moral -= 4;
        e.lupa = Math.max(e.lupaBase, e.lupa - 12);
        log.push({ tipo:'malo', texto:'Surprise inspection. They found enough: a ' +
          Math.round(multa / 1000) + 'k fine and a file that stays open.', libro:'hard' });
      }
    }

    /* 8. growth and churn */
    var mercado = 0;
    for (i = 0; i < SEGMENTOS.length; i++) mercado += e.tam[SEGMENTOS[i].id];
    var saturacion = 1 + usuarios(e) / (mercado * 0.14);
    var alcance = 35 * Math.pow(Math.max(0, p.crec), 0.75) * (1 + e.gtm * 0.25) *
                  (0.75 + e.marca / 220) * (1 + (e.gtmBonus || 0)) * e.cac *
                  (1 + e.hab.negocio / 150) / saturacion;
    if (mundo) alcance *= Mundo.modAlcance(mundo, e.sectorId);
    var boca = Math.min(usuarios(e) * 0.03 * e.viral,
                        usuarios(e) * fitMax(e) * 0.022 * e.viral * (0.6 + e.marca / 160));
    e.gtmBonus = 0;

    for (i = 0; i < SEGMENTOS.length; i++) {
      var sc = SEGMENTOS[i].id;
      e.usuarios[sc] = Math.max(0, (e.usuarios[sc] || 0) * retencion(e, sc));
    }
    var PESO = { innov:1.0, visio:1.1, pragm:1.25, conse:0.8 };
    var abiertos = [], suma = 0, bloqueado = 0;
    for (i = 0; i < SEGMENTOS.length; i++) {
      var sa = SEGMENTOS[i];
      if (!abierto(e, sa.id)) continue;
      var disp = Math.max(0, e.tam[sa.id] - (e.usuarios[sa.id] || 0)) / e.tam[sa.id];
      var w = PESO[sa.id] * disp;
      abiertos.push({ id:sa.id, w:w }); suma += w;
    }
    for (i = 0; i < abiertos.length; i++) {
      var sid = abiertos[i].id;
      var cuota = suma > 0 ? abiertos[i].w / suma : 0;
      var conv = fit(e, sid) * compuerta(e, sid) * (0.35 + (e.usabilidad / 100) * 0.65);
      if (sid === 'pragm' || sid === 'conse') conv *= (1 - e.competidor.atencion * e.competidor.fuerza * 0.6);
      var trafico = (alcance + boca) * cuota;
      if (compuerta(e, sid) < 0.5 && trafico > 80) bloqueado += trafico;
      e.usuarios[sid] += trafico * conv;
    }
    if (bloqueado > 120 && !e.gateRevelado) {
      log.push({ tipo:'malo', texto:'A lot of reach into the big market converted into nothing. It\'s not the price: it\'s ' +
        e.gateNombre.toLowerCase() + '.', libro:'chasm' });
      e.gateRevelado = true;
    }

    /* 9. money */
    e.mrr = calcularMrr(e);
    var gastoCrec = p.crec * 900;
    e.caja += e.mrr - burnMensual(e) - gastoCrec;

    /* 10. political capital: they measure you by the mandate, not by being right */
    var alin = alineacion(e, e.gastoPropio);
    var prog = progresoMandato(e);
    var esperado2 = (e.mesPuesto + 1) / e.meses;
    var dPol = (alin - 0.55) * 10 + (prog >= esperado2 ? 2 : -4) + e.hab.liderazgo / 50;
    if (e.penalCap) dPol -= 5;
    if (mioUsado < mio * 0.6) dPol -= 3;
    e.politico = clamp(e.politico + dPol, -20, 100);

    /* 10b. if you're not a founder, the company funds itself — and dilutes you */
    if (!e.esFundador && runwayMeses(e) < 5 && Math.random() < 0.35) {
      var extra = burnMensual(e) * 15;
      e.caja += extra;
      e.valoracion = Math.max(e.valoracion * 0.8, e.mrr * 12 * 7);
      e.dilucion = (e.dilucion || 1) * 0.78;
      log.push({ tipo:'neutro', texto:'The company closed a round to stay alive. Your equity just got diluted 22%.', libro:'deals' });
    } else if (!e.esFundador && runwayMeses(e) < 2) {
      log.push({ tipo:'malo', texto:'The cash is running out and nobody shows up willing to put in more.', libro:'lean' });
    }

    /* 11. end of month */
    if (e.capacidadReservada > 0) e.capacidadReservada--;
    e.moral = clamp(e.moral + (e.mrr > burnMensual(e) ? 2 : 0) + (e.empoderado ? 1 : 0) +
                    e.hab.liderazgo / 60 - 1.5, 0, 100);
    if (e.moral < (e.moralMin || 100)) e.moralMin = e.moral;
    e.foco = clamp(e.foco - 1.5, 0, 100);
    e.usabilidad = clamp(e.usabilidad + (e.cobertura.flujo || 0) * 0.02 - 0.6, 0, 100);
    e.marca = clamp(e.marca + (retencionMedia(e) > 0.9 ? 1.5 : -0.5), 0, 100);
    e.evidencia = clamp(e.evidencia - (e.cadenciaDesc ? 1.5 : 3.5), 0, 100);
    e.fiabPercibida = clamp(e.fiabPercibida + (e.arquitectura > carga(e) * 40 ? 1.5 : -1), 0, 100);
    if (e.competidor.atencion < 0.9) {
      var dAt = (e.usuarios.pragm > e.tam.pragm * 0.06 ? 0.05 : 0.012);
      if (mundo) dAt *= Mundo.modAtencionCompetencia(mundo, e.sectorId);
      e.competidor.atencion += dAt;
    }
    e.mesPuesto++;
    if (e.mesPuesto % 3 === 0) {
      e.presupuestoError = 100; e.congelado = false;
      log.push({ tipo:'neutro', texto:'New quarter: the error budget resets to 100.', libro:'sre' });
    }
    rellenarBacklog(e);

    /* 12. is the role over? */
    e.valoracion = Math.max(e.valoracion * 0.995, e.mrr * 12 * 6);
    if (e.imputado) { e.vivo = false; e.final = 'imputado'; }
    else if (e.ventaAcordada) { e.vivo = false; e.final = 'venta'; }
    else if (e.caja < 0) { e.vivo = false; e.final = 'quiebra'; }
    else if (e.politico < 0) { e.vivo = false; e.final = 'despido'; }
    else if (e.mesPuesto >= e.meses) { e.vivo = false; e.final = 'plazo'; }

    e.hist.push({ m:e.mesPuesto, u:usuarios(e), mrr:e.mrr, caja:Math.round(e.caja), pol:Math.round(e.politico) });
    return log;
  }

  function resolverIncidente(e, log, c) {
    e.incidentesPuesto++;
    e.penalCap = 8;
    var t = e.tipoIncidente, i;
    e.presupuestoError -= 38;
    e.moral -= 6;

    if (t === 'fraude') {
      var perdida = Math.max(30000, usuarios(e) * 12);
      e.caja -= perdida;
      e.fiabPercibida = clamp(e.fiabPercibida - 12, 0, 100);
      log.push({ tipo:'malo', texto:'Fraud wave: ' + Math.round(perdida/1000) + 'k gone, straight out of the margin.', libro:'sre' });
    } else if (t === 'escandalo') {
      e.marca = clamp(e.marca - 25, 0, 100);
      e.fiabPercibida = clamp(e.fiabPercibida - 15, 0, 100);
      e.cobertura.segur = Math.max(0, e.cobertura.segur - 10);
      for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.88;
      log.push({ tipo:'malo', texto:'A news outlet published how your data got used in a campaign. In this business that doesn\'t get forgotten.', libro:'sre' });
    } else if (t === 'granwin') {
      var agujero = Math.max(60000, e.mrr * 1.6);
      e.caja -= agujero;
      e.marca = clamp(e.marca - 8, 0, 100);
      e.lupa = clamp(e.lupa + 8, 0, 100);
      log.push({ tipo:'malo', texto:'A gambler found the hole in the bonus and drained ' +
        Math.round(agujero / 1000) + 'k before anyone looked. Then he went public about it.', libro:'sre' });
    } else if (t === 'clinico') {
      e.fiabPercibida = clamp(e.fiabPercibida - 25, 0, 100);
      e.marca = clamp(e.marca - 12, 0, 100);
      e.cobertura.segur = Math.max(0, e.cobertura.segur - 15);
      e.capacidadReservada = 2;
      log.push({ tipo:'malo', texto:'Adverse event with a patient: regulatory review and everything else on hold.', libro:'sre' });
    } else {
      e.fiabPercibida = clamp(e.fiabPercibida - 20, 0, 100);
      for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.95;
      log.push({ tipo:'malo',
        texto:c > 0.9 ? 'Outage: load blew past what your architecture can take.' : 'Production outage. The debt found you.',
        libro:c > 0.9 ? 'ddia' : 'fowler' });
    }
  }

  /* ---------------- exit (founder only) ---------------- */

  function cascada(e) {
    var mult = 3 + Math.min(3, retencionMedia(e) * 3) + (e.competidor.atencion < 0.4 ? 0.5 : 0);
    var salida = e.final === 'quiebra' ? 0 :
                 e.ventaAcordada ? e.ventaAcordada : Math.round(e.mrr * 12 * mult);
    var pref = 0, i, participa = false;
    for (i = 0; i < e.preferencias.length; i++) {
      pref += e.preferencias[i].monto * e.preferencias[i].mult;
      if (e.preferencias[i].part) participa = true;
    }
    var aInv = 0;
    if (e.preferencias.length) {
      if (participa) aInv = Math.min(salida, pref) + Math.max(0, salida - pref) * e.capTable.inv;
      else aInv = Math.max(Math.min(salida, pref), salida * e.capTable.inv);
    }
    var aFund = Math.max(0, salida - aInv) * (e.capTable.fund / Math.max(0.0001, e.capTable.fund + e.capTable.pool));
    return { salida:salida, mult:mult, aInv:Math.round(aInv), aFund:Math.round(aFund), pref:pref };
  }

  return {
    nuevoPuesto:nuevoPuesto, simular:simular,
    capacidad:capacidad, capacidadPropia:capacidadPropia, desgloseCapacidad:desgloseCapacidad,
    usuarios:usuarios, fit:fit, fitMax:fitMax, retencion:retencion, retencionMedia:retencionMedia,
    carga:carga, capacidadSistema:capacidadSistema, burnMensual:burnMensual, runwayMeses:runwayMeses,
    nomina:nomina, infra:infra, calcularMrr:calcularMrr,
    estimacion:estimacion, estimacionDetalle:estimacionDetalle, costoDe:costoDe, comprometido:comprometido, confianza:confianza, requisitosGate:requisitosGate, compuerta:compuerta,
    abierto:abierto, contratar:contratar, ronda:ronda, pivotar:pivotar,
    progresoMandato:progresoMandato, alineacion:alineacion, cascada:cascada,
    seg:seg, apuesta:apuesta
  };
})();
