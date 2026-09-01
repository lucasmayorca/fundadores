/* Logros y sala de récords. Persisten entre carreras en localStorage.
   ES5 estricto (Safari 9). */

var Logros = (function () {
  'use strict';

  var CLAVE = 'fundadores.records';

  var DEFS = [
    { id:'abismo',    n:'Cabeza de playa',      d:'Abriste el mercado grande en un puesto.' },
    { id:'cpo',       n:'La silla grande',       d:'Llegaste a CPO.' },
    { id:'fundaste',  n:'Garage',                d:'Fundaste tu propia empresa.' },
    { id:'salida',    n:'Campana',               d:'Vendiste una empresa siendo fundador/a.' },
    { id:'limpio',    n:'Cero caídas',           d:'Un puesto entero sin un solo incidente.' },
    { id:'invierno',  n:'Sobrevivir al invierno',d:'Cumpliste un mandato durante el invierno del capital.' },
    { id:'mudo',      n:'El número incómodo',    d:'Mostraste cohortes al board sabiendo que dolía.' },
    { id:'sindeuda',  n:'Acreedor',              d:'Terminaste un puesto con deuda técnica menor a 20.' },
    { id:'biblioteca',n:'Ratón de biblioteca',   d:'Abriste 60 fichas de la biblioteca.' },
    { id:'rival',     n:'Cuentas pendientes',    d:'Terminaste una carrera por encima de tu rival.' },
    { id:'pleno',     n:'Pleno al verde',        d:'Cumpliste 4 mandatos seguidos.' },
    { id:'fenix',     n:'Fénix',                 d:'Promoción en el puesto siguiente a un despido.' },
    { id:'heisenberg',n:'El que golpea la puerta',d:'Terminaste un puesto con la Lupa arriba de 70, sin imputación.' },
    { id:'manoslimpias',n:'Manos limpias',        d:'Una carrera entera sin que la Lupa pase de 20.' },
    { id:'labanca',   n:'La banca gana',          d:'Cumpliste un mandato en la industria del juego.' },
    { id:'zafaste',   n:'Zafaste',                d:'Sobreviviste a un allanamiento.' }
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

  /* Se llama al cerrar un puesto. Devuelve los logros nuevos para mostrarlos. */
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

  /* Al terminar la carrera. */
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
