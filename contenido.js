/* Game content: needs, segments, ideas, backlog and dilemmas.
   Strict ES5 (Safari 9). */

/* Needs are the customer's "job to be done". Each backlog bet covers one.
   Each segment demands a different subset: that's where the chasm
   lives. */
var NECESIDADES = [
  { id:'core',   nombre:'The core job',            corto:'Core' },
  { id:'flujo',  nombre:'Get in and get going',    corto:'Flow' },
  { id:'datos',  nombre:'See what\'s happening',   corto:'Data' },
  { id:'integra',nombre:'Plug into what they already use', corto:'Integr.' },
  { id:'soporte',nombre:'Support and guarantees',  corto:'Support' },
  { id:'segur',  nombre:'Security and compliance', corto:'Security' },
  { id:'escala', nombre:'Handle the volume',       corto:'Scale' }
];

var SEGMENTOS = [
  { id:'innov', nombre:'Innovators', desc:'They\'ll try anything new. They forgive you everything.',
    tam:900,    requiere:['core'],
    retBase:0.70, exigFiab:0.15, paga:0.5 },
  { id:'visio', nombre:'Visionaries', desc:'They buy the promise. They want an edge, not safety.',
    tam:6000,   requiere:['core','flujo','datos'],
    retBase:0.78, exigFiab:0.40, paga:1.0 },
  { id:'pragm', nombre:'Early majority', desc:'They buy what already works for someone like them.',
    tam:32000,  requiere:['core','flujo','datos','integra','soporte','segur'],
    retBase:0.91, exigFiab:0.85, paga:1.2 },
  { id:'conse', nombre:'Late majority', desc:'They buy when not buying is the risk.',
    tam:55000,  requiere:['core','flujo','datos','integra','soporte','segur','escala'],
    retBase:0.95, exigFiab:0.95, paga:1.0 }
];

var IDEAS = [
  { id:'cobranzas',
    nombre:'Collections for SMBs',
    tagline:'Invoices that collect themselves.',
    desc:'Huge, underserved market. The leader sells to corporations and won\'t '+
         'bother looking at you for years. Textbook disruption — if you can take it.',
    precio:60, escala:1.0, viral:1.0, cac:1.0, caja:210000, competidor:0.55, ventaja:'The low end is wide open.',
    riesgo:'Small ticket: you need volume, and volume breaks things.' },
  { id:'datos',
    nombre:'Retail data platform',
    tagline:'One place where the number is the same everywhere.',
    desc:'Big ticket and serious clients. But security, integrations and support '+
         'aren\'t optional: the chasm starts at practically your first customer.',
    precio:220, escala:0.32, viral:0.55, cac:0.55, caja:230000, competidor:0.8, ventaja:'Each client pays like ten.',
    riesgo:'Without a complete product you sell nothing, and complete takes time.' },
  { id:'habitos',
    nombre:'Consumer finance habits',
    tagline:'Saving without thinking about it.',
    desc:'Viral growth is possible and there\'s no compliance red tape. The problem '+
         'is the other thing: people leave after two weeks unless you changed their life.',
    precio:15, escala:14, viral:2.6, cac:2.2, caja:190000, competidor:0.35, ventaja:'Cheap word of mouth.',
    riesgo:'Brutal retention. Without a habit loop, it\'s a leaky bucket.' }
];

/* Backlog. impactoBase is the ceiling; the engine applies a hidden factor at
   the start of each run, so no two runs reward the same bets.
   senuelo = sounds great, almost never delivers. */
var APUESTAS = [
  { id:'motor',    nec:'core',   costo:14, imp:30, n:'Rules engine v1',            d:'Automates the core use case.' },
  { id:'plantillas',nec:'core',  costo:8,  imp:18, n:'Industry templates',         d:'Users start with something already built.' },
  { id:'batch',    nec:'core',   costo:12, imp:22, n:'Batch operations',           d:'Do by the thousand what was done one at a time.' },
  { id:'movil',    nec:'core',   costo:16, imp:16, n:'Native mobile app',          d:'Everyone asks for it. Nobody knows what for.' },
  { id:'ia',       nec:'core',   costo:18, imp:34, n:'AI assistant',               d:'The board will love it.', senuelo:true },

  { id:'onboard',  nec:'flujo',  costo:9,  imp:26, n:'Guided onboarding',          d:'From signup to first value with no hand-holding.' },
  { id:'importar', nec:'flujo',  costo:11, imp:24, n:'Data importer',              d:'Bring in what they already have without the pain.' },
  { id:'rediseno', nec:'flujo',  costo:15, imp:20, n:'Full visual redesign',       d:'It looks way better.', senuelo:true },
  { id:'atajos',   nec:'flujo',  costo:6,  imp:14, n:'Shortcuts and quick actions',d:'For the ones who already live inside.' },

  { id:'tablero',  nec:'datos',  costo:10, imp:24, n:'Control dashboard',          d:'The number the boss asks for on Monday.' },
  { id:'alertas',  nec:'datos',  costo:8,  imp:20, n:'Configurable alerts',        d:'The product speaks up instead of waiting.' },
  { id:'export',   nec:'datos',  costo:5,  imp:12, n:'Export to spreadsheet',      d:'Yes, everyone exports to a spreadsheet anyway.' },

  { id:'api',      nec:'integra',costo:13, imp:26, n:'Public API',                 d:'Let others build on top.' },
  { id:'conectores',nec:'integra',costo:16,imp:32, n:'Connectors to the big 5',    d:'The systems they already use and won\'t give up.' },
  { id:'webhooks', nec:'integra',costo:7,  imp:16, n:'Webhooks',                   d:'Cheap glue for automation.' },

  { id:'sla',      nec:'soporte',costo:12, imp:28, n:'Support with an SLA',        d:'Someone picks up, and it\'s in writing.' },
  { id:'docs',     nec:'soporte',costo:7,  imp:18, n:'Docs and help center',       d:'So not everything ends up in a chat.' },
  { id:'casos',    nec:'soporte',costo:9,  imp:22, n:'Published case studies',     d:'The reference the pragmatist needs.' },

  { id:'sso',      nec:'segur',  costo:11, imp:24, n:'SSO and roles',              d:'Without this, IT stops you at the door.' },
  { id:'auditoria',nec:'segur',  costo:14, imp:26, n:'Audit and traceability',     d:'Who touched what, and when.' },
  { id:'cifrado',  nec:'segur',  costo:10, imp:20, n:'Encryption and data retention', d:'Question 3 on every security questionnaire.' },

  { id:'cache',    nec:'escala', costo:12, imp:26, n:'Cache and queues',           d:'So the spike isn\'t an incident.' },
  { id:'multi',    nec:'escala', costo:17, imp:30, n:'Multi-region',               d:'Real latency and real staying power.' },
  { id:'observa',  nec:'escala', costo:9,  imp:22, n:'Observability',              d:'See the problem before the customer does.' }
];

/* Sector-specific bets. They join the generic backlog depending on where
   you're working: at a neobank the license is the product; in silicon, the
   respin. */
var APUESTAS_SECTOR = [
  /* --- data and public opinion --- */
  { id:'padron',    nec:'integra',costo:16, imp:32, n:'Public data integration',        d:'Voter rolls, gazettes, budgets: all cross-referenced.' },
  { id:'microseg',  nec:'core',   costo:18, imp:34, n:'Fine-grained audience segmentation',d:'The right message to the right block.' },
  { id:'transparencia',nec:'segur',costo:14,imp:30, n:'Public transparency dashboard',  d:'Show what data you use before they ask.' },
  { id:'simulador', nec:'datos',  costo:20, imp:36, n:'Scenario simulator',             d:'What happens if the undecided split 60/40.' },

  /* --- biogenetics --- */
  { id:'plegado',   nec:'core',   costo:26, imp:40, n:'Proprietary folding model',      d:'Your edge or your ruin. Months of compute.' },
  { id:'sintesis',  nec:'escala', costo:22, imp:34, n:'Synthesis pipeline',             d:'From in-silico design to test tube with no queue.' },
  { id:'bioseg',    nec:'segur',  costo:18, imp:34, n:'Biosafety protocols',            d:'Question one from every auditor.' },
  { id:'patentes',  nec:'soporte',costo:16, imp:28, n:'Patent portfolio',               d:'The only part of your science the investor understands.' },

  /* --- digital bank --- */
  { id:'licencia',  nec:'segur',  costo:28, imp:40, n:'License and compliance',         d:'Without this there\'s no big market.' },
  { id:'antifraude',nec:'segur',  costo:18, imp:30, n:'Anti-fraud engine',              d:'Every point of fraud comes out of your margin.' },
  { id:'adelanto',  nec:'core',   costo:20, imp:34, n:'Credit and cash advances',       d:'What actually brings them in.' },
  { id:'conciliar', nec:'datos',  costo:14, imp:26, n:'Automatic reconciliation',       d:'The chore they hate every single month.' },

  /* --- renewable energy --- */
  { id:'sensor',    nec:'core',   costo:18, imp:30, n:'Low-cost meter',                 d:'If the hardware runs expensive, there\'s no business.' },
  { id:'verificacion',nec:'datos',costo:20, imp:36, n:'Savings verification',           d:'The proof that turns a reading into an invoice.' },
  { id:'despacho',  nec:'escala', costo:22, imp:30, n:'Automatic energy dispatch',      d:'Sell the surplus at the expensive hour.' },
  { id:'tarifas',   nec:'integra',costo:12, imp:24, n:'Tariff engine',                  d:'Every utility bills differently.' },

  /* --- devtools --- */
  { id:'cli',       nec:'flujo',  costo:12, imp:30, n:'First-class CLI',                d:'Where your user already lives.' },
  { id:'plantillas2',nec:'core',  costo:10, imp:22, n:'Ready-made recipes',             d:'From clone to running in one minute.' },
  { id:'panel',     nec:'datos',  costo:14, imp:24, n:'Dashboard for the one who pays', d:'The one who signs doesn\'t use the CLI.' },
  { id:'openq',     nec:'soporte',costo:16, imp:20, n:'Open community edition',         d:'Adoption yes, revenue maybe.', senuelo:true },

  /* --- betting and online gaming --- */
  { id:'cuotas',    nec:'core',   costo:18, imp:34, n:'Live odds engine',               d:'Odds that move with the match. Your margin lives here.' },
  { id:'vip',       nec:'datos',  costo:16, imp:32, n:'VIP program',                    d:'2% of the bettors leave 60% of the money.' },
  { id:'autoexclusion',nec:'segur',costo:14,imp:30, n:'Addiction controls',             d:'The first thing the regulator checks and you left for later.' },
  { id:'pagos',     nec:'flujo',  costo:15, imp:28, n:'Instant deposit and withdrawal', d:'Whoever can\'t cash out fast doesn\'t come back.' },

  /* --- premium healthcare --- */
  { id:'concierge', nec:'soporte',costo:20, imp:36, n:'Concierge medical team',         d:'A person who answers the phone at 3 AM.' },
  { id:'longevidad',nec:'core',   costo:22, imp:34, n:'Longevity program',              d:'The annual checkup turned into a membership.' },
  { id:'vipapp',    nec:'flujo',  costo:14, imp:28, n:'Member app',                     d:'Results, appointments and history without calling anyone.' },
  { id:'redmedica', nec:'integra',costo:18, imp:30, n:'Specialist network',             d:'The best cardiologist in town, with an appointment tomorrow.' }
];

for (var _i = 0; _i < APUESTAS_SECTOR.length; _i++) APUESTAS.push(APUESTAS_SECTOR[_i]);

/* ---------------------------------------------------------------
   Dilemmas. Each one teaches something and is tied to a book.
   quien: who on the cast brings it to you (the UI adds name and title).
   cuando(e) decides whether it can fire this month.
   --------------------------------------------------------------- */
function nota(log, tipo, texto, libro) {
  log.push({ tipo:tipo, texto:texto, libro:libro || null });
}

var EVENTOS = [

{ id:'momtest', libro:'momtest', prio:100, quien:'cto',
  cuando:function(e){ return e.mesPuesto === 1 && e.evidencia < 55; },
  titulo:'How we\'re going to talk to users',
  texto:'"I booked ten customer meetings for this week. What do we ask them?"',
  variantes:[
    { titulo:'The user council', texto:'"Twelve of our biggest accounts agreed to a quarterly council. First session is Friday. What\'s on the agenda?"' },
    { titulo:'The road trip', texto:'"I\'m visiting eight customers on-site next week. One question decides what I bring back: what do I ask?"' }
  ],
  opciones:[
    { txt:'Show them the demo and ask if they\'d buy it',
      nota:'Nobody says no to your face. You\'ll walk out with ten "love it"s and zero information.',
      libro:'momtest',
      ef:function(e,log){ e.calidadDesc = 0.35; e.sesgo = 1;
        nota(log,'malo','You chose to ask about the future. Your impact estimates now come inflated.','momtest'); } },
    { txt:'Ask what they did the last time they had the problem',
      nota:'Facts from the past don\'t lie. It costs more and bores more, but it\'s the only usable thing.',
      libro:'momtest',
      ef:function(e,log){ e.calidadDesc = 1.0; e.sesgo = 0;
        nota(log,'bueno','You\'ll learn slower and truer. Your estimates will be reliable.','momtest'); } },
    { txt:'Ask for commitment: an advance or a paid pilot',
      nota:'Commitment is the most expensive signal to fake. It also scares off the ones who were just being nice.',
      libro:'momtest',
      ef:function(e,log){ e.calidadDesc = 1.15; e.sesgo = 0; e.caja += 12000;
        nota(log,'bueno','Two signed a paid pilot. Money came in and, better, certainty came in.','momtest'); } }
  ]},

{ id:'contratar', libro:'brooks', prio:80, quien:'ceo',
  cuando:function(e){ return Motor.runwayMeses(e) > 9 && e.mesPuesto > 2 && e.rampa.length === 0; },
  titulo:'There\'s budget and you\'re behind',
  texto:'"The roadmap is late and the board approved money for headcount. How many do we bring in?"',
  variantes:[
    { titulo:'The board wants headcount', texto:'"We just raised. The board keeps asking why the team is still this small. There\'s budget for four engineers, starting Monday."' },
    { titulo:'The acqui-hire offer', texto:'"A dying startup nearby is shopping its whole eng team. Four people, one interview, they start next week."' }
  ],
  opciones:[
    { txt:'Four engineers, now',
      nota:'New hires produce nothing for two months and consume the ones who were producing. Four at once is a lost quarter.',
      libro:'brooks',
      ef:function(e,log){ var i; for(i=0;i<4;i++) Motor.contratar(e,'ing');
        nota(log,'malo','Four simultaneous hires. Mentoring eats the next few months.','brooks'); } },
    { txt:'One now, we reassess in two months',
      nota:'One at a time, communication stays manageable and each person gets productive before the next one lands.',
      libro:'brooks',
      ef:function(e,log){ Motor.contratar(e,'ing');
        nota(log,'bueno','One hire. Mentoring cost contained.','brooks'); } },
    { txt:'Nobody: first we pay down debt',
      nota:'With high debt, every new person yields less. Sometimes the fastest team is the same one with less drag.',
      libro:'fowler',
      ef:function(e,log){ e.deuda = Math.max(0, e.deuda - 8);
        nota(log,'bueno','No new hires. The team breathes and debt drops 8 points.','fowler'); } }
  ]},

{ id:'clientegrande', libro:'trap', prio:85, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 3 && e.mrr > Motor.burnMensual(e) * 0.2; },
  titulo:'The customer who saves the quarter',
  texto:'"They\'ll sign for 18 months. They only ask for one custom module that\'s useless to anyone else. Do we close?"',
  variantes:[
    { titulo:'The whale RFP', texto:'"A multinational dropped an RFP on us. Eighteen months guaranteed — if we build their custom approval-workflow module. Nobody else will ever use it."' },
    { titulo:'The logo we always wanted', texto:'"THE brand just called. They\'ll sign today if we commit to a bespoke integration their team designed. It\'s them, so everyone here wants to say yes."' }
  ],
  opciones:[
    { txt:'Take it. It\'s money today',
      nota:'It\'s real revenue and also a mortgage: that module gets maintained forever and moves your product nowhere.',
      libro:'trap',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 2.5; e.deuda += 12; e.capacidadReservada = 3;
        nota(log,'neutro','The money came in, along with a bespoke obligation: +12 debt and three months of committed capacity.','trap'); } },
    { txt:'Only if it ships as a general version of the request',
      nota:'Turning a one-off request into capability for everyone is the elegant way out. You charge less and learn more.',
      libro:'inspired',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 1.2; e.cobertura.integra += 10;
        nota(log,'bueno','Less money, and the request shipped as a generic integration: +10 to Integrations.','inspired'); } },
    { txt:'Turn it down',
      nota:'Saying no to a check is the hardest call there is. Also the one that protects your focus.',
      libro:'hard',
      ef:function(e,log){ e.foco += 6; e.moral -= 3; e.politico -= 4;
        nota(log,'neutro','You said no. Sales didn\'t get it; the roadmap is still yours.','hard'); } }
  ]},

{ id:'reescritura', libro:'fowler', prio:90, quien:'estrella',
  cuando:function(e){ return e.deuda > 55; },
  titulo:'"We have to rewrite the whole thing"',
  texto:'"It can\'t be sustained any longer. Give me three months with no features and I\'ll leave it spotless."',
  variantes:[
    { titulo:'"It\'s spaghetti all the way down"', texto:'Your best engineer slides a 12-page doc across the table: a full rewrite plan, new stack, three months. "We keep patching a corpse."' },
    { titulo:'The new CTO\'s first move', texto:'The recently hired staff engineer says the codebase is unsalvageable and wants to greenfield the core. Half the team quietly agrees.' }
  ],
  opciones:[
    { txt:'Full rewrite (3 months, no features)',
      nota:'The rewrite almost always costs double the estimate and arrives with the same problems plus new ones.',
      libro:'fowler',
      ef:function(e,log){ e.reescritura = 3; e.deuda = 18;
        nota(log,'malo','Three months frozen for features. Hope the market waits.','fowler'); } },
    { txt:'Continuous refactoring: 20% of every month',
      nota:'Paying the debt in installments while you keep shipping is slower to feel and cheaper to finish.',
      libro:'fowler',
      ef:function(e,log){ e.refactorFijo = true;
        nota(log,'bueno','Permanent refactoring: every month reserves capacity to pay down debt.','fowler'); } },
    { txt:'Not now. We\'re about to launch',
      nota:'Legitimate once. Repeated, it\'s the definition of compound interest working against you.',
      libro:'fowler',
      ef:function(e,log){ e.deuda += 10; e.moral -= 4;
        nota(log,'malo','Debt climbs 10 more and your best engineer starts browsing LinkedIn.','fowler'); } }
  ]},

{ id:'vanidad', libro:'analytics', prio:75, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 4 && Motor.retencionMedia(e) < 0.88; },
  titulo:'The board slide',
  texto:'"I present tomorrow. Cumulative signups are climbing nicely. Last month\'s retention... better not to show it, right?"',
  variantes:[
    { titulo:'The investor update', texto:'The monthly investor email is due. Cumulative signups look spectacular. Last month\'s cohort retention... does not.' },
    { titulo:'The all-hands slide', texto:'Tomorrow\'s all-hands. The team is tired and needs a win. Total users makes a beautiful up-and-to-the-right chart. The cohorts tell another story.' }
  ],
  opciones:[
    { txt:'Show the cumulative numbers. The board wants good news',
      nota:'A cumulative total never goes down: that\'s why it soothes and that\'s why it says nothing. You buy peace and lose six weeks.',
      libro:'analytics',
      ef:function(e,log){ e.moral += 4; e.politico += 6; e.evidencia = Math.max(0, e.evidencia - 12);
        nota(log,'malo','Everyone\'s happy. You now know less about your own business.','analytics'); } },
    { txt:'Cohorts and retention, even if it hurts',
      nota:'One metric that matters, by cohort, against a baseline. The only thing that steers decisions.',
      libro:'analytics',
      ef:function(e,log){ e.evidencia = Math.min(100, e.evidencia + 10); e.politico -= 5; e.foco += 5;
        nota(log,'bueno','Awkward meeting, focus recovered: +10 evidence.','analytics'); } }
  ]},

{ id:'errorbudget', libro:'sre', prio:110, quien:'cto',
  cuando:function(e){ return e.presupuestoError <= 0 && !e.congelado; },
  titulo:'The error budget is spent',
  texto:'"This quarter\'s incidents ate the entire margin we agreed on. Per what we signed, we freeze now."',
  opciones:[
    { txt:'Freeze features and stabilize',
      nota:'When the budget runs out, the priority changes on its own. That\'s what it\'s for: so you don\'t argue it every time.',
      libro:'sre',
      ef:function(e,log){ e.congelado = true;
        nota(log,'neutro','Stabilization month. Nothing gets built; things get fixed.','sre'); } },
    { txt:'Keep shipping: the market doesn\'t wait',
      nota:'You can. It\'s also how you lose in one quarter the trust that took two years to earn.',
      libro:'sre',
      ef:function(e,log){ e.deuda += 14; e.riesgoExtra = 0.25; e.politico -= 6;
        nota(log,'malo','You ignored the agreement: +14 debt, sky-high risk, and the CTO taking notes.','sre'); } }
  ]},

{ id:'chasm', libro:'chasm', prio:95, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 5 && Motor.fit(e,'visio') > 0.55 && !e.gateRevelado && Motor.compuerta(e,'pragm') < 0.6; },
  titulo:'Growth flatlined',
  texto:'"The early adopters love us. The big market won\'t answer our emails, and I swear it\'s not the price."',
  opciones:[
    { txt:'Double the marketing spend',
      nota:'Pushing harder against the chasm is the most expensive way to learn the problem wasn\'t reach.',
      libro:'chasm',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e); e.gateRevelado = true;
        nota(log,'malo','A month of burn into the wind. At least now you know where the wall is: check the Gate panel.','chasm'); } },
    { txt:'Pick a niche and give it the complete product',
      nota:'The pragmatist doesn\'t buy product: they buy zero risk. What the product lacks IS the product.',
      libro:'chasm',
      ef:function(e,log){ e.gateRevelado = true; e.foco += 8;
        nota(log,'bueno','Beachhead chosen. The Gate panel shows you exactly what\'s missing.','chasm'); } }
  ]},

{ id:'termsheet', libro:'deals', prio:120, quien:'board',
  cuando:function(e){ return e.levantando && e.esFundador; },
  titulo:'Two term sheets',
  texto:'"Both offer the same money. Only one lets you keep it."',
  opciones:[
    { txt:'High valuation — 2x participating preference, 15% pool pre',
      nota:'Valuation is the headline. The participating preference gets paid first AND takes a share of the rest; the pre-money pool comes out of you.',
      libro:'deals',
      ef:function(e,log){ var monto = Math.max(2500000, e.mrr * 14); Motor.ronda(e, monto, monto*6, 2, true, 0.15, true);
        nota(log,'malo','You signed the pretty headline. The exit waterfall will explain it to you.','deals'); } },
    { txt:'Lower valuation — 1x non-participating preference, 10% pool post',
      nota:'Clean terms. In almost any realistic exit, more of it ends up yours.',
      libro:'deals',
      ef:function(e,log){ var monto = Math.max(2500000, e.mrr * 14); Motor.ronda(e, monto, monto*4.2, 1, false, 0.10, false);
        nota(log,'bueno','Less headline, more money that\'s yours.','deals'); } },
    { txt:'Don\'t raise yet',
      nota:'Not raising is a real option if the business can take it.',
      libro:'hard',
      ef:function(e,log){ e.levantando = false;
        nota(log,'neutro','Still running on your own money. And your own company.','hard'); } }
  ]},

{ id:'upmarket', libro:'innov', prio:70, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 6 && (e.usuarios.pragm||0) > e.tam.pragm * 0.03; },
  titulo:'The big accounts want more',
  texto:'"Our best accounts want enterprise features. They pay triple. It\'s easy money."',
  opciones:[
    { txt:'Go upmarket: they pay the most',
      nota:'Exactly what the incumbent does right before losing. Moving upmarket abandons the ground they\'ll attack YOU from.',
      libro:'innov',
      ef:function(e,log){ e.precio = Math.round(e.precio*1.6); e.competidor.atencion += 0.3;
        nota(log,'neutro','Price +60% and the leader is watching you now. More margin, less air.','innov'); } },
    { txt:'Stay low and automate the volume',
      nota:'The low end is boring until it\'s the entire market. Being ignored is a temporary advantage.',
      libro:'innov',
      ef:function(e,log){ e.competidor.atencion = Math.max(0, e.competidor.atencion - 0.2); e.cobertura.core += 6;
        nota(log,'bueno','Still invisible to the leader. That\'s free time: use it.','innov'); } }
  ]},

{ id:'paridad', libro:'zero', prio:65, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && e.competidor.atencion > 0.3; },
  titulo:'The competitor shipped something',
  texto:'"We lost three deals this week over a feature they have and we don\'t."',
  opciones:[
    { txt:'Copy it and catch up',
      nota:'Parity removes an objection from the list and gives no reason to pick you. Whoever\'s ahead wins by default.',
      libro:'zero',
      ef:function(e,log){ e.cobertura.core += 4; e.foco -= 6;
        nota(log,'malo','You tied that box. You lost a month of being different.','zero'); } },
    { txt:'Go deeper on what they\'ll never do',
      nota:'Being 5% better isn\'t defensible. Being the only one who nails one concrete thing is.',
      libro:'zero',
      ef:function(e,log){ e.foco += 8; e.marca += 6;
        nota(log,'bueno','You doubled down on your difference. The brand notices.','zero'); } }
  ]},

{ id:'topologies', libro:'topologies', prio:88, quien:'cto',
  cuando:function(e){ return (e.ing + e.prod) > 10 && !e.teamTopo && e.mesPuesto > 2; },
  titulo:'The team doesn\'t fit in one meeting',
  texto:'"Everyone touches everything, every change steps on someone else\'s, and coordination meetings ate our Wednesdays."',
  opciones:[
    { txt:'Split into teams, each with clear ownership of one part',
      nota:'There\'s a ceiling to how much system fits in one head. You raise it by cutting the system, not by demanding effort.',
      libro:'topologies',
      ef:function(e,log){ e.teamTopo = true; e.arquitectura += 8;
        nota(log,'bueno','Teams with boundaries. The ceiling rises, and by Conway the architecture follows the cut.','topologies'); } },
    { txt:'Add a project manager to coordinate',
      nota:'More coordination doesn\'t lower cognitive load: it adds a channel to a too-many-channels problem.',
      libro:'brooks',
      ef:function(e,log){ e.caja -= 60000;
        nota(log,'malo','More coordination over the same tangle. The ceiling stays where it was.','brooks'); } }
  ]},

{ id:'deploys', libro:'accelerate', prio:78, quien:'estrella',
  cuando:function(e){ return e.mesPuesto > 2 && !e.cd; },
  titulo:'Deploys are an event',
  texto:'"We push to production every three weeks, on a Thursday night, with two people praying."',
  variantes:[
    { titulo:'The release train', texto:'"We ship every third Thursday, 9 PM, war room, pizza. It\'s tradition. Last one took six hours and two rollbacks."' },
    { titulo:'The freeze request', texto:'"Ops wants a two-week code freeze before the big client demo. Freezes make releases bigger, and bigger releases are why we freeze."' }
  ],
  opciones:[
    { txt:'Invest in continuous deployment',
      nota:'Small, frequent batches fail less and recover faster. Speed and stability rise together.',
      libro:'accelerate',
      ef:function(e,log){ e.cd = true; e.deudaPendiente = 8;
        nota(log,'bueno','Continuous deployment: less incident risk and more capacity, forever.','accelerate'); } },
    { txt:'Leave it: it works',
      nota:'It works until the day it doesn\'t. And that day the problem won\'t be the change: it\'ll be the batch size.',
      libro:'accelerate',
      ef:function(e,log){ e.riesgoExtra = (e.riesgoExtra||0) + 0.06;
        nota(log,'neutro','Still deploying by event. The risk piles up quietly.','accelerate'); } }
  ]},

{ id:'escala', libro:'ddia', prio:105, quien:'cto',
  cuando:function(e){ return Motor.carga(e) > 0.85 && e.mesPuesto > 2; },
  titulo:'The database started to sweat',
  texto:'"Queries that took 80 ms now take 2 seconds. Nobody has complained loudly yet. Yet."',
  variantes:[
    { titulo:'The Monday graph', texto:'"Look at this latency chart. Every Monday at 9 AM we flirt with a timeout. We\'re one good press mention away from falling over."' },
    { titulo:'The success problem', texto:'"That viral post tripled our traffic. Nothing died — yet. The database is running at a temperature I don\'t like."' }
  ],
  opciones:[
    { txt:'Fix it now, even if it stalls the roadmap',
      nota:'Architecture doesn\'t degrade gracefully: it holds, then collapses all at once. This is the cheap warning; the next one is expensive.',
      libro:'ddia',
      ef:function(e,log){ e.arquitectura += 18; e.capacidadReservada = 1;
        nota(log,'bueno','+18 architecture at the cost of a month. You bought the cheap warning.','ddia'); } },
    { txt:'Buy a bigger server and move on',
      nota:'Buying hardware moves the limit a little and doesn\'t touch the assumption that\'s about to break. Aspirin, not diagnosis.',
      libro:'ddia',
      ef:function(e,log){ e.arquitectura += 4; e.infraExtra = (e.infraExtra||0) + 6000;
        nota(log,'neutro','Some breathing room and a bigger infrastructure bill. The problem is still there.','ddia'); } }
  ]},

{ id:'hooked', libro:'hooked', prio:72, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 3 && Motor.retencionMedia(e) < 0.85; },
  titulo:'They come once and don\'t come back',
  texto:'"Activation is fine, they use it for two days and vanish. Marketing wants aggressive notifications. Do we ship them?"',
  opciones:[
    { txt:'Aggressive notifications and streaks',
      nota:'External triggers raise the number this week. With no real value behind them, users learn to ignore you and hate you for it.',
      libro:'hooked',
      ef:function(e,log){ e.retBonus = (e.retBonus||0)+0.05; e.marca -= 14;
        nota(log,'malo','Retention +5% and brand through the floor. You\'re borrowing against your reputation.','hooked'); } },
    { txt:'Build the full loop, with something they leave inside',
      nota:'A habit holds when users deposit something of their own and each return visit is worth more than the last.',
      libro:'hooked',
      ef:function(e,log){ e.retBonus = (e.retBonus||0)+0.08; e.cobertura.flujo += 8;
        nota(log,'bueno','A real loop: +8% retention and more Flow. Word of mouth lights up.','hooked'); } }
  ]},

{ id:'friccion', libro:'krug', prio:68, quien:'estrella',
  cuando:function(e){ return e.usabilidad < 45 && e.mesPuesto > 2; },
  titulo:'They look at the signup and leave',
  texto:'"Of every ten who arrive, one finishes signup. Sales swears the product is great."',
  variantes:[
    { titulo:'The demo that needed a pilot', texto:'Sales closed three deals this month — every one required a live walkthrough. Nobody gets through onboarding alone.' },
    { titulo:'The support ticket pattern', texto:'A third of support tickets are the same question: "how do I even start?" The product answers it on screen. Apparently not.' }
  ],
  opciones:[
    { txt:'Watch five people use it, in silence',
      nota:'Nobody reads an interface: they scan it and guess. Five people getting stuck find more than six opinion meetings.',
      libro:'krug',
      ef:function(e,log){ e.usabilidad += 12; e.evidencia = Math.min(100, e.evidencia+6);
        nota(log,'bueno','+12 usability. All the traffic you bring now converts better.','krug'); } },
    { txt:'Bring more traffic to compensate',
      nota:'Filling a leaky bucket is the most expensive way to operate. Conversion multiplies everything you spend upstream.',
      libro:'krug',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e)*0.5; e.gtmBonus = 0.3;
        nota(log,'malo','Half a month of burn on traffic over a broken funnel. Guess where it went.','krug'); } }
  ]},

{ id:'okr', libro:'grove', prio:60, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 0 && e.mesPuesto % 6 === 0; },
  titulo:'The semester begins',
  texto:'"We have to decide what the org chases these six months. Every team sent in its wish list."',
  variantes:[
    { titulo:'Planning season', texto:'Quarter kicks off Monday. Every team lead sent their own list of priorities. Together they add up to twenty-three.' },
    { titulo:'The offsite whiteboard', texto:'Two days of offsite produced a whiteboard with nine "strategic pillars". Someone has to turn this into a quarter.' }
  ],
  opciones:[
    { txt:'One objective, three measurable results',
      nota:'Fewer objectives, measured by outcome, not activity. Clarity is the cheapest lever there is.',
      libro:'grove',
      ef:function(e,log){ e.foco += 12; e.moral += 5;
        nota(log,'bueno','Focus +12. The team knows what it will NOT do, which is the useful part.','grove'); } },
    { txt:'Nine objectives, one per area, so nobody\'s offended',
      nota:'Nine priorities is zero priorities. Every area optimizes its own and the total doesn\'t move.',
      libro:'grove',
      ef:function(e,log){ e.foco -= 10; e.moral += 2; e.politico += 3;
        nota(log,'malo','Everyone happy, nobody focused. Focus -10.','grove'); } }
  ]},

{ id:'discovery', libro:'torres', prio:62, quien:'cto',
  cuando:function(e){ return e.mesPuesto > 2 && e.evidencia < 35; },
  titulo:'When was the last interview?',
  texto:'"The team is shipping fine. But nobody remembers the last time they talked to a user."',
  variantes:[
    { titulo:'When did we last talk to a user?', texto:'Someone asks it in standup. Silence. The last recorded interview is from two quarters ago; the roadmap has been running on opinion since.' },
    { titulo:'The proxy problem', texto:'All user knowledge now arrives via sales anecdotes and support escalations — filtered, angry, and third-hand.' }
  ],
  opciones:[
    { txt:'A weekly interview, sacred, done by the team that builds',
      nota:'Discovery isn\'t a phase: it\'s a habit. And it works when the builders do it themselves.',
      libro:'torres',
      ef:function(e,log){ e.cadenciaDesc = true;
        nota(log,'bueno','Weekly cadence: evidence stops evaporating so fast.','torres'); } },
    { txt:'Hire a consultancy for a big study',
      nota:'An 80-page report arrives late, gets read once, and changes no decision the following week.',
      libro:'torres',
      ef:function(e,log){ e.caja -= 80000; e.evidencia = Math.min(100, e.evidencia+15);
        nota(log,'neutro','$80,000 for a spike of evidence that decays all the same.','torres'); } }
  ]},

{ id:'roadmap', libro:'trap', prio:64, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && e.mesPuesto % 5 === 0; },
  titulo:'The semester roadmap',
  texto:'"I need dates and feature names to promise customers. It\'s what they ask for."',
  opciones:[
    { txt:'A list of features with dates',
      nota:'A roadmap of deliverables turns the team into a factory: measured by how much shipped, never by what changed.',
      libro:'trap',
      ef:function(e,log){ e.fabrica = true; e.foco -= 5; e.politico += 4;
        nota(log,'malo','Factory mode. You\'ll ship a lot and move little.','trap'); } },
    { txt:'Problems to solve, with expected outcomes',
      nota:'Committing to the problem and the metric leaves the how open, which is where the team adds value.',
      libro:'trap',
      ef:function(e,log){ e.fabrica = false; e.foco += 7; e.politico -= 3;
        nota(log,'bueno','An outcome roadmap. Harder to sell internally, pays better.','trap'); } }
  ]},

{ id:'empoderar', libro:'inspired', prio:58, quien:'estrella',
  cuando:function(e){ return (e.ing+e.prod) > 6 && e.mesPuesto > 5 && !e.empoderado; },
  titulo:'Who decides what gets built',
  texto:'"Every decision still goes through you. We wait days for things we could resolve ourselves."',
  opciones:[
    { txt:'Give the team the problem and the context, not the solution',
      nota:'A team handed a list can only attack feasibility. The risks that kill products are the other ones.',
      libro:'inspired',
      ef:function(e,log){ e.empoderado = true; e.moral += 8;
        nota(log,'bueno','Empowered team: more morale and a better read on which bets matter.','inspired'); } },
    { txt:'Keep deciding yourself: it\'s faster',
      nota:'It\'s faster today and it\'s your ceiling tomorrow. A manager\'s output is the output of their organization.',
      libro:'grove',
      ef:function(e,log){ e.moral -= 6;
        nota(log,'malo','You\'re the bottleneck. Morale drops and the ceiling is you.','grove'); } }
  ]},

{ id:'pivote', libro:'lean', prio:115, quien:'ceo',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 6 && e.evidencia > 55 && Motor.fitMax(e) < 0.4; },
  titulo:'The evidence says no',
  texto:'You already know enough, and what you know is bad: nobody wants this the way it\'s framed.',
  opciones:[
    { txt:'Pivot: same problem, different solution',
      nota:'A pivot isn\'t failure: it\'s spending the learning you already paid for. You keep the lessons, not the plan.',
      libro:'lean',
      ef:function(e,log){ Motor.pivotar(e);
        nota(log,'bueno','Pivot done. You lose the coverage you built and gain a hypothesis that might live.','lean'); } },
    { txt:'Persevere: we\'re so close',
      nota:'Persevering without new evidence is the most common way to spend an entire startup with great discipline.',
      libro:'lean',
      ef:function(e,log){ e.moral -= 5;
        nota(log,'malo','You press on. The cash keeps dropping too.','lean'); } }
  ]},

/* ---------------- dramatic moments ---------------- */

{ id:'adquisicion', libro:'deals', prio:118, quien:'board',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 9 && e.mrr > Motor.burnMensual(e) * 0.8; },
  titulo:'They want to buy the company',
  texto:'"A firm offer landed: 3 years of revenue, half in cash. The board wants your recommendation."',
  opciones:[
    { txt:'Sell now',
      nota:'A bird in the hand — after the liquidation waterfall. You\'re about to see exactly how much of it was yours.',
      libro:'deals',
      ef:function(e,log){ e.ventaAcordada = Math.round(e.mrr * 36);
        nota(log,'neutro','Agreed. The job ends and the waterfall decides how much reaches you.','deals'); } },
    { txt:'Refuse and keep building',
      nota:'Turning down a real exit is the biggest bet you\'ll ever make. Sometimes it works. Sometimes it gets told in past tense.',
      libro:'hard',
      ef:function(e,log){ e.moral += 6; e.marca += 5;
        nota(log,'neutro','You said no. Now you have to be worth more than that offer.','hard'); } }
  ]},

{ id:'despidos', libro:'hard', prio:112, quien:'ceo',
  cuando:function(e){ return e.eraId === 'invierno' && Motor.runwayMeses(e) < 9 && (e.ing + e.prod + e.gtm) > 8; },
  titulo:'The board wants cuts',
  texto:'"In this market we won\'t be able to raise. We need 6 more months of runway. Tell me where it comes from."',
  opciones:[
    { txt:'One deep cut, once',
      nota:'If you have to cut, cut once and cut deep. Two rounds of layoffs kill morale twice.',
      libro:'hard',
      ef:function(e,log){
        var corte = Math.max(1, Math.round(e.ing * 0.25)); e.ing -= corte;
        var corteG = Math.max(0, Math.round(e.gtm * 0.4)); e.gtm -= corteG;
        e.moral -= 12;
        nota(log,'neutro','You cut ' + (corte+corteG) + ' roles in one go. It hurts today; it recovers.','hard'); } },
    { txt:'A soft cut, and we\'ll see',
      nota:'The small cut promises it won\'t be enough. The team knows it and works waiting for the second one.',
      libro:'hard',
      ef:function(e,log){ e.ing = Math.max(1, e.ing - 1); e.moral -= 8; e.riesgoDespidos = true;
        nota(log,'malo','A cut that isn\'t enough. Everyone knows another one is coming.','hard'); } },
    { txt:'No cuts: bet on the market coming back',
      nota:'Sometimes the market comes back. The runway has no opinion: it counts.',
      libro:'lean',
      ef:function(e,log){ e.moral += 3;
        nota(log,'neutro','No cuts. Watch the runway every month.','lean'); } }
  ]},

{ id:'caza', libro:'grove', prio:96, quien:'estrella',
  cuando:function(e){ return e.calor > 0 && e.mesPuesto > 3 && e.moral < 80; },
  titulo:'She got an offer',
  texto:'"They offered me double at another company in the space. I don\'t want to leave, but it\'s double."',
  opciones:[
    { txt:'Match the offer',
      nota:'Retaining with money works once. What actually retains is the project and command over your own turf.',
      libro:'grove',
      ef:function(e,log){ e.caja -= 140000; e.moral += 3;
        nota(log,'neutro','She stays. Very expensive, and the underlying reasons are still there.','grove'); } },
    { txt:'Let her go, and spread her system across the team',
      nota:'Losing the star hurts less than organizing around a single head. Bus factor is debt too.',
      libro:'topologies',
      ef:function(e,log){ e.penalCap = 10; e.deuda += 6; e.moral -= 4;
        nota(log,'neutro','She left. Three months of hangover and a system that no longer depends on one person.','topologies'); } },
    { txt:'Counter with command: make her owner of the platform',
      nota:'More command is usually worth more than more money, and it tidies your org as a bonus.',
      libro:'grove',
      ef:function(e,log){ e.moral += 6; e.teamTopo = true;
        nota(log,'bueno','She stays, with clear ownership of the platform. Two problems solved.','grove'); } }
  ]},

{ id:'rival', libro:'zero', prio:84, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 4 && !e.rivalVisto && e.rivalNombre; },
  titulo:'You know that name',
  texto:'"The competitor hired new people to fight us for the big market. You know who\'s running product there now?"',
  opciones:[
    { txt:'Speed up to get there before their plan does',
      nota:'Running the rival\'s race means letting someone else pick the track. Sometimes you have to anyway.',
      libro:'zero',
      ef:function(e,log){ e.rivalVisto = true; e.foco -= 4; e.competidor.atencion += 0.1;
        var msg = e.rivalNombre + ' is going to play aggressive. So are you, now.';
        nota(log,'neutro',msg,'zero'); } },
    { txt:'Ignore them and play your own game',
      nota:'Competition is for losers, the book said. Your difference is worth more than their speed.',
      libro:'zero',
      ef:function(e,log){ e.rivalVisto = true; e.foco += 6;
        nota(log,'bueno','Let them run. You\'ve got a game of your own.','zero'); } }
  ]},

{ id:'downround', libro:'deals', prio:117, quien:'board',
  cuando:function(e){ return e.esFundador && e.eraId === 'invierno' && Motor.runwayMeses(e) < 7 && e.rondas.length > 0; },
  titulo:'The round nobody wants',
  texto:'"There\'s exactly one fund willing — at half the last valuation, with harsh terms. That, or a bridge from the board."',
  opciones:[
    { txt:'Take the down round',
      nota:'Cutting the valuation hurts in the headlines. The alternative usually hurts on the balance sheet.',
      libro:'deals',
      ef:function(e,log){ var monto = Motor.burnMensual(e)*10; Motor.ronda(e, monto, e.valoracion*0.5, 1.5, true, 0.1, true);
        nota(log,'neutro','Money in the bank, pride on the floor, company alive.','deals'); } },
    { txt:'Board bridge and a brutal cut',
      nota:'The bridge buys months; it solves nothing. With the cut, it might just be enough to reach spring.',
      libro:'hard',
      ef:function(e,log){ e.caja += Motor.burnMensual(e)*5; e.ing = Math.max(1, Math.round(e.ing*0.6));
        e.gtm = Math.max(0, Math.round(e.gtm*0.5)); e.moral -= 15;
        nota(log,'malo','Bridge + cuts. Half the team, twice the pressure.','hard'); } }
  ]},

/* ---------------- the gray zone ---------------- */

{ id:'canal', libro:'zero', prio:92, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 3 && e.competidor.atencion > 0.2; },
  titulo:'The envelope',
  texto:'"A friend at a fund sent me the competitor\'s entire data room. Roadmap, numbers, everything. Nobody will ever know."',
  opciones:[
    { txt:'Open it. It would be stupid not to',
      nota:'Stolen information earns compound interest: today it saves you a quarter, tomorrow someone remembers who gave it to you and what you owe them.',
      libro:'zero',
      ef:function(e,log){ e.foco += 8; e.cobertura.core += 5; e.lupa = Math.min(100, e.lupa + 18);
        nota(log,'malo','You read the whole thing. You gained a quarter and a debt that shows up on no balance sheet. Heat climbs.','zero'); } },
    { txt:'Delete it and tell legal',
      nota:'Boring, correct, and the only version of this story that doesn\'t wake you up at night two years from now.',
      libro:'hard',
      ef:function(e,log){ e.moral += 3;
        nota(log,'bueno','Deleted, with witnesses. The day that fund gets investigated, your name isn\'t there.','hard'); } },
    { txt:'Return it... after a little peek at the price sheet',
      nota:'There\'s no such thing as looking a little. There\'s only having looked.',
      libro:'hard',
      ef:function(e,log){ e.foco += 3; e.lupa = Math.min(100, e.lupa + 8);
        nota(log,'neutro','"Just the prices." Sure. Heat climbs anyway, because whoever sent it knows now.','hard'); } }
  ]},

{ id:'cocinar', libro:'analytics', prio:108, quien:'ceo',
  cuando:function(e){ return e.mesPuesto > 4 && Motor.progresoMandato(e) < (e.mesPuesto / e.meses) * 0.8; },
  titulo:'The numbers for the round',
  texto:'"I need the churned accounts listed as \'paused\' until the round closes. Everyone does it. It\'s presentation, not fraud."',
  opciones:[
    { txt:'Cook them. Just until it closes',
      nota:'The first problem isn\'t getting caught: it\'s that the cooked number becomes the real number behind your own decisions. Now you\'re lying to yourself too.',
      libro:'analytics',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 4; e.lupa = Math.min(100, e.lupa + 25);
        e.evidencia = Math.max(0, e.evidencia - 15); e.politico += 8;
        nota(log,'malo','The round closed on made-up numbers. Money came in, Heat climbs 25, and your real evidence is worth less: even you don\'t know the true number anymore.','analytics'); } },
    { txt:'Refuse, and keep the email',
      nota:'Saying no to the CEO costs political capital today. Signing fake metrics costs the entire career, with interest.',
      libro:'hard',
      ef:function(e,log){ e.politico -= 12; e.moral += 4;
        nota(log,'bueno','You said no, in writing. The CEO won\'t forget. Neither will the prosecutors — in your favor.','hard'); } },
    { txt:'Pitch the real story, told well',
      nota:'An ugly cohort with a credible plan raises more money than a doctored total, at half the criminal risk.',
      libro:'analytics',
      ef:function(e,log){ e.politico -= 4; e.evidencia = Math.min(100, e.evidencia + 6);
        nota(log,'bueno','You built the honest version, with a narrative. Less shine, zero court case.','analytics'); } }
  ]},

{ id:'clubcompradores', libro:'hard', prio:106, quien:'ventas',
  cuando:function(e){ return (e.sectorId === 'biogen' || e.sectorId === 'saludgold') && e.mesPuesto > 5 && Motor.compuerta(e,'pragm') < 0.6; },
  titulo:'The desperate buyers club',
  texto:'"There are patients who can\'t wait for approval. They\'ll pay anything, outside the system. A private buyers club. The list already exists."',
  opciones:[
    { txt:'Set up the club. Regulation is slow and people are dying',
      nota:'Dallas Buyers Club is a great movie because it ends badly AND well. In your version, the regulator writes the ending.',
      libro:'hard',
      ef:function(e,log){ e.caja += Motor.burnMensual(e) * 3; e.marca += 6;
        e.lupa = Math.min(100, e.lupa + 30); e.riesgoExtra = (e.riesgoExtra||0) + 0.1;
        nota(log,'malo','The club works and the money flows. So did you — straight onto the regulator\'s list. Heat +30.','hard'); } },
    { txt:'A compassionate-access program, with paperwork',
      nota:'There\'s a legal instrument for exactly this. It\'s slower, covers fewer people, and doesn\'t end with your name in a case file.',
      libro:'hard',
      ef:function(e,log){ e.marca += 8; e.cobertura.soporte += 6; e.politico += 4;
        nota(log,'bueno','Compassionate access approved. Less epic, more patients in the long run.','hard'); } },
    { txt:'No. We wait for approval',
      nota:'Defensible, cold, and someone is going to write a furious thread about your company. They\'ll be half right.',
      libro:'lean',
      ef:function(e,log){ e.marca -= 5;
        nota(log,'neutro','You wait. The furious thread went out anyway. The approval, still nowhere.','lean'); } }
  ]},

{ id:'lado', libro:'grove', prio:94, quien:'cto',
  cuando:function(e){ return e.mesPuesto > 4 && (e.ing + e.prod) > 4 && !e.eventosVistos.caza; },
  titulo:'The side business',
  texto:'"I found out why the infra bill doesn\'t add up: your best engineer has had a business of her own running on our servers for months."',
  opciones:[
    { txt:'Cover it up in exchange for total loyalty',
      nota:'Now you have a brilliant employee who owes you one and a secret that works for her. Secrets charge interest.',
      libro:'grove',
      ef:function(e,log){ e.moral -= 4; e.lupa = Math.min(100, e.lupa + 15); e.penalCap = 0; e.foco += 4;
        nota(log,'malo','Deal sealed. She delivers like crazy, and now two people in the company are lying to everyone else.','grove'); } },
    { txt:'Fire her on the spot, with a full audit',
      nota:'Very expensive today: you lose your best mind and take three months of hangover. Cheap compared to explaining this to an investor in due diligence.',
      libro:'grove',
      ef:function(e,log){ e.penalCap = 10; e.deuda += 6; e.moral += 5;
        nota(log,'bueno','She left with a small scandal. The message to the rest of the team was worth every point of capacity.','grove'); } },
    { txt:'Buy the business and fold it into the company',
      nota:'The Breaking Bad play: instead of killing the shady business, you put it on the balance sheet. Now the problem is officially yours.',
      libro:'hard',
      ef:function(e,log){ e.caja -= 80000; e.mrr += 9000; e.lupa = Math.min(100, e.lupa + 10);
        nota(log,'neutro','The company now has a revenue line nobody can explain to the board. Heat +10.','hard'); } }
  ]},

{ id:'wolf', libro:'analytics', prio:90, quien:'ventas',
  cuando:function(e){ return e.mesPuesto > 5 && e.mandatoId === 'crecer' && Motor.progresoMandato(e) < 0.6; },
  titulo:'Wolf users',
  texto:'"I know an install farm. Ten thousand users in two weeks. The board looks at the total; it doesn\'t look at where it came from."',
  opciones:[
    { txt:'Buy the users. The mandate is the mandate',
      nota:'Bought users don\'t use, don\'t pay and don\'t come back — but they do enter the average, and they rot every metric you decide with.',
      libro:'analytics',
      ef:function(e,log){
        e.usuarios.innov += e.tam.innov * 0.3; e.usuarios.visio += e.tam.visio * 0.15;
        e.retBonus = (e.retBonus||0) - 0.10; e.lupa = Math.min(100, e.lupa + 15);
        e.evidencia = Math.max(0, e.evidencia - 10);
        nota(log,'malo','The total exploded. Retention collapsed, your evidence is worth less and Heat climbs: funds know how to read cohorts too.','analytics'); } },
    { txt:'No. Show the real growth and take the meeting on the chin',
      nota:'The uncomfortable real number ages well. The inflated number ages like milk in the sun.',
      libro:'analytics',
      ef:function(e,log){ e.politico -= 6; e.evidencia = Math.min(100, e.evidencia + 5);
        nota(log,'bueno','Rough meeting, clean metrics. You still know what\'s true in your own company.','analytics'); } }
  ]},

{ id:'socio', libro:'deals', prio:104, quien:'board',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 8 && e.rondas.length > 0; },
  titulo:'The ghost partner',
  texto:'"Your cofounder hasn\'t shown up in six months and holds 30%. The lawyers say there\'s a window to dilute him down to 5% before the next round. It\'s... legal."',
  opciones:[
    { txt:'Execute the dilution. Let him fight it in court',
      nota:'The Zuckerberg play. It works, it\'s legal on paper, and you\'ll hear the story retold in a lawsuit with email discovery included.',
      libro:'deals',
      ef:function(e,log){ e.capTable.fund = Math.min(1, e.capTable.fund + 0.12); e.moral -= 10;
        e.marca -= 6; e.lupa = Math.min(100, e.lupa + 10);
        nota(log,'malo','You own 12 more points of the company and a lawsuit in gestation. The team took note of how you treat partners.','deals'); } },
    { txt:'Buy his stake at a fair price',
      nota:'More expensive today, and it buys something no market lists: nobody on your team thinking they could be next.',
      libro:'deals',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e) * 4; e.capTable.fund = Math.min(1, e.capTable.fund + 0.08); e.moral += 4;
        nota(log,'bueno','Clean, signed exit. It cost cash; it didn\'t cost reputation.','deals'); } },
    { txt:'Leave it as is. A 30% sleeping partner',
      nota:'Dead equity on the cap table scares investors almost as much as a lawsuit. Almost.',
      libro:'deals',
      ef:function(e,log){
        nota(log,'neutro','It stays as is. Next round, someone is going to ask who he is and why he holds 30%.','deals'); } }
  ]},

{ id:'fiscal', libro:'hard', prio:119, quien:'board',
  cuando:function(e){ return e.lupa >= 55 && !e.eventosVistos.allanamiento; },
  titulo:'The prosecutor wants to talk',
  texto:'"Off the record: they have a file on the company. On the record: whoever cooperates now walks clean. The meeting is tomorrow."',
  opciones:[
    { txt:'Cooperate and hand over what you know',
      nota:'You walk clean. The company, the team and your name in the industry absorb the hit. Deals with prosecutors are exactly that: deals.',
      libro:'hard',
      ef:function(e,log){ e.lupa = e.lupaBase + 20; e.politico -= 25; e.moral -= 12; e.marca -= 10;
        nota(log,'neutro','You cooperated. Heat drops, but that file never fully closes. Nobody at the office holds your gaze anymore.','hard'); } },
    { txt:'Expensive lawyers and silence',
      nota:'The classic defense: costly, slow, and it sometimes works. Heat doesn\'t drop; the bill goes up.',
      libro:'hard',
      ef:function(e,log){ e.caja -= Motor.burnMensual(e) * 2; e.infraExtra = (e.infraExtra||0) + 15000;
        nota(log,'neutro','The lawyers bill monthly and the file stays open. At least nobody talked.','hard'); } },
    { txt:'Actually clean house: cut everything gray, now',
      nota:'The only way out that fixes the case AND the cause of the case. It costs growth today.',
      libro:'grove',
      ef:function(e,log){ e.lupa = Math.max(e.lupaBase, e.lupa - 30); e.gtmBonus = -0.3; e.foco += 5;
        nota(log,'bueno','You cut everything that wouldn\'t survive an inspection. You grow less this quarter and you sleep at night.','grove'); } }
  ]},

{ id:'allanamiento', libro:'hard', prio:130, quien:'cto',
  cuando:function(e){ return e.lupa >= 85; },
  titulo:'They\'re downstairs',
  texto:'"There are six people with folders in the lobby and a warrant. They\'re cloning the servers. Right now."',
  opciones:[
    { txt:'Cooperate fully and call the lawyers',
      nota:'When they show up with a warrant, the hiding game is already over. The only move left is procedural dignity.',
      libro:'hard',
      ef:function(e,log){
        if (e.cobertura.segur >= 55 && Math.random() < 0.6) {
          e.lupa = e.lupaBase + 10; e.zafo = true; e.marca -= 8;
          nota(log,'bueno','They took everything and found nothing that wouldn\'t survive a trial. You got away with it. This time.','hard');
        } else {
          e.imputado = true;
          nota(log,'malo','They found what there was to find. There\'s an indictment, and your name is on it.','hard');
        }
      } },
    { txt:'"Delete what you know how to delete." Now. Right now',
      nota:'Obstruction: the only crime committed in front of the witnesses who came looking for it.',
      libro:'hard',
      ef:function(e,log){
        if (Math.random() < 0.25) {
          e.lupa = 70; e.zafo = true;
          nota(log,'malo','Unbelievably, it worked. You live with that now.','hard');
        } else {
          e.imputado = true;
          nota(log,'malo','They saw everything. Obstruction got added to the original charge. The end.','hard');
        }
      } }
  ]},

{ id:'whale', libro:'analytics', prio:98, quien:'ventas',
  cuando:function(e){ return e.sectorId === 'apuestas' && e.mesPuesto > 3; },
  titulo:'The whale',
  texto:'"Our top VIP lost a fortune this month. He says if we don\'t give half of it back, he tells a newspaper how we treated him: the bonuses, the 3 AM pushes, the limits we never enforced."',
  opciones:[
    { txt:'Refund half and keep him playing',
      nota:'You\'re paying him to stay the problem. Whales don\'t leave: they sink, and they make waves.',
      libro:'analytics',
      ef:function(e,log){ e.caja -= Math.max(40000, e.mrr * 0.8); e.lupa = Math.min(100, e.lupa + 8);
        nota(log,'malo','You paid. He\'ll lose again, he\'ll threaten again, and now he knows it works.','analytics'); } },
    { txt:'Ban him and apply the self-exclusion you never applied',
      nota:'You lose your best account and the story he can tell gets worse... unless the controls are finally real.',
      libro:'sre',
      ef:function(e,log){ e.mrr = Math.round(e.mrr * 0.93); e.marca += 4; e.cobertura.segur += 6;
        nota(log,'bueno','Banned, by protocol and in writing. You lost revenue and bought a defense argument.','sre'); } },
    { txt:'Let him talk to the paper. What are they going to print — that he gambled?',
      nota:'They\'ll print exactly that, with screenshots of your 3 AM notifications. And the regulator reads that paper.',
      libro:'hard',
      ef:function(e,log){ e.marca -= 15; e.lupa = Math.min(100, e.lupa + 20);
        nota(log,'malo','The story ran, screenshots included. Heat climbs 20 and the headline will be read back to you at the next round.','hard'); } }
  ]},

{ id:'imperio', libro:'hard', prio:102, quien:'board',
  cuando:function(e){ return e.esFundador && e.mesPuesto > 12 && e.mrr > Motor.burnMensual(e); },
  titulo:'How much is enough?',
  texto:'"There\'s a fund ready to buy 15% of YOUR shares, from you, today, in cash. You can secure your entire life and stay founder. Or is this not about the money anymore?"',
  opciones:[
    { txt:'Sell the 15%. Family first',
      nota:'The founder secondary is the most underrated tool in the industry: playing without the fear of going broke makes you better, not worse.',
      libro:'hard',
      ef:function(e,log){ var venta = e.valoracion * 0.15 * e.capTable.fund * 0.85;
        e.capTable.fund *= 0.85; e.ventaSecundaria = (e.ventaSecundaria||0) + venta;
        nota(log,'bueno','You sold a piece of your own stake at a discount. Less company, zero fear. It shows in how you decide.','hard'); } },
    { txt:'No. I\'m in the empire business',
      nota:'That line is Walter White\'s, and it didn\'t end well for him. Some pull it off. You\'ll find out which one you are.',
      libro:'hard',
      ef:function(e,log){ e.foco += 6; e.moral -= 3;
        nota(log,'neutro','All or nothing, then. The board wrote the line down to quote it later, whoever wins.','hard'); } }
  ]}
];

/* Dilemmas that can honestly repeat across jobs: they're situational,
   not one-time lessons. Everything else gets heavily deprioritized once
   you've lived it in a previous company. */
var EVERGREEN = { okr:1, roadmap:1, discovery:1, errorbudget:1, escala:1,
                  fiscal:1, allanamiento:1, ronda:1, caza:1, despidos:1 };

function eventoAplicable(e, c) {
  var cand = [], i;
  var vistosCarrera = (c && c.dilemasVistos) || {};
  for (i = 0; i < EVENTOS.length; i++) {
    var ev = EVENTOS[i];
    if (e.eventosVistos[ev.id]) continue;
    var repes = vistosCarrera[ev.id] || 0;
    /* one-time lessons never repeat; skinned ones may return once with a
       different scene; situational (evergreen) ones can always come back */
    var tope = EVERGREEN[ev.id] ? 99 : (ev.variantes ? 2 : 1);
    if (repes >= tope) continue;
    var ok = false;
    try { ok = ev.cuando(e); } catch (err) { ok = false; }
    if (ok) cand.push({ ev:ev, prio:ev.prio - repes * 45 });
  }
  if (!cand.length) return null;
  cand.sort(function(a,b){ return b.prio - a.prio; });
  return cand[0].ev;
}

/* Company-flavored skins: same dilemma, different scene, so job 2 never
   reads like job 1. Picked deterministically from the company id. */
function eventoTexto(ev, e) {
  if (!ev.variantes || !ev.variantes.length) return { titulo:ev.titulo, texto:ev.texto };
  var h = 0, s = (e.empresaId || '') + ev.id, i;
  for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  var idx = h % (ev.variantes.length + 1);
  if (idx === 0) return { titulo:ev.titulo, texto:ev.texto };
  return ev.variantes[idx - 1];
}
