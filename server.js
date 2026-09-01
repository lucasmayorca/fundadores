// Minimal static server for Railway. Zero dependencies.
// Locally the game is still served by the panel's server; this file only
// runs on the deploy — which is also why /api/perfil only exists there.
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

var respondido; // per-request guard lives in closure below
function responderJson(res, obj) {
  if (res.headersSent || res.writableEnded) return;
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

http.createServer(function (req, res) {
  var partes = req.url.split('?');
  var url = partes[0];

  if (url === '/api/perfil') {
    var q = {};
    (partes[1] || '').split('&').forEach(function (kv) {
      var i = kv.indexOf('=');
      if (i > 0) q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1));
    });
    if (!q.u) return responderJson(res, { ok: false, motivo: 'falta u' });
    return traerPerfil(q.u, res, 0);
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
});
