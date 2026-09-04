/* Motor de simulación para un solo puesto. Un turno = un mes.
   Las leyes de los libros están integradas como física del mundo, no como texto.
   Sin dependencias, nunca toca el DOM. */

var Motor = (function () {
  'use strict';

  var COBERTURA_PLENA = 80;
  var SAL_ING = 11000, SAL_PROD = 11000, SAL_GTM = 8500;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  /* Rendimientos decrecientes, iguales para las cuatro estaciones. Crecimiento
     ya los tenia (alcance ∝ crec^0.75) y las otras tres eran lineales, y esa
     sola asimetría explicaba todo el reparto de dificultad del juego: los
     mandatos que comian una estacion lineal se cumplian casi siempre y los que
     comian crecimiento casi nunca. Tambien es lo cierto: no se multiplica por
     diez el descubrimiento poniendo diez veces mas gente — el decimo
     investigador no vuelve a aprender una décima parte de nuevo. */
  function rinde(pts, k) { return pts > 0 ? k * Math.pow(pts, 0.55) : 0; }
  function seg(id) {
    for (var i = 0; i < SEGMENTOS.length; i++) if (SEGMENTOS[i].id === id) return SEGMENTOS[i];
    return null;
  }
  /* Las apuestas derivadas (la segunda vuelta de algo ya entregado) nacen
     durante la partida y viven en e.derivadas, no en APUESTAS: son de ESA
     empresa y viajan en la partida guardada. Este índice es la copia rápida
     para que apuesta() las encuentre; se resincroniza al cargar y en cada
     relleno de backlog. */
  var _derivadas = {};
  function sincronizarDerivadas(e) {
    _derivadas = {};
    if (!e || !e.derivadas) return;
    for (var i = 0; i < e.derivadas.length; i++) _derivadas[e.derivadas[i].id] = e.derivadas[i];
  }
  function apuesta(id) {
    for (var i = 0; i < APUESTAS.length; i++) if (APUESTAS[i].id === id) return APUESTAS[i];
    return _derivadas[id] || contingenciaPorId(id) || null;
  }
  /* Una contingencia se construye con la misma maquinaria que una apuesta —
     mismo lookup, mismos slots, mismos puntos, misma barra de progreso — y por
     eso compite con las apuestas en la misma moneda y en el mismo lugar de la
     pantalla. Lo único que no comparte es el premio: entregarla no paga nada,
     solo evita el castigo. */
  function esContingencia(id) { return !!contingenciaPorId(id); }

  /* ---------------- lo que va antes ----------------
     Casi la mitad del backlog necesita que otra cosa exista primero: no se le
     pone una alerta a lo que todavía no medís, no se hace una app nativa sin
     una API, no se audita quién hizo qué sin identidades. La dependencia NO
     bloquea la tarjeta — bloquear sería quitarte la decisión. Cobra: se puede
     construir igual, sin la base, y entonces rinde la mitad y deja deuda.
     "Lo hicimos sin la base" es una frase que existe en todos los equipos, y
     el juego tiene que dejar tomarla y después cobrarla. */
  var FACTOR_SIN_BASE = 0.35;
  function depPendiente(e, id) {
    var a = apuesta(id);
    if (!a || !a.dep) return null;
    if (e.hechas && e.hechas[a.dep]) return null;
    return apuesta(a.dep);
  }
  function factorBase(e, id) { return depPendiente(e, id) ? FACTOR_SIN_BASE : 1; }

  /* Calibra UNA apuesta contra ESTA empresa: el impacto oculto que el jugador
     no ve, el ruido de la estimación, el talle, el costo en puntos y el vector
     de métricas. Vive aparte porque corre en tres momentos — al abrir el
     puesto, después de un pivote y cada vez que una entrega abre su
     continuación. Toda apuesta que llegue al backlog, venga de donde venga,
     tiene que pasar por acá o el motor la lee vacía.

     Los talles significan TIEMPO, literalmente, en TUS puntos mensuales:
     XL = el mes entero, L = dos semanas, M = una semana, S = ~3 días,
     XS = ~un día. Los costos se normalizan a tu capacidad para que la
     promesa siempre se cumpla. */
  var FACTOR_TALLE = { XL:1.0, L:0.5, M:0.25, S:0.12, XS:0.06 };
  function calibrarApuesta(e, a) {
    var et = ETAPAS[e.etapa] || {};
    var R = Math.max(6, Math.round(capacidad(e) * e.mando));
    if (!e.talles) e.talles = {};
    if (!e.vectores) e.vectores = {};
    if (!e.ruidosVec) e.ruidosVec = {};
    if (!e.costos) e.costos = {};
    var f = a.senuelo ? rnd(0.03, 0.20) : rnd(0.15, 1.25);
    if (et.prima && et.prima.indexOf(a.nec) >= 0) f *= 1.3;
    else if (et.castiga && et.castiga.indexOf(a.nec) >= 0) f *= 0.5;
    var costo = a.costo;
    if (e.perfil === 'grandes') {
      f = a.senuelo ? f : (Math.random() < 0.28 ? rnd(1.2, 2.0) : rnd(0.1, 0.5));
      costo = Math.round(a.costo * 1.25);
    } else if (e.perfil === 'chicas') {
      f = a.senuelo ? f : rnd(0.4, 0.95);
      costo = Math.max(4, Math.round(a.costo * 0.7));
    }
    e.impactos[a.id] = Math.max(2, Math.round(a.imp * f));
    e.ruidos[a.id] = rnd(-1, 1) * (e.perfil === 'incierto' ? 1.6 : 1);
    var talle = costo >= 24 ? 'XL' : costo >= 18 ? 'L' : costo >= 12 ? 'M' : costo >= 7 ? 'S' : 'XS';
    e.talles[a.id] = talle;
    e.costos[a.id] = Math.max(1, Math.round(R * FACTOR_TALLE[talle]));

    /* Vector de impacto en métricas pirata (AARRR de McClure + Fiabilidad).
       Cada apuesta mueve 1-3 métricas, a veces en NEGATIVO: la superficie
       nueva cuesta fiabilidad, la complejidad cuesta activación. El mandato
       apunta a una de estas métricas — ese es el hilo conductor. */
    var m2 = e.impactos[a.id];
    var vec = { adq:0, act:0, ret:0, rev:0, rel:0 };
    if (a.nec === 'core') { vec.act = m2 * 0.5; vec.ret = m2 * 0.35; }
    else if (a.nec === 'flujo') { vec.act = m2 * 0.7; vec.adq = m2 * 0.2; }
    else if (a.nec === 'datos') { vec.ret = m2 * 0.35; vec.rev = m2 * 0.3; }
    else if (a.nec === 'integra') { vec.adq = m2 * 0.4; vec.ret = m2 * 0.25; }
    else if (a.nec === 'soporte') { vec.ret = m2 * 0.5; vec.adq = m2 * 0.2; }
    else if (a.nec === 'segur') { vec.adq = m2 * 0.35; vec.rel = m2 * 0.25; }
    else if (a.nec === 'escala') { vec.rel = m2 * 0.8; }
    /* el efecto secundario: las features agregan superficie, y la superficie cuesta algo */
    if (Math.random() < 0.35 && a.nec !== 'escala' && a.nec !== 'segur') {
      if (Math.random() < 0.6) vec.rel -= rnd(1.5, 4.5);
      else vec.act -= rnd(1, 3);
    }
    var mk, vv2 = {};
    for (mk in vec) if (vec.hasOwnProperty(mk)) vv2[mk] = Math.round(vec[mk] * 10) / 10;
    e.vectores[a.id] = vv2;
    e.ruidosVec[a.id] = { adq:rnd(-1,1), act:rnd(-1,1), ret:rnd(-1,1), rev:rnd(-1,1), rel:rnd(-1,1) };
    return a;
  }

  /* Capacidades de la empresa: producto/tecnologia/gtm/gente solo se componen
     cuando las financia capital levantado (e.capFondeo) — sin combustible no hay
     crecimiento, sino erosión lenta. El capital solo se compone cerrando rondas.
     Las partidas guardadas viejas pueden no tener estos campos todavía, así que
     todo lector/escritor pasa por esta guarda. */
  function asegurarCapacidades(e) {
    if (!e.capacidades) e.capacidades = { producto:20, tecnologia:20, gtm:20, gente:20, capital:20 };
    if (e.capFondeo === undefined || e.capFondeo === null) e.capFondeo = 0;
  }

  /* ---------------- arrancar un puesto ---------------- */

  function nuevoPuesto(oferta, carrera, mundo) {
    var sec = sectorPorId(oferta.sector), et = ETAPAS[oferta.etapa], niv = nivelPorN(oferta.rolN), i;
    var emp = empresaPorId(oferta.empresaId);
    var nombreEmp = emp ? emp.nombre : (oferta.fundar ? 'tu empresa' : oferta.nombre);

    var e = {
      /* identidad del puesto */
      empresaId:oferta.empresaId, empresa:nombreEmp, sectorId:sec.id, sector:sec.nombre,
      etapa:oferta.etapa, rolN:oferta.rolN, rol:niv.rol, mando:niv.mando, palancas:niv.palancas,
      esFundador:oferta.rolN >= 7,
      mandatoId:oferta.mandatoId, meses:oferta.meses, mesPuesto:0,

      /* física del sector */
      precio:sec.precio, escalaSec:sec.escala, viral:sec.viral, cac:sec.cac,
      capex:sec.capex, gateReqs:sec.gateReqs, gateNombre:sec.gate,
      tipoIncidente:sec.incidente, retMod:sec.retMod,

      /* estado de la empresa */
      caja:oferta.cajaPropia || et.caja, mrr:0, valoracion:et.valoracion,
      ing:et.ing, prod:et.prod, gtm:et.gtm, rampa:[],
      deuda:et.deuda, arquitectura:et.arq, usabilidad:et.usab, marca:22 + et.arq * 0.2,
      fiabPercibida:78, presupuestoError:100,
      evidencia:18 + (et.arq * 0.15), calidadDesc:0.7, sesgo:0.4,
      moral:72, foco:52, politico:clamp(50 + carrera.reputacion / 4, 20, 85),

      cobertura:{}, impactos:{}, ruidos:{}, hechas:{}, enVuelo:{}, backlog:[], backlogNuevo:{},
      historialImpacto:[],
      usuarios:{}, tam:{},
      competidor:{ fuerza:sec.competidor, atencion:0.05 + et.arq * 0.002 },
      capTable:{ fund:oferta.rolN >= 7 ? 1.0 : 0, inv:0, pool:0 },
      preferencias:[], rondas:[],

      /* las habilidades del jugador, ya aplicadas como modificadores */
      hab:{ producto:carrera.hab.producto, tecnologia:carrera.hab.tecnologia,
            negocio:carrera.hab.negocio, liderazgo:carrera.hab.liderazgo },

      /* las capacidades propias de la empresa: arrancan de una semilla que le
         dieron las habilidades del fundador y luego crecen por su propia
         trayectoria, alimentadas por el capital levantado */
      capacidades:{
        producto:clamp(12 + carrera.hab.producto / 6, 0, 100),
        tecnologia:clamp(12 + carrera.hab.tecnologia / 6, 0, 100),
        gtm:clamp(12 + carrera.hab.negocio / 6, 0, 100),
        gente:clamp(12 + carrera.hab.liderazgo / 6, 0, 100),
        capital:12
      },
      capFondeo:0,

      lupa:0, lupaBase:0, lupaMax:0, imputado:false, zafo:false,
      palancaSecreta:false, conflictoInteres:false,
      perfil:oferta.perfil || 'parejo', techoPts:oferta.techo || et.techo || 30, costos:{},
      fase:et.fase || '', faseCorta:et.faseCorta || '', objetivo:et.objetivo || '',
      slots:oferta.slots || et.slots || 3,
      prima:et.prima || [], castiga:et.castiga || [], briefVisto:false,
      teamTopo:false, cd:false, cadenciaDesc:false, empoderado:false, fabrica:false,
      refactorFijo:false, reescritura:0, congelado:false, capacidadReservada:0,
      gateRevelado:false, levantando:false,
      riesgoExtra:0, retBonus:0, gtmBonus:0, infraExtra:0, penalCap:0,
      incidentesPuesto:0, apuestasCompletadas:0, gastoPropio:{},
      acum:{ desc:0, cons:0, plat:0, fiab:0, crec:0 },
      eventosVistos:{}, hist:[], vivo:true, final:null,
      elenco:Mundo.elenco(oferta.empresaId), calor:mundo ? Mundo.calorSector(mundo, sec.id) : 0,
      eraId:mundo ? mundo.eraId : '', rivalNombre:mundo ? mundo.rival.nombre : ''
    };

    var LUPA_BASE = { apuestas:15, datapol:10, banco:8, ia:8, biogen:6, market:6, saludgold:5, chips:5, ciber:4, strea:3 };
    e.lupaBase = LUPA_BASE[sec.id] || 0;
    e.lupa = e.lupaBase;

    /* Inicializar submétricas derivadas */
    setearSubmetricasBase(e);

    for (i = 0; i < NECESIDADES.length; i++) e.cobertura[NECESIDADES[i].id] = 0;

    /* la empresa ya viene con producto construido: la etapa define cuánto */
    var arranque = et.arq * 0.55 + 10;
    e.cobertura.core = arranque;
    e.cobertura.flujo = arranque * 0.7;
    e.cobertura.datos = arranque * 0.5;
    e.cobertura.integra = arranque * 0.3;
    e.cobertura.soporte = arranque * 0.3;
    e.cobertura.segur = arranque * 0.25;
    e.cobertura.escala = arranque * 0.4;

    for (i = 0; i < SEGMENTOS.length; i++) {
      var s = SEGMENTOS[i];
      e.tam[s.id] = Math.max(60, Math.round(s.tam * sec.escala));
      e.usuarios[s.id] = 0;
    }
    var sem = et.usuariosBase;
    e.usuarios.innov = e.tam.innov * Math.min(0.9, sem * 9);
    e.usuarios.visio = e.tam.visio * Math.min(0.6, sem * 4);
    e.usuarios.pragm = e.tam.pragm * Math.min(0.25, sem * 0.5);

    /* El perfil de la empresa define su juego de priorización:
       'grandes'  = unas pocas apuestas dominan, el resto vale poco;
       'chicas'   = todo más barato y de tamaño parejo, nada mueve la aguja por sí solo;
       'incierto' = las estimaciones vienen con ruido extra. */
    e.talles = {};
    e.vectores = {};
    e.ruidosVec = {};
    e.derivadas = [];
    e.derivadoDe = {};
    e.cont = [];
    e.contVistas = {};
    e.espera = {};
    e.pendientes = [];
    /* Integración intrínseca, clase `info`: la llamada que el jugador hace
       ANTES de que los datos cierren, y su calibración acumulada. Ver
       llamarApuesta() más abajo. */
    e.llamadas = {};
    e.calib = { ok:0, n:0 };
    sincronizarDerivadas(e);
    for (i = 0; i < APUESTAS.length; i++) calibrarApuesta(e, APUESTAS[i]);
    /* la empresa llegó viva hasta acá: su arquitectura sostiene lo que ya
       tiene, con poco margen. El margen te toca construirlo a ti. */
    var uIni = usuarios(e);
    if (uIni > 0) {
      var arqMin = 15 * Math.log(uIni / (400 * 0.72)) / Math.log(2);
      if (e.arquitectura < arqMin) e.arquitectura = Math.round(arqMin);
    }
    rellenarBacklog(e);

    e.mrr = calcularMrr(e);
    e.usuariosInicio = usuarios(e);
    e.usabilidadInicio = usabilidadIndice(e);
    e.moralMin = e.moral;
    e.precioInicio = e.precio;
    e.mrrInicio = e.mrr;
    e.evidenciaInicio = e.evidencia;
    /* el punto cero de la barra de mandato: de donde arrancaste, para que el
       progreso se dibuje contra tu propia linea de partida y no contra 0 */
    e.retencionInicio = retencionMedia(e);
    e.deudaInicio = e.deuda;
    return e;
  }

  /* ---------------- el visto bueno ----------------
     Lo que frena una iniciativa no es la ingenieria: es una persona que no
     contesta. Mientras espera, sigue ocupando su slot y no avanza un punto.
     La probabilidad sube con cuantas cosas tenes en vuelo a la vez — cada
     frente abierto es otra puerta que alguien te puede cerrar — y baja con tu
     mando: a un VP le contestan el mail. Por eso subir en el escalafon no te da
     solo más puntos, y por eso el capital político deja de ser una barra de
     vida y pasa a ser algo que gastas. */

  var ETAPA_VISTO = { semilla:0.45, serieA:0.8, serieB:1.2, serieC:1.55 };
  var SECTOR_VISTO = { banco:1.4, biogen:1.45, saludgold:1.35, ciber:1.3, datapol:1.3, apuestas:1.35, chips:1.15 };

  function enEspera(e, id) { return !!(e.espera && e.espera[id]); }
  function costoEscalar(e) { return Math.max(5, Math.round(11 - e.mando * 6)); }

  /* Gastas credito interno para que alguien te conteste hoy. Es la unica
     salida rapida, y sale exactamente de la misma cuenta que mira el directorio
     cuando decide si te asciende. */
  function escalar(e, id) {
    if (!enEspera(e, id)) return null;
    var v = e.espera[id], costo = costoEscalar(e);
    delete e.espera[id];
    e.politico -= costo;
    return { quien:v.quien, cargo:v.cargo, costo:costo };
  }

  function tickEsperas(e, log) {
    if (!e.espera) e.espera = {};
    var id, v, libres = [], i;
    /* las que ya estaban: se destraban solas, tarde o temprano */
    for (id in e.espera) if (e.espera.hasOwnProperty(id)) {
      v = e.espera[id];
      v.meses++;
      if (Math.random() < 0.34 + v.meses * 0.10) {
        log.push({ tipo:'bueno', libro:'grove', visto:'suelta',
          texto:v.quien + ' finalmente contestó y "' + v.n + '" vuelve a moverse. ' +
                'Estuvo ' + v.meses + (v.meses === 1 ? ' mes' : ' meses') + ' parada esperando un sí que nunca fue un no.' });
        delete e.espera[id];
      }
    }
    /* candidatas a bloquearse: lo tuyo en vuelo, sin contar contingencias */
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) {
      if (esContingencia(id) || enEspera(e, id)) continue;
      libres.push(id);
    }
    var yaEsperando = 0;
    for (id in e.espera) if (e.espera.hasOwnProperty(id)) yaEsperando++;
    if (!libres.length || yaEsperando >= 2) return;

    var pBloq = (0.20 + 0.10 * (libres.length - 1)) *
                (1 - e.mando * 0.5) *
                (ETAPA_VISTO[e.etapa] || 1) *
                (SECTOR_VISTO[e.sectorId] || 1);
    if (Math.random() >= clamp(pBloq, 0, 0.75)) return;

    id = libres[Math.floor(Math.random() * libres.length)];
    var a = apuesta(id);
    if (!a) return;
    var vd = vistoDe(a.nec);
    var per = (e.elenco && e.elenco[vd.quien]) || { nombre:'Alguien de arriba', cargo:'' };
    e.espera[id] = { n:a.n, quien:per.nombre, cargo:per.cargo, txt:vd.txt, meses:0 };
    log.push({ tipo:'malo', libro:'grove', visto:'traba',
      texto:'"' + a.n + '" quedó esperando el visto bueno de ' + per.nombre +
            (per.cargo ? ' (' + per.cargo + ')' : '') + ': ' + vd.txt +
            ' Sigue ocupando su slot y no avanza hasta que alguien conteste.' });
  }

  /* ---------------- el impacto llega tarde ----------------
     Entregar no es saber. Lo que construiste es tuyo el dia que sale — la
     cobertura, la deuda, el tick de compuerta — pero lo que MUEVE tarda: la
     gente tiene que encontrarlo, entenderlo y volver. El número real aparece
     dos meses despues, y para entonces ya comprometiste el plan siguiente.
     Eso es lo que convierte el juego en una apuesta y no en una cuenta. */

  var TRAMOS = [0.4, 0.35, 0.25];

  function aplicarVector(e, vec, frac, partes) {
    if (vec.adq) { e.marca = clamp(e.marca + vec.adq * 0.6 * frac, 0, 100); if (partes) partes.push('ACQ ' + (vec.adq > 0 ? '+' : '') + Math.round(vec.adq * frac * 10) / 10); }
    if (vec.act) { e.usabilidad = clamp(e.usabilidad + vec.act * 0.8 * frac, 0, 100); if (partes) partes.push('ACT ' + (vec.act > 0 ? '+' : '') + Math.round(vec.act * frac * 10) / 10); }
    if (vec.ret) { e.retBonus = (e.retBonus || 0) + vec.ret * 0.0015 * frac; if (partes) partes.push('RET ' + (vec.ret > 0 ? '+' : '') + Math.round(vec.ret * frac * 10) / 10); }
    if (vec.rev) { e.precio = Math.max(1, Math.round(e.precio * (1 + vec.rev * 0.004 * frac))); if (partes) partes.push('REV ' + (vec.rev > 0 ? '+' : '') + Math.round(vec.rev * frac * 10) / 10); }
    if (vec.rel) { e.arquitectura += vec.rel * 0.5 * frac; e.fiabPercibida = clamp(e.fiabPercibida + vec.rel * 0.4 * frac, 0, 100); if (partes) partes.push('REL ' + (vec.rel > 0 ? '+' : '') + Math.round(vec.rel * frac * 10) / 10); }
  }

  /* ---------------- tu llamada ----------------
     El jugador puede comprometer, cuando elige la iniciativa, si cree que va a
     rendir MÁS, IGUAL o MENOS que lo que el backlog le promete. Es opcional a
     propósito: obligarlo metería un paso en cada mes, y lo que enseña no es el
     trámite sino el contraste — cuando la llamada existe, el cierre le dice si
     su criterio era bueno, no si tuvo suerte.

     Es la clase `info` de INTEGRA hecha mecánica. La estimación que ve viene
     con un error cuyo ancho es (100 − evidencia) y cuyo sesgo es la calidad de
     su discovery; con evidencia baja va a fallar sus llamadas y lo va a ver en
     su propio marcador, que es la única forma honesta de aprender que ese
     número era ruido. Y separa las dos preguntas que se mezclan siempre:
     ¿decidí bien? y ¿salió bien? */
  var NOMBRE_LLAMADA = { mas:'MÁS', igual:'IGUAL', menos:'MENOS' };
  var BANDA_LLAMADA = 0.15;

  function juzgarLlamada(llamada, real, esperado) {
    var r = real / Math.max(1, esperado);
    if (llamada === 'mas') return r >= 1 + BANDA_LLAMADA;
    if (llamada === 'menos') return r <= 1 - BANDA_LLAMADA;
    return r > 1 - BANDA_LLAMADA && r < 1 + BANDA_LLAMADA;
  }
  /* la UI llama acá: null borra la llamada, y solo se puede llamar lo que
     todavía no cerró sus datos */
  function llamarApuesta(e, id, llamada) {
    if (!e.llamadas) e.llamadas = {};
    if (!llamada) delete e.llamadas[id];
    else e.llamadas[id] = llamada;
  }
  function calibracion(e) {
    var c = e.calib || { ok:0, n:0 };
    return { ok:c.ok, n:c.n, pct:c.n ? c.ok / c.n : null };
  }
  /* Qué concepto está en juego cuando el jugador hace su llamada. Sin esto, la
     mecánica enseñaba la lección y no nombraba el libro: la clase `info`
     quedaba en 2 de 16 conceptos presentes en el momento de decidir. El orden
     es de causa — primero lo que más está deformando el número que va a
     juzgar, y solo si no hay nada torcido, el marco general. */
  function libroDeLlamada(e) {
    if (e.calidadDesc < 0.6) return 'momtest';
    if (e.evidencia < 45) return 'lean';
    if ((e.calib || { n:0 }).n >= 3) return 'thinkingbets';
    if (e.evidencia < 70) return 'torres';
    return 'analytics';
  }

  function tickPendientes(e, log) {
    if (!e.pendientes) e.pendientes = [];
    var quedan = [], i, pn;
    for (i = 0; i < e.pendientes.length; i++) {
      pn = e.pendientes[i];
      var frac = TRAMOS[pn.tramo] || 0;
      aplicarVector(e, pn.vec, frac, null);
      pn.tramo++;
      if (pn.tramo < TRAMOS.length) { quedan.push(pn); continue; }
      /* llegaron los datos completos: recien ahora sabes si sirvio */
      if (!e.historialImpacto) e.historialImpacto = [];
      e.historialImpacto.unshift({ n:pn.n, real:pn.real, esperado:pn.esperado, vec:pn.vec, mes:e.mesPuesto });
      e.historialImpacto = e.historialImpacto.slice(0, 6);
      var frase = 'Cerraron los datos de "' + pn.n + '": impacto real ' + pn.real +
                  ' (esperabas ' + pn.esperado + ' cuando lo elegiste).';
      /* La llamada del jugador se resuelve acá, y es lo único del juego que
         califica su CRITERIO en vez de su resultado: una buena decisión puede
         salir mal. Por eso la calibración se lleva aparte del mandato. */
      if (pn.llamada) {
        var acerto = juzgarLlamada(pn.llamada, pn.real, pn.esperado);
        if (!e.calib) e.calib = { ok:0, n:0 };
        e.calib.n++;
        if (acerto) e.calib.ok++;
        frase += ' Habías dicho que iba a rendir ' + NOMBRE_LLAMADA[pn.llamada] + ': ' +
          (acerto ? 'acertaste' : 'te equivocaste') + '. Tu calibración va ' + e.calib.ok + ' de ' + e.calib.n + '.';
      }
      if (pn.real < pn.esperado * 0.55) {
        log.push({ tipo:'malo', libro:pn.evidencia < 45 ? 'lean' : 'trap',
          texto:frase + (pn.evidencia < 45 ?
            ' Con evidencia en ' + Math.round(pn.evidencia) + ', la estimación que viste era ruido con cara de número: ' +
            'no fallaste al construir, fallaste al elegir sin saber.' :
            ' La evidencia estaba bien, así que el problema no era la información: esta necesidad ya estaba cubierta ' +
            'para el segmento que la pedía, y cubrirla más no movía a nadie.'),
          ship:{ n:pn.n, real:pn.real, esperado:pn.esperado, vec:pn.vec } });
      } else {
        log.push({ tipo:pn.real >= pn.esperado * 0.8 ? 'bueno' : 'malo', libro:'inspired', texto:frase,
          ship:{ n:pn.n, real:pn.real, esperado:pn.esperado, vec:pn.vec } });
      }
    }
    e.pendientes = quedan;
  }

  /* ---------------- contingencias ----------------
     El mes nunca es tuyo entero. Esto es la parte que no es tuya: llega sola,
     ocupa un slot desde el dia que aparece, no mueve el mandato ni un punto, y
     tiene fecha de vencimiento. Es la razón número uno por la que un roadmap
     real se atrasa, y hasta ahora el juego no la tenia. */

  function contActiva(e, id) {
    if (!e.cont) return null;
    for (var i = 0; i < e.cont.length; i++) if (e.cont[i].id === id) return e.cont[i];
    return null;
  }
  function hayContingencia(e) { return !!(e.cont && e.cont.length); }

  /* Lo que te cuesta este mes tenerla abierta, en PORCENTAJE de la capacidad.
     En porcentaje y no en puntos a propósito: el lastre pega sobre la
     capacidad de la organizacion entera, y decirlo en puntos al lado de tu
     presupuesto personal — que es una fraccion, la de tu mando — se lee como
     un error. Va en la tarjeta y no en un desglose aparte: la explicación
     tiene que estar pegada a la causa. */
  function lastreContingencia(e, id) {
    var cx = contActiva(e, id), c = contingenciaPorId(id);
    if (!cx || !c) return 0;
    return Math.round(9 * (c.plazo - cx.restante + 1));
  }

  /* El costo se normaliza contra la capacidad de HOY, no la del mes cero: una
     contingencia que llega en el mes 9 cuesta lo que cuesta un mes 9. */
  function costoContingencia(e, c) {
    var R = Math.max(6, Math.round(capacidad(e) * e.mando));
    var talle = c.costo >= 24 ? 'XL' : c.costo >= 18 ? 'L' : c.costo >= 12 ? 'M' : c.costo >= 7 ? 'S' : 'XS';
    if (!e.talles) e.talles = {};
    if (!e.costos) e.costos = {};
    e.talles[c.id] = talle;
    e.costos[c.id] = Math.max(1, Math.round(R * FACTOR_TALLE[talle]));
    return e.costos[c.id];
  }

  function llegarContingencia(e, log) {
    var pool = [], propias = [], i, c;
    for (i = 0; i < CONTINGENCIAS.length; i++) {
      c = CONTINGENCIAS[i];
      if (e.contVistas[c.id]) continue;
      if (c.sectores && c.sectores.indexOf(e.sectorId) < 0) continue;
      var ok = false;
      try { ok = c.cuando(e); } catch (err) { ok = false; }
      if (!ok) continue;
      pool.push(c);
      if (c.sectores) propias.push(c);
    }
    if (!pool.length) return null;
    /* las del oficio entran primero la mitad de las veces: en un neobanco la
       licencia que vence ES el trabajo, no una distraccion generica */
    var fuente = (propias.length && Math.random() < 0.5) ? propias : pool;
    c = fuente[Math.floor(Math.random() * fuente.length)];
    e.contVistas[c.id] = true;
    e.cont.push({ id:c.id, restante:c.plazo });
    e.enVuelo[c.id] = 0;
    costoContingencia(e, c);
    log.push({ tipo:'malo', libro:c.libro, cont:'llega',
      texto:'Contingencia: "' + c.n + '". ' + c.d + ' Ocupa un slot desde hoy, no mueve tu mandato ni un punto, ' +
            'y vence en ' + c.plazo + (c.plazo === 1 ? ' mes' : ' meses') + '. Hacerla no te paga: no hacerla te cobra.' });
    return c;
  }

  /* Corre al cierre del mes: descuenta plazos, cobra los vencidos y decide si
     llega una nueva. Una sola activa a la vez — la presión tiene que ser
     legible, no un aluvión. */
  function tickContingencias(e, log) {
    if (!e.cont) e.cont = [];
    if (!e.contVistas) e.contVistas = {};
    var quedan = [], i, cx, c;
    for (i = 0; i < e.cont.length; i++) {
      cx = e.cont[i];
      c = contingenciaPorId(cx.id);
      if (!c) continue;
      cx.restante--;
      if (cx.restante > 0) {
        quedan.push(cx);
        if (cx.restante === 1) log.push({ tipo:'malo', libro:c.libro, cont:'avisa',
          texto:'"' + c.n + '" vence el mes que viene. Sigue ocupando un slot y ya se come el ' +
                lastreContingencia(e, cx.id) + '% de la capacidad del equipo: cuanto más vieja, más cara. ' +
                'Si vence, el trabajo se hace igual — pero de urgencia, mal, y con todos mirando.' });
        continue;
      }
      /* Vencio sin entregarse. Se libera el slot, pero el trabajo no
         desaparece: se hace igual, de urgencia, con todos mirando. Y lo que se
         hace de urgencia siempre cuesta lo mismo — deuda, porque se hace mal;
         evidencia, porque mientras se apaga un incendio nadie habla con un
         usuario; y credito interno, porque lo vieron venir tres meses. */
      var avance = Math.round(((e.enVuelo[cx.id] || 0) / Math.max(1, costoDe(e, cx.id))) * 100);
      delete e.enVuelo[cx.id];
      e.politico -= 4;
      e.deuda = clamp(e.deuda + 6, 0, 100);
      e.evidencia = clamp(e.evidencia - 10, 0, 100);
      log.push({ tipo:'malo', libro:c.libro, cont:'vence',
        texto:'Se acabó el plazo de "' + c.n + '"' +
              (avance <= 0 ? ', y nunca le pusiste un punto' : ', con un ' + avance + '% hecho') +
              '. Se hizo igual, de urgencia: +6 de deuda porque salió mal, −10 de evidencia porque ' +
              'mientras se apaga un incendio nadie habla con un usuario, y crédito interno porque ' +
              'lo vieron venir desde hace meses.' });
      try { c.castigo(e, log); } catch (err) {}
    }
    e.cont = quedan;

    if (e.mesPuesto < 2 || hayContingencia(e)) return;
    /* garantizada una vez por puesto: todo el mundo conoce la mecanica */
    var ninguna = true, k;
    for (k in e.contVistas) if (e.contVistas.hasOwnProperty(k)) ninguna = false;
    var prob = ninguna && e.mesPuesto >= 4 ? 1 : 0.35;
    if (Math.random() < prob) llegarContingencia(e, log);
  }

  /* ---------------- la segunda vuelta ---------------- */

  /* Entregar no cierra el tema: lo abre. Cada apuesta que sale deja atrás el
     trabajo que solo existe porque salió — la versión que el cliente configura
     solo, el modo sin conexión, las evaluaciones del asistente que hasta ayer
     era una demo. Por eso el backlog no se puede vaciar: por cada entrega,
     algo nuevo entra en el mismo mes.

     Las genéricas tienen su continuación escrita a mano (APUESTAS_SIGUE en
     contenido.js). Las de sector, y cualquier vuelta posterior a esa, se
     generan como iteración sobre la anterior: el impacto cae más rápido que el
     costo, así que volver a invertir en lo mismo rinde cada vez menos — pero
     rinde, y sigue siendo una decisión. */
  var VUELTAS = ['segunda vuelta', 'tercera vuelta', 'cuarta vuelta'];
  /* Hasta dónde estira un tema. Tres vueltas y el tema está exprimido: seguir
     ahí deja de ser una decisión y pasa a ser una cinta de correr. La única
     excepción es `forzar`, la red de último recurso de completarConDerivadas()
     cuando ya no queda absolutamente nada más que ofrecer. */
  var GEN_MAX = 3;

  function derivarSiguiente(e, idMadre, forzar) {
    if (!e.derivadas) e.derivadas = [];
    if (!e.derivadoDe) e.derivadoDe = {};
    if (e.derivadoDe[idMadre]) return null;
    var madre = apuesta(idMadre);
    if (!madre) return null;

    var raiz = madre.raiz || madre.id, gen = (madre.gen || 0) + 1, hija = null, k;
    if (gen > GEN_MAX && !forzar) return null;
    var escrita = (typeof APUESTAS_SIGUE !== 'undefined') ? APUESTAS_SIGUE[raiz] : null;
    if (gen === 1 && escrita) {
      hija = { id:escrita.id, nec:escrita.nec, costo:escrita.costo, imp:escrita.imp,
               n:escrita.n, d:escrita.d, d2:escrita.d2,
               impactoSubmetricas:escrita.impactoSubmetricas };
    } else {
      /* iteración: la misma necesidad, menos por ganar. El nombre lo dice para
         que el jugador no crea que está eligiendo algo nuevo. */
      var base = madre.n.split(' · ')[0];
      var idxV = gen - (escrita ? 2 : 1);
      var vuelta = VUELTAS[idxV] || ('vuelta ' + (idxV + 2));
      var subs = null, sm = madre.impactoSubmetricas;
      if (sm) {
        subs = {};
        for (k in sm) if (sm.hasOwnProperty(k)) {
          var v = Math.round(sm[k] * 0.7);
          if (v !== 0) subs[k] = v;
        }
      }
      /* el costo NO baja: volver sobre lo mismo cuesta lo que costaba, y paga
         menos. Si además saliera barato, iterar sería siempre la jugada obvia
         y el backlog dejaría de ser una decisión. */
      hija = { id:raiz + '_v' + (gen + 1), nec:madre.nec,
               costo:madre.costo,
               imp:Math.max(5, Math.round(madre.imp * 0.7)),
               n:base + ' · ' + vuelta,
               d:'Otra pasada sobre lo que ya salió.',
               d2:'Los bordes que quedaron, los casos raros, lo que nadie priorizó la primera vez. ' +
                  'Rinde menos que la vuelta anterior — y aun así hay meses en que es lo mejor que tenés.',
               impactoSubmetricas:subs };
    }
    hija.raiz = raiz;
    hija.gen = gen;
    /* si por algún camino la hija ya existe (partida vieja, doble entrega), no
       se duplica: se reusa la que ya está calibrada */
    for (k = 0; k < e.derivadas.length; k++) {
      if (e.derivadas[k].id === hija.id) {
        e.derivadoDe[idMadre] = hija.id;
        return null;
      }
    }
    if (apuesta(hija.id)) return null;

    e.derivadas.push(hija);
    e.derivadoDe[idMadre] = hija.id;
    sincronizarDerivadas(e);
    calibrarApuesta(e, hija);
    return hija;
  }

  /* Mete la hija en el backlog ahora mismo, no el mes que viene: la promesa es
     que por cada iniciativa que se ejecuta aparece otra. `mes` es el mes con el
     que se sella el chip "nuevo": las entregas se resuelven ANTES de que
     simular() incremente mesPuesto, así que desde ahí se pasa el mes que el
     jugador va a estar mirando, no el que acaba de terminar. */
  function abrirSiguiente(e, idMadre, mes, forzar) {
    var hija = derivarSiguiente(e, idMadre, forzar);
    if (!hija) return null;
    if (e.backlog.indexOf(hija.id) < 0) e.backlog.push(hija.id);
    if (!e.backlogNuevo) e.backlogNuevo = {};
    e.backlogNuevo[hija.id] = (mes === undefined ? e.mesPuesto : mes);
    return hija;
  }

  /* Red de seguridad: si el pool escrito a mano se agotó (partida larga, equipo
     grande, o una partida guardada de antes de que existiera la segunda
     vuelta), se abren continuaciones de lo ya entregado hasta llenar el
     backlog. Mientras algo se haya entregado alguna vez, siempre hay qué
     hacer. */
  function completarConDerivadas(e, tope) {
    if (!e.hechas) return 0;
    var puestas = 0, id, vueltas = 0, forzar = false;
    while (e.backlog.length < tope && vueltas < 60) {
      vueltas++;
      var abierta = false;
      for (id in e.hechas) {
        if (!e.hechas.hasOwnProperty(id)) continue;
        if (e.derivadoDe && e.derivadoDe[id]) continue;
        if (abrirSiguiente(e, id, undefined, forzar)) { abierta = true; puestas++; break; }
      }
      /* primera pasada respetando el tope de tres vueltas por tema; si aun así
         el backlog quedaría vacío, se levanta el tope. Preferimos una lista
         repetitiva a una lista vacía: sin iniciativas no hay juego. */
      if (!abierta) {
        if (forzar) break;
        forzar = true;
      }
    }
    return puestas;
  }

  /* El backlog mezcla lo genérico con lo propio del sector: en un neobanco la
     licencia ES el producto; en silicio, el respin. */
  function rellenarBacklog(e) {
    sincronizarDerivadas(e);
    var sec = sectorPorId(e.sectorId), pool = [], i, id;
    for (i = 0; i < sec.apuestas.length; i++) {
      id = sec.apuestas[i];
      var ap0 = apuesta(id);
      if (ap0 && ap0.etapa && ap0.etapa !== e.etapa) continue;
      if (!e.hechas[id] && !e.enVuelo[id] && e.backlog.indexOf(id) < 0) pool.push(id);
    }
    var propias = pool.length;
    for (i = 0; i < APUESTAS.length; i++) {
      id = APUESTAS[i].id;
      if (sec.apuestas.indexOf(id) >= 0) continue;
      if (esDeOtroSector(id, sec)) continue;
      if (!e.hechas[id] && !e.enVuelo[id] && e.backlog.indexOf(id) < 0) pool.push(id);
    }
    /* las apuestas propias del sector entran primero para que el backlog huela al oficio */
    var i2 = 0;
    while (e.backlog.length < 8 && pool.length) {
      var k = (i2++ < propias && propias > 0) ? 0 : Math.floor(Math.random() * pool.length);
      e.backlog.push(pool[k]);
      if (!e.backlogNuevo) e.backlogNuevo = {};
      e.backlogNuevo[pool[k]] = e.mesPuesto;
      pool.splice(k, 1);
      if (k === 0) propias--;
    }
    /* el pool escrito a mano es finito; el backlog no. Lo que falte se llena
       con la segunda vuelta de lo que ya entregaste. */
    if (e.backlog.length < 8) completarConDerivadas(e, 8);
  }

  /* Cada 2 meses, aunque nadie haya entregado nada, una apuesta libre (todavía
     no empezada) del backlog se cambia por otra del pool: el mercado no
     espera a que termines algo para moverse. */
  function refrescarBacklogPeriodico(e) {
    if (e.mesPuesto % 2 !== 0) return null;
    var libres = [], i, id;
    for (i = 0; i < e.backlog.length; i++) {
      id = e.backlog[i];
      if (!e.enVuelo || e.enVuelo[id] === undefined) libres.push(id);
    }
    if (!libres.length) return null;
    var sec = sectorPorId(e.sectorId), pool = [], propias = 0;
    for (i = 0; i < sec.apuestas.length; i++) {
      id = sec.apuestas[i];
      var ap0b = apuesta(id);
      if (ap0b && ap0b.etapa && ap0b.etapa !== e.etapa) continue;
      if (!e.hechas[id] && !e.enVuelo[id] && e.backlog.indexOf(id) < 0) { pool.push(id); propias++; }
    }
    for (i = 0; i < APUESTAS.length; i++) {
      id = APUESTAS[i].id;
      if (sec.apuestas.indexOf(id) >= 0) continue;
      if (esDeOtroSector(id, sec)) continue;
      if (!e.hechas[id] && !e.enVuelo[id] && e.backlog.indexOf(id) < 0) pool.push(id);
    }
    if (!pool.length) return null;
    var saliente = libres[Math.floor(Math.random() * libres.length)];
    var entrante = pool[propias > 0 ? 0 : Math.floor(Math.random() * pool.length)];
    e.backlog.splice(e.backlog.indexOf(saliente), 1, entrante);
    if (!e.backlogNuevo) e.backlogNuevo = {};
    e.backlogNuevo[entrante] = e.mesPuesto;
    delete e.backlogNuevo[saliente];
    return { saliente:apuesta(saliente), entrante:apuesta(entrante) };
  }

  function esDeOtroSector(id, sec) {
    for (var i = 0; i < SECTORES.length; i++) {
      if (SECTORES[i].id === sec.id) continue;
      if (SECTORES[i].apuestas.indexOf(id) >= 0) return true;
    }
    return false;
  }

  /* ---------------- lecturas ---------------- */

  function usuarios(e) {
    var t = 0;
    for (var i = 0; i < SEGMENTOS.length; i++) t += e.usuarios[SEGMENTOS[i].id] || 0;
    return Math.round(t);
  }

  /* tu ICP real hoy: qué % de la base actual es de cada segmento de Moore
     (innovadores/visionarios/mayoría temprana/tardía), de mayor a menor */
  function mixSegmentos(e) {
    var tot = usuarios(e), out = [], i;
    if (tot <= 0) return out;
    for (i = 0; i < SEGMENTOS.length; i++) {
      var v = e.usuarios[SEGMENTOS[i].id] || 0;
      if (v > 0) out.push({ seg:SEGMENTOS[i], pct:v / tot });
    }
    out.sort(function (a, b) { return b.pct - a.pct; });
    return out;
  }

  function nomina(e) { return e.ing * SAL_ING + e.prod * SAL_PROD + e.gtm * SAL_GTM; }
  function capacidadSistema(e) { return 400 * Math.pow(2, e.arquitectura / 15); }
  function carga(e) { return usuarios(e) / capacidadSistema(e); }

  function infra(e) {
    var u = usuarios(e), sobre = Math.max(0, carga(e) - 1);
    return 1200 + u * 0.30 * (1 + sobre * 2) + (e.infraExtra || 0) + (e.capex || 0);
  }
  function burnMensual(e) { return nomina(e) + infra(e); }
  function runwayMeses(e) {
    var neto = burnMensual(e) - e.mrr;
    if (neto <= 0) return 99;
    return e.caja / neto;
  }
  function calcularMrr(e) {
    var m = 0, i;
    for (i = 0; i < SEGMENTOS.length; i++) {
      var s = SEGMENTOS[i];
      m += (e.usuarios[s.id] || 0) * e.precio * s.paga;
    }
    return Math.round(m);
  }

  function fit(e, segId) {
    var s = seg(segId), suma = 0, i;
    for (i = 0; i < s.requiere.length; i++) {
      suma += Math.min(1, (e.cobertura[s.requiere[i]] || 0) / COBERTURA_PLENA);
    }
    var base = suma / s.requiere.length;
    var usa = 0.55 + (e.usabilidad / 100) * 0.45;
    var fia = 1 - s.exigFiab * (1 - e.fiabPercibida / 100);
    return clamp(base * usa * fia, 0, 1);
  }
  function fitMax(e) {
    var m = 0;
    for (var i = 0; i < SEGMENTOS.length; i++) m = Math.max(m, fit(e, SEGMENTOS[i].id));
    return m;
  }
  function retencion(e, segId) {
    var s = seg(segId);
    var r = s.retBase + (e.retMod || 0) + fit(e, segId) * 0.13 + (e.retBonus || 0);
    r -= (1 - e.fiabPercibida / 100) * s.exigFiab * 0.25;
    return clamp(r, 0.35, 0.99);
  }
  /* Los seis ejes del estado de la empresa, todos en 0-100 para que se puedan
     comparar, graficar en el radar y componer en un indice. `e.usabilidad` es
     la ACTIVACION cruda (que tan poco tienen que pensar los usuarios); la
     "usabilidad" del mandato es el indice compuesto de mas abajo. */
  function ejeValor(e, k) {
    if (k === 'act') return clamp(e.usabilidad, 0, 100);
    if (k === 'ret') return clamp(retencionMedia(e) * 100, 0, 100);
    if (k === 'rel') return clamp(e.fiabPercibida, 0, 100);
    if (k === 'adq') return clamp(e.marca, 0, 100);
    if (k === 'rev') return clamp(Math.log(1 + Math.max(0, e.mrr) / 1000) / Math.log(1 + 1000) * 100, 0, 100);
    if (k === 'ref') return clamp((e.viral || 0) * fitMax(e) * 100, 0, 100);
    if (k === 'evid') return clamp(e.evidencia, 0, 100);
    if (k === 'deuda') return clamp(100 - e.deuda, 0, 100);
    if (k === 'gate') return clamp(compuerta(e, 'pragm') * 100, 0, 100);
    return 0;
  }

  /* Usabilidad como INDICE, no como metrica suelta: 50% activacion, 30%
     retencion, 20% confiabilidad. Es lo que mide el mandato 'activacion' y lo
     que la barra segmentada de la cabecera dibuja por partes. */
  function usabilidadIndice(e) {
    return ejeValor(e, 'act') * 0.5 + ejeValor(e, 'ret') * 0.3 + ejeValor(e, 'rel') * 0.2;
  }

  function snapshotEjes(e) {
    var out = {}, ks = ['adq','act','ret','rel','rev','ref'], i;
    for (i = 0; i < ks.length; i++) out[ks[i]] = ejeValor(e, ks[i]);
    return out;
  }

  function retencionMedia(e) {
    var tot = usuarios(e), acc = 0, i;
    if (!tot) return retencion(e, 'innov');
    for (i = 0; i < SEGMENTOS.length; i++) {
      var id = SEGMENTOS[i].id;
      acc += retencion(e, id) * (e.usuarios[id] || 0);
    }
    return acc / tot;
  }

  /* La compuerta al mercado grande. Cada sector pide algo distinto y lo llama
     distinto, pero siempre funciona igual: sin eso, el alcance no convierte. */
  function requisitosGate(e) {
    var r = [], i, nec;
    r.push({ txt:'Referencias de gente como ellos',
             ok:(e.usuarios.visio || 0) >= e.tam.visio * 0.04 && fit(e, 'visio') >= 0.48 });
    for (i = 0; i < e.gateReqs.length; i++) {
      nec = null;
      for (var k = 0; k < NECESIDADES.length; k++) if (NECESIDADES[k].id === e.gateReqs[i][0]) nec = NECESIDADES[k];
      r.push({ txt:nec.nombre + ' (' + e.gateReqs[i][1] + ')',
               ok:(e.cobertura[e.gateReqs[i][0]] || 0) >= e.gateReqs[i][1] });
    }
    r.push({ txt:'Servicio confiable (70)', ok:e.fiabPercibida >= 70 });
    return r;
  }
  /* Qué fracción de la compuerta tenés lista. La compuerta como multiplicador
     vale 0.15 hasta que estan TODOS los requisitos y ahi salta a 1 — como
     barra de progreso eso es una línea plana y un salto, o sea ninguna
     informacion. Esto es lo mismo contado de forma legible. */
  function fraccionGate(e) {
    var r = requisitosGate(e), ok = 0, i;
    for (i = 0; i < r.length; i++) if (r[i].ok) ok++;
    return r.length ? ok / r.length : 0;
  }
  function compuerta(e, segId) {
    if (segId !== 'pragm' && segId !== 'conse') return 1;
    var r = requisitosGate(e), ok = 0, i;
    for (i = 0; i < r.length; i++) if (r[i].ok) ok++;
    if (ok === r.length) return segId === 'conse' ? 0.8 : 1;
    return 0.05 + 0.10 * (ok / r.length);
  }
  function abierto(e, segId) {
    if (segId === 'innov') return true;
    if (segId === 'visio') return (e.usuarios.innov || 0) >= e.tam.innov * 0.15;
    if (segId === 'pragm') return (e.usuarios.visio || 0) >= e.tam.visio * 0.08;
    return (e.usuarios.pragm || 0) >= e.tam.pragm * 0.10;
  }

  /* ---------------- capacidad ---------------- */

  function capacidad(e) {
    asegurarCapacidades(e);
    var base = e.ing * 20 + e.prod * 14;
    var fDeuda = 1 - (e.deuda / 100) * 0.55;
    var fMoral = 0.75 + (e.moral / 100) * 0.35;
    var fFoco = 0.85 + (clamp(e.foco, 0, 100) / 100) * 0.30;
    var tam = e.ing + e.prod;
    var umbral = (e.teamTopo ? 12 : 8) + Math.round(e.hab.liderazgo / 12) + Math.round(e.capacidades.gente / 20);
    var fCarga = tam <= umbral ? 1 : Math.max(0.55, 1 - 0.05 * (tam - umbral));
    var fCd = e.cd ? 1.12 : 1;
    var p = base * fDeuda * fMoral * fFoco * fCarga * fCd;
    p -= e.rampa.length * 6;
    p -= (e.capacidadReservada > 0 ? 8 : 0);
    p -= (e.penalCap || 0);
    return Math.max(4, Math.round(p));
  }
  /* Lo que te responde a ti. El resto de la organización sigue moviéndose sin
     pedirte permiso: eso es tener poco mando. */
  function capacidadPropia(e) { return Math.max(2, Math.round(capacidad(e) * e.mando)); }

  /* Cuánto te cuesta un factor, EN TUS PUNTOS: se recalcula la capacidad con
     ese campo puesto en su mejor valor posible y se resta. Así cada renglón
     del desglose está en la misma moneda que el jugador gasta — decir que la
     deuda le quita 163 cuando reparte 31 puntos no informa, informa decir que
     le quita 20 de esos 31. Es exacto por construcción: sale del mismo
     capacidad() que corre el mes. */
  /* Lo mismo para un multiplicador que no vive en un campo: cuántos puntos
     tuyos recuperarías si ese factor fuera 1. La atribución es marginal —
     los factores se componen — y es la misma cuenta que hace costoFactor. */
  function costoMult(e, f) {
    if (!f || f >= 1) return 0;
    return Math.round(capacidadPropia(e) * (1 / f - 1));
  }
  function costoFactor(e, campo, ideal) {
    var antes = e[campo], real = capacidadPropia(e);
    e[campo] = ideal;
    var techo = capacidadPropia(e);
    e[campo] = antes;
    return techo - real;
  }

  /* ---------------- de dónde salen tus puntos del mes ----------------
     Integración intrínseca, clase `capacidad` (ver INTEGRA en libros.js): el
     concepto no se explica en un panel al cerrar el mes — se nombra sobre el
     número que te quita puntos, en la pantalla donde estás repartiendo. Esa
     es la diferencia entre leer sobre la deuda técnica y verla cobrarte 19
     puntos antes de decidir en qué gastar los que quedan.

     Esta función existía y NO la llamaba nadie: los libros estaban declarados
     acá y el jugador no veía ninguno. Ahora la consume la pantalla del mes.

     Cada línea es un factor REAL de capacidad(), con el mismo signo y el mismo
     tamaño — si acá dice −19, en el total faltan 19. Las líneas se emiten solo
     cuando están activas, así el desglose son tres o seis renglones y no
     veinte. Cuando varias fichas comparten la variable, la que se nombra es la
     que habla del estado de HOY: con deuda alta manda Fowler, con deuda baja
     manda el Pragmatic Programmer, que es el que habla de no dejarla crecer. */
  function desgloseCapacidad(e) {
    asegurarCapacidades(e);
    var base = e.ing * 20 + e.prod * 14, d = [];
    var tam = e.ing + e.prod;
    var umbral = (e.teamTopo ? 12 : 8) + Math.round(e.hab.liderazgo/12) + Math.round(e.capacidades.gente/20);

    d.push({ k:'Capacidad de la org', v:base, nota:e.ing + ' ing × 20 + ' + e.prod + ' prod × 14' });
    /* de acá abajo todo está en TUS puntos, no en los de la org: es la moneda
       que el jugador está repartiendo ahora mismo */

    /* deuda: el único factor que empeora solo si lo ignorás */
    if (e.deuda > 0) d.push({ k:'Deuda técnica (' + Math.round(e.deuda) + ')',
      v:-costoFactor(e, 'deuda', 0), libro:e.deuda > 25 ? 'fowler' : 'pragmatic',
      nota:'le cobra ' + Math.round((e.deuda/100) * 55) + '% a TODO, todos los meses' });

    /* moral y foco son multiplicadores, no restas: se muestran como tales */
    if (e.moral < 100) d.push({ k:'Moral ' + Math.round(e.moral),
      v:-costoFactor(e, 'moral', 100),
      libro:e.moral < 38 ? 'lencioni' : (e.moralMin || 100) <= 48 && e.moral >= 70 ? 'radical' :
            e.eventosVistos && e.eventosVistos.caza ? 'norules' : 'grove',
      nota:'multiplica todo: lo que dejás en la mesa contra moral 100' });
    if (e.foco < 100) d.push({ k:'Foco ' + Math.round(e.foco),
      v:-costoFactor(e, 'foco', 100),
      libro:e.foco >= 80 ? 'deepwork' : e.foco < 40 ? 'pgmakers' :
            e.eventosVistos && e.eventosVistos.okr ? 'okrdoerr' : 'rumelt',
      nota:'multiplica todo: lo que dejás en la mesa contra foco 100' });

    /* carga cognitiva: el rendimiento marginal decae pasado el umbral */
    if (tam > umbral) {
      var fCarga = Math.max(0.55, 1 - 0.05 * (tam - umbral));
      var piso = fCarga <= 0.55;
      d.push({ k:'Carga cognitiva (' + tam + ' sobre ' + umbral + ')',
        v:-costoMult(e, fCarga),
        libro:e.teamTopo ? 'staffeng' : tam + e.gtm >= 18 ? 'masters' : tam >= 13 ? 'elegant' : 'topologies',
        nota:piso ? 'tocaste el piso: el equipo está tan arriba del techo que reorganizar ya no alcanza' :
          e.teamTopo ? 'ya reorganizado, y el equipo sigue arriba del techo' :
          'lo que recuperarías reorganizando en equipos con fronteras' });
    }
    else if (e.teamTopo) d.push({ k:'Equipos con fronteras claras', v:'umbral ' + umbral, libro:'topologies',
      nota:'reorganizar subió el techo desde el que se decae' });

    if (e.cd) d.push({ k:'Despliegue continuo', v:'+' + (-costoFactor(e, 'cd', false)),
      /* con incidentes encima, la ficha que habla es la del dato contraintuitivo
         (sos más rápido Y más estable); sin incidentes, la del mecanismo */
      libro:(e.incidentesPuesto || 0) > 0 ? 'accelerate' : 'contdel',
      nota:'lotes chicos: más rápido Y más estable' });

    if (e.rampa.length) d.push({ k:'Mentoría a los nuevos (' + e.rampa.length + ' en rampa)',
      v:-costoFactor(e, 'rampa', []), libro:e.rampa.length >= 3 ? 'blitz' : 'brooks',
      nota:'dos meses sin producir, y mientras tanto cuestan' });

    if (e.congelado) d.push({ k:'Congelamiento', v:'sólo 25% construye', libro:'phoenix',
      nota:'el presupuesto de error se acabó y las prioridades se invirtieron solas' });
    else if (e.presupuestoError < 40) d.push({ k:'Presupuesto de error en ' + Math.round(e.presupuestoError),
      v:'un incidente del congelamiento', libro:'sre', nota:'gastarlo es para lo que está — quedarse sin, no' });

    if (e.penalCap - (e.penalCont || 0) > 0) d.push({ k:'Resaca del incidente',
      v:-(e.penalCap - (e.penalCont || 0)), libro:'releaseit',
      nota:(e.incidentesPuesto || 0) + ' incidente(s) en el puesto' });
    if (e.penalCont) d.push({ k:'Contingencia sin cerrar', v:-e.penalCont, libro:'shapeup',
      nota:'ocupa slot y no mueve tu mandato' });
    if (e.capacidadReservada > 0) d.push({ k:'Compromiso de trabajo a medida', v:-8, libro:'trap',
      nota:'entregas que no mueven la métrica que firmaste' });

    d.push({ k:'Bajo tu mando (' + Math.round(e.mando * 100) + '%)', v:capacidadPropia(e), libro:'managerpath',
      nota:'el resto de la org se mueve sin pedirte permiso' });

    /* Segundo bloque: esto no cambia CUÁNTOS puntos tenés, cambia CUÁNTO
       RINDEN los que gastes. Va aparte porque sumarlo a la columna de arriba
       haría una cuenta que no cierra — y la cuenta que no cierra es la forma
       más rápida de que el jugador deje de creerle al desglose. */
    d.push({ sep:'Y cuánto rinden' });
    if (e.usabilidad < 100) d.push({ k:'Usabilidad ' + Math.round(e.usabilidad),
      v:'activación al ' + Math.round(35 + e.usabilidad * 0.65) + '%',
      libro:e.usabilidad < 55 ? 'krug' : e.usabilidad >= 70 ? 'norman' : 'leanux',
      nota:'multiplica la conversión de todo lo que traigas' });
    if (carga(e) > 0.6) d.push({ k:'Carga del sistema al ' + Math.round(carga(e) * 100) + '%',
      v:'arquitectura ' + Math.round(e.arquitectura),
      libro:carga(e) > 0.85 ? 'ddia' : 'ousterhout',
      nota:'pasado el 85% la probabilidad de caída crece no lineal' });

    if (e.empoderado) d.push({ k:'Equipo empoderado', v:'decide el cómo', libro:e.moral >= 75 ? 'drive' : 'empowered',
      nota:'ya no sos el techo de la organización' });
    if (e.politico < 45) d.push({ k:'Capital político en ' + Math.round(e.politico),
      v:'lo que podés pedir',
      libro:e.eventosVistos && (e.eventosVistos.creditos || e.eventosVistos.kompromat) ? '48laws' :
            e.politico < 25 ? 'elprincipe' : 'crucial',
      nota:'es lo que te deja defender lo que no rinde este mes' });
    if (e.gtm >= 3) d.push({ k:'Go-to-market (' + e.gtm + ')', v:'convierte mejor que tu gasto', libro:'hackingg',
      nota:'multiplica sobre la conversión que ya tenés' });

    return d;
  }

  /* ---------------- la postura que estás tomando ----------------
     Integración intrínseca, clase `postura` (ver INTEGRA en libros.js). Era la
     clase más grande de la biblioteca — 44 fichas — y la única con CERO
     presencia en el juego: el jugador ya tomaba estas decisiones (a qué
     segmento le cumplo, qué necesidad profundizo, subo el precio o no) y
     ningún concepto tenía su nombre puesto sobre ellas. Aparecían después, en
     un panel, cuando una variable cruzaba un umbral.

     Esto lo da vuelta: cada iniciativa del backlog declara QUÉ POSTURA
     ESTRATÉGICA es elegirla, con el nombre del concepto, mientras el jugador
     la está mirando. Elegir la apuesta ES aplicar el concepto — que es
     exactamente lo que pide Habgood: el contenido entregado a través de la
     mecánica, no pegado encima.

     Devuelve UNA sola postura, la más informativa para el estado de hoy, y el
     orden de las ramas es la prioridad. Una tarjeta con cuatro etiquetas no
     dirige la atención a ninguna parte. */
  function posturaDe(e, id) {
    var a = apuesta(id);
    if (!a) return null;
    var nec = a.nec, cob = e.cobertura[nec] || 0, i;

    /* señuelo: la apuesta que se ve grande y no mueve nada */
    if (a.senuelo) return { txt:'Se ve grande y no mueve la métrica que firmaste',
      libro:e.evidencia < 50 ? 'analytics' : 'trap' };

    /* Requisito de la compuerta. Solo habla cuando ESTE requisito es el que
       más traba: etiquetar las seis necesidades del gate hacía que un tercio
       de las tarjetas dijeran lo mismo, y una etiqueta que está en todas no
       dirige la atención a ninguna parte. Cuando falta mucho manda Moore
       (cruzar el abismo); cuando falta poco manda Ries & Trout, porque a un
       requisito de distancia la decisión ya es de posicionamiento. */
    var pide = null, brechaMax = 0, brechaMia = null;
    for (i = 0; i < e.gateReqs.length; i++) {
      var gn = e.gateReqs[i][0], gu = e.gateReqs[i][1], gap = gu - (e.cobertura[gn] || 0);
      if (gn === nec && gap > 0) brechaMia = gap;
      if (gap > brechaMax) { brechaMax = gap; pide = gn; }
    }
    if (brechaMia !== null && pide === nec) {
      var reqs = requisitosGate(e), ok = 0;
      for (i = 0; i < reqs.length; i++) if (reqs[i].ok) ok++;
      return { txt:'Lo que más traba "' + e.gateNombre + '" — ' + ok + ' de ' + reqs.length + ' requisitos',
        libro:ok >= reqs.length - 1 ? 'positioning' : 'chasm' };
    }

    /* necesidad saturada: retorno decreciente, el trabajo ya está hecho */
    if (cob >= COBERTURA_PLENA) return { txt:'Ya saturada (' + Math.round(cob) + '): desde acá rinde cada vez menos',
      libro:'jtbd' };

    /* hueco del recorrido: la necesidad está en cero y alguien la necesita */
    if (cob < 12) {
      for (i = 0; i < SEGMENTOS.length; i++) {
        if (SEGMENTOS[i].requiere.indexOf(nec) >= 0 && (e.usuarios[SEGMENTOS[i].id] || 0) > 0) {
          return { txt:'Hueco del recorrido: ' + SEGMENTOS[i].nombre + ' lo necesita y no está',
            libro:'storymap' };
        }
      }
    }

    /* Escala. Antes esta rama interceptaba TODA apuesta de escala y dejaba
       muerto a challenger, que es el que habla de lo que el cliente grande
       exige antes de firmar. Ahora solo habla cuando la carga es lo que
       aprieta; si no, la tarjeta la explica su propio vector. */
    if (nec === 'escala' && carga(e) > 0.55) return {
      txt:'La carga está al ' + Math.round(carga(e) * 100) + '%: esto decide cuántos usuarios aguantás',
      libro:carga(e) > 0.8 ? 'ddia' : 'everything' };

    /* contraposicionamiento: profundizás donde él no mira */
    if (e.competidor.atencion < 0.3 && cob >= 40) return { txt:'Profundiza donde el competidor no mira — todavía',
      libro:'helmer' };
    if (e.competidor.atencion >= 0.6) return { txt:'Paridad con el competidor: su fuerza ya descuenta tu crecimiento',
      libro:e.competidor.atencion >= 0.75 ? 'paranoid' : 'zero' };

    /* qué métrica domina el vector: la postura sale de lo que la apuesta mueve */
    var vec = (e.vectores && e.vectores[id]) || {}, mk, mejor = null, mv = 0;
    for (mk in vec) if (vec.hasOwnProperty(mk) && vec[mk] > mv) { mv = vec[mk]; mejor = mk; }
    if (mejor === 'ret') return { txt:'Retención: el único bucle que se compone solo',
      libro:retencionMedia(e) > 0.9 ? 'badass' : 'hooked' };
    if (mejor === 'adq') return { txt:'Alcance: entra a la conversión que ya tenés, no a la que querés',
      libro:e.marca >= 55 ? 'purplecow' : e.viral >= 1.6 ? 'coldstart' : 'traction' };
    if (mejor === 'rev') return { txt:'Ingresos por usuario: mueve la caja este mes',
      libro:e.precio > (e.precioInicio || e.precio) ? 'innovsol' : 'pricing' };
    if (mejor === 'rel') return { txt:'Fiabilidad: lo que el mercado grande exige antes de firmar',
      libro:'challenger' };
    if (mejor === 'act') return { txt:'Activación: multiplica todo el tráfico que ya pagaste',
      libro:'olsen' };
    return null;
  }
  /* helper chico para no repetir la cuenta de la compuerta adentro de posturaDe */
  function Motor_compuertaCerrada(e) { return compuerta(e, 'pragm') < 1; }

  /* Con poca evidencia esto es ruido con cara de número. Y si encima
     entrevistaste mal, es ruido optimista. La habilidad de producto ayuda. */
  function costoDe(e, id) {
    if (e.costos && e.costos[id]) return e.costos[id];
    var a = apuesta(id);
    return a ? a.costo : 10;
  }

  function comprometido(e) {
    var t = 0, id;
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) t += Math.max(0, costoDe(e, id) - e.enVuelo[id]);
    return t;
  }

  /* Las tres dimensiones que NO viven en el vector AARRR pero SÍ son metas de
     mandato. Sin esto, tres de los ocho mandatos (baja la deuda,
     instala discovery, abre el gran mercado) no tenían ninguna apuesta que los
     moviera a la vista: el jugador leía "baja la deuda técnica" y ninguna
     tarjeta del backlog decía nada sobre deuda. Ahora todas lo dicen.
       - deuda: construir SIEMPRE agrega deuda, proporcional a lo que cuesta.
         Es un aporte negativo, y es la verdad del modelo (e.deuda += cons*0.15).
       - evid:  las apuestas de datos dejan evidencia al entregarse.
       - gate:  si la necesidad que cubre es uno de los requisitos de la
         compuerta del sector, su impacto empuja ese requisito. */
  function dimsExtra(e, id, impacto) {
    asegurarCapacidades(e);
    var a = apuesta(id), d = {};
    if (!a) return d;
    var fTec = Math.max(0.15, 1 - e.hab.tecnologia / 180 - e.capacidades.tecnologia / 260);
    d.deuda = -(Math.round(costoDe(e, id) * 0.15 * fTec * 10) / 10);
    if (a.nec === 'datos') d.evid = 4;
    var gr = e.gateReqs || [], i;
    for (i = 0; i < gr.length; i++) {
      if (gr[i][0] === a.nec) {
        var falta = Math.max(0, gr[i][1] - (e.cobertura[a.nec] || 0));
        /* falta sale de una cobertura con decimales: se redondea igual que
           d.deuda, o el chip muestra "+15.030000000000001" */
        d.gate = Math.round(Math.min(impacto, falta) * 10) / 10;
        if (d.gate <= 0) d.gate = 0;
      }
    }
    return d;
  }

  /* Estimación desglosada para priorizar: probabilidad de que el número
     sea real (1-5), magnitud si aterriza (1-5) y esfuerzo (S/M/L/XL). */
  function estimacionDetalle(e, id) {
    var est = estimacion(e, id);
    var incert = (100 - e.evidencia) / 100;
    var cert = 1 - Math.min(1, Math.abs(e.ruidos[id] || 0) * incert * 0.9 + (e.sesgo || 0) * 0.3 * incert);
    var prob = Math.max(1, Math.min(5, 1 + Math.round(cert * 4)));
    var mag = est >= 30 ? 5 : est >= 22 ? 4 : est >= 15 ? 3 : est >= 8 ? 2 : 1;
    var cst = costoDe(e, id);
    var esf = (e.talles && e.talles[id]) || (cst <= 10 ? 'S' : cst <= 15 ? 'M' : cst <= 21 ? 'L' : 'XL');
    var TIEMPO = { XS:'~un día', S:'~3 días', M:'~una semana', L:'~2 semanas', XL:'~un mes' };
    /* vector de métricas esperado: el real más ruido escalado por la evidencia */
    var vecReal = (e.vectores && e.vectores[id]) || {};
    var nv = (e.ruidosVec && e.ruidosVec[id]) || {};
    var vecEsp = {}, mk;
    for (mk in vecReal) if (vecReal.hasOwnProperty(mk)) {
      var vx = vecReal[mk];
      if (vx === 0) { vecEsp[mk] = 0; continue; }
      vecEsp[mk] = Math.round((vx + (nv[mk] || 0) * 4 * incert) * 10) / 10;
    }
    var fb = factorBase(e, id);
    if (fb !== 1) for (mk in vecEsp) if (vecEsp.hasOwnProperty(mk)) vecEsp[mk] = Math.round(vecEsp[mk] * fb * 10) / 10;
    var dx = dimsExtra(e, id, est), dk;
    for (dk in dx) if (dx.hasOwnProperty(dk)) vecEsp[dk] = dx[dk];
    /* el desglose de submétricas viaja con la estimación: son el "por qué" del
       vector de arriba, no una segunda predicción — van nominales, sin ruido */
    var ap = apuesta(id);
    var dp = depPendiente(e, id);
    return { est:est, prob:prob, mag:mag, esf:esf, tiempo:TIEMPO[esf] || '', costo:cst, vec:vecEsp,
             dep:dp ? { id:dp.id, n:dp.n } : null,
             subs:(ap && ap.impactoSubmetricas) || null };
  }

  function estimacion(e, id) {
    var real = e.impactos[id] * factorBase(e, id);
    var incert = ((100 - e.evidencia) / 100) * (1 - e.hab.producto / 220);
    /* El ruido se cierra con evidencia; el sesgo NO. Multiplicarlo por
       `incert` como antes lo hacía desaparecer justo cuando el jugador se
       sentía informado, que es exactamente lo contrario de lo que enseña el
       libro: las malas entrevistas no te dejan sin datos, te dejan con datos
       optimistas y la confianza intacta. Preguntar bien es lo único que lo baja. */
    var sesgo = (e.sesgo || 0) * 16;
    return Math.max(1, Math.round(real + (e.ruidos[id] || 0) * 40 * incert + sesgo));
  }
  function confianza(e) {
    if (e.evidencia >= 70) return 'alta';
    if (e.evidencia >= 40) return 'media';
    return 'baja';
  }

  /* ---------------- mandato y capital político ---------------- */

  function progresoDe(e, mandatoId) {
    var m = mandatoPorId(mandatoId);
    if (!m) return 1;
    var meta = m.meta(e), val = m.valor(e);
    if (m.invertido) {
      if (m.id === 'estabilidad') return val <= meta ? 1 : Math.max(0, 1 - (val - meta) * 0.34);
      /* Contra tu linea de partida. Antes `ini` salia de la deuda de HOY, asi
         que la resta daba cero mientras estuvieras por encima de la meta y el
         mandato era binario: 0 hasta cruzar, 1.5 despues. Sin rampa no habia
         nada que leer en la barra ni credito parcial por haber bajado 20. */
      var ini = e.deudaInicio !== undefined ? Math.max(e.deudaInicio, meta + 1) : Math.max(e.deuda, meta + 1);
      return clamp((ini - val) / Math.max(1, ini - meta), 0, 1.5);
    }
    if (m.id === 'abismo') return val;
    return clamp(val / Math.max(0.0001, meta), 0, 1.5);
  }
  function progresoMandato(e) { return progresoDe(e, e.mandatoId); }

  function alineacion(e, plan) {
    var m = mandatoPorId(e.mandatoId), total = 0, alin = 0, k;
    var buckets = ['desc','cons','plat','fiab','crec'];
    for (k = 0; k < buckets.length; k++) {
      var v = plan[buckets[k]] || 0;
      total += v;
      if (m && m.alinea.indexOf(buckets[k]) >= 0) alin += v;
    }
    return total > 0 ? alin / total : 0.5;
  }

  /* ---------------- acciones puntuales ---------------- */

  function contratar(e, rol) { e.rampa.push({ rol:rol, listoEn:2 }); }

  function ronda(e, monto, pre, mult, participativa, pool, poolPre) {
    asegurarCapacidades(e);
    /* una capacidad de levantar capital más fuerte significa mejores términos
       la próxima vez: empuja el pre-money que puedes negociar, hacia arriba
       o hacia abajo */
    pre = Math.round(pre * (1 + (e.capacidades.capital - 20) / 400));
    var post = pre + monto, fInv = monto / post;
    var f = e.capTable.fund, inv = e.capTable.inv, p = e.capTable.pool;
    if (poolPre !== false) {
      var resto = 1 - fInv - pool, suma = f + inv;
      if (suma <= 0) suma = 1;
      f = (f / suma) * resto; inv = (inv / suma) * resto + fInv; p = p + pool;
    } else {
      f = f * (1 - fInv) * (1 - pool);
      inv = inv * (1 - fInv) * (1 - pool) + fInv * (1 - pool);
      p = p * (1 - fInv) * (1 - pool) + pool;
    }
    e.capTable = { fund:f, inv:inv, pool:p };
    e.caja += monto;
    e.valoracion = post;
    e.preferencias.push({ monto:monto, mult:mult, part:!!participativa });
    e.rondas.push({ mes:e.mesPuesto, monto:monto, pre:pre, mult:mult, part:!!participativa, pool:pool });
    e.levantando = false;

    /* el capital levantado es el combustible que convierte las iniciativas de
       este mes en capacidad duradera (ver el bloque de fin de mes en simular) */
    e.capFondeo += monto * 0.10;
    e.capacidades.capital = clamp(e.capacidades.capital + 3 * (1 + e.hab.negocio / 200), 0, 100);
  }

  function pivotar(e) {
    var i;
    for (i = 0; i < NECESIDADES.length; i++) {
      var id = NECESIDADES[i].id;
      e.cobertura[id] = Math.round(e.cobertura[id] * 0.45);
    }
    /* el pivote borra la memoria del backlog: lo entregado deja de contar como
       hecho, y las segundas vueltas que habías abierto se van con él — ese
       trabajo era la continuación de un producto que ya no existe */
    e.talles = {};
    e.vectores = {};
    e.ruidosVec = {};
    e.derivadas = [];
    e.derivadoDe = {};
    sincronizarDerivadas(e);
    e.hechas = {};
    for (i = 0; i < APUESTAS.length; i++) calibrarApuesta(e, APUESTAS[i]);
    e.backlog = []; e.enVuelo = {}; e.backlogNuevo = {}; rellenarBacklog(e);
    e.moral -= 8;
    e.pivoteHecho = true;
    e.usuarios.visio = Math.round((e.usuarios.visio || 0) * 0.5);
  }

  /* ---------------- el mes ---------------- */

  function simular(e, plan, mundo) {
    var log = [], i, id;
    asegurarCapacidades(e);
    /* foto de los seis ejes ANTES de simular: es el contorno punteado del
       radar, el "mes pasado" contra el que se lee el de hoy */
    e.ejesPrev = snapshotEjes(e);
    if (mundo) { e.calor = Mundo.calorSector(mundo, e.sectorId); e.eraId = mundo.eraId; }

    /* 1. contrataciones nuevas: dos meses hasta que producen */
    var quedan = [];
    for (i = 0; i < e.rampa.length; i++) {
      e.rampa[i].listoEn--;
      if (e.rampa[i].listoEn <= 0) {
        if (e.rampa[i].rol === 'ing') e.ing++; else if (e.rampa[i].rol === 'prod') e.prod++; else e.gtm++;
        log.push({ tipo:'bueno', texto:'Terminó la rampa de una contratación: dos meses sin producir y cobrando ' +
          'mentoría a los demás, y desde este mes suma capacidad completa. Los que quedan en rampa siguen restando.',
          libro:'brooks' });
      } else quedan.push(e.rampa[i]);
    }
    e.rampa = quedan;
    e.penalCap = 0;

    /* 1b. el peso de lo que no atendiste. Una contingencia abierta no espera
       quieta: cada mes que sigue ahi le cuesta mas a la organizacion, porque
       todo el mundo pregunta por ella, todo el mundo la esquiva, y nadie puede
       planificar alrededor de algo que sigue sin fecha. La cuenta crece a
       medida que se acerca el vencimiento — si no la hacés, no avanzás. */
    e.penalCont = 0;
    if (e.cont && e.cont.length) {
      var pc, cpc, baseCap = e.ing * 20 + e.prod * 14;
      for (pc = 0; pc < e.cont.length; pc++) {
        cpc = contingenciaPorId(e.cont[pc].id);
        if (!cpc) continue;
        /* 9% de la capacidad de la org por cada mes que lleva abierta: en una
           semilla y en una serieC duele lo mismo, que es lo justo */
        var edad = cpc.plazo - e.cont[pc].restante + 1;
        e.penalCont += Math.round(baseCap * 0.09 * edad);
      }
      e.penalCap += e.penalCont;
    }

    /* 2. lo tuyo + lo que el resto de la organización hace sin ti */
    var capTotal = capacidad(e), mio = capacidadPropia(e);
    /* Construir no es una estación: se construye asignando puntos a proyectos.
       Esos puntos SON tu gasto en construcción, y hasta ahora no contaban en
       ningún lado — ni para la dirección que la org copia, ni para la
       alineación con el mandato, ni para lo que aprendés. */
    var misCons = 0, mck;
    if (plan.asig) for (mck in plan.asig) if (plan.asig.hasOwnProperty(mck)) misCons += plan.asig[mck] || 0;
    var p = { desc:plan.desc||0, cons:plan.cons||0, plat:plan.plat||0, fiab:plan.fiab||0, crec:plan.crec||0 };
    var mioUsado = p.desc + p.cons + p.plat + p.fiab + p.crec + misCons;
    e.gastoPropio = { desc:plan.desc||0, cons:(plan.cons||0) + misCons, plat:plan.plat||0, fiab:plan.fiab||0, crec:plan.crec||0 };
    e.acum.desc += e.gastoPropio.desc; e.acum.cons += e.gastoPropio.cons;
    e.acum.plat += e.gastoPropio.plat; e.acum.fiab += e.gastoPropio.fiab;
    e.acum.crec += e.gastoPropio.crec;

    /* El resto de la organización NO es un piloto automático competente: es
       inercia. Suelta, una empresa manda casi todo a construir features —
       nadie pelea por plataforma ni por discovery si no hay alguien haciéndolo.
       Tu `mando` es el grado en que la org te SIGUE: define la dirección con tu
       propio reparto y la organización se alinea en proporción a tu autoridad.
       Lo que no te sigue cae en el default inercial. Por eso subir en el
       escalafón no te da solo más puntos: hace que tus decisiones pesen. */
    var INERCIA = { desc:0.02, cons:0.82, plat:0.04, fiab:0.04, crec:0.08 };
    var resto = Math.max(0, capTotal - mio);
    /* La construcción inercial se lleva aparte a propósito. La parte de la org
       que te SIGUE empuja tu tablero; la que no te sigue también construye,
       pero construye lo suyo — lo que vos no financiaste. Antes las dos caían
       en la misma bolsa y terminaban empujando exactamente los proyectos que
       vos habías elegido: un equipo competente y gratis que te hacía el mes.
       Eso es lo que volvía inofensivo tener poco mando, y lo que hacía que un
       jugador que no asignaba un solo punto igual entregara. */
    var consInercia = 0;
    if (resto > 0) {
      var sigue = resto * e.mando, suelto = resto - sigue, k;
      /* la parte que te sigue copia TU proporción de este mes */
      if (sigue > 0 && mioUsado > 0) {
        p.desc += Math.round(sigue * (e.gastoPropio.desc / mioUsado));
        p.cons += Math.round(sigue * (e.gastoPropio.cons / mioUsado));
        p.plat += Math.round(sigue * (e.gastoPropio.plat / mioUsado));
        p.fiab += Math.round(sigue * (e.gastoPropio.fiab / mioUsado));
        p.crec += Math.round(sigue * (e.gastoPropio.crec / mioUsado));
      } else suelto += sigue; /* si no diste dirección, no hay nada que seguir */
      for (k in INERCIA) if (INERCIA.hasOwnProperty(k)) {
        if (k === 'cons') consInercia = Math.round(suelto * INERCIA.cons);
        else p[k] += Math.round(suelto * INERCIA[k]);
      }
    }

    if (e.refactorFijo) { var mv = Math.round(capTotal * 0.2); p.cons = Math.max(0, p.cons - mv); p.plat += mv; }
    if (e.reescritura > 0) {
      p.plat += p.cons; p.cons = 0; e.reescritura--;
      e.deuda -= 14;
      log.push({ tipo:'neutro', texto:'Mes de reescritura: toda tu construcción se fue a plataforma, cero apuestas ' +
        'entregadas, −14 de deuda. Quedan ' + e.reescritura + ' mes(es) así. Esto es lo que Fowler llama la forma más ' +
        'cara de pagar la misma deuda: el interés baja, y el mes no vuelve.', libro:'fowler' });
    }
    if (e.congelado) {
      var tope = Math.round(capTotal * 0.25);
      if (p.cons > tope) { p.fiab += p.cons - tope; p.cons = tope; }
      log.push({ tipo:'neutro', texto:'Presupuesto de error agotado: el congelamiento te dejó construir apenas un ' +
        'cuarto de tu capacidad y mandó el resto a fiabilidad. Nadie decidió esto en una reunión — lo decidió el ' +
        'número que se acordó cuando había margen. Vuelve a 100 el trimestre que viene.', libro:'sre' });
    }
    if (e.deudaPendiente) { e.deuda += e.deudaPendiente; e.deudaPendiente = 0; }

    /* 3. descubrimiento */
    if (p.desc > 0) {
      /* Acercarse al techo cuesta cada vez mas: los primeros veinte puntos de
         evidencia salen de hablar con cinco personas, los ultimos veinte no
         salen de hablar con quinientas. Sin esto la evidencia saturaba en 97 y
         el mandato de discovery se cumplia el 100% de las veces. */
      var gan = rinde(p.desc, 4.7) * e.calidadDesc * (1 + e.hab.producto / 200 + e.capacidades.producto / 300) *
                Math.pow(1 - e.evidencia / 100, 1.9);
      e.evidencia = clamp(e.evidencia + gan, 0, 100);
      /* El sesgo ES la calidad de tus entrevistas, y estaba en 0.4 fijo desde
         el día uno sin que nada lo tocara: entrevistar mal solo te hacía
         aprender más lento, no aprender MAL. Eso dejaba la tesis del Mom Test
         fuera del modelo, porque su punto no es que te falte información — es
         que te sobra información equivocada, y encima confiada. Ahora
         preguntar por opiniones en vez de por hechos del pasado deja un sesgo
         que infla las estimaciones hacia el lado que te gusta. */
      e.sesgo = clamp(1 - e.calidadDesc, 0, 1);
      for (id in e.ruidos) if (e.ruidos.hasOwnProperty(id)) e.ruidos[id] *= 0.88;
      e.usabilidad += rinde(p.desc, 0.6);
      if (e.calidadDesc < 0.6) log.push({ tipo:'malo', texto:'Entrevistaste pidiendo opiniones: la gente fue amable y te ' +
        'dijo que sí. La evidencia subió ' + Math.round(gan) + ', pero el sesgo sigue ahí, así que el backlog te sigue ' +
        'prometiendo más de lo que va a rendir — y el error apunta siempre para el lado que te gusta.', libro:'momtest' });
      else log.push({ tipo:'bueno', texto:'Descubrimiento: evidencia +' + Math.round(gan) + ' (ahora ' + Math.round(e.evidencia) +
        '/100). Cada punto cierra el margen entre el impacto que el backlog te promete y el que la apuesta rinde al ' +
        'entregarse. Decae sola: el mes que no la alimentes, vuelve a abrirse.', libro:'torres' });
    }

    /* 3b. los datos de lo que ya entregaste siguen llegando */
    tickPendientes(e, log);

    /* 4. construcción */
    var enVuelo = 0;
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) enVuelo++;
    var sel = plan.apuestas || [];
    var n = enVuelo + sel.length;
    if (plan.asig) {
      n = 0;
      var kk;
      for (kk in plan.asig) if (plan.asig.hasOwnProperty(kk) && plan.asig[kk] > 0) n++;
      if (!n) n = enVuelo + sel.length;
    }
    var wip = n > 2 ? Math.max(0.5, 1 - 0.15 * (n - 2)) : 1;
    if (n > 2) log.push({ tipo:'malo', texto:n + ' apuestas en paralelo: el cambio de contexto se comió el ' +
      Math.round((1 - wip) * 100) + '% de tu capacidad del mes, o sea que pagaste ' + n + ' frentes y trabajaron ' +
      (Math.round(n * wip * 10) / 10) + '. El impacto solo se cobra al entregar, así que ' + n + ' cosas a medias ' +
      'valen cero: con dos habrías entregado dos.', libro:'shapeup' });
    /* slots de proyecto, estilo Catan: solo caben tantas obras abiertas a la vez */
    var abiertos = 0;
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) abiertos++;
    for (i = 0; i < sel.length; i++) {
      if (e.enVuelo[sel[i]] !== undefined) continue;
      if (abiertos >= e.slots) continue;
      abiertos++;
      e.enVuelo[sel[i]] = 0;
    }

    var lista = [];
    for (id in e.enVuelo) if (e.enVuelo.hasOwnProperty(id)) lista.push(id);
    /* asignación dirigida: el jugador puso puntos EN proyectos específicos.
       El esfuerzo de construcción del resto de la org ayuda a lo que tú
       priorizaste, repartido parejo entre los proyectos que recibieron
       alguno de tus puntos. */
    var asig = plan.asig || null;
    var activos = [], pasivos = [];
    if (asig) {
      for (i = 0; i < lista.length; i++) {
        if ((asig[lista[i]] || 0) > 0) activos.push(lista[i]);
        /* una contingencia no recibe empuje inercial: nadie deriva sin querer
           hacia una licencia que vence. Hay que agarrarla, o no se mueve */
        else if (!esContingencia(lista[i])) pasivos.push(lista[i]);
      }
      if (!activos.length) { activos = lista.slice(); pasivos = []; }
    } else activos = lista.slice();
    var deOrg = Math.max(0, p.cons);
    var porApuesta = activos.length ? (deOrg * wip) / activos.length : 0;
    /* La construcción que no te sigue va a lo que dejaste sin financiar, y va
       mal: sin nadie mirando rinde poco más de la mitad. Si no dejaste nada
       suelto, ese esfuerzo no aparece en tu tablero — se fue en trabajo que no
       elegiste, y lo único que deja atrás es deuda. */
    var porSuelto = pasivos.length ? (consInercia * 0.6) / pasivos.length : 0;
    if (!pasivos.length && consInercia > 0) e.deuda += consInercia * 0.05;
    for (i = 0; i < lista.length; i++) {
      id = lista[i];
      /* esperando una firma no avanza ni con todos los puntos del mundo */
      if (enEspera(e, id)) continue;
      var empuje = (asig && activos.indexOf(id) >= 0 ? porApuesta : (asig ? porSuelto : porApuesta));
      if (asig) empuje += (asig[id] || 0) * wip;
      e.enVuelo[id] += empuje;
      var a = apuesta(id);
      if (e.enVuelo[id] >= costoDe(e, id)) {
        /* Una contingencia entregada no paga impacto, no cubre necesidad y no
           abre continuacion: solo se va, y el equipo respira por haberse sacado
           la piedra del zapato. Ese es todo el premio, y es el correcto. */
        if (esContingencia(id)) {
          var cc = contingenciaPorId(id), ci;
          delete e.enVuelo[id];
          e.hechas[id] = true;
          for (ci = 0; ci < e.cont.length; ci++) if (e.cont[ci].id === id) { e.cont.splice(ci, 1); break; }
          e.moral = clamp(e.moral + 4, 0, 100);
          log.push({ tipo:'bueno', libro:cc.libro, cont:'cierra',
            texto:'Cerraste "' + cc.n + '" a tiempo. No movió tu mandato ni una décima, que era exactamente el trato: ' +
                  'el trabajo que no se ve es el que te deja seguir haciendo el que si.' });
          continue;
        }
        var esperado = estimacion(e, id);
        /* la base se mide al ENTREGAR, no al empezar: si la construiste
           mientras esto estaba en vuelo, llegaste a tiempo y no se cobra nada.
           Eso premia secuenciar sin castigar haber empezado en paralelo. */
        var sinBase = depPendiente(e, id);
        delete e.enVuelo[id];
        e.hechas[id] = true;
        e.apuestasCompletadas++;
        /* por cada iniciativa que se ejecuta, una nueva: lo entregado abre su
           propia continuación y entra al backlog ahora, no el mes que viene */
        var hija = abrirSiguiente(e, id, e.mesPuesto + 1);
        var real = Math.max(1, Math.round(e.impactos[id] * (sinBase ? FACTOR_SIN_BASE : 1)));
        /* las dimensiones extra se miden ANTES de mover la cobertura: cuánto
           de este impacto se come lo que falta para la compuerta */
        var dxr = dimsExtra(e, id, real), dxk;
        e.cobertura[a.nec] = (e.cobertura[a.nec] || 0) + real;
        var idx = e.backlog.indexOf(id); if (idx >= 0) e.backlog.splice(idx, 1);
        /* el proyecto entregado aplica su vector REAL de métricas a la empresa */
        var vec3 = {}, vk3, vsrc = (e.vectores && e.vectores[id]) || {};
        for (vk3 in vsrc) if (vsrc.hasOwnProperty(vk3)) vec3[vk3] = vsrc[vk3];
        for (dxk in dxr) if (dxr.hasOwnProperty(dxk)) vec3[dxk] = dxr[dxk];
        /* Lo que CONSTRUISTE es tuyo hoy: la cobertura de la necesidad, la
           deuda que dejaste, la evidencia de una apuesta de datos, el tick de
           la compuerta. Lo que MUEVE tarda: la gente tiene que encontrarlo,
           entenderlo y volver. El primer tramo entra ahora y el resto en los
           dos meses siguientes — el número real recién se sabe al final, y
           para entonces ya comprometiste el plan del mes que viene. */
        if (sinBase) {
          /* el vector real tambien se parte: no es una multa aparte, es que la
             cosa de verdad rinde menos cuando le falta el piso */
          for (vk3 in vec3) if (vec3.hasOwnProperty(vk3) && typeof vec3[vk3] === 'number' && vk3 !== 'deuda') {
            vec3[vk3] = Math.round(vec3[vk3] * FACTOR_SIN_BASE * 10) / 10;
          }
          e.deuda = clamp(e.deuda + 8, 0, 100);
        }
        var partes = [];
        aplicarVector(e, vec3, TRAMOS[0], partes);
        if (a.nec === 'datos') { e.evidencia = clamp(e.evidencia + 4, 0, 100); partes.push('+4 de evidencia'); }
        if (a.nec === 'soporte' || a.nec === 'segur' || a.nec === 'integra') partes.push('tick de compuerta');
        e.pendientes.push({ id:id, n:a.n, real:real, esperado:esperado, vec:vec3,
                            tramo:1, evidencia:e.evidencia,
                            llamada:(e.llamadas && e.llamadas[id]) || null });
        log.push({ tipo:sinBase ? 'malo' : 'neutro', libro:sinBase ? 'fowler' : 'analytics', dato:'sale',
          sinBase:!!sinBase,
          texto:'Entregaste "' + a.n + '".' +
                (sinBase ? ' Salió sin "' + sinBase.n + '" abajo: rinde el ' + Math.round(FACTOR_SIN_BASE * 100) +
                           '% de lo que habría rendido y ' +
                           'te dejó 8 de deuda encima. Nadie lo va a ver desde afuera; lo vas a ver vos, cada ' +
                           'mes, en la capacidad que ya no tenés.' : '') +
                (partes.length ? ' Primer movimiento: ' + partes.join(' · ') + '.' : '') +
                ' Los datos completos llegan en dos meses: hasta entonces no vas a saber si acertaste, y el plan del ' +
                'mes que viene lo tenés que cerrar igual.' });
        if (hija) {
          log.push({ tipo:'neutro', texto:'Entregar "' + a.n + '" abrió lo que sigue: "' + hija.n +
            '" entró al backlog. Ningún envío cierra un tema; lo abre.', libro:'inspired' });
        }
      }
    }
    e.deuda += p.cons * 0.15 * (1 - e.hab.tecnologia / 180 - e.capacidades.tecnologia / 260);
    if (e.fabrica) e.deuda += 2;

    /* 5. plataforma */
    if (p.plat > 0) {
      /* Lo mismo por abajo: bajar de 60 a 40 es una tarde, bajar de 25 a 15 es
         tocar lo que nadie quiere tocar. Antes la deuda se iba a cero en un mes
         de plataforma y el mandato se cumplia siempre. */
      e.deuda -= rinde(p.plat, 2.35) * (1 + e.hab.tecnologia / 150 + e.capacidades.tecnologia / 200) *
                 Math.pow(clamp(e.deuda, 0, 100) / 60, 2.0);
      e.arquitectura += rinde(p.plat, 1.2);
    }
    e.deuda += 2.5;
    e.deuda = clamp(e.deuda, 0, 100);

    /* 6. fiabilidad */
    /* El escudo multiplica, no resta. Restando, 17 puntos de fiabilidad
       llevaban la probabilidad a cero y el equipo quedaba literalmente inmune:
       el mandato de cero caidas se cumplia el 100% de las veces. Ningun sistema
       es inmune; se compra tiempo entre caidas, no la ausencia de caídas. */
    var escudo = Math.min(0.70, rinde(p.fiab, 0.055));
    if (p.fiab > 0) {
      e.fiabPercibida = clamp(e.fiabPercibida + rinde(p.fiab, 1.92), 0, 100);
      e.presupuestoError = clamp(e.presupuestoError + rinde(p.fiab, 2.6), -50, 100);
    }

    /* 7. incidentes: cada sector se rompe a su manera */
    var c = carga(e);
    var pInc = (0.105 + Math.max(0, c - 0.8) * 0.5 + e.deuda / 400 + (e.riesgoExtra || 0)) *
               (1 - escudo) * (e.cd ? 0.8 : 1);
    if (Math.random() < clamp(pInc, 0, 0.9)) resolverIncidente(e, log, c);
    e.riesgoExtra = (e.riesgoExtra || 0) * 0.5;

    /* 7b. la Lupa del regulador: cuanto más sucio juegas, más fuerte miran.
       Decae despacio; con la Lupa alta llegan inspecciones, multas y cosas peores. */
    if (e.lupa > e.lupaBase) e.lupa = Math.max(e.lupaBase, e.lupa - 1);
    if (e.lupa > e.lupaMax) e.lupaMax = e.lupa;
    if (e.lupa >= 40) {
      var pIns = Math.pow(e.lupa / 100, 2) * 0.4 * (e.eraId === 'regulacion' ? 1.7 : 1);
      if (Math.random() < pIns) {
        var multa = Math.round(burnMensual(e) * rnd(0.8, 2.2));
        e.caja -= multa;
        e.moral -= 4;
        e.lupa = Math.max(e.lupaBase, e.lupa - 12);
        log.push({ tipo:'malo', texto:'Inspección sorpresa. Encontraron suficiente: una multa de ' +
          Math.round(multa / 1000) + 'k y un expediente que queda abierto.', libro:'hard' });
      }
    }

    /* 8. crecimiento y churn */
    var mercado = 0;
    for (i = 0; i < SEGMENTOS.length; i++) mercado += e.tam[SEGMENTOS[i].id];
    var saturacion = 1 + usuarios(e) / (mercado * 0.14);
    var alcance = 35 * Math.pow(Math.max(0, p.crec), 0.75) * (1 + e.gtm * 0.25) *
                  (0.75 + e.marca / 220) * (1 + (e.gtmBonus || 0)) * e.cac *
                  (1 + e.hab.negocio / 150 + e.capacidades.gtm / 220) / saturacion;
    if (mundo) alcance *= Mundo.modAlcance(mundo, e.sectorId);
    var boca = Math.min(usuarios(e) * 0.03 * e.viral,
                        usuarios(e) * fitMax(e) * 0.022 * e.viral * (0.6 + e.marca / 160));
    e.gtmBonus = 0;

    for (i = 0; i < SEGMENTOS.length; i++) {
      var sc = SEGMENTOS[i].id;
      e.usuarios[sc] = Math.max(0, (e.usuarios[sc] || 0) * retencion(e, sc));
    }
    var PESO = { innov:1.0, visio:1.1, pragm:1.25, conse:0.8 };
    var abiertos = [], suma = 0, bloqueado = 0;
    for (i = 0; i < SEGMENTOS.length; i++) {
      var sa = SEGMENTOS[i];
      if (!abierto(e, sa.id)) continue;
      var disp = Math.max(0, e.tam[sa.id] - (e.usuarios[sa.id] || 0)) / e.tam[sa.id];
      var w = PESO[sa.id] * disp;
      abiertos.push({ id:sa.id, w:w }); suma += w;
    }
    for (i = 0; i < abiertos.length; i++) {
      var sid = abiertos[i].id;
      var cuota = suma > 0 ? abiertos[i].w / suma : 0;
      var conv = fit(e, sid) * compuerta(e, sid) * (0.35 + (e.usabilidad / 100) * 0.65);
      if (sid === 'pragm' || sid === 'conse') conv *= (1 - e.competidor.atencion * e.competidor.fuerza * 0.6);
      var trafico = (alcance + boca) * cuota;
      if (compuerta(e, sid) < 0.5 && trafico > 80) bloqueado += trafico;
      e.usuarios[sid] += trafico * conv;
    }
    if (bloqueado > 120 && !e.gateRevelado) {
      log.push({ tipo:'malo', texto:'Pagaste alcance hacia el mercado grande y no convirtió: ese segmento está ' +
        'detrás de la compuerta "' + e.gateNombre + '", y mientras no cumplas sus requisitos convierte a una fracción ' +
        'de lo normal. No es el precio ni el mensaje — es una lista de requisitos, y está en la pantalla de la ' +
        'compuerta. Hasta cumplirla, cada punto en crecer hacia ellos se fuga en esa proporción.', libro:'chasm' });
      e.gateRevelado = true;
    }

    /* 8b. contabilidad del embudo: usuarios nuevos del mes, para el panel pirata */
    e.adqMes = Math.max(0, Math.round(usuarios(e) - (e.hist.length ? e.hist[e.hist.length - 1].u : e.usuariosInicio)));

    /* 8c. contingencias, estilo The Founder: cosas que simplemente TE PASAN */
    if (Math.random() < 0.055 && e.mesPuesto > 1) {
      var cont = Math.floor(Math.random() * 4);
      if (cont === 0) {
        if ((e.cobertura.segur || 0) >= 50) {
          log.push({ tipo:'neutro', texto:'Un empleado intentó llevarse la base de datos de clientes. Tus controles de acceso lo frenaron en la puerta. Dinero bien gastado.', libro:'sre' });
        } else {
          e.lupa = clamp(e.lupa + 8, 0, 100); e.marca = clamp(e.marca - 8, 0, 100);
          for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.95;
          log.push({ tipo:'malo', texto:'Un empleado que se iba robó datos de clientes y salió en las noticias. Unos controles de acceso débiles se lo dejaron fácil.', libro:'sre' });
        }
      } else if (cont === 1) {
        e.marca = clamp(e.marca - 9, 0, 100);
        log.push({ tipo:'malo', texto:'Cayó una nota demoledora: un boletín influyente llamó a tu producto "un caso de estudio en promesas infladas". Y circula.', libro:'hard' });
      } else if (cont === 2) {
        e.fiabPercibida = clamp(e.fiabPercibida - 8, 0, 100); e.penalCap = (e.penalCap || 0) + 3;
        log.push({ tipo:'malo', texto:'Tu proveedor de nube tuvo una caída en toda la región. No fue tu culpa. Igual es tu pager, tus disculpas, tu churn.', libro:'sre' });
      } else {
        if (e.lupa > 20) {
          var multa2 = Math.round(burnMensual(e) * 0.6);
          e.caja -= multa2;
          log.push({ tipo:'malo', texto:'Una barrida regulatoria golpeó a todo el sector. Tu expediente no estaba lo bastante limpio: multa de ' + Math.round(multa2 / 1000) + 'k.', libro:'hard' });
        } else {
          log.push({ tipo:'neutro', texto:'Una barrida regulatoria golpeó a todo el sector. Tu expediente era aburrido, en el mejor sentido. Siguieron de largo.', libro:'hard' });
        }
      }
    }

    /* 9. dinero */
    e.mrr = calcularMrr(e);
    var gastoCrec = p.crec * 900;
    e.caja += e.mrr - burnMensual(e) - gastoCrec;

    /* 10. capital político: te miden por el mandato, no por tener razón */
    var alin = alineacion(e, e.gastoPropio);
    var prog = progresoMandato(e);
    var esperado2 = (e.mesPuesto + 1) / e.meses;
    var dPol = (alin - 0.55) * 10 + (prog >= esperado2 ? 2 : -4) + e.hab.liderazgo / 50 + e.capacidades.gente / 90;
    if (e.penalCap) dPol -= 5;
    if (mioUsado < mio * 0.6) dPol -= 3;
    e.politico = clamp(e.politico + dPol, -20, 100);

    /* mecánica de calle: la palanca te salva el cuello exactamente una vez,
       y el conflicto de interés secreto es una tirada de dados cada mes,
       todos los meses */
    if (e.politico < 0 && e.palancaSecreta) {
      e.palancaSecreta = false;
      e.politico = 14;
      log.push({ tipo:'neutro', texto:'Se movieron para sacarte. Hiciste una sola llamada y le recordaste a alguien lo que sabes. Sigues aquí — y esa carta ya está gastada.', libro:'hard' });
    }
    if (e.conflictoInteres && Math.random() < 0.05) {
      e.conflictoInteres = false;
      e.politico -= 25;
      e.moral -= 6;
      e.lupa = clamp(e.lupa + 12, 0, 100);
      log.push({ tipo:'malo', texto:'Alguien encontró tus acciones de asesor en el competidor. La palabra "conflicto" quedó pegada a tu nombre aquí para siempre.', libro:'hard' });
    }

    /* 10b. si no eres fundador, la empresa se fondea sola — y te diluye */
    if (!e.esFundador && runwayMeses(e) < 5 && Math.random() < 0.35) {
      var extra = burnMensual(e) * 15;
      e.caja += extra;
      e.valoracion = Math.max(e.valoracion * 0.8, e.mrr * 12 * 7);
      e.dilucion = (e.dilucion || 1) * 0.78;
      log.push({ tipo:'neutro', texto:'La empresa cerró una ronda para seguir viva. Tu equity acaba de diluirse 22%.', libro:'deals' });
    } else if (!e.esFundador && runwayMeses(e) < 2) {
      log.push({ tipo:'malo', texto:'La caja se está acabando y nadie aparece dispuesto a poner más.', libro:'lean' });
    }

    /* 11. fin de mes */
    if (e.capacidadReservada > 0) e.capacidadReservada--;
    e.moral = clamp(e.moral + (e.mrr > burnMensual(e) ? 2 : 0) + (e.empoderado ? 1 : 0) +
                    e.hab.liderazgo / 60 - 1.5, 0, 100);
    if (e.moral < (e.moralMin || 100)) e.moralMin = e.moral;
    e.foco = clamp(e.foco - 1.5, 0, 100);
    e.usabilidad = clamp(e.usabilidad + (e.cobertura.flujo || 0) * 0.02 - 0.6, 0, 100);
    e.marca = clamp(e.marca + (retencionMedia(e) > 0.9 ? 1.5 : -0.5), 0, 100);
    e.evidencia = clamp(e.evidencia - (e.cadenciaDesc ? 1.5 : 3.5), 0, 100);
    e.fiabPercibida = clamp(e.fiabPercibida + (e.arquitectura > carga(e) * 40 ? 1.5 : -1), 0, 100);
    if (e.competidor.atencion < 0.9) {
      var dAt = (e.usuarios.pragm > e.tam.pragm * 0.06 ? 0.05 : 0.012);
      if (mundo) dAt *= Mundo.modAtencionCompetencia(mundo, e.sectorId);
      e.competidor.atencion += dAt;
    }
    e.mesPuesto++;
    if (e.mesPuesto % 3 === 0) {
      e.presupuestoError = 100; e.congelado = false;
      log.push({ tipo:'neutro', texto:'Trimestre nuevo: el presupuesto de error vuelve a 100.', libro:'sre' });
    }
    tickEsperas(e, log);
    tickContingencias(e, log);
    rellenarBacklog(e);
    var refresco = refrescarBacklogPeriodico(e);
    if (refresco) {
      log.push({ tipo:'neutro', texto:'Nuevo en el backlog: "' + refresco.entrante.n +
        '" — "' + refresco.saliente.n + '" perdió vigencia y salió de la lista.' });
    }

    /* 11b. capacidades de la empresa: lo que la org acaba de construir solo se
       vuelve capacidad duradera cuando hay capital levantado financiándolo
       (capFondeo, recargado en ronda()). Sin combustible se nada sin avanzar —
       las capacidades se deslizan hacia abajo en vez de subir. Las habilidades
       del fundador aceleran la conversión. */
    if (e.capFondeo > 0) {
      var gastadoFondeo = 0;
      if (p.desc > 0) {
        e.capacidades.producto = clamp(e.capacidades.producto +
          p.desc * 0.05 * (1 + e.hab.producto / 150), 0, 100);
        gastadoFondeo += p.desc * 40;
      }
      if (p.plat > 0) {
        e.capacidades.tecnologia = clamp(e.capacidades.tecnologia +
          p.plat * 0.06 * (1 + e.hab.tecnologia / 150), 0, 100);
        gastadoFondeo += p.plat * 40;
      }
      if (p.crec > 0) {
        e.capacidades.gtm = clamp(e.capacidades.gtm +
          p.crec * 0.05 * (1 + e.hab.negocio / 150), 0, 100);
        gastadoFondeo += p.crec * 40;
      }
      if (e.moral > 55 && e.foco > 35) {
        e.capacidades.gente = clamp(e.capacidades.gente + 0.6 * (1 + e.hab.liderazgo / 150), 0, 100);
        gastadoFondeo += 20;
      }
      e.capFondeo = Math.max(0, e.capFondeo - gastadoFondeo);
    } else {
      e.capacidades.producto = clamp(e.capacidades.producto - 0.15, 0, 100);
      e.capacidades.tecnologia = clamp(e.capacidades.tecnologia - 0.15, 0, 100);
      e.capacidades.gtm = clamp(e.capacidades.gtm - 0.15, 0, 100);
      e.capacidades.gente = clamp(e.capacidades.gente - 0.1, 0, 100);
    }

    /* 12. ¿se terminó el puesto? */
    e.valoracion = Math.max(e.valoracion * 0.995, e.mrr * 12 * 6);
    if (e.imputado) { e.vivo = false; e.final = 'imputado'; }
    else if (e.ventaAcordada) { e.vivo = false; e.final = 'venta'; }
    else if (e.caja < 0) { e.vivo = false; e.final = 'quiebra'; }
    else if (e.politico < 0) { e.vivo = false; e.final = 'despido'; }
    else if (e.mesPuesto >= e.meses) { e.vivo = false; e.final = 'plazo'; }

    e.hist.push({ m:e.mesPuesto, u:usuarios(e), mrr:e.mrr, caja:Math.round(e.caja), pol:Math.round(e.politico), pm:progresoMandato(e) });

    /* Actualizar submétricas derivadas al final del mes */
    updateSubmetricasMonth(e);

    return log;
  }

  /* ---------------- pace vs. runway ----------------
     Is the mandate on track to clear before (a) the role ends and (b) the
     cash runs out? Rate is the recent trend across closed months (falls back
     to the average pace since day one when there isn't enough history yet). */
  function ritmoMandato(e) {
    var prog = progresoMandato(e);
    var restantes = Math.max(0, e.meses - e.mesPuesto - 1);
    var run = runwayMeses(e);
    var ritmo = null, n = e.hist.length;
    if (n >= 2) {
      var span = Math.min(3, n - 1), antes = e.hist[n - 1 - span].pm, ahora = e.hist[n - 1].pm;
      if (typeof antes === 'number' && typeof ahora === 'number') ritmo = (ahora - antes) / span;
    }
    if (ritmo === null) ritmo = prog / Math.max(1, e.mesPuesto + 1);
    var faltante = Math.max(0, 1 - prog);
    var mesesMeta = ritmo > 0.0005 ? faltante / ritmo : Infinity;
    return {
      prog:prog, ritmo:ritmo, mesesMeta:mesesMeta, restantesPuesto:restantes, runway:run,
      cumplido:prog >= 1,
      llegaEnPlazo:mesesMeta <= restantes,
      llegaAntesDeCash:mesesMeta <= run
    };
  }

  function resolverIncidente(e, log, c) {
    e.incidentesPuesto++;
    e.penalCap = 8;
    var t = e.tipoIncidente, i;
    e.presupuestoError -= 38;
    e.moral -= 6;

    if (t === 'fraude') {
      var perdida = Math.max(30000, usuarios(e) * 12);
      e.caja -= perdida;
      e.fiabPercibida = clamp(e.fiabPercibida - 12, 0, 100);
      log.push({ tipo:'malo', texto:'Ola de fraude: ' + Math.round(perdida/1000) + 'k perdidos, directo del margen.', libro:'sre' });
    } else if (t === 'escandalo') {
      e.marca = clamp(e.marca - 25, 0, 100);
      e.fiabPercibida = clamp(e.fiabPercibida - 15, 0, 100);
      e.cobertura.segur = Math.max(0, e.cobertura.segur - 10);
      for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.88;
      log.push({ tipo:'malo', texto:'Un medio publicó cómo se usaron tus datos en una campaña. En este negocio eso no se olvida.', libro:'sre' });
    } else if (t === 'granwin') {
      var agujero = Math.max(60000, e.mrr * 1.6);
      e.caja -= agujero;
      e.marca = clamp(e.marca - 8, 0, 100);
      e.lupa = clamp(e.lupa + 8, 0, 100);
      log.push({ tipo:'malo', texto:'Un apostador encontró el agujero del bono y drenó ' +
        Math.round(agujero / 1000) + 'k antes de que alguien mirara. Después lo contó en público.', libro:'sre' });
    } else if (t === 'clinico') {
      e.fiabPercibida = clamp(e.fiabPercibida - 25, 0, 100);
      e.marca = clamp(e.marca - 12, 0, 100);
      e.cobertura.segur = Math.max(0, e.cobertura.segur - 15);
      e.capacidadReservada = 2;
      log.push({ tipo:'malo', texto:'Evento adverso con un paciente: revisión regulatoria y todo lo demás en pausa.', libro:'sre' });
    } else if (t === 'alucina') {
      e.evidencia = clamp(e.evidencia - 12, 0, 100);
      e.marca = clamp(e.marca - 14, 0, 100);
      e.fiabPercibida = clamp(e.fiabPercibida - 14, 0, 100);
      e.lupa = clamp(e.lupa + 6, 0, 100);
      log.push({ tipo:'malo', texto:'El modelo inventó un dato en la pantalla de un cliente y el cliente lo mandó a producción. ' +
        'La captura ya circula.', libro:'sre' });
    } else if (t === 'respin') {
      var respin = Math.max(120000, (e.capex || 0) * 1.4);
      e.caja -= respin;
      e.capacidadReservada = 2;
      e.cobertura.escala = Math.max(0, e.cobertura.escala - 10);
      log.push({ tipo:'malo', texto:'Un error en el silicio: respin. ' + Math.round(respin / 1000) +
        'k y dos meses del equipo que no vuelven.', libro:'ddia' });
    } else if (t === 'brecha') {
      e.marca = clamp(e.marca - 30, 0, 100);
      e.fiabPercibida = clamp(e.fiabPercibida - 22, 0, 100);
      e.cobertura.segur = Math.max(0, e.cobertura.segur - 14);
      for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.86;
      log.push({ tipo:'malo', texto:'Le entraron a la empresa de seguridad. Cada cliente está releyendo su contrato ahora mismo.', libro:'sre' });
    } else if (t === 'pico') {
      var gmv = Math.max(40000, e.mrr * 1.1);
      e.caja -= gmv;
      e.marca = clamp(e.marca - 10, 0, 100);
      e.fiabPercibida = clamp(e.fiabPercibida - 16, 0, 100);
      log.push({ tipo:'malo', texto:'El día de mayor demanda del año, el checkout se cayó 40 minutos. ' +
        Math.round(gmv / 1000) + 'k de pedidos que no existieron.', libro:'sre' });
    } else if (t === 'derechos') {
      e.marca = clamp(e.marca - 12, 0, 100);
      for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.91;
      log.push({ tipo:'malo', texto:'Se venció una licencia clave y el catálogo perdió lo único que la gente venía a ver. ' +
        'Las cancelaciones llegaron el mismo día.', libro:'sre' });
    } else {
      e.fiabPercibida = clamp(e.fiabPercibida - 20, 0, 100);
      for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.95;
      log.push({ tipo:'malo',
        texto:c > 0.9 ? 'Caída: la carga reventó lo que tu arquitectura aguanta.' : 'Caída en producción. La deuda te encontró.',
        libro:c > 0.9 ? 'ddia' : 'fowler' });
    }
  }

  /* ---------------- salida (solo fundador) ---------------- */

  function cascada(e) {
    var mult = 3 + Math.min(3, retencionMedia(e) * 3) + (e.competidor.atencion < 0.4 ? 0.5 : 0);
    var salida = e.final === 'quiebra' ? 0 :
                 e.ventaAcordada ? e.ventaAcordada : Math.round(e.mrr * 12 * mult);
    var pref = 0, i, participa = false;
    for (i = 0; i < e.preferencias.length; i++) {
      pref += e.preferencias[i].monto * e.preferencias[i].mult;
      if (e.preferencias[i].part) participa = true;
    }
    var aInv = 0;
    if (e.preferencias.length) {
      if (participa) aInv = Math.min(salida, pref) + Math.max(0, salida - pref) * e.capTable.inv;
      else aInv = Math.max(Math.min(salida, pref), salida * e.capTable.inv);
    }
    var aFund = Math.max(0, salida - aInv) * (e.capTable.fund / Math.max(0.0001, e.capTable.fund + e.capTable.pool));
    return { salida:salida, mult:mult, aInv:Math.round(aInv), aFund:Math.round(aFund), pref:pref };
  }

  /* ===== SUBMÉTRICAS DERIVADAS ===== */
  var SUBMETRICAS_BASE_POR_IDEA = {
    cobranzas: {
      'adq:cac': 800, 'adq:mix_canal': 40, 'adq:conv_rate': 4.0, 'adq:visit_signup': 10,
      'act:time_value': 3.5, 'act:feature_adopt': 75, 'act:onboard': 85, 'act:task_success': 95,
      'ret:churn': 3.2, 'ret:dau_mau': 45, 'ret:reactivation': 20, 'ret:stickiness': 65,
      'rev:arpu': 120, 'rev:ltv_cac': 2.8, 'rev:expansion': 8, 'rev:payment_friction': 2.5,
      'ref:viral_k': 0.8, 'ref:nps': 35, 'ref:referral_rate': 5, 'ref:neg_churn': -2,
      'rel:uptime': 99.5, 'rel:error_rate': 0.3, 'rel:mttr': 45, 'rel:latency_p95': 200,
      'evid:reviews': 12, 'evid:cases': 2, 'evid:press': 1, 'evid:community': 30
    },
    datos: {
      'adq:cac': 2200, 'adq:mix_canal': 30, 'adq:conv_rate': 2.0, 'adq:visit_signup': 6,
      'act:time_value': 8.0, 'act:feature_adopt': 55, 'act:onboard': 65, 'act:task_success': 80,
      'ret:churn': 1.8, 'ret:dau_mau': 55, 'ret:reactivation': 25, 'ret:stickiness': 72,
      'rev:arpu': 580, 'rev:ltv_cac': 3.2, 'rev:expansion': 18, 'rev:payment_friction': 1.2,
      'ref:viral_k': 1.1, 'ref:nps': 48, 'ref:referral_rate': 12, 'ref:neg_churn': 2,
      'rel:uptime': 99.8, 'rel:error_rate': 0.15, 'rel:mttr': 30, 'rel:latency_p95': 150,
      'evid:reviews': 8, 'evid:cases': 5, 'evid:press': 3, 'evid:community': 45
    },
    habitos: {
      'adq:cac': 45, 'adq:mix_canal': 70, 'adq:conv_rate': 5.5, 'adq:visit_signup': 14,
      'act:time_value': 2.0, 'act:feature_adopt': 90, 'act:onboard': 92, 'act:task_success': 98,
      'ret:churn': 8.5, 'ret:dau_mau': 85, 'ret:reactivation': 28, 'ret:stickiness': 88,
      'rev:arpu': 18, 'rev:ltv_cac': 4.2, 'rev:expansion': 12, 'rev:payment_friction': 3.5,
      'ref:viral_k': 2.8, 'ref:nps': 72, 'ref:referral_rate': 35, 'ref:neg_churn': 8,
      'rel:uptime': 99.9, 'rel:error_rate': 0.1, 'rel:mttr': 15, 'rel:latency_p95': 100,
      'evid:reviews': 450, 'evid:cases': 0, 'evid:press': 8, 'evid:community': 2000
    }
  };

  var SUBMETRICAS_LIMITES = {
    'adq:cac': { min: 50, max: 5000 }, 'adq:mix_canal': { min: 0, max: 100 },
    'adq:conv_rate': { min: 0.1, max: 15 }, 'adq:visit_signup': { min: 0.5, max: 50 },
    'act:time_value': { min: 0.5, max: 30 }, 'act:feature_adopt': { min: 5, max: 100 },
    'act:onboard': { min: 10, max: 100 }, 'act:task_success': { min: 20, max: 100 },
    'ret:churn': { min: 0, max: 20 }, 'ret:dau_mau': { min: 10, max: 100 },
    'ret:reactivation': { min: 0, max: 50 }, 'ret:stickiness': { min: 20, max: 100 },
    'rev:arpu': { min: 1, max: 10000 }, 'rev:ltv_cac': { min: 0.5, max: 10 },
    'rev:expansion': { min: 0, max: 50 }, 'rev:payment_friction': { min: 0, max: 10 },
    'ref:viral_k': { min: 0, max: 5 }, 'ref:nps': { min: -100, max: 100 },
    'ref:referral_rate': { min: 0, max: 60 }, 'ref:neg_churn': { min: -20, max: 20 },
    'rel:uptime': { min: 90, max: 100 }, 'rel:error_rate': { min: 0, max: 5 },
    'rel:mttr': { min: 5, max: 480 }, 'rel:latency_p95': { min: 50, max: 2000 },
    'evid:reviews': { min: 0, max: 1000 }, 'evid:cases': { min: 0, max: 100 },
    'evid:press': { min: 0, max: 50 }, 'evid:community': { min: 0, max: 5000 }
  };

  function setearSubmetricasBase(e) {
    var ideaId = e.idea ? e.idea.id : 'cobranzas';
    var base = SUBMETRICAS_BASE_POR_IDEA[ideaId] || SUBMETRICAS_BASE_POR_IDEA.cobranzas;
    e.submetricas = {};
    var key;
    for (key in base) {
      if (base.hasOwnProperty(key)) {
        e.submetricas[key] = base[key];
      }
    }
  }

  function calcularDeltaSubmetrica(e, key) {
    var delta = 0, id;
    for (id in e.enVuelo) {
      if (!e.enVuelo.hasOwnProperty(id) || e.enVuelo[id] <= 0) continue;
      var ap = apuesta(id);
      if (ap && ap.impactoSubmetricas && ap.impactoSubmetricas[key]) {
        var progreso = e.enVuelo[id] / costoDe(e, id);
        delta += ap.impactoSubmetricas[key] * Math.min(1, progreso);
      }
    }
    return delta;
  }

  function updateSubmetricasMonth(e) {
    if (!e.submetricas) setearSubmetricasBase(e);
    var key;
    for (key in e.submetricas) {
      if (!e.submetricas.hasOwnProperty(key)) continue;
      var base = e.submetricas[key];
      var delta = calcularDeltaSubmetrica(e, key);
      var nuevo = base + delta;
      var limites = SUBMETRICAS_LIMITES[key] || {};
      if (limites.min !== undefined) nuevo = Math.max(limites.min, nuevo);
      if (limites.max !== undefined) nuevo = Math.min(limites.max, nuevo);
      e.submetricas[key] = nuevo;
    }
  }

  function submetricasDelEje(e, ejeId) {
    if (!e.submetricas) return {};
    var result = {};
    var claves = Object.keys(e.submetricas);
    for (var i = 0; i < claves.length; i++) {
      var k = claves[i];
      if (k.indexOf(ejeId + ':') === 0) {
        var subId = k.split(':')[1];
        result[subId] = e.submetricas[k];
      }
    }
    return result;
  }

  return {
    nuevoPuesto:nuevoPuesto, simular:simular,
    capacidad:capacidad, capacidadPropia:capacidadPropia, desgloseCapacidad:desgloseCapacidad,
    usuarios:usuarios, mixSegmentos:mixSegmentos, fit:fit, fitMax:fitMax, retencion:retencion, retencionMedia:retencionMedia,
    ejeValor:ejeValor, usabilidadIndice:usabilidadIndice, snapshotEjes:snapshotEjes,
    carga:carga, capacidadSistema:capacidadSistema, burnMensual:burnMensual, runwayMeses:runwayMeses,
    nomina:nomina, infra:infra, calcularMrr:calcularMrr,
    estimacion:estimacion, estimacionDetalle:estimacionDetalle, posturaDe:posturaDe, costoDe:costoDe, comprometido:comprometido, confianza:confianza, requisitosGate:requisitosGate, compuerta:compuerta,
    abierto:abierto, fraccionGate:fraccionGate, contratar:contratar, ronda:ronda, pivotar:pivotar,
    progresoMandato:progresoMandato, progresoDe:progresoDe, ritmoMandato:ritmoMandato, alineacion:alineacion, cascada:cascada,
    seg:seg, apuesta:apuesta,
    esContingencia:esContingencia, contActiva:contActiva, hayContingencia:hayContingencia,
    depPendiente:depPendiente, factorSinBase:function () { return FACTOR_SIN_BASE; },
    enEspera:enEspera, escalar:escalar, costoEscalar:costoEscalar,
    lastreContingencia:lastreContingencia,
    /* asegurarBacklog() corre al cargar una partida guardada: resincroniza el
       índice de derivadas y, si el backlog quedó vacío (partidas de antes de
       la segunda vuelta), lo vuelve a llenar sin gastar un mes */
    asegurarBacklog:function (e) { if (e) rellenarBacklog(e); },
    llamarApuesta:llamarApuesta, calibracion:calibracion, juzgarLlamada:juzgarLlamada,
    libroDeLlamada:libroDeLlamada,
    setearSubmetricasBase:setearSubmetricasBase, updateSubmetricasMonth:updateSubmetricasMonth, submetricasDelEje:submetricasDelEje
  };
})();
