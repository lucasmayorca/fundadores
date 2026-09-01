/* Sectors, companies, career ladder and mandates. Strict ES5 (Safari 9).
   A sector defines the physics of the market; a company defines the stage and
   the culture; the ladder defines which levers you get to touch. */

/* ---------------- CAREER LADDER ----------------
   mando: what fraction of the area's capacity answers to you.
   palancas: which buckets you can move. The game opens up as you climb. */
var ESCALAFON = [
  { n:0, rol:'Product Analyst', corto:'APM', mando:0.12, sueldo:62000,
    palancas:['cons'],
    nota:'You execute. You watch a lot, decide very little.' },
  { n:1, rol:'Product Manager', corto:'PM', mando:0.20, sueldo:98000,
    palancas:['desc','cons'],
    nota:'Now you pick what gets built in your slice.' },
  { n:2, rol:'Senior PM', corto:'Sr PM', mando:0.32, sueldo:135000,
    palancas:['desc','cons','plat'],
    nota:'You can make the case for platform investment. It\'ll cost you political capital.' },
  { n:3, rol:'Group PM', corto:'GPM', mando:0.46, sueldo:172000,
    palancas:['desc','cons','plat','fiab'],
    nota:'Multiple teams. You start trading reliability against speed.' },
  { n:4, rol:'Director of Product', corto:'Dir', mando:0.62, sueldo:215000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'You have a growth budget and you can hire.' },
  { n:5, rol:'VP of Product', corto:'VP', mando:0.80, sueldo:275000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'You set the area\'s strategy and the pricing.' },
  { n:6, rol:'CPO', corto:'CPO', mando:0.92, sueldo:340000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'You answer to the board. Almost everything is yours.' },
  { n:7, rol:'Founder', corto:'Fndr', mando:1.0, sueldo:70000,
    palancas:['desc','cons','plat','fiab','crec'],
    nota:'Lousy salary, your own cap table. The fundraising table opens up.' }
];

function nivelPorN(n) { return ESCALAFON[Math.max(0, Math.min(ESCALAFON.length - 1, n))]; }

/* ---------------- SECTORS ----------------
   escala/precio/viral/cac warp the market. The gate is what holds back the
   big market: every sector calls it something different and demands
   something different. */
var SECTORES = [

{ id:'datapol', nombre:'Data & public opinion', corto:'Politics',
  desc:'Continuous polling, segmentation and social listening for campaigns and governments. The client changes every election; your reputation doesn\'t.',
  precio:850, escala:0.2, viral:0.6, cac:0.7, competidor:0.6, capex:15000,
  eje:'Here a single scandal is worth more than a hundred features.',
  gate:'Transparency audit',
  gateReqs:[['segur',60],['datos',60],['soporte',45]],
  incidente:'escandalo', retMod:0.02,
  apuestas:['padron','microseg','transparencia','simulador'] },

{ id:'biogen', nombre:'Applied biogenetics', corto:'Biogen',
  desc:'Protein design and bespoke therapies. Every experiment takes months and the regulator watches every step.',
  precio:6500, escala:0.02, viral:0.12, cac:0.3, competidor:0.55, capex:220000,
  eje:'Biology doesn\'t compile faster just because you\'re in a hurry.',
  gate:'Regulatory validation and biosafety',
  gateReqs:[['segur',70],['datos',65],['soporte',55]],
  incidente:'clinico', retMod:0.12,
  apuestas:['plegado','sintesis','bioseg','patentes'] },

{ id:'banco', nombre:'Digital bank', corto:'Bank',
  desc:'Account, card and credit with no branches. Huge market, thin margins and the regulator breathing down your neck.',
  precio:18, escala:9, viral:2.0, cac:1.6, competidor:0.7, capex:40000,
  eje:'The chasm here is shaped like a license.',
  gate:'License and fraud control',
  gateReqs:[['segur',70],['soporte',60],['datos',50]],
  incidente:'fraude', retMod:0.10,
  apuestas:['licencia','antifraude','adelanto','conciliar'] },

{ id:'renov', nombre:'Distributed renewable energy', corto:'Energy',
  desc:'Generation and storage on the customer\'s roof, with software deciding when to buy and when to sell.',
  precio:75, escala:0.9, viral:0.7, cac:0.9, competidor:0.45, capex:55000,
  eje:'If you can\'t prove the savings, there\'s no product.',
  gate:'Verifiable proof of savings',
  gateReqs:[['datos',65],['integra',55],['soporte',45]],
  incidente:'infra', retMod:0.07,
  apuestas:['sensor','verificacion','despacho','tarifas'] },

{ id:'devtools', nombre:'Tools for technical teams', corto:'Devtools',
  desc:'Adopted bottom-up. They love you for free and it\'s brutally hard to charge them.',
  precio:45, escala:1.6, viral:2.2, cac:1.8, competidor:0.5, capex:0,
  eje:'Adoption isn\'t revenue. They\'re two different funnels.',
  gate:'The org buys, not the individual',
  gateReqs:[['integra',55],['segur',50],['datos',50]],
  incidente:'infra', retMod:0.05,
  apuestas:['cli','plantillas2','panel','openq'] },

{ id:'apuestas', nombre:'Gambling & online betting', corto:'Gambling',
  desc:'Casino and sportsbook. Dream margins, morally nightmarish retention and a regulator who already has you on the agenda.',
  precio:55, escala:5, viral:2.4, cac:1.4, competidor:0.65, capex:25000,
  eje:'The house always wins. The question is how much the regulator lets you win.',
  gate:'Gaming license and addiction controls',
  gateReqs:[['segur',65],['datos',55],['soporte',50]],
  incidente:'granwin', retMod:0.12,
  apuestas:['cuotas','vip','autoexclusion','pagos'] },

{ id:'saludgold', nombre:'Premium healthcare', corto:'Health Gold',
  desc:'Concierge medicine and longevity for the top income segment. They pay a lot, they forgive nothing.',
  precio:320, escala:0.6, viral:0.9, cac:0.8, competidor:0.5, capex:30000,
  eje:'Your customer can afford anything. Including your competitors.',
  gate:'Medical trust and impeccable service',
  gateReqs:[['soporte',65],['segur',60],['datos',50]],
  incidente:'clinico', retMod:0.10,
  apuestas:['concierge','longevidad','vipapp','redmedica'] }
];

function sectorPorId(id) {
  for (var i = 0; i < SECTORES.length; i++) if (SECTORES[i].id === id) return SECTORES[i];
  return null;
}

/* ---------------- STAGES ----------------
   They define what you walk into on day one. */
var ETAPAS = {
  semilla: { nombre:'Seed', techo:22,
             fase:'Pre-product-market fit', faseCorta:'PRE-PMF',
             objetivo:'Find a problem that burns and the solution that puts it out. Nothing else matters yet.',
             prima:['core','flujo'], castiga:['escala','segur'], caja:1400000,  ing:4,  prod:1,  gtm:1,  deuda:14, arq:18, usab:32,
             usuariosBase:0.004, valoracion:9000000,  equity:[0.6, 1.8], caos:1.35 },
  serieA:  { nombre:'Series A',  techo:30,
             fase:'Validating product-market fit', faseCorta:'VALIDATING PMF',
             objetivo:'Prove they come back on their own: retention that doesn\'t decay and revenue that repeats.',
             prima:['flujo','datos'], castiga:['escala'], caja:6000000, ing:11, prod:3,  gtm:3,  deuda:32, arq:34, usab:44,
             usuariosBase:0.02,  valoracion:38000000, equity:[0.15, 0.5], caos:1.15 },
  serieB:  { nombre:'Series B',  techo:40,
             fase:'Scaling', faseCorta:'SCALING',
             objetivo:'Turn what works into a machine: open the big market without anything falling over.',
             prima:['integra','soporte','segur','escala'], castiga:[], caja:22000000,ing:26, prod:8,  gtm:11, deuda:47, arq:52, usab:55,
             usuariosBase:0.07,  valoracion:130000000,equity:[0.04, 0.14],caos:1.0 }
};

/* ---------------- COMPANIES ---------------- */
var EMPRESAS = [
  { id:'padronx', perfil:'incierto',  nombre:'Agora',          sector:'datapol',  etapa:'semilla',
    pitch:'Real-time social listening for three small campaigns. Off-year election: a drought year.' },
  { id:'termometro', perfil:'parejo',nombre:'Thermometer',    sector:'datapol',  etapa:'serieA',
    pitch:'The continuous pollster that called the result nobody saw coming.' },
  { id:'helice', perfil:'grandes',   nombre:'Helix',         sector:'biogen',   etapa:'serieB',
    pitch:'Their first therapy is one trial away from approval. The cash, two.' },
  { id:'quimera', perfil:'grandes',  nombre:'Chimera Labs',   sector:'biogen',   etapa:'semilla',
    pitch:'Four PhDs and a folding model that shows promise. Everything left to prove.' },
  { id:'vuelto', perfil:'parejo',   nombre:'Change',         sector:'banco',    etapa:'serieA',
    pitch:'Half a million accounts waiting on a license that never arrives.' },
  { id:'correntada', perfil:'chicas',nombre:'Riptide',    sector:'banco',    etapa:'semilla',
    pitch:'A bank for gig workers. Nothing on the regulatory side yet.' },
  { id:'vatio', perfil:'parejo',    nombre:'Free Watt',    sector:'renov',    etapa:'serieA',
    pitch:'They measure well and bill badly. The savings are real; proving it isn\'t done.' },
  { id:'cuenca', perfil:'grandes',   nombre:'Solar Basin',   sector:'renov',    etapa:'serieB',
    pitch:'Big contracts with utilities. Brutally heavy operations.' },
  { id:'cincel', perfil:'chicas',   nombre:'Chisel',         sector:'devtools', etapa:'semilla',
    pitch:'40,000 developers use it for free. Revenue: almost zero.' },
  { id:'andamio', perfil:'chicas',  nombre:'Scaffold',        sector:'devtools', etapa:'serieA',
    pitch:'Good product, bad monetization. That\'s what you were brought in to fix.' },
  { id:'fichas', perfil:'incierto',   nombre:'Chips',         sector:'apuestas', etapa:'semilla',
    pitch:'A crypto casino run from an island. Growing 40% a month and nobody at the office sleeps.' },
  { id:'labanca', perfil:'parejo',  nombre:'The House',       sector:'apuestas', etapa:'serieB',
    pitch:'The sportsbook sponsoring half the football league. The regulator has already asked for two meetings.' },
  { id:'aurea', perfil:'grandes',    nombre:'Aurea',          sector:'saludgold',etapa:'serieA',
    pitch:'A longevity clinic with a waitlist. The operation doesn\'t scale.' },
  { id:'vitalicio', perfil:'parejo',nombre:'Lifetime',      sector:'saludgold',etapa:'serieB',
    pitch:'Premium medical membership in three cities. Every complaint lands on the board\'s desk.' }
];

function empresaPorId(id) {
  for (var i = 0; i < EMPRESAS.length; i++) if (EMPRESAS[i].id === id) return EMPRESAS[i];
  return null;
}

/* ---------------- MANDATES ----------------
   What they hired you for. Evaluated at the end of the role.
   alinea: the buckets they expect you to spend on. Spending elsewhere costs
   political capital, even when you're right. */
var MANDATOS = [
  { id:'retencion', txt:'Get retention to 88%', alinea:['desc','cons'],
    meta:function(e){ return 0.88; }, valor:function(e){ return Motor.retencionMedia(e); },
    fmt:function(v){ return Math.round(v*100)+'%'; }, libro:'hooked' },
  { id:'crecer', txt:'Multiply active users', alinea:['crec','cons'],
    meta:function(e){ return e.usuariosInicio * (1 + 2 * e.meses / 14); }, valor:function(e){ return Motor.usuarios(e); },
    fmt:function(v){ return Math.round(v).toLocaleString ? Math.round(v).toLocaleString('en') : Math.round(v); }, libro:'chasm' },
  { id:'abismo', txt:'Open the big market', alinea:['cons','desc','fiab'],
    meta:function(e){ return 1; }, valor:function(e){ return Motor.compuerta(e,'pragm'); },
    fmt:function(v){ return v>=1?'open':'blocked'; }, libro:'chasm' },
  { id:'ingresos', txt:'Double monthly revenue', alinea:['crec','cons'],
    meta:function(e){ return Math.max(20000, e.mrrInicio * (1 + e.meses / 14)); }, valor:function(e){ return e.mrr; },
    fmt:function(v){ return '$'+Math.round(v/1000)+'k'; }, libro:'analytics' },
  { id:'estabilidad', txt:'End the year with zero outages', alinea:['fiab','plat'],
    meta:function(e){ return 0; }, valor:function(e){ return e.incidentesPuesto; },
    fmt:function(v){ return v+' outages'; }, invertido:true, libro:'sre' },
  { id:'deuda', txt:'Get tech debt down to 25', alinea:['plat'],
    meta:function(e){ return 25; }, valor:function(e){ return e.deuda; },
    fmt:function(v){ return Math.round(v)+''; }, invertido:true, libro:'fowler' },
  { id:'activacion', txt:'Raise usability 20 points', alinea:['desc','cons'],
    meta:function(e){ return Math.min(82, e.usabilidadInicio + 20 * e.meses / 12); }, valor:function(e){ return e.usabilidad; },
    fmt:function(v){ return Math.round(v)+''; }, libro:'krug' },
  { id:'descubrir', txt:'Install continuous discovery (evidence 70)', alinea:['desc'],
    meta:function(e){ return 70; }, valor:function(e){ return e.evidencia; },
    fmt:function(v){ return Math.round(v)+''; }, libro:'torres' }
];

function mandatoPorId(id) {
  for (var i = 0; i < MANDATOS.length; i++) if (MANDATOS[i].id === id) return MANDATOS[i];
  return null;
}
