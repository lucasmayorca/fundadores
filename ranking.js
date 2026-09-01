/* Public ranking client: anonymous identity (a token in localStorage),
   career submissions, the Hall of Fame tables, the ghost rival and the
   weekly seed. Best-effort by design: on the LAN or offline every call
   fails quietly and the game never blocks on it. Strict ES5 (Safari 9). */

var Ranking = (function () {
  'use strict';

  /* On Railway (or `npm start` locally) the API is same-origin. Served by
     the panel — the game lives under /juego/ there — it goes cross-origin
     to the public deploy, so the iPad on the LAN scores publicly too. */
  var API = (function () {
    try {
      if (/railway\.app$/i.test(window.location.hostname)) return '';
      if (window.location.pathname.indexOf('/juego') === 0) return 'https://fundadores-production.up.railway.app';
      if (/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) return '';
    } catch (e) {}
    return 'https://fundadores-production.up.railway.app';
  })();

  var tokenMem = null;
  function token() {
    if (tokenMem) return tokenMem;
    var t = null;
    try { t = localStorage.getItem('fundadores.token'); } catch (e) {}
    if (!t || !/^[a-z0-9]{8,48}$/.test(t)) {
      t = '';
      var abc = 'abcdefghijklmnopqrstuvwxyz0123456789', i;
      for (i = 0; i < 24; i++) t += abc.charAt(Math.floor(Math.random() * abc.length));
      t += String(new Date().getTime() % 1000000);
      try { localStorage.setItem('fundadores.token', t); } catch (e2) {}
    }
    tokenMem = t;
    return t;
  }

  function faccion() {
    try {
      var f = localStorage.getItem('fundadores.faccion');
      return f === 'growth' || f === 'craft' ? f : null;
    } catch (e) { return null; }
  }
  function setFaccion(f) {
    try {
      if (f === 'growth' || f === 'craft') localStorage.setItem('fundadores.faccion', f);
      else localStorage.removeItem('fundadores.faccion');
    } catch (e) {}
  }

  /* ISO week, e.g. "2026-W36". Same function lives in the server. */
  function semana() {
    var d = new Date();
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var dia = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dia);
    var a = d.getUTCFullYear();
    var inicio = new Date(Date.UTC(a, 0, 1));
    var w = Math.ceil((((d - inicio) / 86400000) + 1) / 7);
    return a + '-W' + (w < 10 ? '0' + w : w);
  }

  /* djb2: the week string becomes the world seed, same for everyone */
  function semilla(s) {
    var h = 5381, i;
    for (i = 0; i < s.length; i++) h = ((h * 33) + s.charCodeAt(i)) % 4294967296;
    return h;
  }

  function xhrJson(metodo, ruta, cuerpo, cb) {
    var listo = false;
    function fin(r) { if (!listo) { listo = true; cb(r); } }
    if (!window.XMLHttpRequest) return fin(null);
    var x;
    try {
      x = new XMLHttpRequest();
      x.open(metodo, API + ruta, true);
      x.timeout = 8000;
      x.ontimeout = function () { fin(null); };
      x.onerror = function () { fin(null); };
      x.onreadystatechange = function () {
        if (x.readyState !== 4) return;
        var r = null;
        try { r = JSON.parse(x.responseText); } catch (e) {}
        fin(r);
      };
      /* text/plain keeps old Safari away from CORS preflight */
      if (cuerpo) x.setRequestHeader('Content-Type', 'text/plain');
      x.send(cuerpo ? JSON.stringify(cuerpo) : null);
    } catch (e2) { fin(null); }
  }

  function enviar(datos, cb) { xhrJson('POST', '/api/ranking', datos, cb); }
  function traer(cb) { xhrJson('GET', '/api/ranking?t=' + token(), null, cb); }
  function rival(nivel, cb) {
    xhrJson('GET', '/api/rival?token=' + token() + '&nivel=' + (nivel || 0), null, cb);
  }

  return { token: token, faccion: faccion, setFaccion: setFaccion,
           semana: semana, semilla: semilla,
           enviar: enviar, traer: traer, rival: rival };
})();
