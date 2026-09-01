/* Achievements and hall of records. Persist across careers in localStorage.
   Strict ES5 (Safari 9). */

var Logros = (function () {
  'use strict';

  var CLAVE = 'fundadores.records';

  var DEFS = [
    { id:'abismo',    n:'Beachhead',             d:'Cracked open the big market in a single role.' },
    { id:'cpo',       n:'The big chair',         d:'Made it to CPO.' },
    { id:'fundaste',  n:'Garage',                d:'Founded your own company.' },
    { id:'salida',    n:'The bell',              d:'Sold a company as a founder.' },
    { id:'limpio',    n:'Zero downtime',         d:'A whole role without a single incident.' },
    { id:'invierno',  n:'Winter survivor',       d:'Delivered a mandate during the capital winter.' },
    { id:'mudo',      n:'The uncomfortable number', d:'Showed the board the cohorts knowing it would hurt.' },
    { id:'sindeuda',  n:'Debt-free',             d:'Finished a role with technical debt under 20.' },
    { id:'biblioteca',n:'Bookworm',              d:'Opened 60 library entries.' },
    { id:'rival',     n:'Unfinished business',   d:'Finished a career above your rival.' },
    { id:'pleno',     n:'On a streak',           d:'Delivered 4 mandates in a row.' },
    { id:'fenix',     n:'Phoenix',               d:'A promotion in the role right after a firing.' },
    { id:'heisenberg',n:'The one who knocks',    d:'Finished a role with the Heat above 70, no indictment.' },
    { id:'manoslimpias',n:'Clean hands',         d:'A whole career without the Heat ever passing 20.' },
    { id:'labanca',   n:'The house wins',        d:'Delivered a mandate in the gambling industry.' },
    { id:'zafaste',   n:'You got away',          d:'Survived a raid.' },
    { id:'regicidio', n:'Regicide',              d:'Dethroned the #1 of the public Hall of Fame.' }
  ];

  function cargar() {
    try {
      var s = localStorage.getItem(CLAVE);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return { logros:{}, records:{ patrimonio:0, nivel:0, libros:0, carreras:0 }, historia:[] };
  }
  function guardar(r) { try { localStorage.setItem(CLAVE, JSON.stringify(r)); } catch (e) {} }

  function dar(r, id) {
    if (r.logros[id]) return null;
    r.logros[id] = true;
    for (var i = 0; i < DEFS.length; i++) if (DEFS[i].id === id) return DEFS[i];
    return null;
  }

  /* Called when a role closes. Returns the new achievements to display. */
  function evaluarPuesto(r, c, e, cierre) {
    var nuevos = [], g;
    if (Motor.compuerta(e, 'pragm') >= 1) { g = dar(r, 'abismo'); if (g) nuevos.push(g); }
    if (e.incidentesPuesto === 0 && e.mesPuesto >= 10) { g = dar(r, 'limpio'); if (g) nuevos.push(g); }
    if (e.deuda < 20) { g = dar(r, 'sindeuda'); if (g) nuevos.push(g); }
    if (e.final === 'venta') { g = dar(r, 'salida'); if (g) nuevos.push(g); }
    if ((e.lupaMax || 0) >= 70 && e.final !== 'imputado') { g = dar(r, 'heisenberg'); if (g) nuevos.push(g); }
    if (e.zafo) { g = dar(r, 'zafaste'); if (g) nuevos.push(g); }
    if (cierre.cumplido && e.sectorId === 'apuestas') { g = dar(r, 'labanca'); if (g) nuevos.push(g); }
    if (cierre.cumplido && e.eraId === 'invierno') { g = dar(r, 'invierno'); if (g) nuevos.push(g); }
    if (c.nivel >= 6) { g = dar(r, 'cpo'); if (g) nuevos.push(g); }
    if (e.esFundador) { g = dar(r, 'fundaste'); if (g) nuevos.push(g); }
    if (Object.keys(c.codex).length >= 60) { g = dar(r, 'biblioteca'); if (g) nuevos.push(g); }
    var seg = 0, i;
    for (i = c.puestos.length - 1; i >= 0; i--) { if (c.puestos[i].cumplido) seg++; else break; }
    if (seg >= 4) { g = dar(r, 'pleno'); if (g) nuevos.push(g); }
    if (c.puestos.length >= 2 && c.puestos[c.puestos.length - 2].despido && cierre.promocion) {
      g = dar(r, 'fenix'); if (g) nuevos.push(g);
    }
    guardar(r);
    return nuevos;
  }

  /* At the end of the career. */
  function evaluarCarrera(r, c, b, mundo) {
    var nuevos = [], g;
    if ((c.lupaMax || 0) <= 20 && c.puestos.length >= 4) { g = dar(r, 'manoslimpias'); if (g) nuevos.push(g); }
    if (c.nivel >= mundo.rival.nivel && c.reputacion >= mundo.rival.reputacion) {
      g = dar(r, 'rival'); if (g) nuevos.push(g);
    }
    r.records.carreras++;
    if (b.patrimonio > r.records.patrimonio) r.records.patrimonio = b.patrimonio;
    if (c.nivel > r.records.nivel) r.records.nivel = c.nivel;
    var libros = Object.keys(c.codex).length;
    if (libros > r.records.libros) r.records.libros = libros;
    r.historia.unshift({ nombre:c.nombre, patrimonio:b.patrimonio, nivel:nivelPorN(c.nivel).rol,
                         puestos:c.puestos.length, rival:mundo.rival.nombre, rivalNivel:mundo.rival.nivel });
    if (r.historia.length > 8) r.historia.pop();
    guardar(r);
    return nuevos;
  }

  return { cargar:cargar, guardar:guardar, evaluarPuesto:evaluarPuesto,
           evaluarCarrera:evaluarCarrera, dar:dar, DEFS:DEFS };
})();
