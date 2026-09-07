/* Arnés de simulación. Corre carreras completas sin navegador contra el mismo
   núcleo que juega la gente (datos → motor → carrera; nunca toca la UI) y
   reporta qué tan difícil está el juego. Es la única forma honesta de tocar
   un número de balance: a ojo, todo parece razonable.

   El bot juega como juega la UI de verdad, y eso importa más de lo que parece:
   hay CUATRO estaciones (descubrir, plataforma, fiabilidad, crecimiento) y
   `construir` NO es una de ellas. Se construye asignando puntos a proyectos.
   Un bot que estaciona puntos en `cons` mide un juego que nadie juega.

     node sim.js [carreras]           todos los perfiles
     node sim.js 400 atiende          un perfil solo

   Perfiles:
     pasivo   no asigna un solo punto — el piso absoluto
     ignora   juega el mandato y no mira las contingencias
     atiende  igual, pero paga la contingencia antes que nada
     escala   como atiende, y además gasta político para destrabar firmas
     ciego    como atiende, pero no mira qué va antes de qué
     honra    como atiende, y siempre CUMPLE los compromisos del elenco
     declina  como atiende, y siempre LOS RECHAZA en el acto

   Hasta esta versión el arnés nunca disparaba dilemas: Motor.simular() corre
   solo, y los dilemas (momtest, contratar, los compromisos) viven en
   eventoAplicable()/elegirOpcion(), que sólo llamaba ui.js. Toda la
   calibración anterior — la banda de mandatos, el hueco de dependencias — se
   midió CON LOS DILEMAS APAGADOS. Ahora se disparan igual que en la partida
   real (mismo eventoAplicable, misma cadencia, mismo tope EVERGREEN), así que
   los números de esta versión no son comparables byte a byte con corridas
   anteriores: son más fieles, no más flojos.                                */

var fs = require('fs'), vm = require('vm'), path = require('path');
var D = __dirname + '/';
var ctx = { console:console, Math:Math, JSON:JSON, Date:Date };
vm.createContext(ctx);
['contenido.js','sectores.js','libros.js','mundo.js','motor.js','carrera.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(D + f, 'utf8'), ctx, { filename:f });
});

vm.runInContext(function () {
  function planDelMes(e, m, modo) {
    var cap = Motor.capacidadPropia(e);
    var plan = { apuestas:[], asig:{} };
    if (modo === 'pasivo') return plan;
    var queda = cap, i, id;

    /* 0. destrabar lo que espera una firma, mientras alcance el crédito. Se
       guarda un colchón de 50: por debajo de 45 al cierre no hay ascenso, así
       que quemar político hasta el fondo cambia un mes por una carrera. */
    if (modo === 'escala' && e.espera) {
      for (id in e.espera) if (e.espera.hasOwnProperty(id)) {
        if (e.politico - Motor.costoEscalar(e) < 50) break;
        Motor.escalar(e, id);
      }
    }

    /* 1. la contingencia primero: lo justo para llegar al vencimiento. Un
       compromiso que el bot decidió honrar entra con la misma urgencia — decir
       que sí y no financiarlo es peor que haber declinado, así que un jugador
       competente que acepta, prioriza. */
    if (modo !== 'ignora' && e.cont) {
      for (i = 0; i < e.cont.length; i++) {
        id = e.cont[i].id;
        var falta = Math.ceil(Motor.costoDe(e, id) - (e.enVuelo[id] || 0));
        var cuota = Math.min(queda, Math.max(0, Math.ceil(falta / Math.max(1, e.cont[i].restante))));
        plan.asig[id] = cuota; queda -= cuota;
      }
    }
    if (e.compromisos) {
      for (i = 0; i < e.compromisos.length; i++) {
        id = e.compromisos[i].id;
        var faltaP = Math.ceil(Motor.costoDe(e, id) - (e.enVuelo[id] || 0));
        var cuotaP = Math.min(queda, Math.max(0, Math.ceil(faltaP / Math.max(1, e.compromisos[i].restante))));
        plan.asig[id] = cuotaP; queda -= cuotaP;
      }
    }

    /* 2. Sin estaciones, lo que antes se estacionaba ahora se deja sin asignar:
       todo punto que no va a un proyecto lo toma la operación, que es la que
       mueve descubrimiento, plataforma, fiabilidad y crecimiento. Un mandato
       que no pide construir se juega dejando el mes libre. */
    if (m.alinea.indexOf('cons') < 0) queda = Math.floor(queda * 0.5);

    /* 3. el resto a proyectos: los que ya están en vuelo, después backlog nuevo.
       El bot que ignora no le pone un punto a la contingencia: la mira pasar. */
    var enVuelo = [];
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id) && plan.asig[id] === undefined) {
      if (modo === 'ignora' && Motor.esContingencia(id)) { plan.asig[id] = 0; continue; }
      if (Motor.enEspera(e, id)) { plan.asig[id] = 0; continue; }
      enVuelo.push(id);
    }
    for (i = 0; i < enVuelo.length && queda > 0; i++) {
      var f2 = Math.ceil(Motor.costoDe(e, enVuelo[i]) - e.enVuelo[enVuelo[i]]);
      var p2 = Math.max(0, Math.min(queda, f2));
      plan.asig[enVuelo[i]] = p2; queda -= p2;
    }
    var abiertos = 0;
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) abiertos++;
    /* Un jugador que lee el panel elige las iniciativas que empujan lo que su
       mandato pide. El bot hace lo mismo, o mide un juego más tonto que el que
       se juega: sin esto, "abre el gran mercado" salía 6% sólo porque el bot
       tomaba las primeras del backlog sin mirar qué necesidad cubrían. */
    /* Un solo criterio de orden, no dos sorts encadenados: el segundo pisaba
       al primero por completo y el bot dejaba de mirar la compuerta.
       Pesa lo que pesaría un jugador competente: primero lo que empuja tu
       mandato, y a igualdad de eso, lo que ya tiene su base construida —
       porque sin base rinde la mitad y deja 8 de deuda. */
    var gr = e.gateReqs || [], pide = {};
    if (m.id === 'abismo') for (i = 0; i < gr.length; i++) pide[gr[i][0]] = 1;
    function puntaje(id) {
      var ap = Motor.apuesta(id);
      return (ap && pide[ap.nec] ? 2 : 0) +
             (modo === 'ciego' || Motor.depPendiente(e, id) ? 0 : 1);
    }
    var orden = e.backlog.slice();
    orden.sort(function (a, b) { return puntaje(b) - puntaje(a); });
    for (i = 0; i < orden.length && queda > 0 && abiertos < e.slots; i++) {
      id = orden[i];
      if (plan.asig[id] !== undefined) continue;
      plan.apuestas.push(id);
      var p3 = Math.min(queda, Math.ceil(Motor.costoDe(e, id)));
      plan.asig[id] = p3; queda -= p3; abiertos++;
    }
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id) && plan.asig[id] === undefined) plan.asig[id] = 0;
    return plan;
  }

  /* expuesto sin var para que otros scripts de medición reusen el mismo bot */
  planMes = planDelMes;

  /* Política del bot frente a un compromiso: honrar (0) o declinar (1). Los
     perfiles 'honra'/'declina' fijan la respuesta para aislar el efecto de
     cada rama; el resto usa una heurística mínima — declinar si el político
     ya está flaco o si ya hay demasiado en vuelo, porque acumular compromisos
     sin resolver es la forma más rápida de quedarte sin capacidad Y sin
     crédito al mismo tiempo. */
  function decidirCompromiso(e, modo) {
    if (modo === 'honra') return 0;
    if (modo === 'declina') return 1;
    var activos = (e.compromisos ? e.compromisos.length : 0) + (e.cont ? e.cont.length : 0);
    if (e.politico < 40 || activos >= 2) return 1;
    return 0;
  }

  /* Reproduce lo que hace elegirOpcion() en ui.js, sin DOM: aplica la rama
     elegida (resolviendo el cara-o-ceca de las opciones con `prob`, igual que
     la integración intrínseca de "Tu llamada") y deja la marca de vista para
     que la cadencia/EVERGREEN de eventoAplicable funcione idéntica a la
     partida real. Para cualquier dilema que no sea un compromiso, la política
     es la más simple posible — la primera opción — porque lo que este arnés
     necesita es que el mes no quede libre de dilemas, no arbitrar CADA rama
     narrativa del juego. */
  function resolverDilemaBot(e, c, log, modo, stats) {
    var ev = eventoAplicable(e, c);
    if (!ev) return;
    e.eventosVistos[ev.id] = true;
    c.dilemasVistos[ev.id] = (c.dilemasVistos[ev.id] || 0) + 1;
    var esProm = ev.id.indexOf('prom_') === 0;
    var idx = esProm ? decidirCompromiso(e, modo) : 0;
    /* la decision YA se sabe por el indice elegido — no hace falta inferirla
       de lo que el `ef` haya escrito en el log, y menos inventar una entrada
       de log solo para que el arnes la lea (esa entrada la vería tambien el
       jugador real: casi se filtra un renglon vacio a producción por eso) */
    if (esProm) { if (idx === 0) stats.compHonrados++; else stats.compDeclinados++; }
    var op = ev.opciones[idx];
    var rama = (typeof op.prob === 'number') ? (Math.random() * 100 < op.prob ? op.ok : op.ko) : op;
    try { rama.ef(e, log); } catch (err) {}
  }

  jugar = function (modo) {
    var mundo = Mundo.nuevo(), c = Carrera.nueva('bot', 0, 'product');
    var out = { puestos:[], llegaron:0, cerradas:0, vencidas:0, trabas:0, entregas:0, sinBase:0,
                compHonrados:0, compDeclinados:0, compCumplidos:0, compVencidos:0, runwayMin:[], polMin:[] };
    while (c.puestos.length < Carrera.MAX_PUESTOS) {
      var of = Carrera.ofertas(c, mundo)[0];
      var e = Carrera.aceptar(c, of, mundo);
      var m = mandatoPorId(e.mandatoId), runMin = 999, polMin = 999;
      while (e.vivo) {
        var evLog = [];
        resolverDilemaBot(e, c, evLog, modo, out);
        var log = evLog.concat(Motor.simular(e, planDelMes(e, m, modo), mundo));
        for (var li = 0; li < log.length; li++) {
          /* cont:'cierra'/'vence' lo comparten contingencias Y compromisos —
             misma etiqueta, misma maquinaria de slot. Se distinguen por
             `promo`, que solo llevan las entradas de compromiso: sin este
             filtro, cerradas/vencidas contaba las dos cosas mezcladas y el
             porcentaje contra `llegaron` (que solo cuenta contingencias)
             podía pasarse de 100%. */
          if (log[li].cont === 'llega') out.llegaron++;
          else if (log[li].cont === 'cierra' && !log[li].promo) out.cerradas++;
          else if (log[li].cont === 'vence' && !log[li].promo) out.vencidas++;
          else if (log[li].visto === 'traba') out.trabas++;
          if (log[li].dato === 'sale') { out.entregas++; if (log[li].sinBase) out.sinBase++; }
          if (log[li].promo === 'cumple') out.compCumplidos++;
          else if (log[li].promo === 'vence') out.compVencidos++;
        }
        var rw = Motor.runwayMeses(e); if (rw < runMin) runMin = rw;
        if (e.politico < polMin) polMin = e.politico;
        Mundo.tick(mundo, 1);
      }
      var r = Carrera.cerrar(c, e, mundo);
      out.puestos.push({ mandato:e.mandatoId, etapa:e.etapa, cumplido:r.cumplido, promocion:r.promocion,
        final:e.final, prog:r.progreso, hechas:e.apuestasCompletadas });
      out.runwayMin.push(runMin);
      out.polMin.push(polMin);
      if (c.final) break;
    }
    out.boletin = Carrera.boletin(c);
    return out;
  };
}.toString().replace(/^function \(\) \{|\}$/g, ''), ctx);

var CARRERAS = parseInt(process.argv[2], 10) || 200;
var SOLO = process.argv[3];
var MODOS = SOLO ? [SOLO] : ['pasivo', 'ignora', 'ciego', 'atiende', 'escala'];

function pct(a, b) { return b ? (100 * a / b).toFixed(0) + '%' : '—'; }

MODOS.forEach(function (modo) {
  var n = 0, ok = 0, fin = {}, pat = 0, hechas = 0, lleg = 0, cer = 0, ven = 0, tra = 0, promo = 0, ent = 0, sb = 0;
  var compH = 0, compD = 0, compC = 0, compV = 0;
  var porCarrera = [], polMinAll = [];
  var porMandato = {}, runway = [];
  for (var i = 0; i < CARRERAS; i++) {
    var r = vm.runInContext('jugar("' + modo + '")', ctx);
    pat += r.boletin.patrimonio; lleg += r.llegaron; cer += r.cerradas; ven += r.vencidas; tra += r.trabas; ent += r.entregas; sb += r.sinBase;
    compH += r.compHonrados; compD += r.compDeclinados; compC += r.compCumplidos; compV += r.compVencidos;
    polMinAll = polMinAll.concat(r.polMin);
    runway = runway.concat(r.runwayMin);
    var okC = 0;
    for (var q = 0; q < r.puestos.length; q++) if (r.puestos[q].cumplido) okC++;
    porCarrera.push(r.puestos.length ? okC / r.puestos.length : 0);
    for (var j = 0; j < r.puestos.length; j++) {
      var p = r.puestos[j];
      n++; if (p.cumplido) ok++; if (p.promocion) promo++;
      hechas += p.hechas;
      fin[p.final] = (fin[p.final] || 0) + 1;
      var pm = porMandato[p.mandato] || (porMandato[p.mandato] = { n:0, ok:0 });
      pm.n++; if (p.cumplido) pm.ok++;
    }
  }
  runway.sort(function (a, b) { return a - b; });
  console.log('\n' + modo.toUpperCase() + '  (' + CARRERAS + ' carreras, ' + n + ' puestos)');
  /* La incertidumbre se calcula sobre CARRERAS, no sobre puestos: los ocho
     puestos de una carrera comparten habilidades, nivel y reputación, así que
     están correlacionados y contarlos como muestras independientes infla la
     precisión ~3x. Sin esta banda es fácil leer una diferencia de 5 puntos
     entre dos corridas como si fuera una señal, y no lo es. */
  var med = 0, k2;
  for (k2 = 0; k2 < porCarrera.length; k2++) med += porCarrera[k2];
  med = med / porCarrera.length;
  var va = 0;
  for (k2 = 0; k2 < porCarrera.length; k2++) va += Math.pow(porCarrera[k2] - med, 2);
  var sigma = Math.sqrt(va / Math.max(1, porCarrera.length - 1)) / Math.sqrt(porCarrera.length);
  console.log('  mandato cumplido  ' + pct(ok, n) + '  ±' + (196 * sigma).toFixed(1) + ' (95%)');
  console.log('  quiebra ' + pct(fin.quiebra || 0, n) + '   despido ' + pct(fin.despido || 0, n) +
              '   venta ' + pct(fin.venta || 0, n));
  console.log('  apuestas entregadas/puesto ' + (hechas / n).toFixed(1) +
              '   runway mínimo mediano ' + Math.round(runway[Math.floor(runway.length / 2)]) + ' meses');
  if (lleg) console.log('  contingencias/puesto ' + (lleg / n).toFixed(2) +
              '   cerradas ' + pct(cer, lleg) + '   vencidas ' + pct(ven, lleg));
  console.log('  firmas trabadas/puesto ' + (tra / n).toFixed(2) + '   ascensos ' + pct(promo, n));
  console.log('  entregas sin su base ' + pct(sb, ent) + ' (' + sb + ' de ' + ent + ')');
  if (compH + compD) console.log('  compromisos: ' + (compH + compD) + ' ofrecidos · honrados ' + pct(compH, compH + compD) +
    '   de los honrados, vencidos sin cumplir ' + pct(compV, compH) +
    '   de los declinados, ' + compD + ' resueltos en el acto');
  polMinAll.sort(function (a, b) { return a - b; });
  if (polMinAll.length) console.log('  político mínimo alcanzado — p10 ' + Math.round(polMinAll[Math.floor(polMinAll.length * 0.1)]) +
    '   mediana ' + Math.round(polMinAll[Math.floor(polMinAll.length * 0.5)]) +
    '   bajo 0 (riesgo de despido) ' + pct(polMinAll.filter(function (v) { return v < 0; }).length, polMinAll.length));
  console.log('  patrimonio medio $' + Math.round(pat / CARRERAS / 1000) + 'k');
  var linea = [];
  for (var k in porMandato) linea.push(k + ' ' + pct(porMandato[k].ok, porMandato[k].n));
  console.log('  por mandato: ' + linea.join(' · '));
});
