/* Sectores, empresas, escalafón profesional y mandatos. Sin build ni dependencias.
   Un sector define la física del mercado; una empresa define la etapa y la
   cultura; el escalafón define qué palancas llegas a tocar. */

/* ---------------- ESCALAFÓN PROFESIONAL ----------------
   mando: qué fracción de la capacidad del área te responde.
   palancas: qué partidas puedes mover. El juego se abre a medida que subes. */
var ESCALAFON = [
  { n:0, rol:'Analista de Producto', corto:'APM', mando:0.12, sueldo:62000,
    palancas:['cons'],
    nota:'Ejecutas. Miras mucho, decides muy poco.' },
  { n:1, rol:'Product Manager', corto:'PM', mando:0.20, sueldo:98000,
    palancas:['desc','cons'],
    nota:'Ahora eliges qué se construye en tu pedazo.' },
  { n:2, rol:'Senior PM', corto:'Sr PM', mando:0.32, sueldo:135000,
    palancas:['desc','cons','plat'],
    nota:'Puedes defender la inversión en plataforma. Te costará capital político.' },
  { n:3, rol:'Group PM', corto:'GPM', mando:0.46, sueldo:172000,
    palancas:['desc','cons','plat','fiab'],
    nota:'Varios equipos. Empiezas a negociar fiabilidad contra velocidad.' },
  { n:4, rol:'Director de Producto', corto:'Dir', mando:0.62, sueldo:215000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'Tienes presupuesto de crecimiento y puedes contratar.' },
  { n:5, rol:'VP de Producto', corto:'VP', mando:0.80, sueldo:275000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'Defines la estrategia del área y los precios.' },
  { n:6, rol:'CPO', corto:'CPO', mando:0.92, sueldo:340000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'Respondes ante el directorio. Casi todo es tuyo.' },
  { n:7, rol:'Fundador/a', corto:'Fndr', mando:1.0, sueldo:70000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'Sueldo miserable, tu propio cap table. Se abre la mesa de levantar capital.' }
];

function nivelPorN(n) { return ESCALAFON[Math.max(0, Math.min(ESCALAFON.length - 1, n))]; }

/* ---------------- SECTORES ----------------
   escala/precio/viral/cac deforman el mercado. La compuerta es lo que frena
   al gran mercado: cada sector la llama distinto y exige algo distinto. */
var SECTORES = [

{ id:'datapol', nombre:'Datos, medición y opinión pública', corto:'Datos',
  desc:'Medir qué mira, qué compra y qué piensa la gente, y vendérselo a quien pague. El cliente cambia cada elección; tu reputación no.',
  precio:850, escala:0.2, viral:0.6, cac:0.7, competidor:0.6, capex:15000,
  eje:'Aquí un solo escándalo vale más que cien funcionalidades.',
  gate:'Auditoría de transparencia',
  gateReqs:[['segur',60],['datos',60],['soporte',45]],
  incidente:'escandalo', retMod:0.02,
  apuestas:['padron','microseg','transparencia','simulador'] },

{ id:'biogen', nombre:'Biogenética aplicada', corto:'Biogen',
  desc:'Diseño de proteínas y terapias a medida. Cada experimento toma meses y el regulador vigila cada paso.',
  precio:6500, escala:0.02, viral:0.12, cac:0.3, competidor:0.55, capex:220000,
  eje:'La biología no compila más rápido solo porque tengas prisa.',
  gate:'Validación regulatoria y bioseguridad',
  gateReqs:[['segur',70],['datos',65],['soporte',55]],
  incidente:'clinico', retMod:0.12,
  apuestas:['plegado','sintesis','bioseg','patentes'] },

{ id:'banco', nombre:'Banco digital', corto:'Banco',
  desc:'Cuenta, tarjeta y crédito sin sucursales. Mercado enorme, márgenes delgados y el regulador respirándote en la nuca.',
  precio:18, escala:9, viral:2.0, cac:1.6, competidor:0.7, capex:40000,
  eje:'El abismo aquí tiene forma de licencia.',
  gate:'Licencia y control de fraude',
  gateReqs:[['segur',70],['soporte',60],['datos',50]],
  incidente:'fraude', retMod:0.10,
  apuestas:['licencia','antifraude','adelanto','conciliar'] },

{ id:'renov', nombre:'Energía renovable distribuida', corto:'Energía',
  desc:'Generación y almacenamiento en el techo del cliente, con software que decide cuándo comprar y cuándo vender.',
  precio:75, escala:0.9, viral:0.7, cac:0.9, competidor:0.45, capex:55000,
  eje:'Si no puedes probar el ahorro, no hay producto.',
  gate:'Prueba verificable de ahorro',
  gateReqs:[['datos',65],['integra',55],['soporte',45]],
  incidente:'infra', retMod:0.07,
  apuestas:['sensor','verificacion','despacho','tarifas'] },

{ id:'devtools', nombre:'Herramientas para equipos técnicos', corto:'Devtools',
  desc:'Se adopta de abajo hacia arriba. Te aman gratis y cobrarles es brutalmente difícil.',
  precio:45, escala:1.6, viral:2.2, cac:1.8, competidor:0.5, capex:0,
  eje:'Adopción no es ingreso. Son dos embudos distintos.',
  gate:'Compra la organización, no el individuo',
  gateReqs:[['integra',55],['segur',50],['datos',50]],
  incidente:'infra', retMod:0.05,
  apuestas:['plantillas2','cli','openq','gobernanza'] },

{ id:'apuestas', nombre:'Juego y apuestas en línea', corto:'Apuestas',
  desc:'Casino y apuestas deportivas. Márgenes de ensueño, retención moralmente de pesadilla y un regulador que ya te tiene en la agenda.',
  precio:55, escala:5, viral:2.4, cac:1.4, competidor:0.65, capex:25000,
  eje:'La banca siempre gana. La pregunta es cuánto te deja ganar el regulador.',
  gate:'Licencia de juego y controles de adicción',
  gateReqs:[['segur',65],['datos',55],['soporte',50]],
  incidente:'granwin', retMod:0.12,
  apuestas:['cuotas','vip','autoexclusion','pagos'] },

{ id:'saludgold', nombre:'Salud digital y premium', corto:'Salud',
  desc:'Medicina por suscripción: del concierge de longevidad a la receta que llega sin que nadie te mire a la cara. Pagan por adelantado y no perdonan nada.',
  precio:320, escala:0.6, viral:0.9, cac:0.8, competidor:0.5, capex:30000,
  eje:'Tu cliente puede pagar lo que sea. Incluidos tus competidores.',
  gate:'Confianza médica y servicio impecable',
  gateReqs:[['soporte',65],['segur',60],['datos',50]],
  incidente:'clinico', retMod:0.10,
  apuestas:['concierge','longevidad','vipapp','redmedica'] },

{ id:'ia', nombre:'Inteligencia artificial aplicada', corto:'IA',
  desc:'Modelos que prometen reemplazar un departamento entero. La demo deslumbra, el costo de inferencia se come el margen y el cliente quiere ver la demo otra vez.',
  precio:120, escala:1.4, viral:1.8, cac:1.3, competidor:0.75, capex:90000,
  eje:'Aquí la demo siempre funciona. La producción es otro deporte.',
  gate:'Precisión auditable y datos que no se filtran',
  gateReqs:[['datos',65],['segur',60],['integra',55]],
  incidente:'alucina', retMod:0.03,
  apuestas:['finetune','evals','guardrails','inferencia'] },

{ id:'chips', nombre:'Silicio y semiconductores', corto:'Silicio',
  desc:'Dieciocho meses desde el diseño hasta el primer chip que enciende. Un error en el metal cuesta un respin y medio año de tu vida.',
  precio:2200, escala:0.06, viral:0.15, cac:0.35, competidor:0.6, capex:400000,
  eje:'El software se parchea. El silicio se vuelve a fabricar.',
  gate:'Rendimiento de fábrica y clientes de referencia',
  gateReqs:[['escala',65],['integra',60],['soporte',50]],
  incidente:'respin', retMod:0.14,
  apuestas:['tapeout','sdk','yield','fundicion'] },

{ id:'ciber', nombre:'Ciberseguridad empresarial', corto:'Ciberseg.',
  desc:'Vendes miedo con contrato anual. Cuando funcionas, nadie lo nota; cuando fallas una vez, sales en la portada del mundo entero.',
  precio:95, escala:1.1, viral:0.8, cac:1.5, competidor:0.7, capex:20000,
  eje:'Tu producto es invisible cuando funciona y titular cuando no.',
  gate:'Certificaciones y el cuestionario de seguridad del cliente',
  gateReqs:[['segur',75],['soporte',55],['integra',55]],
  incidente:'brecha', retMod:0.11,
  apuestas:['edr','soc','certifica','cazador'] },

{ id:'market', nombre:'Marketplace y última milla', corto:'Marketplace',
  desc:'Dos lados que se necesitan y ninguno quiere llegar primero. Cada pedido pierde plata hasta que la densidad lo salva — si es que la salva.',
  precio:14, escala:8, viral:2.3, cac:1.9, competidor:0.8, capex:60000,
  eje:'Sin densidad no hay unidad económica: solo un subsidio con app.',
  gate:'Unidad económica positiva por pedido',
  gateReqs:[['escala',60],['soporte',55],['datos',55]],
  incidente:'pico', retMod:0.06,
  apuestas:['densidad','vendedores','logistica','reputacion'] },

{ id:'strea', nombre:'Streaming y economía de creadores', corto:'Streaming',
  desc:'Compras atención por catálogo y la alquilas por suscripción. Cada mes el usuario decide de nuevo si te quiere, y cancelar toma dos clics.',
  precio:12, escala:7, viral:2.1, cac:1.5, competidor:0.75, capex:70000,
  eje:'El catálogo es un costo fijo que caduca. La costumbre es el único activo.',
  gate:'Catálogo propio y una razón para no cancelar',
  gateReqs:[['core',60],['datos',55],['escala',55]],
  incidente:'derechos', retMod:0.04,
  apuestas:['creadores','recomendador','offline','original'] }
];

function sectorPorId(id) {
  for (var i = 0; i < SECTORES.length; i++) if (SECTORES[i].id === id) return SECTORES[i];
  return null;
}

/* ---------------- ETAPAS ----------------
   Definen a qué entras el primer día. */
var ETAPAS = {
  semilla: { nombre:'Semilla', techo:22, slots:2,
             fase:'Pre-product-market fit', faseCorta:'PRE-PMF',
             objetivo:'Encuentra un problema que arda y la solución que lo apague. Nada más importa todavía.',
             prima:['core','flujo'], castiga:['escala','segur'], caja:1400000,  ing:4,  prod:1,  gtm:1,  deuda:14, arq:18, usab:32,
             usuariosBase:0.004, valoracion:9000000,  equity:[0.6, 1.8], caos:1.35 },
  serieA:  { nombre:'Serie A',  techo:30, slots:3,
             fase:'Validando el product-market fit', faseCorta:'VALIDANDO PMF',
             objetivo:'Demuestra que vuelven solos: retención que no decae e ingresos que se repiten.',
             prima:['flujo','datos'], castiga:['escala'], caja:6000000, ing:11, prod:3,  gtm:3,  deuda:32, arq:34, usab:44,
             usuariosBase:0.02,  valoracion:38000000, equity:[0.15, 0.5], caos:1.15 },
  serieB:  { nombre:'Serie B',  techo:40, slots:4,
             fase:'Escalando', faseCorta:'ESCALANDO',
             objetivo:'Convierte lo que funciona en una máquina: abre el gran mercado sin que nada se caiga.',
             prima:['integra','soporte','segur','escala'], castiga:[], caja:22000000,ing:26, prod:8,  gtm:11, deuda:47, arq:52, usab:55,
             usuariosBase:0.07,  valoracion:130000000,equity:[0.04, 0.14],caos:1.0 },
  serieC:  { nombre:'Serie C',   techo:52, slots:5,
             fase:'Camino a la bolsa', faseCorta:'PRE-IPO',
             objetivo:'Vuelve previsible lo que era una apuesta: márgenes, gobernanza y un número que puedas defender cada trimestre.',
             prima:['segur','soporte','integra','escala'], castiga:['core'], caja:60000000,ing:44, prod:14, gtm:22, deuda:58, arq:62, usab:62,
             usuariosBase:0.16,  valoracion:520000000,equity:[0.012, 0.05],caos:0.9 }
};

/* ---------------- EMPRESAS ----------------
   60 empresas, 5 por sector. Todas son parodias de compañías que cotizan en
   la bolsa de Estados Unidos: el nombre suena a la real, el pitch cuenta su
   tensión real y el elenco lleva nombres deformados de sus ejecutivos.
   Ninguna es la empresa real; todo parecido es deliberadamente sarcástico.
   elenco: quiénes te hablan en los dilemas. Si falta, Mundo.elenco() sortea. */
var EMPRESAS = [

  /* ---- datos, medición y opinión pública ---- */
  { id:'padronx', perfil:'incierto', nombre:'Oxbridge Analítica', sector:'datapol', etapa:'semilla',
    pitch:'Escucha social en tiempo real para tres campañas chicas. Año sin elecciones: un año de sequía.',
    elenco:{ ceo:'Alexander Nax', cto:'Christopher Wyler', ventas:'Mark Turnbill',
             estrella:'Aleksandr Kogán', board:'Robert Mercader' } },
  { id:'termometro', perfil:'parejo', nombre:'Galope', sector:'datapol', etapa:'serieA',
    pitch:'La encuestadora continua que acertó el resultado que nadie vio venir. Ahora todos esperan que lo repita.',
    elenco:{ ceo:'Nate Plata', cto:'Harry Entín', ventas:'Jim Cliftón',
             estrella:'Elmo Rópez', board:'Jorge Galope' } },
  { id:'similarwave', perfil:'incierto', nombre:'Similarwave', sector:'datapol', etapa:'serieA',
    pitch:'Estima el tráfico de todos los sitios del mundo. Nadie sabe bien cómo, y todo el mundo cita el número.',
    elenco:{ ceo:'Or Offen', cto:'Jason Schwarz', ventas:'Ariel Nissenbaum',
             estrella:'Yuval Lavi', board:'Erez Shachar' } },
  { id:'comescore', perfil:'parejo', nombre:'Comescore', sector:'datapol', etapa:'serieB',
    pitch:'Mide la audiencia digital de toda la industria. Lleva años reexpresando sus propios estados financieros.',
    elenco:{ ceo:'Bill Livec', cto:'Jon Carpentier', ventas:'Greg Fink',
             estrella:'Magid Abrahán', board:'Brent Rosenthal' } },
  { id:'nielsonic', perfil:'grandes', nombre:'Nielsonic', sector:'datapol', etapa:'serieC',
    pitch:'Mide qué mira el país desde antes de que existiera el streaming. El panel envejeció junto con sus panelistas.',
    elenco:{ ceo:'David Kenney', cto:'Karthik Rau', ventas:'Mainak Mazumdar',
             estrella:'Linda Dupree', board:'James Attwood' } },

  /* ---- biogenética aplicada ---- */
  { id:'quimera', perfil:'grandes', nombre:'AlfaPliegue Labs', sector:'biogen', etapa:'semilla',
    pitch:'Cuatro doctorados y un modelo de plegado que promete. Todo por demostrar.',
    elenco:{ ceo:'Demis Hassabi', cto:'Jon Jumpel', ventas:'Colin Murdock',
             estrella:{ nombre:'David Bakker', cargo:'Investigador principal' }, board:'Shane Legge' } },
  { id:'crispier', perfil:'grandes', nombre:'Crispier Therapeutics', sector:'biogen', etapa:'serieA',
    pitch:'Edición genética con premio Nobel en el consejo. Dos pacientes tratados y una fila de reguladores.',
    elenco:{ ceo:'Samarth Kulkarna', cto:{ nombre:'Emmanuelle Charpentiér', cargo:'Directora Científica' },
             ventas:'Lawrence Klein', estrella:{ nombre:'Rodger Novac', cargo:'Investigador principal' },
             board:'Ann Merrifield' } },
  { id:'helice', perfil:'grandes', nombre:'Posmoderna', sector:'biogen', etapa:'serieB',
    pitch:'Su primera terapia está a un ensayo de la aprobación. La caja, a dos.',
    elenco:{ ceo:'Stéphane Bancal', cto:{ nombre:'Melissa Moraes', cargo:'Directora Científica' },
             ventas:'Stephen Hogue', estrella:{ nombre:'Derrick Rossini', cargo:'Investigador principal' },
             board:'Noubar Afeyán' } },
  { id:'biloba', perfil:'incierto', nombre:'Biloba Bioworks', sector:'biogen', etapa:'serieB',
    pitch:'La plataforma que iba a imprimir organismos a pedido. Por ahora imprime informes trimestrales.',
    elenco:{ ceo:'Jason Kellner', cto:{ nombre:'Tom Knightly', cargo:'Director Científico' },
             ventas:'Reshma Shetty', estrella:{ nombre:'Barry Canton', cargo:'Investigador principal' },
             board:'Arie Belldegrún' } },
  { id:'iluminada', perfil:'grandes', nombre:'Iluminada', sector:'biogen', etapa:'serieC',
    pitch:'Vende las máquinas que secuencian el genoma del mundo y cobra el cartucho cada vez. Un activista en el directorio y una compra que el regulador deshizo.',
    elenco:{ ceo:'Francis deSouzza', cto:{ nombre:'Jacob Thaysson', cargo:'Director de Tecnología' },
             ventas:'Susan Tousi', estrella:{ nombre:'Alex Aravanis', cargo:'Investigador principal' },
             board:'Carl Icahd' } },

  /* ---- banco digital ---- */
  { id:'correntada', perfil:'chicas', nombre:'Rapiña Pay', sector:'banco', etapa:'semilla',
    pitch:'Un banco para trabajadores de apps. Del lado regulatorio, todavía nada.',
    elenco:{ ceo:'Simón Barrero', cto:'Felipe Villamar', ventas:'Sebastián Megía',
             estrella:'Juan Pablo Ortiga', board:'Marcelo Clauro' } },
  { id:'vuelto', perfil:'parejo', nombre:'BlueBank', sector:'banco', etapa:'serieA',
    pitch:'Medio millón de cuentas esperando una licencia que nunca llega.',
    elenco:{ ceo:'David Velazco', cto:'Edward Wibble', ventas:'Cristina Junquera',
             estrella:'Vitor Oliveira', board:'Doug Leoni' } },
  { id:'robinjood', perfil:'incierto', nombre:'Robinjood', sector:'banco', etapa:'serieB',
    pitch:'Democratizó las finanzas hasta el día que tuvo que frenar la compra de una acción. El confeti lo sacaron; las demandas no.',
    elenco:{ ceo:'Vlad Tenov', cto:'Baiju Batt', ventas:'Jason Warnock',
             estrella:'Aparna Chennapragada', board:'Scott Sandell' } },
  { id:'afirma', perfil:'parejo', nombre:'Afirmá', sector:'banco', etapa:'serieB',
    pitch:'Compra ahora, paga después. El después llegó justo cuando subieron las tasas.',
    elenco:{ ceo:'Max Levchín', cto:'Libor Michálek', ventas:'Silvija Martincevic',
             estrella:'Michael Linfort', board:'Jenny Decker' } },
  { id:'sofi', perfil:'grandes', nombre:'SoFí', sector:'banco', etapa:'serieC',
    pitch:'Empezó refinanciando deuda universitaria y terminó siendo un banco, una fintech y el nombre de un estadio.',
    elenco:{ ceo:'Anthony Nota', cto:'Jeremy Rishel', ventas:'Chris Lapoint',
             estrella:'Assaf Ronén', board:'Mike Cagné' } },

  /* ---- energía renovable distribuida ---- */
  { id:'oklito', perfil:'incierto', nombre:'Oklito', sector:'renov', etapa:'semilla',
    pitch:'Micro-reactores nucleares. Todavía no encendieron ninguno y la acción ya voló dos veces.',
    elenco:{ ceo:'Jacob DeWittle', cto:'Caroline Cochrane', ventas:'Craig Bealmear',
             estrella:'Pete Nichols', board:'Sam Altmán' } },
  { id:'vatio', perfil:'parejo', nombre:'Énfasis Solar', sector:'renov', etapa:'serieA',
    pitch:'Miden bien y facturan mal. El ahorro es real; demostrarlo, todavía no.',
    elenco:{ ceo:'Badri Kothandarán', cto:'Raghu Belún', ventas:'Martin Fornalle',
             estrella:'Paul Nahid', board:'Steven Goma' } },
  { id:'cuenca', perfil:'grandes', nombre:'SunRuina', sector:'renov', etapa:'serieB',
    pitch:'Contratos grandes con eléctricas. Una operación brutalmente pesada.',
    elenco:{ ceo:'Mary Powel', cto:'Ed Fenstel', ventas:'Lynn Jurek',
             estrella:'Paul Dickinson', board:'Alan Ferver' } },
  { id:'enchufe', perfil:'incierto', nombre:'Enchufe Power', sector:'renov', etapa:'serieB',
    pitch:'Hidrógeno verde: lleva veinte años a cinco años de ser rentable.',
    elenco:{ ceo:'Andy Marsch', cto:'Sanjay Shresta', ventas:'Jose Luis Crespo',
             estrella:'Dave Mindnich', board:'Gregory Kenny' } },
  { id:'primersol', perfil:'grandes', nombre:'Primer Sol', sector:'renov', etapa:'serieC',
    pitch:'Fabrica sus propios paneles en su propio país y vive de que la política no cambie de opinión.',
    elenco:{ ceo:'Mark Widmer', cto:'Markus Gloeckler', ventas:'Georges Antoun',
             estrella:'Pat Buehler', board:'Michael Ahern' } },

  /* ---- herramientas para equipos técnicos ---- */
  { id:'cincel', perfil:'chicas', nombre:'Dokker', sector:'devtools', etapa:'semilla',
    pitch:'40 mil desarrolladores lo usan gratis. Ingresos: casi cero.',
    elenco:{ ceo:'Solomon Hykel', cto:'Ben Golob', ventas:'Steve Sindh',
             estrella:'Michael Crosbie', board:'Scott Johnstone' } },
  { id:'andamio', perfil:'chicas', nombre:'GitLob', sector:'devtools', etapa:'serieA',
    pitch:'Buen producto, mala monetización. Para arreglar eso te trajeron.',
    elenco:{ ceo:'Sid Sijbrandt', cto:'Dmitriy Zaporozhko', ventas:'Michael McBryde',
             estrella:'Job van der Vort', board:'Sue Bostrand' } },
  { id:'mangodb', perfil:'parejo', nombre:'MangoDB', sector:'devtools', etapa:'serieB',
    pitch:'La base de datos que todos eligen a los veinte años y todos maldicen a los treinta.',
    elenco:{ ceo:'Dev Ittycherra', cto:'Eliot Horowitch', ventas:'Cedric Pech',
             estrella:'Dwight Merrigan', board:'Michael Gordón' } },
  { id:'confluyente', perfil:'parejo', nombre:'Confluyente', sector:'devtools', etapa:'serieB',
    pitch:'Vende el sistema nervioso de datos de tu empresa. La parte gratis la mantiene todo el mundo, gratis.',
    elenco:{ ceo:'Jay Krepps', cto:'Jun Rau', ventas:'Erica Schultz',
             estrella:'Neha Narkhedé', board:'Eric Vishria' } },
  { id:'datadoggo', perfil:'grandes', nombre:'Datadoggo', sector:'devtools', etapa:'serieC',
    pitch:'Te vende observabilidad, y después la factura te observa a vos.',
    elenco:{ ceo:'Olivier Pommel', cto:'Alexis Lê-Quac', ventas:'Sabrina Farmer',
             estrella:'Amit Agarwal', board:'Matt Jacobson' } },

  /* ---- juego y apuestas en línea ---- */
  { id:'fichas', perfil:'incierto', nombre:'Estaca.bet', sector:'apuestas', etapa:'semilla',
    pitch:'Un casino cripto manejado desde una isla. Crece 40% al mes y en la oficina nadie duerme.',
    elenco:{ ceo:'Ed Craving', cto:'Bijan Teherani', ventas:'Nick Antoníu',
             estrella:'Ari Zheng', board:{ nombre:'Draik', cargo:'Board (y cara de la marca)' } } },
  { id:'geniosports', perfil:'parejo', nombre:'Genio Sports', sector:'apuestas', etapa:'serieA',
    pitch:'Vende el dato oficial del partido, segundo a segundo. Si el dato llega tarde, alguien ya apostó con ventaja.',
    elenco:{ ceo:'Mark Lock', cto:'Nick Tailor', ventas:'Steven Burton',
             estrella:'Jack Davison', board:'Hugh Sloane' } },
  { id:'labanca', perfil:'parejo', nombre:'Bet366', sector:'apuestas', etapa:'serieB',
    pitch:'La casa de apuestas que patrocina a media liga de fútbol. El regulador ya pidió dos reuniones.',
    elenco:{ ceo:'Denise Coats', cto:'John Coats', ventas:'Nigel Turnier',
             estrella:'Mark Beván', board:'Peter Coats' } },
  { id:'fandual', perfil:'grandes', nombre:'FanDual', sector:'apuestas', etapa:'serieB',
    pitch:'Regala la primera apuesta y cobra las siguientes cien. Cada estado nuevo es una licencia y una campaña.',
    elenco:{ ceo:'Amy Howell', cto:'Sanjay Amin', ventas:'Mike Raffensperger',
             estrella:'Nigel Eckles', board:'Peter Jaxon' } },
  { id:'draftkongs', perfil:'grandes', nombre:'DraftKongs', sector:'apuestas', etapa:'serieC',
    pitch:'Pasó de un juego de fantasía entre amigos a patrocinar un país entero. Gasta en marketing más de lo que factura.',
    elenco:{ ceo:'Jason Robbins', cto:'Paul Libermann', ventas:'Matt Kalisch',
             estrella:'Sudhir Rao', board:'Shalom Meckenzie' } },

  /* ---- salud digital y premium ---- */
  { id:'aurea', perfil:'grandes', nombre:'Fontana Life', sector:'saludgold', etapa:'semilla',
    pitch:'Una clínica de longevidad con lista de espera. La operación no escala.',
    elenco:{ ceo:'Bill Kappa', cto:{ nombre:'Robert Hariry', cargo:'Director Médico' },
             ventas:'Tony Robles', estrella:{ nombre:'Helen Messiér', cargo:'Jefa de Longevidad' },
             board:'Peter Diamantis' } },
  { id:'oscarsalud', perfil:'parejo', nombre:'Óscar Salud', sector:'saludgold', etapa:'serieA',
    pitch:'Un seguro médico con la app más linda del mercado. El actuario descubrió que la gente enferma también se suscribe.',
    elenco:{ ceo:'Mario Schlossberg', cto:'Alan Warren', ventas:'Meghan Joyce',
             estrella:{ nombre:'Ana Gupta', cargo:'Directora Médica' }, board:'Josh Kushnir' } },
  { id:'vitalicio', perfil:'parejo', nombre:'Único Medical', sector:'saludgold', etapa:'serieB',
    pitch:'Membresía médica premium en tres ciudades. Cada queja aterriza en el escritorio del directorio.',
    elenco:{ ceo:'Amir Dan Rubén', cto:'Kimber Lockhard', ventas:'Bjorn Taler',
             estrella:{ nombre:'Tom Leen', cargo:'Director Clínico' }, board:'Andrew Diamant' } },
  { id:'hersnhims', perfil:'grandes', nombre:'Hers & Hims', sector:'saludgold', etapa:'serieC',
    pitch:'Te vende pelo, ánimo y ahora también adelgazar, por suscripción y sin mirarte a la cara.',
    elenco:{ ceo:'Andrew Dudúm', cto:'Soleil Boughton', ventas:'Melissa Bard',
             estrella:{ nombre:'Patrick Carroll', cargo:'Director Médico' }, board:'Oluyemi Okupé' } },
  { id:'teladocto', perfil:'grandes', nombre:'Teladocto', sector:'saludgold', etapa:'serieC',
    pitch:'Compró la app de la dieta por dos mil millones y después la borró del balance. La consulta por video sigue funcionando.',
    elenco:{ ceo:'Jason Gorevich', cto:'Michelle Bruno', ventas:'Chuck Divitta',
             estrella:{ nombre:'Vidya Raman', cargo:'Directora Médica' }, board:'Glen Tullmann' } },

  /* ---- inteligencia artificial aplicada ---- */
  { id:'osomayor', perfil:'incierto', nombre:'OsoMayor.ai', sector:'ia', etapa:'semilla',
    pitch:'Tiene .ai en el nombre y contratos con defensa. Los ingresos no crecen; la acción, a veces sí.',
    elenco:{ ceo:'Mandy Longe', cto:'Sean Ricker', ventas:'Kevin McAleena',
             estrella:'Julie Peterson', board:'Pamela Braden' } },
  { id:'soundhund', perfil:'parejo', nombre:'SoundHund', sector:'ia', etapa:'serieA',
    pitch:'Voz para autos y ventanillas de comida rápida. Diecisiete años construyendo la tecnología que el mundo descubrió el año pasado.',
    elenco:{ ceo:'Keyvan Mohajed', cto:'James Homm', ventas:'Michael Zagorsek',
             estrella:'Majid Emami', board:'Timothy Stonehocker' } },
  { id:'c4ai', perfil:'incierto', nombre:'C4.ai', sector:'ia', etapa:'serieB',
    pitch:'Cambió de nombre tres veces siguiendo la moda: del software energético a la nube, de la nube al internet de las cosas, del internet de las cosas a la IA.',
    elenco:{ ceo:'Tom Siebold', cto:'Ed Abbot', ventas:'Hitesh Lath',
             estrella:'Nikhil Krishnan', board:'Condoleezza Rise' } },
  { id:'tempusia', perfil:'grandes', nombre:'Tempus IA', sector:'ia', etapa:'serieB',
    pitch:'Datos clínicos e IA para oncología. Cobra por el dato, no por la cura.',
    elenco:{ ceo:'Eric Lefkovsky', cto:'Ryan Fukushiba', ventas:'Jim Rogers',
             estrella:{ nombre:'Kate Sasser', cargo:'Directora Científica' }, board:'Nadja West' } },
  { id:'palantia', perfil:'grandes', nombre:'Palantía', sector:'ia', etapa:'serieC',
    pitch:'Le vende a gobiernos y no explica qué hace. Sus ingenieros se llaman a sí mismos desplegados en el frente y su CEO habla como profeta.',
    elenco:{ ceo:'Alex Karpo', cto:'Shyam Sankhar', ventas:'Ryan Tailor',
             estrella:'Stephen Cohn', board:'Peter Thielman' } },

  /* ---- silicio y semiconductores ---- */
  { id:'rigatti', perfil:'incierto', nombre:'Rigatti', sector:'chips', etapa:'semilla',
    pitch:'Computación cuántica. Todavía no resuelve ningún problema útil y ya cotiza en bolsa.',
    elenco:{ ceo:'Chad Rigetty', cto:'David Rivas', ventas:'Subodh Kulkarni',
             estrella:'Mike Piech', board:'Cathy McCarthy' } },
  { id:'brazo', perfil:'parejo', nombre:'Brazo Holdings', sector:'chips', etapa:'serieA',
    pitch:'No fabrica nada: cobra peaje por cada chip que usa su diseño. Está en tu teléfono y no lo sabías.',
    elenco:{ ceo:'Rene Haass', cto:'Richard Grisenthwaite', ventas:'Will Abbey',
             estrella:'Simon Seagars', board:'Masayoshi Sonn' } },
  { id:'dma', perfil:'parejo', nombre:'DMA', sector:'chips', etapa:'serieB',
    pitch:'Siempre el segundo, siempre más barato, siempre un trimestre atrás. Hasta que dejó de serlo.',
    elenco:{ ceo:'Lisa Sú', cto:'Mark Papermeister', ventas:'Forrest Norrid',
             estrella:'Jim Kellner', board:'John Caldwell' } },
  { id:'intelco', perfil:'grandes', nombre:'Intelco', sector:'chips', etapa:'serieC',
    pitch:'Inventó la industria y ahora le fabrica chips a sus competidores para poder pagar la fábrica.',
    elenco:{ ceo:'Pat Gelsinner', cto:'Sandra Rivera', ventas:'Michelle Holthaus',
             estrella:'Stuart Pann', board:'Frank Yearly' } },
  { id:'envidia', perfil:'grandes', nombre:'Envidia', sector:'chips', etapa:'serieC',
    pitch:'Vendía tarjetas para videojuegos hasta que el mundo entero necesitó sus chips. Ahora el problema es a quién decirle que no.',
    elenco:{ ceo:'Jensen Hwang', cto:'Bill Dalley', ventas:'Colette Kressler',
             estrella:'Chris Malakowsky', board:'Curtis Priam' } },

  /* ---- ciberseguridad empresarial ---- */
  { id:'centinela', perfil:'chicas', nombre:'CentinelaOne', sector:'ciber', etapa:'semilla',
    pitch:'El competidor que se define por no ser el otro. Su demo siempre gana; la licitación, a veces.',
    elenco:{ ceo:'Tomer Weingart', cto:'Almog Cohn', ventas:'Ric Smith',
             estrella:'Barak Klinghofer', board:'Doug Clark' } },
  { id:'zescala', perfil:'parejo', nombre:'Zescala', sector:'ciber', etapa:'serieA',
    pitch:'Sacó la seguridad de la oficina justo cuando nadie volvió a la oficina.',
    elenco:{ ceo:'Jay Chaudri', cto:'Amit Sinja', ventas:'Mike Rich',
             estrella:'Patrick Foxhoven', board:'Remo Canesa' } },
  { id:'octa', perfil:'parejo', nombre:'Octa', sector:'ciber', etapa:'serieB',
    pitch:'Guarda la llave de todas las puertas de tu empresa. Le entraron una vez y todavía lo está explicando.',
    elenco:{ ceo:'Todd McKinnen', cto:'Hector Aguilár', ventas:'Susan St. Ledger',
             estrella:'Karl McGuinness', board:'Frederic Kerrast' } },
  { id:'palobajo', perfil:'grandes', nombre:'Palo Bajo Networks', sector:'ciber', etapa:'serieC',
    pitch:'Compró veinte empresas y las llamó plataforma. Ahora te vende las tres a la vez o ninguna.',
    elenco:{ ceo:'Nikesh Aurora', cto:'Nir Zuck', ventas:'BJ Jenkins',
             estrella:'Lee Klarich', board:'Dipak Golecha' } },
  { id:'crowdstrife', perfil:'grandes', nombre:'CrowdStrife', sector:'ciber', etapa:'serieC',
    pitch:'El agente que protege a media lista Fortune 500. Una vez, un martes, apagó a media lista Fortune 500.',
    elenco:{ ceo:'George Kurtzman', cto:'Michael Sentona', ventas:'Daniel Bernard',
             estrella:'Dmitri Alperovich', board:'Burt Podber' } },

  /* ---- marketplace y última milla ---- */
  { id:'instacarrito', perfil:'chicas', nombre:'Instacarrito', sector:'market', etapa:'semilla',
    pitch:'Un puñado de compradores con auto propio y una app. Nadie tiene claro todavía quién paga la propina.',
    elenco:{ ceo:'Apoorva Mehtra', cto:'Varouj Chitilian', ventas:'Chris Rogers',
             estrella:'Max Mullen', board:'Fidji Simón' } },
  { id:'shopifacil', perfil:'chicas', nombre:'Shopifácil', sector:'market', etapa:'serieA',
    pitch:'Le da una tienda a cualquiera en diez minutos. El 90% no vende nada y paga la mensualidad igual.',
    elenco:{ ceo:'Tobi Lütken', cto:'Mikhail Novikov', ventas:'Harley Finkelstain',
             estrella:'Farhan Thawar', board:'Bruce McKinnon' } },
  { id:'doordish', perfil:'grandes', nombre:'DoorDish', sector:'market', etapa:'serieB',
    pitch:'Lleva la comida en quince minutos y pierde plata en cada pedido, salvo en los que cobra publicidad.',
    elenco:{ ceo:'Tony Xhu', cto:'Andy Fang', ventas:'Prabir Adarker',
             estrella:'Stanley Tan', board:'John Doerrick' } },
  { id:'mercadoliberal', perfil:'grandes', nombre:'Mercado Liberal', sector:'market', etapa:'serieC',
    pitch:'El marketplace que se volvió banco, correo y fintech sin pedirle permiso a nadie. En su país es más grande que el país.',
    elenco:{ ceo:'Marcos Galpern', cto:'Daniel Rabinovich', ventas:'Osvaldo Giménes',
             estrella:'Stelleo Tolla', board:'Pedro Arndt' } },
  { id:'amazonia', perfil:'grandes', nombre:'Amazonía', sector:'market', etapa:'serieC',
    pitch:'Vende de todo, entrega mañana y gana plata con los servidores. Los dos primeros son el marketing del tercero.',
    elenco:{ ceo:'Andy Jazzy', cto:'Werner Vögel', ventas:'Doug Harrington',
             estrella:'Brian Olsavski', board:'Jeff Bezzos' } },

  /* ---- streaming y economía de creadores ---- */
  { id:'rocku', perfil:'chicas', nombre:'Rocku', sector:'strea', etapa:'semilla',
    pitch:'Un aparatito que enchufás al televisor. El plan es regalarlo y cobrar después; el después todavía no llegó.',
    elenco:{ ceo:'Anthony Woods', cto:'Mustafa Ozgen', ventas:'Charlie Collyer',
             estrella:'Ilya Asnis', board:'Ravi Ahuja' } },
  { id:'spotifai', perfil:'parejo', nombre:'Spotifái', sector:'strea', etapa:'serieA',
    pitch:'Toda la música del mundo en una app, y las discográficas todavía no firmaron.',
    elenco:{ ceo:'Daniel Ekk', cto:'Gustav Söderstrand', ventas:'Alex Norström',
             estrella:'Ludvig Strigeus', board:'Martin Lorentzen' } },
  { id:'robloques', perfil:'incierto', nombre:'Robloques', sector:'strea', etapa:'serieB',
    pitch:'Cuarenta millones de chicos construyen los juegos gratis y encima le pagan a la empresa por hacerlo.',
    elenco:{ ceo:'David Baszuki', cto:'Daniel Sturman', ventas:'Stephanie Latham',
             estrella:'Erik Cassell', board:'Michael Guthry' } },
  { id:'unidadengine', perfil:'parejo', nombre:'Unidad Engine', sector:'strea', etapa:'serieB',
    pitch:'El motor con el que se hizo medio catálogo móvil. Un día cambió el precio por instalación y medio catálogo se fue.',
    elenco:{ ceo:'John Ricciardello', cto:'Steve Collins', ventas:'Matt Brombergen',
             estrella:'Joachim Ante', board:'David Helgasson' } },
  { id:'netflicks', perfil:'grandes', nombre:'Netflicks', sector:'strea', etapa:'serieC',
    pitch:'Mandó a la quiebra al videoclub y después se convirtió en un videoclub con publicidad.',
    elenco:{ ceo:'Ted Sarandez', cto:'Elizabeth Stone', ventas:'Greg Peterson',
             estrella:'Yury Izrailevski', board:'Reed Hastens' } }
];

function empresaPorId(id) {
  for (var i = 0; i < EMPRESAS.length; i++) if (EMPRESAS[i].id === id) return EMPRESAS[i];
  return null;
}

/* ---------------- MANDATOS ----------------
   Para qué te contrataron. Se evalúa al final del puesto.
   alinea: las partidas en las que esperan que gastes. Gastar en otra cosa
   cuesta capital político, incluso cuando tienes razón. */
/* De qué está hecho cada mandato: los ejes de la empresa que lo mueven y con
   qué peso. Es lo que deja segmentar la barra de progreso, teñir los chips de
   las iniciativas con el color del eje al que alimentan, y proyectar cuánto
   avanzaría el mandato si cerraras el mes con el plan de ahora.
   Casi todos los mandatos miden un solo eje. La usabilidad es la excepción:
   NO es una métrica suelta, es un índice — 50% activación, 30% retención,
   20% confiabilidad — y de ahí sale cuánto aporta cada iniciativa. */
var MANDATOS = [
  { id:'retencion', txt:'Lleva la retención al 88%', alinea:['desc','cons'], fuentes:[['ret',1]],
    meta:function(e){ return 0.88; }, valor:function(e){ return Motor.retencionMedia(e); },
    fmt:function(v){ return Math.round(v*100)+'%'; }, libro:'hooked' },
  { id:'crecer', txt:'Multiplica los usuarios activos', alinea:['crec','cons'], fuentes:[['adq',1]],
    meta:function(e){ return e.usuariosInicio * (1 + 2 * e.meses / 14); }, valor:function(e){ return Motor.usuarios(e); },
    fmt:function(v){ return Math.round(v).toLocaleString ? Math.round(v).toLocaleString('en') : Math.round(v); }, libro:'chasm' },
  { id:'abismo', txt:'Abre el gran mercado', alinea:['cons','desc','fiab'], fuentes:[['gate',1]],
    meta:function(e){ return 1; }, valor:function(e){ return Motor.compuerta(e,'pragm'); },
    fmt:function(v){ return v>=1?'abierta':'bloqueada'; }, libro:'chasm' },
  { id:'ingresos', txt:'Duplica el ingreso mensual', alinea:['crec','cons'], fuentes:[['rev',1]],
    meta:function(e){ return Math.max(20000, e.mrrInicio * (1 + e.meses / 14)); }, valor:function(e){ return e.mrr; },
    fmt:function(v){ return '$'+Math.round(v/1000)+'k'; }, libro:'analytics' },
  { id:'estabilidad', txt:'Termina el año con cero caídas', alinea:['fiab','plat'], fuentes:[['rel',1]],
    meta:function(e){ return 0; }, valor:function(e){ return e.incidentesPuesto; },
    fmt:function(v){ return v+' caídas'; }, invertido:true, libro:'sre' },
  { id:'deuda', txt:'Baja la deuda técnica a 25', alinea:['plat'], fuentes:[['deuda',1]],
    meta:function(e){ return 25; }, valor:function(e){ return e.deuda; },
    fmt:function(v){ return Math.round(v)+''; }, invertido:true, libro:'fowler' },
  /* el unico mandato compuesto: usabilidad = 0.5 activacion + 0.3 retencion +
     0.2 confiabilidad. El tope sube a 95 porque el indice arranca mas alto que
     la activacion cruda — con el viejo tope de 82 la meta quedaba servida. */
  { id:'activacion', txt:'Sube la usabilidad 20 puntos', alinea:['desc','cons'],
    fuentes:[['act',0.5],['ret',0.3],['rel',0.2]],
    meta:function(e){ return Math.min(95, e.usabilidadInicio + 20 * e.meses / 12); },
    valor:function(e){ return Motor.usabilidadIndice(e); },
    fmt:function(v){ return Math.round(v)+''; }, libro:'krug' },
  { id:'descubrir', txt:'Instala discovery continuo (evidencia 70)', alinea:['desc'], fuentes:[['evid',1]],
    meta:function(e){ return 70; }, valor:function(e){ return e.evidencia; },
    fmt:function(v){ return Math.round(v)+''; }, libro:'torres' }
];

function mandatoPorId(id) {
  for (var i = 0; i < MANDATOS.length; i++) if (MANDATOS[i].id === id) return MANDATOS[i];
  return null;
}
