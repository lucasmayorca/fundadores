/* The living world: eras, per-sector cycles, news, the rival and the cast.
   Age of Empires brings the eras; NFS the rival; GTA the ticker and the people.
   Strict ES5 (Safari 9). */

var Mundo = (function () {
  'use strict';

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function el(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* ---------------- ERAS ----------------
     Each era heats up some sectors and cools others, and shifts the mood of
     capital. Reading which era you're in IS a game skill. */
  var ERAS = [
    { id:'longevidad', nombre:'The longevity boom',
      desc:'Living longer got trendy among those who can pay for it. Biotech and premium health raise whatever they ask for.',
      calientes:['biogen','saludgold'], frios:['devtools'],
      capital:1.25, dura:[10,16] },
    { id:'invierno', nombre:'The capital winter',
      desc:'Rates went up and the checks got smaller. Survival is the strategy.',
      calientes:[], frios:['banco','devtools','biogen'],
      capital:0.55, dura:[8,14] },
    { id:'electoral', nombre:'The election year',
      desc:'Everyone wants to know what people are thinking, and pays to know it first.',
      calientes:['datapol'], frios:['renov'],
      capital:0.95, dura:[8,12] },
    { id:'transicion', nombre:'The energy transition',
      desc:'Fresh subsidies, record rates, and every rooftop is an opportunity.',
      calientes:['renov','devtools'], frios:['datapol'],
      capital:1.1, dura:[9,15] },
    { id:'fiebre', nombre:'The gambling fever',
      desc:'Betting got legalized in three big markets. Everyone wants their own casino, nobody wants the consequences.',
      calientes:['apuestas'], frios:['saludgold'],
      capital:1.15, dura:[8,13] },
    { id:'regulacion', nombre:'The year of the regulators',
      desc:'After two scandals, compliance stopped being optional.',
      calientes:[], frios:['banco','datapol','biogen','apuestas'],
      capital:0.8, dura:[8,13] }
  ];

  /* ---------------- NEWS ---------------- */
  var NOTICIAS_ERA = {
    longevidad:['Another record round for a longevity clinic with zero published results.',
                'A billionaire announced he plans to live to 150. His doctor declined to comment.',
                'The price of express sequencing just tripled.'],
    invierno:['Third straight month of layoffs across the sector. The checks are slow.',
              'A big fund returned capital: "nowhere to put it".',
              'Median Series A valuation dropped 40%.'],
    electoral:['Three campaigns hired the same data consultancy. Nobody sees the conflict.',
               'The poll that dominated the week had a sample of 400.',
               'Political microtargeting was banned in two provinces.'],
    transicion:['Record rates: midday solar surplus now trades at negative prices.',
                'A utility signed with a battery startup before its legacy supplier.',
                'New subsidy for residential storage: it\'s raining installers.'],
    fiebre:['An online casino sponsors the country\'s three biggest teams. All at once.',
            'Record live betting during the derby. Record self-exclusions on Monday.',
            'A 19-year-old influencer promotes an unlicensed sportsbook. Nobody stops him.'],
    regulacion:['Historic fine for a digital bank: the fraud controls were a spreadsheet.',
                'Two political data consultancies raided the same morning. Arrests were made.',
                'The regulator now demands full traceability for any political use of data.',
                'Two gene trials suspended over incomplete protocols. An executive gave a statement from his yacht.']
  };

  /* ---------------- CAST ---------------- */
  var NOMBRES = ['Rena','Iván','Sol','Bruno','Marga','Teo','Lupe','Andrés','Vera','Caro',
                 'Nico','Julia','Ramiro','Delfi','Max','Inés','Franco','Lola','Dante','Mora'];
  var APELLIDOS = ['Funes','Oyarzún','Beltrán','Sosa','Quiroga','Lask','Miranda','Peralta',
                   'Ibáñez','Cardoso','Vidal','Roldán','Arce','Bianchi','Kaufman','Duarte'];

  function nombrePersona() { return el(NOMBRES) + ' ' + el(APELLIDOS); }

  /* A company's cast: who talks to you in the dilemmas. */
  function elenco() {
    return {
      ceo:    { nombre:nombrePersona(), cargo:'CEO' },
      cto:    { nombre:nombrePersona(), cargo:'CTO' },
      ventas: { nombre:nombrePersona(), cargo:'VP Sales' },
      estrella:{ nombre:nombrePersona(), cargo:'Staff Engineer' },
      board:  { nombre:nombrePersona(), cargo:'Board' }
    };
  }

  /* ---------------- RIVAL (NFS) ----------------
     Starts at your level and advances on their own. When you stumble, the
     world reminds you. At the end of the run, you get compared. */
  function nuevoRival() {
    return { nombre:nombrePersona(), nivel:0, reputacion:38, hitos:[], fundo:false };
  }
  function avanzarRival(mundo, mesesJugados, jugadorTropezo) {
    var r = mundo.rival;
    var p = 0.30 + (jugadorTropezo ? 0.25 : 0) + mesesJugados / 90;
    if (Math.random() < p) {
      r.nivel = Math.min(7, r.nivel + 1);
      if (r.nivel >= 7 && !r.fundo) { r.fundo = true; r.hitos.push('founded their own company and made the cover of a magazine'); }
      else {
        var sabores = [
          'got promoted to ' + nivelPorN(r.nivel).rol,
          'got promoted to ' + nivelPorN(r.nivel).rol + ' by stepping on two colleagues',
          'made ' + nivelPorN(r.nivel).rol + ' after a quarter nobody can quite explain',
          'is ' + nivelPorN(r.nivel).rol + ' now. The podcast introduces them as a visionary'
        ];
        r.hitos.push(sabores[Math.floor(Math.random() * sabores.length)]);
      }
      return true;
    }
    r.reputacion = clamp(r.reputacion + rnd(-3, 6), 0, 100);
    return false;
  }

  /* ---------------- world state ---------------- */
  function nuevo() {
    var era = el(ERAS);
    return {
      mes:0, eraId:era.id, eraRestante:Math.round(rnd(era.dura[0], era.dura[1])),
      rival:nuevoRival(),
      noticias:[],
      registro:[]  /* era history for the epilogue */
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

  /* Multipliers the era applies to a sector. */
  function calorSector(m, sectorId) {
    var e = era(m);
    if (e.calientes.indexOf(sectorId) >= 0) return 1;   /* hot */
    if (e.frios.indexOf(sectorId) >= 0) return -1;      /* cold */
    return 0;
  }
  function modAlcance(m, sectorId) {
    var c = calorSector(m, sectorId);
    return c > 0 ? 1.35 : c < 0 ? 0.7 : 1;
  }
  function modAtencionCompetencia(m, sectorId) {
    /* hot sector = everyone piles in = the incumbent pays more attention */
    var c = calorSector(m, sectorId);
    return c > 0 ? 1.6 : c < 0 ? 0.6 : 1;
  }
  function modCapital(m) { return era(m).capital; }

  return { nuevo:nuevo, tick:tick, era:era, calorSector:calorSector,
           modAlcance:modAlcance, modAtencionCompetencia:modAtencionCompetencia,
           modCapital:modCapital, elenco:elenco, avanzarRival:avanzarRival,
           nombrePersona:nombrePersona, ERAS:ERAS };
})();
