/* Valida la cadena observación → problema → hipótesis → iniciativa contra
   partidas reales, no contra la tabla escrita.

   Lo que se puede romper y este arnés atrapa:
     · una apuesta nueva sin `h`, que en pantalla deja la tarjeta sin hipótesis
     · una necesidad sin entrada en TEMAS, que deja un grupo sin encabezado
     · una submétrica de `obs` mal escrita, que muestra la observación vacía
     · un libro de TEMAS que no existe, o clasificado en otro paso de METODO
     · un corte de `problemas` inalcanzable: si en 8 sectores × 4 etapas el
       número nunca cae de ese lado, ese texto no lo lee nadie

       node validate-metodo.js [carreras]                                  */

var fs = require('fs'), vm = require('vm');
var D = __dirname + '/';
var ctx = { console:console, Math:Math, JSON:JSON, Date:Date };
vm.createContext(ctx);
['contenido.js','sectores.js','libros.js','mundo.js','motor.js','carrera.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(D + f, 'utf8'), ctx, { filename:f });
});
var Motor = ctx.Motor, Carrera = ctx.Carrera, Mundo = ctx.Mundo;

var errores = [], avisos = [];
function err(t) { errores.push(t); }

/* ---- 1. estático: la tabla contra sí misma ---- */
var necs = ctx.NECESIDADES.map(function (n) { return n.id; });
var libros = {}; ctx.LIBROS.forEach(function (l) { libros[l.id] = l; });
var subsValidas = {};
ctx.APUESTAS.forEach(function (a) {
  for (var k in a.impactoSubmetricas || {}) subsValidas[k] = 1;
});

necs.forEach(function (n) {
  var t = ctx.TEMAS[n];
  if (!t) return err('TEMAS: falta la necesidad ' + n);
  if (!t.obs || !t.obs.length) err('TEMAS.' + n + ': sin submétricas observadas');
  if (!t.sano) err('TEMAS.' + n + ': sin texto para el caso sano');
  /* La historia cuelga del corte, no del tema: sin problema no hay escena. */
  (t.problemas || []).forEach(function (pr, i) {
    if (!pr.h) err('TEMAS.' + n + '.problemas[' + i + ']: sin historia de usuario');
    else if (pr.h.length > 165) avisos.push('TEMAS.' + n + '.problemas[' + i + '].h: ' + pr.h.length +
      ' caracteres — la escena entra en dos líneas, no en tres');
  });
  if (t.historia) err('TEMAS.' + n + ': `historia` a nivel de tema — va en cada corte, o contradice al texto sano');
  var pasos = { obs:'observacion', prob:'problema', hip:'hipotesis' };
  for (var p in pasos) {
    var lid = t.libros && t.libros[p];
    if (!lid) { err('TEMAS.' + n + ': sin libro para el paso ' + p); continue; }
    if (!libros[lid]) err('TEMAS.' + n + '.' + p + ': el libro ' + lid + ' no existe');
    else if (ctx.METODO[lid] !== pasos[p]) {
      err('TEMAS.' + n + '.' + p + ': ' + lid + ' está clasificado como ' +
          (ctx.METODO[lid] || 'ningún paso') + ', no como ' + pasos[p]);
    }
  }
  (t.problemas || []).forEach(function (pr, i) {
    if (pr.bajo === undefined && pr.alto === undefined) err('TEMAS.' + n + '.problemas[' + i + ']: sin corte');
    if (!/\{v\}|\{c\}/.test(pr.t)) avisos.push('TEMAS.' + n + '.problemas[' + i + ']: el texto no usa el número observado');
    /* {v} llega ya formateado con su unidad: repetirla al lado da "99.5%%". */
    if (/\{v\}\s*(%|días|ms|min)/.test(pr.t)) err('TEMAS.' + n + '.problemas[' + i +
      ']: el texto repite la unidad después de {v} — fmtSub ya la pone');
  });
});
Object.keys(ctx.TEMAS).forEach(function (t) {
  if (necs.indexOf(t) < 0) err('TEMAS: ' + t + ' no es una necesidad');
});
Object.keys(ctx.METODO).forEach(function (id) {
  if (!libros[id]) err('METODO: la ficha ' + id + ' no existe en LIBROS');
});
ctx.METODO_PASOS.forEach(function (p) {
  if (!ctx.librosDelPaso(p.id).length) err('METODO: el paso ' + p.id + ' no tiene ninguna ficha');
});

/* La frontera de Olsen, verificable: el problem space no puede nombrar lo que
   se va a construir. Si el problema o la historia mencionan una solución, la
   discusión de abajo ya viene contaminada y las iniciativas dejan de competir
   de igual a igual.

   Se busca el NOMBRE COMPLETO de una apuesta dentro del texto. La primera
   versión de este chequeo comparaba palabra por palabra y daba 7 falsos
   positivos y cero aciertos: marcaba "primer" (por "Tape-out del primer
   silicio"), "herramientas" (por "Herramientas para vendedores") y "compra"
   (por "Reseñas y garantía de compra"), que son vocabulario legítimo del
   problema. Nombrar una solución es escribir su nombre, no compartir una
   palabra con ella. */
var nombres = ctx.APUESTAS.map(function (a) { return a.n.toLowerCase(); });
function normal(t) { return (' ' + t.toLowerCase() + ' ').replace(/\s+/g, ' '); }
necs.forEach(function (n) {
  var t = ctx.TEMAS[n];
  var textos = [t.sano].concat((t.problemas || []).map(function (p) { return p.t; }))
                       .concat((t.problemas || []).map(function (p) { return p.h; }));
  textos.forEach(function (tx) {
    if (!tx) return;
    var plano = normal(tx);
    nombres.forEach(function (nom) {
      if (plano.indexOf(nom) >= 0) {
        err('TEMAS.' + n + ': el problem space nombra la solución "' + nom +
            '" — describir el problema sin la solución adentro');
      }
    });
  });
});

/* toda apuesta escrita a mano necesita hipótesis */
var todas = ctx.APUESTAS.slice();
for (var k in ctx.APUESTAS_SIGUE) todas.push(ctx.APUESTAS_SIGUE[k]);
todas.forEach(function (a) {
  if (!a.h) err('APUESTA ' + a.id + ': sin hipótesis (`h`)');
  else {
    if (/^[A-ZÁÉÍÓÚÑ]/.test(a.h)) err('APUESTA ' + a.id + ': la hipótesis va dentro de "Si …," — sin mayúscula inicial');
    if (/\.$/.test(a.h)) err('APUESTA ' + a.id + ': la hipótesis va dentro de "Si …," — sin punto final');
    if (a.h.length > 110) avisos.push('APUESTA ' + a.id + ': hipótesis de ' + a.h.length + ' caracteres, entra en dos líneas');
  }
  if (necs.indexOf(a.nec) < 0) err('APUESTA ' + a.id + ': necesidad desconocida ' + a.nec);
});

/* ---- 2. dinámico: contra partidas de verdad ---- */
var CARRERAS = parseInt(process.argv[2], 10) || 40;
var vistos = {}, cortesUsados = {}, gruposSinObs = 0, tarjetasSinH = 0, tarjetas = 0;
necs.forEach(function (n) { cortesUsados[n] = (ctx.TEMAS[n].problemas || []).map(function () { return 0; }).concat([0]); });

function mirarBacklog(e) {
  var porNec = {};
  (e.backlog || []).forEach(function (id) {
    var a = Motor.apuesta(id);
    if (!a) return;
    tarjetas++;
    if (!a.h) { tarjetasSinH++; vistos['sin h: ' + id] = 1; }
    (porNec[a.nec] = porNec[a.nec] || []).push(id);
  });
  Object.keys(porNec).forEach(function (n) {
    var t = ctx.TEMAS[n];
    if (!t) { gruposSinObs++; vistos['sin tema: ' + n] = 1; return; }
    var hayObs = t.obs.some(function (k) { return e.submetricas && e.submetricas[k] !== undefined; });
    if (!hayObs) { gruposSinObs++; vistos['obs vacía: ' + n] = 1; }
    var disparo = -1;
    for (var i = 0; i < t.problemas.length; i++) {
      var pr = t.problemas[i], v = e.submetricas ? e.submetricas[pr.k] : undefined;
      if (v === undefined) { vistos['submétrica inexistente: ' + n + '/' + pr.k] = 1; continue; }
      if ((pr.bajo !== undefined && v < pr.bajo) || (pr.alto !== undefined && v > pr.alto)) { disparo = i; break; }
    }
    cortesUsados[n][disparo < 0 ? t.problemas.length : disparo]++;
  });
}

/* El bot construye. Importa: con el plan vacío las submétricas se quedan
   clavadas en su base y todos los cortes miden un juego que nadie juega —
   fue exactamente el error que este arnés encontró la primera vez. */
function planBot(e) {
  var cap = Motor.capacidadPropia(e), p = { apuestas:[], asig:{} }, i = 0, puestos = 0;
  while (cap > 0 && i < e.backlog.length && puestos < e.slots) {
    var id = e.backlog[i++], pts = Math.min(cap, Math.ceil(Motor.costoDe(e, id) / 2));
    if (pts <= 0) break;
    p.apuestas.push(id); p.asig[id] = pts; cap -= pts; puestos++;
  }
  return p;
}

for (var c1 = 0; c1 < CARRERAS; c1++) {
  var mundo = Mundo.nuevo(), c = Carrera.nueva('bot', 0, 'product');
  while (c.puestos.length < Carrera.MAX_PUESTOS) {
    var of = Carrera.ofertas(c, mundo)[0];
    var e = Carrera.aceptar(c, of, mundo);
    while (e.vivo) {
      Motor.asegurarBacklog(e);
      mirarBacklog(e);
      Motor.simular(e, planBot(e), mundo);
      Mundo.tick(mundo, 1);
    }
    Carrera.cerrar(c, e, mundo);
  }
}

Object.keys(vistos).forEach(function (v) { err('en partida — ' + v); });
/* "Texto muerto" es una pregunta estadística, no binaria: con pocas carreras
   un corte legítimamente raro sale en cero y el aviso es ruido. Se mide la
   frecuencia contra el total de veces que ese tema apareció, y por debajo del
   1% se considera que nadie lo lee. Si la muestra es chica para afirmarlo, se
   dice eso en vez de acusar. */
var MIN_FRAC = 0.01;
necs.forEach(function (n) {
  var t = ctx.TEMAS[n], u = cortesUsados[n], total = 0, i;
  for (i = 0; i < u.length; i++) total += u[i];
  if (!total) { avisos.push('TEMAS.' + n + ' no apareció en ninguna partida simulada'); return; }
  var minEsperado = 1 / MIN_FRAC;
  for (i = 0; i < u.length; i++) {
    var quien = i < t.problemas.length ? 'problemas[' + i + '] (' + t.problemas[i].k + ')' : 'sano';
    if (u[i] / total >= MIN_FRAC) continue;
    if (total < minEsperado) avisos.push('TEMAS.' + n + '.' + quien + ': ' + u[i] + ' de ' + total +
      ' — muestra corta para juzgarlo, corré más carreras');
    else avisos.push('TEMAS.' + n + '.' + quien + ': ' + u[i] + ' de ' + total +
      ' (' + (u[i] / total * 100).toFixed(1) + '%) — ese texto prácticamente no lo lee nadie');
  }
});

console.log('Carreras simuladas: ' + CARRERAS + ' · tarjetas vistas: ' + tarjetas);
console.log('Cortes de problema disparados por tema (último = sano):');
necs.forEach(function (n) { console.log('  ' + n + ': ' + cortesUsados[n].join(' / ')); });
if (avisos.length) { console.log('\nAvisos:'); avisos.forEach(function (a) { console.log('  · ' + a); }); }
if (errores.length) {
  console.log('\nERRORES (' + errores.length + '):');
  errores.forEach(function (a) { console.log('  ✗ ' + a); });
  process.exit(1);
}
console.log('\nTodo bien: la cadena cierra en todas las partidas simuladas.');
