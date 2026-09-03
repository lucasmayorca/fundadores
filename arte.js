/* Arte — los emblemas y placas que el juego dibuja solo.

   Por qué SVG en código y no PNG: la dirección "Terminal de Broker" es línea
   de 1px, plano, gris + ámbar. Eso es exactamente lo que hace un SVG, y de
   paso el ámbar sale de var(--color-accent) — si el token cambia, cambian los
   35 emblemas a la vez. En PNG el color queda quemado en el pixel y hay que
   regenerar todo.

   Es el mismo patrón que skylineSvg() en ui.js: una función que devuelve una
   cadena, que se inyecta con innerHTML. Sin build, sin dependencias, ES5.

   Lo que NO vive acá son las 32 imágenes que sí necesitan un modelo de imagen
   — las placas de sector, las bandas de era y los retratos del elenco. Esas
   son PNG en img/ porque son textura y grabado, no geometría.

   Convención de tamaños: cada familia dibuja en su propio viewBox y el
   consumidor decide el ancho. Nunca hay un tamaño en pixeles acá adentro. */

var Arte = (function () {
  'use strict';

  /* Los colores salen de los tokens, nunca de un hex suelto — salvo los
     semánticos (verde/ámbar/rojo), donde el color ES el dato y por eso
     también están en hex en estilos.css. */
  var BR = 'var(--color-text)';
  var MD = 'var(--color-neutral-600)';
  var ES = 'var(--color-neutral-700)';
  var LN = 'var(--color-divider)';
  var AM = 'var(--color-accent)';
  var VERDE = '#35c46a', ROJO = '#e2564a';
  var AMBAR_PUNTO = 'var(--color-accent)';

  function svg(vb, cls, cuerpo) {
    return '<svg class="' + cls + '" viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet" ' +
      'fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + cuerpo + '</svg>';
  }
  function p(d, color, w, extra) {
    return '<path d="' + d + '" stroke="' + color + '" stroke-width="' + w + '"' + (extra || '') + '/>';
  }
  function relleno(d, color) { return '<path d="' + d + '" fill="' + color + '" stroke="none"/>'; }
  function rect(x, y, w, h, color, sw, r) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' +
      (r ? ' rx="' + r + '"' : '') + ' stroke="' + color + '" stroke-width="' + sw + '"/>';
  }
  function rectR(x, y, w, h, color, r) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' +
      (r ? ' rx="' + r + '"' : '') + ' fill="' + color + '" stroke="none"/>';
  }
  function circ(cx, cy, r, color, sw) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="' + color + '" stroke-width="' + sw + '"/>';
  }
  function circR(cx, cy, r, color) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + color + '" stroke="none"/>';
  }

  /* ================= ESCALONES =================
     Los 8 puestos del ESCALAFON. La regla que los une: el elemento ámbar es
     el pedazo del mundo que ese puesto decide de verdad, y crece con el mando
     — de un charco de luz sobre una hoja (APM, 12%) a un séptimo del cap
     table (Fundador, 100%). Se leen a 64px. */

  var ESCALONES = [
    /* 0 · APM — mira mucho, decide muy poco: una hoja bajo una lámpara */
    function () {
      return p('M6 54.5h52', MD, 1.6) +
        p('M22 54.5h20l5 -7h-20z', BR, 1.8) +
        relleno('M31 52h9l2.6 -3.6h-9z', AM) +
        p('M26 51.5h4M28 49h3', MD, 1) +
        p('M10 54.5h10', BR, 2.2) +
        p('M15 54V34c0-7 5-11 11-12', BR, 1.8) +
        p('M25.5 17l12.5 4.5l-4.5 8.5l-12 -4.5z', BR, 1.8) +
        p('M23.5 27.5l11 4', AM, 1.8);
    },
    /* 1 · PM — elige qué se construye en su pedazo: una tarjeta del backlog */
    function () {
      return rect(7.5, 27.5, 25, 14, BR, 1.8, 2) +
        rect(11.5, 21.5, 7, 4, MD, 1.6, 1) + rect(21.5, 21.5, 7, 4, MD, 1.6, 1) +
        rect(16.5, 43.5, 7, 4, MD, 1.6, 1) +
        rectR(41, 19, 15, 8, AM, 1.5) +
        rect(41.5, 30.5, 14, 7, MD, 1.6, 1.5) +
        rect(41.5, 41.5, 14, 7, MD, 1.6, 1.5) +
        p('M33 34.5h7', ES, 1.4);
    },
    /* 2 · Sr PM — puede defender la plataforma: la viga que sostiene al resto */
    function () {
      return rect(17.5, 9.5, 29, 13, MD, 1.8, 1.5) +
        p('M24 22.5v6M40 22.5v6', ES, 1.5) +
        rectR(11, 30, 42, 6, AM, 2) +
        p('M18 43l4 -5M32 43l4 -5M46 43l4 -5', ES, 1.6) +
        p('M8 54.5h48', MD, 1.6);
    },
    /* 3 · GPM — varios equipos, un solo riel de roadmap */
    function () {
      return rect(8.5, 21.5, 13, 11, MD, 1.8, 1.5) +
        rect(25.5, 21.5, 13, 11, MD, 1.8, 1.5) +
        rect(42.5, 21.5, 13, 11, MD, 1.8, 1.5) +
        p('M15 32.5v6M32 32.5v6M49 32.5v6', ES, 1.5) +
        p('M6 42.5h52', AM, 3) +
        p('M12 48l3 -4M29 48l3 -4M46 48l3 -4', ES, 1.5);
    },
    /* 4 · Director — presupuesto y la puerta de contratar */
    function () {
      return p('M6 44.5c6 -4 12 -4 16 0c4 -4 10 -4 16 0', BR, 1.8) +
        p('M6 44.5V29c6 -4 12 -4 16 0c4 -4 10 -4 16 0v15.5', BR, 1.8) +
        p('M22 29v15.5', ES, 1.5) +
        rect(43.5, 13.5, 15, 37, AM, 2, 1) +
        circR(47.5, 33, 1.8, AM) +
        p('M8 54.5h48', MD, 1.4);
    },
    /* 5 · VP — define estrategia y precio: el dial es suyo */
    function () {
      return rect(6.5, 11.5, 33, 30, MD, 1.8, 1.5) +
        p('M11 19h20M11 25h24M11 31h16', ES, 1.6) +
        p('M20 41.5v9M12 50.5h16', ES, 1.6) +
        circ(49, 36, 10, AM, 2) +
        p('M49 36l6 -5', AM, 2.2) +
        circR(49, 36, 1.8, AM);
    },
    /* 6 · CPO — la mesa del directorio en planta, y la silla de la cabecera */
    function () {
      var h = rect(15.5, 19.5, 37, 25, BR, 1.8, 11), i;
      for (i = 0; i < 3; i++) {
        h += rectR(22 + i * 12, 12, 8, 5, MD, 1.5);
        h += rectR(22 + i * 12, 47, 8, 5, MD, 1.5);
      }
      h += rectR(5, 27, 6, 10, AM, 1.5);
      h += p('M11 32h4', AM, 1.8);
      return h;
    },
    /* 7 · Fundador — el cap table entero, y su propio pedazo */
    function () {
      var h = '', i, N = 7, cx = 32, cy = 28, r = 17;
      for (i = 0; i < N; i++) {
        var a0 = (i / N) * Math.PI * 2 - Math.PI / 2 + 0.07;
        var a1 = ((i + 1) / N) * Math.PI * 2 - Math.PI / 2 - 0.07;
        h += p('M' + (cx + Math.cos(a0) * r).toFixed(1) + ' ' + (cy + Math.sin(a0) * r).toFixed(1) +
          'A' + r + ' ' + r + ' 0 0 1 ' + (cx + Math.cos(a1) * r).toFixed(1) + ' ' +
          (cy + Math.sin(a1) * r).toFixed(1), i === 0 ? AM : MD, i === 0 ? 4.5 : 2.5);
      }
      h += p('M20 53.5h24M24 53.5v-6h16v6', BR, 1.8);
      return h;
    }
  ];

  function escalon(n) {
    var f = ESCALONES[Math.max(0, Math.min(ESCALONES.length - 1, n | 0))];
    return svg('0 0 64 64', 'ic-escalon', f());
  }

  /* ================= PASOS DE "CÓMO FUNCIONA" =================
     Reemplazan los números 1..5 de la portada, que venían pintados con
     azules y violetas de la dirección "Nocturne" vieja — colores que la
     paleta actual ya no admite. Glifos de línea en un lienzo de 24. */

  var PASOS = [
    /* 1 · el mes: estacionar los puntos del equipo */
    function () {
      return rect(2.5, 13.5, 4, 7, AM, 1.5, 1) + rect(8.5, 13.5, 4, 7, AM, 1.5, 1) +
        rect(14.5, 13.5, 4, 7, AM, 1.5, 1) + rect(20.5, 13.5, 3, 7, AM, 1.5, 1) +
        circR(10.5, 6, 2.2, AM) + p('M10.5 8.6v3.4M8.6 10.4l1.9 1.9l1.9 -1.9', AM, 1.5);
    },
    /* 2 · el mandato: un número antes de una fecha */
    function () {
      return p('M2 19c5 0 7 -12 12 -12s5 6 8 6', AM, 1.6) +
        p('M2 13h14', AM, 1.4, ' stroke-dasharray="2 2"') +
        p('M20 4v16', AM, 1.6) + p('M17.6 6.4L20 4l2.4 2.4', AM, 1.6);
    },
    /* 3 · la escalera: ocho escalones y vos en uno */
    function () {
      var h = '', i, alt = [3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5];
      for (i = 0; i < 8; i++) h += p('M' + (2 + i * 2.8) + ' 21v-' + alt[i], AM, 1.5);
      h += circR(2 + 3 * 2.8, 21 - 7.5 - 3, 1.8, AM);
      return h;
    },
    /* 4 · el mundo: la ola pasa y los sectores suben o bajan */
    function () {
      return p('M2 15c3 -5 5 5 8 0s5 5 8 0s3 -2 4 -2', AM, 1.6) +
        rect(3.5, 3.5, 3, 6, AM, 1.4, .8) + rect(9.5, 6.5, 3, 5, AM, 1.4, .8) +
        rect(15.5, 2.5, 3, 7, AM, 1.4, .8) + p('M4 19.5h16', AM, 1.2, ' stroke-dasharray="1.5 2"');
    },
    /* 5 · la biblioteca: el libro que es también el recibo */
    function () {
      return p('M3 5.5h7c1 0 2 .8 2 1.8v10c0 -1 -1 -1.8 -2 -1.8H3z', AM, 1.5) +
        p('M12 7.3c0 -1 1 -1.8 2 -1.8h7v6', AM, 1.5) +
        p('M21 11.5v9.8l-2 -1.4l-2 1.4l-2 -1.4l-2 1.4V15.5', AM, 1.5) +
        p('M15.5 14h3', AM, 1.2);
    }
  ];

  function paso(n) {
    var f = PASOS[Math.max(0, Math.min(PASOS.length - 1, (n | 0) - 1))];
    return svg('0 0 24 24', 'ic-paso', f());
  }

  /* ================= PILARES DE LA BIBLIOTECA =================
     Nueve marcas al modo de un ex libris: simétricas, grabadas, del mundo del
     papel. Es lo único de la interfaz que no pertenece a la terminal, y esa
     es justamente la idea — la biblioteca es el otro material del juego. */

  var PILARES_ARTE = {
    /* la semilla que se abre y sale disparada */
    startup: function () {
      return p('M24 34c-7 0 -11 -5 -11 -10c0 -5 5 -8 11 -8s11 3 11 8c0 5 -4 10 -11 10z', BR, 1.6) +
        p('M24 34V16', MD, 1.3) +
        p('M24 16l0 -6M20.5 12.5L24 9l3.5 3.5', AM, 1.8) +
        p('M15 39h18', MD, 1.3);
    },
    /* el calibre que mide la pieza */
    producto: function () {
      return rect(17.5, 20.5, 13, 13, MD, 1.6, 1) +
        p('M10 12v24M38 12v24', BR, 1.7) +
        p('M10 18h7M31 18h7', BR, 1.5) +
        p('M17 15v6M31 15v6', AM, 1.8);
    },
    /* la pista que se abre desde una sola vía */
    tech: function () {
      return circ(24, 12, 3.5, AM, 1.8) +
        p('M24 15.5v7', MD, 1.6) +
        p('M24 22.5h-9v8M24 22.5h9v8M24 22.5v10', BR, 1.6) +
        p('M15 34.5v3M24 32.5v5M33 34.5v3', MD, 1.4) +
        circ(15, 39, 2, MD, 1.4) + circ(24, 39, 2, MD, 1.4) + circ(33, 39, 2, MD, 1.4);
    },
    /* la pluma sobre las hojas */
    yc: function () {
      return p('M12 34h24l-2 5H14z', BR, 1.6) +
        p('M15 30h18l-1.5 4H16.5z', MD, 1.4) +
        p('M18 26h12l-1 4H19z', MD, 1.3) +
        p('M34 9c-8 4 -13 11 -15 19', AM, 1.8) +
        p('M34 9l-4.5 1.5l1.5 4.5', AM, 1.6);
    },
    /* el embudo que se muerde la cola */
    growth: function () {
      return p('M11 12h26l-10 12v11l-6 3V24z', BR, 1.6) +
        p('M27 30c8 0 10 -6 6 -9', AM, 1.7) +
        p('M33 21l0 4l3.5 -1.5', AM, 1.6);
    },
    /* la balanza: una moneda contra un reloj */
    capital: function () {
      return p('M24 10v28M16 38h16', BR, 1.7) +
        p('M9 18h30', MD, 1.5) +
        p('M4 18l5 8h-10z', BR, 1.5) + p('M44 18l5 8h-10z', BR, 1.5) +
        circ(9, 14, 3, AM, 1.7) +
        circ(39, 14, 3.2, MD, 1.5) + p('M39 12v2.2h1.8', MD, 1.3);
    },
    /* tres contornos que son uno solo */
    gente: function () {
      return circ(24, 15, 5, BR, 1.6) + p('M15 32c0 -5 4 -9 9 -9s9 4 9 9', BR, 1.6) +
        circ(12, 20, 4, MD, 1.4) + p('M5 33c0 -4 3 -7 7 -7', MD, 1.4) +
        circ(36, 20, 4, MD, 1.4) + p('M43 33c0 -4 -3 -7 -7 -7', MD, 1.4) +
        p('M14 38h20', AM, 2);
    },
    /* el escudo rajado, y la cinta que marca dónde */
    historias: function () {
      return p('M24 8l14 5v11c0 10 -6 17 -14 20c-8 -3 -14 -10 -14 -20V13z', BR, 1.6) +
        p('M20 14l6 9l-5 5l6 10', MD, 1.5) +
        p('M30 10v18l-3 -2.5l-3 2.5V12', AM, 1.7);
    },
    /* la tapa de alcantarilla con un gajo levantado */
    calle: function () {
      var h = circ(24, 25, 15, BR, 1.6) + circ(24, 25, 9, MD, 1.4), i;
      for (i = 0; i < 8; i++) {
        var a = i * Math.PI / 4;
        h += p('M' + (24 + Math.cos(a) * 9.5).toFixed(1) + ' ' + (25 + Math.sin(a) * 9.5).toFixed(1) +
          'L' + (24 + Math.cos(a) * 14.5).toFixed(1) + ' ' + (25 + Math.sin(a) * 14.5).toFixed(1),
          i === 6 ? AM : MD, i === 6 ? 2 : 1.3);
      }
      h += p('M18 11.5l6 -3.5l6 3.5', AM, 1.8);
      return h;
    }
  };

  function pilar(id) {
    var f = PILARES_ARTE[id] || PILARES_ARTE.startup;
    return svg('0 0 48 48', 'ic-pilar', f());
  }

  /* ================= LOS SEIS FINALES =================
     Bandas anchas y quietas — la imagen que llega después del hecho, no
     durante. El tercio izquierdo queda vacío: ahí va el titular. El acento no
     es el ámbar de siempre; cada final trae el color que le corresponde. */

  function bandaFinal(cuerpo) { return svg('0 0 464 70', 'placa-final', cuerpo); }

  var FINALES = {
    /* la empresa se vendió: la chica se funde en la grande */
    venta: function () {
      var h = p('M0 62.5h464', LN, 1), i, j;
      h += rect(226.5, 26.5, 62, 36, MD, 1.4);
      h += rect(288.5, 6.5, 84, 56, BR, 1.5);
      for (i = 0; i < 3; i++) for (j = 0; j < 3; j++)
        h += rectR(236 + j * 18, 34 + i * 10, 10, 6, 'var(--color-neutral-900)');
      for (i = 0; i < 4; i++) for (j = 0; j < 4; j++)
        h += rectR(298 + j * 18, 14 + i * 12, 11, 7, ES);
      h += p('M288.5 6.5v56', VERDE, 3);
      h += p('M226 68h60c10 0 6 -6 14 -6s10 6 20 6h72', MD, 1.3);
      return h;
    },
    /* se acabó la caja: las luces se apagan de derecha a izquierda */
    quiebra: function () {
      var h = p('M0 62.5h464', LN, 1) + rect(252.5, 8.5, 104, 54, MD, 1.4), i, j;
      for (i = 0; i < 5; i++) {
        for (j = 0; j < 6; j++) {
          var x = 259 + j * 16, y = 14 + i * 10, apagada = (j + i) < 7;
          if (j === 5 && i === 2) h += rectR(x, y, 10, 6, ROJO);
          else if (apagada) h += rect(x + 0.5, y + 0.5, 9, 5, 'var(--color-neutral-800)', 1);
          else h += rectR(x, y, 10, 6, ES);
        }
      }
      h += p('M356.5 30v6M356.5 44v6', ES, 1.2);
      return h;
    },
    /* te pidieron la renuncia: un escritorio vacío y una caja */
    despido: function () {
      return p('M0 62.5h464', LN, 1) +
        p('M236 44.5h84M244 44.5v18M312 44.5v18', BR, 1.5) +
        rect(258.5, 30.5, 26, 14, MD, 1.4) + p('M258.5 36.5h26M271 30.5v6', ES, 1.2) +
        rect(346.5, 6.5, 34, 56, MD, 1.4) +
        p('M380.5 6.5l24 8v48l-24 8', ROJO, 1.6) +
        circR(384, 36, 2, ROJO);
    },
    /* saliste esposado: la puerta giratoria y un cajón abierto */
    imputado: function () {
      var h = p('M0 62.5h464', LN, 1) + circ(300, 34, 27, MD, 1.4), i;
      for (i = 0; i < 4; i++) {
        var a = i * Math.PI / 2 + 0.4;
        h += p('M300 34L' + (300 + Math.cos(a) * 27).toFixed(1) + ' ' + (34 + Math.sin(a) * 27).toFixed(1), ES, 1.3);
      }
      h += p('M292 24c-3 3 -3 17 0 20h14', BR, 1.6);
      h += rect(352.5, 30.5, 44, 12, MD, 1.4) + rect(352.5, 44.5, 44, 12, MD, 1.4);
      h += p('M396.5 30.5h20v12h-20', ROJO, 1.6) + p('M404 36.5h6', ROJO, 1.4);
      return h;
    },
    /* tomaste la llamada, y después la salida: el tubo quedó fuera */
    renuncia: function () {
      return p('M0 62.5h464', LN, 1) +
        p('M232 52.5h108', BR, 1.5) + p('M242 52.5v10M330 52.5v10', MD, 1.3) +
        rect(258.5, 38.5, 40, 14, MD, 1.5, 2) +
        p('M266 38.5v-3h25v3', ES, 1.3) +
        p('M304 46c8 0 14 -3 18 -8', AM, 1.4, ' stroke-dasharray="3 3"') +
        p('M322 30c-4 0 -7 3 -7 6s3 6 7 6M322 30c4 0 7 3 7 6s-3 6 -7 6', AM, 1.8) +
        p('M322 36h14', AM, 1.8) +
        p('M370 12v14M362 26h16', MD, 1.5) +
        p('M366 26c0 5 -2 7 -5 9M374 26c0 5 2 7 5 9', ES, 1.3);
    },
    /* te quedaste corto: la misma curva, pero se apaga antes de la línea */
    corto: function () {
      var h = p('M0 62.5h464', LN, 1) + p('M232 28.5h150', ES, 1.3, ' stroke-dasharray="4 4"') + '', i;
      h += p('M232 56c26 0 40 -5 54 -12s26 -13 38 -15', MD, 1.6);
      h += circR(324, 29.5, 4, AMBAR_PUNTO);
      h += p('M330 29.5h52', ES, 1.2, ' stroke-dasharray="2 4"');
      h += p('M398 62.5h34M402 62.5V44h26v18.5', MD, 1.5);
      h += p('M406 44v-8h18v8', MD, 1.4);
      for (i = 0; i < 3; i++) h += p('M' + (238 + i * 8) + ' 62v-3', ES, 1.2);
      return h;
    },
    /* mandato cumplido: la curva cruza su meta y la silla se corre */
    cumplido: function () {
      var h = p('M0 62.5h464', LN, 1) + p('M232 28.5h150', ES, 1.3, ' stroke-dasharray="4 4"'), i;
      h += p('M232 56c26 0 40 -6 56 -16s34 -22 60 -22', BR, 1.6);
      h += circR(316, 28.5, 4, VERDE);
      h += p('M398 62.5h34M402 62.5V44h26v18.5', MD, 1.5);
      h += p('M406 44v-8h18v8', MD, 1.4);
      for (i = 0; i < 3; i++) h += p('M' + (238 + i * 8) + ' 62v-3', ES, 1.2);
      return h;
    }
  };

  function final(id) {
    var f = FINALES[id] || FINALES.cumplido;
    return bandaFinal(f());
  }

  /* ================= ESTADOS VACÍOS ================= */

  var VACIOS = {
    /* el Salón de la Fama sin nadie todavía */
    ranking: function () {
      return p('M120 30L96 118M200 30l24 88', ES, 1.2) +
        rect(60.5, 92.5, 60, 26, MD, 1.4) +
        rect(120.5, 74.5, 60, 44, BR, 1.5) +
        rect(180.5, 100.5, 60, 18, MD, 1.4) +
        p('M96 118h128', AM, 1.6, ' opacity=".55"') +
        p('M40 118h180', LN, 1.2);
    },
    /* la biblioteca sin una sola tarjeta abierta */
    biblio: function () {
      return p('M84 34h60c5 0 9 4 9 9v72c0 -5 -4 -9 -9 -9H84z', BR, 1.6) +
        p('M153 43c0 -5 4 -9 9 -9h12', MD, 1.4) +
        p('M100 34v44l9 -7l9 7V34', AM, 1.7) +
        p('M70 124h110', LN, 1.3);
    }
  };

  function vacio(id) {
    var f = VACIOS[id] || VACIOS.ranking;
    return svg('0 0 264 150', 'placa-vacia', f());
  }

  /* ================= LA MARCA =================
     Ocho barras que suben, la última en ámbar. Es la escalera reducida a lo
     mínimo que todavía se lee a 32px. Se usa en el ícono y en la cabecera. */

  function marca() {
    var h = '', i, MANDO = [0.12, 0.20, 0.32, 0.46, 0.62, 0.80, 0.92, 1.0];
    for (i = 0; i < 8; i++) {
      var alt = 6 + MANDO[i] * 42, x = 6 + i * 6.6;
      if (i === 7) h += rectR(x, 54 - alt, 5, alt, AM, 1);
      else h += rect(x + 0.5, 54.5 - alt, 4, alt, BR, 1.4, 1);
    }
    return svg('0 0 64 64', 'marca', h);
  }

  return {
    escalon: escalon, paso: paso, pilar: pilar,
    final: final, vacio: vacio, marca: marca
  };
})();
