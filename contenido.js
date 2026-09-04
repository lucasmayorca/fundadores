/* Contenido del juego: necesidades, segmentos, ideas, backlog y dilemas.
   Sin build ni dependencias. */

/* Las necesidades son el "trabajo por hacer" del cliente. Cada apuesta del
   backlog cubre una. Cada segmento exige un subconjunto distinto: ahí
   vive el abismo. */
var NECESIDADES = [
  { id:'core',   nombre:'El trabajo central',      corto:'Núcleo' },
  { id:'flujo',  nombre:'Entrar y activarse',      corto:'Flujo' },
  { id:'datos',  nombre:'Ver qué pasa',            corto:'Datos' },
  { id:'integra',nombre:'Integrarse', corto:'Integr.' },
  { id:'soporte',nombre:'Soporte',  corto:'Soporte' },
  { id:'segur',  nombre:'Seguridad', corto:'Segur.' },
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
  { id:'conse', nombre:'Mayoría tardía', desc:'Compran cuando el riesgo es no comprar.',
    tam:55000,  requiere:['core','flujo','datos','integra','soporte','segur','escala'],
    retBase:0.95, exigFiab:0.95, paga:1.0 }
];

var IDEAS = [
  { id:'cobranzas',
    nombre:'Cobranzas para pymes',
    tagline:'Facturas que se cobran solas.',
    desc:'Mercado enorme y desatendido. El líder le vende a corporaciones y no '+
         'se va a molestar en mirarte por años. Disrupción de manual — si la aguantas.',
    precio:60, escala:1.0, viral:1.0, cac:1.0, caja:210000, competidor:0.55, ventaja:'La gama baja está abierta de par en par.',
    riesgo:'Ticket chico: necesitas volumen, y el volumen rompe cosas.' },
  { id:'datos',
    nombre:'Plataforma de datos para retail',
    tagline:'Un solo lugar donde el número es el mismo en todas partes.',
    desc:'Ticket grande y clientes serios. Pero seguridad, integraciones y soporte '+
         'no son opcionales: el abismo empieza prácticamente con tu primer cliente.',
    precio:220, escala:0.32, viral:0.55, cac:0.55, caja:230000, competidor:0.8, ventaja:'Cada cliente paga como diez.',
    riesgo:'Sin producto completo no vendes nada, y completo toma tiempo.' },
  { id:'habitos',
    nombre:'Hábitos financieros de consumo',
    tagline:'Ahorrar sin pensarlo.',
    desc:'El crecimiento viral es posible y no hay trabas regulatorias. El problema '+
         'es lo otro: la gente se va a las dos semanas salvo que le hayas cambiado la vida.',
    precio:15, escala:14, viral:2.6, cac:2.2, caja:190000, competidor:0.35, ventaja:'Boca a boca barato.',
    riesgo:'Retención brutal. Sin un ciclo de hábito, es un balde con fugas.' }
];

/* Backlog. impactoBase es el techo; el motor aplica un factor oculto al
   inicio de cada partida, así que no hay dos partidas que premien las
   mismas apuestas. senuelo = suena genial, casi nunca cumple. */
var APUESTAS = [
  { id:'motor',    nec:'core',   costo:14, imp:30, n:'Motor de reglas v1',         d:'Automatiza el caso de uso central.',
    d2:'Codificás la lógica que hoy hace un humano a mano, para que el producto la resuelva solo, siempre igual, sin turnos.',
    impactoSubmetricas: { 'act:time_value':12, 'act:task_success':14, 'ret:stickiness':8, 'adq:conv_rate':2 } },
  { id:'plantillas', dep:'motor',nec:'core',  costo:8,  imp:18, n:'Plantillas por industria',   d:'Los usuarios arrancan con algo ya construido.',
    d2:'Un punto de partida armado por vertical: menos pantalla en blanco, menos abandono en el primer día.',
    impactoSubmetricas: { 'act:onboard':16, 'act:task_success':12, 'adq:conv_rate':4, 'act:time_value':8, 'ret:stickiness':10, 'ret:dau_mau':6 } },
  { id:'batch', dep:'motor',    nec:'core',   costo:12, imp:22, n:'Operaciones masivas',        d:'Hacer de a miles lo que se hacía de a uno.',
    d2:'Seleccionar, editar o borrar en lote — la diferencia entre un usuario power y uno que se cansa al décimo clic.',
    impactoSubmetricas: { 'ret:stickiness':18, 'act:task_success':10, 'adq:conv_rate':2, 'deuda:refactor_backlog':3 } },
  { id:'movil', dep:'api',    nec:'core',   costo:16, imp:16, n:'App móvil nativa',           d:'Todos la piden. Nadie sabe para qué.',
    d2:'Cámara, notificaciones push, uso sin conexión — capacidades que el navegador no te da, si de verdad las necesitás.',
    impactoSubmetricas: { 'adq:mix_canal':8, 'ret:stickiness':6, 'act:feature_adopt':4, 'deuda:deprecations':2 } },
  { id:'ia', dep:'motor',       nec:'core',   costo:18, imp:34, n:'Asistente de IA',            d:'Al directorio le va a encantar.', senuelo:true,
    d2:'Suena a la demo perfecta para la próxima junta de directorio. En producción, resuelve un problema que casi nadie tenía.',
    impactoSubmetricas: { 'adq:conv_rate':14, 'evid:press':8, 'act:feature_adopt':6, 'deuda:test_cov':-4, 'ret:stickiness':19, 'ret:dau_mau':11 } },

  { id:'onboard',  nec:'flujo',  costo:9,  imp:26, n:'Onboarding guiado',          d:'Del registro al primer valor sin llevarlos de la mano.',
    d2:'Un camino paso a paso hasta el primer "ajá" — el momento exacto en que entienden para qué sirve esto.',
    impactoSubmetricas: { 'act:time_value':14, 'act:onboard':22, 'ret:stickiness':6, 'adq:conv_rate':5, 'act:task_success':8 } },
  { id:'importar', nec:'flujo',  costo:11, imp:24, n:'Importador de datos',        d:'Traer lo que ya tienen sin el dolor.',
    d2:'Migrar desde una planilla o el sistema anterior sin que un humano tenga que tipear todo de nuevo.',
    impactoSubmetricas: { 'act:time_value':10, 'act:onboard':14, 'ret:churn':-4, 'adq:conv_rate':6, 'deuda:test_cov':-2 } },
  { id:'rediseno', nec:'flujo',  costo:15, imp:20, n:'Rediseño visual completo',   d:'Se ve mucho mejor.', senuelo:true,
    d2:'Meses de trabajo para que la pantalla se vea distinta. El problema que hace que se vayan sigue intacto.',
    impactoSubmetricas: { 'adq:conv_rate':8, 'act:feature_adopt':6, 'deuda:refactor_backlog':4 } },
  { id:'atajos',   nec:'flujo',  costo:6,  imp:14, n:'Atajos y acciones rápidas',  d:'Para los que ya viven adentro.',
    d2:'Teclado, comandos rápidos, menos clics — value para el usuario frecuente, invisible para el que recién llega.',
    impactoSubmetricas: { 'ret:stickiness':12, 'act:task_success':6, 'rev:arpu':2, 'adq:conv_rate':4, 'adq:visit_signup':3 } },

  { id:'tablero',  nec:'datos',  costo:10, imp:24, n:'Tablero de control',         d:'El número que el jefe pide el lunes.',
    d2:'Los indicadores clave en una sola pantalla, sin tener que pedirle el reporte a nadie.',
    impactoSubmetricas: { 'act:feature_adopt':14, 'ret:stickiness':12, 'adq:conv_rate':8, 'rev:arpu':4 } },
  { id:'alertas', dep:'tablero',  nec:'datos',  costo:8,  imp:20, n:'Alertas configurables',      d:'El producto avisa en vez de esperar.',
    d2:'Umbrales que el usuario define: si algo se sale de rango, se entera por notificación, no revisando a mano.',
    impactoSubmetricas: { 'ret:dau_mau':10, 'ret:stickiness':8, 'act:feature_adopt':8, 'adq:mix_canal':3, 'rev:arpu':10, 'rev:expansion':6 } },
  { id:'export', dep:'tablero',   nec:'datos',  costo:5,  imp:12, n:'Exportar a planilla',        d:'Sí, igual todos exportan a una planilla.',
    d2:'Poco glamoroso, pero es la puerta de salida que todo cliente corporativo pregunta antes de firmar.',
    impactoSubmetricas: { 'adq:conv_rate':6, 'ret:stickiness':4, 'act:task_success':4, 'rev:arpu':6, 'rev:expansion':3 } },

  { id:'api',      nec:'integra',costo:13, imp:26, n:'API pública',                d:'Que otros construyan encima.',
    d2:'Documentada y estable, para que un tercero pueda automatizar contra tu producto sin llamarte por teléfono.',
    impactoSubmetricas: { 'ref:viral_k':12, 'adq:mix_canal':8, 'ret:stickiness':6, 'deuda:test_cov':-3, 'deuda:security_p1':-2 } },
  { id:'conectores', dep:'api',nec:'integra',costo:16,imp:32, n:'Conectores a los 5 grandes', d:'Los sistemas que ya usan y no van a soltar.',
    d2:'Integración directa con las herramientas que ya tienen instaladas: menos fricción para decir que sí.',
    impactoSubmetricas: { 'adq:conv_rate':14, 'act:task_success':12, 'rev:arpu':8, 'ret:stickiness':4 } },
  { id:'webhooks', dep:'api', nec:'integra',costo:7,  imp:16, n:'Webhooks',                   d:'Pegamento barato para automatizar.',
    d2:'Un evento de tu lado dispara una acción del otro, sin que nadie tenga que revisar nada manualmente.',
    impactoSubmetricas: { 'ret:stickiness':10, 'ref:viral_k':6, 'adq:mix_canal':4 } },

  { id:'sla', dep:'observa',      nec:'soporte',costo:12, imp:28, n:'Soporte con SLA',            d:'Alguien contesta, y está por escrito.',
    d2:'Un tiempo de respuesta garantizado por contrato — lo que un comprador corporativo necesita para dormir tranquilo.',
    impactoSubmetricas: { 'adq:conv_rate':16, 'ret:churn':-3, 'rev:arpu':10 } },
  { id:'docs',     nec:'soporte',costo:7,  imp:18, n:'Docs y centro de ayuda',     d:'Para que no todo termine en un chat.',
    d2:'Respuestas escritas una vez, buscables para siempre — cada pregunta resuelta ahí es una que tu equipo no contesta dos veces.',
    impactoSubmetricas: { 'act:onboard':12, 'ret:churn':-2, 'act:task_success':8, 'adq:conv_rate':6, 'adq:visit_signup':3 } },
  { id:'casos', dep:'sla',    nec:'soporte',costo:9,  imp:22, n:'Casos de éxito publicados',  d:'La referencia que el pragmático necesita.',
    d2:'Prueba social con nombre y apellido: alguien parecido a tu próximo cliente ya lo usa y le funcionó.',
    impactoSubmetricas: { 'evid:cases':10, 'adq:conv_rate':8, 'ref:referral_rate':4, 'ret:churn':-18, 'ret:reactivation':11 } },

  { id:'sso',      nec:'segur',  costo:11, imp:24, n:'SSO y roles',                d:'Sin esto, TI te frena en la puerta.',
    d2:'Inicio de sesión centralizado y permisos por rol — el primer casillero que marca cualquier área de sistemas.',
    impactoSubmetricas: { 'adq:conv_rate':12, 'rev:arpu':10, 'gate:gate_fit':8, 'deuda:security_p1':-2, 'rel:error_rate':-10, 'rel:uptime':6 } },
  { id:'auditoria', dep:'sso',nec:'segur',  costo:14, imp:26, n:'Auditoría y trazabilidad',   d:'Quién tocó qué, y cuándo.',
    d2:'Un registro inmutable de cada acción — imprescindible el día que algo sale mal y hay que reconstruir qué pasó.',
    impactoSubmetricas: { 'adq:conv_rate':14, 'rev:arpu':12, 'gate:gate_fit':10, 'deuda:refactor_backlog':2, 'rel:error_rate':-10, 'rel:uptime':6 } },
  { id:'cifrado',  nec:'segur',  costo:10, imp:20, n:'Cifrado y retención de datos', d:'La pregunta 3 de todo cuestionario de seguridad.',
    d2:'Datos protegidos en reposo y en tránsito, con reglas claras de cuánto tiempo se guardan.',
    impactoSubmetricas: { 'gate:gate_fit':12, 'adq:conv_rate':10, 'rev:arpu':8, 'deuda:security_p1':-3, 'rel:error_rate':-8, 'rel:uptime':5 } },

  { id:'cache', dep:'observa',    nec:'escala', costo:12, imp:26, n:'Caché y colas',              d:'Para que el pico no sea un incidente.',
    d2:'Absorbe ráfagas de tráfico sin que el sistema se caiga ni el usuario note que hubo un pico.',
    impactoSubmetricas: { 'rel:latency_p95':-40, 'rel:uptime':4, 'ret:stickiness':8 } },
  { id:'multi', dep:'observa',    nec:'escala', costo:17, imp:30, n:'Multirregión',               d:'Latencia real y aguante real.',
    d2:'Servidores más cerca del usuario y redundancia si una región entera se cae — velocidad y continuidad, a la vez.',
    impactoSubmetricas: { 'rel:latency_p95':-60, 'rel:uptime':8, 'adq:conv_rate':6, 'deuda:refactor_backlog':6 } },
  { id:'observa',  nec:'escala', costo:9,  imp:22, n:'Observabilidad',             d:'Ver el problema antes que el cliente.',
    d2:'Métricas y logs que avisan de una degradación antes de que se convierta en un ticket de soporte.',
    impactoSubmetricas: { 'rel:mttr':-20, 'rel:uptime':6, 'ret:stickiness':4 } }
];

/* Apuestas por sector. Se suman al backlog genérico según dónde trabajes:
   en un neobanco la licencia es el producto; en silicio, el respin. Cada una
   lleva `etapa`: es LA gran apuesta obvia de esa industria en ese momento
   específico del ciclo de vida — no aparece en el backlog de una empresa que
   está en otra etapa (ver `rellenarBacklog`/`refrescarBacklogPeriodico` en
   motor.js, que filtran por `apuesta(id).etapa === e.etapa`). El `nec` de
   cada una se eligió, siempre que la industria lo permitiera, para caer
   dentro del `prima` de su propia etapa (ETAPAS en sectores.js) — así el
   impacto oculto que calcula nuevoPuesto() ya viene coherente con el momento
   de la empresa, no solo el copy. */
var APUESTAS_SECTOR = [
  /* --- datos y opinión pública (gate: segur/datos/soporte) --- */
  { id:'microseg', dep:'padron',  nec:'core', etapa:'semilla', costo:14, imp:26, n:'Segmentación fina de audiencias', d:'El mensaje correcto al bloque correcto, desde el día uno.',
    d2:'Cortar el electorado o la audiencia en grupos accionables por comportamiento, no solo por edad y zona — sin esto no hay producto, solo una base de datos.',
    impactoSubmetricas: { 'act:task_success':20, 'ret:stickiness':10, 'rev:arpu':8, 'adq:conv_rate':4 } },
  { id:'simulador', dep:'tablero', nec:'datos', etapa:'serieA', costo:18, imp:30, n:'Simulador de escenarios', d:'Qué pasa si los indecisos se parten 60/40.',
    d2:'Corridas de "qué pasaría si" sobre los datos que ya tenés — el motivo por el que un cliente vuelve a pagar cada mes en vez de comprar un informe una sola vez.',
    impactoSubmetricas: { 'ret:dau_mau':14, 'ret:stickiness':16, 'rev:arpu':12, 'ref:viral_k':4, 'adq:conv_rate':3 } },
  { id:'padron',    nec:'integra', etapa:'serieB', costo:22, imp:34, n:'Integración de datos públicos', d:'Padrones, boletines, presupuestos: todo cruzado, en cada ciudad nueva.',
    d2:'Cruzar fuentes oficiales dispersas en un solo modelo de datos — el trabajo sucio que hay que repetir en cada mercado nuevo que abrís.',
    impactoSubmetricas: { 'act:task_success':18, 'ret:stickiness':12, 'rev:arpu':16, 'adq:conv_rate':8, 'ref:viral_k':4, 'deuda:refactor_backlog':5 } },
  { id:'transparencia', dep:'auditoria', nec:'segur', etapa:'serieC', costo:26, imp:38, n:'Tablero público de transparencia', d:'Mostrar qué datos usás antes de que un comité te lo pregunte.',
    d2:'Un panel abierto con qué información se recolecta y cómo se usa — lo que un directorio pre-salida a bolsa exige antes de que exista el escándalo, no después.',
    impactoSubmetricas: { 'gate:gate_fit':20, 'adq:conv_rate':16, 'rev:arpu':14, 'evid:press':12, 'evid:reviews':8, 'rel:error_rate':-15, 'rel:uptime':9 } },

  /* --- biogenética (gate: segur/datos/soporte) --- */
  { id:'plegado',  nec:'core', etapa:'semilla', costo:16, imp:28, n:'Modelo propio de plegado', d:'Tu ventaja o tu ruina. Meses de cómputo, con la caja que tenés hoy.',
    d2:'Un modelo propio de predicción de estructura de proteínas — si funciona, es tu foso; si no, es la ronda semilla entera quemada.',
    impactoSubmetricas: { 'act:task_success':20, 'ret:stickiness':10, 'rev:arpu':8, 'adq:conv_rate':4 } },
  { id:'sintesis', dep:'plegado', nec:'flujo', etapa:'serieA', costo:18, imp:32, n:'Pipeline de síntesis', d:'Del diseño in silico al tubo de ensayo, sin fila y sin frenar.',
    d2:'Automatizar el paso de la simulación al laboratorio real — la diferencia entre un hallazgo cada seis meses y uno cada seis semanas.',
    impactoSubmetricas: { 'ret:dau_mau':14, 'ret:stickiness':16, 'rev:arpu':12, 'ref:viral_k':4, 'act:onboard':22, 'act:time_value':22, 'adq:conv_rate':10, 'adq:visit_signup':6 } },
  { id:'bioseg',   nec:'segur', etapa:'serieB', costo:24, imp:38, n:'Protocolos de bioseguridad', d:'La pregunta uno de todo auditor, multiplicada por cada línea nueva de investigación.',
    d2:'Contención y manejo seguro de material biológico, documentado — con más proyectos corriendo en paralelo, un solo protocolo flojo cierra el laboratorio entero.',
    impactoSubmetricas: { 'act:task_success':18, 'ret:stickiness':12, 'rev:arpu':16, 'gate:gate_fit':8, 'adq:conv_rate':21, 'adq:visit_signup':13, 'rel:error_rate':-15, 'rel:uptime':9 } },
  { id:'patentes', nec:'soporte', etapa:'serieC', costo:28, imp:42, n:'Portafolio de patentes', d:'La única parte de tu ciencia que un comité de inversión puede tasar sin entender la química.',
    d2:'Proteger legalmente cada hallazgo antes de la ronda que valúa la empresa por su propiedad intelectual, no por su promesa.',
    impactoSubmetricas: { 'gate:gate_fit':20, 'adq:conv_rate':16, 'rev:arpu':14, 'evid:press':12, 'ret:churn':-22, 'ret:reactivation':20 } },

  /* --- banco digital (gate: segur/soporte/datos) --- */
  { id:'adelanto', dep:'antifraude',   nec:'core', etapa:'semilla', costo:14, imp:26, n:'Crédito y adelantos', d:'Lo que de verdad los trae, más allá de la tarjeta bonita.',
    d2:'Adelantos de dinero contra ingresos futuros — el producto que la gente realmente busca detrás de la app, desde la primera versión.',
    impactoSubmetricas: { 'act:task_success':20, 'ret:stickiness':10, 'rev:arpu':8, 'adq:conv_rate':4 } },
  { id:'conciliar',  nec:'datos', etapa:'serieA', costo:18, imp:30, n:'Conciliación automática', d:'La tarea que odian todos los meses, ahora sin un humano a mano.',
    d2:'Cruzar movimientos y cuadrar los libros solo — la prueba de que el negocio no depende de que un contador no se equivoque.',
    impactoSubmetricas: { 'ret:dau_mau':14, 'ret:stickiness':16, 'rev:arpu':12, 'act:feature_adopt':4 } },
  { id:'antifraude', nec:'segur', etapa:'serieB', costo:24, imp:36, n:'Motor antifraude', d:'Cada punto de fraude sale de tu margen, y el margen se nota más con volumen.',
    d2:'Detección automática de transacciones sospechosas antes de que se conviertan en pérdida contable — indispensable en cuanto el volumen deja de ser chico.',
    impactoSubmetricas: { 'gate:gate_fit':12, 'rev:arpu':16, 'ret:churn':-4, 'rel:uptime':4, 'adq:conv_rate':20, 'adq:visit_signup':12 } },
  { id:'licencia', dep:'auditoria',   nec:'segur', etapa:'serieC', costo:30, imp:42, n:'Licencia bancaria plena', d:'Sin esto no hay mercado grande, ni salida a bolsa que lo firme.',
    d2:'El permiso regulatorio para operar como entidad financiera completa — lento y carísimo, pero sin él el prospecto de la oferta pública ni se imprime.',
    impactoSubmetricas: { 'gate:gate_fit':24, 'adq:conv_rate':18, 'rev:arpu':16, 'rel:error_rate':-17, 'rel:uptime':10 } },

  /* --- energía renovable (gate: datos/integra/soporte) --- */
  { id:'sensor',       nec:'core', etapa:'semilla', costo:14, imp:26, n:'Medidor de bajo costo', d:'Si el hardware sale caro, no hay negocio que levantar.',
    d2:'Hardware de medición barato de fabricar — el margen de todo lo que sigue depende de bajar este costo unitario desde el primer lote.',
    impactoSubmetricas: { 'act:task_success':18, 'ret:stickiness':12, 'rev:arpu':8, 'adq:conv_rate':6 } },
  { id:'verificacion', dep:'sensor', nec:'datos', etapa:'serieA', costo:18, imp:30, n:'Verificación de ahorro', d:'La prueba que convierte una lectura en factura que alguien paga otra vez.',
    d2:'Confirmar de forma auditable cuánta energía se ahorró de verdad — sin esa prueba, nadie renueva el contrato el segundo año.',
    impactoSubmetricas: { 'ret:dau_mau':12, 'ret:stickiness':14, 'rev:arpu':10, 'adq:conv_rate':4 } },
  { id:'tarifas',      nec:'integra', etapa:'serieB', costo:22, imp:34, n:'Motor de tarifas', d:'Cada distribuidora nueva factura distinto, y ya no entrás a una sola ciudad.',
    d2:'Un motor que traduce las reglas de facturación de cada distribuidora — sin él, cada mercado nuevo es reprogramar todo de cero.',
    impactoSubmetricas: { 'act:task_success':16, 'ret:stickiness':10, 'rev:arpu':14, 'adq:conv_rate':8 } },
  { id:'despacho',     nec:'escala', etapa:'serieC', costo:26, imp:38, n:'Despacho automático de energía', d:'Vender el excedente en la hora cara, en miles de techos a la vez.',
    d2:'Decidir solo, en tiempo real y a escala nacional, cuándo inyectar el excedente a la red — el número que un inversor institucional puede auditar.',
    impactoSubmetricas: { 'gate:gate_fit':18, 'rev:arpu':16, 'rel:uptime':6, 'adq:conv_rate':6 } },

  /* --- devtools (gate: integra/segur/datos) --- */
  { id:'plantillas2', nec:'core', etapa:'semilla', costo:10, imp:22, n:'Recetas listas para usar', d:'Del clone a corriendo en un minuto, antes de tener nada más.',
    d2:'Proyectos de arranque ya armados para los casos de uso más comunes — copiar, pegar y correr, cuando lo único que tenés es la idea.',
    impactoSubmetricas: { 'act:onboard':14, 'act:task_success':10, 'adq:conv_rate':6, 'ret:stickiness':12, 'ret:dau_mau':7 } },
  { id:'cli', dep:'api',         nec:'flujo', etapa:'serieA', costo:14, imp:26, n:'CLI de primera clase', d:'Donde tu usuario ya vive, ahora que hay usuarios de verdad que volver a traer.',
    d2:'Una herramienta de línea de comandos pulida — para el desarrollador que ya probó la v1, vivir fuera de la terminal es la razón por la que no vuelve.',
    impactoSubmetricas: { 'ret:stickiness':12, 'act:feature_adopt':10, 'ref:viral_k':4, 'adq:conv_rate':8, 'adq:visit_signup':5 } },
  { id:'openq', dep:'plantillas2',       nec:'soporte', etapa:'serieB', costo:18, imp:30, n:'Edición abierta de comunidad', d:'Adopción sí, ingresos quizás — y ahora tenés equipo para sostenerlo.', senuelo:true,
    d2:'Dejar que la comunidad edite y aporte libremente suma usuarios rápido a escala. Convertirlos en clientes que pagan sigue siendo otro problema, uno que esto no resuelve solo.',
    impactoSubmetricas: { 'ref:viral_k':12, 'adq:mix_canal':10, 'ret:stickiness':6 } },
  { id:'gobernanza', dep:'sso',  nec:'integra', etapa:'serieC', costo:22, imp:34, n:'Gobierno y permisos a nivel organización', d:'El admin de IT necesita controlar todo, no solo cada desarrollador suelto.',
    d2:'SSO, roles y auditoría a nivel de toda la cuenta — lo que convierte mil desarrolladores usándote gratis en un solo contrato enterprise que alguien firma.',
    impactoSubmetricas: { 'gate:gate_fit':16, 'adq:conv_rate':12, 'rev:arpu':10, 'ret:stickiness':4 } },

  /* --- apuestas y juego online (gate: segur/datos/soporte) --- */
  { id:'cuotas',       nec:'core', etapa:'semilla', costo:16, imp:28, n:'Motor de cuotas en vivo', d:'Cuotas que se mueven con el partido. Sin esto no hay producto, solo una promesa.',
    d2:'Recalcular probabilidades en tiempo real durante el evento — el corazón matemático de todo el negocio, construido antes que cualquier otra cosa.',
    impactoSubmetricas: { 'act:task_success':18, 'ret:stickiness':12, 'rev:arpu':10 } },
  { id:'pagos', dep:'auditoria',        nec:'flujo', etapa:'serieA', costo:18, imp:30, n:'Depósito y retiro instantáneos', d:'El que no puede retirar rápido no vuelve a depositar.',
    d2:'Que el dinero entre y salga sin demoras — cada hora de espera en un retiro es un usuario que no vuelve, justo cuando necesitás que vuelvan.',
    impactoSubmetricas: { 'ret:dau_mau':12, 'ret:churn':-3, 'act:task_success':8, 'adq:conv_rate':4 } },
  { id:'autoexclusion',nec:'segur', etapa:'serieB', costo:22, imp:34, n:'Controles de adicción', d:'Lo primero que revisa el regulador en cuanto el volumen te hace visible.',
    d2:'Límites de gasto y autoexclusión voluntaria — con más usuarios, es también lo primero que un regulador audita antes de dejarte crecer más.',
    impactoSubmetricas: { 'gate:gate_fit':14, 'adq:conv_rate':10, 'evid:press':6, 'rel:error_rate':-14, 'rel:uptime':8 } },
  { id:'vip',          nec:'soporte', etapa:'serieC', costo:26, imp:38, n:'Programa VIP', d:'El 2% de los apostadores deja el 60% del dinero, y ya sabés quiénes son.',
    d2:'Atención dedicada y beneficios a medida para el puñado de cuentas que sostiene el negocio — el tipo de gasto que un negocio chico no puede justificar y uno maduro no puede no hacer.',
    impactoSubmetricas: { 'rev:arpu':24, 'ret:churn':-5, 'ref:nps':10, 'adq:conv_rate':12, 'adq:visit_signup':7 } },

  /* --- salud premium (gate: soporte/segur/datos) --- */
  { id:'longevidad', nec:'core', etapa:'semilla', costo:16, imp:28, n:'Programa de longevidad', d:'El chequeo anual convertido en membresía, desde el primer socio.',
    d2:'Un seguimiento continuo de biomarcadores en vez de una visita puntual — el producto en sí, no un anexo de otra cosa.',
    impactoSubmetricas: { 'act:task_success':16, 'ret:stickiness':14, 'rev:arpu':10 } },
  { id:'vipapp',     nec:'flujo', etapa:'serieA', costo:18, imp:32, n:'App para miembros', d:'Resultados, citas e historial sin llamar a nadie — para que renueven solos.',
    d2:'Autogestión completa desde el teléfono: agendar, ver resultados, historial — la fricción que decide si el socio renueva el segundo año.',
    impactoSubmetricas: { 'ret:dau_mau':14, 'act:onboard':12, 'ret:stickiness':8, 'adq:conv_rate':10, 'adq:visit_signup':6 } },
  { id:'redmedica',  nec:'integra', etapa:'serieB', costo:22, imp:36, n:'Red de especialistas', d:'El mejor cardiólogo de la ciudad, con cita mañana, en cada ciudad nueva.',
    d2:'Acceso curado a especialistas de primer nivel con turnos rápidos — la razón real por la que alguien paga la membresía, ahora hay que sostenerla en cada mercado que abrís.',
    impactoSubmetricas: { 'ret:stickiness':16, 'rev:arpu':14, 'adq:conv_rate':8, 'ref:viral_k':4 } },
  { id:'concierge', dep:'redmedica',  nec:'soporte', etapa:'serieC', costo:26, imp:40, n:'Equipo médico concierge', d:'Una persona que contesta el teléfono a las 3 AM, para cada socio, a esta escala.',
    d2:'Atención humana disponible a cualquier hora — el nivel de servicio que justifica el precio premium, sostenido con la operación de una empresa grande, no de una clínica boutique.',
    impactoSubmetricas: { 'rev:arpu':20, 'ret:churn':-4, 'adq:conv_rate':10, 'gate:gate_fit':6 } },

  /* --- inteligencia artificial aplicada (gate: datos/segur/integra) --- */
  { id:'finetune', dep:'evals',   nec:'core', etapa:'semilla', costo:18, imp:28, n:'Modelo afinado con datos propios', d:'La ventaja que no se copia con una llave de API, desde la primera versión.',
    d2:'Especializar el modelo con datos que solo vos tenés — lo único que un competidor no consigue comprando la misma API que vos.',
    impactoSubmetricas: { 'act:task_success':14, 'ret:stickiness':12, 'rev:arpu':8, 'adq:conv_rate':6 } },
  { id:'evals',      nec:'datos', etapa:'serieA', costo:16, imp:30, n:'Suite de evaluaciones', d:'Saber si el modelo mejoró o solo cambió, versión tras versión.',
    d2:'Un banco de pruebas fijo contra el que medís cada release. Sin esto, "está mejor" es una opinión con dos ejemplos — y ya no alcanza con opiniones.',
    impactoSubmetricas: { 'ret:dau_mau':10, 'act:feature_adopt':8, 'deuda:test_cov':6, 'rev:arpu':14, 'rev:expansion':9 } },
  { id:'guardrails', dep:'evals', nec:'segur', etapa:'serieB', costo:22, imp:36, n:'Barandas y trazabilidad', d:'Para que la respuesta inventada no llegue al cliente, ahora que hay miles por hora.',
    d2:'Filtros de salida, citas verificables y registro de cada respuesta — lo que te permite explicar qué dijo el modelo y por qué, a un volumen que ya no podés revisar a mano.',
    impactoSubmetricas: { 'gate:gate_fit':12, 'rev:arpu':10, 'deuda:security_p1':-4, 'adq:conv_rate':20, 'adq:visit_signup':12, 'rel:error_rate':-14, 'rel:uptime':9 } },
  { id:'inferencia', dep:'observa', nec:'escala', etapa:'serieC', costo:26, imp:40, n:'Inferencia barata', d:'Cada respuesta cuesta plata. A este volumen, ahí vive todo tu margen.',
    d2:'Caché, modelos chicos para lo fácil y lotes para lo pesado — la diferencia entre un negocio que un directorio puede defender y una demo subsidiada que nunca lo fue.',
    impactoSubmetricas: { 'rev:arpu':18, 'gate:gate_fit':10, 'rel:latency_p95':-20 } },

  /* --- silicio y semiconductores (gate: escala/integra/soporte) --- */
  { id:'tapeout',   nec:'core', etapa:'semilla', costo:18, imp:30, n:'Tape-out del primer silicio', d:'Un solo tiro. Si sale mal, seis meses y la ronda semilla entera.',
    d2:'Congelar el diseño y mandarlo a fabricar. A partir de acá no hay parche: hay respin, y el respin se mide en semestres que no tenés.',
    impactoSubmetricas: { 'act:task_success':16, 'ret:stickiness':10, 'rev:arpu':8 } },
  { id:'sdk', dep:'tapeout',       nec:'flujo', etapa:'serieA', costo:22, imp:34, n:'SDK y compilador propios', d:'El chip sin software es un pisapapeles caro que nadie adopta.',
    d2:'Las herramientas con las que el cliente programa tu chip. El hardware gana la evaluación técnica; el software decide si ese diseñador vuelve al segundo proyecto.',
    impactoSubmetricas: { 'act:feature_adopt':12, 'ret:stickiness':14, 'adq:conv_rate':6 } },
  { id:'yield', dep:'tapeout',     nec:'escala', etapa:'serieB', costo:26, imp:38, n:'Rendimiento de obleas', d:'Cada punto de yield es margen puro, multiplicado por cada lote que sale.',
    d2:'Cuántos chips buenos salen de cada oblea. No se ve en ninguna demo y decide si el negocio existe en cuanto empezás a fabricar en volumen.',
    impactoSubmetricas: { 'rev:arpu':16, 'gate:gate_fit':8, 'deuda:refactor_backlog':4, 'rel:uptime':22, 'rel:latency_p95':-22 } },
  { id:'fundicion', dep:'tapeout', nec:'soporte', etapa:'serieC', costo:30, imp:42, n:'Cupo en la fundición', d:'No fabricás: te dan turno, y a esta escala el turno es la mitad del negocio.',
    d2:'Asegurar capacidad de fabricación con años de anticipación y contratos de por medio — sin cupo garantizado, tu mejor diseño espera en la fila de otro que sí lo aseguró.',
    impactoSubmetricas: { 'gate:gate_fit':16, 'rev:arpu':14, 'rel:uptime':4, 'ret:churn':-22, 'ret:reactivation':20, 'adq:conv_rate':13, 'adq:visit_signup':8 } },

  /* --- ciberseguridad empresarial (gate: segur/soporte/integra) --- */
  { id:'edr',       nec:'core', etapa:'semilla', costo:16, imp:30, n:'Agente en el endpoint', d:'Vive dentro de la máquina del cliente desde el primer pilot. Si se cuelga, se cuelga todo.',
    d2:'Detección en el propio equipo, con permisos de núcleo — máxima visibilidad y máximo poder de romperle el lunes a alguien, antes de tener ningún otro producto.',
    impactoSubmetricas: { 'rel:uptime':8, 'gate:gate_fit':10, 'act:task_success':6, 'ret:stickiness':17, 'ret:dau_mau':10 } },
  { id:'cazador', dep:'edr',   nec:'datos', etapa:'serieA', costo:18, imp:30, n:'Caza proactiva de amenazas', d:'Buscar al que ya está adentro, y tener los datos para probarlo.',
    d2:'Salir a buscar señales de intrusión en vez de esperar la alerta — lo que convierte el pilot en la razón por la que el segundo cliente te llama a voz primero.',
    impactoSubmetricas: { 'ret:dau_mau':10, 'rel:mttr':-15, 'gate:gate_fit':8, 'rev:arpu':14, 'rev:expansion':9 } },
  { id:'soc', dep:'edr',       nec:'soporte', etapa:'serieB', costo:22, imp:36, n:'Centro de operaciones 24/7', d:'Alguien mira las alertas a las 4 AM, en cada cuenta nueva que sumás.',
    d2:'Analistas de guardia todo el año. Es el servicio que el cliente cree que compra cuando compra el software, y a esta escala tiene que ser real.',
    impactoSubmetricas: { 'gate:gate_fit':14, 'ret:churn':-4, 'adq:conv_rate':8 } },
  { id:'certifica', dep:'auditoria', nec:'segur', etapa:'serieC', costo:28, imp:42, n:'Certificaciones y cumplimiento', d:'Papel caro que abre las puertas caras, justo antes de la puerta más cara de todas.',
    d2:'SOC 2, ISO, el pliego del sector público. Meses de auditoría que no agregan una función y desbloquean el contrato — y la ronda — que necesitás para llegar a bolsa.',
    impactoSubmetricas: { 'gate:gate_fit':18, 'adq:conv_rate':14, 'rev:arpu':12, 'rel:error_rate':-17, 'rel:uptime':10 } },

  /* --- marketplace y última milla (gate: escala/soporte/datos) --- */
  { id:'vendedores', nec:'core', etapa:'semilla', costo:14, imp:26, n:'Herramientas para vendedores', d:'El otro lado del mercado también es un producto, y hay que construirlo primero.',
    d2:'Inventario, precios y cobros para quien vende. Sin oferta no hay demanda que valga la pena mostrar todavía.',
    impactoSubmetricas: { 'act:task_success':16, 'ret:stickiness':10, 'rev:arpu':8 } },
  { id:'reputacion', nec:'datos', etapa:'serieA', costo:16, imp:28, n:'Reseñas y garantía de compra', d:'La confianza es el inventario del marketplace, y ahora hay historial para medirla.',
    d2:'Calificaciones creíbles y devolución del dinero si algo sale mal — el dato que permite comprarle a un desconocido una segunda vez.',
    impactoSubmetricas: { 'adq:conv_rate':12, 'ret:churn':-3, 'evid:reviews':8, 'rev:arpu':13, 'rev:expansion':8 } },
  { id:'logistica',  nec:'integra', etapa:'serieB', costo:20, imp:34, n:'Logística propia', d:'Dejar de depender del correo, en cada ciudad donde el volumen ya lo justifica.',
    d2:'Depósitos y flota propios: carísimo, lento de montar, y lo único que te deja prometer una fecha y cumplirla mientras escalás a mercados nuevos.',
    impactoSubmetricas: { 'ret:stickiness':12, 'rel:latency_p95':-30, 'rev:arpu':10, 'gate:gate_fit':6, 'adq:mix_canal':22, 'adq:conv_rate':13 } },
  { id:'densidad',   nec:'escala', etapa:'serieC', costo:26, imp:40, n:'Densidad por zona', d:'Un repartidor con tres pedidos gana; con uno, pierde — y ahora hay que probarlo en cada ciudad del mapa.',
    d2:'Concentrar demanda en pocas zonas antes de abrir la siguiente. La unidad económica que un inversor de última ronda va a pedir ver, ciudad por ciudad.',
    impactoSubmetricas: { 'gate:gate_fit':14, 'rev:arpu':12, 'ret:stickiness':8, 'rel:uptime':22, 'rel:latency_p95':-22 } },

  /* --- streaming y creadores (gate: core/datos/escala) --- */
  { id:'creadores',    nec:'flujo', etapa:'semilla', costo:14, imp:26, n:'Programa de creadores', d:'Que el catálogo lo haga otro, antes de tener presupuesto para producir nada.',
    d2:'Herramientas y reparto de ingresos para que la gente produzca lo que vos vendés — el catálogo más barato que existe cuando todavía no tenés caja.',
    impactoSubmetricas: { 'act:feature_adopt':14, 'ret:stickiness':12, 'ref:viral_k':6, 'adq:conv_rate':8, 'adq:visit_signup':5 } },
  { id:'recomendador', dep:'tablero', nec:'datos', etapa:'serieA', costo:18, imp:30, n:'Motor de recomendación', d:'El menú importa más que la comida, en cuanto hay suficiente comida para elegir mal.',
    d2:'Qué se muestra primero decide qué se consume. Con el catálogo creciendo, la portada empieza a valer más que la mitad de lo que hay atrás.',
    impactoSubmetricas: { 'ret:dau_mau':16, 'ret:stickiness':14, 'act:feature_adopt':8, 'rev:arpu':14, 'rev:expansion':9 } },
  { id:'offline', dep:'movil',      nec:'escala', etapa:'serieB', costo:22, imp:34, n:'Descargas y modo sin conexión', d:'Para el subte, el avión y el pueblo sin señal, ahora que ahí también hay mercado.',
    d2:'Reproducir sin red. Invisible en la demo de la oficina, decisivo en la mitad de los mercados nuevos donde estás intentando crecer.',
    impactoSubmetricas: { 'ret:dau_mau':12, 'adq:mix_canal':8, 'ret:stickiness':8, 'rel:uptime':22, 'rel:latency_p95':-22 } },
  { id:'original',     nec:'core', etapa:'serieC', costo:28, imp:40, n:'Producción original', d:'Carísimo, y es lo único que no te pueden quitar cuando vence una licencia.',
    d2:'Contenido propio que no se va cuando termina el acuerdo con otro estudio. Define de qué te acusan en la prensa financiera el día antes de salir a bolsa.',
    impactoSubmetricas: { 'evid:press':12, 'rev:arpu':16, 'adq:conv_rate':8, 'gate:gate_fit':4, 'act:task_success':22, 'act:feature_adopt':19, 'ret:stickiness':22, 'ret:dau_mau':13 } }
];

for (var _i = 0; _i < APUESTAS_SECTOR.length; _i++) APUESTAS.push(APUESTAS_SECTOR[_i]);

/* Segunda vuelta. Un backlog real no se vacía: entregar la v1 no cierra el
   tema, lo abre. Acá vive, para cada apuesta genérica, el trabajo que solo
   existe porque la anterior salió — la versión que el cliente configura solo,
   el modo sin conexión, las evaluaciones del asistente que hasta ayer era una
   demo. El motor la mete en el backlog en el mismo mes en que la madre se
   entrega (ver `derivarSiguiente` en motor.js). Las apuestas de sector y las
   vueltas siguientes se generan como iteración, con el impacto decayendo:
   volver a invertir en lo mismo rinde cada vez menos, pero rinde. */
var APUESTAS_SIGUE = {
  motor: { id:'motor_v2', nec:'core', costo:16, imp:26, n:'Reglas que el cliente edita',
    d:'Que cambien la lógica sin abrirte un ticket.',
    d2:'Un editor donde el propio cliente ajusta la regla que le sirve: deja de pedirte cada cambio, y deja de irse cuando no llegás a tiempo.',
    impactoSubmetricas: { 'act:task_success':14, 'ret:stickiness':16, 'rev:arpu':8, 'deuda:refactor_backlog':4 } },
  plantillas: { id:'plantillas_v2', nec:'core', costo:9, imp:16, n:'Plantillas que se comparten',
    d:'Lo que armó un cliente le sirve al siguiente.',
    d2:'Publicar la configuración propia para que otro la use tal cual: la biblioteca crece sin que ustedes escriban una línea más.',
    impactoSubmetricas: { 'ref:viral_k':10, 'act:onboard':12, 'ret:stickiness':8, 'adq:conv_rate':5 } },
  batch: { id:'batch_v2', nec:'core', costo:11, imp:18, n:'Deshacer y programar en lote',
    d:'La red de seguridad de las operaciones masivas.',
    d2:'Revertir un lote entero y dejar el próximo agendado. Sin esto, nadie con datos que importan se anima a apretar el botón.',
    impactoSubmetricas: { 'ret:stickiness':12, 'act:task_success':10, 'rel:error_rate':-8, 'deuda:test_cov':4 } },
  movil: { id:'movil_v2', nec:'core', costo:12, imp:14, n:'Descargas y modo sin conexión',
    d:'Que sirva en el ascensor y en el campo.',
    d2:'Trabajo local que se sincroniza cuando vuelve la señal: la única razón real por la que alguien quería la app.',
    impactoSubmetricas: { 'ret:dau_mau':10, 'ret:stickiness':8, 'act:task_success':6, 'deuda:test_cov':-4 } },
  ia: { id:'ia_v2', nec:'core', costo:12, imp:20, n:'Evaluaciones del asistente',
    d:'Medir cuándo se equivoca, antes que el cliente.',
    d2:'Un set de casos con respuesta correcta que corre en cada cambio: la diferencia entre una demo de directorio y algo que puede tocar datos de un cliente.',
    impactoSubmetricas: { 'rel:error_rate':-14, 'act:feature_adopt':10, 'ret:stickiness':6, 'deuda:test_cov':10 } },

  onboard: { id:'onboard_v2', nec:'flujo', costo:10, imp:20, n:'Onboarding por segmento',
    d:'Cada tipo de usuario llega por su propio camino.',
    d2:'El camino guiado, pero distinto según para qué vino: el que evalúa, el que va a usarlo todos los días y el que solo firma no necesitan lo mismo.',
    impactoSubmetricas: { 'act:onboard':16, 'act:time_value':12, 'adq:conv_rate':8, 'ret:churn':-4 } },
  importar: { id:'importar_v2', nec:'flujo', costo:10, imp:18, n:'Sincronización continua',
    d:'Traerlo una vez no alcanza: cambia todos los días.',
    d2:'La fuente original sigue viva del otro lado. O se sincroniza sola, o en tres semanas tu producto muestra números viejos y pierde la discusión.',
    impactoSubmetricas: { 'ret:churn':-6, 'ret:stickiness':14, 'act:task_success':8, 'deuda:refactor_backlog':5 } },
  rediseno: { id:'rediseno_v2', nec:'flujo', costo:9, imp:16, n:'Sistema de diseño y componentes',
    d:'Que el próximo cambio no sea otro rediseño.',
    d2:'Convertir el rediseño en piezas reutilizables. Es lo que hace que la pantalla número cuarenta salga en un día y no en un trimestre.',
    impactoSubmetricas: { 'act:feature_adopt':8, 'deuda:refactor_backlog':-12, 'deuda:test_cov':6, 'adq:conv_rate':4 } },
  atajos: { id:'atajos_v2', nec:'flujo', costo:7, imp:14, n:'Paleta de comandos y búsqueda global',
    d:'Una sola tecla para llegar a cualquier lado.',
    d2:'Buscar y ejecutar desde el teclado, sin recorrer menús. El usuario que vive adentro deja de pensar dónde estaba cada cosa.',
    impactoSubmetricas: { 'ret:stickiness':14, 'ret:dau_mau':8, 'act:task_success':8, 'adq:visit_signup':2 } },

  tablero: { id:'tablero_v2', nec:'datos', costo:11, imp:20, n:'Tableros que el usuario arma',
    d:'El número que pide el jefe cambia cada trimestre.',
    d2:'Que elija sus propias métricas y las guarde. Si cada corte nuevo pasa por tu equipo, el tablero envejece más rápido de lo que lo actualizás.',
    impactoSubmetricas: { 'act:feature_adopt':14, 'ret:stickiness':12, 'rev:arpu':8, 'rev:expansion':6 } },
  alertas: { id:'alertas_v2', nec:'datos', costo:9, imp:18, n:'Detección de anomalías',
    d:'El umbral que nadie sabía que había que poner.',
    d2:'El producto aprende qué es normal y avisa cuando algo se sale, sin que el usuario tenga que adivinar el número de corte.',
    impactoSubmetricas: { 'ret:dau_mau':12, 'act:feature_adopt':10, 'rev:arpu':8, 'ret:stickiness':6 } },
  export: { id:'export_v2', nec:'datos', costo:7, imp:14, n:'Reportes programados',
    d:'Que la planilla llegue sola el lunes a las 8.',
    d2:'El mismo export, pero automático y por correo. Deja de ser una tarea del usuario y pasa a ser un hábito de su equipo entero.',
    impactoSubmetricas: { 'ret:dau_mau':10, 'ret:stickiness':8, 'rev:arpu':6, 'ref:referral_rate':4 } },

  api: { id:'api_v2', nec:'integra', costo:10, imp:20, n:'SDKs y entorno de pruebas',
    d:'Una API sin SDK solo la integra el que ya te quería.',
    d2:'Librerías en los lenguajes que usan tus clientes y datos falsos para probar: el tiempo hasta la primera llamada baja de una semana a una tarde.',
    impactoSubmetricas: { 'ref:viral_k':12, 'adq:mix_canal':10, 'act:time_value':10, 'evid:community':6 } },
  conectores: { id:'conectores_v2', nec:'integra', costo:14, imp:24, n:'Marketplace de integraciones',
    d:'Que las siguientes cincuenta las construya otro.',
    d2:'Un lugar donde terceros publican su propia integración y la mantienen ellos. Dejás de ser el cuello de botella de tu propia lista de conectores.',
    impactoSubmetricas: { 'ref:viral_k':14, 'adq:mix_canal':12, 'adq:conv_rate':8, 'ret:stickiness':6, 'deuda:security_p1':3 } },
  webhooks: { id:'webhooks_v2', nec:'integra', costo:8, imp:14, n:'Reintentos y cola de eventos',
    d:'El webhook que se pierde no lo nota nadie hasta que es tarde.',
    d2:'Reintentos con espera creciente, historial de entregas y reenvío manual: lo que convierte el pegamento barato en algo sobre lo que un cliente monta su operación.',
    impactoSubmetricas: { 'rel:error_rate':-12, 'rel:uptime':5, 'ret:stickiness':10, 'ref:viral_k':4 } },

  sla: { id:'sla_v2', nec:'soporte', costo:10, imp:22, n:'Soporte dentro del producto',
    d:'Contestar donde está el problema, no en otra pestaña.',
    d2:'Chat y contexto técnico en la misma pantalla donde se trabó. El ticket llega con lo que hacía falta para resolverlo, y el SLA deja de ser una promesa cara.',
    impactoSubmetricas: { 'ret:churn':-5, 'act:task_success':10, 'adq:conv_rate':8, 'rev:arpu':6 } },
  docs: { id:'docs_v2', nec:'soporte', costo:8, imp:16, n:'Ayuda en contexto',
    d:'La respuesta antes de que sepan que tienen la pregunta.',
    d2:'La documentación deja de ser un sitio aparte y aparece en la pantalla donde hace falta. Nadie busca lo que no sabe que existe.',
    impactoSubmetricas: { 'act:onboard':14, 'act:feature_adopt':12, 'ret:churn':-3, 'act:task_success':8 } },
  casos: { id:'casos_v2', nec:'soporte', costo:10, imp:20, n:'Programa de referencias de clientes',
    d:'Que tu cliente atienda la llamada del próximo cliente.',
    d2:'Un caso publicado se lee; un cliente que da la cara en una llamada de treinta minutos cierra. Hay que armarlo, y hay que compensarlo.',
    impactoSubmetricas: { 'evid:cases':12, 'ref:referral_rate':12, 'adq:conv_rate':10, 'evid:community':6 } },

  sso: { id:'sso_v2', nec:'segur', costo:12, imp:22, n:'Alta y baja automática de usuarios',
    d:'Que las cuentas las maneje el directorio de ellos.',
    d2:'Cuando alguien entra o sale de la empresa del cliente, su cuenta acá se crea o se apaga sola. Sin esto, TI te vuelve a frenar en la renovación.',
    impactoSubmetricas: { 'adq:conv_rate':12, 'rev:arpu':10, 'gate:gate_fit':8, 'deuda:security_p1':-3, 'ret:churn':-3 } },
  auditoria: { id:'auditoria_v2', nec:'segur', costo:14, imp:24, n:'Certificación externa',
    d:'Que lo diga un auditor, no tu equipo.',
    d2:'La trazabilidad ya existe; ahora hay que pagar para que alguien de afuera la revise y firme. Meses de trabajo aburrido que abren una lista de clientes que hoy no te pueden comprar.',
    impactoSubmetricas: { 'gate:gate_fit':14, 'adq:conv_rate':14, 'rev:arpu':10, 'evid:press':4, 'deuda:security_p1':-4 } },
  cifrado: { id:'cifrado_v2', nec:'segur', costo:13, imp:22, n:'Residencia de datos por región',
    d:'Dónde vive el dato importa tanto como quién lo ve.',
    d2:'Guardar y procesar a cada cliente en su propia jurisdicción. Es la pregunta que aparece justo cuando el contrato ya parecía cerrado.',
    impactoSubmetricas: { 'gate:gate_fit':14, 'adq:conv_rate':10, 'rev:arpu':10, 'deuda:refactor_backlog':6 } },

  cache: { id:'cache_v2', nec:'escala', costo:11, imp:22, n:'Cuotas y aislamiento por cliente',
    d:'Que el pico de uno no sea la caída de todos.',
    d2:'Límites de uso por cliente y recursos separados: el que abusa se frena solo, en vez de tirar abajo la plataforma para los demás.',
    impactoSubmetricas: { 'rel:uptime':8, 'rel:error_rate':-12, 'rel:latency_p95':-20, 'ret:churn':-3 } },
  multi: { id:'multi_v2', nec:'escala', costo:15, imp:26, n:'Simulacros de caída',
    d:'La redundancia que nunca se probó no es redundancia.',
    d2:'Apagar una región a propósito, en horario laboral, para descubrir hoy lo que ibas a descubrir de madrugada un domingo.',
    impactoSubmetricas: { 'rel:uptime':10, 'rel:mttr':-25, 'deuda:test_cov':8, 'ret:churn':-2 } },
  observa: { id:'observa_v2', nec:'escala', costo:10, imp:20, n:'Guardias y post-mortems',
    d:'Ver el problema no alcanza si nadie tiene el turno.',
    d2:'Rotación de guardia, escalamiento definido y una revisión escrita después de cada incidente: lo que hace que el mismo error no vuelva tres veces.',
    impactoSubmetricas: { 'rel:mttr':-25, 'rel:uptime':6, 'rel:error_rate':-8, 'deuda:refactor_backlog':-6 } }
};

/* ---------------------------------------------------------------
   Dilemas. Cada uno enseña algo y está atado a un libro.
   quien: quién del elenco te lo trae (la UI agrega nombre y cargo).
   cuando(e) decide si puede dispararse este mes.
   --------------------------------------------------------------- */
function nota(log, tipo, texto, libro) {
  log.push({ tipo:tipo, texto:texto, libro:libro || null });
}

var EVENTOS = [

{ id:'momtest', libro:'momtest', prio:100, quien:'cto',
  cuando:function(e){ return e.mesPuesto === 1 && e.evidencia < 55; },
  titulo:'Cómo vamos a hablar con los usuarios',
  texto:'"Agendé diez reuniones con clientes para esta semana. ¿Qué les preguntamos?"',
  variantes:[
    { titulo:'El consejo de usuarios', texto:'"Doce de nuestras cuentas más grandes aceptaron un consejo trimestral. La primera sesión es el viernes. ¿Qué va en la agenda?"' },
    { titulo:'La gira', texto:'"La próxima semana visito a ocho clientes en sus oficinas. Una pregunta decide lo que traigo de vuelta: ¿qué pregunto?"' }
  ],
  opciones:[
    { txt:'Mostrarles la demo y preguntar si la comprarían',
      nota:'Nadie te dice que no a la cara. Vas a salir con diez "me encanta" y cero información.',
      libro:'momtest',
      ef:function(e,log){ e.calidadDesc = 0.35; e.sesgo = 1;
        nota(log,'malo','Elegiste preguntar por el futuro. Tus estimaciones de impacto ahora vienen infladas.','momtest'); } },
    { txt:'Preguntar qué hicieron la última vez que tuvieron el problema',
      nota:'Los hechos del pasado no mienten. Cuesta más y aburre más, pero es lo único usable.',
      libro:'momtest',
      ef:function(e,log){ e.calidadDesc = 1.0; e.sesgo = 0;
        nota(log,'bueno','Vas a aprender más lento y más cierto. Tus estimaciones serán confiables.','momtest'); } },
    { txt:'Pedir compromiso: un adelanto o un piloto pagado',
      nota:'El compromiso es la señal más cara de fingir. También espanta a los que solo estaban siendo amables.',
      libro:'momtest',
      ef:function(e,log){ e.calidadDesc = 1.15; e.sesgo = 0; e.caja += 12000;
        nota(log,'bueno','Dos firmaron un piloto pagado. Entró dinero y, mejor, entró certeza.','momtest'); } }
  ]},

{ id:'contratar', libro:'brooks', prio:80, quien:'ceo',
  cuando:function(e){ return Motor.runwayMeses(e) > 9 && e.mesPuesto > 2 && e.rampa.length === 0; },
  titulo:'Hay presupuesto y vas atrasado',
  texto:'"El roadmap está atrasado y el directorio aprobó plata para contratar. ¿A cuántos traemos?"',
  variantes:[
    { titulo:'El directorio quiere gente', texto:'"Acabamos de levantar. El directorio no deja de preguntar por qué el equipo sigue tan chico. Hay presupuesto para cuatro ingenieros, desde el lunes."' },
    { titulo:'La oferta de acqui-hire', texto:'"Una startup moribunda de la zona está ofreciendo su equipo de ingeniería completo. Cuatro personas, una entrevista, empiezan la próxima semana."' }
  ],
  opciones:[
    { txt:'Cuatro ingenieros, ya',
      nota:'Los recién llegados no producen nada por dos meses y consumen a los que sí producían. Cuatro de golpe es un trimestre perdido.',
      libro:'brooks',
      ef:function(e,log){ var i; for(i=0;i<4;i++) Motor.contratar(e,'ing');
        nota(log,'malo','Cuatro contrataciones simultáneas. La mentoría se come los próximos meses.','brooks'); } },
    { txt:'Uno ahora, reevaluamos en dos meses',
      nota:'De a uno, la comunicación sigue manejable y cada persona se vuelve productiva antes de que aterrice la siguiente.',
      libro:'brooks',
      ef:function(e,log){ Motor.contratar(e,'ing');
        nota(log,'bueno','Una contratación. Costo de mentoría contenido.','brooks'); } },
    { txt:'Nadie: primero pagamos deuda',
      nota:'Con deuda alta, cada persona nueva rinde menos. A veces el equipo más rápido es el mismo con menos lastre.',
      libro:'fowler',
      ef:function(e,log){ e.deuda = Math.max(0, e.deuda - 8);
        nota(log,'bueno','Sin contrataciones. El equipo respira y la deuda baja 8 puntos.','fowler'); } }
  ]},

{ id:'clientegrande', libro:'trap', prio:85, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 3 && e.mrr > Motor.burnMensual(e) * 0.2; },
  titulo:'El cliente que salva el trimestre',
  texto:'"Firman por 18 meses. Solo piden un módulo a medida que no le sirve a nadie más. ¿Cerramos?"',
  variantes:[
    { titulo:'La RFP de la ballena', texto:'"Una multinacional nos tiró una RFP. Dieciocho meses garantizados — si construimos su módulo a medida de flujos de aprobación. Nadie más lo va a usar jamás."' },
    { titulo:'El logo que siempre quisimos', texto:'"Acaba de llamar LA marca. Firman hoy si nos comprometemos a una integración a medida que diseñó su equipo. Son ellos, así que aquí todos quieren decir que sí."' }
  ],
  opciones:[
    { txt:'Tómalo. Es dinero hoy',
      nota:'Es ingreso real y también una hipoteca: ese módulo se mantiene para siempre y no mueve tu producto a ninguna parte.',
      libro:'trap',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 2.5; e.deuda += 12; e.capacidadReservada = 3;
        nota(log,'neutro','Entró el dinero, junto con una obligación a medida: +12 de deuda y tres meses de capacidad comprometida.','trap'); } },
    { txt:'Solo si sale como versión general del pedido',
      nota:'Convertir un pedido puntual en capacidad para todos es la salida elegante. Cobras menos y aprendes más.',
      libro:'inspired',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 1.2; e.cobertura.integra += 10;
        nota(log,'bueno','Menos dinero, y el pedido salió como integración genérica: +10 a Integraciones.','inspired'); } },
    { txt:'Rechazarlo',
      nota:'Decirle que no a un cheque es la decisión más difícil que existe. También la que protege tu foco.',
      libro:'hard',
      ef:function(e,log){ e.foco += 6; e.moral -= 3; e.politico -= 4;
        nota(log,'neutro','Dijiste que no. Ventas no lo entendió; el roadmap sigue siendo tuyo.','hard'); } }
  ]},

{ id:'reescritura', libro:'fowler', prio:90, quien:'estrella',
  cuando:function(e){ return e.deuda > 55; },
  titulo:'"Hay que reescribir todo"',
  texto:'"Ya no se puede sostener. Dame tres meses sin features y te lo dejo impecable."',
  variantes:[
    { titulo:'"Es espagueti hasta el fondo"', texto:'Tu mejor ingeniera desliza un documento de 12 páginas sobre la mesa: plan de reescritura completa, stack nuevo, tres meses. "Seguimos parchando un cadáver."' },
    { titulo:'La primera jugada del nuevo CTO', texto:'El staff engineer recién contratado dice que la base de código no tiene salvación y quiere rehacer el núcleo desde cero. Medio equipo asiente en silencio.' }
  ],
  opciones:[
    { txt:'Reescritura completa (3 meses, sin features)',
      nota:'La reescritura casi siempre cuesta el doble de lo estimado y llega con los mismos problemas más algunos nuevos.',
      libro:'fowler',
      ef:function(e,log){ e.reescritura = 3; e.deuda = 18;
        nota(log,'malo','Tres meses congelados para features. Ojalá el mercado espere.','fowler'); } },
    { txt:'Refactor continuo: 20% de cada mes',
      nota:'Pagar la deuda en cuotas mientras sigues entregando se siente más lento y sale más barato.',
      libro:'fowler',
      ef:function(e,log){ e.refactorFijo = true;
        nota(log,'bueno','Refactor permanente: cada mes reserva capacidad para pagar deuda.','fowler'); } },
    { txt:'Ahora no. Estamos por lanzar',
      nota:'Legítimo una vez. Repetido, es la definición del interés compuesto trabajando en tu contra.',
      libro:'fowler',
      ef:function(e,log){ e.deuda += 10; e.moral -= 4;
        nota(log,'malo','La deuda sube 10 más y tu mejor ingeniera empieza a mirar LinkedIn.','fowler'); } }
  ]},

{ id:'vanidad', libro:'analytics', prio:75, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 4 && Motor.retencionMedia(e) < 0.88; },
  titulo:'La diapositiva del directorio',
  texto:'"Presento mañana. Los registros acumulados suben lindo. La retención del mes pasado... mejor no mostrarla, ¿no?"',
  variantes:[
    { titulo:'El update a inversionistas', texto:'Toca el correo mensual a inversionistas. Los registros acumulados se ven espectaculares. La retención por cohortes del mes pasado... no.' },
    { titulo:'La diapositiva del all-hands', texto:'Mañana es el all-hands. El equipo está cansado y necesita una victoria. El total de usuarios hace una curva hermosa, arriba y a la derecha. Las cohortes cuentan otra historia.' }
  ],
  opciones:[
    { txt:'Mostrar los acumulados. El directorio quiere buenas noticias',
      nota:'Un total acumulado nunca baja: por eso calma y por eso no dice nada. Compras paz y pierdes seis semanas.',
      libro:'analytics',
      ef:function(e,log){ e.moral += 4; e.politico += 6; e.evidencia = Math.max(0, e.evidencia - 12);
        nota(log,'malo','Todos contentos. Ahora sabes menos de tu propio negocio.','analytics'); } },
    { txt:'Cohortes y retención, aunque duela',
      nota:'Una métrica que importa, por cohorte, contra una línea base. Lo único que orienta decisiones.',
      libro:'analytics',
      ef:function(e,log){ e.evidencia = Math.min(100, e.evidencia + 10); e.politico -= 5; e.foco += 5;
        nota(log,'bueno','Reunión incómoda, foco recuperado: +10 de evidencia.','analytics'); } }
  ]},

{ id:'errorbudget', libro:'sre', prio:110, quien:'cto',
  cuando:function(e){ return e.presupuestoError <= 0 && !e.congelado; },
  titulo:'El presupuesto de error se agotó',
  texto:'"Los incidentes del trimestre se comieron todo el margen que acordamos. Según lo que firmamos, congelamos ya."',
  opciones:[
    { txt:'Congelar features y estabilizar',
      nota:'Cuando el presupuesto se acaba, la prioridad cambia sola. Para eso existe: para no discutirlo cada vez.',
      libro:'sre',
      ef:function(e,log){ e.congelado = true;
        nota(log,'neutro','Mes de estabilización. No se construye nada; se arreglan cosas.','sre'); } },
    { txt:'Seguir entregando: el mercado no espera',
      nota:'Puedes. También es como se pierde en un trimestre la confianza que tomó dos años ganar.',
      libro:'sre',
      ef:function(e,log){ e.deuda += 14; e.riesgoExtra = 0.25; e.politico -= 6;
        nota(log,'malo','Ignoraste el acuerdo: +14 de deuda, riesgo por las nubes y el CTO tomando nota.','sre'); } }
  ]},

{ id:'chasm', libro:'chasm', prio:95, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 5 && Motor.fit(e,'visio') > 0.55 && !e.gateRevelado && Motor.compuerta(e,'pragm') < 0.6; },
  titulo:'El crecimiento se planchó',
  texto:'"Los early adopters nos aman. El mercado grande no contesta nuestros correos, y te juro que no es el precio."',
  opciones:[
    { txt:'Duplicar el gasto en marketing',
      nota:'Empujar más fuerte contra el abismo es la forma más cara de aprender que el problema no era el alcance.',
      libro:'chasm',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e); e.gateRevelado = true;
        nota(log,'malo','Un mes de burn tirado al viento. Al menos ya sabes dónde está el muro: mira el panel de la compuerta.','chasm'); } },
    { txt:'Elegir un nicho y darle el producto completo',
      nota:'El pragmático no compra producto: compra riesgo cero. Lo que le falta al producto ES el producto.',
      libro:'chasm',
      ef:function(e,log){ e.gateRevelado = true; e.foco += 8;
        nota(log,'bueno','Cabeza de playa elegida. El panel de la compuerta te muestra exactamente qué falta.','chasm'); } }
  ]},

{ id:'termsheet', libro:'deals', prio:120, quien:'board',
  cuando:function(e){ return e.levantando && e.esFundador; },
  titulo:'Dos term sheets',
  texto:'"Los dos ofrecen la misma plata. Solo uno te deja quedártela."',
  opciones:[
    { txt:'Valuación alta — preferencia participante 2x, pool del 15% pre',
      nota:'La valuación es el titular. La preferencia participante cobra primero Y se lleva parte del resto; el pool pre-money sale de ti.',
      libro:'deals',
      ef:function(e,log){ var monto = Math.max(2500000, e.mrr * 14); Motor.ronda(e, monto, monto*6, 2, true, 0.15, true);
        nota(log,'malo','Firmaste el titular bonito. La cascada del exit te lo va a explicar.','deals'); } },
    { txt:'Valuación menor — preferencia no participante 1x, pool del 10% post',
      nota:'Términos limpios. En casi cualquier exit realista, te queda más a ti.',
      libro:'deals',
      ef:function(e,log){ var monto = Math.max(2500000, e.mrr * 14); Motor.ronda(e, monto, monto*4.2, 1, false, 0.10, false);
        nota(log,'bueno','Menos titular, más dinero que es tuyo.','deals'); } },
    { txt:'No levantar todavía',
      nota:'No levantar es una opción real si el negocio lo aguanta.',
      libro:'hard',
      ef:function(e,log){ e.levantando = false;
        nota(log,'neutro','Sigues corriendo con tu propia plata. Y tu propia empresa.','hard'); } }
  ]},

{ id:'upmarket', libro:'innov', prio:70, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 6 && (e.usuarios.pragm||0) > e.tam.pragm * 0.03; },
  titulo:'Las cuentas grandes quieren más',
  texto:'"Nuestras mejores cuentas quieren features enterprise. Pagan el triple. Es plata fácil."',
  opciones:[
    { txt:'Subir de mercado: son los que más pagan',
      nota:'Exactamente lo que hace el incumbente justo antes de perder. Subir de mercado abandona el terreno desde el que te van a atacar A TI.',
      libro:'innov',
      ef:function(e,log){ e.precio = Math.round(e.precio*1.6); e.competidor.atencion += 0.3;
        nota(log,'neutro','Precio +60% y el líder ahora te está mirando. Más margen, menos aire.','innov'); } },
    { txt:'Quedarse abajo y automatizar el volumen',
      nota:'La gama baja es aburrida hasta que es todo el mercado. Que te ignoren es una ventaja temporal.',
      libro:'innov',
      ef:function(e,log){ e.competidor.atencion = Math.max(0, e.competidor.atencion - 0.2); e.cobertura.core += 6;
        nota(log,'bueno','Sigues invisible para el líder. Eso es tiempo gratis: úsalo.','innov'); } }
  ]},

{ id:'paridad', libro:'zero', prio:65, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && e.competidor.atencion > 0.3; },
  titulo:'El competidor lanzó algo',
  texto:'"Perdimos tres deals esta semana por una feature que ellos tienen y nosotros no."',
  opciones:[
    { txt:'Copiarla y emparejar',
      nota:'La paridad quita una objeción de la lista y no da ninguna razón para elegirte. El que va adelante gana por defecto.',
      libro:'zero',
      ef:function(e,log){ e.cobertura.core += 4; e.foco -= 6;
        nota(log,'malo','Empataste esa casilla. Perdiste un mes de ser distinto.','zero'); } },
    { txt:'Profundizar en lo que ellos nunca van a hacer',
      nota:'Ser 5% mejor no es defendible. Ser el único que clava una cosa concreta, sí.',
      libro:'zero',
      ef:function(e,log){ e.foco += 8; e.marca += 6;
        nota(log,'bueno','Doblaste la apuesta por tu diferencia. La marca lo nota.','zero'); } }
  ]},

{ id:'topologies', libro:'topologies', prio:88, quien:'cto',
  cuando:function(e){ return (e.ing + e.prod) > 10 && !e.teamTopo && e.mesPuesto > 2; },
  titulo:'El equipo ya no cabe en una reunión',
  texto:'"Todos tocan todo, cada cambio pisa el de otro, y las reuniones de coordinación se comieron los miércoles."',
  opciones:[
    { txt:'Partir en equipos, cada uno dueño claro de una parte',
      nota:'Hay un techo a cuánto sistema cabe en una cabeza. Se sube cortando el sistema, no exigiendo esfuerzo.',
      libro:'topologies',
      ef:function(e,log){ e.teamTopo = true; e.arquitectura += 8;
        nota(log,'bueno','Equipos con fronteras. El techo sube, y por Conway la arquitectura sigue al corte.','topologies'); } },
    { txt:'Sumar un project manager que coordine',
      nota:'Más coordinación no baja la carga cognitiva: agrega un canal a un problema de demasiados canales.',
      libro:'brooks',
      ef:function(e,log){ e.caja -= 60000;
        nota(log,'malo','Más coordinación sobre el mismo enredo. El techo sigue donde estaba.','brooks'); } }
  ]},

{ id:'deploys', libro:'accelerate', prio:78, quien:'estrella',
  cuando:function(e){ return e.mesPuesto > 2 && !e.cd; },
  titulo:'Los deploys son un evento',
  texto:'"Subimos a producción cada tres semanas, un jueves de noche, con dos personas rezando."',
  variantes:[
    { titulo:'El tren de release', texto:'"Lanzamos cada tercer jueves, 9 PM, sala de guerra, pizza. Es tradición. El último tomó seis horas y dos rollbacks."' },
    { titulo:'El pedido de freeze', texto:'"Ops quiere dos semanas de congelamiento de código antes de la demo para el cliente grande. Los freezes agrandan los releases, y los releases grandes son la razón del freeze."' }
  ],
  opciones:[
    { txt:'Invertir en despliegue continuo',
      nota:'Los lotes chicos y frecuentes fallan menos y se recuperan más rápido. Velocidad y estabilidad suben juntas.',
      libro:'accelerate',
      ef:function(e,log){ e.cd = true; e.deudaPendiente = 8;
        nota(log,'bueno','Despliegue continuo: menos riesgo de incidentes y más capacidad, para siempre.','accelerate'); } },
    { txt:'Dejarlo así: funciona',
      nota:'Funciona hasta el día que no. Y ese día el problema no va a ser el cambio: va a ser el tamaño del lote.',
      libro:'accelerate',
      ef:function(e,log){ e.riesgoExtra = (e.riesgoExtra||0) + 0.06;
        nota(log,'neutro','Se sigue desplegando por evento. El riesgo se acumula en silencio.','accelerate'); } }
  ]},

{ id:'escala', libro:'ddia', prio:105, quien:'cto',
  cuando:function(e){ return Motor.carga(e) > 0.85 && e.mesPuesto > 2; },
  titulo:'La base de datos empezó a sudar',
  texto:'"Consultas que tomaban 80 ms ahora toman 2 segundos. Nadie se ha quejado fuerte todavía. Todavía."',
  variantes:[
    { titulo:'El gráfico del lunes', texto:'"Mira esta curva de latencia. Cada lunes a las 9 AM coqueteamos con un timeout. Estamos a una buena mención de prensa de caernos."' },
    { titulo:'El problema del éxito', texto:'"Ese post viral triplicó el tráfico. No murió nada — todavía. La base de datos corre a una temperatura que no me gusta."' }
  ],
  opciones:[
    { txt:'Arreglarlo ya, aunque frene el roadmap',
      nota:'La arquitectura no se degrada con gracia: aguanta, y después colapsa toda junta. Este es el aviso barato; el próximo es caro.',
      libro:'ddia',
      ef:function(e,log){ e.arquitectura += 18; e.capacidadReservada = 1;
        nota(log,'bueno','+18 de arquitectura al costo de un mes. Compraste el aviso barato.','ddia'); } },
    { txt:'Comprar un servidor más grande y seguir',
      nota:'Comprar hardware corre el límite un poco y no toca el supuesto que está por romperse. Aspirina, no diagnóstico.',
      libro:'ddia',
      ef:function(e,log){ e.arquitectura += 4; e.infraExtra = (e.infraExtra||0) + 6000;
        nota(log,'neutro','Algo de aire y una cuenta de infraestructura más grande. El problema sigue ahí.','ddia'); } }
  ]},

{ id:'hooked', libro:'hooked', prio:72, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 3 && Motor.retencionMedia(e) < 0.85; },
  titulo:'Vienen una vez y no vuelven',
  texto:'"La activación está bien, lo usan dos días y desaparecen. Marketing quiere notificaciones agresivas. ¿Las lanzamos?"',
  opciones:[
    { txt:'Notificaciones agresivas y rachas',
      nota:'Los disparadores externos suben el número esta semana. Sin valor real detrás, los usuarios aprenden a ignorarte y a odiarte por ello.',
      libro:'hooked',
      ef:function(e,log){ e.retBonus = (e.retBonus||0)+0.05; e.marca -= 14;
        nota(log,'malo','Retención +5% y marca por el piso. Estás pidiendo prestado contra tu reputación.','hooked'); } },
    { txt:'Construir el ciclo completo, con algo que dejen adentro',
      nota:'Un hábito se sostiene cuando los usuarios depositan algo propio y cada regreso vale más que el anterior.',
      libro:'hooked',
      ef:function(e,log){ e.retBonus = (e.retBonus||0)+0.08; e.cobertura.flujo += 8;
        nota(log,'bueno','Un ciclo real: +8% de retención y más Flujo. El boca a boca se enciende.','hooked'); } }
  ]},

{ id:'friccion', libro:'krug', prio:68, quien:'estrella',
  cuando:function(e){ return e.usabilidad < 45 && e.mesPuesto > 2; },
  titulo:'Miran el registro y se van',
  texto:'"De cada diez que llegan, uno termina el registro. Ventas jura que el producto es buenísimo."',
  variantes:[
    { titulo:'La demo que necesitó piloto', texto:'Ventas cerró tres deals este mes — todos requirieron un recorrido en vivo. Nadie atraviesa el onboarding solo.' },
    { titulo:'El patrón de los tickets', texto:'Un tercio de los tickets de soporte es la misma pregunta: "¿por dónde empiezo?" El producto la responde en pantalla. Aparentemente no.' }
  ],
  opciones:[
    { txt:'Mirar a cinco personas usarlo, en silencio',
      nota:'Nadie lee una interfaz: la escanean y adivinan. Cinco personas trabadas encuentran más que seis reuniones de opiniones.',
      libro:'krug',
      ef:function(e,log){ e.usabilidad += 12; e.evidencia = Math.min(100, e.evidencia+6);
        nota(log,'bueno','+12 de usabilidad. Todo el tráfico que traes ahora convierte mejor.','krug'); } },
    { txt:'Traer más tráfico para compensar',
      nota:'Llenar un balde con fugas es la forma más cara de operar. La conversión multiplica todo lo que gastas río arriba.',
      libro:'krug',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e)*0.5; e.gtmBonus = 0.3;
        nota(log,'malo','Medio mes de burn en tráfico sobre un embudo roto. Adivina adónde fue.','krug'); } }
  ]},

{ id:'okr', libro:'grove', prio:60, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 0 && e.mesPuesto % 6 === 0; },
  titulo:'Empieza el semestre',
  texto:'"Hay que decidir qué persigue la organización estos seis meses. Cada equipo mandó su lista de deseos."',
  variantes:[
    { titulo:'Temporada de planificación', texto:'El trimestre arranca el lunes. Cada líder de equipo mandó su propia lista de prioridades. Juntas suman veintitrés.' },
    { titulo:'La pizarra del offsite', texto:'Dos días de offsite produjeron una pizarra con nueve "pilares estratégicos". Alguien tiene que convertir esto en un trimestre.' }
  ],
  opciones:[
    { txt:'Un objetivo, tres resultados medibles',
      nota:'Menos objetivos, medidos por resultado, no por actividad. La claridad es la palanca más barata que existe.',
      libro:'grove',
      ef:function(e,log){ e.foco += 12; e.moral += 5;
        nota(log,'bueno','Foco +12. El equipo sabe qué NO va a hacer, que es la parte útil.','grove'); } },
    { txt:'Nueve objetivos, uno por área, para que nadie se ofenda',
      nota:'Nueve prioridades son cero prioridades. Cada área optimiza la suya y el total no se mueve.',
      libro:'grove',
      ef:function(e,log){ e.foco -= 10; e.moral += 2; e.politico += 3;
        nota(log,'malo','Todos contentos, nadie enfocado. Foco -10.','grove'); } }
  ]},

{ id:'discovery', libro:'torres', prio:62, quien:'cto',
  cuando:function(e){ return e.mesPuesto > 2 && e.evidencia < 35; },
  titulo:'¿Cuándo fue la última entrevista?',
  texto:'"El equipo entrega bien. Pero nadie recuerda la última vez que habló con un usuario."',
  variantes:[
    { titulo:'¿Cuándo hablamos con un usuario por última vez?', texto:'Alguien lo pregunta en el standup. Silencio. La última entrevista registrada es de hace dos trimestres; desde entonces el roadmap corre a pura opinión.' },
    { titulo:'El problema del intermediario', texto:'Todo el conocimiento del usuario llega ahora vía anécdotas de ventas y escalamientos de soporte — filtrado, enojado y de tercera mano.' }
  ],
  opciones:[
    { txt:'Una entrevista semanal, sagrada, hecha por el equipo que construye',
      nota:'El discovery no es una fase: es un hábito. Y funciona cuando los que construyen lo hacen ellos mismos.',
      libro:'torres',
      ef:function(e,log){ e.cadenciaDesc = true;
        nota(log,'bueno','Cadencia semanal: la evidencia deja de evaporarse tan rápido.','torres'); } },
    { txt:'Contratar una consultora para un gran estudio',
      nota:'Un informe de 80 páginas llega tarde, se lee una vez y no cambia ninguna decisión de la semana siguiente.',
      libro:'torres',
      ef:function(e,log){ e.caja -= 80000; e.evidencia = Math.min(100, e.evidencia+15);
        nota(log,'neutro','$80.000 por un pico de evidencia que igual se degrada.','torres'); } }
  ]},

{ id:'roadmap', libro:'trap', prio:64, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && e.mesPuesto % 5 === 0; },
  titulo:'El roadmap del semestre',
  texto:'"Necesito fechas y nombres de features para prometerles a los clientes. Es lo que piden."',
  opciones:[
    { txt:'Una lista de features con fechas',
      nota:'Un roadmap de entregables convierte al equipo en fábrica: medido por cuánto salió, nunca por qué cambió.',
      libro:'trap',
      ef:function(e,log){ e.fabrica = true; e.foco -= 5; e.politico += 4;
        nota(log,'malo','Modo fábrica. Vas a entregar mucho y mover poco.','trap'); } },
    { txt:'Problemas por resolver, con resultados esperados',
      nota:'Comprometerse con el problema y la métrica deja abierto el cómo, que es donde el equipo agrega valor.',
      libro:'trap',
      ef:function(e,log){ e.fabrica = false; e.foco += 7; e.politico -= 3;
        nota(log,'bueno','Un roadmap de resultados. Más difícil de vender adentro, paga mejor.','trap'); } }
  ]},

{ id:'empoderar', libro:'inspired', prio:58, quien:'estrella',
  cuando:function(e){ return (e.ing+e.prod) > 6 && e.mesPuesto > 5 && !e.empoderado; },
  titulo:'Quién decide qué se construye',
  texto:'"Cada decisión sigue pasando por ti. Esperamos días por cosas que podríamos resolver nosotros."',
  opciones:[
    { txt:'Darle al equipo el problema y el contexto, no la solución',
      nota:'Un equipo al que le entregan una lista solo puede atacar la factibilidad. Los riesgos que matan productos son los otros.',
      libro:'inspired',
      ef:function(e,log){ e.empoderado = true; e.moral += 8;
        nota(log,'bueno','Equipo empoderado: más moral y mejor lectura de qué apuestas importan.','inspired'); } },
    { txt:'Seguir decidiendo tú: es más rápido',
      nota:'Es más rápido hoy y es tu techo mañana. La producción de un gerente es la producción de su organización.',
      libro:'grove',
      ef:function(e,log){ e.moral -= 6;
        nota(log,'malo','Eres el cuello de botella. La moral baja y el techo eres tú.','grove'); } }
  ]},

{ id:'pivote', libro:'lean', prio:115, quien:'ceo',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 6 && e.evidencia > 55 && Motor.fitMax(e) < 0.4; },
  titulo:'La evidencia dice que no',
  texto:'Ya sabes suficiente, y lo que sabes es malo: nadie quiere esto tal como está planteado.',
  opciones:[
    { txt:'Pivotar: mismo problema, otra solución',
      nota:'Un pivote no es fracaso: es gastar el aprendizaje que ya pagaste. Te quedas con las lecciones, no con el plan.',
      libro:'lean',
      ef:function(e,log){ Motor.pivotar(e);
        nota(log,'bueno','Pivote hecho. Pierdes la cobertura que construiste y ganas una hipótesis que quizás viva.','lean'); } },
    { txt:'Perseverar: estamos tan cerca',
      nota:'Perseverar sin evidencia nueva es la forma más común de gastarse una startup entera con mucha disciplina.',
      libro:'lean',
      ef:function(e,log){ e.moral -= 5;
        nota(log,'malo','Sigues adelante. La caja también sigue bajando.','lean'); } }
  ]},

/* ---------------- momentos dramáticos ---------------- */

{ id:'adquisicion', libro:'deals', prio:118, quien:'board',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 9 && e.mrr > Motor.burnMensual(e) * 0.8; },
  titulo:'Quieren comprar la empresa',
  texto:'"Llegó una oferta en firme: 3 años de ingresos, la mitad en efectivo. El directorio quiere tu recomendación."',
  opciones:[
    { txt:'Vender ahora',
      nota:'Pájaro en mano — después de la cascada de liquidación. Estás por ver exactamente cuánto de eso era tuyo.',
      libro:'deals',
      ef:function(e,log){ e.ventaAcordada = Math.round(e.mrr * 36);
        nota(log,'neutro','Acordado. El puesto termina y la cascada decide cuánto te llega.','deals'); } },
    { txt:'Rechazar y seguir construyendo',
      nota:'Rechazar un exit real es la apuesta más grande que vas a hacer. A veces funciona. A veces se cuenta en pasado.',
      libro:'hard',
      ef:function(e,log){ e.moral += 6; e.marca += 5;
        nota(log,'neutro','Dijiste que no. Ahora tienes que valer más que esa oferta.','hard'); } }
  ]},

{ id:'despidos', libro:'hard', prio:112, quien:'ceo',
  cuando:function(e){ return e.eraId === 'invierno' && Motor.runwayMeses(e) < 9 && (e.ing + e.prod + e.gtm) > 8; },
  titulo:'El directorio quiere recortes',
  texto:'"En este mercado no vamos a poder levantar. Necesitamos 6 meses más de runway. Dime de dónde salen."',
  opciones:[
    { txt:'Un corte profundo, una sola vez',
      nota:'Si tienes que cortar, corta una vez y corta hondo. Dos rondas de despidos matan la moral dos veces.',
      libro:'hard',
      ef:function(e,log){
        var corte = Math.max(1, Math.round(e.ing * 0.25)); e.ing -= corte;
        var corteG = Math.max(0, Math.round(e.gtm * 0.4)); e.gtm -= corteG;
        e.moral -= 12;
        nota(log,'neutro','Cortaste ' + (corte+corteG) + ' puestos de una vez. Hoy duele; se recupera.','hard'); } },
    { txt:'Un corte suave, y vemos',
      nota:'El corte chico promete no alcanzar. El equipo lo sabe y trabaja esperando el segundo.',
      libro:'hard',
      ef:function(e,log){ e.ing = Math.max(1, e.ing - 1); e.moral -= 8; e.riesgoDespidos = true;
        nota(log,'malo','Un corte que no alcanza. Todos saben que viene otro.','hard'); } },
    { txt:'Sin recortes: apostar a que el mercado vuelve',
      nota:'A veces el mercado vuelve. El runway no opina: cuenta.',
      libro:'lean',
      ef:function(e,log){ e.moral += 3;
        nota(log,'neutro','Sin recortes. Vigila el runway todos los meses.','lean'); } }
  ]},

{ id:'caza', libro:'grove', prio:96, quien:'estrella',
  cuando:function(e){ return e.calor > 0 && e.mesPuesto > 3 && e.moral < 80; },
  titulo:'Le hicieron una oferta',
  texto:'"Me ofrecieron el doble en otra empresa del rubro. No me quiero ir, pero es el doble."',
  opciones:[
    { txt:'Igualar la oferta',
      nota:'Retener con plata funciona una vez. Lo que retiene de verdad es el proyecto y el mando sobre tu propio terreno.',
      libro:'grove',
      ef:function(e,log){ e.caja -= 140000; e.moral += 3;
        nota(log,'neutro','Se queda. Carísimo, y las razones de fondo siguen ahí.','grove'); } },
    { txt:'Dejarla ir, y repartir su sistema en el equipo',
      nota:'Perder a la estrella duele menos que organizarse alrededor de una sola cabeza. El factor bus también es deuda.',
      libro:'topologies',
      ef:function(e,log){ e.penalCap = 10; e.deuda += 6; e.moral -= 4;
        nota(log,'neutro','Se fue. Tres meses de resaca y un sistema que ya no depende de una persona.','topologies'); } },
    { txt:'Contraofertar con mando: hacerla dueña de la plataforma',
      nota:'Más mando suele valer más que más plata, y de paso te ordena la organización.',
      libro:'grove',
      ef:function(e,log){ e.moral += 6; e.teamTopo = true;
        nota(log,'bueno','Se queda, con dominio claro de la plataforma. Dos problemas resueltos.','grove'); } }
  ]},

{ id:'rival', libro:'zero', prio:84, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && !e.rivalVisto && e.rivalNombre; },
  titulo:'Ese nombre lo conoces',
  texto:'"El competidor contrató gente nueva para pelearnos el mercado grande. ¿Sabes quién lleva producto ahí ahora?"',
  opciones:[
    { txt:'Acelerar para llegar antes que su plan',
      nota:'Correr la carrera del rival es dejar que otro elija la pista. A veces igual hay que hacerlo.',
      libro:'zero',
      ef:function(e,log){ e.rivalVisto = true; e.foco -= 4; e.competidor.atencion += 0.1;
        var msg = e.rivalNombre + ' va a jugar agresivo. Tú también, ahora.';
        nota(log,'neutro',msg,'zero'); } },
    { txt:'Ignorarlos y jugar tu propio juego',
      nota:'La competencia es para perdedores, decía el libro. Tu diferencia vale más que su velocidad.',
      libro:'zero',
      ef:function(e,log){ e.rivalVisto = true; e.foco += 6;
        nota(log,'bueno','Que corran. Tú tienes un juego propio.','zero'); } }
  ]},

{ id:'downround', libro:'deals', prio:117, quien:'board',
  cuando:function(e){ return e.esFundador && e.eraId === 'invierno' && Motor.runwayMeses(e) < 7 && e.rondas.length > 0; },
  titulo:'La ronda que nadie quiere',
  texto:'"Hay exactamente un fondo dispuesto — a la mitad de la última valuación, con términos duros. Eso, o un puente del directorio."',
  opciones:[
    { txt:'Aceptar la down round',
      nota:'Recortar la valuación duele en los titulares. La alternativa suele doler en el balance.',
      libro:'deals',
      ef:function(e,log){ var monto = Motor.burnMensual(e)*10; Motor.ronda(e, monto, e.valoracion*0.5, 1.5, true, 0.1, true);
        nota(log,'neutro','Plata en el banco, orgullo en el piso, empresa viva.','deals'); } },
    { txt:'Puente del directorio y un corte brutal',
      nota:'El puente compra meses; no resuelve nada. Con el corte, quizás justo alcance para llegar a la primavera.',
      libro:'hard',
      ef:function(e,log){ e.caja += Motor.burnMensual(e)*5; e.ing = Math.max(1, Math.round(e.ing*0.6));
        e.gtm = Math.max(0, Math.round(e.gtm*0.5)); e.moral -= 15;
        nota(log,'malo','Puente + cortes. La mitad del equipo, el doble de presión.','hard'); } }
  ]},
/* ---------------- oficio de producto: las decisiones duras ----------------
   Más difíciles a propósito: los pagos dependen de tu estado actual (la misma
   elección es correcta o incorrecta según la evidencia con la que llegues),
   y algunas opciones son apuestas genuinas. */

{ id:'sandbag', libro:'thinkingbets', prio:66, quien:'estrella',
  cuando:function(e){ return e.mesPuesto > 2 && e.apuestasCompletadas >= 1; },
  titulo:'Las estimaciones infladas',
  texto:'"Después del fallo del trimestre pasado, ingeniería duplicó todas las estimaciones. Nadie va a llegar tarde nunca más. Nada va a llegar temprano tampoco."',
  opciones:[
    { txt:'Aceptar el colchón. La previsibilidad tiene valor',
      nota:'Compraste calma y pagaste en capacidad: las estimaciones infladas se vuelven trabajo inflado. Parkinson cobra.',
      libro:'thinkingbets',
      ef:function(e,log){ e.penalCap = (e.penalCap||0) + 3; e.moral += 4;
        nota(log,'neutro','Ahora todo llega "a tiempo". Tu capacidad real se encogió en silencio.','thinkingbets'); } },
    { txt:'Cortar todas las estimaciones a la mitad, en público',
      nota:'Acabas de enseñarle al equipo que los números honestos se castigan. La próxima vez inflan más hondo, donde no ves.',
      libro:'grove',
      ef:function(e,log){ e.moral -= 8; e.deuda += 4; e.foco += 3;
        nota(log,'malo','Más rápido en el papel. El colchón se mudó bajo tierra, al código.','grove'); } },
    { txt:'Darlo vuelta: tiempo fijo, alcance variable',
      nota:'La jugada de Shape Up — la fecha se sostiene, el alcance cede. Solo funciona si de verdad dejas caer alcance.',
      libro:'shapeup',
      ef:function(e,log){
        var id2 = null, i2;
        for (i2 = 0; i2 < e.backlog.length; i2++) { id2 = e.backlog[i2]; break; }
        if (id2) { e.costos[id2] = Math.max(4, Math.round((e.costos[id2] || 10) * 0.7)); e.impactos[id2] = Math.max(2, Math.round(e.impactos[id2] * 0.85)); }
        nota(log,'bueno','Apetito definido. Tu próximo proyecto salió más barato y un poco más chico — a propósito.','shapeup'); } }
  ]},

{ id:'peeking', libro:'analytics', prio:70, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 3 && Motor.usuarios(e) > 150; },
  titulo:'El test que se ve genial al día 3',
  texto:'"El experimento va +12% a los tres días y el directorio se reúne mañana. ¿Lo damos por cerrado y lanzamos?"',
  opciones:[
    { txt:'Cerrarlo. 12% es 12%',
      nota:'Espiar los tests es como los efectos de novedad se vuelven hechos de roadmap. La mitad de las veces este número era ruido con traje.',
      libro:'analytics',
      ef:function(e,log){
        if (Math.random() < 0.5) { e.retBonus = (e.retBonus||0) + 0.02; nota(log,'bueno','Tuviste suerte: el efecto era real. +2% de retención. Recuerda que fue un volado.','analytics'); }
        else { e.retBonus = (e.retBonus||0) - 0.02; e.evidencia = Math.max(0, e.evidencia - 8);
          nota(log,'malo','Efecto de novedad. Se desinfló, la retención cayó, y ahora confías menos en tus propios datos.','analytics'); } } },
    { txt:'Correrlo hasta la significancia. El directorio recibe la versión honesta',
      nota:'Una semana de paciencia contra una vida de saber si tus números significan algo.',
      libro:'analytics',
      ef:function(e,log){ e.politico -= 4; e.evidencia = Math.min(100, e.evidencia + 8);
        nota(log,'bueno','El directorio frunció el ceño. El resultado aguantó — y ahora es un hecho, no una esperanza.','analytics'); } },
    { txt:'Lanzar a la mitad de los usuarios, guardar un grupo de control',
      nota:'El compromiso que cuesta un poco de ambos: algo de ganancia ahora, la verdad en cuatro semanas.',
      libro:'accelerate',
      ef:function(e,log){ e.retBonus = (e.retBonus||0) + 0.01; e.evidencia = Math.min(100, e.evidencia + 4);
        nota(log,'neutro','Despliegue a medias con grupo de control. Victoria más lenta, sin mentira.','accelerate'); } }
  ]},

{ id:'prfaq', libro:'workingback', prio:64, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 3 && e.backlog.length > 2; },
  titulo:'La iniciativa con impulso',
  texto:'"Todos aman la gran idea del offsite. Quiero luz verde esta semana mientras la energía está alta."',
  opciones:[
    { txt:'Darle luz verde por el impulso',
      nota:'El entusiasmo no es evidencia. Amazon escribe el comunicado de prensa primero precisamente porque el impulso miente.',
      libro:'workingback',
      ef:function(e,log){
        var id2 = e.backlog[0];
        if (id2) e.ruidos[id2] = (e.ruidos[id2] || 0) + 0.8;
        nota(log,'malo','Luz verde a ciegas: tu lectura de esa apuesta se volvió más ruidosa, no mejor.','workingback'); } },
    { txt:'Una semana para escribir primero el comunicado y el FAQ',
      nota:'Working Backwards: si el comunicado falso no emociona a nadie, el real tampoco. El test más barato que existe.',
      libro:'workingback',
      ef:function(e,log){
        var id2 = e.backlog[0];
        if (id2) { e.ruidos[id2] = 0; nota(log,'bueno','El PR/FAQ expuso qué es esto en realidad. La estimación de esa apuesta ahora es exacta.','workingback'); }
        else nota(log,'bueno','El ejercicio mató la niebla. Ahora sabes qué estás decidiendo.','workingback'); } },
    { txt:'Estacionarla: el trimestre ya está comprometido',
      nota:'Decirle que no a algo brillante a mitad de trimestre es impopular y correcto un 80% de las veces.',
      libro:'rumelt',
      ef:function(e,log){ e.foco += 6; e.politico -= 5;
        nota(log,'neutro','La energía se desinfló y el trimestre sobrevivió. Estrategia es aquello a lo que le dices que no.','rumelt'); } }
  ]},

{ id:'northstar', libro:'analytics', prio:63, quien:'board',
  cuando:function(e){ return e.mesPuesto > 4 && e.mrr > 0; },
  titulo:'Elige la estrella del norte',
  texto:'"Esta empresa mide cuarenta números y no gestiona ninguno. Elige LA métrica. Una."',
  opciones:[
    { txt:'Uso activo semanal',
      nota:'Las estrellas de uso alinean a la empresa alrededor del valor entregado. El ingreso sigue — normalmente, tarde o temprano, si el modelo funciona.',
      libro:'analytics',
      ef:function(e,log){ e.retBonus = (e.retBonus||0) + 0.015; e.foco += 6;
        nota(log,'bueno','Todos optimizan para que la gente vuelva. La retención se afirma.','analytics'); } },
    { txt:'Ingreso mensual',
      nota:'Las estrellas de ingreso enfocan de maravilla y recortan esquinas sin que se vea: la presión fluye a precios y tácticas de venta, no a valor.',
      libro:'analytics',
      ef:function(e,log){ e.precio = Math.round(e.precio * 1.05); e.marca -= 4; e.foco += 6;
        nota(log,'neutro','El precio subió 5% a escondidas, la marca bajó. Eficiente y un poco corrosivo.','analytics'); } },
    { txt:'Un tablero balanceado de seis KPIs',
      nota:'Seis prioridades son cero prioridades vestidas de planilla. Esta es la opción trampa, y siempre parece la más razonable.',
      libro:'rumelt',
      ef:function(e,log){ e.foco -= 8;
        nota(log,'malo','Cada uno se quedó con su número favorito. Nada cambió, que era el punto de elegir.','rumelt'); } }
  ]},

{ id:'jobsegment', libro:'jtbd', prio:62, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4; },
  titulo:'La pelea por la segmentación',
  texto:'"Marketing quiere personas. Ventas quiere verticales por industria. Tienes un trimestre de presupuesto de mensajes y los dos están en la sala."',
  opciones:[
    { txt:'Resegmentar por el trabajo para el que nos contratan',
      nota:'La segmentación JTBD es la respuesta correcta CON datos reales de entrevistas detrás. Sin eso, solo estás inventando personas más elegantes.',
      libro:'jtbd',
      ef:function(e,log){
        if (e.evidencia >= 50) { e.cobertura.core += 6; e.marca += 5;
          nota(log,'bueno','Tu evidencia aguantó: los trabajos eran reales, el mensaje encajó, el fit se profundizó.','jtbd'); }
        else { e.foco -= 6; e.caja -= 15000;
          nota(log,'malo','Segmentaste sobre conjeturas. Los "trabajos" eran ficción y el mensaje del trimestre se fue con ellos. Evidencia primero.','jtbd'); } } },
    { txt:'Personas: que marketing siga andando',
      nota:'Las personas demográficas describen quién compra, no por qué. Seguro, familiar y mayormente decorativo.',
      libro:'jtbd',
      ef:function(e,log){ e.marca += 2;
        nota(log,'neutro','Diapositivas bonitas, mejora tibia. Nadie aprendió nada sobre causalidad.','jtbd'); } },
    { txt:'Verticales: seguir el pipeline de ventas',
      nota:'Los cortes por industria ayudan a ventas a navegar y no dicen nada del producto. Bien para planificar territorios; estéril para producto.',
      libro:'positioning',
      ef:function(e,log){ e.gtmBonus = (e.gtmBonus||0) + 0.15; e.foco -= 3;
        nota(log,'neutro','Ventas consiguió mapas más filosos. Producto no consiguió nada.','positioning'); } }
  ]},

{ id:'reposition', libro:'dunford', prio:65, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 5 && e.competidor.atencion > 0.25; },
  titulo:'Te quitaron la categoría',
  texto:'"El competidor acaba de anunciar con NUESTRAS palabras. Los analistas ahora nos describen como \'un ellos más barato\'. Los prospectos me lo repiten a mí."',
  opciones:[
    { txt:'Reposicionarse en el nicho donde ganas',
      nota:'Dunford: cambia el contexto y cambias el valor. Estanque más chico, pero de pronto eres la elección obvia adentro.',
      libro:'dunford',
      ef:function(e,log){ e.marca += 8; e.foco += 5; e.tam.visio = Math.round(e.tam.visio * 0.92);
        nota(log,'bueno','Marco nuevo, mercado más apretado, victorias más limpias. Cambiaste alcance por obviedad.','dunford'); } },
    { txt:'Pelear la categoría de frente',
      nota:'Gastar más que el que nombró la categoría para recuperarla es un juego de empresas ricas. Revisa tu billetera.',
      libro:'positioning',
      ef:function(e,log){ e.caja -= 40000; e.competidor.atencion = Math.min(0.95, e.competidor.atencion + 0.15);
        nota(log,'malo','$40.000 de contramensajes y ahora te consideran una amenaza que vale la pena vigilar.','positioning'); } },
    { txt:'Ignorarlo. El producto gana al final',
      nota:'A veces es cierto. Pero el posicionamiento ocurre en la cabeza del comprador contigo o sin ti — abstenerse solo significa que lo escriben ellos.',
      libro:'dunford',
      ef:function(e,log){ e.marca -= 5;
        nota(log,'neutro','Te quedaste callado. El mercado se quedó con la versión de ellos.','dunford'); } }
  ]},

{ id:'pricing2', libro:'pricing', prio:67, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && e.mrr > Motor.burnMensual(e) * 0.15; },
  titulo:'El descuento de fin de trimestre',
  texto:'"Dame 40% de descuento en estos cinco deals y cierro el trimestre hoy. Firman todos. Es lo único que están esperando."',
  opciones:[
    { txt:'Aprobar los descuentos',
      nota:'Ingreso hoy, ancla para siempre: esos cinco no vuelven a pagar lista jamás, y hablan entre ellos.',
      libro:'pricing',
      ef:function(e,log){ e.mrr = Math.round(e.mrr * 1.08); e.precio = Math.round(e.precio * 0.93);
        nota(log,'malo','Trimestre salvado, precio de lista muerto en silencio: tu precio real acaba de bajar 7% para todos los que siguen.','pricing'); } },
    { txt:'Sostener el precio y ofrecer un paquete de valor',
      nota:'Funciona cuando de verdad sabes qué valoran. Adivinar el paquete es un descuento con pasos extra.',
      libro:'pricing',
      ef:function(e,log){
        if (e.evidencia >= 55) { e.mrr = Math.round(e.mrr * 1.05); e.marca += 4;
          nota(log,'bueno','Supiste qué empaquetar porque sabías qué valoraban. Integridad de precio intacta.','pricing'); }
        else { e.mrr = Math.round(e.mrr * 0.97); e.politico -= 5;
          nota(log,'malo','El paquete no tocó lo que les importaba — dos deals se fueron. Estabas adivinando.','pricing'); } } },
    { txt:'Dejar caer los deals. El precio es el producto',
      nota:'Brutal y limpio. Una empresa que nunca se dobla le enseña al mercado a dejar de pedir.',
      libro:'pricing',
      ef:function(e,log){ e.politico -= 7; e.marca += 3;
        nota(log,'neutro','Ventas está furiosa. El próximo trimestre, nadie abre con "estoy esperando el descuento".','pricing'); } }
  ]},

{ id:'delight', libro:'badass', prio:61, quien:'estrella',
  cuando:function(e){ return e.usabilidad < 55 && e.mesPuesto > 3; },
  titulo:'El deleite contra lo básico',
  texto:'"Diseñé algo que los usuarios van a capturar y compartir. Sé que el onboarding sigue tosco, pero ESTO es lo que nos hace queribles."',
  opciones:[
    { txt:'Lanzar el deleite',
      nota:'La curva de Kano no perdona: deleites sobre básicos rotos se leen como maquillaje. La captura se hace viral; el churn se queda.',
      libro:'badass',
      ef:function(e,log){ e.marca += 6; e.usabilidad -= 2;
        nota(log,'neutro','Demo preciosa, tuits cálidos, el mismo embudo con fugas debajo.','badass'); } },
    { txt:'Lo básico primero: nadie ama lo que no puede usar',
      nota:'Los usuarios no mejoran con tu producto hasta que ENTRAN a tu producto. Los usuarios expertos se construyen sobre cimientos aburridos.',
      libro:'krug',
      ef:function(e,log){ e.usabilidad += 8; e.moral -= 3;
        nota(log,'bueno','Mes sin brillo, +8 de usabilidad. Cada visitante futuro convierte mejor.','krug'); } },
    { txt:'Los dos, medio tiempo cada uno',
      nota:'El compromiso que entrega dos mitades de nada. Partir el foco es como pierden las dos apuestas.',
      libro:'grove',
      ef:function(e,log){ e.usabilidad += 2; e.marca += 1; e.foco -= 5;
        nota(log,'malo','Salieron dos cosas al 50%. Ninguna movió su número. El foco pagó la cuenta.','grove'); } }
  ]},

{ id:'empowered2', libro:'empowered', prio:68, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 5 && e.rolN >= 2; },
  titulo:'La especificación de la cena',
  texto:'"Cené con el CEO de nuestro cliente más grande. Esto es exactamente lo que vamos a construir — lo dibujé en la servilleta. No le des tantas vueltas."',
  opciones:[
    { txt:'Construirlo tal como está dibujado',
      nota:'Una solución bajada de arriba se salta las únicas preguntas que importan: ¿es valiosa, es usable, generaliza? Las servilletas no responden ninguna.',
      libro:'empowered',
      ef:function(e,log){
        var id2 = e.backlog[0];
        if (id2) e.impactos[id2] = Math.max(2, Math.round(e.impactos[id2] * 0.5));
        e.politico += 6;
        nota(log,'malo','El CEO sonríe radiante. Lo de la servilleta resuelve el problema de un comensal, a la mitad del valor.','empowered'); } },
    { txt:'Replantear: "¿qué problema describió?" — y resolver ESO',
      nota:'Los equipos empoderados toman problemas de arriba y evidencia de abajo. Cuesta una conversación difícil y paga en soluciones reales.',
      libro:'empowered',
      ef:function(e,log){
        var id2 = e.backlog[0];
        if (id2) e.ruidos[id2] = 0;
        e.politico -= 5;
        nota(log,'bueno','Reunión incómoda, resultado limpio: ahora sabes exactamente de qué se trataba ese pedido.','empowered'); } },
    { txt:'Asentir, y construir en silencio lo que tú crees',
      nota:'La apuesta de los apostadores: los héroes reciben estatuas, los cadáveres reciben casos de estudio. Tu evidencia decide cuál eres.',
      libro:'hard',
      ef:function(e,log){
        if (e.evidencia >= 60) { e.politico += 10; e.foco += 4;
          nota(log,'bueno','Tu versión funcionó. El CEO ahora cuenta la historia como si hubiera sido idea suya. Estatuas para todos.','hard'); }
        else { e.politico -= 15; e.moral -= 4;
          nota(log,'malo','Tu versión falló — y desobedeciste por una corazonada. Esa reunión fue muy silenciosa.','hard'); } } }
  ]},

{ id:'sprint2', libro:'sprintk', prio:60, quien:'cto',
  cuando:function(e){ return e.mesPuesto > 2 && e.evidencia < 60; },
  titulo:'Decisión grande, datos flacos',
  texto:'"Llevamos tres semanas debatiendo el flujo central. Cada reunión termina donde empezó. Que alguien decida algo."',
  opciones:[
    { txt:'Correr un design sprint: prototipo el jueves, cinco usuarios el viernes',
      nota:'Cinco días para comprimir tres meses de discusión. El prototipo no tiene que funcionar; tiene que hacer reaccionar a cinco personas.',
      libro:'sprintk',
      ef:function(e,log){ e.evidencia = Math.min(100, e.evidencia + 9); e.foco += 4;
        nota(log,'bueno','Los cinco usuarios del viernes terminaron el debate en una hora. Nueve puntos de evidencia, una semana.','sprintk'); } },
    { txt:'Decidirlo tú en la próxima reunión',
      nota:'Rápido, decisivo, y exactamente tan bueno como tu intuición — que es exactamente tan buena como tu evidencia.',
      libro:'thinkingbets',
      ef:function(e,log){
        if (e.evidencia >= 45) { e.foco += 5; nota(log,'neutro','Lo decidiste. Tu evidencia acumulada lo hizo una apuesta justa.','thinkingbets'); }
        else { e.sesgo = Math.min(1, (e.sesgo||0) + 0.2); e.foco += 3;
          nota(log,'malo','Lo decidiste por sensaciones. El equipo se mueve — en una dirección elegida por tu opinión más ruidosa.','thinkingbets'); } } },
    { txt:'Copiar lo que hace el líder del mercado',
      nota:'Su flujo codifica SUS concesiones para SUS usuarios a SU escala. Estás importando conclusiones sin el razonamiento.',
      libro:'dunford',
      ef:function(e,log){ e.foco += 2; e.evidencia = Math.max(0, e.evidencia - 4);
        nota(log,'malo','Lanzaste la respuesta de ellos a tu pregunta. Ahora tu producto discute consigo mismo.','dunford'); } }
  ]},

{ id:'coldstart2', libro:'coldstart', prio:64, quien:'ventas', sectores:['banco','apuestas','devtools','datapol','market','strea','ia'],
  cuando:function(e){ return e.mesPuesto > 4 && Motor.usuarios(e) < e.tam.visio * 0.5; },
  titulo:'Salas vacías',
  texto:'"Las funciones de red son pueblos fantasma. Cada usuario nuevo entra a una sala vacía, se encoge de hombros y se va. Growth quiere bombardearla con anuncios."',
  opciones:[
    { txt:'Encogerse a una red atómica y hacerla densa',
      nota:'La ley de Chen: cien personas que se ven todas entre sí le ganan a diez mil que no ven a nadie. Doloroso, más chico, correcto.',
      libro:'coldstart',
      ef:function(e,log){
        var i2; for (i2 = 0; i2 < SEGMENTOS.length; i2++) e.usuarios[SEGMENTOS[i2].id] *= 0.92;
        e.viral += 0.35; e.retBonus = (e.retBonus||0) + 0.02;
        nota(log,'bueno','Cerraste las salas vacías y llenaste una. Ahí adentro hay vida — y la vida se contagia.','coldstart'); } },
    { txt:'Bombardear con anuncios: llenar las salas con volumen',
      nota:'Verter extraños en salas vacías produce salas vacías más llenas. No se conocen entre sí; ese era el problema.',
      libro:'coldstart',
      ef:function(e,log){ e.caja -= 30000; e.retBonus = (e.retBonus||0) - 0.015;
        nota(log,'malo','$30.000 de llegadas al silencio. Se fueron un poco más rápido que los orgánicos.','coldstart'); } },
    { txt:'Sembrar las salas con actividad de la casa',
      nota:'Todos los marketplaces lo hicieron; pocos lo admiten. Funciona hasta que alguien lo nota, y alguien siempre lo nota.',
      libro:'hard',
      ef:function(e,log){ e.retBonus = (e.retBonus||0) + 0.015; e.lupa = Math.min(100, e.lupa + 10);
        nota(log,'neutro','Las salas parecen vivas. Algunas de las "personas" eres tú. La Lupa lo notó.','hard'); } }
  ]},

{ id:'outcomes2', libro:'outcomes', prio:63, quien:'board',
  cuando:function(e){ return e.rolN >= 3 && e.mesPuesto > 5; },
  titulo:'El pedido del roadmap a doce meses',
  texto:'"El directorio quiere compromisos a nivel de feature para los próximos doce meses. Fechas. Nombres. Por escrito."',
  opciones:[
    { txt:'Darles el Gantt de features que pidieron',
      nota:'Acabas de prometer entregables a un año con el conocimiento del primer trimestre. Cada descubrimiento futuro es ahora una promesa rota.',
      libro:'outcomes',
      ef:function(e,log){ e.politico += 6; e.fabrica = true;
        nota(log,'malo','Amaron la certeza. Ahora eres una fábrica de features con impresora de fechas límite.','outcomes'); } },
    { txt:'Comprometerse a resultados con una vista ahora/después/luego',
      nota:'Más difícil de vender, honesto de operar: comprométete con los problemas y las métricas, deja las soluciones negociables.',
      libro:'outcomes',
      ef:function(e,log){
        e.politico -= 6;
        e.pactoOutcomes = true;
        nota(log,'bueno','Reunión tensa. Si tu mandato aterriza, esto se convierte en lo más inteligente que hiciste en el año.','outcomes'); } },
    { txt:'Gantt para el directorio, realidad para el equipo',
      nota:'Dos roadmaps son dos verdades, y eso es un ajuste de cuentas eventual, agendado para el peor momento posible.',
      libro:'hard',
      ef:function(e,log){ e.politico += 3; e.moral -= 6; e.lupa = Math.min(100, e.lupa + 4);
        nota(log,'malo','El equipo sabe que el plan oficial es teatro. El teatro corroe.','hard'); } }
  ]},

{ id:'tornado', libro:'ousterhout', prio:62, quien:'cto',
  cuando:function(e){ return e.deuda > 30 && e.mesPuesto > 3; },
  titulo:'El tornado táctico',
  texto:'"Nuestro ingeniero más rápido entrega en horas lo que a otros les toma días. Ventas lo ama. Cada archivo que toca, alguien más lo reescribe en un mes."',
  opciones:[
    { txt:'Protegerlo. Esa velocidad es rara',
      nota:'Ousterhout nombró exactamente a esta persona: el tornado táctico — héroe para ventas, impuesto para todos los que vienen detrás.',
      libro:'ousterhout',
      ef:function(e,log){ e.deudaPendiente = (e.deudaPendiente||0) + 6; e.moral -= 3;
        nota(log,'malo','Las demos siguen deslumbrando. La base de código sigue pagando. El equipo sigue reescribiendo.','ousterhout'); } },
    { txt:'Emparejarlo con tu mejor diseñador de sistemas',
      nota:'Velocidad más profundidad es el paquete más raro de la industria. A veces se puede fabricar con dos personas.',
      libro:'ousterhout',
      ef:function(e,log){ e.penalCap = (e.penalCap||0) + 2; e.deuda = Math.max(0, e.deuda - 6);
        nota(log,'bueno','Más lento por un mes. Después el tornado empezó a dejar edificios en pie.','ousterhout'); } },
    { txt:'Encauzarlo: solo prototipos y pruebas, nunca producción',
      nota:'Los tornados son magníficos en campo abierto. El truco es mantenerlos fuera del pueblo.',
      libro:'grove',
      ef:function(e,log){ e.evidencia = Math.min(100, e.evidencia + 5); e.moral -= 2;
        nota(log,'neutro','Odia el carril y produce prototipos asombrosos adentro. La evidencia sube.','grove'); } }
  ]},

{ id:'contrainforme', libro:'justenough', prio:61, quien:'estrella',
  cuando:function(e){ return e.mesPuesto > 4 && e.evidencia >= 40; },
  titulo:'La investigación que dice que estás equivocado',
  texto:'"Volvió el estudio de usuarios. Contradice el roadmap. No un poco — lo que vamos a construir ahora quedó último en lo que de verdad les cuesta a los usuarios."',
  opciones:[
    { txt:'Cambiar el rumbo ya, a mitad de trimestre',
      nota:'Caro, vergonzoso y más barato que la alternativa — SI la investigación es sólida. Revisa el método antes que el coraje.',
      libro:'justenough',
      ef:function(e,log){
        e.backlog = []; rellenarBacklog(e);
        var i2; for (i2 in e.ruidos) if (e.ruidos.hasOwnProperty(i2)) e.ruidos[i2] *= 0.6;
        e.politico -= 6;
        nota(log,'bueno','Giraste el barco en mar abierto. El nuevo backlog se lee más cierto — tus estimaciones se afinaron.','justenough'); } },
    { txt:'Terminar el trimestre, revisarlo en la planificación',
      nota:'El impulso es un activo real y también lo es equivocarse con eficiencia por tres meses más. Elige tu veneno a conciencia.',
      libro:'torres',
      ef:function(e,log){ e.evidencia = Math.max(0, e.evidencia - 8);
        nota(log,'neutro','Rumbo firme — hacia un destino que el mapa dice que no existe.','torres'); } },
    { txt:'Cuestionar la metodología hasta que desaparezca',
      nota:'Todo estudio incómodo tiene una falla si la necesitas. Así es como las organizaciones se instalan sus propias vendas.',
      libro:'justenough',
      ef:function(e,log){ e.sesgo = Math.min(1, (e.sesgo||0) + 0.25); e.politico += 3;
        nota(log,'malo','El estudio murió en comité. Tus estimaciones ahora optimizan para que te den la razón.','justenough'); } }
  ]},

{ id:'olsen2', libro:'olsen', prio:59, quien:'ceo',
  cuando:function(e){ return e.faseCorta === 'PRE-PMF' && e.mesPuesto > 3 && Motor.fitMax(e) < 0.5; },
  titulo:'La revisión de la pirámide',
  texto:'"Los inversionistas siguen preguntando cuál es nuestra historia de product-market fit. Necesito una diapositiva. ¿Qué les digo que estamos optimizando?"',
  opciones:[
    { txt:'"Necesidades desatendidas" — seguimos mapeando la capa de mercado',
      nota:'La pirámide de Olsen se construye de abajo hacia arriba: mercado, necesidades, propuesta de valor, DESPUÉS features. Diapositiva aburrida, secuencia correcta.',
      libro:'olsen',
      ef:function(e,log){ e.evidencia = Math.min(100, e.evidencia + 6); e.politico -= 3;
        nota(log,'bueno','Honestidad sin brillo. La siguiente pregunta del inversionista fue más filosa — y respondible.','olsen'); } },
    { txt:'"Pulido de UX" — mostrar las pantallas nuevas y hermosas',
      nota:'Optimizar la punta de la pirámide antes de que exista la base: precioso, cargando peso sobre nada.',
      libro:'olsen',
      ef:function(e,log){ e.usabilidad += 3; e.evidencia = Math.max(0, e.evidencia - 4);
        nota(log,'malo','Las pantallas se llevaron aplausos. La pregunta sin responder de abajo se hizo más grande.','olsen'); } },
    { txt:'"Crecimiento" — la tracción responde todo',
      nota:'Verter crecimiento sobre un producto sin fit es alquilar usuarios para impresionar gente. Se van puntualmente.',
      libro:'seibel',
      ef:function(e,log){ e.caja -= 20000; e.retBonus = (e.retBonus||0) - 0.01;
        nota(log,'malo','$20.000 de tracción prestada. Las curvas de cohortes van a testificar en tu contra.','seibel'); } }
  ]},
{ id:'recruiter', libro:'hard', prio:58, quien:'board',
  cuando:function(e){ return e.mesPuesto >= 4 && e.mesPuesto < e.meses - 2 && Math.random() < 0.5; },
  titulo:'La llamada del reclutador',
  texto:'"Voy a ser breve. Una empresa de otro rubro te quiere — mismo nivel, mejor equity, se mueven rápido. Necesitan respuesta esta semana. ¿Interesa?"',
  opciones:[
    { txt:'Tomar la reunión. Si es real, saltar',
      nota:'Irse a mitad de mandato se lee muy distinto según tus números: en plan es ambición, atrás del plan es huida.',
      libro:'hard',
      ef:function(e,log){ e.vivo = false; e.final = 'renuncia';
        nota(log,'neutro','Tomaste la llamada, después la oferta. Ofertas nuevas aterrizan en tu escritorio la próxima semana.','hard'); } },
    { txt:'"Yo termino lo que empiezo." Colgar',
      nota:'La lealtad es un activo que se compone — SI después entregas de verdad. Si no, fue solo una salida perdida.',
      libro:'grove',
      ef:function(e,log){ e.moral += 3; e.politico += 4;
        nota(log,'bueno','La noticia de la oferta rechazada corrió. Quedarse por elección se lee como fuerza.','grove'); } },
    { txt:'Usarla: decirle a tu CEO que te están cazando',
      nota:'La palanca más vieja de la compensación. Funciona una vez, te marca como riesgo de fuga para siempre, y todos la usan igual.',
      libro:'48laws',
      ef:function(e,log){ e.politico += 6; e.moral -= 2;
        if (Math.random() < 0.3) { e.politico -= 14;
          nota(log,'malo','El CEO te vio el farol: "entonces tómala." Te quedaste igual. Esa conversación te persigue.','48laws'); }
        else nota(log,'neutro','Apareció un refresh de equity repentino. También una nota en el archivo mental de alguien: riesgo de fuga.','48laws'); } }
  ]},

/* ---------------- la calle: jugadas de poder ----------------
   House of Cards dentro del edificio. Ninguna de estas opciones es limpia;
   la calle enseña con factura. */

{ id:'kompromat', libro:'hard', prio:72, quien:'estrella',
  cuando:function(e){ return e.mesPuesto > 3 && e.rolN >= 2; },
  titulo:'Lo que encontraste en los registros',
  texto:'"Revisando el sistema de gastos encontré... algo. El CTO lleva un año facturando viajes personales como visitas a clientes. Nadie más lo sabe. ¿Qué hago con esto?"',
  opciones:[
    { txt:'Nada. Pero guarda el archivo',
      nota:'Ahora tienes una póliza de seguro sobre tu propio puesto. La palanca te protege exactamente una vez — y tenerla te cambia.',
      libro:'hard',
      ef:function(e,log){ e.palancaSecreta = true; e.moral -= 2;
        nota(log,'neutro','El archivo existe. Nadie sabe que existe. Verificas que existe más seguido de lo que admitirías.','hard'); } },
    { txt:'Reportarlo al directorio, según el manual',
      nota:'Manos limpias, precio público: acabas de convertirte en la persona que reporta gente. Reputación útil, almuerzos fríos.',
      libro:'grove',
      ef:function(e,log){ e.politico -= 8; e.moral += 4; e.lupa = Math.max(e.lupaBase, e.lupa - 5);
        nota(log,'bueno','El CTO "transicionó afuera". Hiciste lo correcto y ahora todos son muy cuidadosos a tu alrededor.','grove'); } },
    { txt:'Mostrárselo al CTO. En privado',
      nota:'La jugada de House of Cards: no es chantaje, solo... claridad entre colegas. Nunca va a moverse en tu contra. Probablemente.',
      libro:'hard',
      ef:function(e,log){ e.politico += 10; e.lupa = Math.min(100, e.lupa + 8); e.moral -= 4;
        nota(log,'malo','Entendió de inmediato. Ahora tienes un aliado — de los que se sostienen con miedo.','hard'); } }
  ]},

{ id:'palanca', libro:'deals', prio:74, quien:'board',
  cuando:function(e){ return e.rolN >= 3 && e.mesPuesto > 4; },
  titulo:'El café del miembro del directorio',
  texto:'"Esto queda entre nosotros. Algunos tenemos... preguntas sobre los números del CEO. Tú ves todo desde donde estás. Mantenme informado, y lo voy a recordar cuando las cosas cambien."',
  opciones:[
    { txt:'Convertirte en sus ojos',
      nota:'O estás respaldando el golpe ganador o estás documentando tu propia traición. No hay tercer desenlace.',
      libro:'hard',
      ef:function(e,log){ e.palancaSecreta = true; e.moral -= 5;
        nota(log,'neutro','Ahora reportas mensualmente. Si salen los cuchillos, estás cubierto. Si no salen, eres la filtración.','hard'); } },
    { txt:'"Yo le reporto al CEO. Pregúntale a él"',
      nota:'Lealtad, dicha sin adornos, a la persona que puede enterarse de este café después. Anticuado y estructural.',
      libro:'grove',
      ef:function(e,log){ e.politico += 5; e.moral += 3;
        nota(log,'bueno','El miembro del directorio sonrió apenas. El CEO se enteró de tu respuesta en una semana — como sabías que pasaría.','grove'); } },
    { txt:'Contarle todo al CEO, hoy',
      nota:'Ahora el CEO te debe una — y sabe que el directorio está rondando. Acabas de elegir bando en una guerra que no ha empezado.',
      libro:'hard',
      ef:function(e,log){ e.politico += 12; e.marca -= 3;
        nota(log,'neutro','El CEO palideció, después agradeció. Ahora eres círculo íntimo. Los círculos íntimos son donde cae la metralla.','hard'); } }
  ]},

{ id:'chivoexpiatorio', libro:'hard', prio:88, quien:'ceo',
  cuando:function(e){ return e.incidentesPuesto >= 1 && e.mesPuesto > 3; },
  titulo:'Alguien tiene que cargarla',
  texto:'"El directorio quiere un nombre por la caída. No un proceso — un nombre. Tu líder de infraestructura firmó el deploy. Dámelo y esto se acaba el viernes."',
  opciones:[
    { txt:'Darles el nombre',
      nota:'El Príncipe, capítulo siete: los príncipes mantienen las manos limpias alquilando manos sucias. Funciona. También se convierte en lo que tu equipo sabe de ti.',
      libro:'hard',
      ef:function(e,log){ e.politico += 10; e.moral -= 12; e.penalCap = (e.penalCap||0) + 3;
        nota(log,'malo','Vació su escritorio antes del viernes. El directorio pasó de página. Tu equipo ahora trabaja con un ojo en la salida.','hard'); } },
    { txt:'"Fue mi decisión. Tómenme a mí o suéltenlo"',
      nota:'Caer sobre la espada es caro hoy y legendario para siempre. Los equipos siguen a la gente que ha hecho esto.',
      libro:'hard',
      ef:function(e,log){ e.politico -= 14; e.moral += 12;
        nota(log,'bueno','El directorio refunfuñó y lo soltó. Tu equipo ahora atravesaría muros por ti.','hard'); } },
    { txt:'Enterrarlos en los datos del post-mortem',
      nota:'La defensa SRE: los post-mortems sin culpables existen precisamente para esto. Solo funciona si tu evidencia es real.',
      libro:'sre',
      ef:function(e,log){
        if (e.evidencia >= 45) { e.politico += 4; e.moral += 5;
          nota(log,'bueno','Cuarenta diapositivas de causalidad después, el directorio se aburrió hasta la justicia. Proceso 1, chivo expiatorio 0.','sre'); }
        else { e.politico -= 8;
          nota(log,'malo','Tu post-mortem tenía opiniones donde debía haber datos. El directorio lo olió. Ahora quieren dos nombres.','sre'); } } }
  ]},

{ id:'padrino', libro:'hard', prio:76, quien:'ventas', sectores:['banco','apuestas','biogen','saludgold','ia','chips','ciber'],
  cuando:function(e){ return e.mesPuesto > 4 && Motor.compuerta(e,'pragm') < 0.6; },
  titulo:'El hombre que conoce a todos',
  texto:'"Tu expediente de licencia lleva meses \'en revisión\', ¿no? Yo conozco a la gente que lo revisa. Una consultoría con mi firma — $60.000 — y las revisiones tienen una manera de... concluir."',
  opciones:[
    { txt:'Contratar al "consultor"',
      nota:'Va a funcionar. Siempre funciona. Eso es exactamente lo que lo convierte en los $60.000 más caros que vas a gastar.',
      libro:'hard',
      ef:function(e,log){ e.caja -= 60000; e.cobertura.segur += 14; e.lupa = Math.min(100, e.lupa + 22);
        nota(log,'malo','La revisión concluyó favorablemente en once días. En alguna parte, un cuaderno ahora tiene tu nombre.','hard'); } },
    { txt:'Rechazar. Lo bastante fuerte para que se oiga',
      nota:'El rechazo que recorre la ciudad: los reguladores hablan, y "el que no pagó" es una reputación con interés compuesto.',
      libro:'hard',
      ef:function(e,log){ e.marca += 5; e.lupa = Math.max(e.lupaBase, e.lupa - 6);
        nota(log,'bueno','La noticia viajó. Tu expediente sigue arrastrándose — pero la gente que lo revisa te trata distinto ahora.','hard'); } },
    { txt:'Contratar asesoría regulatoria de verdad',
      nota:'La versión legítima cuesta más, va más lento y nunca aparece en el testimonio de nadie.',
      libro:'hard',
      ef:function(e,log){ e.caja -= 90000; e.cobertura.segur += 8;
        nota(log,'neutro','$90.000 en abogados que facturan por hora y duermen de noche. Progreso, por la vía aburrida.','hard'); } }
  ]},

{ id:'rumor', libro:'artofwar', prio:69, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 5 && e.competidor.atencion > 0.3; },
  titulo:'La campaña de rumores',
  texto:'"Tres deals enterprise están trabados eligiendo entre nosotros y ellos. Un analista amigo \'escucharía\' con gusto que su Serie C se cayó. Hasta podría ser cierto."',
  opciones:[
    { txt:'Hacer la llamada',
      nota:'Sun Tzu aprueba el método y guarda silencio sobre la factura: los mercados recuerdan quién envenena pozos.',
      libro:'artofwar',
      ef:function(e,log){
        if (Math.random() < 0.6) { e.usuarios.pragm += e.tam.pragm * 0.02; e.lupa = Math.min(100, e.lupa + 8);
          nota(log,'neutro','Dos de tres deals cayeron de tu lado. El rumor ya es clima — nadie sabe dónde empezó. Casi nadie.','artofwar'); }
        else { e.marca -= 12; e.lupa = Math.min(100, e.lupa + 14);
          nota(log,'malo','El analista nombró una fuente cuando lo presionaron. Adivina qué empresa. Los tres deals se congelaron, por principio.','artofwar'); } } },
    { txt:'Mejor ganarles en la comparativa',
      nota:'Ganar la evaluación es más lento, cuesta trabajo real y produce una referencia en vez de un cadáver.',
      libro:'challenger',
      ef:function(e,log){ e.cobertura.soporte += 5; e.foco += 3;
        nota(log,'bueno','Ganaste uno limpio, perdiste uno y el tercero se estancó. El que ganaste va a testificar por ti durante años.','challenger'); } },
    { txt:'No decir nada, no hacer nada',
      nota:'A veces la jugada callejera es negarse a jugar. Los deals caen donde caen.',
      libro:'hard',
      ef:function(e,log){
        nota(log,'neutro','Los deals se repartieron por mérito. Mantuviste las manos en los bolsillos, que es donde viven las manos limpias.','hard'); } }
  ]},

{ id:'doblesueldo', libro:'hard', prio:71, quien:'board',
  cuando:function(e){ return e.rolN >= 3 && e.mesPuesto > 5 && !e.conflictoInteres; },
  titulo:'La oferta de asesor',
  texto:'Un viejo colega, ahora fundando algo "adyacente" a tu espacio: "Acciones de asesor, 0,5%, una llamada al mes. Nadie tiene que enterarse. Serías genial."',
  opciones:[
    { txt:'Aceptar. En silencio',
      nota:'0,5% de un quizás contra un dado mensual sobre tu reputación. La calle lo llama apuesta lateral; compliance lo llama con una palabra más corta.',
      libro:'hard',
      ef:function(e,log){ e.conflictoInteres = true; e.ventaSecundaria = (e.ventaSecundaria||0) + 15000;
        nota(log,'malo','Acciones firmadas, llamadas agendadas. Cada mes desde ahora, rueda un dado que tú nunca ves.','hard'); } },
    { txt:'Aceptar, declarado y por escrito',
      nota:'La versión aburrida: legal lo revisa, el CEO lo firma, la ganancia se achica y la bomba también.',
      libro:'deals',
      ef:function(e,log){ e.politico -= 4; e.ventaSecundaria = (e.ventaSecundaria||0) + 8000;
        nota(log,'bueno','La mitad de la mística, nada de la mecha. El CEO levantó una ceja y firmó.','deals'); } },
    { txt:'Pasar. Tu equity está aquí',
      nota:'El foco también es una decisión de portafolio. Una cap table a la vez.',
      libro:'psych',
      ef:function(e,log){ e.foco += 4;
        nota(log,'neutro','Dijiste que no en una frase. Tu viejo colega lo respetó. Tu calendario te lo agradeció.','psych'); } }
  ]},

{ id:'creditos', libro:'48laws', prio:67, quien:'estrella',
  cuando:function(e){ return e.rolN >= 1 && e.mesPuesto > 4 && e.apuestasCompletadas >= 2; },
  titulo:'Tu diapositiva, el nombre de otro',
  texto:'"¿Viste el deck del QBR? Los números de crecimiento de NUESTRO lanzamiento están en la sección del VP de Ventas. Titulada \'Excelencia comercial\'. Los presenta mañana."',
  opciones:[
    { txt:'Corregirlo en la sala, a mitad de presentación',
      nota:'Públicamente correcto, políticamente radiactivo. Ley 1: nunca opaques al maestro — menos verificándole los datos en vivo.',
      libro:'48laws',
      ef:function(e,log){ e.politico -= 10; e.moral += 6;
        nota(log,'malo','Tuviste razón frente a todos. Él fue humillado frente a todos. Solo una de esas dos cosas se recuerda.','48laws'); } },
    { txt:'Mandarle al directorio los datos completos — antes, "para contexto"',
      nota:'El contragolpe silencioso: para cuando presenta, todos en la sala ya saben de quién es el trabajo. Él nunca se entera cómo.',
      libro:'48laws',
      ef:function(e,log){ e.politico += 8; e.lupa = Math.min(100, e.lupa + 3);
        nota(log,'bueno','Presentó ante una sala de pequeñas sonrisas cómplices. Tu nombre nunca salió. No hacía falta.','48laws'); } },
    { txt:'Dejarlo pasar. El trabajo habla, tarde o temprano',
      nota:'A veces habla. En las organizaciones, "tarde o temprano" suele medirse en ascensos ajenos.',
      libro:'grove',
      ef:function(e,log){ e.moral -= 5;
        nota(log,'neutro','El equipo notó que no peleaste por su crédito. Lo van a recordar en el peor momento posible.','grove'); } }
  ]},

{ id:'cazatalentos', libro:'artofwar', prio:66, quien:'cto',
  cuando:function(e){ return e.mesPuesto > 4 && e.competidor.atencion > 0.2 && e.caja > Motor.burnMensual(e) * 4; },
  titulo:'Su mejor ingeniera está "solo curioseando"',
  texto:'"La arquitecta principal del competidor nos contactó. Quiere hablar. Ella construyó toda su plataforma — llegaría sabiendo todo sobre cómo trabajan. Todo."',
  opciones:[
    { txt:'Contratarla rápido, exprimirle todo',
      nota:'El conocimiento entra por la puerta y la exposición a demandas también. Los secretos comerciales no dejan de ser secretos porque alguien cambió de credencial.',
      libro:'artofwar',
      ef:function(e,log){ Motor.contratar(e,'ing'); e.competidor.fuerza = Math.max(0.2, e.competidor.fuerza - 0.1);
        e.lupa = Math.min(100, e.lupa + 12);
        nota(log,'malo','Dibujó la arquitectura de ellos en tu pizarra en la primera semana. Sus abogados dibujaron algo también: una línea de tiempo.','artofwar'); } },
    { txt:'Contratarla limpia: seis meses de cuarentena, sin interrogatorios',
      nota:'Te llevas el talento y renuncias al botín. Más lento, defendible, y ella te va a respetar por no preguntar.',
      libro:'grove',
      ef:function(e,log){ Motor.contratar(e,'ing'); e.moral += 3;
        nota(log,'bueno','Notó que nunca preguntaste por los internos de ellos. "Por eso vine," dijo.','grove'); } },
    { txt:'Pasar, y avisarle al CTO del competidor que ella se está ofreciendo',
      nota:'La jugada a largo plazo: acabas de depositar un favor con tu enemigo. La calle funciona con deudas como esta.',
      libro:'48laws',
      ef:function(e,log){ e.competidor.atencion = Math.max(0, e.competidor.atencion - 0.15);
        nota(log,'neutro','Su CTO te debe una y lo sabe. En alguna negociación futura, esa llamada está esperando.','48laws'); } }
  ]},

{ id:'favores', libro:'hard', prio:70, quien:'ventas', sectores:['datapol','banco','renov','apuestas','market','chips'],
  cuando:function(e){ return e.mesPuesto > 5 && Motor.compuerta(e,'pragm') < 0.8; },
  titulo:'El fondo comunitario',
  texto:'"Al subsecretario le encantó la demo. Le encantó. También mencionó — dos veces — que el fondo de deportes juveniles del distrito anda corto este año. Dijo que ustedes se entenderían."',
  opciones:[
    { txt:'Financiar la liga infantil',
      nota:'No es un soborno, es filantropía con recibo y guiño. Los fiscales coleccionan recibos.',
      libro:'hard',
      ef:function(e,log){ e.caja -= 35000; e.cobertura.soporte += 8; e.lupa = Math.min(100, e.lupa + 15);
        nota(log,'malo','Los niños consiguieron uniformes, tu expediente se destrabó, y una foto tuya en la ceremonia ahora existe para siempre.','hard'); } },
    { txt:'Ofrecer una alianza pública transparente',
      nota:'La misma plata, por la puerta de adelante, con comunicado de prensa. Magia más lenta, cero vida después de la muerte.',
      libro:'hard',
      ef:function(e,log){ e.caja -= 35000; e.marca += 6;
        nota(log,'bueno','Un programa público con tu logo. El subsecretario fue menos cálido y tus abogados durmieron bien.','hard'); } },
    { txt:'"Nosotros no hacemos eso." Fin de la reunión',
      nota:'Se cierran puertas. Algunas eran puertas que necesitabas. Saber cuáles era todo el juego.',
      libro:'hard',
      ef:function(e,log){ e.politico -= 4; e.marca += 3;
        nota(log,'neutro','La reunión terminó con cortesía y temprano. Ese expediente tuyo encontró el fondo de una pila muy alta.','hard'); } }
  ]},

{ id:'exitintel', libro:'artofwar', prio:68, quien:'estrella',
  cuando:function(e){ return e.mesPuesto > 3 && e.competidor.atencion > 0.15; },
  titulo:'El regalo de despedida',
  texto:'"Mi último día es el viernes. Una cosa antes de irme — entrevisté en el competidor el mes pasado. Todavía tengo el deck de precios que me mostraron. ¿Lo quieres en tu escritorio o en la trituradora?"',
  opciones:[
    { txt:'En el escritorio',
      nota:'Toda su lógica de precios, envuelta para regalo. También: documentada, con fecha y hora, y tuya ahora en todo sentido legal.',
      libro:'artofwar',
      ef:function(e,log){ e.precio = Math.round(e.precio * 1.06); e.lupa = Math.min(100, e.lupa + 10);
        nota(log,'malo','Reajustaste precios con información perfecta. La información perfecta deja rastro de papel.','artofwar'); } },
    { txt:'La trituradora. Y agradécele por preguntar',
      nota:'Lo que el equipo te ve hacer con veneno gratis define lo que te van a traer en el futuro.',
      libro:'grove',
      ef:function(e,log){ e.moral += 4;
        nota(log,'bueno','Triturado sin leer, frente a ellos. La historia viajó por dentro en un día — la versión de ti que cuenta vale más que el deck.','grove'); } }
  ]},

/* ---------------- la zona gris ---------------- */

{ id:'canal', libro:'zero', prio:92, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 3 && e.competidor.atencion > 0.2; },
  titulo:'El sobre',
  texto:'"Un amigo en un fondo me mandó el data room completo del competidor. Roadmap, números, todo. Nadie lo va a saber jamás."',
  opciones:[
    { txt:'Abrirlo. Sería estúpido no hacerlo',
      nota:'La información robada gana interés compuesto: hoy te ahorra un trimestre, mañana alguien recuerda quién te la dio y qué le debes.',
      libro:'zero',
      ef:function(e,log){ e.foco += 8; e.cobertura.core += 5; e.lupa = Math.min(100, e.lupa + 18);
        nota(log,'malo','Leíste todo. Ganaste un trimestre y una deuda que no aparece en ningún balance. La Lupa sube.','zero'); } },
    { txt:'Borrarlo y avisar a legal',
      nota:'Aburrido, correcto, y la única versión de esta historia que no te despierta de noche en dos años.',
      libro:'hard',
      ef:function(e,log){ e.moral += 3;
        nota(log,'bueno','Borrado, con testigos. El día que investiguen a ese fondo, tu nombre no está ahí.','hard'); } },
    { txt:'Devolverlo... después de una miradita a la hoja de precios',
      nota:'No existe mirar un poco. Solo existe haber mirado.',
      libro:'hard',
      ef:function(e,log){ e.foco += 3; e.lupa = Math.min(100, e.lupa + 8);
        nota(log,'neutro','"Solo los precios." Claro. La Lupa sube igual, porque quien lo mandó ahora lo sabe.','hard'); } }
  ]},

{ id:'cocinar', libro:'analytics', prio:108, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 4 && Motor.progresoMandato(e) < (e.mesPuesto / e.meses) * 0.8; },
  titulo:'Los números para la ronda',
  texto:'"Necesito que las cuentas perdidas figuren como \'pausadas\' hasta que cierre la ronda. Todos lo hacen. Es presentación, no fraude."',
  opciones:[
    { txt:'Cocinarlos. Solo hasta que cierre',
      nota:'El primer problema no es que te atrapen: es que el número cocinado se vuelve el número real detrás de tus propias decisiones. Ahora también te mientes a ti.',
      libro:'analytics',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 4; e.lupa = Math.min(100, e.lupa + 25);
        e.evidencia = Math.max(0, e.evidencia - 15); e.politico += 8;
        nota(log,'malo','La ronda cerró sobre números inventados. Entró plata, la Lupa sube 25, y tu evidencia real vale menos: ni tú sabes ya el número verdadero.','analytics'); } },
    { txt:'Negarte, y guardar el correo',
      nota:'Decirle que no al CEO cuesta capital político hoy. Firmar métricas falsas cuesta la carrera entera, con intereses.',
      libro:'hard',
      ef:function(e,log){ e.politico -= 12; e.moral += 4;
        nota(log,'bueno','Dijiste que no, por escrito. El CEO no lo va a olvidar. Los fiscales tampoco — a tu favor.','hard'); } },
    { txt:'Presentar la historia real, bien contada',
      nota:'Una cohorte fea con un plan creíble levanta más plata que un total maquillado, a la mitad del riesgo penal.',
      libro:'analytics',
      ef:function(e,log){ e.politico -= 4; e.evidencia = Math.min(100, e.evidencia + 6);
        nota(log,'bueno','Armaste la versión honesta, con narrativa. Menos brillo, cero juicio.','analytics'); } }
  ]},

{ id:'clubcompradores', libro:'hard', prio:106, quien:'ventas',
  cuando:function(e){ return (e.sectorId === 'biogen' || e.sectorId === 'saludgold') && e.mesPuesto > 5 && Motor.compuerta(e,'pragm') < 0.6; },
  titulo:'El club de los compradores desesperados',
  texto:'"Hay pacientes que no pueden esperar la aprobación. Pagarían lo que sea, fuera del sistema. Un club privado de compradores. La lista ya existe."',
  opciones:[
    { txt:'Armar el club. La regulación es lenta y hay gente muriéndose',
      nota:'Dallas Buyers Club es una gran película porque termina mal Y bien. En tu versión, el final lo escribe el regulador.',
      libro:'hard',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 3; e.marca += 6;
        e.lupa = Math.min(100, e.lupa + 30); e.riesgoExtra = (e.riesgoExtra||0) + 0.1;
        nota(log,'malo','El club funciona y la plata fluye. Tú también fluiste — directo a la lista del regulador. Lupa +30.','hard'); } },
    { txt:'Un programa de acceso compasivo, con papeleo',
      nota:'Existe un instrumento legal para exactamente esto. Es más lento, cubre a menos gente, y no termina con tu nombre en un expediente.',
      libro:'hard',
      ef:function(e,log){ e.marca += 8; e.cobertura.soporte += 6; e.politico += 4;
        nota(log,'bueno','Acceso compasivo aprobado. Menos épico, más pacientes a la larga.','hard'); } },
    { txt:'No. Esperamos la aprobación',
      nota:'Defendible, frío, y alguien va a escribir un hilo furioso sobre tu empresa. Va a tener la mitad de la razón.',
      libro:'lean',
      ef:function(e,log){ e.marca -= 5;
        nota(log,'neutro','Esperas. El hilo furioso salió igual. La aprobación, todavía en ninguna parte.','lean'); } }
  ]},

{ id:'lado', libro:'grove', prio:94, quien:'cto',
  cuando:function(e){ return e.mesPuesto > 4 && (e.ing + e.prod) > 4 && !e.eventosVistos.caza; },
  titulo:'El negocio paralelo',
  texto:'"Descubrí por qué la cuenta de infraestructura no cuadra: tu mejor ingeniera lleva meses corriendo un negocio propio en nuestros servidores."',
  opciones:[
    { txt:'Taparlo a cambio de lealtad total',
      nota:'Ahora tienes una empleada brillante que te debe una y un secreto que trabaja para ella. Los secretos cobran interés.',
      libro:'grove',
      ef:function(e,log){ e.moral -= 4; e.lupa = Math.min(100, e.lupa + 15); e.penalCap = 0; e.foco += 4;
        nota(log,'malo','Trato sellado. Ella entrega como loca, y ahora dos personas en la empresa le mienten al resto.','grove'); } },
    { txt:'Despedirla en el acto, con auditoría completa',
      nota:'Carísimo hoy: pierdes tu mejor cabeza y te comes tres meses de resaca. Barato comparado con explicarle esto a un inversionista en due diligence.',
      libro:'grove',
      ef:function(e,log){ e.penalCap = 10; e.deuda += 6; e.moral += 5;
        nota(log,'bueno','Se fue con un pequeño escándalo. El mensaje al resto del equipo valió cada punto de capacidad.','grove'); } },
    { txt:'Comprar el negocio y meterlo en la empresa',
      nota:'La jugada de Breaking Bad: en vez de matar el negocio turbio, lo pones en el balance. Ahora el problema es oficialmente tuyo.',
      libro:'hard',
      ef:function(e,log){ e.caja -= 80000; e.mrr += 9000; e.lupa = Math.min(100, e.lupa + 10);
        nota(log,'neutro','La empresa ahora tiene una línea de ingresos que nadie puede explicarle al directorio. Lupa +10.','hard'); } }
  ]},

{ id:'wolf', libro:'analytics', prio:90, quien:'ventas', sectores:['banco','apuestas','devtools','datapol','market','strea','ia'],
  cuando:function(e){ return e.mesPuesto > 5 && e.mandatoId === 'crecer' && Motor.progresoMandato(e) < 0.6; },
  titulo:'Usuarios lobo',
  texto:'"Conozco una granja de instalaciones. Diez mil usuarios en dos semanas. El directorio mira el total; no mira de dónde salió."',
  opciones:[
    { txt:'Comprar los usuarios. El mandato es el mandato',
      nota:'Los usuarios comprados no usan, no pagan y no vuelven — pero sí entran al promedio, y pudren cada métrica con la que decides.',
      libro:'analytics',
      ef:function(e,log){
        e.usuarios.innov += e.tam.innov * 0.3; e.usuarios.visio += e.tam.visio * 0.15;
        e.retBonus = (e.retBonus||0) - 0.10; e.lupa = Math.min(100, e.lupa + 15);
        e.evidencia = Math.max(0, e.evidencia - 10);
        nota(log,'malo','El total explotó. La retención colapsó, tu evidencia vale menos y la Lupa sube: los fondos también saben leer cohortes.','analytics'); } },
    { txt:'No. Mostrar el crecimiento real y aguantar la reunión',
      nota:'El número real incómodo envejece bien. El número inflado envejece como leche al sol.',
      libro:'analytics',
      ef:function(e,log){ e.politico -= 6; e.evidencia = Math.min(100, e.evidencia + 5);
        nota(log,'bueno','Reunión dura, métricas limpias. Todavía sabes qué es verdad en tu propia empresa.','analytics'); } }
  ]},

{ id:'socio', libro:'deals', prio:104, quien:'board',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 8 && e.rondas.length > 0; },
  titulo:'El socio fantasma',
  texto:'"Tu cofundador no aparece hace seis meses y tiene el 30%. Los abogados dicen que hay una ventana para diluirlo al 5% antes de la próxima ronda. Es... legal."',
  opciones:[
    { txt:'Ejecutar la dilución. Que la pelee en tribunales',
      nota:'La jugada de Zuckerberg. Funciona, es legal en el papel, y vas a oír la historia recontada en una demanda con descubrimiento de correos incluido.',
      libro:'deals',
      ef:function(e,log){ e.capTable.fund = Math.min(1, e.capTable.fund + 0.12); e.moral -= 10;
        e.marca -= 6; e.lupa = Math.min(100, e.lupa + 10);
        nota(log,'malo','Tienes 12 puntos más de la empresa y una demanda en gestación. El equipo tomó nota de cómo tratas a los socios.','deals'); } },
    { txt:'Comprarle su parte a un precio justo',
      nota:'Más caro hoy, y compra algo que ningún mercado cotiza: que nadie en tu equipo piense que podría ser el próximo.',
      libro:'deals',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e) * 4; e.capTable.fund = Math.min(1, e.capTable.fund + 0.08); e.moral += 4;
        nota(log,'bueno','Salida limpia y firmada. Costó caja; no costó reputación.','deals'); } },
    { txt:'Dejarlo como está. Un socio dormido con 30%',
      nota:'El equity muerto en la cap table asusta a los inversionistas casi tanto como una demanda. Casi.',
      libro:'deals',
      ef:function(e,log){
        nota(log,'neutro','Queda como está. En la próxima ronda, alguien va a preguntar quién es y por qué tiene el 30%.','deals'); } }
  ]},

{ id:'fiscal', libro:'hard', prio:119, quien:'board',
  cuando:function(e){ return e.lupa >= 55 && !e.eventosVistos.allanamiento; },
  titulo:'El fiscal quiere hablar',
  texto:'"Extraoficialmente: tienen un expediente sobre la empresa. Oficialmente: el que coopere ahora sale limpio. La reunión es mañana."',
  opciones:[
    { txt:'Cooperar y entregar lo que sabes',
      nota:'Tú sales limpio. La empresa, el equipo y tu nombre en la industria absorben el golpe. Los tratos con fiscales son exactamente eso: tratos.',
      libro:'hard',
      ef:function(e,log){ e.lupa = e.lupaBase + 20; e.politico -= 25; e.moral -= 12; e.marca -= 10;
        nota(log,'neutro','Cooperaste. La Lupa baja, pero ese expediente nunca se cierra del todo. Nadie en la oficina te sostiene la mirada ya.','hard'); } },
    { txt:'Abogados caros y silencio',
      nota:'La defensa clásica: costosa, lenta, y a veces funciona. La Lupa no baja; la cuenta sube.',
      libro:'hard',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e) * 2; e.infraExtra = (e.infraExtra||0) + 15000;
        nota(log,'neutro','Los abogados facturan cada mes y el expediente sigue abierto. Al menos nadie habló.','hard'); } },
    { txt:'Limpiar la casa de verdad: cortar todo lo gris, ya',
      nota:'La única salida que arregla el caso Y la causa del caso. Cuesta crecimiento hoy.',
      libro:'grove',
      ef:function(e,log){ e.lupa = Math.max(e.lupaBase, e.lupa - 30); e.gtmBonus = -0.3; e.foco += 5;
        nota(log,'bueno','Cortaste todo lo que no sobreviviría una inspección. Creces menos este trimestre y duermes de noche.','grove'); } }
  ]},

{ id:'allanamiento', libro:'hard', prio:130, quien:'cto',
  cuando:function(e){ return e.lupa >= 85; },
  titulo:'Están abajo',
  texto:'"Hay seis personas con carpetas en el lobby y una orden judicial. Están clonando los servidores. Ahora mismo."',
  opciones:[
    { txt:'Cooperar del todo y llamar a los abogados',
      nota:'Cuando llegan con una orden, el juego de esconderse ya terminó. La única jugada que queda es la dignidad procesal.',
      libro:'hard',
      ef:function(e,log){
        if (e.cobertura.segur >= 55 && Math.random() < 0.6) {
          e.lupa = e.lupaBase + 10; e.zafo = true; e.marca -= 8;
          nota(log,'bueno','Se llevaron todo y no encontraron nada que no sobreviviera un juicio. Zafaste. Esta vez.','hard');
        } else {
          e.imputado = true;
          nota(log,'malo','Encontraron lo que había que encontrar. Hay una imputación, y tu nombre está en ella.','hard');
        }
      } },
    { txt:'"Borra lo que sepas borrar." Ya. Ahora mismo',
      nota:'Obstrucción: el único delito que se comete frente a los testigos que vinieron a buscarlo.',
      libro:'hard',
      ef:function(e,log){
        if (Math.random() < 0.25) {
          e.lupa = 70; e.zafo = true;
          nota(log,'malo','Increíblemente, funcionó. Ahora vives con eso.','hard');
        } else {
          e.imputado = true;
          nota(log,'malo','Vieron todo. La obstrucción se sumó al cargo original. El final.','hard');
        }
      } }
  ]},

{ id:'whale', libro:'analytics', prio:98, quien:'ventas',
  cuando:function(e){ return e.sectorId === 'apuestas' && e.mesPuesto > 3; },
  titulo:'La ballena',
  texto:'"Nuestro VIP número uno perdió una fortuna este mes. Dice que si no le devolvemos la mitad, le cuenta a un periódico cómo lo tratamos: los bonos, las notificaciones a las 3 AM, los límites que nunca aplicamos."',
  opciones:[
    { txt:'Devolverle la mitad y mantenerlo jugando',
      nota:'Le estás pagando para que siga siendo el problema. Las ballenas no se van: se hunden, y hacen olas.',
      libro:'analytics',
      ef:function(e,log){ e.caja -= Math.max(40000, e.mrr * 0.8); e.lupa = Math.min(100, e.lupa + 8);
        nota(log,'malo','Pagaste. Va a perder de nuevo, va a amenazar de nuevo, y ahora sabe que funciona.','analytics'); } },
    { txt:'Vetarlo y aplicar la autoexclusión que nunca aplicaste',
      nota:'Pierdes tu mejor cuenta y la historia que puede contar empeora... salvo que los controles por fin sean reales.',
      libro:'sre',
      ef:function(e,log){ e.mrr = Math.round(e.mrr * 0.93); e.marca += 4; e.cobertura.segur += 6;
        nota(log,'bueno','Vetado, por protocolo y por escrito. Perdiste ingresos y compraste un argumento de defensa.','sre'); } },
    { txt:'Que hable con el periódico. ¿Qué van a publicar — que apostó?',
      nota:'Van a publicar exactamente eso, con capturas de tus notificaciones de las 3 AM. Y el regulador lee ese periódico.',
      libro:'hard',
      ef:function(e,log){ e.marca -= 15; e.lupa = Math.min(100, e.lupa + 20);
        nota(log,'malo','La historia salió, capturas incluidas. La Lupa sube 20 y el titular te lo van a leer en voz alta en la próxima ronda.','hard'); } }
  ]},

{ id:'imperio', libro:'hard', prio:102, quien:'board',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 12 && e.mrr > Motor.burnMensual(e); },
  titulo:'¿Cuánto es suficiente?',
  texto:'"Hay un fondo listo para comprar el 15% de TUS acciones, a ti, hoy, en efectivo. Puedes asegurar tu vida entera y seguir de fundador. ¿O esto ya no es por la plata?"',
  opciones:[
    { txt:'Vender el 15%. La familia primero',
      nota:'La secundaria del fundador es la herramienta más subestimada de la industria: jugar sin el miedo a quebrar te hace mejor, no peor.',
      libro:'hard',
      ef:function(e,log){ var venta = e.valoracion * 0.15 * e.capTable.fund * 0.85;
        e.capTable.fund *= 0.85; e.ventaSecundaria = (e.ventaSecundaria||0) + venta;
        nota(log,'bueno','Vendiste un pedazo de tu propia participación con descuento. Menos empresa, cero miedo. Se nota en cómo decides.','hard'); } },
    { txt:'No. Estoy en el negocio de los imperios',
      nota:'Esa frase es de Walter White, y a él no le terminó bien. Algunos lo logran. Vas a descubrir cuál de los dos eres.',
      libro:'hard',
      ef:function(e,log){ e.foco += 6; e.moral -= 3;
        nota(log,'neutro','Todo o nada, entonces. El directorio anotó la frase para citarla después, gane quien gane.','hard'); } }
  ]},

/* El primer dilema con probabilidad visible: cada opción muestra su % de
   antemano y el resultado se juega en el momento, no está escrito de
   antemano como en el resto de EVENTOS. `ok`/`ko` son cada uno un
   {nota,libro,ef} — el mismo shape que ya usa `op` en cualquier evento
   viejo, así que mostrarEvento()/elegirOpcion() tratan uno y otro sin
   distinguirlos salvo por la barra de %. */
{ id:'comite', libro:'hard', prio:82, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 1 && Object.keys(e.enVuelo || {}).length > 0; },
  titulo:'El CEO quiere la API pública para el demo del board',
  texto:'Faltan tres semanas para la reunión de inversionistas. El CEO entra a tu 1:1 con una idea: mostrar una API pública "aunque sea de mentira". Tu equipo está a mitad de una iniciativa que mueve tu mandato. Decir que no cuesta capital político; decir que sí cuesta el mes.',
  opciones:[
    { txt:'Sostenés el plan y le mostrás los números', prob:65,
      ok:{ libro:'hard',
        nota:'Le mostraste la barra de tu mandato y de dónde sale. Aceptó a regañadientes: el demo va con lo que ya estaba en curso.',
        ef:function(e,log){ e.politico -= 4; e.usabilidad = Math.min(100, e.usabilidad + 1.2);
          nota(log,'bueno','El CEO se bajó del pedido. El plan sigue intacto.','hard'); } },
      ko:{ libro:'hard',
        nota:'"Los números no ganan boards", te dijo. Lo llevó él mismo — sin vos en la sala.',
        ef:function(e,log){ e.politico -= 10;
          nota(log,'malo','No lo compraste a tiempo. Ahora el board escuchó su versión, no la tuya.','hard'); } } },
    { txt:'Armás una demo de humo en una semana', prob:45,
      ok:{ libro:'hard',
        nota:'La demo salió redonda. Nadie preguntó qué había atrás.',
        ef:function(e,log){ e.politico += 3; e.deuda = Math.min(100, e.deuda + 3);
          nota(log,'bueno','El board se fue conforme. Ganaste tres semanas sin tocar el roadmap real — a cuenta de deuda técnica.','hard'); } },
      ko:{ libro:'hard',
        nota:'La demo falló en vivo. El board lo tomó con humor; el equipo no.',
        ef:function(e,log){ e.politico -= 2; e.usabilidad = Math.max(0, e.usabilidad - 1.8); e.moral -= 4;
          nota(log,'malo','Perdiste una semana de la iniciativa real, y el equipo se enteró por qué.','hard'); } } },
    { txt:'Le pedís que lo lleve él al board', prob:30,
      ok:{ libro:'hard',
        nota:'Lo llevó, y por una vez el board se lo compró sin vos en el medio.',
        ef:function(e,log){ e.politico -= 2;
          nota(log,'bueno','Ganaste el mes. El CEO se guardó el crédito, pero el plan no se movió.','hard'); } },
      ko:{ libro:'hard',
        nota:'Lo llevó. Y dijo que producto "no tenía tiempo". Desde entonces te enterás de las prioridades por Slack.',
        ef:function(e,log){ e.politico -= 9;
          nota(log,'malo','Delegar hacia arriba salió caro: perdiste la silla aunque conservás el título.','hard'); } } }
  ]}
];

/* Dilemas que honestamente pueden repetirse entre puestos: son situacionales,
   no lecciones de una sola vez. Todo lo demás se despriorizará fuerte una vez
   que lo viviste en una empresa anterior. */
/* topes por carrera: los evergreen conversacionales tienen pocas apariciones;
   los situacionales (incidentes, el fiscal, allanamientos) siguen sin límite */
var EVERGREEN = { okr:3, roadmap:2, discovery:3, errorbudget:99, escala:99, recruiter:2,
                  fiscal:99, allanamiento:99, ronda:99, caza:2, despidos:99 };

function eventoAplicable(e, c) {
  var cand = [], i;
  var vistosCarrera = (c && c.dilemasVistos) || {};
  for (i = 0; i < EVENTOS.length; i++) {
    var ev = EVENTOS[i];
    if (e.eventosVistos[ev.id]) continue;
    if (ev.sectores && ev.sectores.indexOf(e.sectorId) < 0) continue;
    var repes = vistosCarrera[ev.id] || 0;
    /* las lecciones de una vez no se repiten; las que tienen variantes pueden
       volver una vez con otra escena; las situacionales (evergreen) siempre
       pueden volver */
    var tope = EVERGREEN[ev.id] || (ev.variantes ? 2 : 1);
    if (repes >= tope) continue;
    var ok = false;
    try { ok = ev.cuando(e); } catch (err) { ok = false; }
    if (ok) cand.push({ ev:ev, prio:ev.prio - repes * 45 + Math.random() * 18 });
  }
  if (!cand.length) return null;
  cand.sort(function(a,b){ return b.prio - a.prio; });

  /* Los dilemas son OCASIONALES, no un impuesto mensual. Los críticos
     (prio >= 100: allanamientos, congelamientos por presupuesto de error, la
     llamada inicial de entrevistas) siempre disparan. El resto respeta un
     enfriamiento: raro justo después de uno, probable tras unos meses
     tranquilos. Las decisiones pegan más fuerte cuando no son rutina. */
  var elegido = cand[0];
  if (elegido.ev.prio < 100) {
    var desde = e.mesPuesto - (e.ultimoDilema === undefined ? -9 : e.ultimoDilema);
    var prob = desde >= 3 ? 0.65 : desde === 2 ? 0.4 : 0.15;
    if (Math.random() > prob) return null;
  }
  e.ultimoDilema = e.mesPuesto;
  return elegido.ev;
}

/* Variantes con sabor a empresa: el mismo dilema, otra escena, para que el
   puesto 2 nunca se lea como el puesto 1. Se elige de forma determinista a
   partir del id de la empresa. */
function eventoTexto(ev, e) {
  if (!ev.variantes || !ev.variantes.length) return { titulo:ev.titulo, texto:ev.texto };
  var h = 0, s = (e.empresaId || '') + ev.id, i;
  for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  var idx = h % (ev.variantes.length + 1);
  if (idx === 0) return { titulo:ev.titulo, texto:ev.texto };
  return ev.variantes[idx - 1];
}

/* ---------------------------------------------------------------
   CONTINGENCIAS
   Trabajo que no elegiste y que no mueve tu mandato ni un punto. Llega solo,
   ocupa un slot desde el día que aparece, y tiene fecha de vencimiento. Es la
   razón número uno por la que un roadmap real se atrasa: el mes nunca es tuyo
   entero, y la parte que no es tuya hay que hacerla igual.

   Se construyen con la misma maquinaria que las apuestas — puntos, slots,
   progreso — y por eso compiten con ellas en la misma moneda y en el mismo
   lugar de la pantalla. La diferencia es que entregarlas no te paga nada:
   solo evita el castigo.

   costo:   en la escala de APUESTAS.costo; se normaliza a tu capacidad igual.
   plazo:   meses hasta que vence, contando el mes en que aparece.
   cuando:  condición mínima para que tenga sentido en esta empresa.
   castigo: lo que pasa si el plazo se agota sin entregarla.
   --------------------------------------------------------------- */
var CONTINGENCIAS = [

  { id:'c_deprecacion', costo:13, plazo:3, libro:'ddia',
    n:'Migración forzada: deprecaron la API que usamos',
    d:'El proveedor apaga la versión vieja. La fecha no la ponemos nosotros.',
    d2:'Noventa días de aviso, de los cuales sesenta ya pasaron cuando alguien lo leyó. No hay versión de esto en la que negociemos la fecha.',
    cuando:function(e){ return e.mesPuesto > 1; },
    castigo:function(e,log){
      var i; for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.93;
      e.fiabPercibida = Math.max(0, e.fiabPercibida - 14);
      nota(log,'malo','Se apagó la API vieja con nosotros todavía encima. La mitad de las integraciones dejó de responder anoche.','ddia');
    } },

  { id:'c_soc2', costo:16, plazo:4, libro:'trap',
    n:'La auditoría que pide el cliente grande',
    d:'Sin el certificado no firman. Y ya lo anunciamos internamente.',
    d2:'Controles de acceso, registro de cambios, política de retención, evidencia de todo eso durante un trimestre. Nada de esto se le ve al usuario.',
    cuando:function(e){ return e.etapa === 'serieB' || e.etapa === 'serieC'; },
    castigo:function(e,log){
      e.mrr = Math.round(e.mrr * 0.88);
      e.usuarios.pragm *= 0.9;
      e.marca = Math.max(0, e.marca - 6);
      nota(log,'malo','El contrato grande se cayó en la última revisión de seguridad. No fue el precio ni el producto: fue una carpeta que no existía.','trap');
    } },

  { id:'c_borrado', costo:10, plazo:2, libro:'hard',
    n:'Legal pide el borrado de datos de un mercado',
    d:'Cambió la norma. Tenemos datos que ya no podemos tener.',
    d2:'Hay que encontrarlos en producción, en los respaldos y en el almacén analítico, borrarlos, y poder demostrar que se borraron.',
    cuando:function(e){ return (e.cobertura.datos || 0) > 25; },
    castigo:function(e,log){
      var multa = Math.round(Motor.burnMensual(e) * 1.4);
      e.caja -= multa;
      e.lupa = Math.min(100, e.lupa + 14);
      nota(log,'malo','Venció el plazo del regulador con los datos todavía adentro. Multa de ' + Math.round(multa/1000) + 'k y una carpeta con nuestro nombre que ahora queda abierta.','hard');
    } },

  { id:'c_regresion', costo:8, plazo:2, libro:'accelerate',
    n:'Una regresión de rendimiento que nadie ubica',
    d:'Todo tarda el triple desde hace tres semanas. Nadie sabe desde qué cambio.',
    d2:'No es una caída, que sería más fácil: es lento. La gente no se queja, se va.',
    cuando:function(e){ return e.mesPuesto > 2 && e.deuda > 30; },
    castigo:function(e,log){
      e.retBonus = (e.retBonus || 0) - 0.02;
      e.fiabPercibida = Math.max(0, e.fiabPercibida - 10);
      e.deuda = Math.min(100, e.deuda + 8);
      nota(log,'malo','La lentitud se volvió el estado normal del producto. Ya nadie la reporta como un problema, que es exactamente el problema.','accelerate');
    } },

  { id:'c_basedatos', costo:18, plazo:3, libro:'ddia',
    n:'La base de datos llegó a su techo',
    d:'Escribe al límite. La próxima campaña la tumba.',
    d2:'Particionar, mover el histórico, reescribir las tres consultas que nadie quiere tocar. Un mes de trabajo que el usuario jamás va a notar.',
    cuando:function(e){ return Motor.carga(e) > 0.55; },
    castigo:function(e,log){
      e.riesgoExtra = (e.riesgoExtra || 0) + 0.45;
      e.penalCap = (e.penalCap || 0) + 10;
      nota(log,'malo','La base se cayó bajo carga, como estaba anunciado. Ahora el mismo trabajo hay que hacerlo, pero de urgencia y con todos mirando.','ddia');
    } },

  { id:'c_cve', costo:9, plazo:2, libro:'sre',
    n:'Una vulnerabilidad crítica en una dependencia',
    d:'Está en todos lados y tiene puntaje 9.8.',
    d2:'La librería quedó sin mantenedor hace dos años. Actualizar rompe cuatro cosas; no actualizar rompe una sola, pero grande.',
    cuando:function(e){ return e.mesPuesto > 1; },
    castigo:function(e,log){
      e.lupa = Math.min(100, e.lupa + 10);
      e.riesgoExtra = (e.riesgoExtra || 0) + 0.3;
      e.marca = Math.max(0, e.marca - 7);
      nota(log,'malo','Alguien la explotó antes que nosotros la tapáramos. La nota se escribió sola: era pública, tenía parche, y llevaba dos meses ahí.','sre');
    } },

  { id:'c_pagos', costo:11, plazo:2, libro:'hard',
    n:'El proveedor de pagos nos reclasificó',
    d:'Nos subieron a categoría de riesgo. Hay que migrar o retener fondos.',
    d2:'Otro procesador, otra integración, otra certificación. Mientras tanto cobran igual y liquidan a sesenta días.',
    cuando:function(e){ return e.mrr > 20000; },
    castigo:function(e,log){
      e.caja -= Math.round(e.mrr * 1.5);
      nota(log,'malo','Nos retuvieron la liquidación de dos meses. El dinero existe, está facturado, y no lo tenemos.','hard');
    } },

  { id:'c_accesibilidad', costo:12, plazo:3, libro:'krug',
    n:'Una demanda por accesibilidad',
    d:'Un usuario con lector de pantalla no puede completar el registro.',
    d2:'Tiene razón, y lo probó con video. La parte cara no es arreglarlo: es que hay que arreglarlo en todas las pantallas, no en esa.',
    cuando:function(e){ return e.mesPuesto > 2 && Motor.usuarios(e) > 900; },
    castigo:function(e,log){
      var multa = Math.round(Motor.burnMensual(e) * 0.9);
      e.caja -= multa;
      e.marca = Math.max(0, e.marca - 10);
      nota(log,'malo','El acuerdo salió ' + Math.round(multa/1000) + 'k y una orden de arreglarlo igual, ahora con fecha impuesta por un juez.','krug');
    } },

  { id:'c_fuga', costo:14, plazo:3, libro:'trap',
    n:'La cuenta más grande puso fecha',
    d:'Renuevan en noventa días. Traen una lista de once puntos.',
    d2:'Nueve de los once son razonables y ninguno le sirve a nadie más. La alternativa es explicarle al directorio por qué se fue el logo del sitio.',
    cuando:function(e){ return e.mrr > Motor.burnMensual(e) * 0.25; },
    castigo:function(e,log){
      e.mrr = Math.round(e.mrr * 0.82);
      e.usuarios.pragm *= 0.86;
      e.politico -= 8;
      nota(log,'malo','No renovaron. Se llevaron el logo, el caso de éxito y la referencia que usábamos para vender.','trap');
    } },

  { id:'c_postmortem', costo:7, plazo:2, libro:'sre',
    n:'El postmortem con acciones que nadie tomó',
    d:'Mismo incidente, tercera vez. Las tareas siguen abiertas desde febrero.',
    d2:'El documento está impecable. Es lo único que se hizo.',
    cuando:function(e){ return e.incidentesPuesto >= 1; },
    castigo:function(e,log){
      e.riesgoExtra = (e.riesgoExtra || 0) + 0.5;
      e.moral = Math.max(0, e.moral - 8);
      nota(log,'malo','Volvió a pasar, por cuarta vez, por la misma causa. El equipo ya ni escribe el documento.','sre');
    } },

  { id:'c_impuestos', costo:10, plazo:2, libro:'hard', sectores:['banco','market','apuestas','strea'],
    n:'Cambió el régimen de facturación',
    d:'Emitimos mal desde que empezó el trimestre.',
    d2:'Retenciones nuevas, otro formato, otra periodicidad. Corregir hacia atrás es la mitad del trabajo.',
    cuando:function(e){ return e.mrr > 8000; },
    castigo:function(e,log){
      var multa = Math.round(Motor.burnMensual(e) * 1.1);
      e.caja -= multa;
      e.lupa = Math.min(100, e.lupa + 12);
      nota(log,'malo','La inspección encontró un trimestre entero mal emitido. ' + Math.round(multa/1000) + 'k y la obligación de rehacerlo igual.','hard');
    } },

  { id:'c_licencia', costo:17, plazo:3, libro:'hard', sectores:['banco','apuestas','saludgold','biogen'],
    n:'Renovación de la licencia para operar',
    d:'Vence. Sin ella no hay producto, hay una web bonita.',
    d2:'Capital mínimo, oficial de cumplimiento, manual de procedimientos y una entrevista donde alguien va a preguntar cosas que deberíamos saber.',
    cuando:function(e){ return e.mesPuesto > 2; },
    castigo:function(e,log){
      e.lupa = Math.min(100, e.lupa + 25);
      e.caja -= Math.round(Motor.burnMensual(e) * 2);
      var i; for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.8;
      e.politico -= 12;
      nota(log,'malo','Operamos un mes con la licencia vencida antes de que alguien de afuera lo notara. Ese mes ahora es un expediente.','hard');
    } },

  { id:'c_modelo', costo:12, plazo:2, libro:'zero', sectores:['ia','biogen','datapol'],
    n:'El proveedor del modelo cambió los términos',
    d:'Cuadruplicaron el precio y prohibieron nuestro caso de uso.',
    d2:'O migramos a otro modelo y revalidamos todo, o servimos el nuestro y nos comemos la infraestructura.',
    cuando:function(e){ return e.mesPuesto > 1; },
    castigo:function(e,log){
      e.infraExtra = (e.infraExtra || 0) + Math.round(Motor.burnMensual(e) * 0.22);
      e.moral = Math.max(0, e.moral - 5);
      nota(log,'malo','Nos aplicaron la tarifa nueva sin migrar. El costo de infraestructura subió y ya no baja.','zero');
    } },

  { id:'c_respin', costo:20, plazo:3, libro:'ddia', sectores:['chips','renov'],
    n:'El lote volvió con fallas',
    d:'Rinde el sesenta por ciento de lo especificado. El cliente ya lo sabe.',
    d2:'Hay que aislar la causa, rehacer la máscara y esperar la corrida. El calendario no se comprime con ganas.',
    cuando:function(e){ return e.mesPuesto > 2; },
    castigo:function(e,log){
      e.caja -= Math.round(Motor.burnMensual(e) * 1.8);
      e.marca = Math.max(0, e.marca - 12);
      e.usuarios.visio *= 0.85;
      nota(log,'malo','Salió el lote fallado igual. Volvió entero, y con él la reputación de que acá se entrega lo que sea.','ddia');
    } },

  { id:'c_derechos', costo:13, plazo:2, libro:'trap', sectores:['strea','market','saludgold'],
    n:'Vence el contrato con el proveedor clave',
    d:'Renegocian al doble, o se llevan el catálogo el día 30.',
    d2:'Todo lo que la gente viene a buscar acá es de ellos. Reemplazarlo lleva más de un mes y se nota desde el primer día.',
    cuando:function(e){ return Motor.usuarios(e) > 1200; },
    castigo:function(e,log){
      var i; for (i = 0; i < SEGMENTOS.length; i++) e.usuarios[SEGMENTOS[i].id] *= 0.85;
      e.retBonus = (e.retBonus || 0) - 0.025;
      nota(log,'malo','Se llevaron el catálogo el día 30, como avisaron. La gente entró, no encontró lo que venía a buscar, y aprendió el camino de vuelta.','trap');
    } },

  { id:'c_ensayo', costo:19, plazo:3, libro:'lean', sectores:['biogen','saludgold'],
    n:'El regulador pidió más datos',
    d:'El brazo de control no le alcanza. Sin eso no hay revisión.',
    d2:'Otro protocolo, otro comité de ética, otro reclutamiento. Todo lo que viene después depende de esto y de nada más.',
    cuando:function(e){ return e.mesPuesto > 2; },
    castigo:function(e,log){
      e.caja -= Math.round(Motor.burnMensual(e) * 1.5);
      e.politico -= 10;
      e.marca = Math.max(0, e.marca - 8);
      nota(log,'malo','La revisión se cayó por expediente incompleto. Volvemos a la fila, doce meses atrás, con la caja de hoy.','lean');
    } },

  { id:'c_ciberseguro', costo:11, plazo:2, libro:'sre', sectores:['ciber','banco','datapol','saludgold'],
    n:'La aseguradora exige controles',
    d:'Sin doble factor en todo, no hay póliza. Y sin póliza no hay contratos.',
    d2:'Inventario de accesos, rotación de credenciales, segundo factor obligatorio para todos, incluido el que va a odiarlo más.',
    cuando:function(e){ return e.etapa !== 'semilla'; },
    castigo:function(e,log){
      e.lupa = Math.min(100, e.lupa + 8);
      e.mrr = Math.round(e.mrr * 0.92);
      e.riesgoExtra = (e.riesgoExtra || 0) + 0.35;
      nota(log,'malo','Se cayó la póliza. Tres clientes tenían cláusula de seguro vigente y ya lo están revisando con sus abogados.','sre');
    } }
];

function contingenciaPorId(id) {
  for (var i = 0; i < CONTINGENCIAS.length; i++) if (CONTINGENCIAS[i].id === id) return CONTINGENCIAS[i];
  return null;
}


/* ---------------------------------------------------------------
   EL VISTO BUENO
   Tu trabajo no lo frena la ingeniería: lo frena una persona que no contesta.
   Cada necesidad pasa por un guardián distinto y cada guardián tiene su propia
   razón, que casi siempre es razonable. Mientras espera, la iniciativa ocupa su
   slot y no avanza un punto — se destraba sola con el tiempo, o la escalás y lo
   pagás con capital político.
   --------------------------------------------------------------- */
var VISTOS = {
  core:    { quien:'ceo',
             txt:'quiere verlo antes de que salga. No confía en la demo grabada.' },
  flujo:   { quien:'ceo',
             txt:'vio una versión en una conferencia y ahora tiene opiniones sobre el primer paso.' },
  datos:   { quien:'legal',
             txt:'pregunta qué se guarda, por cuánto tiempo y quién puede leerlo. Todavía no hay respuesta escrita.' },
  segur:   { quien:'legal',
             txt:'no firma sin una revisión completa. Es su trabajo y tiene razón.' },
  integra: { quien:'socio',
             txt:'tiene su propio calendario de releases y no coincide con el tuyo.' },
  soporte: { quien:'ventas',
             txt:'ya lo prometió distinto a tres cuentas y quiere que salga como él lo vendió.' },
  escala:  { quien:'cto',
             txt:'quiere pasarlo por revisión de arquitectura antes de que toque producción.' }
};

function vistoDe(nec) { return VISTOS[nec] || VISTOS.core; }
