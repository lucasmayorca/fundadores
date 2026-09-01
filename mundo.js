/* El mundo vivo: eras, ciclos por sector, noticias, rival y personajes.
   Age of Empires aporta las eras; NFS el rival; GTA el ticker y la gente.
   ES5 estricto (Safari 9). */

var Mundo = (function () {
  'use strict';

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function el(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* ---------------- ERAS ----------------
     Cada era calienta unos sectores y enfría otros, y cambia el humor del
     capital. Leer en qué era estás ES una habilidad del juego. */
  var ERAS = [
    { id:'longevidad', nombre:'El boom de la longevidad',
      desc:'Vivir más se puso de moda entre los que pueden pagarlo. Biotech y salud premium levantan lo que pidan.',
      calientes:['biogen','saludgold'], frios:['devtools'],
      capital:1.25, dura:[10,16] },
    { id:'invierno', nombre:'El invierno del capital',
      desc:'Las tasas subieron y los cheques se achicaron. Sobrevivir es la estrategia.',
      calientes:[], frios:['banco','devtools','biogen'],
      capital:0.55, dura:[8,14] },
    { id:'electoral', nombre:'El año electoral',
      desc:'Todo el mundo quiere saber qué piensa la gente, y paga por saberlo primero.',
      calientes:['datapol'], frios:['renov'],
      capital:0.95, dura:[8,12] },
    { id:'transicion', nombre:'La transición energética',
      desc:'Subsidios nuevos, tarifas récord y todo techo es una oportunidad.',
      calientes:['renov','devtools'], frios:['datapol'],
      capital:1.1, dura:[9,15] },
    { id:'fiebre', nombre:'La fiebre del juego',
      desc:'Legalizaron las apuestas en tres mercados grandes. Todo el mundo quiere su casino, nadie quiere las consecuencias.',
      calientes:['apuestas'], frios:['saludgold'],
      capital:1.15, dura:[8,13] },
    { id:'regulacion', nombre:'El año de los reguladores',
      desc:'Después de dos escándalos, cumplir dejó de ser opcional.',
      calientes:[], frios:['banco','datapol','biogen','apuestas'],
      capital:0.8, dura:[8,13] }
  ];

  /* ---------------- NOTICIAS ---------------- */
  var NOTICIAS_ERA = {
    longevidad:['Otra ronda récord para una clínica de longevidad sin resultados publicados.',
                'Un multimillonario anunció que piensa vivir hasta los 150. Su médico no opinó.',
                'Se triplicó el precio de la secuenciación exprés.'],
    invierno:['Tercer mes seguido de despidos en el sector. Los cheques tardan.',
              'Un fondo grande devolvió capital: "no hay dónde ponerlo".',
              'La valoración mediana de serie A cayó 40%.'],
    electoral:['Tres campañas contrataron a la misma consultora de datos. Nadie ve el conflicto.',
               'La encuesta que dominó la semana tenía una muestra de 400 casos.',
               'Prohibieron la microsegmentación política en dos provincias.'],
    transicion:['Tarifa récord: el excedente solar del mediodía ya cotiza en negativo.',
                'Una distribuidora firmó con una startup de baterías antes que con su proveedor histórico.',
                'Subsidio nuevo para almacenamiento residencial: lluvia de instaladores.'],
    fiebre:['Un casino online patrocina los tres equipos más grandes del país. A la vez.',
            'Récord de apuestas en vivo durante el clásico. Récord de autoexclusiones el lunes.',
            'Un influencer de 19 años promociona una casa de apuestas sin licencia. Nadie lo frena.'],
    regulacion:['Multa histórica a un banco digital: los controles de fraude eran una planilla.',
                'Allanaron dos consultoras de datos políticos la misma mañana. Hay detenidos.',
                'El regulador exige trazabilidad completa para todo uso político de datos.',
                'Suspendieron dos ensayos genéticos por protocolos incompletos. Un directivo declaró desde su yate.']
  };

  /* ---------------- PERSONAJES ---------------- */
  var NOMBRES = ['Rena','Iván','Sol','Bruno','Marga','Teo','Lupe','Andrés','Vera','Caro',
                 'Nico','Julia','Ramiro','Delfi','Max','Inés','Franco','Lola','Dante','Mora'];
  var APELLIDOS = ['Funes','Oyarzún','Beltrán','Sosa','Quiroga','Lask','Miranda','Peralta',
                   'Ibáñez','Cardoso','Vidal','Roldán','Arce','Bianchi','Kaufman','Duarte'];

  function nombrePersona() { return el(NOMBRES) + ' ' + el(APELLIDOS); }

  /* Elenco de una empresa: quién te habla en los dilemas. */
  function elenco() {
    return {
      ceo:    { nombre:nombrePersona(), cargo:'CEO' },
      cto:    { nombre:nombrePersona(), cargo:'CTO' },
      ventas: { nombre:nombrePersona(), cargo:'VP Ventas' },
      estrella:{ nombre:nombrePersona(), cargo:'Staff Engineer' },
      board:  { nombre:nombrePersona(), cargo:'Board' }
    };
  }

  /* ---------------- RIVAL (NFS) ----------------
     Arranca a tu nivel y avanza solo. Cuando vos tropezás, el mundo te lo
     recuerda. Al final de la carrera, se compara. */
  function nuevoRival() {
    return { nombre:nombrePersona(), nivel:0, reputacion:38, hitos:[], fundo:false };
  }
  function avanzarRival(mundo, mesesJugados, jugadorTropezo) {
    var r = mundo.rival;
    var p = 0.30 + (jugadorTropezo ? 0.25 : 0) + mesesJugados / 90;
    if (Math.random() < p) {
      r.nivel = Math.min(7, r.nivel + 1);
      if (r.nivel >= 7 && !r.fundo) { r.fundo = true; r.hitos.push('fundó su propia empresa y salió en la tapa de una revista'); }
      else {
        var sabores = [
          'ascendió a ' + nivelPorN(r.nivel).rol,
          'ascendió a ' + nivelPorN(r.nivel).rol + ' pisando a dos colegas',
          'llegó a ' + nivelPorN(r.nivel).rol + ' después de un trimestre que nadie sabe explicar',
          'es ' + nivelPorN(r.nivel).rol + ' ahora. El podcast lo presenta como visionario'
        ];
        r.hitos.push(sabores[Math.floor(Math.random() * sabores.length)]);
      }
      return true;
    }
    r.reputacion = clamp(r.reputacion + rnd(-3, 6), 0, 100);
    return false;
  }

  /* ---------------- estado del mundo ---------------- */
  function nuevo() {
    var era = el(ERAS);
    return {
      mes:0, eraId:era.id, eraRestante:Math.round(rnd(era.dura[0], era.dura[1])),
      rival:nuevoRival(),
      noticias:[],
      registro:[]  /* historial de eras para el epílogo */
    };
  }
  function era(m) {
    for (var i = 0; i < ERAS.length; i++) if (ERAS[i].id === m.eraId) return ERAS[i];
    return ERAS[0];
  }

  function tick(m) {
    m.mes++;
    m.eraRestante--;
    var cambio = null;
    if (m.eraRestante <= 0) {
      var actual = m.eraId, candidatas = [], i;
      for (i = 0; i < ERAS.length; i++) if (ERAS[i].id !== actual) candidatas.push(ERAS[i]);
      var nueva = el(candidatas);
      m.registro.push({ era:actual, hasta:m.mes });
      m.eraId = nueva.id;
      m.eraRestante = Math.round(rnd(nueva.dura[0], nueva.dura[1]));
      cambio = nueva;
    }
    if (Math.random() < 0.5) {
      var pool = NOTICIAS_ERA[m.eraId] || [];
      if (pool.length) {
        m.noticias.unshift({ mes:m.mes, txt:el(pool) });
        if (m.noticias.length > 6) m.noticias.pop();
      }
    }
    return cambio;
  }

  /* Multiplicadores que la era aplica a un sector. */
  function calorSector(m, sectorId) {
    var e = era(m);
    if (e.calientes.indexOf(sectorId) >= 0) return 1;   /* caliente */
    if (e.frios.indexOf(sectorId) >= 0) return -1;      /* frío */
    return 0;
  }
  function modAlcance(m, sectorId) {
    var c = calorSector(m, sectorId);
    return c > 0 ? 1.35 : c < 0 ? 0.7 : 1;
  }
  function modAtencionCompetencia(m, sectorId) {
    /* sector caliente = todos entran = el incumbente presta más atención */
    var c = calorSector(m, sectorId);
    return c > 0 ? 1.6 : c < 0 ? 0.6 : 1;
  }
  function modCapital(m) { return era(m).capital; }

  return { nuevo:nuevo, tick:tick, era:era, calorSector:calorSector,
           modAlcance:modAlcance, modAtencionCompetencia:modAtencionCompetencia,
           modCapital:modCapital, elenco:elenco, avanzarRival:avanzarRival,
           nombrePersona:nombrePersona, ERAS:ERAS };
})();
