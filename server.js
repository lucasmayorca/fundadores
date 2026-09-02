// Servidor mínimo para Railway. Cero dependencias.
// En local el juego lo sigue sirviendo el servidor del panel; este archivo solo
// corre en el deploy — por eso /api/perfil y el ranking público viven aquí.
// El juego también le habla a esta API cross-origin desde la LAN.
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');

var ROOT = __dirname;
var PORT = process.env.PORT || 3000;

var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

/* ================= RANKING PÚBLICO (Salón de la Fama) =================
   Un archivo JSON en un volumen de Railway (/data). Sin el volumen igual
   funciona, pero se resetea en cada deploy — el log de arranque dice cuál
   te tocó. Todo lo que manda el cliente es no confiable: acotar números,
   listas blancas de strings, y escapar nombres al renderizar. */

var RANK_DIR = process.env.RANKING_DIR ||
  (fs.existsSync('/data') ? '/data' : ROOT);
var RANK_FILE = path.join(RANK_DIR, 'ranking.json');
var MAX_CARRERAS = 4000;

var DB = { carreras: [] };
try {
  DB = JSON.parse(fs.readFileSync(RANK_FILE, 'utf8'));
  if (!DB || !Array.isArray(DB.carreras)) DB = { carreras: [] };
} catch (e) { DB = { carreras: [] }; }

var guardarTimer = null;
function guardarRanking() {
  if (guardarTimer) return;
  guardarTimer = setTimeout(function () {
    guardarTimer = null;
    var tmp = RANK_FILE + '.tmp';
    fs.writeFile(tmp, JSON.stringify(DB), function (err) {
      if (err) return console.error('ranking save failed:', err.message);
      fs.rename(tmp, RANK_FILE, function (err2) {
        if (err2) console.error('ranking rename failed:', err2.message);
      });
    });
  }, 1500);
}

/* Semana ISO, p.ej. "2026-W36". La misma función viaja en el cliente. */
function semanaISO(d) {
  d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  var dia = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dia);
  var a = d.getUTCFullYear();
  var inicio = new Date(Date.UTC(a, 0, 1));
  var w = Math.ceil((((d - inicio) / 86400000) + 1) / 7);
  return a + '-W' + (w < 10 ? '0' + w : w);
}
function semanaAnterior() {
  return semanaISO(new Date(Date.now() - 7 * 86400000));
}

function num(v, a, b) {
  v = Number(v);
  if (isNaN(v) || !isFinite(v)) return null;
  return v < a || v > b ? null : v;
}
function ent(v, a, b) {
  v = num(v, a, b);
  return v === null ? null : Math.round(v);
}
function limpiarNombre(s) {
  if (typeof s !== 'string') return 'Anónimo';
  s = s.replace(/[<>&"']/g, '').replace(/[\x00-\x1f\x7f]/g, ' ').replace(/\s+/g, ' ').trim();
  /* anonimiza tanto el default viejo ('you') como el nuevo ('tú') */
  if (!s || s.toLowerCase() === 'you' || s.toLowerCase() === 'tú') return 'Anónimo';
  return s.slice(0, 40);
}

function validarCarrera(b) {
  if (!b || typeof b !== 'object') return null;
  var token = typeof b.token === 'string' && /^[a-z0-9]{8,48}$/.test(b.token) ? b.token : null;
  if (!token) return null;
  var id = typeof b.id === 'string' && /^[a-z0-9\-]{8,80}$/.test(b.id) ? b.id : token + '-' + Date.now();
  var puestos = ent(b.puestos, 1, 10);
  var anios = num(b.anios, 0.2, 30);
  var patrimonio = ent(b.patrimonio, 0, 500000000);
  var nivel = ent(b.nivel, 0, 7);
  if (puestos === null || anios === null || patrimonio === null || nivel === null) return null;
  var cumplidos = ent(b.cumplidos, 0, puestos); if (cumplidos === null) cumplidos = 0;
  var despidos = ent(b.despidos, 0, puestos); if (despidos === null) despidos = 0;
  var racha = ent(b.racha, 0, puestos); if (racha === null) racha = 0;
  var logros = ent(b.logros, 0, 40); if (logros === null) logros = 0;
  var reputacion = ent(b.reputacion, 0, 100); if (reputacion === null) reputacion = 0;
  var faccion = b.faccion === 'growth' || b.faccion === 'craft' ? b.faccion : null;
  var semana = null;
  if (typeof b.semana === 'string' && /^\d{4}-W\d{2}$/.test(b.semana)) {
    /* una partida semanal empezada tarde puede caer después del cambio de semana */
    if (b.semana === semanaISO(new Date()) || b.semana === semanaAnterior()) semana = b.semana;
  }
  return {
    id: id, token: token, nombre: limpiarNombre(b.nombre),
    faccion: faccion, semana: semana,
    patrimonio: patrimonio, nivel: nivel, reputacion: reputacion,
    anios: Math.round(anios * 10) / 10, puestos: puestos,
    cumplidos: cumplidos, despidos: despidos, racha: racha, logros: logros,
    fundo: !!b.fundo, vendio: !!b.vendio, ts: Date.now()
  };
}

/* rate limit suave, en memoria: suficiente para frenar a un script kid aburrido */
var ultimoEnvio = {};
function rateLimitOk(token) {
  var ahora = Date.now(), r = ultimoEnvio[token];
  if (r && ahora - r.ts < 45000) return false;
  if (r && r.dia === new Date().toDateString() && r.n >= 40) return false;
  var dia = new Date().toDateString();
  ultimoEnvio[token] = { ts: ahora, dia: dia, n: r && r.dia === dia ? r.n + 1 : 1 };
  return true;
}

/* mejor carrera por jugador (token) según un campo, orden descendente */
function mejores(carreras, campo) {
  var por = {}, i, e;
  for (i = 0; i < carreras.length; i++) {
    e = carreras[i];
    var m = por[e.token];
    if (!m || e[campo] > m[campo] || (e[campo] === m[campo] && e.patrimonio > m.patrimonio)) por[e.token] = e;
  }
  var out = [], k;
  for (k in por) if (por.hasOwnProperty(k)) out.push(por[k]);
  out.sort(function (a, b2) {
    return b2[campo] - a[campo] || b2.patrimonio - a.patrimonio || a.ts - b2.ts;
  });
  return out;
}

function fila(e, miToken) {
  var f = {
    nombre: e.nombre, faccion: e.faccion, nivel: e.nivel,
    patrimonio: e.patrimonio, racha: e.racha, logros: e.logros,
    cumplidos: e.cumplidos, puestos: e.puestos, fundo: e.fundo, vendio: e.vendio
  };
  if (miToken && e.token === miToken) f.vos = true;
  return f;
}
function filas(arr, n, miToken) {
  var out = [], i;
  for (i = 0; i < Math.min(n, arr.length); i++) out.push(fila(arr[i], miToken));
  return out;
}
function posDe(arr, token) {
  for (var i = 0; i < arr.length; i++) if (arr[i].token === token) return i + 1;
  return null;
}

/* La competencia semanal deja HISTORIA: cada semana reparte puntos de
   campeonato (10-8-6-5-4-3-2-1 a los 8 primeros por patrimonio) que se
   acumulan en una tabla de todos los tiempos, y el ganador queda en el
   palmarés. La semana es la cancha justa; la tabla histórica es la guerra. */
var PUNTOS_SEMANA = [10, 8, 6, 5, 4, 3, 2, 1];
function armarHistorico() {
  var porSemana = {}, i, e;
  for (i = 0; i < DB.carreras.length; i++) {
    e = DB.carreras[i];
    if (!e.semana) continue;
    (porSemana[e.semana] = porSemana[e.semana] || []).push(e);
  }
  var semanas = Object.keys(porSemana).sort();
  var actual = semanaISO(new Date());
  var palmares = [];
  var acum = {};
  for (i = 0; i < semanas.length; i++) {
    var w = semanas[i];
    var top = mejores(porSemana[w], 'patrimonio');
    if (!top.length) continue;
    palmares.push({ semana: w, nombre: top[0].nombre, patrimonio: top[0].patrimonio,
                    jugadores: top.length, enCurso: w === actual });
    for (var j = 0; j < Math.min(PUNTOS_SEMANA.length, top.length); j++) {
      var t = top[j];
      var a = acum[t.token];
      if (!a) a = acum[t.token] = { token: t.token, nombre: t.nombre, faccion: t.faccion,
                                    puntos: 0, semanas: 0, victorias: 0 };
      a.puntos += PUNTOS_SEMANA[j];
      a.semanas++;
      if (j === 0) a.victorias++;
      a.nombre = t.nombre; a.faccion = t.faccion;
    }
  }
  palmares.reverse();
  var tabla = [];
  for (var k in acum) if (acum.hasOwnProperty(k)) tabla.push(acum[k]);
  tabla.sort(function (a2, b2) {
    return b2.puntos - a2.puntos || b2.victorias - a2.victorias || b2.semanas - a2.semanas;
  });
  return { palmares: palmares, tabla: tabla };
}

function armarTablas(miToken) {
  var semana = semanaISO(new Date());
  var patTop = mejores(DB.carreras, 'patrimonio');
  var nivTop = mejores(DB.carreras, 'nivel');
  var rachaTop = mejores(DB.carreras, 'racha');
  var logTop = mejores(DB.carreras, 'logros');
  var deSemana = [], dePasada = [], i;
  for (i = 0; i < DB.carreras.length; i++) {
    if (DB.carreras[i].semana === semana) deSemana.push(DB.carreras[i]);
    else if (DB.carreras[i].semana === semanaAnterior()) dePasada.push(DB.carreras[i]);
  }
  var semTop = mejores(deSemana, 'patrimonio');
  var pasadaTop = mejores(dePasada, 'patrimonio');

  var fac = { growth: { carreras: 0, cumplidos: 0, patrimonio: 0 },
              craft: { carreras: 0, cumplidos: 0, patrimonio: 0 } };
  for (i = 0; i < DB.carreras.length; i++) {
    var e = DB.carreras[i];
    if (e.faccion && fac[e.faccion]) {
      fac[e.faccion].carreras++;
      fac[e.faccion].cumplidos += e.cumplidos;
      fac[e.faccion].patrimonio += e.patrimonio;
    }
  }

  var r = {
    ok: true, semana: semana,
    carreras: DB.carreras.length, jugadores: patTop.length,
    tablas: {
      /* el ranking mundial lista a TODOS los jugadores; los topes son solo un fusible */
      patrimonio: filas(patTop, 1000, miToken),
      nivel: filas(nivTop, 5, miToken),
      racha: filas(rachaTop, 5, miToken),
      logros: filas(logTop, 5, miToken),
      semanal: filas(semTop, 300, miToken)
    },
    semanaPasada: pasadaTop.length ? { semana: semanaAnterior(), nombre: pasadaTop[0].nombre, patrimonio: pasadaTop[0].patrimonio } : null,
    historico: (function () {
      var hz = armarHistorico();
      var filasH = [], i2;
      for (i2 = 0; i2 < Math.min(300, hz.tabla.length); i2++) {
        var t2 = hz.tabla[i2];
        var f2 = { nombre: t2.nombre, faccion: t2.faccion, puntos: t2.puntos,
                   semanas: t2.semanas, victorias: t2.victorias };
        if (miToken && t2.token === miToken) f2.vos = true;
        filasH.push(f2);
      }
      return { sistema: '10-8-6-5-4-3-2-1 a los 8 primeros de cada semana',
               tabla: filasH, palmares: hz.palmares.slice(0, 26) };
    })(),
    facciones: fac,
    bounty: patTop.length ? { nombre: patTop[0].nombre, patrimonio: patTop[0].patrimonio } : null
  };
  if (miToken) {
    r.tu = { pos: posDe(patTop, miToken), total: patTop.length };
    var ps = posDe(semTop, miToken);
    if (ps) { r.tu.posSemanal = ps; r.tu.totalSemanal = semTop.length; }
    for (i = 0; i < r.historico.tabla.length; i++) {
      if (r.historico.tabla[i].vos) {
        r.tu.posHistorica = i + 1;
        r.tu.puntosHistoricos = r.historico.tabla[i].puntos;
        break;
      }
    }
  }
  return r;
}

function recibirCarrera(body, res) {
  var b = null;
  try { b = JSON.parse(body); } catch (e) {}
  var c = validarCarrera(b);
  if (!c) return responderJson(res, { ok: false, motivo: 'datos' });
  if (!rateLimitOk(c.token)) return responderJson(res, { ok: false, motivo: 'calma' });

  var patAntes = mejores(DB.carreras, 'patrimonio');
  var reyAntes = patAntes.length ? patAntes[0] : null;

  /* la misma carrera reenviada (mismo id) se reemplaza a sí misma en vez de duplicarse */
  for (var i = 0; i < DB.carreras.length; i++) {
    if (DB.carreras[i].id === c.id) { DB.carreras.splice(i, 1); break; }
  }
  DB.carreras.push(c);
  if (DB.carreras.length > MAX_CARRERAS) DB.carreras.splice(0, DB.carreras.length - MAX_CARRERAS);
  guardarRanking();

  var patTop = mejores(DB.carreras, 'patrimonio');
  var out = { ok: true, pos: posDe(patTop, c.token), total: patTop.length, destronaste: null };
  if (c.semana === semanaISO(new Date())) {
    var deSemana = [];
    for (i = 0; i < DB.carreras.length; i++) if (DB.carreras[i].semana === c.semana) deSemana.push(DB.carreras[i]);
    var semTop = mejores(deSemana, 'patrimonio');
    out.posSemanal = posDe(semTop, c.token);
    out.totalSemanal = semTop.length;
  }
  if (reyAntes && reyAntes.token !== c.token && patTop.length && patTop[0].token === c.token) {
    out.destronaste = reyAntes.nombre;
  }
  responderJson(res, out);
}

function elegirRival(miToken, nivelMin) {
  var candidatos = [], i, e;
  var por = {};
  for (i = 0; i < DB.carreras.length; i++) {
    e = DB.carreras[i];
    if (e.token === miToken) continue;
    /* un candidato por jugador: su mejor carrera */
    var m = por[e.token];
    if (!m || e.patrimonio > m.patrimonio) por[e.token] = e;
  }
  var k;
  for (k in por) if (por.hasOwnProperty(k)) candidatos.push(por[k]);
  if (!candidatos.length) return null;
  var altos = [];
  for (i = 0; i < candidatos.length; i++) if (candidatos[i].nivel >= nivelMin) altos.push(candidatos[i]);
  var pool = altos.length ? altos : candidatos;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ---------- la página pública /ranking ---------- */
function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function dinero(n) {
  if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (Math.abs(n) >= 10000) return '$' + Math.round(n / 1000) + 'k';
  return '$' + Math.round(n);
}
var ROLES = ['Analista de Producto', 'Product Manager', 'Senior PM', 'Group PM',
             'Director de Producto', 'VP de Producto', 'CPO', 'Fundador/a'];

function tablaHtml(titulo, filas2, valor) {
  var h = '<div class="tabla"><div class="rot">' + titulo + '</div>';
  if (!filas2.length) h += '<div class="fila mut">Nadie todavía. Sé el primero.</div>';
  for (var i = 0; i < filas2.length; i++) {
    var e = filas2[i];
    var tag = e.faccion === 'growth' ? ' <span class="tag g">growth</span>' :
              e.faccion === 'craft' ? ' <span class="tag c">craft</span>' : '';
    h += '<div class="fila"><span class="pos">' + (i + 1) + '</span> ' +
         '<span class="nom">' + escHtml(e.nombre) + tag + '</span>' +
         '<span class="val">' + valor(e) + '</span></div>';
  }
  return h + '</div>';
}

function paginaRanking() {
  var d = armarTablas(null);
  var h = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Founder Mode — Salón de la Fama</title><style>' +
    'body{margin:0;background:#04060a;color:#e8eaed;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;padding:28px 20px}' +
    '.marco{max-width:920px;margin:0 auto}' +
    'h1{font-weight:200;font-size:34px;letter-spacing:-0.5px;margin:4px 0 2px 0}' +
    '.rot{font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#6c7685;font-weight:600;margin-bottom:8px}' +
    '.mut{color:#8b93a1}.verde{color:#35c46a}.lila{color:#a98ff0}' +
    '.bounty{background:#12151b;border:1px solid #2a2438;border-radius:8px;padding:12px 15px;margin:16px 0;font-size:14px;line-height:1.5}' +
    '.cols{display:flex;flex-wrap:wrap;gap:22px;margin-top:18px}' +
    '.tabla{background:#12151b;border:1px solid #1c2027;border-radius:8px;padding:12px 15px;flex:1 1 260px;min-width:260px}' +
    '.fila{display:flex;align-items:baseline;font-size:13.5px;padding:4px 0;border-bottom:1px solid #161b23}' +
    '.fila:last-child{border-bottom:0}' +
    '.pos{color:#6c7685;width:22px;font-variant-numeric:tabular-nums}' +
    '.nom{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.val{color:#35c46a;font-variant-numeric:tabular-nums;margin-left:10px}' +
    '.tag{font-size:9px;letter-spacing:1px;text-transform:uppercase;padding:1px 5px;border-radius:8px;margin-left:5px}' +
    '.tag.g{color:#e8a33d;border:1px solid #4a3a1c}.tag.c{color:#5aa9f0;border:1px solid #1c2f44}' +
    '.facbar{height:16px;border-radius:8px;overflow:hidden;background:#20242e;display:flex;margin:8px 0}' +
    '.facbar i{display:block;height:100%}' +
    '.pie{margin-top:26px;font-size:13px}' +
    'a{color:#5aa9f0;text-decoration:none}' +
    '</style></head><body><div class="marco">' +
    '<div class="rot">Founder Mode · ranking público · ' + escHtml(d.semana) + '</div>' +
    '<h1>Salón de la Fama</h1>' +
    '<div class="mut" style="font-size:13px">' + d.jugadores + ' jugadores · ' + d.carreras + ' carreras terminadas</div>';

  if (d.bounty) {
    h += '<div class="bounty"><span class="lila">RECOMPENSA</span> &nbsp;Destrona a <b>' + escHtml(d.bounty.nombre) +
         '</b> (' + dinero(d.bounty.patrimonio) + ') y el logro <b>Regicidio</b> es tuyo.</div>';
  }

  h += '<div class="cols">';
  h += tablaHtml('Ranking mundial · patrimonio · los ' + d.jugadores + ' jugadores', d.tablas.patrimonio, function (e) { return dinero(e.patrimonio); });
  h += tablaHtml('Esta semana · ' + escHtml(d.semana), d.tablas.semanal, function (e) { return dinero(e.patrimonio); });
  if (d.historico && d.historico.tabla.length) {
    h += tablaHtml('Tabla histórica · puntos de campeonato (' + escHtml(d.historico.sistema) + ')',
      d.historico.tabla, function (e) {
        return e.puntos + ' pts · ' + e.victorias + '🏆 · ' + e.semanas + ' semanas';
      });
  }
  if (d.historico && d.historico.palmares.length) {
    h += '<h2>Palmarés semanal</h2><table><tr><th>Semana</th><th>Campeón</th><th>Patrimonio</th><th>Jugadores</th></tr>';
    for (var pi = 0; pi < d.historico.palmares.length; pi++) {
      var pw = d.historico.palmares[pi];
      h += '<tr><td>' + escHtml(pw.semana) + (pw.enCurso ? ' <span class="mut">(en curso)</span>' : '') + '</td>' +
           '<td>' + escHtml(pw.nombre) + '</td><td>' + dinero(pw.patrimonio) + '</td><td>' + pw.jugadores + '</td></tr>';
    }
    h += '</table>';
  }
  h += '</div><div class="cols">';
  h += tablaHtml('Rol más alto', d.tablas.nivel, function (e) { return escHtml(ROLES[e.nivel] || ''); });
  h += tablaHtml('Racha de mandatos', d.tablas.racha, function (e) { return e.racha + ' seguidos'; });
  h += tablaHtml('Logros', d.tablas.logros, function (e) { return e.logros + ' desbloqueados'; });
  h += '</div>';

  var g = d.facciones.growth, c = d.facciones.craft;
  var totalC = g.cumplidos + c.cumplidos;
  var pg = totalC ? Math.round(g.cumplidos / totalC * 100) : 50;
  h += '<div class="tabla" style="margin-top:22px"><div class="rot">Guerra de facciones · mandatos cumplidos</div>' +
    '<div class="facbar"><i style="width:' + pg + '%;background:#e8a33d"></i><i style="width:' + (100 - pg) + '%;background:#5aa9f0"></i></div>' +
    '<div style="display:flex;justify-content:space-between;font-size:13px">' +
    '<span><b style="color:#e8a33d">Legión del Crecimiento</b> · ' + g.cumplidos + ' mandatos · ' + g.carreras + ' carreras</span>' +
    '<span><b style="color:#5aa9f0">Gremio del Oficio</b> · ' + c.cumplidos + ' mandatos · ' + c.carreras + ' carreras</span></div></div>';

  if (d.semanaPasada) {
    h += '<div class="mut" style="margin-top:14px;font-size:13px">La semana pasada (' + escHtml(d.semanaPasada.semana) + ') la ganó <b>' +
         escHtml(d.semanaPasada.nombre) + '</b> con ' + dinero(d.semanaPasada.patrimonio) + '.</div>';
  }

  h += '<div class="pie"><a href="/">Juega Founder Mode</a> — cada carrera que termines cae aquí.</div>';
  h += '</div></body></html>';
  return h;
}

/* ---------- /api/perfil?u=<linkedin-url> ----------
   Fetch del lado del servidor de la página PÚBLICA del perfil: LinkedIn pone
   "Nombre - Titular | LinkedIn" en og:title / <title> para vistas sin sesión.
   LinkedIn suele poner authwall a IPs de datacenter, así que esto es mejor
   esfuerzo por diseño: el cliente siempre cae al parseo de slug + cargo
   cuando devolvemos ok:false. */
function limpiarEntidades(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
}

function extraerPerfil(html) {
  var m = /<meta\s+property="og:title"\s+content="([^"]+)"/i.exec(html) ||
          /<title>([^<]+)<\/title>/i.exec(html);
  if (!m) return null;
  var t = limpiarEntidades(m[1]).replace(/\s*\|\s*LinkedIn\s*$/i, '').replace(/\s*- LinkedIn\s*$/i, '');
  if (/authwall|sign ?up|log ?in/i.test(t)) return null;
  // "Nombre - Titular - Empresa" o "Nombre – Titular"
  var partes = t.split(/\s+[-–—]\s+/);
  var nombre = partes[0] ? partes[0].trim() : null;
  var titular = partes.slice(1).join(' - ').trim() || null;
  if (!nombre || nombre.length < 2 || nombre.length > 60) return null;
  return { nombre: nombre, titular: titular };
}

function traerPerfil(url, res, saltos) {
  if (saltos > 3) return responderJson(res, { ok: false, motivo: 'redirects' });
  var opciones;
  try {
    var u = new URL(url);
    if (!/(^|\.)linkedin\.com$/.test(u.hostname)) return responderJson(res, { ok: false, motivo: 'dominio' });
    opciones = {
      hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };
  } catch (e) { return responderJson(res, { ok: false, motivo: 'url' }); }

  var pedido = https.request(opciones, function (r) {
    if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
      var destino = r.headers.location.indexOf('http') === 0 ? r.headers.location : 'https://' + opciones.hostname + r.headers.location;
      if (/authwall/i.test(destino)) return responderJson(res, { ok: false, motivo: 'authwall' });
      return traerPerfil(destino, res, saltos + 1);
    }
    var html = '';
    r.setEncoding('utf8');
    r.on('data', function (ch) { html += ch; if (html.length > 500000) r.destroy(); });
    r.on('end', function () {
      var p = extraerPerfil(html);
      if (p) responderJson(res, { ok: true, nombre: p.nombre, titular: p.titular });
      else responderJson(res, { ok: false, motivo: 'authwall' });
    });
  });
  pedido.setTimeout(6000, function () { pedido.destroy(); responderJson(res, { ok: false, motivo: 'timeout' }); });
  pedido.on('error', function () { responderJson(res, { ok: false, motivo: 'red' }); });
  pedido.end();
}

function cabecerasApi() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
function responderJson(res, obj) {
  if (res.headersSent || res.writableEnded) return;
  res.writeHead(200, cabecerasApi());
  res.end(JSON.stringify(obj));
}

http.createServer(function (req, res) {
  var partes = req.url.split('?');
  var url = partes[0];
  var q = {};
  (partes[1] || '').split('&').forEach(function (kv) {
    var i = kv.indexOf('=');
    if (i > 0) q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1));
  });

  if (url.indexOf('/api/') === 0 && req.method === 'OPTIONS') {
    res.writeHead(204, cabecerasApi());
    return res.end();
  }

  if (url === '/api/perfil') {
    if (!q.u) return responderJson(res, { ok: false, motivo: 'falta u' });
    return traerPerfil(q.u, res, 0);
  }

  if (url === '/api/ranking' && req.method === 'GET') {
    var t = typeof q.t === 'string' && /^[a-z0-9]{8,48}$/.test(q.t) ? q.t : null;
    return responderJson(res, armarTablas(t));
  }

  if (url === '/api/ranking' && req.method === 'POST') {
    var cuerpo = '';
    req.setEncoding('utf8');
    req.on('data', function (ch) {
      cuerpo += ch;
      if (cuerpo.length > 16384) { req.destroy(); }
    });
    req.on('end', function () { recibirCarrera(cuerpo, res); });
    return;
  }

  if (url === '/api/rival') {
    var t2 = typeof q.token === 'string' ? q.token : '';
    var n = parseInt(q.nivel, 10);
    if (isNaN(n)) n = 0;
    var r = elegirRival(t2, Math.max(0, Math.min(7, n)));
    if (!r) return responderJson(res, { ok: false });
    return responderJson(res, {
      ok: true, nombre: r.nombre, nivel: r.nivel, patrimonio: r.patrimonio,
      reputacion: r.reputacion, cumplidos: r.cumplidos, puestos: r.puestos
    });
  }

  if (url === '/ranking' || url === '/ranking/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(paginaRanking());
  }

  if (url === '/') url = '/index.html';
  var archivo = path.normalize(path.join(ROOT, url));
  if (archivo.indexOf(ROOT) !== 0) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  /* Cache por validacion, no por nombre de archivo: el navegador pregunta
     "¿cambio?" y el servidor contesta 304 si no. Por eso los <script> de
     index.html ya NO llevan ?v=N: ese contador obligaba a tocar las mismas 10
     lineas en cada cambio y era el conflicto garantizado de todo PR.
     Ver CONTRIBUTING.md. */
  fs.stat(archivo, function (errS, st) {
    if (errS || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    var ext = path.extname(archivo).toLowerCase();
    var etag = '"' + st.size.toString(16) + '-' + st.mtime.getTime().toString(16) + '"';
    var inmutable = ext === '.png' || ext === '.ico' || ext === '.svg' || ext === '.woff2';
    var cabeceras = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'ETag': etag,
      'Cache-Control': inmutable ? 'public, max-age=86400' : 'no-cache'
    };
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, cabeceras);
      return res.end();
    }
    fs.readFile(archivo, function (err, datos) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Not found');
      }
      res.writeHead(200, cabeceras);
      res.end(datos);
    });
  });
}).listen(PORT, '0.0.0.0', function () {
  console.log('Founders listening on port ' + PORT);
  console.log('Ranking store: ' + RANK_FILE + (RANK_DIR === ROOT ?
    '  (WARNING: no /data volume — resets on every deploy)' : ''));
});
