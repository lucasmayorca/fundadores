// Minimal server for Railway. Zero dependencies.
// Locally the game is still served by the panel's server; this file only
// runs on the deploy — which is why /api/perfil and the public ranking
// live here. The game talks to this API cross-origin from the LAN too.
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
  '.txt': 'text/plain; charset=utf-8'
};

/* ================= PUBLIC RANKING (Hall of Fame) =================
   A JSON file on a Railway volume (/data). Without the volume it still
   works but resets on every deploy — the boot log says which one you got.
   Everything the client sends is untrusted: clamp numbers, whitelist
   strings, and escape names at render time. */

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

/* ISO week, e.g. "2026-W36". Same function ships in the client. */
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
  if (typeof s !== 'string') return 'Anonymous';
  s = s.replace(/[<>&"']/g, '').replace(/[\x00-\x1f\x7f]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s || s.toLowerCase() === 'you') return 'Anonymous';
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
    /* a weekly run started late in the week can land after the flip */
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

/* soft rate limit, in memory: enough to stop a bored script kid */
var ultimoEnvio = {};
function rateLimitOk(token) {
  var ahora = Date.now(), r = ultimoEnvio[token];
  if (r && ahora - r.ts < 45000) return false;
  if (r && r.dia === new Date().toDateString() && r.n >= 40) return false;
  var dia = new Date().toDateString();
  ultimoEnvio[token] = { ts: ahora, dia: dia, n: r && r.dia === dia ? r.n + 1 : 1 };
  return true;
}

/* best career per player (token) by a field, sorted desc */
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
      /* the world ranking lists EVERY player; the caps are just a fuse */
      patrimonio: filas(patTop, 1000, miToken),
      nivel: filas(nivTop, 5, miToken),
      racha: filas(rachaTop, 5, miToken),
      logros: filas(logTop, 5, miToken),
      semanal: filas(semTop, 300, miToken)
    },
    semanaPasada: pasadaTop.length ? { semana: semanaAnterior(), nombre: pasadaTop[0].nombre, patrimonio: pasadaTop[0].patrimonio } : null,
    facciones: fac,
    bounty: patTop.length ? { nombre: patTop[0].nombre, patrimonio: patTop[0].patrimonio } : null
  };
  if (miToken) {
    r.tu = { pos: posDe(patTop, miToken), total: patTop.length };
    var ps = posDe(semTop, miToken);
    if (ps) { r.tu.posSemanal = ps; r.tu.totalSemanal = semTop.length; }
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

  /* same career resubmitted (same id) replaces itself instead of duplicating */
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
    /* one candidate per player: their best career */
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

/* ---------- the public /ranking page ---------- */
function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function dinero(n) {
  if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (Math.abs(n) >= 10000) return '$' + Math.round(n / 1000) + 'k';
  return '$' + Math.round(n);
}
var ROLES = ['Product Analyst', 'Product Manager', 'Senior PM', 'Group PM',
             'Director of Product', 'VP of Product', 'CPO', 'Founder'];

function tablaHtml(titulo, filas2, valor) {
  var h = '<div class="tabla"><div class="rot">' + titulo + '</div>';
  if (!filas2.length) h += '<div class="fila mut">Nobody yet. Be the first.</div>';
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
    '<title>Founders — Hall of Fame</title><style>' +
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
    '<div class="rot">Founders · public ranking · ' + escHtml(d.semana) + '</div>' +
    '<h1>Hall of Fame</h1>' +
    '<div class="mut" style="font-size:13px">' + d.jugadores + ' players · ' + d.carreras + ' careers finished</div>';

  if (d.bounty) {
    h += '<div class="bounty"><span class="lila">BOUNTY</span> &nbsp;Dethrone <b>' + escHtml(d.bounty.nombre) +
         '</b> (' + dinero(d.bounty.patrimonio) + ') and the <b>Regicide</b> achievement is yours.</div>';
  }

  h += '<div class="cols">';
  h += tablaHtml('World ranking · net worth · all ' + d.jugadores + ' players', d.tablas.patrimonio, function (e) { return dinero(e.patrimonio); });
  h += tablaHtml('This week · ' + escHtml(d.semana), d.tablas.semanal, function (e) { return dinero(e.patrimonio); });
  h += '</div><div class="cols">';
  h += tablaHtml('Highest role', d.tablas.nivel, function (e) { return escHtml(ROLES[e.nivel] || ''); });
  h += tablaHtml('Mandate streak', d.tablas.racha, function (e) { return e.racha + ' in a row'; });
  h += tablaHtml('Achievements', d.tablas.logros, function (e) { return e.logros + ' unlocked'; });
  h += '</div>';

  var g = d.facciones.growth, c = d.facciones.craft;
  var totalC = g.cumplidos + c.cumplidos;
  var pg = totalC ? Math.round(g.cumplidos / totalC * 100) : 50;
  h += '<div class="tabla" style="margin-top:22px"><div class="rot">Faction war · mandates delivered</div>' +
    '<div class="facbar"><i style="width:' + pg + '%;background:#e8a33d"></i><i style="width:' + (100 - pg) + '%;background:#5aa9f0"></i></div>' +
    '<div style="display:flex;justify-content:space-between;font-size:13px">' +
    '<span><b style="color:#e8a33d">Growth Legion</b> · ' + g.cumplidos + ' mandates · ' + g.carreras + ' careers</span>' +
    '<span><b style="color:#5aa9f0">Craft Guild</b> · ' + c.cumplidos + ' mandates · ' + c.carreras + ' careers</span></div></div>';

  if (d.semanaPasada) {
    h += '<div class="mut" style="margin-top:14px;font-size:13px">Last week (' + escHtml(d.semanaPasada.semana) + ') was won by <b>' +
         escHtml(d.semanaPasada.nombre) + '</b> with ' + dinero(d.semanaPasada.patrimonio) + '.</div>';
  }

  h += '<div class="pie"><a href="/">Play Founders</a> — every career you finish lands here.</div>';
  h += '</div></body></html>';
  return h;
}

/* ---------- /api/perfil?u=<linkedin-url> ----------
   Server-side fetch of the PUBLIC profile page: LinkedIn puts
   "Name - Headline | LinkedIn" in og:title / <title> for logged-out views.
   LinkedIn often authwalls datacenter IPs, so this is best-effort by design:
   the client always falls back to slug + title parsing when we return ok:false. */
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
  // "Name - Headline - Company" or "Name – Headline"
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
  fs.readFile(archivo, function (err, datos) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    var ext = path.extname(archivo).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(datos);
  });
}).listen(PORT, '0.0.0.0', function () {
  console.log('Founders listening on port ' + PORT);
  console.log('Ranking store: ' + RANK_FILE + (RANK_DIR === ROOT ?
    '  (WARNING: no /data volume — resets on every deploy)' : ''));
});
