/* Test de humo: corre en CI antes de cada merge a main.
   No prueba el balance del juego — prueba que nada este roto de forma obvia:
   que los modulos carguen, que la superficie publica siga ahi, que el servidor
   levante y que no vuelva el ?v=N que hacia conflictar todos los PR.
   Sin dependencias: node test/humo.js */
'use strict';

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var http = require('http');
var spawn = require('child_process').spawn;

var RAIZ = path.join(__dirname, '..');
var fallos = 0, pruebas = 0;

function ok(cond, desc) {
  pruebas++;
  if (cond) { console.log('  ok    ' + desc); }
  else { fallos++; console.log('  FALLA ' + desc); }
}

/* ---------- 1. los modulos sin DOM cargan en node ---------- */
console.log('\nModulos (sin DOM)');
var SIN_DOM = ['libros', 'sectores', 'mundo', 'contenido', 'motor', 'carrera'];
var ctx = {
  console: console, Math: Math, Date: Date, JSON: JSON, parseInt: parseInt,
  parseFloat: parseFloat, isNaN: isNaN, Object: Object, Array: Array,
  String: String, Number: Number, RegExp: RegExp, Error: Error
};
vm.createContext(ctx);
SIN_DOM.forEach(function (f) {
  var err = null;
  try { vm.runInContext(fs.readFileSync(path.join(RAIZ, f + '.js'), 'utf8'), ctx, { filename: f + '.js' }); }
  catch (e) { err = e; }
  ok(!err, f + '.js carga' + (err ? ' — ' + err.message : ''));
});

/* ---------- 2. la superficie publica sigue existiendo ---------- */
console.log('\nSuperficie publica');
[['LIBROS', 50], ['SECTORES', 5], ['EMPRESAS', 10], ['ESCALAFON', 8],
 ['MANDATOS', 3], ['APUESTAS', 20], ['EVENTOS', 20]].forEach(function (par) {
  var v = ctx[par[0]];
  ok(v && v.length >= par[1], par[0] + ' tiene >= ' + par[1] + ' items (' + (v ? v.length : 0) + ')');
});
[['Mundo', ['nuevo', 'tick', 'era']],
 ['Motor', ['nuevoPuesto', 'simular', 'fit']],
 ['Carrera', ['nueva', 'ofertas', 'aceptar', 'cerrar']]].forEach(function (par) {
  var m = ctx[par[0]];
  ok(!!m, par[0] + ' existe');
  if (m) par[1].forEach(function (fn) {
    ok(typeof m[fn] === 'function', par[0] + '.' + fn + '() existe');
  });
});

/* ---------- 3. sintaxis de los modulos con DOM ---------- */
console.log('\nSintaxis (modulos con DOM)');
['ui', 'ranking', 'logros', 'server'].forEach(function (f) {
  var err = null;
  try { new vm.Script(fs.readFileSync(path.join(RAIZ, f + '.js'), 'utf8'), { filename: f + '.js' }); }
  catch (e) { err = e; }
  ok(!err, f + '.js parsea' + (err ? ' — ' + err.message : ''));
});

/* ---------- 4. el conflicto que no debe volver ---------- */
console.log('\nHigiene del repo');
var indice = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
ok(indice.indexOf('?v=') === -1,
   'index.html sin ?v=N (el cache lo maneja el servidor con ETag)');

var refs = indice.match(/(?:src|href)="([^"]+\.(?:js|css))"/g) || [];
refs.forEach(function (r) {
  var f = r.replace(/^(?:src|href)="/, '').replace(/"$/, '');
  ok(fs.existsSync(path.join(RAIZ, f)), 'index.html referencia ' + f + ' y existe');
});

/* ---------- 5. el servidor levanta y responde ---------- */
console.log('\nServidor');
var PUERTO = 3987;
var hijo = spawn(process.execPath, [path.join(RAIZ, 'server.js')], {
  env: Object.assign({}, process.env, { PORT: String(PUERTO), RANKING_DIR: require('os').tmpdir() }),
  stdio: ['ignore', 'pipe', 'pipe']
});

function pedir(ruta, cabeceras, cb) {
  http.get({ host: '127.0.0.1', port: PUERTO, path: ruta, headers: cabeceras || {} }, function (r) {
    var cuerpo = '';
    r.on('data', function (c) { cuerpo += c; });
    r.on('end', function () { cb(null, r, cuerpo); });
  }).on('error', function (e) { cb(e); });
}

function esperar(intentos, cb) {
  pedir('/', null, function (e) {
    if (!e) return cb();
    if (intentos <= 0) return cb(new Error('el servidor no levanto'));
    setTimeout(function () { esperar(intentos - 1, cb); }, 200);
  });
}

function terminar() {
  try { hijo.kill(); } catch (e) {}
  console.log('\n' + (fallos ? 'FALLARON ' + fallos + ' de ' + pruebas : 'Todo bien: ' + pruebas + ' pruebas') + '\n');
  process.exit(fallos ? 1 : 0);
}

esperar(25, function (e) {
  if (e) { ok(false, e.message); return terminar(); }
  pedir('/', null, function (e1, r1) {
    ok(!e1 && r1.statusCode === 200, 'GET / responde 200');
    pedir('/ui.js', null, function (e2, r2) {
      ok(!e2 && r2.statusCode === 200, 'GET /ui.js responde 200');
      ok(!!(r2 && r2.headers.etag), 'ui.js trae ETag');
      ok(r2 && r2.headers['cache-control'] === 'no-cache', 'ui.js pide revalidar');
      pedir('/ui.js', { 'If-None-Match': r2.headers.etag }, function (e3, r3) {
        ok(!e3 && r3.statusCode === 304, 'ui.js revalidado responde 304');
        pedir('/api/ranking', null, function (e4, r4, c4) {
          ok(!e4 && r4.statusCode === 200, 'GET /api/ranking responde 200');
          var j = null;
          try { j = JSON.parse(c4); } catch (err) {}
          ok(!!j, '/api/ranking devuelve JSON valido');
          pedir('/../package.json', null, function (e5, r5) {
            ok(!e5 && r5.statusCode !== 200, 'no se puede salir de la carpeta (traversal)');
            terminar();
          });
        });
      });
    });
  });
});
