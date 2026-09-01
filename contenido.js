/* Contenido del juego: necesidades, segmentos, ideas, backlog y dilemas.
   ES5 estricto (Safari 9). */

/* Las necesidades son el "trabajo por hacer" del cliente. Cada apuesta del
   backlog cubre una. Cada segmento exige un subconjunto distinto: ahí vive el
   abismo. */
var NECESIDADES = [
  { id:'core',   nombre:'El trabajo central',      corto:'Núcleo' },
  { id:'flujo',  nombre:'Entrar y activarse',      corto:'Flujo' },
  { id:'datos',  nombre:'Ver qué está pasando',    corto:'Datos' },
  { id:'integra',nombre:'Integrarse con lo que ya usan', corto:'Integra' },
  { id:'soporte',nombre:'Soporte y garantías',     corto:'Soporte' },
  { id:'segur',  nombre:'Seguridad y cumplimiento',corto:'Segur.' },
  { id:'escala', nombre:'Aguantar volumen',        corto:'Escala' }
];

var SEGMENTOS = [
  { id:'innov', nombre:'Innovadores', desc:'Prueban cualquier cosa nueva. Te perdonan todo.',
    tam:900,    requiere:['core'],
    retBase:0.70, exigFiab:0.15, paga:0.5 },
  { id:'visio', nombre:'Visionarios', desc:'Compran la promesa. Quieren ventaja, no seguridad.',
    tam:6000,   requiere:['core','flujo','datos'],
    retBase:0.78, exigFiab:0.40, paga:1.0 },
  { id:'pragm', nombre:'Mayoría temprana', desc:'Compran lo que ya le funciona a alguien como ellos.',
    tam:32000,  requiere:['core','flujo','datos','integra','soporte','segur'],
    retBase:0.91, exigFiab:0.85, paga:1.2 },
  { id:'conse', nombre:'Mayoría tardía', desc:'Compran cuando no comprar es el riesgo.',
    tam:55000,  requiere:['core','flujo','datos','integra','soporte','segur','escala'],
    retBase:0.95, exigFiab:0.95, paga:1.0 }
];

var IDEAS = [
  { id:'cobranzas',
    nombre:'Cobranzas para PyMEs',
    tagline:'Que las facturas se cobren solas.',
    desc:'Mercado enorme y desatendido. El líder vende a corporaciones y no se '+
         'va a molestar en mirarte por años. Disrupción de manual — si aguantás.',
    precio:60, escala:1.0, viral:1.0, cac:1.0, caja:210000, competidor:0.55, ventaja:'La gama baja está libre.',
    riesgo:'Ticket chico: necesitás volumen, y el volumen rompe cosas.' },
  { id:'datos',
    nombre:'Plataforma de datos para retail',
    tagline:'Un solo lugar donde el número sea el mismo.',
    desc:'Ticket alto y clientes serios. Pero seguridad, integraciones y soporte '+
         'no son opcionales: el abismo empieza casi en el primer cliente.',
    precio:220, escala:0.32, viral:0.55, cac:0.55, caja:230000, competidor:0.8, ventaja:'Cada cliente paga como diez.',
    riesgo:'Sin producto completo no vendés nada, y eso tarda.' },
  { id:'habitos',
    nombre:'Hábitos financieros (consumo)',
    tagline:'Ahorrar sin pensarlo.',
    desc:'Crecimiento viral posible y sin trabas de compliance. El problema es '+
         'el otro: la gente se va a las dos semanas si no le cambiaste la vida.',
    precio:15, escala:14, viral:2.6, cac:2.2, caja:190000, competidor:0.35, ventaja:'Boca a boca barato.',
    riesgo:'Retención brutal. Sin bucle de hábito, es un balde agujereado.' }
];

/* Backlog. impactoBase es el techo; el motor le aplica un factor oculto al
   empezar la partida, así que dos partidas no premian las mismas apuestas.
   senuelo = suena bien, casi nunca sirve. */
var APUESTAS = [
  { id:'motor',    nec:'core',   costo:14, imp:30, n:'Motor de reglas v1',        d:'Automatiza el caso de uso principal.' },
  { id:'plantillas',nec:'core',  costo:8,  imp:18, n:'Plantillas por rubro',      d:'El usuario arranca con algo ya armado.' },
  { id:'batch',    nec:'core',   costo:12, imp:22, n:'Operaciones en lote',       d:'Hacer de a mil lo que se hacía de a uno.' },
  { id:'movil',    nec:'core',   costo:16, imp:16, n:'App móvil nativa',          d:'Todos la piden. Nadie sabe para qué.' },
  { id:'ia',       nec:'core',   costo:18, imp:34, n:'Asistente con IA',          d:'El board lo va a amar.', senuelo:true },

  { id:'onboard',  nec:'flujo',  costo:9,  imp:26, n:'Onboarding guiado',         d:'Del registro al primer valor sin ayuda.' },
  { id:'importar', nec:'flujo',  costo:11, imp:24, n:'Importador de datos',       d:'Traer lo que ya tienen sin sufrir.' },
  { id:'rediseno', nec:'flujo',  costo:15, imp:20, n:'Rediseño visual completo',  d:'Se ve mucho mejor.', senuelo:true },
  { id:'atajos',   nec:'flujo',  costo:6,  imp:14, n:'Atajos y acciones rápidas', d:'Para los que ya viven adentro.' },

  { id:'tablero',  nec:'datos',  costo:10, imp:24, n:'Tablero de control',        d:'El número que el jefe pide el lunes.' },
  { id:'alertas',  nec:'datos',  costo:8,  imp:20, n:'Alertas configurables',     d:'Que el producto avise en vez de esperar.' },
  { id:'export',   nec:'datos',  costo:5,  imp:12, n:'Exportar a planilla',       d:'Sí, igual todos exportan a planilla.' },

  { id:'api',      nec:'integra',costo:13, imp:26, n:'API pública',               d:'Que otros construyan encima.' },
  { id:'conectores',nec:'integra',costo:16,imp:32, n:'Conectores con los 5 grandes', d:'Los sistemas que ya usan y no van a dejar.' },
  { id:'webhooks', nec:'integra',costo:7,  imp:16, n:'Webhooks',                  d:'Pegamento barato para automatizar.' },

  { id:'sla',      nec:'soporte',costo:12, imp:28, n:'Soporte con SLA',           d:'Alguien atiende, y por escrito.' },
  { id:'docs',     nec:'soporte',costo:7,  imp:18, n:'Documentación y centro de ayuda', d:'Que no todo termine en un chat.' },
  { id:'casos',    nec:'soporte',costo:9,  imp:22, n:'Casos de éxito publicados', d:'La referencia que el pragmático necesita.' },

  { id:'sso',      nec:'segur',  costo:11, imp:24, n:'SSO y roles',               d:'Sin esto, IT te frena en la puerta.' },
  { id:'auditoria',nec:'segur',  costo:14, imp:26, n:'Auditoría y trazabilidad',  d:'Quién tocó qué y cuándo.' },
  { id:'cifrado',  nec:'segur',  costo:10, imp:20, n:'Cifrado y retención de datos', d:'La pregunta 3 de todo cuestionario.' },

  { id:'cache',    nec:'escala', costo:12, imp:26, n:'Caché y colas',             d:'Que el pico no sea un incidente.' },
  { id:'multi',    nec:'escala', costo:17, imp:30, n:'Multi-región',              d:'Latencia y aguante de verdad.' },
  { id:'observa',  nec:'escala', costo:9,  imp:22, n:'Observabilidad',            d:'Ver el problema antes que el cliente.' }
];

/* Apuestas propias de cada sector. Se suman al backlog genérico según dónde
   estés trabajando: en un neobanco la licencia es el producto; en silicio, el
   respin. */
var APUESTAS_SECTOR = [
  /* --- datos y opinión pública --- */
  { id:'padron',    nec:'integra',costo:16, imp:32, n:'Integración de datos públicos',  d:'Padrones, boletines, presupuesto: todo cruzado.' },
  { id:'microseg',  nec:'core',   costo:18, imp:34, n:'Segmentación fina de audiencias',d:'El mensaje correcto al barrio correcto.' },
  { id:'transparencia',nec:'segur',costo:14,imp:30, n:'Panel público de transparencia', d:'Mostrar qué datos usás antes de que pregunten.' },
  { id:'simulador', nec:'datos',  costo:20, imp:36, n:'Simulador de escenarios',        d:'Qué pasa si el indeciso se parte 60/40.' },

  /* --- biogenética --- */
  { id:'plegado',   nec:'core',   costo:26, imp:40, n:'Modelo de plegado propio',       d:'Tu ventaja o tu ruina. Meses de cómputo.' },
  { id:'sintesis',  nec:'escala', costo:22, imp:34, n:'Pipeline de síntesis',           d:'Del diseño in silico al tubo de ensayo sin fila.' },
  { id:'bioseg',    nec:'segur',  costo:18, imp:34, n:'Protocolos de bioseguridad',     d:'La pregunta uno de todo auditor.' },
  { id:'patentes',  nec:'soporte',costo:16, imp:28, n:'Cartera de patentes',            d:'Lo único que el inversor entiende de tu ciencia.' },

  /* --- banco digital --- */
  { id:'licencia',  nec:'segur',  costo:28, imp:40, n:'Licencia y cumplimiento',        d:'Sin esto no hay mercado grande.' },
  { id:'antifraude',nec:'segur',  costo:18, imp:30, n:'Motor antifraude',               d:'Cada punto de fraude sale de tu margen.' },
  { id:'adelanto',  nec:'core',   costo:20, imp:34, n:'Crédito y adelantos',            d:'Lo que realmente los trae.' },
  { id:'conciliar', nec:'datos',  costo:14, imp:26, n:'Conciliación automática',        d:'La tarea que odian todos los meses.' },

  /* --- energía renovable --- */
  { id:'sensor',    nec:'core',   costo:18, imp:30, n:'Medidor de bajo costo',          d:'Si el fierro sale caro, no hay negocio.' },
  { id:'verificacion',nec:'datos',costo:20, imp:36, n:'Verificación del ahorro',        d:'La prueba que convierte medición en factura.' },
  { id:'despacho',  nec:'escala', costo:22, imp:30, n:'Despacho automático de energía', d:'Vender el excedente en la hora cara.' },
  { id:'tarifas',   nec:'integra',costo:12, imp:24, n:'Motor de tarifas',               d:'Cada distribuidora cobra distinto.' },

  /* --- devtools --- */
  { id:'cli',       nec:'flujo',  costo:12, imp:30, n:'CLI de primera clase',           d:'Donde tu usuario ya vive.' },
  { id:'plantillas2',nec:'core',  costo:10, imp:22, n:'Recetas listas',                 d:'Del clonar al funcionar en un minuto.' },
  { id:'panel',     nec:'datos',  costo:14, imp:24, n:'Panel para el que paga',         d:'El que firma no usa la CLI.' },
  { id:'openq',     nec:'soporte',costo:16, imp:20, n:'Versión abierta de la comunidad',d:'Adopción sí, ingresos quizá.', senuelo:true },

  /* --- apuestas y juego online --- */
  { id:'cuotas',    nec:'core',   costo:18, imp:34, n:'Motor de cuotas en vivo',        d:'La cuota que se mueve con el partido. Tu margen vive acá.' },
  { id:'vip',       nec:'datos',  costo:16, imp:32, n:'Programa VIP',                   d:'El 2% de los apostadores deja el 60% de la plata.' },
  { id:'autoexclusion',nec:'segur',costo:14,imp:30, n:'Controles de adicción',          d:'Lo que el regulador mira primero y vos dejaste para después.' },
  { id:'pagos',     nec:'flujo',  costo:15, imp:28, n:'Depósito y retiro instantáneo',  d:'El que no puede cobrar rápido no vuelve.' },

  /* --- salud premium --- */
  { id:'concierge', nec:'soporte',costo:20, imp:36, n:'Equipo médico concierge',        d:'Una persona que atiende el teléfono a las 3 AM.' },
  { id:'longevidad',nec:'core',   costo:22, imp:34, n:'Programa de longevidad',         d:'El chequeo anual convertido en membresía.' },
  { id:'vipapp',    nec:'flujo',  costo:14, imp:28, n:'App de miembro',                 d:'Resultados, turnos y historia sin llamar a nadie.' },
  { id:'redmedica', nec:'integra',costo:18, imp:30, n:'Red de especialistas',           d:'El mejor cardiólogo de la ciudad, con turno mañana.' }
];

for (var _i = 0; _i < APUESTAS_SECTOR.length; _i++) APUESTAS.push(APUESTAS_SECTOR[_i]);

/* ---------------------------------------------------------------
   Dilemas. Cada uno enseña algo y está atado a un libro.
   quien: quién del elenco te lo trae (la UI pone nombre y cargo).
   cuando(e) decide si puede salir este mes.
   --------------------------------------------------------------- */
function nota(log, tipo, texto, libro) {
  log.push({ tipo:tipo, texto:texto, libro:libro || null });
}

var EVENTOS = [

{ id:'momtest', libro:'momtest', prio:100, quien:'cto',
  cuando:function(e){ return e.mesPuesto === 1 && e.evidencia < 55; },
  titulo:'Cómo vamos a hablar con los usuarios',
  texto:'"Conseguí diez reuniones con clientes para esta semana. ¿Qué les preguntamos?"',
  opciones:[
    { txt:'Mostrarles la demo y preguntar si la comprarían',
      nota:'Nadie te va a decir que no en la cara. Vas a salir con diez "me encanta" y cero información.',
      libro:'momtest',
      ef:function(e,log){ e.calidadDesc = 0.35; e.sesgo = 1;
        nota(log,'malo','Elegiste preguntar por el futuro. Tus estimaciones de impacto ahora vienen infladas.','momtest'); } },
    { txt:'Preguntar qué hicieron la última vez que tuvieron el problema',
      nota:'Los hechos del pasado no mienten. Cuesta más y aburre más, pero es lo único usable.',
      libro:'momtest',
      ef:function(e,log){ e.calidadDesc = 1.0; e.sesgo = 0;
        nota(log,'bueno','Vas a aprender más lento y más cierto. Tus estimaciones van a ser confiables.','momtest'); } },
    { txt:'Pedirles compromiso: adelanto o piloto pago',
      nota:'El compromiso es la señal más cara de falsificar. También espanta a los que solo eran simpáticos.',
      libro:'momtest',
      ef:function(e,log){ e.calidadDesc = 1.15; e.sesgo = 0; e.caja += 12000;
        nota(log,'bueno','Dos firmaron un piloto pago. Entró plata y, mejor, entró certeza.','momtest'); } }
  ]},

{ id:'contratar', libro:'brooks', prio:80, quien:'ceo',
  cuando:function(e){ return Motor.runwayMeses(e) > 9 && e.mesPuesto > 2 && e.rampa.length === 0; },
  titulo:'Hay presupuesto y hay atraso',
  texto:'"El roadmap va tarde y el board aprobó plata para gente. ¿Cuántos traemos?"',
  opciones:[
    { txt:'Cuatro ingenieros, ya',
      nota:'Los nuevos no producen por dos meses y consumen a los que producían. Cuatro a la vez es un trimestre perdido.',
      libro:'brooks',
      ef:function(e,log){ var i; for(i=0;i<4;i++) Motor.contratar(e,'ing');
        nota(log,'malo','Cuatro incorporaciones simultáneas. La mentoría se come los próximos meses.','brooks'); } },
    { txt:'Uno ahora, evaluamos en dos meses',
      nota:'De a uno, la comunicación se mantiene manejable y cada persona llega a producir antes de la siguiente.',
      libro:'brooks',
      ef:function(e,log){ Motor.contratar(e,'ing');
        nota(log,'bueno','Una incorporación. Costo de mentoría acotado.','brooks'); } },
    { txt:'Nadie: primero bajamos deuda',
      nota:'Con deuda alta, cada persona nueva rinde menos. A veces el equipo más rápido es el mismo con menos lastre.',
      libro:'fowler',
      ef:function(e,log){ e.deuda = Math.max(0, e.deuda - 8);
        nota(log,'bueno','Nadie nuevo. El equipo respira y la deuda baja 8 puntos.','fowler'); } }
  ]},

{ id:'clientegrande', libro:'trap', prio:85, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 3 && e.mrr > Motor.burnMensual(e) * 0.2; },
  titulo:'El cliente que salva el trimestre',
  texto:'"Firma por 18 meses. Solo pide un módulo a medida que no le sirve a nadie más. ¿Cerramos?"',
  opciones:[
    { txt:'Aceptar. Es plata hoy',
      nota:'Es ingreso real y también una hipoteca: ese módulo se mantiene para siempre y no mueve tu producto.',
      libro:'trap',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 2.5; e.deuda += 12; e.capacidadReservada = 3;
        nota(log,'neutro','Entró la plata y una obligación a medida: +12 de deuda y tres meses con capacidad comprometida.','trap'); } },
    { txt:'Solo si sale como versión general del pedido',
      nota:'Convertir un pedido puntual en capacidad para todos es la salida elegante. Se cobra menos y se aprende más.',
      libro:'inspired',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 1.2; e.cobertura.integra += 10;
        nota(log,'bueno','Menos plata y el pedido salió como integración genérica: +10 en Integraciones.','inspired'); } },
    { txt:'Rechazar',
      nota:'Decirle que no a un cheque es la decisión más difícil que existe. También la que protege el foco.',
      libro:'hard',
      ef:function(e,log){ e.foco += 6; e.moral -= 3; e.politico -= 4;
        nota(log,'neutro','Dijiste que no. Ventas no lo entendió, el roadmap sigue siendo tuyo.','hard'); } }
  ]},

{ id:'reescritura', libro:'fowler', prio:90, quien:'estrella',
  cuando:function(e){ return e.deuda > 55; },
  titulo:'"Hay que reescribirlo todo"',
  texto:'"No se puede sostener más. Dame tres meses sin features y lo dejo impecable."',
  opciones:[
    { txt:'Reescritura completa (3 meses sin features)',
      nota:'La reescritura casi siempre cuesta el doble de lo estimado y llega con los mismos problemas más otros nuevos.',
      libro:'fowler',
      ef:function(e,log){ e.reescritura = 3; e.deuda = 18;
        nota(log,'malo','Tres meses congelados para features. Ojalá el mercado espere.','fowler'); } },
    { txt:'Refactor continuo: 20% de cada mes',
      nota:'Pagar la deuda en cuotas mientras seguís entregando es más lento de sentir y más barato de terminar.',
      libro:'fowler',
      ef:function(e,log){ e.refactorFijo = true;
        nota(log,'bueno','Refactor permanente: cada mes reserva capacidad para bajar deuda.','fowler'); } },
    { txt:'Ahora no. Estamos por lanzar',
      nota:'Es legítimo una vez. Repetido, es la definición de interés compuesto en tu contra.',
      libro:'fowler',
      ef:function(e,log){ e.deuda += 10; e.moral -= 4;
        nota(log,'malo','La deuda sube 10 más y tu mejor ingeniera empieza a mirar LinkedIn.','fowler'); } }
  ]},

{ id:'vanidad', libro:'analytics', prio:75, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 4 && Motor.retencionMedia(e) < 0.88; },
  titulo:'La lámina del board',
  texto:'"Mañana presento. Los registros acumulados suben lindo. La retención del mes pasado... mejor no mostrarla, ¿no?"',
  opciones:[
    { txt:'Mostrar los acumulados. El board quiere buenas noticias',
      nota:'Un total acumulado nunca baja: por eso tranquiliza y por eso no informa. Comprás paz y perdés seis semanas.',
      libro:'analytics',
      ef:function(e,log){ e.moral += 4; e.politico += 6; e.evidencia = Math.max(0, e.evidencia - 12);
        nota(log,'malo','Todos contentos. Vos ahora sabés menos de tu propio negocio.','analytics'); } },
    { txt:'Cohortes y retención, aunque duela',
      nota:'Una métrica que importe, por cohorte, contra una línea previa. Lo único que dirige decisiones.',
      libro:'analytics',
      ef:function(e,log){ e.evidencia = Math.min(100, e.evidencia + 10); e.politico -= 5; e.foco += 5;
        nota(log,'bueno','Reunión incómoda, foco recuperado: +10 de evidencia.','analytics'); } }
  ]},

{ id:'errorbudget', libro:'sre', prio:110, quien:'cto',
  cuando:function(e){ return e.presupuestoError <= 0 && !e.congelado; },
  titulo:'Se agotó el presupuesto de error',
  texto:'"Los incidentes del trimestre se comieron todo el margen que acordamos. Según lo firmado, ahora se congela."',
  opciones:[
    { txt:'Congelar features y estabilizar',
      nota:'Cuando el presupuesto se agota, la prioridad cambia sola. Para eso existe: para no discutirlo cada vez.',
      libro:'sre',
      ef:function(e,log){ e.congelado = true;
        nota(log,'neutro','Mes de estabilización. No se construye; se arregla.','sre'); } },
    { txt:'Seguir entregando: el mercado no espera',
      nota:'Se puede. También es cómo se pierde en un trimestre la confianza que costó dos años.',
      libro:'sre',
      ef:function(e,log){ e.deuda += 14; e.riesgoExtra = 0.25; e.politico -= 6;
        nota(log,'malo','Ignoraste el acuerdo: +14 de deuda, riesgo altísimo y el CTO tomando nota.','sre'); } }
  ]},

{ id:'chasm', libro:'chasm', prio:95, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 5 && Motor.fit(e,'visio') > 0.55 && !e.gateRevelado && Motor.compuerta(e,'pragm') < 0.6; },
  titulo:'El crecimiento se aplanó',
  texto:'"Los early adopters nos aman. El mercado grande no contesta los mails, y juro que no es el precio."',
  opciones:[
    { txt:'Duplicar la inversión en marketing',
      nota:'Empujar más fuerte contra el abismo es la forma más cara de aprender que el problema no era el alcance.',
      libro:'chasm',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e); e.gateRevelado = true;
        nota(log,'malo','Un mes de burn al viento. Al menos ahora sabés dónde está la pared: mirá el panel de la Compuerta.','chasm'); } },
    { txt:'Elegir un nicho y darle el producto completo',
      nota:'El pragmático no compra producto: compra riesgo cero. Lo que le falta al producto ES el producto.',
      libro:'chasm',
      ef:function(e,log){ e.gateRevelado = true; e.foco += 8;
        nota(log,'bueno','Cabeza de playa elegida. El panel de la Compuerta te muestra qué falta exactamente.','chasm'); } }
  ]},

{ id:'termsheet', libro:'deals', prio:120, quien:'board',
  cuando:function(e){ return e.levantando && e.esFundador; },
  titulo:'Dos hojas de términos',
  texto:'"Las dos ofrecen lo mismo en dinero. Solo una te lo deja quedar."',
  opciones:[
    { txt:'Valoración alta — preferencia 2x participativa, pool 15% pre',
      nota:'La valoración es el titular. La preferencia participativa cobra primero Y participa del resto; el pool pre lo pagás vos.',
      libro:'deals',
      ef:function(e,log){ var monto = Math.max(2500000, e.mrr * 14); Motor.ronda(e, monto, monto*6, 2, true, 0.15, true);
        nota(log,'malo','Firmaste el titular lindo. La cascada de salida te lo va a explicar.','deals'); } },
    { txt:'Valoración menor — preferencia 1x no participativa, pool 10% post',
      nota:'Términos limpios. En casi cualquier salida realista te queda más a vos.',
      libro:'deals',
      ef:function(e,log){ var monto = Math.max(2500000, e.mrr * 14); Motor.ronda(e, monto, monto*4.2, 1, false, 0.10, false);
        nota(log,'bueno','Menos titular, más plata tuya.','deals'); } },
    { txt:'No levantar todavía',
      nota:'No levantar es una opción real si el negocio aguanta.',
      libro:'hard',
      ef:function(e,log){ e.levantando = false;
        nota(log,'neutro','Seguís con tu propia plata. Y con tu empresa.','hard'); } }
  ]},

{ id:'upmarket', libro:'innov', prio:70, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 6 && (e.usuarios.pragm||0) > e.tam.pragm * 0.03; },
  titulo:'Los grandes piden más',
  texto:'"Nuestras mejores cuentas quieren funcionalidad enterprise. Pagan el triple. Es plata fácil."',
  opciones:[
    { txt:'Ir hacia arriba: son los que más pagan',
      nota:'Exactamente lo que hace el incumbente antes de perder. Subir de gama abandona el terreno por donde te van a atacar a vos.',
      libro:'innov',
      ef:function(e,log){ e.precio = Math.round(e.precio*1.6); e.competidor.atencion += 0.3;
        nota(log,'neutro','Precio +60% y el líder ahora te mira. Más margen, menos aire.','innov'); } },
    { txt:'Quedarse abajo y automatizar el volumen',
      nota:'La gama baja es aburrida hasta que es el mercado entero. Que te ignoren es ventaja temporal.',
      libro:'innov',
      ef:function(e,log){ e.competidor.atencion = Math.max(0, e.competidor.atencion - 0.2); e.cobertura.core += 6;
        nota(log,'bueno','Seguís invisible para el líder. Eso es tiempo regalado: usalo.','innov'); } }
  ]},

{ id:'paridad', libro:'zero', prio:65, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && e.competidor.atencion > 0.3; },
  titulo:'El competidor lanzó algo',
  texto:'"Perdimos tres tratos esta semana por una funcionalidad que ellos tienen y nosotros no."',
  opciones:[
    { txt:'Copiarla y alcanzarlos',
      nota:'La paridad saca una objeción de la lista y no da ninguna razón para elegirte. El que va adelante gana por defecto.',
      libro:'zero',
      ef:function(e,log){ e.cobertura.core += 4; e.foco -= 6;
        nota(log,'malo','Empataste esa casilla. Perdiste un mes de ser distinto.','zero'); } },
    { txt:'Profundizar en lo que ellos no van a hacer',
      nota:'Ser 5% mejor no se defiende. Ser el único que resuelve bien una cosa concreta, sí.',
      libro:'zero',
      ef:function(e,log){ e.foco += 8; e.marca += 6;
        nota(log,'bueno','Doblaste tu diferencia. La marca lo nota.','zero'); } }
  ]},

{ id:'topologies', libro:'topologies', prio:88, quien:'cto',
  cuando:function(e){ return (e.ing + e.prod) > 10 && !e.teamTopo && e.mesPuesto > 2; },
  titulo:'El equipo no entra en una reunión',
  texto:'"Todos tocan todo, cada cambio pisa a otro, y las reuniones de coordinación se comieron los miércoles."',
  opciones:[
    { txt:'Dividir en equipos con dueño claro de cada parte',
      nota:'Hay un techo de cuánto sistema entra en una cabeza. Se sube cortando el sistema, no exigiendo esfuerzo.',
      libro:'topologies',
      ef:function(e,log){ e.teamTopo = true; e.arquitectura += 8;
        nota(log,'bueno','Equipos con límites. Sube el techo, y por Conway la arquitectura sigue el corte.','topologies'); } },
    { txt:'Sumar un manager de proyecto para coordinar',
      nota:'Coordinar más no baja la carga cognitiva: agrega un canal a un problema de demasiados canales.',
      libro:'brooks',
      ef:function(e,log){ e.caja -= 60000;
        nota(log,'malo','Más coordinación sobre la misma maraña. El techo sigue donde estaba.','brooks'); } }
  ]},

{ id:'deploys', libro:'accelerate', prio:78, quien:'estrella',
  cuando:function(e){ return e.mesPuesto > 2 && !e.cd; },
  titulo:'Los despliegues son un evento',
  texto:'"Subimos a producción cada tres semanas, un jueves a la noche, con dos personas rezando."',
  opciones:[
    { txt:'Invertir en despliegue continuo',
      nota:'Los lotes chicos y frecuentes fallan menos y se recuperan antes. Velocidad y estabilidad suben juntas.',
      libro:'accelerate',
      ef:function(e,log){ e.cd = true; e.deudaPendiente = 8;
        nota(log,'bueno','Despliegue continuo: menos riesgo de incidente y más capacidad, para siempre.','accelerate'); } },
    { txt:'Dejarlo así: funciona',
      nota:'Funciona hasta el día que no. Y ese día el problema no va a ser el cambio: va a ser el tamaño del lote.',
      libro:'accelerate',
      ef:function(e,log){ e.riesgoExtra = (e.riesgoExtra||0) + 0.06;
        nota(log,'neutro','Seguís desplegando por evento. El riesgo se acumula callado.','accelerate'); } }
  ]},

{ id:'escala', libro:'ddia', prio:105, quien:'cto',
  cuando:function(e){ return Motor.carga(e) > 0.85 && e.mesPuesto > 2; },
  titulo:'La base de datos empezó a transpirar',
  texto:'"Las consultas que tardaban 80 ms ahora tardan 2 segundos. Todavía nadie se quejó fuerte. Todavía."',
  opciones:[
    { txt:'Arreglarlo ahora, aunque frene el roadmap',
      nota:'La arquitectura no se degrada suave: aguanta y se cae de golpe. El aviso barato es este; el caro es el próximo.',
      libro:'ddia',
      ef:function(e,log){ e.arquitectura += 18; e.capacidadReservada = 1;
        nota(log,'bueno','+18 de arquitectura al costo de un mes. Compraste el aviso barato.','ddia'); } },
    { txt:'Agrandar el servidor y seguir',
      nota:'Comprar hardware corre el límite un poco y no toca el supuesto que se está por romper. Aspirina, no diagnóstico.',
      libro:'ddia',
      ef:function(e,log){ e.arquitectura += 4; e.infraExtra = (e.infraExtra||0) + 6000;
        nota(log,'neutro','Un poco de aire y más factura de infraestructura. El problema sigue ahí.','ddia'); } }
  ]},

{ id:'hooked', libro:'hooked', prio:72, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 3 && Motor.retencionMedia(e) < 0.85; },
  titulo:'Entran una vez y no vuelven',
  texto:'"Activan bien, usan dos días y desaparecen. Marketing pide notificaciones agresivas. ¿Las damos?"',
  opciones:[
    { txt:'Notificaciones agresivas y rachas',
      nota:'Los disparadores externos suben el número esta semana. Sin valor real detrás, el usuario aprende a ignorarte y te odia.',
      libro:'hooked',
      ef:function(e,log){ e.retBonus = (e.retBonus||0)+0.05; e.marca -= 14;
        nota(log,'malo','Retención +5% y marca por el piso. Pedís prestado contra tu reputación.','hooked'); } },
    { txt:'Construir el ciclo completo, con algo que dejen adentro',
      nota:'El hábito se sostiene cuando el usuario deposita algo suyo y la próxima vuelta vale más que la anterior.',
      libro:'hooked',
      ef:function(e,log){ e.retBonus = (e.retBonus||0)+0.08; e.cobertura.flujo += 8;
        nota(log,'bueno','Bucle real: +8% de retención y más Flujo. El boca a boca se enciende.','hooked'); } }
  ]},

{ id:'friccion', libro:'krug', prio:68, quien:'estrella',
  cuando:function(e){ return e.usabilidad < 45 && e.mesPuesto > 2; },
  titulo:'Miran el registro y se van',
  texto:'"De cada diez que llegan, uno termina el alta. Ventas jura que el producto es buenísimo."',
  opciones:[
    { txt:'Ver a cinco personas usarlo, en silencio',
      nota:'Nadie lee una interfaz: la escanea y adivina. Cinco personas trabándose encuentran más que seis reuniones de opinión.',
      libro:'krug',
      ef:function(e,log){ e.usabilidad += 12; e.evidencia = Math.min(100, e.evidencia+6);
        nota(log,'bueno','+12 de usabilidad. Todo el tráfico que traigas ahora convierte mejor.','krug'); } },
    { txt:'Traer más tráfico para compensar',
      nota:'Llenar un balde agujereado es la forma más cara de operar. La conversión multiplica todo lo que gastás arriba.',
      libro:'krug',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e)*0.5; e.gtmBonus = 0.3;
        nota(log,'malo','Medio mes de burn en tráfico sobre un embudo roto. Adiviná dónde terminó.','krug'); } }
  ]},

{ id:'okr', libro:'grove', prio:60, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 0 && e.mesPuesto % 6 === 0; },
  titulo:'Arranca el semestre',
  texto:'"Hay que decidir qué persigue el área estos seis meses. Cada equipo mandó su lista de deseos."',
  opciones:[
    { txt:'Un objetivo, tres resultados medibles',
      nota:'Menos objetivos, medidos por resultado y no por actividad. La claridad es la palanca más barata.',
      libro:'grove',
      ef:function(e,log){ e.foco += 12; e.moral += 5;
        nota(log,'bueno','Foco +12. El equipo sabe qué NO va a hacer, que es la parte útil.','grove'); } },
    { txt:'Nueve objetivos, uno por área, que nadie se ofenda',
      nota:'Nueve prioridades es cero prioridades. Cada área optimiza lo suyo y el total no se mueve.',
      libro:'grove',
      ef:function(e,log){ e.foco -= 10; e.moral += 2; e.politico += 3;
        nota(log,'malo','Todos contentos, nadie enfocado. Foco -10.','grove'); } }
  ]},

{ id:'discovery', libro:'torres', prio:62, quien:'cto',
  cuando:function(e){ return e.mesPuesto > 2 && e.evidencia < 35; },
  titulo:'¿Cuándo fue la última entrevista?',
  texto:'"El equipo está entregando bien. Pero nadie recuerda la última vez que habló con un usuario."',
  opciones:[
    { txt:'Entrevista semanal, sagrada, del mismo equipo que construye',
      nota:'El descubrimiento no es una fase: es un hábito. Y funciona cuando lo hace quien construye.',
      libro:'torres',
      ef:function(e,log){ e.cadenciaDesc = true;
        nota(log,'bueno','Cadencia semanal: la evidencia deja de evaporarse tan rápido.','torres'); } },
    { txt:'Contratar una consultora para un estudio grande',
      nota:'Un informe de 80 páginas llega tarde, se lee una vez y no cambia ninguna decisión de la semana siguiente.',
      libro:'torres',
      ef:function(e,log){ e.caja -= 80000; e.evidencia = Math.min(100, e.evidencia+15);
        nota(log,'neutro','$80.000 por un pico de evidencia que se degrada igual.','torres'); } }
  ]},

{ id:'roadmap', libro:'trap', prio:64, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && e.mesPuesto % 5 === 0; },
  titulo:'El roadmap del semestre',
  texto:'"Necesito fechas y nombres de features para prometerle a los clientes. Es lo que piden."',
  opciones:[
    { txt:'Lista de features con fecha',
      nota:'Un roadmap de entregables convierte al equipo en fábrica: se mide por cuánto salió, nunca por qué cambió.',
      libro:'trap',
      ef:function(e,log){ e.fabrica = true; e.foco -= 5; e.politico += 4;
        nota(log,'malo','Modo fábrica. Vas a entregar mucho y mover poco.','trap'); } },
    { txt:'Problemas a resolver con resultado esperado',
      nota:'Comprometerse con el problema y la métrica deja libre el cómo, que es donde el equipo agrega valor.',
      libro:'trap',
      ef:function(e,log){ e.fabrica = false; e.foco += 7; e.politico -= 3;
        nota(log,'bueno','Roadmap por resultados. Cuesta venderlo adentro y rinde más.','trap'); } }
  ]},

{ id:'empoderar', libro:'inspired', prio:58, quien:'estrella',
  cuando:function(e){ return (e.ing+e.prod) > 6 && e.mesPuesto > 5 && !e.empoderado; },
  titulo:'Quién decide qué se construye',
  texto:'"Todas las decisiones siguen pasando por vos. Te esperamos días para cosas que podríamos resolver solos."',
  opciones:[
    { txt:'Darle al equipo el problema y el contexto, no la solución',
      nota:'Un equipo que recibe una lista solo puede atacar la factibilidad. Los riesgos que matan productos son los otros.',
      libro:'inspired',
      ef:function(e,log){ e.empoderado = true; e.moral += 8;
        nota(log,'bueno','Equipo empoderado: más moral y mejor lectura de qué apuestas sirven.','inspired'); } },
    { txt:'Seguir decidiendo vos: es más rápido',
      nota:'Es más rápido hoy y es tu techo mañana. El resultado de un manager es el de su organización.',
      libro:'grove',
      ef:function(e,log){ e.moral -= 6;
        nota(log,'malo','Sos el cuello de botella. La moral baja y el techo lo ponés vos.','grove'); } }
  ]},

{ id:'pivote', libro:'lean', prio:115, quien:'ceo',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 6 && e.evidencia > 55 && Motor.fitMax(e) < 0.4; },
  titulo:'La evidencia dice que no',
  texto:'Ya sabés lo suficiente, y lo que sabés es malo: nadie quiere esto como está planteado.',
  opciones:[
    { txt:'Pivotar: mismo problema, otra solución',
      nota:'El pivote no es fracasar: es usar el aprendizaje que pagaste. Se conserva lo aprendido, no el plan.',
      libro:'lean',
      ef:function(e,log){ Motor.pivotar(e);
        nota(log,'bueno','Pivote hecho. Perdés cobertura construida y ganás una hipótesis que puede vivir.','lean'); } },
    { txt:'Perseverar: falta poco',
      nota:'Perseverar sin evidencia nueva es la forma más común de gastar una startup entera con mucha disciplina.',
      libro:'lean',
      ef:function(e,log){ e.moral -= 5;
        nota(log,'malo','Seguís. La caja también sigue bajando.','lean'); } }
  ]},

/* ---------------- momentos dramáticos ---------------- */

{ id:'adquisicion', libro:'deals', prio:118, quien:'board',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 9 && e.mrr > Motor.burnMensual(e) * 0.8; },
  titulo:'Quieren comprar la empresa',
  texto:'"Llegó una oferta en firme: 3 años de ingresos, mitad en efectivo. El board quiere tu recomendación."',
  opciones:[
    { txt:'Vender ahora',
      nota:'Un pájaro en mano, después de la cascada de liquidación. Vas a ver exactamente cuánto era tuyo.',
      libro:'deals',
      ef:function(e,log){ e.ventaAcordada = Math.round(e.mrr * 36);
        nota(log,'neutro','Acordado. El puesto termina y la cascada decide cuánto te llega.','deals'); } },
    { txt:'Rechazar y seguir construyendo',
      nota:'Rechazar una salida real es la apuesta más grande que vas a hacer. A veces sale. A veces se cuenta en pasado.',
      libro:'hard',
      ef:function(e,log){ e.moral += 6; e.marca += 5;
        nota(log,'neutro','Dijiste que no. Ahora hay que valer más que esa oferta.','hard'); } }
  ]},

{ id:'despidos', libro:'hard', prio:112, quien:'ceo',
  cuando:function(e){ return e.eraId === 'invierno' && Motor.runwayMeses(e) < 9 && (e.ing + e.prod + e.gtm) > 8; },
  titulo:'El board pide recortar',
  texto:'"Con este mercado no vamos a poder levantar. Necesitamos 6 meses más de runway. Decime de dónde."',
  opciones:[
    { txt:'Recorte profundo, una sola vez',
      nota:'Si hay que cortar, se corta una vez y profundo. Dos rondas de despidos matan la moral dos veces.',
      libro:'hard',
      ef:function(e,log){
        var corte = Math.max(1, Math.round(e.ing * 0.25)); e.ing -= corte;
        var corteG = Math.max(0, Math.round(e.gtm * 0.4)); e.gtm -= corteG;
        e.moral -= 12;
        nota(log,'neutro','Cortaste ' + (corte+corteG) + ' puestos de una vez. Duele hoy; se recupera.','hard'); } },
    { txt:'Recorte suave, y vemos',
      nota:'El recorte chico promete que no alcanza. El equipo lo sabe y trabaja esperando el segundo.',
      libro:'hard',
      ef:function(e,log){ e.ing = Math.max(1, e.ing - 1); e.moral -= 8; e.riesgoDespidos = true;
        nota(log,'malo','Un recorte que no alcanza. Todos saben que viene otro.','hard'); } },
    { txt:'No cortar: apostar a que el mercado vuelve',
      nota:'A veces el mercado vuelve. El runway no opina: cuenta.',
      libro:'lean',
      ef:function(e,log){ e.moral += 3;
        nota(log,'neutro','Sin recorte. Mirá el runway todos los meses.','lean'); } }
  ]},

{ id:'caza', libro:'grove', prio:96, quien:'estrella',
  cuando:function(e){ return e.calor > 0 && e.mesPuesto > 3 && e.moral < 80; },
  titulo:'Le hicieron una oferta',
  texto:'"Me ofrecieron el doble en otra empresa del rubro. No quiero irme, pero es el doble."',
  opciones:[
    { txt:'Igualar la oferta',
      nota:'Retener con plata funciona una vez. Lo que retiene de verdad es el proyecto y el mando sobre lo suyo.',
      libro:'grove',
      ef:function(e,log){ e.caja -= 140000; e.moral += 3;
        nota(log,'neutro','Se queda. Carísimo, y las razones de fondo siguen ahí.','grove'); } },
    { txt:'Dejarla ir, y repartir su sistema entre el equipo',
      nota:'Perder a la estrella duele menos que organizarse alrededor de una sola cabeza. Bus factor es deuda también.',
      libro:'topologies',
      ef:function(e,log){ e.penalCap = 10; e.deuda += 6; e.moral -= 4;
        nota(log,'neutro','Se fue. Tres meses de resaca y un sistema que ya no depende de una persona.','topologies'); } },
    { txt:'Contraoferta con mando: que sea dueña de la plataforma',
      nota:'Más mando suele valer más que más plata, y encima te ordena la organización.',
      libro:'grove',
      ef:function(e,log){ e.moral += 6; e.teamTopo = true;
        nota(log,'bueno','Se queda, con dueño claro de plataforma. Dos problemas resueltos.','grove'); } }
  ]},

{ id:'rival', libro:'zero', prio:84, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && !e.rivalVisto && e.rivalNombre; },
  titulo:'Conocés ese nombre',
  texto:'"El competidor fichó gente nueva para pelearnos el mercado grande. ¿Sabés quién lidera producto ahí ahora?"',
  opciones:[
    { txt:'Acelerar para llegar antes que su plan',
      nota:'Correr la carrera del rival es dejar que otro elija la pista. A veces hay que hacerlo igual.',
      libro:'zero',
      ef:function(e,log){ e.rivalVisto = true; e.foco -= 4; e.competidor.atencion += 0.1;
        var msg = e.rivalNombre + ' va a jugar agresivo. Vos también, ahora.';
        nota(log,'neutro',msg,'zero'); } },
    { txt:'Ignorarlo y jugar tu propio juego',
      nota:'La competencia es para perdedores, decía el libro. Tu diferencia vale más que su velocidad.',
      libro:'zero',
      ef:function(e,log){ e.rivalVisto = true; e.foco += 6;
        nota(log,'bueno','Que corra. Vos tenés un juego propio.','zero'); } }
  ]},

{ id:'downround', libro:'deals', prio:117, quien:'board',
  cuando:function(e){ return e.esFundador && e.eraId === 'invierno' && Motor.runwayMeses(e) < 7 && e.rondas.length > 0; },
  titulo:'La ronda que nadie quiere',
  texto:'"Hay un solo fondo dispuesto, a la mitad de la valoración anterior y con términos duros. O eso, o el puente del board."',
  opciones:[
    { txt:'Aceptar el down round',
      nota:'Bajar la valoración duele en el diario. La alternativa suele doler en el balance.',
      libro:'deals',
      ef:function(e,log){ var monto = Motor.burnMensual(e)*10; Motor.ronda(e, monto, e.valoracion*0.5, 1.5, true, 0.1, true);
        nota(log,'neutro','Plata en caja, orgullo en el piso, empresa viva.','deals'); } },
    { txt:'Puente del board y recorte durísimo',
      nota:'El puente compra meses, no resuelve nada. Con el recorte, quizá alcance para llegar a la primavera.',
      libro:'hard',
      ef:function(e,log){ e.caja += Motor.burnMensual(e)*5; e.ing = Math.max(1, Math.round(e.ing*0.6));
        e.gtm = Math.max(0, Math.round(e.gtm*0.5)); e.moral -= 15;
        nota(log,'malo','Puente + recorte. La mitad del equipo, el doble de presión.','hard'); } }
  ]},

/* ---------------- la zona gris ---------------- */

{ id:'canal', libro:'zero', prio:92, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 3 && e.competidor.atencion > 0.2; },
  titulo:'El sobre',
  texto:'"Un amigo de un fondo me mandó el data room completo del competidor. Roadmap, números, todo. Nadie lo va a saber."',
  opciones:[
    { txt:'Abrirlo. Sería estúpido no hacerlo',
      nota:'La información robada tiene interés compuesto: hoy te ahorra un trimestre, mañana alguien recuerda quién te la dio y qué le debés.',
      libro:'zero',
      ef:function(e,log){ e.foco += 8; e.cobertura.core += 5; e.lupa = Math.min(100, e.lupa + 18);
        nota(log,'malo','Lo leíste entero. Ganaste un trimestre y una deuda que no figura en ningún balance. La Lupa sube.','zero'); } },
    { txt:'Borrarlo y avisarle a legales',
      nota:'Aburrido, correcto, y la única versión de esta historia que dentro de dos años no te despierta a la noche.',
      libro:'hard',
      ef:function(e,log){ e.moral += 3;
        nota(log,'bueno','Borrado con testigos. El día que investiguen a ese fondo, tu nombre no aparece.','hard'); } },
    { txt:'Devolverlo... después de una miradita a la hoja de precios',
      nota:'No existe mirar un poco. Existe haber mirado.',
      libro:'hard',
      ef:function(e,log){ e.foco += 3; e.lupa = Math.min(100, e.lupa + 8);
        nota(log,'neutro','"Solo los precios." Claro. La Lupa sube igual, porque el que te lo mandó ahora lo sabe.','hard'); } }
  ]},

{ id:'cocinar', libro:'analytics', prio:108, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 4 && Motor.progresoMandato(e) < (e.mesPuesto / e.meses) * 0.8; },
  titulo:'Los números de la ronda',
  texto:'"Necesito que los churned figuren como \'pausados\' hasta que cierre la ronda. Todos lo hacen. Es presentación, no fraude."',
  opciones:[
    { txt:'Cocinarlos. Es solo hasta que cierre',
      nota:'El primer problema no es que te descubran: es que el número cocinado se vuelve el número real de tus propias decisiones. Ahora también te mentís a vos.',
      libro:'analytics',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 4; e.lupa = Math.min(100, e.lupa + 25);
        e.evidencia = Math.max(0, e.evidencia - 15); e.politico += 8;
        nota(log,'malo','La ronda cerró con números maquillados. Entró plata, la Lupa sube 25, y tu evidencia real ahora vale menos: ni vos sabés cuál es el número cierto.','analytics'); } },
    { txt:'Negarte, con el mail guardado',
      nota:'Decirle que no al CEO cuesta capital político hoy. Firmar métricas falsas cuesta la carrera entera, con intereses.',
      libro:'hard',
      ef:function(e,log){ e.politico -= 12; e.moral += 4;
        nota(log,'bueno','Dijiste que no por escrito. El CEO no lo olvida. Los fiscales tampoco olvidan, pero a favor tuyo.','hard'); } },
    { txt:'Proponer contar la historia real, bien contada',
      nota:'Una cohorte fea con un plan creíble levanta más plata que un total maquillado, con la mitad del riesgo penal.',
      libro:'analytics',
      ef:function(e,log){ e.politico -= 4; e.evidencia = Math.min(100, e.evidencia + 6);
        nota(log,'bueno','Armaste la versión honesta con narrativa. Menos brillo, cero causa judicial.','analytics'); } }
  ]},

{ id:'clubcompradores', libro:'hard', prio:106, quien:'ventas',
  cuando:function(e){ return (e.sectorId === 'biogen' || e.sectorId === 'saludgold') && e.mesPuesto > 5 && Motor.compuerta(e,'pragm') < 0.6; },
  titulo:'El club de los desesperados',
  texto:'"Hay pacientes que no pueden esperar la aprobación. Ofrecen pagar lo que sea, afuera del sistema. Un club privado de compradores. Ya existe la lista."',
  opciones:[
    { txt:'Armar el club. La regulación es lenta y la gente se muere',
      nota:'Dallas Buyers Club es una gran película porque termina mal Y bien. En tu versión, el regulador escribe el final.',
      libro:'hard',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 3; e.marca += 6;
        e.lupa = Math.min(100, e.lupa + 30); e.riesgoExtra = (e.riesgoExtra||0) + 0.1;
        nota(log,'malo','El club funciona y la plata entra. También entraste vos: en la lista del regulador. Lupa +30.','hard'); } },
    { txt:'Programa de acceso compasivo, con papeles',
      nota:'Existe una figura legal exactamente para esto. Es más lenta, cubre menos gente, y no termina con tu nombre en un expediente.',
      libro:'hard',
      ef:function(e,log){ e.marca += 8; e.cobertura.soporte += 6; e.politico += 4;
        nota(log,'bueno','Acceso compasivo aprobado. Menos épico, más pacientes a largo plazo.','hard'); } },
    { txt:'No. Esperamos la aprobación',
      nota:'Defendible, frío, y alguien va a escribir un hilo furioso sobre tu empresa. Tendrá razón a medias.',
      libro:'lean',
      ef:function(e,log){ e.marca -= 5;
        nota(log,'neutro','Esperás. El hilo furioso salió igual. La aprobación, todavía no.','lean'); } }
  ]},

{ id:'lado', libro:'grove', prio:94, quien:'cto',
  cuando:function(e){ return e.mesPuesto > 4 && (e.ing + e.prod) > 4 && !e.eventosVistos.caza; },
  titulo:'El negocio paralelo',
  texto:'"Encontré por qué la factura de infra no cierra: tu mejor ingeniera tiene un negocio propio corriendo en nuestros servidores desde hace meses."',
  opciones:[
    { txt:'Taparlo a cambio de lealtad total',
      nota:'Ahora tenés una empleada brillante que te debe una y un secreto que trabaja para ella. Los secretos cobran interés.',
      libro:'grove',
      ef:function(e,log){ e.moral -= 4; e.lupa = Math.min(100, e.lupa + 15); e.penalCap = 0; e.foco += 4;
        nota(log,'malo','Pacto sellado. Rinde muchísimo y ahora hay dos personas en la empresa que le mienten al resto.','grove'); } },
    { txt:'Echarla en el acto, con auditoría completa',
      nota:'Carísimo hoy: te quedás sin tu mejor cabeza y tres meses de resaca. Barato comparado con explicarle esto a un inversor en due diligence.',
      libro:'grove',
      ef:function(e,log){ e.penalCap = 10; e.deuda += 6; e.moral += 5;
        nota(log,'bueno','Se fue con escándalo chico. El mensaje al resto del equipo valió cada punto de capacidad.','grove'); } },
    { txt:'Comprarle el negocio y quedárselo la empresa',
      nota:'La jugada Breaking Bad: en vez de matar al negocio turbio, lo metés en el balance. Ahora el problema es oficialmente tuyo.',
      libro:'hard',
      ef:function(e,log){ e.caja -= 80000; e.mrr += 9000; e.lupa = Math.min(100, e.lupa + 10);
        nota(log,'neutro','La empresa ahora tiene una línea de ingreso que nadie sabe explicar en el board. Lupa +10.','hard'); } }
  ]},

{ id:'wolf', libro:'analytics', prio:90, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 5 && e.mandatoId === 'crecer' && Motor.progresoMandato(e) < 0.6; },
  titulo:'Usuarios de lobo',
  texto:'"Conozco una granja de instalaciones. Diez mil usuarios en dos semanas. El board mira el total, no mira de dónde salió."',
  opciones:[
    { txt:'Comprar los usuarios. El mandato es el mandato',
      nota:'Los usuarios comprados no usan, no pagan y no vuelven — pero sí entran en el promedio, y te pudren todas las métricas con las que decidís.',
      libro:'analytics',
      ef:function(e,log){
        e.usuarios.innov += e.tam.innov * 0.3; e.usuarios.visio += e.tam.visio * 0.15;
        e.retBonus = (e.retBonus||0) - 0.10; e.lupa = Math.min(100, e.lupa + 15);
        e.evidencia = Math.max(0, e.evidencia - 10);
        nota(log,'malo','El total explotó. La retención se derrumbó, tu evidencia vale menos y la Lupa sube: los fondos también saben mirar cohortes.','analytics'); } },
    { txt:'No. Mostrar el crecimiento real y bancar la reunión',
      nota:'El número real incómodo envejece bien. El número inflado envejece como leche al sol.',
      libro:'analytics',
      ef:function(e,log){ e.politico -= 6; e.evidencia = Math.min(100, e.evidencia + 5);
        nota(log,'bueno','Reunión dura, métricas limpias. Todavía sabés qué es verdad en tu empresa.','analytics'); } }
  ]},

{ id:'socio', libro:'deals', prio:104, quien:'board',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 8 && e.rondas.length > 0; },
  titulo:'El socio fantasma',
  texto:'"Tu cofundador hace seis meses que no aparece y tiene el 30%. Los abogados dicen que hay una ventana para dejarlo en 5% antes de la próxima ronda. Legal... es."',
  opciones:[
    { txt:'Ejecutar la dilución. Que lo pelee en tribunales',
      nota:'La jugada Zuckerberg. Funciona, es legal en el papel, y la historia te la van a contar a vos en una demanda con descubrimiento de mails incluido.',
      libro:'deals',
      ef:function(e,log){ e.capTable.fund = Math.min(1, e.capTable.fund + 0.12); e.moral -= 10;
        e.marca -= 6; e.lupa = Math.min(100, e.lupa + 10);
        nota(log,'malo','Tenés 12 puntos más de la empresa y una demanda en gestación. El equipo tomó nota de cómo tratás a los socios.','deals'); } },
    { txt:'Comprarle su parte a precio justo',
      nota:'Más caro hoy, y compra algo que no cotiza: que nadie de tu equipo piense que puede ser el próximo.',
      libro:'deals',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e) * 4; e.capTable.fund = Math.min(1, e.capTable.fund + 0.08); e.moral += 4;
        nota(log,'bueno','Salida limpia y firmada. Costó caja; no costó reputación.','deals'); } },
    { txt:'Dejarlo como está. 30% de socio dormido',
      nota:'El equity muerto en la cap table espanta a los inversores casi tanto como una demanda. Casi.',
      libro:'deals',
      ef:function(e,log){
        nota(log,'neutro','Queda como está. En la próxima ronda alguien va a preguntar quién es y por qué tiene 30%.','deals'); } }
  ]},

{ id:'fiscal', libro:'hard', prio:119, quien:'board',
  cuando:function(e){ return e.lupa >= 55 && !e.eventosVistos.allanamiento; },
  titulo:'La fiscal quiere hablar',
  texto:'"Extraoficialmente: tienen una carpeta sobre la empresa. Oficialmente: si alguien colabora ahora, esa persona sale limpia. La reunión es mañana."',
  opciones:[
    { txt:'Colaborar y entregar lo que sabés',
      nota:'Salís limpio vos. La empresa, el equipo y tu nombre en el rubro absorben el impacto. Los tratos con fiscales son exactamente eso: tratos.',
      libro:'hard',
      ef:function(e,log){ e.lupa = e.lupaBase + 20; e.politico -= 25; e.moral -= 12; e.marca -= 10;
        nota(log,'neutro','Colaboraste. La Lupa baja, pero esa carpeta nunca se cierra del todo. En la oficina nadie te sostiene la mirada.','hard'); } },
    { txt:'Abogados caros y silencio',
      nota:'La defensa clásica: cara, lenta, y a veces funciona. La Lupa no baja; la factura sube.',
      libro:'hard',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e) * 2; e.infraExtra = (e.infraExtra||0) + 15000;
        nota(log,'neutro','Los abogados facturan por mes y la carpeta sigue abierta. Al menos nadie habló.','hard'); } },
    { txt:'Limpiar la casa de verdad: cortar todo lo gris ya',
      nota:'La única salida que arregla la causa Y la causa de la causa. Cuesta crecimiento hoy.',
      libro:'grove',
      ef:function(e,log){ e.lupa = Math.max(e.lupaBase, e.lupa - 30); e.gtmBonus = -0.3; e.foco += 5;
        nota(log,'bueno','Cortaste todo lo que no resistía una inspección. Crecés menos este trimestre y dormís de noche.','grove'); } }
  ]},

{ id:'allanamiento', libro:'hard', prio:130, quien:'cto',
  cuando:function(e){ return e.lupa >= 85; },
  titulo:'Están abajo',
  texto:'"Hay seis personas con carpetas en la recepción y una orden. Están clonando los servidores. Ahora."',
  opciones:[
    { txt:'Cooperar en todo y llamar a los abogados',
      nota:'Cuando llegan con la orden, la partida de esconder ya terminó. La única jugada que queda es la dignidad procesal.',
      libro:'hard',
      ef:function(e,log){
        if (e.cobertura.segur >= 55 && Math.random() < 0.6) {
          e.lupa = e.lupaBase + 10; e.zafo = true; e.marca -= 8;
          nota(log,'bueno','Se llevaron todo y no encontraron nada que no resista un juicio. Zafaste. Esta vez.','hard');
        } else {
          e.imputado = true;
          nota(log,'malo','Encontraron lo que había. Hay imputación, y tu nombre está en ella.','hard');
        }
      } },
    { txt:'"Borrá lo que sabés borrar." Ya. Ahora',
      nota:'Obstrucción: el único delito que se comete delante de los testigos que vinieron a buscarlo.',
      libro:'hard',
      ef:function(e,log){
        if (Math.random() < 0.25) {
          e.lupa = 70; e.zafo = true;
          nota(log,'malo','Increíblemente, funcionó. Vivís con eso ahora.','hard');
        } else {
          e.imputado = true;
          nota(log,'malo','Lo vieron todo. A la imputación original se le sumó obstrucción. Fin.','hard');
        }
      } }
  ]},

{ id:'whale', libro:'analytics', prio:98, quien:'ventas',
  cuando:function(e){ return e.sectorId === 'apuestas' && e.mesPuesto > 3; },
  titulo:'La ballena',
  texto:'"Nuestro mejor VIP perdió una fortuna este mes. Dice que si no le devolvemos la mitad, le cuenta a un diario cómo lo tratamos: los bonos, las 3 AM, los límites que nunca le aplicamos."',
  opciones:[
    { txt:'Devolverle la mitad y que siga jugando',
      nota:'Le pagás para que siga siendo el problema. Las ballenas no se van: se hunden, y hacen olas.',
      libro:'analytics',
      ef:function(e,log){ e.caja -= Math.max(40000, e.mrr * 0.8); e.lupa = Math.min(100, e.lupa + 8);
        nota(log,'malo','Pagaste. Va a volver a perder, va a volver a amenazar, y ahora sabe que funciona.','analytics'); } },
    { txt:'Banearlo y aplicarle la autoexclusión que nunca le aplicaste',
      nota:'Perdés tu mejor cuenta y la historia que puede contar empeora... salvo que los controles ya estén de verdad.',
      libro:'sre',
      ef:function(e,log){ e.mrr = Math.round(e.mrr * 0.93); e.marca += 4; e.cobertura.segur += 6;
        nota(log,'bueno','Baneado, con protocolo y por escrito. Perdiste ingresos y compraste un argumento de defensa.','sre'); } },
    { txt:'Que hable con el diario. ¿Qué van a publicar, que apostó?',
      nota:'Van a publicar exactamente eso, con capturas de tus notificaciones de las 3 AM. Y el regulador lee ese diario.',
      libro:'hard',
      ef:function(e,log){ e.marca -= 15; e.lupa = Math.min(100, e.lupa + 20);
        nota(log,'malo','Salió la nota, con capturas. La Lupa sube 20 y el titular te lo van a leer en la próxima ronda.','hard'); } }
  ]},

{ id:'imperio', libro:'hard', prio:102, quien:'board',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 12 && e.mrr > Motor.burnMensual(e); },
  titulo:'¿Cuánto es suficiente?',
  texto:'"Hay un fondo dispuesto a comprarte el 15% de TUS acciones, a vos, hoy, en efectivo. Podés asegurar tu vida entera y seguir siendo fundador. ¿O esto ya no es por la plata?"',
  opciones:[
    { txt:'Vender el 15%. Primero la familia',
      nota:'El secondary del fundador es la herramienta más subestimada del rubro: jugar sin miedo a quebrar te hace mejor, no peor.',
      libro:'hard',
      ef:function(e,log){ var venta = e.valoracion * 0.15 * e.capTable.fund * 0.85;
        e.capTable.fund *= 0.85; e.ventaSecundaria = (e.ventaSecundaria||0) + venta;
        nota(log,'bueno','Vendiste una parte tuya con descuento. Menos empresa, cero miedo. Se nota en cómo decidís.','hard'); } },
    { txt:'No. Estoy en el negocio del imperio',
      nota:'La frase es de Walter White y a él no le terminó bien. A algunos les sale. Vos sabrás cuál sos.',
      libro:'hard',
      ef:function(e,log){ e.foco += 6; e.moral -= 3;
        nota(log,'neutro','Todo o nada, entonces. El board anotó la frase para citarla después, gane quien gane.','hard'); } }
  ]}
];

function eventoAplicable(e) {
  var cand = [], i;
  for (i = 0; i < EVENTOS.length; i++) {
    var ev = EVENTOS[i];
    if (e.eventosVistos[ev.id]) continue;
    var ok = false;
    try { ok = ev.cuando(e); } catch (err) { ok = false; }
    if (ok) cand.push(ev);
  }
  if (!cand.length) return null;
  cand.sort(function(a,b){ return b.prio - a.prio; });
  return cand[0];
}
