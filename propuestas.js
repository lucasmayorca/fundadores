/* Cliente de propuestas de la comunidad: los jugadores proponen mejoras al
   juego y votan las de otros. La más votada de la semana la implementa un
   agente en una rama y abre un PR — ver CONTRIBUTING.md, sección Comunidad.
   Reusa la identidad anónima y el cálculo de semana de Ranking. Mejor
   esfuerzo por diseño: si la red falla, el juego nunca se bloquea. */

var Propuestas = (function () {
  'use strict';

  /* misma detección same-origin/cross-origin que Ranking, para que el iPad
     en la LAN también proponga y vote contra el deploy público */
  var API = (function () {
    try {
      if (/railway\.app$/i.test(window.location.hostname)) return '';
      if (window.location.pathname.indexOf('/juego') === 0) return 'https://fundadores-production.up.railway.app';
      if (/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) return '';
    } catch (e) {}
    return 'https://fundadores-production.up.railway.app';
  })();

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
      /* text/plain le evita el preflight de CORS al Safari viejo */
      if (cuerpo) x.setRequestHeader('Content-Type', 'text/plain');
      x.send(cuerpo ? JSON.stringify(cuerpo) : null);
    } catch (e2) { fin(null); }
  }

  function listar(cb) {
    xhrJson('GET', '/api/propuestas?t=' + Ranking.token(), null, cb);
  }
  function proponer(texto, cb) {
    xhrJson('POST', '/api/propuestas', { token: Ranking.token(), texto: texto }, cb);
  }
  function votar(id, cb) {
    xhrJson('POST', '/api/propuestas/votar', { token: Ranking.token(), id: id }, cb);
  }

  var CLAVE_VISTA = 'fundadores.propuestas.vista';
  function debeMostrarse() {
    var vista = null;
    try { vista = localStorage.getItem(CLAVE_VISTA); } catch (e) {}
    return vista !== Ranking.semana();
  }
  function marcarVista() {
    try { localStorage.setItem(CLAVE_VISTA, Ranking.semana()); } catch (e) {}
  }

  return { listar: listar, proponer: proponer, votar: votar,
           debeMostrarse: debeMostrarse, marcarVista: marcarVista };
})();
