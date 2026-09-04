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
     ciego    como atiende, pero no mira qué va antes de qué                */

var fs = require('fs'), vm = require('vm'), path = require('path');
var D = __dirname + '/';
var ctx = { console:console, Math:Math, JSON:JSON, Date:Date };
vm.createContext(ctx);
['contenido.js','sectores.js','libros.js','mundo.js','motor.js','carrera.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(D + f, 'utf8'), ctx, { filename:f });
});

vm.runInContext(function () {
  /* las estaciones que la UI expone de verdad, y la palanca que cada una pide */
  var ESTACIONES = ['desc', 'plat', 'fiab', 'crec'];

  function planDelMes(e, m, modo) {
    var cap = Motor.capacidadPropia(e);
    var plan = { desc:0, plat:0, fiab:0, crec:0, apuestas:[], asig:{} };
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

    /* 1. la contingencia primero: lo justo para llegar al vencimiento */
    if (modo !== 'ignora' && e.cont) {
      for (i = 0; i < e.cont.length; i++) {
        id = e.cont[i].id;
        var falta = Math.ceil(Motor.costoDe(e, id) - (e.enVuelo[id] || 0));
        var cuota = Math.min(queda, Math.max(0, Math.ceil(falta / Math.max(1, e.cont[i].restante))));
        plan.asig[id] = cuota; queda -= cuota;
      }
    }

    /* 2. las estaciones del mandato que el rol tiene abiertas */
    var est = [];
    for (i = 0; i < m.alinea.length; i++) {
      if (ESTACIONES.indexOf(m.alinea[i]) >= 0 && e.palancas.indexOf(m.alinea[i]) >= 0) est.push(m.alinea[i]);
    }
    /* si el mandato pide construir, la mitad del mes va a proyectos */
    var quiereCons = m.alinea.indexOf('cons') >= 0;
    var paraEst = quiereCons ? Math.floor(queda * 0.5) : queda;
    if (est.length) {
      var por = Math.floor(paraEst / est.length);
      for (i = 0; i < est.length; i++) { plan[est[i]] = por; queda -= por; }
    }

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

  jugar = function (modo) {
    var mundo = Mundo.nuevo(), c = Carrera.nueva('bot', 0, 'product');
    var out = { puestos:[], llegaron:0, cerradas:0, vencidas:0, trabas:0, runwayMin:[] };
    while (c.puestos.length < Carrera.MAX_PUESTOS) {
      var of = Carrera.ofertas(c, mundo)[0];
      var e = Carrera.aceptar(c, of, mundo);
      var m = mandatoPorId(e.mandatoId), runMin = 999;
      while (e.vivo) {
        var log = Motor.simular(e, planDelMes(e, m, modo), mundo);
        for (var li = 0; li < log.length; li++) {
          if (log[li].cont === 'llega') out.llegaron++;
          else if (log[li].cont === 'cierra') out.cerradas++;
          else if (log[li].cont === 'vence') out.vencidas++;
          else if (log[li].visto === 'traba') out.trabas++;
        }
        var rw = Motor.runwayMeses(e); if (rw < runMin) runMin = rw;
        Mundo.tick(mundo, 1);
      }
      var r = Carrera.cerrar(c, e, mundo);
      out.puestos.push({ mandato:e.mandatoId, etapa:e.etapa, cumplido:r.cumplido, promocion:r.promocion,
        final:e.final, prog:r.progreso, hechas:e.apuestasCompletadas });
      out.runwayMin.push(runMin);
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
  var n = 0, ok = 0, fin = {}, pat = 0, hechas = 0, lleg = 0, cer = 0, ven = 0, tra = 0, promo = 0;
  var porMandato = {}, runway = [];
  for (var i = 0; i < CARRERAS; i++) {
    var r = vm.runInContext('jugar("' + modo + '")', ctx);
    pat += r.boletin.patrimonio; lleg += r.llegaron; cer += r.cerradas; ven += r.vencidas; tra += r.trabas;
    runway = runway.concat(r.runwayMin);
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
  console.log('  mandato cumplido  ' + pct(ok, n));
  console.log('  quiebra ' + pct(fin.quiebra || 0, n) + '   despido ' + pct(fin.despido || 0, n) +
              '   venta ' + pct(fin.venta || 0, n));
  console.log('  apuestas entregadas/puesto ' + (hechas / n).toFixed(1) +
              '   runway mínimo mediano ' + Math.round(runway[Math.floor(runway.length / 2)]) + ' meses');
  if (lleg) console.log('  contingencias/puesto ' + (lleg / n).toFixed(2) +
              '   cerradas ' + pct(cer, lleg) + '   vencidas ' + pct(ven, lleg));
  console.log('  firmas trabadas/puesto ' + (tra / n).toFixed(2) + '   ascensos ' + pct(promo, n));
  console.log('  patrimonio medio $' + Math.round(pat / CARRERAS / 1000) + 'k');
  var linea = [];
  for (var k in porMandato) linea.push(k + ' ' + pct(porMandato[k].ok, porMandato[k].n));
  console.log('  por mandato: ' + linea.join(' · '));
});
