/* Library: the books the game uses as its mental model.
   Each card explains the concept in my own words and says how the engine simulates it.
   Strict ES5 (Safari 9). */

var LIBROS = [

/* ---------------- STARTUP ---------------- */
{ id:'lean', pilar:'startup',
  titulo:'The Lean Startup', autor:'Eric Ries',
  concepto:'Validated learning',
  idea:'A startup isn\'t a small company: it\'s an experiment to find out whether '+
       'a business can exist. What you produce isn\'t features, it\'s knowledge. '+
       'The build-measure-learn cycle only counts when you close the full loop, not '+
       'just the first leg, and when the evidence says your hypothesis was wrong, the '+
       'honest answer is to pivot instead of rowing harder.',
  juego:'Your "evidence" is a real variable. With low evidence, the impact estimates '+
        'you see in the backlog are noise dressed up as numbers.' },

{ id:'zero', pilar:'startup',
  titulo:'Zero to One', autor:'Peter Thiel',
  concepto:'Differentiate, don\'t compete',
  idea:'Copying what already exists drags you into a margin war you won\'t win. '+
       'Value gets captured by being defensibly different in a small niche '+
       'you can dominate, not by being 5% better than the leader on their own turf.',
  juego:'Building parity with the competitor barely moves your fit and wakes them up. '+
        'Covering needs they ignore gives you growth they can\'t copy fast.' },

{ id:'chasm', pilar:'startup',
  titulo:'Crossing the Chasm', autor:'Geoffrey Moore',
  concepto:'The chasm and the whole product',
  idea:'Visionaries buy you on a promise; pragmatists buy something that already '+
       'works for someone like them. Between those two groups there\'s a chasm: '+
       'you don\'t cross it with more marketing, you cross it by picking a narrow niche '+
       'and handing them everything they need to feel zero risk — integrations, '+
       'support, references, security.',
  juego:'The early majority sits behind a gate. Miss its requirements and your '+
        'growth spend evaporates, no matter how much the early adopters love you.' },

{ id:'innov', pilar:'startup',
  titulo:'The Innovator\'s Dilemma', autor:'Clayton Christensen',
  concepto:'Disruption from below',
  idea:'Big companies don\'t lose because they\'re dumb: they lose by listening to their '+
       'best customers, who always ask for more of the same. That pushes them '+
       'upmarket and leaves the low end wide open — exactly where a worse '+
       'but simpler product can grow without anyone reacting.',
  juego:'The competitor has "attention". Go after their premium segment and they crush you; '+
        'grow from below and they ignore you until it\'s too late for them.' },

{ id:'hard', pilar:'startup',
  titulo:'The Hard Thing About Hard Things', autor:'Ben Horowitz',
  concepto:'Decisions with no good option',
  idea:'Genuinely hard problems don\'t have a right answer waiting to be found: '+
       'they have two bad paths, and you have to pick one fast and '+
       'own it. Playbooks work in peacetime; in wartime all that\'s left '+
       'is taking care of your people and telling the truth early.',
  juego:'Several dilemmas have no optimal option. Stalling is also a choice, and the '+
        'engine charges you for it.' },

{ id:'deals', pilar:'startup',
  titulo:'Venture Deals', autor:'Brad Feld and Jason Mendelson',
  concepto:'Terms matter more than valuation',
  idea:'The headline of a round is the valuation, but what decides how much you take home '+
       'lives in the fine print: liquidation preference, whether it\'s participating, and which '+
       'side of the round the option pool comes out of. A high valuation with '+
       'brutal terms can leave you with less than a low, clean one.',
  juego:'The term sheets are real. At the end of the game you see the exit waterfall '+
        'and what every clause you signed actually cost you.' },

{ id:'grove', pilar:'startup',
  titulo:'High Output Management', autor:'Andy Grove',
  concepto:'Managerial leverage',
  idea:'A manager\'s output is the output of their organization, not their own. '+
       'So measure your activities by how much they multiply everyone '+
       'else\'s work, and watch leading indicators instead of hearing about the '+
       'problem after it already blew up.',
  juego:'Morale, focus and structure multiply your capacity. Without them, adding people '+
        'produces less than it costs.' },

/* ---------------- PRODUCT ---------------- */
{ id:'inspired', pilar:'producto',
  titulo:'Inspired', autor:'Marty Cagan',
  concepto:'The four risks',
  idea:'Before building, you attack four separate risks: will anyone want it, '+
       'will they be able to use it, can we build it, and does it make sense for '+
       'the business. Teams handed a locked feature list never touch '+
       'the first two — the ones that kill products.',
  juego:'Every bet in the backlog covers a concrete need. Building without having '+
        'de-risked value first is betting blind.' },

{ id:'torres', pilar:'producto',
  titulo:'Continuous Discovery Habits', autor:'Teresa Torres',
  concepto:'Discovery cadence',
  idea:'Discovery isn\'t a phase you do at the start: it\'s a weekly habit '+
       'of the same team that builds. You map real opportunities that come out of '+
       'interviews, and only then think up solutions — always several in parallel '+
       'so you can compare them.',
  juego:'Evidence decays on its own every sprint. Discovering in bursts isn\'t enough: '+
        'you have to hold the cadence.' },

{ id:'momtest', pilar:'producto',
  titulo:'The Mom Test', autor:'Rob Fitzpatrick',
  concepto:'Ask about the past, not the future',
  idea:'Ask people if they like your idea and everyone will lie to spare your feelings. '+
       'Useful answers come from facts: what they did last time they had '+
       'the problem, what it cost them, what they tried. Compliments are noise; '+
       'concrete commitments are data.',
  juego:'This defines the quality of your discovery. Bad interviews don\'t leave you without '+
        'information: they hand you false, optimistic information — which is worse.' },

{ id:'trap', pilar:'producto',
  titulo:'Escaping the Build Trap', autor:'Melissa Perri',
  concepto:'Outcomes, not deliverables',
  idea:'The trap is measuring success by how much got shipped instead of by what '+
       'changed in user or business behavior. A roadmap stuffed with '+
       'features is a list of outputs cosplaying as strategy.',
  juego:'Shipping a lot moves nothing if the bets don\'t touch real needs. '+
        'Your final report card scores outcomes, not features shipped.' },

{ id:'hooked', pilar:'producto',
  titulo:'Hooked', autor:'Nir Eyal',
  concepto:'The habit loop',
  idea:'Products that get used on their own close a loop: a trigger leads to a '+
       'simple action, the action pays a somewhat variable reward, and the user leaves '+
       'something of theirs inside that makes the next lap worth more. That deposit is '+
       'what turns usage into habit.',
  juego:'Retention feeds word of mouth. But forcing the loop without real value '+
        'pumps short-term usage and torches your brand.' },

{ id:'krug', pilar:'producto',
  titulo:'Don\'t Make Me Think', autor:'Steve Krug',
  concepto:'Friction and activation',
  idea:'Nobody reads your interface: they scan it and guess. Every moment someone has '+
       'to stop and figure out what to do is a leak, and those leaks pile up '+
       'silently along the way into your product.',
  juego:'Usability multiplies the conversion of ALL the traffic you bring in. It\'s the '+
        'cheapest lever there is and the one everyone postpones.' },

{ id:'analytics', pilar:'producto',
  titulo:'Lean Analytics', autor:'Alistair Croll and Benjamin Yoskovitz',
  concepto:'Vanity vs. actionable metrics',
  idea:'Cumulative totals only ever go up, which is why they tell you nothing. The metrics '+
       'that matter are rates and cohorts, compared against a line you drew '+
       'beforehand — and you want exactly one that matters per stage.',
  juego:'The HUD shows total users nice and big. Retention by segment is printed '+
        'smaller — and it\'s the one that decides whether you survive.' },

/* ---------------- TECH ---------------- */
{ id:'accelerate', pilar:'tech',
  titulo:'Accelerate', autor:'Nicole Forsgren, Jez Humble and Gene Kim',
  concepto:'Speed and stability are not a trade-off',
  idea:'Intuition says going faster breaks more things, and the data says the '+
       'opposite: teams that deploy often and in small batches also '+
       'fail less and recover faster. Big, spaced-out releases are the cause '+
       'of the risk, not the protection against it.',
  juego:'Investing in platform lowers incident probability AND raises your capacity. '+
        'It\'s not a tax: it\'s the compounding lever.' },

{ id:'brooks', pilar:'tech',
  titulo:'The Mythical Man-Month', autor:'Fred Brooks',
  concepto:'Brooks\' law and Conway\'s law',
  idea:'Adding people to a late project makes it later, because the newcomers '+
       'don\'t produce yet and burn the time of the ones who did, while the '+
       'communication channels grow much faster than the team. And the system '+
       'that comes out the other end copies the shape of the org that built it.',
  juego:'Every hire takes two sprints to produce and bills you mentoring in the '+
        'meantime. Hire five at once and your quarter is gone.' },

{ id:'sre', pilar:'tech',
  titulo:'Site Reliability Engineering', autor:'Google (Beyer, Jones, Petoff, Murphy)',
  concepto:'Error budget',
  idea:'100% availability is the wrong target: it costs a fortune and nobody '+
       'notices. Agree on a realistic target, and the gap up to 100% becomes a '+
       'budget you can spend on purpose to move faster — and when it runs out, '+
       'priorities flip on their own with nobody having to argue it.',
  juego:'You get an error budget per quarter. Burn it, and the next sprint '+
        'goes into a freeze and you can\'t build.' },

{ id:'topologies', pilar:'tech',
  titulo:'Team Topologies', autor:'Matthew Skelton and Manuel Pais',
  concepto:'Cognitive load as the limit',
  idea:'A team has a ceiling on how much system it can hold in its head, and once '+
       'you blow past it, effort won\'t fix it. The fix is cutting the work along '+
       'boundaries a team can own end to end, and making the interactions between '+
       'teams explicit instead of improvised.',
  juego:'Past a certain size, every new person yields less until you reorganize '+
        'into teams with clear boundaries.' },

{ id:'ddia', pilar:'tech',
  titulo:'Designing Data-Intensive Applications', autor:'Martin Kleppmann',
  concepto:'Scale breaks assumptions',
  idea:'An architecture doesn\'t degrade gracefully: it holds, and holds, and at some '+
       'load point it collapses all at once because an assumption you never saw stopped '+
       'being true. Better to design knowing where that point is than to discover it '+
       'some Tuesday at midnight.',
  juego:'If users grow faster than your architecture, incident probability '+
        'spikes non-linearly. Success is the thing that takes you down.' },

{ id:'fowler', pilar:'tech',
  titulo:'Refactoring', autor:'Martin Fowler',
  concepto:'Tech debt and compound interest',
  idea:'Taking a shortcut is borrowing time, and like any loan it pays interest: '+
       'every future change costs a little more. You pay it back in small, '+
       'continuous installments as you work; the ground-up rewrite is almost always '+
       'the most expensive way to pay the same debt.',
  juego:'Debt taxes a percentage of ALL your capacity, every sprint, forever. '+
        'It\'s the variable most people let grow without looking.' }
,

/* ================= YC & ESSAYS ================= */
{ id:'pgdefault', pilar:'yc', titulo:'Default Alive or Default Dead?', autor:'Paul Graham',
  concepto:'Alive or dead by default',
  idea:'The question almost nobody asks in time: if nothing changes, at this growth rate and this '+
       'burn, do you reach profitability before the cash runs out? If the answer is no, you\'re "default '+
       'dead" and every decision you make should be a different one. Not knowing is the most common way to die.',
  juego:'This opened because your runway dropped below 7 months. Now answer the question.',
  cuando:function(e,c){ return Motor.runwayMeses(e) < 7; } },

{ id:'pgscale', pilar:'yc', titulo:'Do Things That Don\'t Scale', autor:'Paul Graham',
  concepto:'Do things that don\'t scale',
  idea:'In the beginning, recruit users by hand, one at a time, and give them absurdly good service. '+
       'The stuff that doesn\'t scale is exactly what teaches you what to build. Scaling is a problem you\'ll '+
       'hopefully have later; today your problem is getting anyone to care.',
  juego:'At seed stage, manual discovery beats any campaign.',
  cuando:function(e,c){ return e.etapa === 'semilla' && e.mesPuesto <= 3; } },

{ id:'pgmakers', pilar:'yc', titulo:'Maker\'s Schedule, Manager\'s Schedule', autor:'Paul Graham',
  concepto:'Two incompatible schedules',
  idea:'The person who builds needs long blocks; the person who manages lives in one-hour slots. A '+
       'single badly placed meeting wrecks a maker\'s entire afternoon. Mixing the two schedules without '+
       'noticing destroys more capacity than any bug.',
  juego:'Your focus fell below 40: the team\'s effective capacity falls with it.',
  cuando:function(e,c){ return e.foco < 40; } },

{ id:'pgramen', pilar:'yc', titulo:'Ramen Profitability', autor:'Paul Graham',
  concepto:'Ramen profitability',
  idea:'The point where revenue covers the founders\' noodles. It\'s not success: it\'s freedom. '+
       'From there nobody can kill you — not the capital markets, not an impatient investor — and that '+
       'changes the tone of every negotiation you have.',
  juego:'Your revenue passed your burn at seed stage. The death clock just stopped.',
  cuando:function(e,c){ return e.etapa === 'semilla' && e.mrr > Motor.burnMensual(e); } },

{ id:'pgdie', pilar:'yc', titulo:'How Not to Die', autor:'Paul Graham',
  concepto:'Not dying is a skill',
  idea:'Startups almost never get murdered: they commit suicide. Founders get tired, fall out, '+
       'take a job. If you simply don\'t die and something improves every week, time starts '+
       'playing for you. Surviving ugly still counts as surviving.',
  juego:'You ran the cash down to the wire and you\'re still here. This is exactly what he meant.',
  cuando:function(e,c){ return e.caja < Motor.burnMensual(e) * 2 && e.mesPuesto > 3; } },

{ id:'yclaunch', pilar:'yc', titulo:'Launch Now', autor:'Y Combinator',
  concepto:'Launch now',
  idea:'If your first version doesn\'t embarrass you a little, you launched too late. Launch isn\'t '+
       'the end of development: it\'s the start of learning. Everything you did before having real '+
       'users was, at best, a well-written hypothesis.',
  juego:'You shipped your first bet: only now does "real impact" exist.',
  cuando:function(e,c){ return e.apuestasCompletadas >= 1; } },

{ id:'yctalk', pilar:'yc', titulo:'Write Code and Talk to Users', autor:'Y Combinator',
  concepto:'The YC mantra',
  idea:'Write code and talk to users: everything else is optional. Half of all founders '+
       'do only the first and build in a vacuum; the other half do nothing but meetings. The full '+
       'loop is both things, every week.',
  juego:'This month you did discovery AND building. That\'s the loop.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.desc > 0 && e.gastoPropio.cons > 0; } },

{ id:'ycgrowth', pilar:'yc', titulo:'Startup = Growth', autor:'Paul Graham',
  concepto:'Startup means growth',
  idea:'A startup isn\'t a new company or a tech company: it\'s a company designed '+
       'to grow fast. That commitment defines everything else — which problems are worth it, which markets '+
       'work, how much tidiness you can afford.',
  juego:'You grew more than 15% in a month. This is what you came for.',
  cuando:function(e,c){ var h = e.hist; if (h.length < 2) return false;
    var a = h[h.length-2].u, b = h[h.length-1].u; return a > 100 && b > a * 1.15; } },

{ id:'pgfund', pilar:'yc', titulo:'A Fundraising Survival Guide', autor:'Paul Graham',
  concepto:'Surviving the raise',
  idea:'Raising money is a second full-time job nobody asked for. The rules: do it '+
       'fast, in parallel, without falling in love with any fund, and get back to building. The worst '+
       'possible state is the eternal "almost closing", which consumes entire companies.',
  juego:'You closed your first round. Now get back to the product.',
  cuando:function(e,c){ return e.rondas.length >= 1; } },

{ id:'pgmean', pilar:'yc', titulo:'Mean People Fail', autor:'Paul Graham',
  concepto:'Mean people lose, eventually',
  idea:'In startups, meanness is expensive: it scares off good people, closes doors you didn\'t know '+
       'existed, and leaves you surrounded only by people who negotiate like you do. Playing it straight isn\'t just '+
       'ethics: it is, selfishly, the best strategy available.',
  juego:'Heat is on you. This card opens by itself when that happens.',
  cuando:function(e,c){ return e.lupa >= 35; } },

{ id:'pgrr', pilar:'yc', titulo:'Relentlessly Resourceful', autor:'Paul Graham',
  concepto:'Relentlessly resourceful',
  idea:'Graham went looking for two words that define a good founder and landed on these: relentless and '+
       'resourceful. Refuse to take the world as it comes — but adapt in your means, never in your '+
       'goal. The opposite of standing still gracefully.',
  juego:'You\'re operating in the depths of a capital winter. Time to prove it.',
  cuando:function(e,c){ return e.eraId === 'invierno' && e.mesPuesto > 4; } },

{ id:'seibel', pilar:'yc', titulo:'The Real Product-Market Fit', autor:'Michael Seibel',
  concepto:'Real PMF',
  idea:'Product-market fit isn\'t feeling good about the product: it\'s drowning in demand you '+
       'can\'t serve, with servers suffering and customers insisting. If you have to ask whether '+
       'you have it, you don\'t — and finding it is your only job.',
  juego:'Your fit passed 0.7 in some segment. This is starting to look like it.',
  cuando:function(e,c){ return Motor.fitMax(e) > 0.72; } },

/* ================= STARTUP (more) ================= */
{ id:'blank', pilar:'startup', titulo:'The Four Steps to the Epiphany', autor:'Steve Blank',
  concepto:'Customer development',
  idea:'The book that started the whole lean movement: the facts don\'t live in your office, they live '+
       'outside the building. Customers get discovered with the same rigor you build the '+
       'product with — in phases, with hypotheses, and before scaling anything.',
  juego:'You hit evidence 70. You actually got out of the building.',
  cuando:function(e,c){ return e.evidencia >= 70; } },

{ id:'whatyoudo', pilar:'startup', titulo:'What You Do Is Who You Are', autor:'Ben Horowitz',
  concepto:'Culture = decisions',
  idea:'Culture isn\'t what you declare on the wall: it\'s what your people do when you\'re not around. It '+
       'gets defined in the uncomfortable calls — who you promote, what you forgive, which shortcut you accept. '+
       'Each one teaches more than any values document.',
  juego:'Your team is watching how you decide in the gray zone. And learning from it.',
  cuando:function(e,c){ return e.moral < 50 && e.lupa >= 25; } },

{ id:'runninglean', pilar:'startup', titulo:'Running Lean', autor:'Ash Maurya',
  concepto:'Iterate from plan A to the plan that works',
  idea:'Your plan A is almost certainly wrong, and that\'s fine: the job is to document it on one '+
       'page, attack the riskiest part first, and change plans with method, not panic. The pivot '+
       'is a tool, not a defeat.',
  juego:'You pivoted. You kept the learning and dropped the plan: that was the point.',
  cuando:function(e,c){ return !!e.pivoteHecho; } },

{ id:'blitz', pilar:'startup', titulo:'Blitzscaling', autor:'Reid Hoffman',
  concepto:'Speed over efficiency',
  idea:'When the market is enormous and the winner takes all, growing messy beats growing '+
       'right. It\'s brutally expensive, it breaks the org on purpose, and it\'s almost always the wrong excuse '+
       '— but when it genuinely applies, whoever hesitates loses.',
  juego:'You have 3+ people ramping at once. You\'re paying the blitz tax.',
  cuando:function(e,c){ return e.rampa.length >= 3; } },

{ id:'rework', pilar:'startup', titulo:'Rework', autor:'Jason Fried and DHH',
  concepto:'Small is an advantage',
  idea:'The heresy that works: don\'t raise, don\'t grow for growth\'s sake, don\'t do meetings. '+
       'Constraint is a gift — it forces you to build only what\'s essential and to charge from day '+
       'one. Not every good company is a venture-backed startup.',
  juego:'You\'re a founder, months without raising, and still alive. There\'s another path, and you\'re on it.',
  cuando:function(e,c){ return e.esFundador && e.rondas.length === 0 && e.mesPuesto > 9; } },

{ id:'foundersatwork', pilar:'startup', titulo:'Founders at Work', autor:'Jessica Livingston',
  concepto:'Everyone started badly',
  idea:'Dozens of famous founders telling how it really began: ideas that were something else, partners who '+
       'walked, months of nothing. The pattern isn\'t genius: it\'s tolerating the discomfort of nothing '+
       'working yet, without ever standing still.',
  juego:'You founded. Welcome to the club of people who started without knowing.',
  cuando:function(e,c){ return e.esFundador; } },

{ id:'dunford', pilar:'startup', titulo:'Obviously Awesome', autor:'April Dunford',
  concepto:'Deliberate positioning',
  idea:'Your product doesn\'t compete against who you think: it competes against whatever the customer already uses, '+
       'even if that\'s a spreadsheet. Choosing the right frame — what you are, for whom, instead of what — '+
       'can double conversion without touching a line of code.',
  juego:'They compared you to the competitor. The framing of that comparison was yours to pick.',
  cuando:function(e,c){ return !!e.eventosVistos.paridad; } },

{ id:'playbigger', pilar:'startup', titulo:'Play Bigger', autor:'Ramadan, Peterson and others',
  concepto:'Category design',
  idea:'Legendary companies don\'t win markets: they create them. Category design means defining the '+
       'problem on your terms, naming it, and educating the market, so that when it matures, the '+
       'obvious answer is you.',
  juego:'Your brand passed 60: you\'re starting to define how the problem gets talked about.',
  cuando:function(e,c){ return e.marca >= 60; } },

{ id:'helmer', pilar:'startup', titulo:'7 Powers', autor:'Hamilton Helmer',
  concepto:'Power, not advantage',
  idea:'A feature isn\'t an advantage: it\'s a delay. Durable power comes from seven places — '+
       'scale, network, switching costs, brand, cornered resource, counter-positioning, process '+
       'power. If you can\'t name yours, you don\'t have one.',
  juego:'Your fit is high and the competitor still isn\'t looking at you: that IS counter-positioning.',
  cuando:function(e,c){ return Motor.fitMax(e) > 0.6 && e.competidor.atencion < 0.3; } },

{ id:'innovsol', pilar:'startup', titulo:'The Innovator\'s Solution', autor:'Clayton Christensen',
  concepto:'The sequel with the playbook',
  idea:'If the Dilemma explains why incumbents fall, the Solution explains how to attack them: come in '+
       'where their cost structure forbids them to follow you, and grow upmarket at your own pace, '+
       'not your ego\'s.',
  juego:'You faced the call between moving upmarket or staying low. This book is that decision.',
  cuando:function(e,c){ return !!e.eventosVistos.upmarket; } },

{ id:'paranoid', pilar:'startup', titulo:'Only the Paranoid Survive', autor:'Andy Grove',
  concepto:'Strategic inflection points',
  idea:'There are moments when the rules of the business shift 10x — a technology, a competitor, a '+
       'regulation — and the company that walks through them with the old plan dies very neatly. Useful '+
       'paranoia is institutional: someone has to be watching the edge.',
  juego:'The competitor is staring you down. The rules of your game just changed.',
  cuando:function(e,c){ return e.competidor.atencion >= 0.6; } },

{ id:'antifragile', pilar:'startup', titulo:'Antifragile', autor:'Nassim Taleb',
  concepto:'What gets stronger when hit',
  idea:'Robust is what withstands chaos; antifragile is what benefits from it. A small startup '+
       'with positive cash in a crisis doesn\'t just survive the winter: it uses it, because its '+
       'funded competitors die faster than it does.',
  juego:'Revenue above burn in the depths of a capital winter. Chaos is working for you.',
  cuando:function(e,c){ return e.eraId === 'invierno' && e.mrr > Motor.burnMensual(e); } },

/* ================= PRODUCT (more) ================= */
{ id:'empowered', pilar:'producto', titulo:'Empowered', autor:'Marty Cagan',
  concepto:'Teams with problems, not lists',
  idea:'The sequel to Inspired aims at leaders: your job isn\'t deciding what gets built, it\'s '+
       'building teams capable of deciding it better than you. Context and problems flow down; '+
       'solutions and evidence flow up.',
  juego:'You empowered the team. You\'re no longer the org\'s ceiling.',
  cuando:function(e,c){ return !!e.empoderado; } },

{ id:'shapeup', pilar:'producto', titulo:'Shape Up', autor:'Ryan Singer',
  concepto:'Appetite, not estimation',
  idea:'Instead of asking how long it takes, ask how much it\'s worth spending: six weeks, and if it '+
       'doesn\'t fit, you cut scope, not the deadline. And never start ten things: parallel work '+
       'is where projects go to never get finished.',
  juego:'You have more than two bets in flight: context switching is already charging you.',
  cuando:function(e,c){ var n=0,k; for(k in e.enVuelo) if(e.enVuelo.hasOwnProperty(k)) n++; return n > 2; } },

{ id:'sprintk', pilar:'producto', titulo:'Sprint', autor:'Jake Knapp',
  concepto:'Five days to know',
  idea:'A process for compressing months of debate into a week: Monday you map, Tuesday you sketch '+
       'solutions, Wednesday you decide, Thursday you prototype, Friday you test with five real '+
       'users. The speed isn\'t in building fast: it\'s in deciding with small data.',
  juego:'You put nearly half your month into discovery. That\'s a real sprint.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.desc >= 8; } },

{ id:'storymap', pilar:'producto', titulo:'User Story Mapping', autor:'Jeff Patton',
  concepto:'The map before the list',
  idea:'A flat backlog lies: it hides the user\'s journey behind a pile of tickets. '+
       'Mapping the full journey and slicing it into cuts that work end to end avoids '+
       'the classic 80%-done product that\'s useless as a whole.',
  juego:'You\'ve shipped five bets: do they form a complete journey, or five loose pieces?',
  cuando:function(e,c){ return e.apuestasCompletadas >= 5; } },

{ id:'jtbd', pilar:'producto', titulo:'Competing Against Luck', autor:'Clayton Christensen',
  concepto:'The job to be done',
  idea:'Nobody wants your product: people "hire" things to do a job in their life. The '+
       'movie theater\'s competitor isn\'t another theater, it\'s the couch. Understanding the job — functional, social, '+
       'emotional — predicts the purchase better than any demographic.',
  juego:'You saturated an entire need on the map. That "job" now hires you.',
  cuando:function(e,c){ var k; for(k in e.cobertura) if(e.cobertura.hasOwnProperty(k) && e.cobertura[k]>=80) return true; return false; } },

{ id:'norman', pilar:'producto', titulo:'The Design of Everyday Things', autor:'Don Norman',
  concepto:'Blame the design',
  idea:'When someone uses your product wrong, the error is yours: well-designed objects teach '+
       'their use through their shape. Doors that tell you whether to push, controls that map to what '+
       'they move. The manual is a confession of failure.',
  juego:'Usability above 70: your product started explaining itself.',
  cuando:function(e,c){ return e.usabilidad >= 70; } },

{ id:'okrdoerr', pilar:'producto', titulo:'Measure What Matters', autor:'John Doerr',
  concepto:'OKRs: committed focus',
  idea:'The system Grove invented and Doerr evangelized: a few objectives that matter, measurable '+
       'key results, public to the whole company, and decoupled from the bonus — so people '+
       'aim high without fearing an honest miss.',
  juego:'You defined the semester. One clear objective beats nine consensual ones.',
  cuando:function(e,c){ return !!e.eventosVistos.okr; } },

{ id:'workingback', pilar:'producto', titulo:'Working Backwards', autor:'Colin Bryar and Bill Carr',
  concepto:'Start with the press release',
  idea:'At Amazon, before building anything they write the launch press release and the '+
       'customer FAQ. If the press release doesn\'t excite anyone, the product won\'t '+
       'either — and finding that out in a document costs a thousand times less.',
  juego:'You\'re managing by outcomes, not by dates. Amazon approves.',
  cuando:function(e,c){ return e.fabrica === false && e.mesPuesto > 6; } },

{ id:'rumelt', pilar:'producto', titulo:'Good Strategy Bad Strategy', autor:'Richard Rumelt',
  concepto:'The kernel of strategy',
  idea:'Good strategy has three parts: an honest diagnosis, a guiding policy, and '+
       'actions coherent with each other. Everything else — vision, mission, ambitious goals — isn\'t '+
       'strategy: it\'s wishful thinking formatted as PowerPoint.',
  juego:'Your focus passed 75. It shows when there\'s a real strategy.',
  cuando:function(e,c){ return e.foco >= 75; } },

{ id:'leanux', pilar:'producto', titulo:'Lean UX', autor:'Jeff Gothelf',
  concepto:'Design as hypothesis',
  idea:'Design isn\'t the phase where you draw what\'s already been decided: every screen is a hypothesis with '+
       'an expected outcome. Fewer perfect deliverables, more cheap experiments with the whole '+
       'team watching the user together.',
  juego:'You watched users get stuck in your funnel. Every fix from here on is a tested hypothesis.',
  cuando:function(e,c){ return !!e.eventosVistos.friccion; } },

{ id:'justenough', pilar:'producto', titulo:'Just Enough Research', autor:'Erika Hall',
  concepto:'Just enough research',
  idea:'You don\'t need a research department: you need the discipline to ask well and '+
       'the humility to hear the answer. Expensive research that changes no decisions is worth '+
       'less than one short interview that does.',
  juego:'You\'re interviewing well and your evidence shows it. Enough IS the goal.',
  cuando:function(e,c){ return e.calidadDesc >= 1 && e.evidencia >= 50; } },

{ id:'outcomes', pilar:'producto', titulo:'Outcomes Over Output', autor:'Josh Seiden',
  concepto:'Outcome ≠ deliverable',
  idea:'An outcome is a change in human behavior that creates value: the customer comes back, the '+
       'user invites others, the process stops hurting. Features are merely bets placed to produce '+
       'those changes — and most of them don\'t.',
  juego:'You rejected the dates roadmap. Now measure behaviors, not deliveries.',
  cuando:function(e,c){ return !!e.eventosVistos.roadmap; } },

{ id:'alchemy', pilar:'producto', titulo:'Alchemy', autor:'Rory Sutherland',
  concepto:'Logic doesn\'t sell',
  idea:'The opposite of a good idea can be another good idea. Humans don\'t buy the optimal: '+
       'they buy meaning, signals and context. A train doesn\'t improve only by going faster; it improves '+
       'with wifi and a story. Psychological magic is legitimate engineering.',
  juego:'Your brand passed 70: people no longer buy your product, they buy its story.',
  cuando:function(e,c){ return e.marca >= 70; } },

{ id:'badass', pilar:'producto', titulo:'Badass: Making Users Awesome', autor:'Kathy Sierra',
  concepto:'Users who crush it',
  idea:'Nobody recommends a product: people recommend themselves by being better at something. Don\'t '+
       'make an awesome product; make awesome users in the context where your product '+
       'lives. Word of mouth comes from there, not from marketing.',
  juego:'Retention above 93%: your users are winning with you.',
  cuando:function(e,c){ return Motor.retencionMedia(e) > 0.93; } },

{ id:'coldstart', pilar:'producto', titulo:'The Cold Start Problem', autor:'Andrew Chen',
  concepto:'The atomic network',
  idea:'Network effects don\'t start big: they start with the atomic network — the smallest group '+
       'that sustains itself, even if that\'s a hundred people at one university. Winning a thousand small networks '+
       'in a row beats chasing one big one from the start.',
  juego:'Your sector is viral: the cold start problem is YOUR problem.',
  cuando:function(e,c){ return e.viral >= 2 && Motor.usuarios(e) >= 100; } },

{ id:'olsen', pilar:'producto', titulo:'The Lean Product Playbook', autor:'Dan Olsen',
  concepto:'The PMF pyramid',
  idea:'Six ordered layers: market, underserved needs, value proposition, features, UX '+
       'and, only at the top, the product. The classic mistake is starting at the top two layers and '+
       'praying. Fit gets designed from the bottom up.',
  juego:'Your fit with visionaries passed 0.6: the pyramid has a base.',
  cuando:function(e,c){ return Motor.fit(e, 'visio') > 0.6; } },

{ id:'thinkingbets', pilar:'producto', titulo:'Thinking in Bets', autor:'Annie Duke',
  concepto:'Decision ≠ outcome',
  idea:'A good decision can turn out badly and a bad one can turn out fine: judging by results '+
       'teaches the wrong lessons. Thinking in bets — probabilities, sizing, incomplete '+
       'information — is the only honest way to operate in a world with luck in it.',
  juego:'You work in the betting industry. Irony: here, luck is the product.',
  cuando:function(e,c){ return e.sectorId === 'apuestas'; } },

/* ================= GROWTH & SALES ================= */
{ id:'traction', pilar:'growth', titulo:'Traction', autor:'Gabriel Weinberg and Justin Mares',
  concepto:'The forgotten 50%',
  idea:'A startup is half product and half distribution, and product founders split their time '+
       '100 and 0. There are 19 channels; the one that will work for you is probably not the one you like. You '+
       'find it with cheap experiments, not opinions.',
  juego:'You put your first point into growth. Now test channels, not hunches.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.crec > 0; } },

{ id:'hackingg', pilar:'growth', titulo:'Hacking Growth', autor:'Sean Ellis and Morgan Brown',
  concepto:'The process, not the trick',
  idea:'Growth hacking isn\'t a bag of tricks: it\'s a weekly process — analyze, ideate, '+
       'prioritize, test — run by a cross-functional team across the WHOLE funnel. Someone else\'s famous '+
       'growth hack is almost never your lever.',
  juego:'You have a go-to-market team now: give them process, not brainwaves.',
  cuando:function(e,c){ return e.gtm >= 3; } },

{ id:'influence', pilar:'growth', titulo:'Influence', autor:'Robert Cialdini',
  concepto:'The six levers',
  idea:'Reciprocity, commitment, social proof, authority, liking and scarcity: six mental '+
       'shortcuts people use to decide without thinking. Knowing them is marketing; abusing them is '+
       'the short road to never being believed again.',
  juego:'You published case studies: that\'s social proof doing your selling.',
  cuando:function(e,c){ return !!e.hechas.casos; } },

{ id:'positioning', pilar:'growth', titulo:'Positioning', autor:'Al Ries and Jack Trout',
  concepto:'The battle is mental',
  idea:'Positioning doesn\'t happen in the product: it happens in the customer\'s head, which has '+
       'room for two or three brands per category. If you can\'t be first in the category, create '+
       'one where you can — the mind doesn\'t get reshuffled, it gets a new slot.',
  juego:'You picked your beachhead. Now be the number one of something small.',
  cuando:function(e,c){ return !!e.eventosVistos.chasm; } },

{ id:'challenger', pilar:'growth', titulo:'The Challenger Sale', autor:'Matthew Dixon and Brent Adamson',
  concepto:'Teach, don\'t please',
  idea:'The best B2B seller isn\'t the relationship builder: it\'s the one who teaches the customer '+
       'something about their own business they didn\'t know, tailors the message, and takes control of the sale. '+
       'Niceness ties the game; perspective sells.',
  juego:'You negotiated with a big customer. Whoever taught at that table, won.',
  cuando:function(e,c){ return !!e.eventosVistos.clientegrande; } },

{ id:'predictable', pilar:'growth', titulo:'Predictable Revenue', autor:'Aaron Ross',
  concepto:'The revenue machine',
  idea:'Predictable revenue comes from specializing: whoever prospects doesn\'t close, whoever closes doesn\'t '+
       'do support. The funnel becomes a factory with metrics per stage instead of one heroic '+
       'salesperson who walks out one day with the Rolodex.',
  juego:'Your revenue already covers the burn: time for it to stop depending on miracles.',
  cuando:function(e,c){ return e.mrr > Motor.burnMensual(e) && e.etapa !== 'semilla'; } },

{ id:'contagious', pilar:'growth', titulo:'Contagious', autor:'Jonah Berger',
  concepto:'Why things get shared',
  idea:'Things don\'t get shared because they\'re good: they get shared because they confer social status, '+
       'have triggers in daily life, stir emotion, are visible in public, or tell a story. '+
       'Word of mouth gets designed, not prayed for.',
  juego:'Your product is spreading by word of mouth on its own. Someone looks good telling the story.',
  cuando:function(e,c){ return e.viral >= 1.3 && Motor.usuarios(e) > 800; } },

{ id:'pricing', pilar:'growth', titulo:'Monetizing Innovation', autor:'Madhavan Ramanujam',
  concepto:'Price before product',
  idea:'72% of new products fail to monetize, and the cause is always the same: the '+
       'price got decided at the end. Willingness to pay gets researched BEFORE building — the '+
       'price isn\'t a number, it\'s product design.',
  juego:'You raised the price. Did research decide that, or a cash crunch?',
  cuando:function(e,c){ return e.precioInicio && e.precio > e.precioInicio; } },

{ id:'foundingsales', pilar:'growth', titulo:'Founding Sales', autor:'Pete Kazanjy',
  concepto:'The founder sells first',
  idea:'Nobody can sell your product before you do: not because you\'re good at selling, but because '+
       'the first hundred sales conversations ARE the discovery. Hiring a salesperson to '+
       'dodge that discomfort is throwing away the most expensive learning there is.',
  juego:'You\'re a founder and there\'s revenue: the sales you made yourself count double.',
  cuando:function(e,c){ return e.esFundador && e.mrr > 0; } },

{ id:'purplecow', pilar:'growth', titulo:'Purple Cow', autor:'Seth Godin',
  concepto:'Remarkable or invisible',
  idea:'Advertising died of average: people ignore the good and talk about the remarkable. A purple '+
       'cow in a field tells its own story. If you need to shout for your product to get noticed, the '+
       'problem isn\'t the volume: it\'s the cow.',
  juego:'Your brand crossed 50. Something you do already tells its own story.',
  cuando:function(e,c){ return e.marca >= 50; } },

/* ================= CAPITAL ================= */
{ id:'sandhill', pilar:'capital', titulo:'Secrets of Sand Hill Road', autor:'Scott Kupor',
  concepto:'How a VC thinks',
  idea:'A VC isn\'t looking for good companies: they\'re looking for the vanishingly few that return the '+
       'whole fund. At that table your company isn\'t competing against your market — it\'s competing against '+
       'their portfolio. Understand that math and every weird piece of advice they give you makes sense.',
  juego:'You\'re two rounds in. You know the table; now know its incentives.',
  cuando:function(e,c){ return e.rondas.length >= 2; } },

{ id:'wasserman', pilar:'capital', titulo:'The Founder\'s Dilemmas', autor:'Noam Wasserman',
  concepto:'Rich or king',
  idea:'The uncomfortable finding from studying ten thousand startups: the decisions that maximize your control '+
       'and the ones that maximize your money are almost always opposites. Cofounders, equity, investors: '+
       'every crossroads asks you to choose, and not choosing is choosing badly on both counts.',
  juego:'Your cap table has history now. Every point you gave up was one of these decisions.',
  cuando:function(e,c){ return e.esFundador && e.capTable.fund < 0.6; } },

{ id:'powerlaw', pilar:'capital', titulo:'The Power Law', autor:'Sebastian Mallaby',
  concepto:'The power law',
  idea:'In venture capital there\'s no such thing as average: one investment pays the fund and the rest are '+
       'noise. That math shapes the whole ecosystem — why they push you to grow, why '+
       'they\'d rather you die fast than live small.',
  juego:'You\'ve collected equity in several companies. Most will be worth zero. One, maybe, everything.',
  cuando:function(e,c){ return c && c.equities && c.equities.length >= 3; } },

{ id:'psych', pilar:'capital', titulo:'The Psychology of Money', autor:'Morgan Housel',
  concepto:'Rich vs. free',
  idea:'Money buys options, not things. Nobody goes broke from lack of returns: they go broke from lack '+
       'of margin of safety. Selling a slice while you\'re up isn\'t a lack of faith — it\'s '+
       'understanding that surviving is the prerequisite for everything else.',
  juego:'You sold part of your shares. You\'ll play better without the fear of going broke.',
  cuando:function(e,c){ return (e.ventaSecundaria || 0) > 0; } },

{ id:'voss', pilar:'capital', titulo:'Never Split the Difference', autor:'Chris Voss',
  concepto:'Tactical empathy',
  idea:'An FBI negotiator doesn\'t split the difference with kidnappers. The tools: actually '+
       'listening, labeling emotions, calibrated questions that start with how, and the power of '+
       '"no" as the start of the real conversation.',
  juego:'You signed clean terms: somebody negotiated well at that table. Hopefully you.',
  cuando:function(e,c){ var i; for(i=0;i<e.preferencias.length;i++){ if(e.preferencias[i].mult===1 && !e.preferencias[i].part) return true; } return false; } },

/* ================= PEOPLE ================= */
{ id:'radical', pilar:'gente', titulo:'Radical Candor', autor:'Kim Scott',
  concepto:'Say the thing, with care',
  idea:'The two failures of feedback: aggression without care, and worse, "ruinous empathy" — saying '+
       'nothing to spare feelings, until the problem is indefensible. Caring about the person AND '+
       'challenging them directly aren\'t opposites: they\'re the same act.',
  juego:'Your team hit bottom and recovered. Somewhere in between there were conversations like these.',
  cuando:function(e,c){ return e.moral >= 70 && (e.moralMin || 100) <= 48; } },

{ id:'lencioni', pilar:'gente', titulo:'The Five Dysfunctions of a Team', autor:'Patrick Lencioni',
  concepto:'The trust pyramid',
  idea:'Everything starts at the base: without trust there\'s no honest conflict; without conflict there\'s no '+
       'real commitment; without commitment nobody takes ownership; and without that, results belong to '+
       'no one. Permanent harmony is the symptom, not the health.',
  juego:'Morale is broken. Before processes and OKRs, look at the base of the pyramid.',
  cuando:function(e,c){ return e.moral < 38; } },

{ id:'drive', pilar:'gente', titulo:'Drive', autor:'Daniel Pink',
  concepto:'Autonomy, mastery, purpose',
  idea:'Rewards and punishments work for mechanical tasks and destroy creative ones. What '+
       'moves knowledge work is three things: deciding how (autonomy), getting better at something '+
       '(mastery), and having it matter (purpose). The bonus buys none of them.',
  juego:'Empowered team with high morale: you\'re paying in the right currency.',
  cuando:function(e,c){ return e.empoderado && e.moral >= 75; } },

{ id:'coachb', pilar:'gente', titulo:'Trillion Dollar Coach', autor:'Eric Schmidt and others',
  concepto:'Silicon Valley\'s coach',
  idea:'Bill Campbell coached the founders of Google, Apple and Amazon with simple ideas: the '+
       'team first, trust before everything, and tell the truth fast. Management is a '+
       'people trade that occasionally involves computers.',
  juego:'Two promotions in a row. Somebody is coaching you well — or you learned it alone.',
  cuando:function(e,c){ if (!c || !c.puestos || c.puestos.length < 2) return false;
    return c.puestos[c.puestos.length-1].promocion && c.puestos[c.puestos.length-2].promocion; } },

{ id:'managerpath', pilar:'gente', titulo:'The Manager\'s Path', autor:'Camille Fournier',
  concepto:'Every level is a different job',
  idea:'From doing, to leading doers, to leading leaders: each jump isn\'t more of the same, '+
       'it\'s a new job with new tools. The classic mistake is to keep doing the old '+
       'job, but with meetings.',
  juego:'You made Group PM: your output is now the organization, not your hands.',
  cuando:function(e,c){ return e.rolN >= 3; } },

{ id:'norules', pilar:'gente', titulo:'No Rules Rules', autor:'Reed Hastings and Erin Meyer',
  concepto:'Talent density',
  idea:'Controls exist because of mediocre performers: if you pay above market and move fast on whoever '+
       'doesn\'t deliver, you can erase the rules — vacations, expenses, approvals — and the speed you '+
       'gain pays for all of it. Works only if the density is real.',
  juego:'You fought to keep your star. That\'s how you defend talent density.',
  cuando:function(e,c){ return !!e.eventosVistos.caza; } },

{ id:'deepwork', pilar:'gente', titulo:'Deep Work', autor:'Cal Newport',
  concepto:'Concentration as advantage',
  idea:'Deep work — uninterrupted hours on something hard — keeps getting rarer, '+
       'and therefore more valuable. An organization that protects its people\'s concentration '+
       'competes against companies that live in the chat window.',
  juego:'Focus above 80. Your team is doing work others simply can\'t.',
  cuando:function(e,c){ return e.foco >= 80; } },

{ id:'crucial', pilar:'gente', titulo:'Crucial Conversations', autor:'Patterson, Grenny and others',
  concepto:'The conversation you\'re avoiding',
  idea:'The big problems in an organization are almost always one hard conversation nobody '+
       'had in time. The technique: psychological safety first, facts before judgments, '+
       'and the shared goal visible on the table.',
  juego:'Your political capital is low: there\'s a conversation you owe someone.',
  cuando:function(e,c){ return e.politico < 30; } },

{ id:'walsh', pilar:'gente', titulo:'The Score Takes Care of Itself', autor:'Bill Walsh',
  concepto:'The standard before the scoreboard',
  idea:'Walsh took the worst team in the NFL and won three Super Bowls without talking about winning: he defined '+
       'the standard for how everything gets done — down to how the phone gets answered — and the scoreboard '+
       'sorted itself out. Culture is the how, repeated.',
  juego:'Three mandates delivered in your career. The standard is yours now.',
  cuando:function(e,c){ if (!c || !c.puestos) return false;
    var n=0,i; for(i=0;i<c.puestos.length;i++) if(c.puestos[i].cumplido) n++; return n >= 3; } },

/* ================= TECH (more) ================= */
{ id:'pragmatic', pilar:'tech', titulo:'The Pragmatic Programmer', autor:'Andrew Hunt and David Thomas',
  concepto:'Broken windows',
  idea:'One broken window left unfixed invites breaking the rest: tolerated bad code teaches '+
       'that bad code is tolerated here. Software entropy doesn\'t stop on its own — it stops '+
       'with small constant fixes and pride in the craft.',
  juego:'Tech debt below 15. No broken windows in your building.',
  cuando:function(e,c){ return e.deuda <= 15; } },

{ id:'ousterhout', pilar:'tech', titulo:'A Philosophy of Software Design', autor:'John Ousterhout',
  concepto:'Deep modules',
  idea:'Complexity is THE enemy, and you fight it with deep modules: small interface, '+
       'powerful implementation. Shallow classes and layers that just pass data along multiply '+
       'cognitive load while adding nothing. Design it twice before writing it once.',
  juego:'Architecture above 60: someone is thinking before typing.',
  cuando:function(e,c){ return e.arquitectura >= 60; } },

{ id:'phoenix', pilar:'tech', titulo:'The Phoenix Project', autor:'Gene Kim and others',
  concepto:'IT as a factory floor',
  idea:'A novel about a deploy gone wrong, and the revelation: technology work flows '+
       'like a factory — bottlenecks, invisible work in progress, and one Brent everything '+
       'depends on. Seeing the flow is the first fix.',
  juego:'You went into a freeze: your factory stalled on invisible work.',
  cuando:function(e,c){ return !!e.congelado; } },

{ id:'contdel', pilar:'tech', titulo:'Continuous Delivery', autor:'Jez Humble and David Farley',
  concepto:'If it hurts, do it often',
  idea:'You don\'t fix a painful deploy by doing it less: you fix it by doing it so often it stops '+
       'hurting at all. Automating the path to production — build, test, release — turns the '+
       'Thursday-night event into an everyday non-event.',
  juego:'You turned on continuous deployment. Thursday nights are yours again.',
  cuando:function(e,c){ return !!e.cd; } },

{ id:'releaseit', pilar:'tech', titulo:'Release It!', autor:'Michael Nygard',
  concepto:'Design for Friday at 5pm',
  idea:'The system that passes the tests isn\'t the one that survives production: what survives is the one that assumes '+
       'EVERYTHING will fail — timeouts, circuit breakers, bulkheads. The design question isn\'t '+
       '"does it work?" but "what happens when the thing next to it doesn\'t?".',
  juego:'Two incidents in the same job. Your system needs bulkheads, not patches.',
  cuando:function(e,c){ return e.incidentesPuesto >= 2; } },

{ id:'staffeng', pilar:'tech', titulo:'Staff Engineer', autor:'Will Larson',
  concepto:'Senior isn\'t the ceiling',
  idea:'Past senior there\'s a path that isn\'t management: the staff engineer who operates through '+
       'influence — technical direction, unblocking teams, saying no to the trendy architecture. '+
       'Different job, different currency: context and trust.',
  juego:'You organized teams with clear owners. Someone technical with influence was in the room.',
  cuando:function(e,c){ return !!e.teamTopo; } },

{ id:'elegant', pilar:'tech', titulo:'An Elegant Puzzle', autor:'Will Larson',
  concepto:'Systems of engineering',
  idea:'The problems of a large engineering org are systemic: team sizes, work queues, '+
       'management ratios. Managing by anecdote fails at scale; managing the system '+
       '— sizes, flows, boundaries — is what\'s left.',
  juego:'Your area passed 13 people: welcome to systems problems.',
  cuando:function(e,c){ return (e.ing + e.prod) >= 13; } },

/* ================= WAR STORIES ================= */
{ id:'shoedog', pilar:'historias', titulo:'Shoe Dog', autor:'Phil Knight',
  concepto:'Nike lived on the edge',
  idea:'The Nike founder\'s memoir is an entire decade with no cash: banks kicking him out, a '+
       'Japanese partner who nearly sank him, checks bouncing while the brand explodes. The myth of '+
       'tidy growth is exactly that, a myth: growth eats cash.',
  juego:'Critical runway and you\'re still operating. Knight lived there for ten years.',
  cuando:function(e,c){ return Motor.runwayMeses(e) < 2 && e.vivo; } },

{ id:'badblood', pilar:'historias', titulo:'Bad Blood', autor:'John Carreyrou',
  concepto:'Theranos: compound fraud',
  idea:'A small lie to close a round demands a bigger one to sustain it, until '+
       'the product IS the lie. Theranos didn\'t start as fraud: it got there on the compound '+
       'interest of shortcuts. Nobody wakes up one morning as Elizabeth Holmes.',
  juego:'Your Heat passed 60. This book is a photograph of the end of that road.',
  cuando:function(e,c){ return e.lupa >= 60; } },

{ id:'hatching', pilar:'historias', titulo:'Hatching Twitter', autor:'Nick Bilton',
  concepto:'Cofounders eat each other',
  idea:'Four founders, four versions of the story, and one pattern: in companies worth '+
       'anything, the cofounder fight is the rule, not the exception. Twitter\'s betrayals weren\'t '+
       'caused by malice: they were caused by not talking about power in time.',
  juego:'You had your moment with the ghost cofounder. This is how these books begin.',
  cuando:function(e,c){ return !!e.eventosVistos.socio; } },

{ id:'chaosm', pilar:'historias', titulo:'Chaos Monkeys', autor:'Antonio García Martínez',
  concepto:'The Valley, unfiltered',
  idea:'The cynical, funny version: accelerators as casinos, acquisitions that are layoffs '+
       'with champagne, and the uncomfortable truth that plenty of careers are built on being in the '+
       'right room when the piñata bursts.',
  juego:'You got fired once. This book is going to be funny to you now.',
  cuando:function(e,c){ if (!c || !c.puestos) return false;
    var i; for(i=0;i<c.puestos.length;i++) if(c.puestos[i].despido) return true; return false; } },

{ id:'superpumped', pilar:'historias', titulo:'Super Pumped', autor:'Mike Isaac',
  concepto:'Uber: growth without brakes',
  idea:'The culture that conquered a hundred cities was the same one spying on regulators and burning '+
       'out its own people. The uncomfortable lesson: the traits that win the war are the ones that '+
       'later burn the house down — if nobody draws a line.',
  juego:'You cooked the numbers under pressure. Kalanick started out "winning" too.',
  cuando:function(e,c){ return !!e.eventosVistos.cocinar; } },

{ id:'everything', pilar:'historias', titulo:'The Everything Store', autor:'Brad Stone',
  concepto:'Amazon: scale as religion',
  idea:'Bezos built on an uncomfortable idea: your margin is my opportunity. Floor prices, '+
       'years of losses and operational obsession, betting that scale buys what early '+
       'profitability never can: inevitability.',
  juego:'You saturated the scale need. You\'re playing Bezos\'s long game.',
  cuando:function(e,c){ return (e.cobertura.escala || 0) >= 70; } },

{ id:'masters', pilar:'historias', titulo:'Masters of Scale', autor:'Reid Hoffman',
  concepto:'What scales and what doesn\'t',
  idea:'From the podcast to the page: founders recounting the exact moment something small went '+
       'huge. The repeated pattern: first make something a hundred people love, then — and only '+
       'then — worry about the millions.',
  juego:'Your organization passed 18 people. The people-scaling game has begun.',
  cuando:function(e,c){ return (e.ing + e.prod + e.gtm) >= 18; } },

{ id:'lostfounder', pilar:'historias', titulo:'Lost and Founder', autor:'Rand Fishkin',
  concepto:'The startup, unfiltered',
  idea:'The founder of Moz telling what nobody tells: the down round, the depression, the board that '+
       'smiles at you while voting on your replacement, and the VC math that turns a good '+
       'company into a disappointment. Honesty as a literary genre.',
  juego:'You went through a down round. Fishkin wrote this book for this exact moment.',
  cuando:function(e,c){ return !!e.eventosVistos.downround; } }
];

function libroPorId(id) {
  for (var i = 0; i < LIBROS.length; i++) if (LIBROS[i].id === id) return LIBROS[i];
  return null;
}

/* Pillars for the library */
var PILARES = [
  { id:'startup',  nombre:'Startup',      cls:'pil-s' },
  { id:'producto', nombre:'Product',      cls:'pil-p' },
  { id:'tech',     nombre:'Tech',         cls:'pil-t' },
  { id:'yc',       nombre:'YC & essays',  cls:'pil-y' },
  { id:'growth',   nombre:'Growth & sales', cls:'pil-g' },
  { id:'capital',  nombre:'Capital',      cls:'pil-c' },
  { id:'gente',    nombre:'People',       cls:'pil-e' },
  { id:'historias',nombre:'War stories',  cls:'pil-h' }
];
function pilarDe(id) {
  for (var i = 0; i < PILARES.length; i++) if (PILARES[i].id === id) return PILARES[i];
  return PILARES[0];
}

/* Contextual cards: they open when the run lives through the concept.
   Max 2 per month so the drip doesn't muddy the endgame. */
function fichasNuevas(e, c) {
  var out = [], i;
  if (!e || !c) return out;
  for (i = 0; i < LIBROS.length && out.length < 2; i++) {
    var l = LIBROS[i];
    if (!l.cuando || c.codex[l.id]) continue;
    var ok = false;
    try { ok = l.cuando(e, c); } catch (err) { ok = false; }
    if (ok) { c.codex[l.id] = true; out.push(l); }
  }
  return out;
}

/* ================================================================
   Applied to your case: each function takes the current job and
   returns the theory applied to YOUR numbers today. Shown when
   opening a card and when deciding a dilemma. Strict ES5.
   ================================================================ */
var APLICAR = {

  lean: function (e) {
    var n = Math.round(e.evidencia);
    if (n < 40) return 'Your evidence sits at ' + n + ': what you see in the backlog is noise with a number\'s face on it. ' +
      'Every bet you build now is an untested hypothesis — and you\'ve already seen how far real impact drifts from expected.';
    if (n < 70) return 'Evidence ' + n + ': you half-know. Your estimates are getting closer, but the build-measure-learn loop still has a weak second step.';
    return 'Evidence ' + n + ': you\'re deciding on real data. Careful: it decays on its own every month — validated learning expires.';
  },

  momtest: function (e) {
    if (e.calidadDesc >= 1) return 'You chose to ask about past facts: your interviews at ' + e.empresa +
      ' produce usable data. That\'s why your backlog ≈ estimates converge on the truth.';
    return 'At ' + e.empresa + ' interviews are fishing for opinions (quality ' + Math.round(e.calidadDesc * 100) +
      '%): people are being nice to you, not honest. Your estimates come pre-inflated by that bias.';
  },

  fowler: function (e) {
    var tax = Math.round((e.deuda / 100) * 55);
    return 'Your debt sits at ' + Math.round(e.deuda) + ': this month the whole team loses ~' + tax +
      '% of its capacity paying that interest. With ' + (e.ing + e.prod) + ' people building, it\'s as if ' +
      Math.round((e.ing + e.prod) * tax / 100) + ' worked only for the past.';
  },

  brooks: function (e) {
    if (e.rampa.length) return 'You have ' + e.rampa.length + ' person(s) ramping up: they don\'t produce yet, and they cost ' +
      (e.rampa.length * 6) + ' pts of mentoring per month from the ones who did. Brooks\' law, live.';
    return 'Nobody is ramping today. If you hire, remember: every hire is 2 months of zero output plus 6 pts/month of everyone else\'s mentoring.';
  },

  chasm: function (e) {
    var r = Motor.requisitosGate(e), ok = 0, i;
    for (i = 0; i < r.length; i++) if (r[i].ok) ok++;
    var g = Motor.compuerta(e, 'pragm');
    if (g >= 1) return 'You crossed: you meet all ' + r.length + ' requirements of "' + e.gateNombre + '" and the big market is buying.';
    return 'Your gate is "' + e.gateNombre + '": you meet ' + ok + ' of ' + r.length + ' requirements, so the big market ' +
      'converts at ' + Math.round(g * 100) + '% of normal. Everything you spend on reach toward them leaks away in that proportion.';
  },

  sre: function (e) {
    return 'Your error budget is at ' + Math.round(e.presupuestoError) + '/100 this quarter' +
      (e.congelado ? ' — spent: that\'s why you\'re in a freeze and barely anything gets built.' :
       e.presupuestoError < 40 ? '. One more incident and it\'s gone: the freeze flips priorities on its own.' :
       '. You have margin to move fast; that\'s what it\'s for.');
  },

  ddia: function (e) {
    var c = Math.round(Motor.carga(e) * 100);
    return 'Your load is at ' + c + '% of what ' + e.empresa + '\'s architecture can take. ' +
      (c > 85 ? 'You\'re in the zone where invisible assumptions snap all at once: outage probability grows non-linearly from here.' :
       c > 60 ? 'It still breathes, but if users grow faster than the architecture, success takes you down.' :
       'There\'s headroom. The cheap moment to invest in scale is before you need it.');
  },

  topologies: function (e) {
    var tam = e.ing + e.prod, umbral = (e.teamTopo ? 12 : 8) + Math.round(e.hab.liderazgo / 12);
    if (tam > umbral) return 'Your area has ' + tam + ' people and the cognitive ceiling is ' + umbral +
      ': every person above it yields less. Effort won\'t fix it: cutting the system into owned teams will.';
    return 'Area of ' + tam + ' with a ceiling of ' + umbral + ': the cognitive load still fits in people\'s heads. When you grow, cut along boundaries, not layers.';
  },

  deals: function (e) {
    if (!e.preferencias.length) return 'You haven\'t signed terms at ' + e.empresa + ' yet. When the sheet arrives: the valuation is the headline; the liquidation preference is the fine print that decides what you take home.';
    var pref = 0, part = false, i;
    for (i = 0; i < e.preferencias.length; i++) { pref += e.preferencias[i].monto * e.preferencias[i].mult; if (e.preferencias[i].part) part = true; }
    return 'There\'s $' + Math.round(pref / 1000000) + 'M of ' + (part ? 'PARTICIPATING ' : '') + 'preferences ahead of you in the waterfall: in any exit, that gets paid first' +
      (part ? ' and then takes a cut of the rest too. The round\'s headline was pretty; this line is the one that matters.' : '.');
  },

  analytics: function (e) {
    return 'Your total users only ever go up — which is why they soothe and don\'t inform. The number that decides is retention: today ' +
      Math.round(Motor.retencionMedia(e) * 100) + '% monthly. At that rate, of every 100 who join today, ' +
      Math.round(Math.pow(Motor.retencionMedia(e), 6) * 100) + ' are left in six months. That\'s your truth.';
  },

  hooked: function (e) {
    var r = Math.round(Motor.retencionMedia(e) * 100);
    return 'Retention ' + r + '%: ' + (r >= 90 ? 'there\'s a real habit — the internal trigger exists and word of mouth flows from here.' :
      'no loop yet. Ask yourself what the user deposits inside ' + e.empresa + ' that makes the next visit worth more than the last.');
  },

  krug: function (e) {
    var u = Math.round(e.usabilidad);
    return 'Usability ' + u + ': the conversion of ALL your traffic gets multiplied by ~' +
      (Math.round((0.35 + u / 100 * 0.65) * 100) / 100) + ' on this variable alone. ' +
      (u < 50 ? 'It\'s the cheapest lever you have, and you\'re paying for it with every visitor who walks.' : 'It\'s working in your favor.');
  },

  grove: function (e) {
    return 'Your output is your organization\'s: with morale ' + Math.round(e.moral) + ' and focus ' + Math.round(e.foco) +
      ', the team runs at ~' + Math.round((0.75 + e.moral / 100 * 0.35) * (0.85 + e.foco / 100 * 0.30) * 100) +
      '% of its baseline. Raising those two numbers is pure leverage: it multiplies everything else you do.';
  },

  torres: function (e) {
    return 'Your evidence drops ' + (e.cadenciaDesc ? '1.5' : '3.5') + ' points per month ' +
      (e.cadenciaDesc ? 'because you installed the weekly cadence: continuous discovery slows the evaporation.' :
       'because you discover in bursts. Torres would say: it\'s not a project, it\'s a habit — and yours doesn\'t exist yet.');
  },

  inspired: function (e) {
    return 'You\'ve shipped ' + e.apuestasCompletadas + ' bets at ' + e.empresa + ' with evidence ' + Math.round(e.evidencia) +
      '. Cagan would ask: did you attack value risk BEFORE building, or are you validating the feasibility of things nobody asked for?';
  },

  trap: function (e) {
    return e.fabrica ? e.empresa + ' is in factory mode: a dates roadmap, success measured in deliveries. You\'ll ship a lot and move little — the final report card scores outcomes.' :
      'You\'re managing by outcomes, not deliverables. Holding that line costs political capital every time sales asks for dates; it\'s worth it.';
  },

  zero: function (e) {
    var a = Math.round(e.competidor.atencion * 100);
    return 'The competitor is paying you ' + a + '% attention. ' +
      (a < 30 ? 'You\'re invisible: that\'s free time to deepen your difference before they copy you.' :
       'They\'re watching now: feature parity from here is a race won by whoever\'s ahead. Your only way out is being different at something they don\'t want to copy.');
  },

  innov: function (e) {
    return e.precio > (e.precioInicio || e.precio) ?
      'You raised the price from $' + e.precioInicio + ' to $' + e.precio + ': the classic march upmarket. Christensen\'s warning: every step you climb leaves the one below empty — that\'s where they\'ll come in.' :
      'You\'re still at the entry tier ($' + e.precio + '). Boring and correct: the disruptor grows from below while the leader stares at its best customers.';
  },

  hard: function (e) {
    var run = Motor.runwayMeses(e);
    return 'Today at ' + e.empresa + ': runway ' + (run > 90 ? 'infinite' : run.toFixed(1) + ' months') + ', political capital ' + Math.round(e.politico) +
      '. Horowitz would say: there\'s no perfect move from here — pick fast between bad options and own it. Stalling is also a choice.';
  },

  accelerate: function (e) {
    return e.cd ? 'With continuous deployment on: small batches, lower incident risk and +12% capacity. The paradox, confirmed: you\'re faster AND more stable.' :
      'You still deploy by event. The book\'s data: elite teams deploy more often AND fail less. Your big batch isn\'t protecting you — it\'s the cause of the risk.';
  },

  pgdefault: function (e) {
    var run = Motor.runwayMeses(e);
    var crece = e.hist.length >= 2 && e.hist[e.hist.length - 1].mrr > e.hist[e.hist.length - 2].mrr * 1.03;
    if (e.mrr > Motor.burnMensual(e)) return e.empresa + ' is DEFAULT ALIVE: revenue already covers the burn. From here, nobody can kill you.';
    return e.empresa + ' is DEFAULT DEAD today: burn $' + Math.round(Motor.burnMensual(e) / 1000) + 'k against revenue $' + Math.round(e.mrr / 1000) +
      'k, runway ' + (run > 90 ? '∞' : run.toFixed(1) + 'm') + (crece ? ', but revenue is growing: the question is whether it gets there before the zero does.' : ' and revenue isn\'t growing. THAT is the problem, not the roadmap.');
  },

  seibel: function (e) {
    var f = Math.round(Motor.fitMax(e) * 100);
    return 'Your best fit is at ' + f + '%. ' + (f >= 70 ? 'You can start to feel it: if demand isn\'t drowning you yet, you\'re close.' :
      'Seibel would be brutal: you don\'t have it, and until you do, every other priority — growing, scaling, hiring — is premature.');
  },

  badblood: function (e) {
    return 'Your Heat is at ' + Math.round(e.lupa) + '. Theranos started with a lie this size to close a round: ' +
      'the compound interest of shortcuts is the book\'s thesis, and your meter is already running.';
  },

  wasserman: function (e) {
    return e.esFundador ? 'You hold ' + Math.round(e.capTable.fund * 100) + '% of ' + e.empresa +
      ': every decision from here on will ask you to choose between control and value. Rich or king — almost never both.' :
      'As an employee your dilemma is the mirror image: authority today versus equity that vests tomorrow. Choose it consciously on the next offer.';
  },

  pricing: function (e) {
    return 'Your price today: $' + e.precio + '/mo' + (e.precio !== e.precioInicio ? ' (you started at $' + e.precioInicio + ')' : '') +
      '. The book\'s question: did willingness-to-pay research decide that, or is it left over from the original pitch? Price is product design.';
  }
};

function aplicarLibro(id, e) {
  if (!e || !APLICAR[id]) return null;
  var t = null;
  try { t = APLICAR[id](e); } catch (err) { t = null; }
  return t;
}
