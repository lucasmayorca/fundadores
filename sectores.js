/* Sectores, empresas, escalafón y mandatos. ES5 estricto (Safari 9).
   Un sector define la física del mercado; una empresa define la etapa y la
   cultura; el escalafón define qué palancas te dejan tocar. */

/* ---------------- ESCALAFÓN ----------------
   mando: qué fracción de la capacidad del área respondés vos.
   palancas: qué buckets podés mover. El juego se abre a medida que subís. */
var ESCALAFON = [
  { n:0, rol:'Analista de Producto', corto:'APM', mando:0.12, sueldo:62000,
    palancas:['cons'],
    nota:'Ejecutás. Mirás mucho, decidís poco.' },
  { n:1, rol:'Product Manager', corto:'PM', mando:0.20, sueldo:98000,
    palancas:['desc','cons'],
    nota:'Ya elegís qué se construye en tu pedazo.' },
  { n:2, rol:'Senior PM', corto:'Sr PM', mando:0.32, sueldo:135000,
    palancas:['desc','cons','plat'],
    nota:'Podés defender inversión en plataforma. Te va a costar político.' },
  { n:3, rol:'Group PM', corto:'GPM', mando:0.46, sueldo:172000,
    palancas:['desc','cons','plat','fiab'],
    nota:'Varios equipos. Empezás a negociar fiabilidad contra velocidad.' },
  { n:4, rol:'Director de Producto', corto:'Dir', mando:0.62, sueldo:215000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'Tenés presupuesto de crecimiento y podés contratar.' },
  { n:5, rol:'VP de Producto', corto:'VP', mando:0.80, sueldo:275000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'Definís la estrategia del área y el precio.' },
  { n:6, rol:'CPO', corto:'CPO', mando:0.92, sueldo:340000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'Respondés al directorio. Casi todo es tuyo.' },
  { n:7, rol:'Fundador/a', corto:'Fund', mando:1.0, sueldo:70000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'Sueldo malo, cap table propia. Se abre la mesa de inversión.' }
];

function nivelPorN(n) { return ESCALAFON[Math.max(0, Math.min(ESCALAFON.length - 1, n))]; }

/* ---------------- SECTORES ----------------
   escala/precio/viral/cac deforman el mercado. La compuerta es lo que frena
   al mercado grande: en cada sector se llama distinto y pide otra cosa. */
var SECTORES = [

{ id:'datapol', nombre:'Datos y opinión pública', corto:'Política',
  desc:'Encuestas continuas, segmentación y escucha social para campañas y gobiernos. El cliente cambia cada elección; tu reputación no.',
  precio:850, escala:0.2, viral:0.6, cac:0.7, competidor:0.6, capex:15000,
  eje:'Acá un solo escándalo vale más que cien features.',
  gate:'Auditoría de transparencia',
  gateReqs:[['segur',60],['datos',60],['soporte',45]],
  incidente:'escandalo', retMod:0.02,
  apuestas:['padron','microseg','transparencia','simulador'] },

{ id:'biogen', nombre:'Biogenética aplicada', corto:'Biogen',
  desc:'Diseño de proteínas y terapias a medida. Cada experimento tarda meses y el regulador mira cada paso.',
  precio:6500, escala:0.02, viral:0.12, cac:0.3, competidor:0.55, capex:220000,
  eje:'La biología no compila más rápido porque tengas apuro.',
  gate:'Validación regulatoria y bioseguridad',
  gateReqs:[['segur',70],['datos',65],['soporte',55]],
  incidente:'clinico', retMod:0.12,
  apuestas:['plegado','sintesis','bioseg','patentes'] },

{ id:'banco', nombre:'Banco digital', corto:'Banco',
  desc:'Cuenta, tarjeta y crédito sin sucursales. Mercado enorme, margen finito y el regulador en la nuca.',
  precio:18, escala:9, viral:2.0, cac:1.6, competidor:0.7, capex:40000,
  eje:'El abismo acá tiene forma de licencia.',
  gate:'Licencia y control de fraude',
  gateReqs:[['segur',70],['soporte',60],['datos',50]],
  incidente:'fraude', retMod:0.10,
  apuestas:['licencia','antifraude','adelanto','conciliar'] },

{ id:'renov', nombre:'Energía renovable distribuida', corto:'Energía',
  desc:'Generación y almacenamiento en el techo del cliente, software decidiendo cuándo comprar y cuándo vender.',
  precio:75, escala:0.9, viral:0.7, cac:0.9, competidor:0.45, capex:55000,
  eje:'Si no podés probar el ahorro, no hay producto.',
  gate:'Prueba verificable del ahorro',
  gateReqs:[['datos',65],['integra',55],['soporte',45]],
  incidente:'infra', retMod:0.07,
  apuestas:['sensor','verificacion','despacho','tarifas'] },

{ id:'devtools', nombre:'Herramientas para equipos técnicos', corto:'Devtools',
  desc:'Lo adoptan de abajo hacia arriba. Te aman gratis y cuesta muchísimo cobrarles.',
  precio:45, escala:1.6, viral:2.2, cac:1.8, competidor:0.5, capex:0,
  eje:'Adopción no es ingreso. Son dos embudos distintos.',
  gate:'Compra del área, no del individuo',
  gateReqs:[['integra',55],['segur',50],['datos',50]],
  incidente:'infra', retMod:0.05,
  apuestas:['cli','plantillas2','panel','openq'] },

{ id:'apuestas', nombre:'Apuestas y juego online', corto:'Gambling',
  desc:'Casino y apuestas deportivas. Márgenes de sueño, retención de pesadilla moral y un regulador que ya te tiene en la agenda.',
  precio:55, escala:5, viral:2.4, cac:1.4, competidor:0.65, capex:25000,
  eje:'La banca siempre gana. La pregunta es cuánto te deja ganar el regulador.',
  gate:'Licencia de juego y controles de adicción',
  gateReqs:[['segur',65],['datos',55],['soporte',50]],
  incidente:'granwin', retMod:0.12,
  apuestas:['cuotas','vip','autoexclusion','pagos'] },

{ id:'saludgold', nombre:'Salud premium', corto:'Salud Gold',
  desc:'Medicina concierge y longevidad para el segmento de mayores ingresos. Pagan mucho, perdonan nada.',
  precio:320, escala:0.6, viral:0.9, cac:0.8, competidor:0.5, capex:30000,
  eje:'Tu cliente puede pagar cualquier cosa. Incluida la competencia.',
  gate:'Confianza médica y servicio impecable',
  gateReqs:[['soporte',65],['segur',60],['datos',50]],
  incidente:'clinico', retMod:0.10,
  apuestas:['concierge','longevidad','vipapp','redmedica'] }
];

function sectorPorId(id) {
  for (var i = 0; i < SECTORES.length; i++) if (SECTORES[i].id === id) return SECTORES[i];
  return null;
}

/* ---------------- ETAPAS ----------------
   Definen con qué te encontrás el día uno. */
var ETAPAS = {
  semilla: { nombre:'Semilla', techo:22,
             fase:'Pre-product-market fit', faseCorta:'PRE-PMF',
             objetivo:'Encontrar un problema que arda y la soluci\u00f3n que lo apague. Nada m\u00e1s importa todav\u00eda.',
             prima:['core','flujo'], castiga:['escala','segur'], caja:1400000,  ing:4,  prod:1,  gtm:1,  deuda:14, arq:18, usab:32,
             usuariosBase:0.004, valoracion:9000000,  equity:[0.6, 1.8], caos:1.35 },
  serieA:  { nombre:'Serie A',  techo:30,
             fase:'Validando el product-market fit', faseCorta:'VALIDANDO PMF',
             objetivo:'Probar que vuelven solos: retenci\u00f3n que no se cae e ingresos que se repiten.',
             prima:['flujo','datos'], castiga:['escala'], caja:6000000, ing:11, prod:3,  gtm:3,  deuda:32, arq:34, usab:44,
             usuariosBase:0.02,  valoracion:38000000, equity:[0.15, 0.5], caos:1.15 },
  serieB:  { nombre:'Serie B',  techo:40,
             fase:'Escalando', faseCorta:'ESCALANDO',
             objetivo:'Convertir lo que funciona en una m\u00e1quina: abrir el mercado grande sin que nada se caiga.',
             prima:['integra','soporte','segur','escala'], castiga:[], caja:22000000,ing:26, prod:8,  gtm:11, deuda:47, arq:52, usab:55,
             usuariosBase:0.07,  valoracion:130000000,equity:[0.04, 0.14],caos:1.0 }
};

/* ---------------- EMPRESAS ---------------- */
var EMPRESAS = [
  { id:'padronx', perfil:'incierto',  nombre:'Ágora',          sector:'datapol',  etapa:'semilla',
    pitch:'Escucha social en tiempo real para tres campañas chicas. Elección impar: año de sequía.' },
  { id:'termometro', perfil:'parejo',nombre:'Termómetro',    sector:'datapol',  etapa:'serieA',
    pitch:'La encuestadora continua que le pegó al resultado que nadie vio venir.' },
  { id:'helice', perfil:'grandes',   nombre:'Hélice',         sector:'biogen',   etapa:'serieB',
    pitch:'Su primera terapia está a un ensayo de aprobarse. La caja, a dos.' },
  { id:'quimera', perfil:'grandes',  nombre:'Quimera Labs',   sector:'biogen',   etapa:'semilla',
    pitch:'Cuatro doctores y un modelo de plegado que promete. Todo por demostrar.' },
  { id:'vuelto', perfil:'parejo',   nombre:'Vuelto',         sector:'banco',    etapa:'serieA',
    pitch:'Medio millón de cuentas esperando una licencia que no llega.' },
  { id:'correntada', perfil:'chicas',nombre:'Correntada',    sector:'banco',    etapa:'semilla',
    pitch:'Banco para monotributistas. Todavía sin nada del lado regulatorio.' },
  { id:'vatio', perfil:'parejo',    nombre:'Vatio Libre',    sector:'renov',    etapa:'serieA',
    pitch:'Miden bien y cobran mal. El ahorro está, falta demostrarlo.' },
  { id:'cuenca', perfil:'grandes',   nombre:'Cuenca Solar',   sector:'renov',    etapa:'serieB',
    pitch:'Contratos grandes con distribuidoras. Operación pesadísima.' },
  { id:'cincel', perfil:'chicas',   nombre:'Cincel',         sector:'devtools', etapa:'semilla',
    pitch:'40.000 desarrolladores lo usan gratis. Ingresos: casi cero.' },
  { id:'andamio', perfil:'chicas',  nombre:'Andamio',        sector:'devtools', etapa:'serieA',
    pitch:'Buen producto, mala monetización. Los trajeron a arreglar eso.' },
  { id:'fichas', perfil:'incierto',   nombre:'Fichas',         sector:'apuestas', etapa:'semilla',
    pitch:'Casino cripto operando desde una isla. Crece 40% por mes y nadie en la oficina duerme.' },
  { id:'labanca', perfil:'parejo',  nombre:'La Banca',       sector:'apuestas', etapa:'serieB',
    pitch:'El sportsbook que patrocina a medio fútbol. El regulador ya pidió dos reuniones.' },
  { id:'aurea', perfil:'grandes',    nombre:'Áurea',          sector:'saludgold',etapa:'serieA',
    pitch:'Clínica de longevidad con lista de espera. La operación no escala.' },
  { id:'vitalicio', perfil:'parejo',nombre:'Vitalicio',      sector:'saludgold',etapa:'serieB',
    pitch:'Membresía médica premium en tres ciudades. Cada queja llega al directorio.' }
];

function empresaPorId(id) {
  for (var i = 0; i < EMPRESAS.length; i++) if (EMPRESAS[i].id === id) return EMPRESAS[i];
  return null;
}

/* ---------------- MANDATOS ----------------
   Para qué te contrataron. Se evalúa al final del puesto.
   alinea: en qué buckets esperan que gastes. Gastar en otra cosa cuesta
   capital político, aunque tengas razón. */
var MANDATOS = [
  { id:'retencion', txt:'Llevar la retención a 88%', alinea:['desc','cons'],
    meta:function(e){ return 0.88; }, valor:function(e){ return Motor.retencionMedia(e); },
    fmt:function(v){ return Math.round(v*100)+'%'; }, libro:'hooked' },
  { id:'crecer', txt:'Multiplicar los usuarios activos', alinea:['crec','cons'],
    meta:function(e){ return e.usuariosInicio * (1 + 2 * e.meses / 14); }, valor:function(e){ return Motor.usuarios(e); },
    fmt:function(v){ return Math.round(v).toLocaleString ? Math.round(v).toLocaleString('es') : Math.round(v); }, libro:'chasm' },
  { id:'abismo', txt:'Abrir el mercado grande', alinea:['cons','desc','fiab'],
    meta:function(e){ return 1; }, valor:function(e){ return Motor.compuerta(e,'pragm'); },
    fmt:function(v){ return v>=1?'abierto':'bloqueado'; }, libro:'chasm' },
  { id:'ingresos', txt:'Duplicar el ingreso mensual', alinea:['crec','cons'],
    meta:function(e){ return Math.max(20000, e.mrrInicio * (1 + e.meses / 14)); }, valor:function(e){ return e.mrr; },
    fmt:function(v){ return '$'+Math.round(v/1000)+'k'; }, libro:'analytics' },
  { id:'estabilidad', txt:'Terminar el año sin caídas', alinea:['fiab','plat'],
    meta:function(e){ return 0; }, valor:function(e){ return e.incidentesPuesto; },
    fmt:function(v){ return v+' caídas'; }, invertido:true, libro:'sre' },
  { id:'deuda', txt:'Bajar la deuda técnica a 25', alinea:['plat'],
    meta:function(e){ return 25; }, valor:function(e){ return e.deuda; },
    fmt:function(v){ return Math.round(v)+''; }, invertido:true, libro:'fowler' },
  { id:'activacion', txt:'Subir la usabilidad 20 puntos', alinea:['desc','cons'],
    meta:function(e){ return Math.min(82, e.usabilidadInicio + 20 * e.meses / 12); }, valor:function(e){ return e.usabilidad; },
    fmt:function(v){ return Math.round(v)+''; }, libro:'krug' },
  { id:'descubrir', txt:'Instalar descubrimiento continuo (evidencia 70)', alinea:['desc'],
    meta:function(e){ return 70; }, valor:function(e){ return e.evidencia; },
    fmt:function(v){ return Math.round(v)+''; }, libro:'torres' }
];

function mandatoPorId(id) {
  for (var i = 0; i < MANDATOS.length; i++) if (MANDATOS[i].id === id) return MANDATOS[i];
  return null;
}
