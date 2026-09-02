/* El mundo vivo: eras, ciclos por sector, noticias, el rival y el elenco.
   Age of Empires aporta las eras; NFS el rival; GTA el ticker y la gente.
   Sin build ni dependencias. */

var Mundo = (function () {
  'use strict';

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function el(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* Reto semanal: con semilla, los sorteos de era salen de un LCG guardado
     como número simple en el estado del mundo (sobrevive los guardados JSON),
     así todos los que juegan la misma semana enfrentan la misma secuencia de
     eras. Todo lo demás del juego sigue siendo realmente aleatorio.
     Sin semilla: Math.random como siempre. */
  function azarEra(m) {
    if (m.rng === undefined || m.rng === null) return Math.random();
    m.rng = (m.rng * 1664525 + 1013904223) % 4294967296;
    return m.rng / 4294967296;
  }
  function elEra(m, arr) { return arr[Math.floor(azarEra(m) * arr.length)]; }
  function rndEra(m, a, b) { return a + azarEra(m) * (b - a); }

  /* ---------------- ERAS ----------------
     Cada era calienta unos sectores y enfría otros, y cambia el humor del
     capital. Leer en qué era estás ES una habilidad del juego. */
  var ERAS = [
    { id:'longevidad', nombre:'El boom de la longevidad',
      desc:'Vivir más se puso de moda entre quienes pueden pagarlo. La biotecnología y la salud premium levantan lo que pidan.',
      calientes:['biogen','saludgold','ia'], frios:['devtools','market'],
      capital:1.25, dura:[10,16] },
    { id:'invierno', nombre:'El invierno del capital',
      desc:'Subieron las tasas y los cheques se achicaron. Sobrevivir es la estrategia.',
      calientes:[], frios:['banco','devtools','biogen','ia','market','strea'],
      capital:0.55, dura:[8,14] },
    { id:'electoral', nombre:'El año electoral',
      desc:'Todos quieren saber qué piensa la gente, y pagan por saberlo primero.',
      calientes:['datapol','strea'], frios:['renov','chips'],
      capital:0.95, dura:[8,12] },
    { id:'transicion', nombre:'La transición energética',
      desc:'Subsidios frescos, instalaciones récord y cada techo es una oportunidad.',
      calientes:['renov','devtools','chips'], frios:['datapol','strea'],
      capital:1.1, dura:[9,15] },
    { id:'fiebre', nombre:'La fiebre de las apuestas',
      desc:'Se legalizaron las apuestas en tres mercados grandes. Todos quieren su propio casino, nadie quiere las consecuencias.',
      calientes:['apuestas','strea'], frios:['saludgold','biogen'],
      capital:1.15, dura:[8,13] },
    { id:'regulacion', nombre:'El año de los reguladores',
      desc:'Después de dos escándalos, el cumplimiento dejó de ser opcional.',
      calientes:['ciber'], frios:['banco','datapol','biogen','apuestas','ia','market'],
      capital:0.8, dura:[8,13] },
    { id:'burbujaIA', nombre:'La burbuja de la IA',
      desc:'Cualquier cosa con dos letras en el nombre levanta a valuaciones absurdas. Las tarjetas gráficas se venden antes de fabricarse.',
      calientes:['ia','chips'], frios:['saludgold','renov'],
      capital:1.45, dura:[8,14] },
    { id:'brechas', nombre:'El año de las brechas',
      desc:'Tres filtraciones enormes en seis meses. Ningún comité aprueba nada sin el cuestionario de seguridad completo.',
      calientes:['ciber'], frios:['market','strea','datapol'],
      capital:0.9, dura:[8,12] }
  ];

  /* ---------------- NOTICIAS ---------------- */
  var NOTICIAS_ERA = {
    longevidad:['Otra ronda récord para una clínica de longevidad con cero resultados publicados.',
                'Un multimillonario anunció que planea vivir hasta los 150. Su médico prefirió no comentar.',
                'El precio de la secuenciación exprés acaba de triplicarse.'],
    invierno:['Tercer mes seguido de despidos en el sector. Los cheques van lentos.',
              'Un fondo grande devolvió capital: "no hay dónde ponerlo".',
              'La valoración mediana de Serie A cayó 40%.'],
    electoral:['Tres campañas contrataron a la misma consultora de datos. Nadie ve el conflicto.',
               'La encuesta que dominó la semana tenía una muestra de 400.',
               'Prohibieron el microtargeting político en dos provincias.'],
    transicion:['Instalaciones récord: el excedente solar del mediodía ya se vende a precio negativo.',
                'Una eléctrica firmó con una startup de baterías antes que con su proveedor de siempre.',
                'Nuevo subsidio para almacenamiento residencial: llueven instaladores.'],
    fiebre:['Un casino en línea patrocina a los tres equipos más grandes del país. Todos a la vez.',
            'Récord de apuestas en vivo durante el clásico. Récord de autoexclusiones el lunes.',
            'Un influencer de 19 años promociona una casa de apuestas sin licencia. Nadie lo frena.'],
    burbujaIA:['Una empresa de seis personas levantó a mil millones. El producto es una demo grabada.',
               'Se agotaron las tarjetas del próximo año. El año que viene también.',
               'Un fondo escribió en su tesis: "no invertimos en nada que no diga IA". Lo escribieron en serio.',
               'Tres empresas de software cambiaron el nombre esta semana. Todas agregaron dos letras.'],
    brechas:['Filtraron los datos de un país entero. El proveedor era la empresa que vendía la protección.',
             'Ninguna compra grande se firma sin el cuestionario de seguridad. Tiene 340 preguntas.',
             'Un ataque paró la logística de tres cadenas a la vez. El seguro dice que fue guerra.',
             'El regulador ahora exige avisar cualquier incidente en 72 horas. Nadie llega a 72 horas.'],
    regulacion:['Multa histórica para un banco digital: los controles de fraude eran una hoja de cálculo.',
                'Dos consultoras de datos políticos allanadas la misma mañana. Hubo arrestos.',
                'El regulador ahora exige trazabilidad total para cualquier uso político de datos.',
                'Dos ensayos génicos suspendidos por protocolos incompletos. Un ejecutivo dio declaraciones desde su yate.']
  };

  /* ---------------- ELENCO ---------------- */
  var NOMBRES = ['Rena','Iván','Sol','Bruno','Marga','Teo','Lupe','Andrés','Vera','Caro',
                 'Nico','Julia','Ramiro','Delfi','Max','Inés','Franco','Lola','Dante','Mora'];
  var APELLIDOS = ['Funes','Oyarzún','Beltrán','Sosa','Quiroga','Lask','Miranda','Peralta',
                   'Ibáñez','Cardoso','Vidal','Roldán','Arce','Bianchi','Kaufman','Duarte'];

  function nombrePersona() { return el(NOMBRES) + ' ' + el(APELLIDOS); }

  /* El elenco de una empresa: quiénes te hablan en los dilemas.
     Cada empresa de EMPRESAS trae su propio elenco fijo (nombres que suenan a
     los ejecutivos reales de su sector, sin serlo). Si no lo trae — el caso de
     tu propia empresa cuando fundas — se sortea uno. */
  var CARGOS = { ceo:'CEO', cto:'CTO', ventas:'VP de Ventas',
                 estrella:'Staff Engineer', board:'Board' };

  function elenco(empresaId) {
    var emp = (typeof empresaPorId === 'function' && empresaId) ? empresaPorId(empresaId) : null;
    var fijo = emp && emp.elenco ? emp.elenco : null;
    var out = {}, k;
    for (k in CARGOS) {
      if (!CARGOS.hasOwnProperty(k)) continue;
      var f = fijo ? fijo[k] : null;
      if (typeof f === 'string') out[k] = { nombre:f, cargo:CARGOS[k] };
      else if (f && f.nombre) out[k] = { nombre:f.nombre, cargo:f.cargo || CARGOS[k] };
      else out[k] = { nombre:nombrePersona(), cargo:CARGOS[k] };
    }
    return out;
  }

  /* ---------------- RIVAL (NFS) ----------------
     Arranca a tu nivel y avanza por su cuenta. Cuando tropiezas, el mundo
     te lo recuerda. Al final de la partida, te comparan. */
  /* El rival es siempre el mismo personaje: Lucas M. Sin conexión es un NPC;
     cuando el ranking público responde, una carrera real lo posee (fantasma)
     — pero el nombre en la puerta nunca cambia. */
  function nuevoRival() {
    return { nombre:'Lucas M', nivel:0, reputacion:38, hitos:[], fundo:false };
  }
  /* Un rival fantasma (la carrera de un jugador real del ranking público)
     trae un tope: sube igual pero se detiene en el nivel que de verdad
     alcanzó en la vida real. Los rivales NPC no tienen tope y se comportan
     como siempre. */
  function avanzarRival(mundo, mesesJugados, jugadorTropezo) {
    var r = mundo.rival;
    var tope = (r.tope === undefined || r.tope === null) ? 7 : r.tope;
    var p = 0.30 + (jugadorTropezo ? 0.25 : 0) + mesesJugados / 90;
    if (r.nivel < tope && Math.random() < p) {
      r.nivel = Math.min(tope, r.nivel + 1);
      if (r.nivel >= 7 && !r.fundo) { r.fundo = true; r.hitos.push('fundó su propia empresa y salió en la portada de una revista'); }
      else {
        var sabores = [
          'ascendió a ' + nivelPorN(r.nivel).rol,
          'ascendió a ' + nivelPorN(r.nivel).rol + ' pisando a dos colegas',
          'llegó a ' + nivelPorN(r.nivel).rol + ' tras un trimestre que nadie sabe explicar',
          'ya es ' + nivelPorN(r.nivel).rol + '. El pódcast lo presenta como visionario'
        ];
        r.hitos.push(sabores[Math.floor(Math.random() * sabores.length)]);
      }
      return true;
    }
    r.reputacion = clamp(r.reputacion + rnd(-3, 6), 0, 100);
    return false;
  }

  /* ---------------- estado del mundo ---------------- */
  function nuevo(semilla) {
    var m = {
      mes:0,
      rng:(semilla === undefined || semilla === null) ? null : (semilla % 4294967296),
      rival:nuevoRival(),
      noticias:[],
      registro:[]  /* historial de eras para el epílogo */
    };
    var era = elEra(m, ERAS);
    m.eraId = era.id;
    m.eraRestante = Math.round(rndEra(m, era.dura[0], era.dura[1]));
    return m;
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
      var nueva = elEra(m, candidatas);
      m.registro.push({ era:actual, hasta:m.mes });
      m.eraId = nueva.id;
      m.eraRestante = Math.round(rndEra(m, nueva.dura[0], nueva.dura[1]));
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
    /* sector caliente = todos se amontonan = el incumbente presta más atención */
    var c = calorSector(m, sectorId);
    return c > 0 ? 1.6 : c < 0 ? 0.6 : 1;
  }
  function modCapital(m) { return era(m).capital; }

  return { nuevo:nuevo, tick:tick, era:era, calorSector:calorSector,
           modAlcance:modAlcance, modAtencionCompetencia:modAtencionCompetencia,
           modCapital:modCapital, elenco:elenco, avanzarRival:avanzarRival,
           nombrePersona:nombrePersona, ERAS:ERAS };
})();
