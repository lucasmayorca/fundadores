/* Biblioteca: los libros que el juego usa como modelo mental.
   Cada ficha explica el concepto en mis palabras y dice cómo lo simula el motor.
   Sin build ni dependencias. */

var LIBROS = [

/* ---------------- STARTUP ---------------- */
{ id:'lean', pilar:'startup',
  titulo:'The Lean Startup', autor:'Eric Ries',
  concepto:'Aprendizaje validado',
  idea:'Una startup no es una empresa chica: es un experimento para averiguar si '+
       'un negocio puede existir. Lo que produces no son features, es conocimiento. '+
       'El ciclo construir-medir-aprender solo cuenta cuando cierras el circuito completo, '+
       'no solo el primer tramo, y cuando la evidencia dice que tu hipótesis estaba mal, la '+
       'respuesta honesta es pivotar en vez de remar más fuerte.',
  juego:'Tu "evidencia" es una variable real. Con evidencia baja, las estimaciones de impacto '+
        'que ves en el backlog son ruido disfrazado de números.' },

{ id:'zero', pilar:'startup',
  titulo:'Zero to One', autor:'Peter Thiel',
  concepto:'Diferénciate, no compitas',
  idea:'Copiar lo que ya existe te arrastra a una guerra de márgenes que no vas a ganar. '+
       'El valor se captura siendo defendiblemente distinto en un nicho chico '+
       'que puedas dominar, no siendo 5% mejor que el líder en su propia cancha.',
  juego:'Construir paridad con el competidor apenas mueve tu fit y lo despierta. '+
        'Cubrir necesidades que él ignora te da crecimiento que no puede copiar rápido.' },

{ id:'chasm', pilar:'startup',
  titulo:'Crossing the Chasm', autor:'Geoffrey Moore',
  concepto:'El abismo y el producto completo',
  idea:'Los visionarios te compran por una promesa; los pragmáticos compran algo que ya '+
       'funciona para alguien como ellos. Entre esos dos grupos hay un abismo: '+
       'no lo cruzas con más marketing, lo cruzas eligiendo un nicho angosto '+
       'y entregándoles todo lo que necesitan para sentir riesgo cero — integraciones, '+
       'soporte, referencias, seguridad.',
  juego:'La mayoría temprana está detrás de una compuerta. Falla sus requisitos y tu '+
        'gasto en crecimiento se evapora, por mucho que te amen los early adopters.' },

{ id:'innov', pilar:'startup',
  titulo:'The Innovator\'s Dilemma', autor:'Clayton Christensen',
  concepto:'Disrupción desde abajo',
  idea:'Las empresas grandes no pierden por tontas: pierden por escuchar a sus '+
       'mejores clientes, que siempre piden más de lo mismo. Eso las empuja '+
       'hacia arriba y deja la gama baja abierta de par en par — justo donde un producto '+
       'peor pero más simple puede crecer sin que nadie reaccione.',
  juego:'El competidor tiene "atención". Ve por su segmento premium y te aplasta; '+
        'crece desde abajo y te ignora hasta que para él ya es tarde.' },

{ id:'hard', pilar:'startup',
  titulo:'The Hard Thing About Hard Things', autor:'Ben Horowitz',
  concepto:'Decisiones sin opción buena',
  idea:'Los problemas de verdad difíciles no tienen una respuesta correcta esperando a ser '+
       'encontrada: tienen dos caminos malos, y hay que elegir uno rápido y '+
       'hacerse cargo. Los manuales funcionan en tiempos de paz; en guerra solo queda '+
       'cuidar a tu gente y decir la verdad temprano.',
  juego:'Varios dilemas no tienen opción óptima. Estancarse también es una decisión, y el '+
        'motor te la cobra.' },

{ id:'deals', pilar:'startup',
  titulo:'Venture Deals', autor:'Brad Feld and Jason Mendelson',
  concepto:'Los términos importan más que la valuación',
  idea:'El titular de una ronda es la valuación, pero lo que decide cuánto te llevas a casa '+
       'vive en la letra chica: preferencia de liquidación, si es participativa, y de qué '+
       'lado de la ronda sale el pool de opciones. Una valuación alta con '+
       'términos brutales puede dejarte menos que una baja y limpia.',
  juego:'Los term sheets son reales. Al final del juego ves la cascada del exit '+
        'y lo que de verdad te costó cada cláusula que firmaste.' },

{ id:'grove', pilar:'startup',
  titulo:'High Output Management', autor:'Andy Grove',
  concepto:'Apalancamiento gerencial',
  idea:'El output de un gerente es el output de su organización, no el propio. '+
       'Así que mide tus actividades por cuánto multiplican el trabajo de todos '+
       'los demás, y vigila indicadores tempranos en vez de enterarte del '+
       'problema cuando ya explotó.',
  juego:'La moral, el foco y la estructura multiplican tu capacidad. Sin ellos, sumar gente '+
        'produce menos de lo que cuesta.' },

/* ---------------- PRODUCTO ---------------- */
{ id:'inspired', pilar:'producto',
  titulo:'Inspired', autor:'Marty Cagan',
  concepto:'Los cuatro riesgos',
  idea:'Antes de construir, atacas cuatro riesgos separados: si alguien lo va a querer, '+
       'si van a poder usarlo, si podemos construirlo y si tiene sentido para '+
       'el negocio. Los equipos que reciben una lista de features cerrada nunca tocan '+
       'los dos primeros — los que matan productos.',
  juego:'Cada apuesta del backlog cubre una necesidad concreta. Construir sin haber '+
        'desactivado primero el riesgo de valor es apostar a ciegas.' },

{ id:'torres', pilar:'producto',
  titulo:'Continuous Discovery Habits', autor:'Teresa Torres',
  concepto:'Cadencia de discovery',
  idea:'El discovery no es una fase que haces al inicio: es un hábito semanal '+
       'del mismo equipo que construye. Mapeas oportunidades reales que salen de '+
       'entrevistas, y solo entonces piensas soluciones — siempre varias en paralelo '+
       'para poder compararlas.',
  juego:'La evidencia decae sola cada sprint. Descubrir a ráfagas no alcanza: '+
        'hay que sostener la cadencia.' },

{ id:'momtest', pilar:'producto',
  titulo:'The Mom Test', autor:'Rob Fitzpatrick',
  concepto:'Pregunta por el pasado, no por el futuro',
  idea:'Pregúntale a la gente si le gusta tu idea y todos van a mentir para no herirte. '+
       'Las respuestas útiles salen de hechos: qué hicieron la última vez que tuvieron '+
       'el problema, qué les costó, qué intentaron. Los cumplidos son ruido; '+
       'los compromisos concretos son datos.',
  juego:'Esto define la calidad de tu discovery. Las malas entrevistas no te dejan sin '+
        'información: te entregan información falsa y optimista — que es peor.' },

{ id:'trap', pilar:'producto',
  titulo:'Escaping the Build Trap', autor:'Melissa Perri',
  concepto:'Resultados, no entregables',
  idea:'La trampa es medir el éxito por cuánto se lanzó en vez de por qué '+
       'cambió en el comportamiento del usuario o del negocio. Un roadmap repleto de '+
       'features es una lista de outputs disfrazada de estrategia.',
  juego:'Lanzar mucho no mueve nada si las apuestas no tocan necesidades reales. '+
        'Tu boleta final califica resultados, no features lanzados.' },

{ id:'hooked', pilar:'producto',
  titulo:'Hooked', autor:'Nir Eyal',
  concepto:'El circuito del hábito',
  idea:'Los productos que se usan solos cierran un circuito: un gatillo lleva a una '+
       'acción simple, la acción paga una recompensa algo variable, y el usuario deja '+
       'algo suyo adentro que hace que la próxima vuelta valga más. Ese depósito es '+
       'lo que convierte uso en hábito.',
  juego:'La retención alimenta el boca a boca. Pero forzar el circuito sin valor real '+
        'infla el uso a corto plazo y quema tu marca.' },

{ id:'krug', pilar:'producto',
  titulo:'Don\'t Make Me Think', autor:'Steve Krug',
  concepto:'Fricción y activación',
  idea:'Nadie lee tu interfaz: la escanea y adivina. Cada momento en que alguien tiene '+
       'que detenerse a pensar qué hacer es una fuga, y esas fugas se acumulan '+
       'en silencio a lo largo del camino hacia tu producto.',
  juego:'La usabilidad multiplica la conversión de TODO el tráfico que traes. Es la '+
        'palanca más barata que existe y la que todos postergan.' },

{ id:'analytics', pilar:'producto',
  titulo:'Lean Analytics', autor:'Alistair Croll and Benjamin Yoskovitz',
  concepto:'Métricas de vanidad vs. accionables',
  idea:'Los totales acumulados solo saben subir, y por eso no te dicen nada. Las métricas '+
       'que importan son tasas y cohortes, comparadas contra una línea que dibujaste '+
       'antes — y quieres exactamente una que importe por etapa.',
  juego:'El HUD muestra los usuarios totales bien grandes. La retención por segmento sale '+
        'más chica — y es la que decide si sobrevives.' },

/* ---------------- TECNOLOGÍA ---------------- */
{ id:'accelerate', pilar:'tech',
  titulo:'Accelerate', autor:'Nicole Forsgren, Jez Humble and Gene Kim',
  concepto:'Velocidad y estabilidad no son un trade-off',
  idea:'La intuición dice que ir más rápido rompe más cosas, y los datos dicen lo '+
       'contrario: los equipos que despliegan seguido y en lotes chicos también '+
       'fallan menos y se recuperan más rápido. Los releases grandes y espaciados son la '+
       'causa del riesgo, no la protección contra él.',
  juego:'Invertir en plataforma baja la probabilidad de incidentes Y sube tu capacidad. '+
        'No es un impuesto: es la palanca compuesta.' },

{ id:'brooks', pilar:'tech',
  titulo:'The Mythical Man-Month', autor:'Fred Brooks',
  concepto:'La ley de Brooks y la ley de Conway',
  idea:'Sumar gente a un proyecto atrasado lo atrasa más, porque los nuevos '+
       'todavía no producen y queman el tiempo de los que sí, mientras los '+
       'canales de comunicación crecen mucho más rápido que el equipo. Y el sistema '+
       'que sale del otro lado copia la forma de la organización que lo construyó.',
  juego:'Cada contratación tarda dos sprints en producir y te cobra mentoría mientras '+
        'tanto. Contrata cinco de golpe y tu trimestre desapareció.' },

{ id:'sre', pilar:'tech',
  titulo:'Site Reliability Engineering', autor:'Google (Beyer, Jones, Petoff, Murphy)',
  concepto:'Presupuesto de error',
  idea:'100% de disponibilidad es la meta equivocada: cuesta una fortuna y nadie lo '+
       'nota. Acuerda una meta realista, y la brecha hasta el 100% se vuelve un '+
       'presupuesto que puedes gastar a propósito para ir más rápido — y cuando se acaba, '+
       'las prioridades se invierten solas sin que nadie tenga que discutirlo.',
  juego:'Tienes un presupuesto de error por trimestre. Quémalo, y el siguiente sprint '+
        'entra en congelamiento y no puedes construir.' },

{ id:'topologies', pilar:'tech',
  titulo:'Team Topologies', autor:'Matthew Skelton and Manuel Pais',
  concepto:'La carga cognitiva como límite',
  idea:'Un equipo tiene un techo de cuánto sistema puede sostener en la cabeza, y una vez '+
       'que lo revientas, el esfuerzo no lo arregla. El arreglo es cortar el trabajo por '+
       'fronteras que un equipo pueda ser dueño de punta a punta, y hacer explícitas las '+
       'interacciones entre equipos en vez de improvisarlas.',
  juego:'Pasado cierto tamaño, cada persona nueva rinde menos hasta que te reorganizas '+
        'en equipos con fronteras claras.' },

{ id:'ddia', pilar:'tech',
  titulo:'Designing Data-Intensive Applications', autor:'Martin Kleppmann',
  concepto:'La escala rompe supuestos',
  idea:'Una arquitectura no se degrada con gracia: aguanta, y aguanta, y en algún '+
       'punto de carga colapsa de golpe porque un supuesto que nunca viste dejó de '+
       'ser cierto. Mejor diseñar sabiendo dónde está ese punto que descubrirlo '+
       'un martes a medianoche.',
  juego:'Si los usuarios crecen más rápido que tu arquitectura, la probabilidad de '+
        'incidentes se dispara de forma no lineal. El éxito es lo que te tumba.' },

{ id:'fowler', pilar:'tech',
  titulo:'Refactoring', autor:'Martin Fowler',
  concepto:'Deuda técnica e interés compuesto',
  idea:'Tomar un atajo es pedir tiempo prestado, y como todo préstamo paga intereses: '+
       'cada cambio futuro cuesta un poco más. Se paga en cuotas chicas y '+
       'continuas mientras trabajas; la reescritura desde cero es casi siempre '+
       'la forma más cara de pagar la misma deuda.',
  juego:'La deuda le cobra un porcentaje a TODA tu capacidad, cada sprint, para siempre. '+
        'Es la variable que la mayoría deja crecer sin mirarla.' }
,

/* ================= YC Y ENSAYOS ================= */
{ id:'pgdefault', pilar:'yc', titulo:'Default Alive or Default Dead?', autor:'Paul Graham',
  concepto:'Vivo o muerto por defecto',
  idea:'La pregunta que casi nadie hace a tiempo: si nada cambia, a este ritmo de crecimiento y con este '+
       'burn, ¿llegas a rentabilidad antes de que se acabe la caja? Si la respuesta es no, estás "muerto '+
       'por defecto" y cada decisión que tomes debería ser otra. No saberlo es la forma más común de morir.',
  juego:'Esto se abrió porque tu runway cayó debajo de 7 meses. Ahora responde la pregunta.',
  cuando:function(e,c){ return Motor.runwayMeses(e) < 7; } },

{ id:'pgscale', pilar:'yc', titulo:'Do Things That Don\'t Scale', autor:'Paul Graham',
  concepto:'Haz cosas que no escalan',
  idea:'Al principio, recluta usuarios a mano, uno por uno, y dales un servicio absurdamente bueno. '+
       'Lo que no escala es justo lo que te enseña qué construir. Escalar es un problema que ojalá '+
       'tengas después; hoy tu problema es que a alguien le importe.',
  juego:'En etapa semilla, el discovery manual le gana a cualquier campaña.',
  cuando:function(e,c){ return e.etapa === 'semilla' && e.mesPuesto <= 3; } },

{ id:'pgmakers', pilar:'yc', titulo:'Maker\'s Schedule, Manager\'s Schedule', autor:'Paul Graham',
  concepto:'Dos agendas incompatibles',
  idea:'El que construye necesita bloques largos; el que gestiona vive en casillas de una hora. Una '+
       'sola reunión mal puesta destroza la tarde entera de un maker. Mezclar las dos agendas sin '+
       'darse cuenta destruye más capacidad que cualquier bug.',
  juego:'Tu foco cayó debajo de 40: la capacidad efectiva del equipo cae con él.',
  cuando:function(e,c){ return e.foco < 40; } },

{ id:'pgramen', pilar:'yc', titulo:'Ramen Profitability', autor:'Paul Graham',
  concepto:'Rentabilidad ramen',
  idea:'El punto donde los ingresos cubren los fideos de los fundadores. No es éxito: es libertad. '+
       'Desde ahí nadie puede matarte — ni el mercado de capitales, ni un inversionista impaciente — y eso '+
       'cambia el tono de cada negociación que tengas.',
  juego:'Tus ingresos superaron tu burn en etapa semilla. El reloj de la muerte acaba de detenerse.',
  cuando:function(e,c){ return e.etapa === 'semilla' && e.mrr > Motor.burnMensual(e); } },

{ id:'pgdie', pilar:'yc', titulo:'How Not to Die', autor:'Paul Graham',
  concepto:'No morir es una habilidad',
  idea:'A las startups casi nunca las asesinan: se suicidan. Los fundadores se cansan, se pelean, '+
       'aceptan un empleo. Si simplemente no mueres y algo mejora cada semana, el tiempo empieza '+
       'a jugar para ti. Sobrevivir feo también cuenta como sobrevivir.',
  juego:'Llevaste la caja al límite y sigues aquí. Esto es exactamente lo que él quería decir.',
  cuando:function(e,c){ return e.caja < Motor.burnMensual(e) * 2 && e.mesPuesto > 3; } },

{ id:'yclaunch', pilar:'yc', titulo:'Launch Now', autor:'Y Combinator',
  concepto:'Lanza ya',
  idea:'Si tu primera versión no te da un poco de vergüenza, lanzaste tarde. Lanzar no es '+
       'el final del desarrollo: es el inicio del aprendizaje. Todo lo que hiciste antes de tener usuarios '+
       'reales fue, en el mejor caso, una hipótesis bien escrita.',
  juego:'Lanzaste tu primera apuesta: recién ahora existe el "impacto real".',
  cuando:function(e,c){ return e.apuestasCompletadas >= 1; } },

{ id:'yctalk', pilar:'yc', titulo:'Write Code and Talk to Users', autor:'Y Combinator',
  concepto:'El mantra de YC',
  idea:'Escribe código y habla con usuarios: todo lo demás es opcional. La mitad de los fundadores '+
       'hace solo lo primero y construye en el vacío; la otra mitad no hace más que reuniones. El circuito '+
       'completo son las dos cosas, cada semana.',
  juego:'Este mes hiciste discovery Y construcción. Ese es el circuito.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.desc > 0 && e.gastoPropio.cons > 0; } },

{ id:'ycgrowth', pilar:'yc', titulo:'Startup = Growth', autor:'Paul Graham',
  concepto:'Startup significa crecimiento',
  idea:'Una startup no es una empresa nueva ni una empresa de tecnología: es una empresa diseñada '+
       'para crecer rápido. Ese compromiso define todo lo demás — qué problemas valen la pena, qué mercados '+
       'funcionan, cuánta prolijidad puedes permitirte.',
  juego:'Creciste más de 15% en un mes. A esto viniste.',
  cuando:function(e,c){ var h = e.hist; if (h.length < 2) return false;
    var a = h[h.length-2].u, b = h[h.length-1].u; return a > 100 && b > a * 1.15; } },

{ id:'pgfund', pilar:'yc', titulo:'A Fundraising Survival Guide', autor:'Paul Graham',
  concepto:'Sobrevivir el levantamiento',
  idea:'Levantar plata es un segundo trabajo de tiempo completo que nadie pidió. Las reglas: hazlo '+
       'rápido, en paralelo, sin enamorarte de ningún fondo, y vuelve a construir. El peor '+
       'estado posible es el eterno "casi cerramos", que se come empresas enteras.',
  juego:'Cerraste tu primera ronda. Ahora vuelve al producto.',
  cuando:function(e,c){ return e.rondas.length >= 1; } },

{ id:'pgmean', pilar:'yc', titulo:'Mean People Fail', autor:'Paul Graham',
  concepto:'A los malvados les va mal, tarde o temprano',
  idea:'En startups, la maldad sale cara: espanta a la gente buena, cierra puertas que no sabías '+
       'que existían, y te deja rodeado solo de gente que negocia como tú. Jugar limpio no es solo '+
       'ética: es, egoístamente, la mejor estrategia disponible.',
  juego:'La Lupa está sobre ti. Esta ficha se abre sola cuando eso pasa.',
  cuando:function(e,c){ return e.lupa >= 35; } },

{ id:'pgrr', pilar:'yc', titulo:'Relentlessly Resourceful', autor:'Paul Graham',
  concepto:'Implacablemente recursivo',
  idea:'Graham salió a buscar dos palabras que definieran a un buen fundador y aterrizó en estas: implacable y '+
       'recursivo. Niégate a aceptar el mundo como viene — pero adapta los medios, nunca la '+
       'meta. Lo opuesto de quedarse quieto con elegancia.',
  juego:'Estás operando en lo más hondo de un invierno de capital. Hora de demostrarlo.',
  cuando:function(e,c){ return e.eraId === 'invierno' && e.mesPuesto > 4; } },

{ id:'seibel', pilar:'yc', titulo:'The Real Product-Market Fit', autor:'Michael Seibel',
  concepto:'El PMF de verdad',
  idea:'El product-market fit no es sentirse bien con el producto: es ahogarse en demanda que no '+
       'puedes atender, con los servidores sufriendo y los clientes insistiendo. Si tienes que preguntar si '+
       'lo tienes, no lo tienes — y encontrarlo es tu único trabajo.',
  juego:'Tu fit pasó de 0,7 en algún segmento. Esto empieza a parecerse.',
  cuando:function(e,c){ return Motor.fitMax(e) > 0.72; } },

/* ================= STARTUP (más) ================= */
{ id:'blank', pilar:'startup', titulo:'The Four Steps to the Epiphany', autor:'Steve Blank',
  concepto:'Desarrollo de clientes',
  idea:'El libro que arrancó todo el movimiento lean: los hechos no viven en tu oficina, viven '+
       'afuera del edificio. Los clientes se descubren con el mismo rigor con el que construyes el '+
       'producto — por fases, con hipótesis, y antes de escalar nada.',
  juego:'Llegaste a evidencia 70. De verdad saliste del edificio.',
  cuando:function(e,c){ return e.evidencia >= 70; } },

{ id:'whatyoudo', pilar:'startup', titulo:'What You Do Is Who You Are', autor:'Ben Horowitz',
  concepto:'Cultura = decisiones',
  idea:'La cultura no es lo que declaras en la pared: es lo que hace tu gente cuando no estás. Se '+
       'define en las decisiones incómodas — a quién asciendes, qué perdonas, qué atajo aceptas. '+
       'Cada una enseña más que cualquier documento de valores.',
  juego:'Tu equipo está mirando cómo decides en la zona gris. Y está aprendiendo.',
  cuando:function(e,c){ return e.moral < 50 && e.lupa >= 25; } },

{ id:'runninglean', pilar:'startup', titulo:'Running Lean', autor:'Ash Maurya',
  concepto:'Itera del plan A al plan que funciona',
  idea:'Tu plan A está casi seguramente mal, y no pasa nada: el trabajo es documentarlo en una '+
       'página, atacar primero la parte más riesgosa, y cambiar de plan con método, no con pánico. El pivote '+
       'es una herramienta, no una derrota.',
  juego:'Pivotaste. Te quedaste con el aprendizaje y soltaste el plan: de eso se trataba.',
  cuando:function(e,c){ return !!e.pivoteHecho; } },

{ id:'blitz', pilar:'startup', titulo:'Blitzscaling', autor:'Reid Hoffman',
  concepto:'Velocidad sobre eficiencia',
  idea:'Cuando el mercado es enorme y el ganador se lleva todo, crecer desordenado le gana a crecer '+
       'bien. Es brutalmente caro, rompe la organización a propósito, y casi siempre es la excusa equivocada '+
       '— pero cuando aplica de verdad, el que duda pierde.',
  juego:'Tienes 3+ personas en rampa a la vez. Estás pagando el impuesto del blitz.',
  cuando:function(e,c){ return e.rampa.length >= 3; } },

{ id:'rework', pilar:'startup', titulo:'Rework', autor:'Jason Fried and DHH',
  concepto:'Ser chico es una ventaja',
  idea:'La herejía que funciona: no levantes plata, no crezcas por crecer, no hagas reuniones. '+
       'La restricción es un regalo — te obliga a construir solo lo esencial y a cobrar desde el día '+
       'uno. No toda buena empresa es una startup con venture capital.',
  juego:'Eres fundador, llevas meses sin levantar, y sigues vivo. Hay otro camino, y estás en él.',
  cuando:function(e,c){ return e.esFundador && e.rondas.length === 0 && e.mesPuesto > 9; } },

{ id:'foundersatwork', pilar:'startup', titulo:'Founders at Work', autor:'Jessica Livingston',
  concepto:'Todos empezaron mal',
  idea:'Decenas de fundadores famosos contando cómo empezó de verdad: ideas que eran otra cosa, socios que '+
       'se fueron, meses de nada. El patrón no es genialidad: es tolerar la incomodidad de que nada '+
       'funcione todavía, sin quedarse quietos jamás.',
  juego:'Fundaste. Bienvenido al club de los que empezaron sin saber.',
  cuando:function(e,c){ return e.esFundador; } },

{ id:'dunford', pilar:'startup', titulo:'Obviously Awesome', autor:'April Dunford',
  concepto:'Posicionamiento deliberado',
  idea:'Tu producto no compite contra quien crees: compite contra lo que el cliente ya usa, '+
       'aunque sea una hoja de cálculo. Elegir el marco correcto — qué eres, para quién, en lugar de qué — '+
       'puede duplicar la conversión sin tocar una línea de código.',
  juego:'Te compararon con el competidor. El encuadre de esa comparación era tuyo para elegir.',
  cuando:function(e,c){ return !!e.eventosVistos.paridad; } },

{ id:'playbigger', pilar:'startup', titulo:'Play Bigger', autor:'Ramadan, Peterson and others',
  concepto:'Diseño de categoría',
  idea:'Las empresas legendarias no ganan mercados: los crean. Diseñar la categoría es definir el '+
       'problema en tus términos, ponerle nombre y educar al mercado, para que cuando madure, la '+
       'respuesta obvia seas tú.',
  juego:'Tu marca pasó de 60: empiezas a definir cómo se habla del problema.',
  cuando:function(e,c){ return e.marca >= 60; } },

{ id:'helmer', pilar:'startup', titulo:'7 Powers', autor:'Hamilton Helmer',
  concepto:'Poder, no ventaja',
  idea:'Un feature no es una ventaja: es una demora. El poder durable sale de siete lugares — '+
       'escala, red, costos de cambio, marca, recurso acaparado, contraposicionamiento, poder de '+
       'proceso. Si no puedes nombrar el tuyo, no lo tienes.',
  juego:'Tu fit es alto y el competidor todavía no te mira: eso ES contraposicionamiento.',
  cuando:function(e,c){ return Motor.fitMax(e) > 0.6 && e.competidor.atencion < 0.3; } },

{ id:'innovsol', pilar:'startup', titulo:'The Innovator\'s Solution', autor:'Clayton Christensen',
  concepto:'La secuela con el manual',
  idea:'Si el Dilema explica por qué caen los incumbentes, la Solución explica cómo atacarlos: entra '+
       'donde su estructura de costos les prohíbe seguirte, y sube de mercado a tu ritmo, '+
       'no al de tu ego.',
  juego:'Enfrentaste la decisión entre subir de mercado o quedarte abajo. Este libro es esa decisión.',
  cuando:function(e,c){ return !!e.eventosVistos.upmarket; } },

{ id:'paranoid', pilar:'startup', titulo:'Only the Paranoid Survive', autor:'Andy Grove',
  concepto:'Puntos de inflexión estratégica',
  idea:'Hay momentos en que las reglas del negocio cambian 10x — una tecnología, un competidor, una '+
       'regulación — y la empresa que los atraviesa con el plan viejo muere muy ordenadamente. La paranoia '+
       'útil es institucional: alguien tiene que estar mirando el borde.',
  juego:'El competidor te está mirando fijo. Las reglas de tu juego acaban de cambiar.',
  cuando:function(e,c){ return e.competidor.atencion >= 0.6; } },

{ id:'antifragile', pilar:'startup', titulo:'Antifragile', autor:'Nassim Taleb',
  concepto:'Lo que se fortalece con los golpes',
  idea:'Robusto es lo que aguanta el caos; antifrágil es lo que se beneficia de él. Una startup chica '+
       'con caja positiva en una crisis no solo sobrevive el invierno: lo usa, porque sus '+
       'competidores financiados mueren más rápido que ella.',
  juego:'Ingresos por encima del burn en lo más hondo de un invierno de capital. El caos está trabajando para ti.',
  cuando:function(e,c){ return e.eraId === 'invierno' && e.mrr > Motor.burnMensual(e); } },

/* ================= PRODUCTO (más) ================= */
{ id:'empowered', pilar:'producto', titulo:'Empowered', autor:'Marty Cagan',
  concepto:'Equipos con problemas, no listas',
  idea:'La secuela de Inspired apunta a los líderes: tu trabajo no es decidir qué se construye, es '+
       'construir equipos capaces de decidirlo mejor que tú. El contexto y los problemas bajan; '+
       'las soluciones y la evidencia suben.',
  juego:'Empoderaste al equipo. Ya no eres el techo de la organización.',
  cuando:function(e,c){ return !!e.empoderado; } },

{ id:'shapeup', pilar:'producto', titulo:'Shape Up', autor:'Ryan Singer',
  concepto:'Apetito, no estimación',
  idea:'En vez de preguntar cuánto tarda, pregunta cuánto vale la pena gastar: seis semanas, y si no '+
       'cabe, recortas alcance, no fecha. Y nunca arranques diez cosas: el trabajo en paralelo '+
       'es donde los proyectos van a no terminarse nunca.',
  juego:'Tienes más de dos apuestas en vuelo: el cambio de contexto ya te está cobrando.',
  cuando:function(e,c){ var n=0,k; for(k in e.enVuelo) if(e.enVuelo.hasOwnProperty(k)) n++; return n > 2; } },

{ id:'sprintk', pilar:'producto', titulo:'Sprint', autor:'Jake Knapp',
  concepto:'Cinco días para saber',
  idea:'Un proceso para comprimir meses de debate en una semana: lunes mapeas, martes bocetas '+
       'soluciones, miércoles decides, jueves prototipas, viernes pruebas con cinco usuarios '+
       'reales. La velocidad no está en construir rápido: está en decidir con datos chicos.',
  juego:'Pusiste casi la mitad de tu mes en discovery. Eso es un sprint de verdad.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.desc >= 8; } },

{ id:'storymap', pilar:'producto', titulo:'User Story Mapping', autor:'Jeff Patton',
  concepto:'El mapa antes que la lista',
  idea:'Un backlog plano miente: esconde el recorrido del usuario detrás de una pila de tickets. '+
       'Mapear el recorrido completo y rebanarlo en cortes que funcionen de punta a punta evita '+
       'el clásico producto 80% hecho que no sirve como conjunto.',
  juego:'Llevas cinco apuestas lanzadas: ¿forman un recorrido completo, o cinco piezas sueltas?',
  cuando:function(e,c){ return e.apuestasCompletadas >= 5; } },

{ id:'jtbd', pilar:'producto', titulo:'Competing Against Luck', autor:'Clayton Christensen',
  concepto:'El trabajo por hacer',
  idea:'Nadie quiere tu producto: la gente "contrata" cosas para hacer un trabajo en su vida. El '+
       'competidor del cine no es otro cine, es el sofá. Entender el trabajo — funcional, social, '+
       'emocional — predice la compra mejor que cualquier demografía.',
  juego:'Saturaste una necesidad entera del mapa. Ese "trabajo" ahora te contrata a ti.',
  cuando:function(e,c){ var k; for(k in e.cobertura) if(e.cobertura.hasOwnProperty(k) && e.cobertura[k]>=80) return true; return false; } },

{ id:'norman', pilar:'producto', titulo:'The Design of Everyday Things', autor:'Don Norman',
  concepto:'La culpa es del diseño',
  idea:'Cuando alguien usa mal tu producto, el error es tuyo: los objetos bien diseñados enseñan '+
       'su uso con su forma. Puertas que te dicen si empujar, controles que mapean a lo que '+
       'mueven. El manual es una confesión de fracaso.',
  juego:'Usabilidad arriba de 70: tu producto empezó a explicarse solo.',
  cuando:function(e,c){ return e.usabilidad >= 70; } },

{ id:'okrdoerr', pilar:'producto', titulo:'Measure What Matters', autor:'John Doerr',
  concepto:'OKRs: foco comprometido',
  idea:'El sistema que Grove inventó y Doerr evangelizó: pocos objetivos que importen, resultados '+
       'clave medibles, públicos para toda la empresa, y desacoplados del bono — para que la gente '+
       'apunte alto sin miedo a fallar con honestidad.',
  juego:'Definiste el semestre. Un objetivo claro le gana a nueve consensuados.',
  cuando:function(e,c){ return !!e.eventosVistos.okr; } },

{ id:'workingback', pilar:'producto', titulo:'Working Backwards', autor:'Colin Bryar and Bill Carr',
  concepto:'Empieza por el comunicado de prensa',
  idea:'En Amazon, antes de construir nada escriben el comunicado de prensa del lanzamiento y el '+
       'FAQ del cliente. Si el comunicado no emociona a nadie, el producto tampoco lo '+
       'hará — y descubrirlo en un documento cuesta mil veces menos.',
  juego:'Estás gestionando por resultados, no por fechas. Amazon aprueba.',
  cuando:function(e,c){ return e.fabrica === false && e.mesPuesto > 6; } },

{ id:'rumelt', pilar:'producto', titulo:'Good Strategy Bad Strategy', autor:'Richard Rumelt',
  concepto:'El núcleo de la estrategia',
  idea:'La buena estrategia tiene tres partes: un diagnóstico honesto, una política que guía, y '+
       'acciones coherentes entre sí. Todo lo demás — visión, misión, metas ambiciosas — no es '+
       'estrategia: es pensamiento mágico con formato de PowerPoint.',
  juego:'Tu foco pasó de 75. Se nota cuando hay estrategia de verdad.',
  cuando:function(e,c){ return e.foco >= 75; } },

{ id:'leanux', pilar:'producto', titulo:'Lean UX', autor:'Jeff Gothelf',
  concepto:'El diseño como hipótesis',
  idea:'Diseñar no es la fase donde dibujas lo ya decidido: cada pantalla es una hipótesis con '+
       'un resultado esperado. Menos entregables perfectos, más experimentos baratos con todo el '+
       'equipo mirando al usuario junto.',
  juego:'Viste usuarios atorarse en tu embudo. Cada arreglo desde aquí es una hipótesis probada.',
  cuando:function(e,c){ return !!e.eventosVistos.friccion; } },

{ id:'justenough', pilar:'producto', titulo:'Just Enough Research', autor:'Erika Hall',
  concepto:'Investigación justa y suficiente',
  idea:'No necesitas un departamento de investigación: necesitas la disciplina de preguntar bien y '+
       'la humildad de escuchar la respuesta. La investigación cara que no cambia ninguna decisión vale '+
       'menos que una entrevista corta que sí.',
  juego:'Estás entrevistando bien y tu evidencia lo muestra. Suficiente SÍ es la meta.',
  cuando:function(e,c){ return e.calidadDesc >= 1 && e.evidencia >= 50; } },

{ id:'outcomes', pilar:'producto', titulo:'Outcomes Over Output', autor:'Josh Seiden',
  concepto:'Resultado ≠ entregable',
  idea:'Un resultado es un cambio de comportamiento humano que crea valor: el cliente vuelve, el '+
       'usuario invita a otros, el proceso deja de doler. Los features son apenas apuestas puestas para producir '+
       'esos cambios — y la mayoría no lo logra.',
  juego:'Rechazaste el roadmap de fechas. Ahora mide comportamientos, no entregas.',
  cuando:function(e,c){ return !!e.eventosVistos.roadmap; } },

{ id:'alchemy', pilar:'producto', titulo:'Alchemy', autor:'Rory Sutherland',
  concepto:'La lógica no vende',
  idea:'Lo opuesto a una buena idea puede ser otra buena idea. Los humanos no compran lo óptimo: '+
       'compran significado, señales y contexto. Un tren no mejora solo yendo más rápido; mejora '+
       'con wifi y una historia. La magia psicológica es ingeniería legítima.',
  juego:'Tu marca pasó de 70: la gente ya no compra tu producto, compra su historia.',
  cuando:function(e,c){ return e.marca >= 70; } },

{ id:'badass', pilar:'producto', titulo:'Badass: Making Users Awesome', autor:'Kathy Sierra',
  concepto:'Usuarios que la rompen',
  idea:'Nadie recomienda un producto: la gente se recomienda a sí misma siendo mejor en algo. No '+
       'hagas un producto increíble; haz usuarios increíbles en el contexto donde vive tu '+
       'producto. El boca a boca sale de ahí, no del marketing.',
  juego:'Retención arriba de 93%: tus usuarios están ganando contigo.',
  cuando:function(e,c){ return Motor.retencionMedia(e) > 0.93; } },

{ id:'coldstart', pilar:'producto', titulo:'The Cold Start Problem', autor:'Andrew Chen',
  concepto:'La red atómica',
  idea:'Los efectos de red no empiezan grandes: empiezan con la red atómica — el grupo más chico '+
       'que se sostiene solo, aunque sean cien personas en una universidad. Ganar mil redes chicas '+
       'en fila le gana a perseguir una grande desde el inicio.',
  juego:'Tu sector es viral: el problema del arranque en frío es TU problema.',
  cuando:function(e,c){ return e.viral >= 2 && Motor.usuarios(e) >= 100; } },

{ id:'olsen', pilar:'producto', titulo:'The Lean Product Playbook', autor:'Dan Olsen',
  concepto:'La pirámide del PMF',
  idea:'Seis capas ordenadas: mercado, necesidades desatendidas, propuesta de valor, features, UX '+
       'y, solo en la punta, el producto. El error clásico es empezar por las dos capas de arriba y '+
       'rezar. El fit se diseña desde abajo.',
  juego:'Tu fit con visionarios pasó de 0,6: la pirámide tiene base.',
  cuando:function(e,c){ return Motor.fit(e, 'visio') > 0.6; } },

{ id:'thinkingbets', pilar:'producto', titulo:'Thinking in Bets', autor:'Annie Duke',
  concepto:'Decisión ≠ resultado',
  idea:'Una buena decisión puede salir mal y una mala puede salir bien: juzgar por resultados '+
       'enseña las lecciones equivocadas. Pensar en apuestas — probabilidades, tamaño, información '+
       'incompleta — es la única forma honesta de operar en un mundo con suerte adentro.',
  juego:'Trabajas en la industria de las apuestas. Ironía: aquí, la suerte es el producto.',
  cuando:function(e,c){ return e.sectorId === 'apuestas'; } },

/* ================= GROWTH Y VENTAS ================= */
{ id:'traction', pilar:'growth', titulo:'Traction', autor:'Gabriel Weinberg and Justin Mares',
  concepto:'El 50% olvidado',
  idea:'Una startup es mitad producto y mitad distribución, y los fundadores de producto reparten su tiempo '+
       '100 y 0. Hay 19 canales; el que te va a funcionar probablemente no es el que te gusta. Se '+
       'encuentra con experimentos baratos, no con opiniones.',
  juego:'Pusiste tu primer punto en crecimiento. Ahora prueba canales, no corazonadas.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.crec > 0; } },

{ id:'hackingg', pilar:'growth', titulo:'Hacking Growth', autor:'Sean Ellis and Morgan Brown',
  concepto:'El proceso, no el truco',
  idea:'El growth hacking no es una bolsa de trucos: es un proceso semanal — analizar, idear, '+
       'priorizar, probar — corrido por un equipo transversal sobre TODO el embudo. El growth hack famoso '+
       'de otro casi nunca es tu palanca.',
  juego:'Ya tienes equipo de go-to-market: dale proceso, no ocurrencias.',
  cuando:function(e,c){ return e.gtm >= 3; } },

{ id:'influence', pilar:'growth', titulo:'Influence', autor:'Robert Cialdini',
  concepto:'Las seis palancas',
  idea:'Reciprocidad, compromiso, prueba social, autoridad, simpatía y escasez: seis atajos '+
       'mentales que la gente usa para decidir sin pensar. Conocerlos es marketing; abusarlos es '+
       'el camino corto a que nunca te vuelvan a creer.',
  juego:'Publicaste casos de éxito: eso es prueba social vendiendo por ti.',
  cuando:function(e,c){ return !!e.hechas.casos; } },

{ id:'positioning', pilar:'growth', titulo:'Positioning', autor:'Al Ries and Jack Trout',
  concepto:'La batalla es mental',
  idea:'El posicionamiento no pasa en el producto: pasa en la cabeza del cliente, donde caben '+
       'dos o tres marcas por categoría. Si no puedes ser el primero en la categoría, crea '+
       'una donde sí — la mente no se reordena, se le abre un casillero nuevo.',
  juego:'Elegiste tu cabeza de playa. Ahora sé el número uno de algo chico.',
  cuando:function(e,c){ return !!e.eventosVistos.chasm; } },

{ id:'challenger', pilar:'growth', titulo:'The Challenger Sale', autor:'Matthew Dixon and Brent Adamson',
  concepto:'Enseña, no complazcas',
  idea:'El mejor vendedor B2B no es el que construye relaciones: es el que le enseña al cliente '+
       'algo de su propio negocio que no sabía, ajusta el mensaje y toma el control de la venta. '+
       'La simpatía empata el partido; la perspectiva vende.',
  juego:'Negociaste con un cliente grande. El que enseñó en esa mesa, ganó.',
  cuando:function(e,c){ return !!e.eventosVistos.clientegrande; } },

{ id:'predictable', pilar:'growth', titulo:'Predictable Revenue', autor:'Aaron Ross',
  concepto:'La máquina de ingresos',
  idea:'Los ingresos predecibles salen de especializar: el que prospecta no cierra, el que cierra no '+
       'hace soporte. El embudo se vuelve una fábrica con métricas por etapa en vez de un vendedor '+
       'heroico que un día se va con el Rolodex.',
  juego:'Tus ingresos ya cubren el burn: hora de que dejen de depender de milagros.',
  cuando:function(e,c){ return e.mrr > Motor.burnMensual(e) && e.etapa !== 'semilla'; } },

{ id:'contagious', pilar:'growth', titulo:'Contagious', autor:'Jonah Berger',
  concepto:'Por qué se comparten las cosas',
  idea:'Las cosas no se comparten por buenas: se comparten porque dan estatus social, '+
       'tienen gatillos en la vida diaria, mueven emoción, se ven en público o cuentan una historia. '+
       'El boca a boca se diseña, no se reza.',
  juego:'Tu producto se riega solo de boca en boca. Alguien queda bien contando la historia.',
  cuando:function(e,c){ return e.viral >= 1.3 && Motor.usuarios(e) > 800; } },

{ id:'pricing', pilar:'growth', titulo:'Monetizing Innovation', autor:'Madhavan Ramanujam',
  concepto:'El precio antes que el producto',
  idea:'El 72% de los productos nuevos fracasa en monetizar, y la causa es siempre la misma: el '+
       'precio se decidió al final. La disposición a pagar se investiga ANTES de construir — el '+
       'precio no es un número, es diseño de producto.',
  juego:'Subiste el precio. ¿Lo decidió la investigación, o un apretón de caja?',
  cuando:function(e,c){ return e.precioInicio && e.precio > e.precioInicio; } },

{ id:'foundingsales', pilar:'growth', titulo:'Founding Sales', autor:'Pete Kazanjy',
  concepto:'El fundador vende primero',
  idea:'Nadie puede vender tu producto antes que tú: no porque seas bueno vendiendo, sino porque '+
       'las primeras cien conversaciones de venta SON el discovery. Contratar un vendedor para '+
       'esquivar esa incomodidad es tirar el aprendizaje más caro que existe.',
  juego:'Eres fundador y hay ingresos: las ventas que hiciste tú mismo cuentan doble.',
  cuando:function(e,c){ return e.esFundador && e.mrr > 0; } },

{ id:'purplecow', pilar:'growth', titulo:'Purple Cow', autor:'Seth Godin',
  concepto:'Notable o invisible',
  idea:'La publicidad murió de promedio: la gente ignora lo bueno y habla de lo notable. Una vaca '+
       'púrpura en un campo cuenta su propia historia. Si necesitas gritar para que tu producto se note, el '+
       'problema no es el volumen: es la vaca.',
  juego:'Tu marca cruzó 50. Algo que haces ya cuenta su propia historia.',
  cuando:function(e,c){ return e.marca >= 50; } },

/* ================= CAPITAL ================= */
{ id:'sandhill', pilar:'capital', titulo:'Secrets of Sand Hill Road', autor:'Scott Kupor',
  concepto:'Cómo piensa un VC',
  idea:'Un VC no busca buenas empresas: busca las poquísimas que devuelven el '+
       'fondo entero. En esa mesa tu empresa no compite contra tu mercado — compite contra '+
       'su portafolio. Entiende esa matemática y cada consejo raro que te den cobra sentido.',
  juego:'Llevas dos rondas. Ya conoces la mesa; ahora conoce sus incentivos.',
  cuando:function(e,c){ return e.rondas.length >= 2; } },

{ id:'wasserman', pilar:'capital', titulo:'The Founder\'s Dilemmas', autor:'Noam Wasserman',
  concepto:'Rico o rey',
  idea:'El hallazgo incómodo de estudiar diez mil startups: las decisiones que maximizan tu control '+
       'y las que maximizan tu plata son casi siempre opuestas. Cofundadores, equity, inversionistas: '+
       'cada cruce te pide elegir, y no elegir es elegir mal en ambas.',
  juego:'Tu cap table ya tiene historia. Cada punto que cediste fue una de estas decisiones.',
  cuando:function(e,c){ return e.esFundador && e.capTable.fund < 0.6; } },

{ id:'powerlaw', pilar:'capital', titulo:'The Power Law', autor:'Sebastian Mallaby',
  concepto:'La ley de potencia',
  idea:'En venture capital no existe el promedio: una inversión paga el fondo y el resto es '+
       'ruido. Esa matemática moldea todo el ecosistema — por qué te empujan a crecer, por qué '+
       'prefieren que mueras rápido a que vivas chico.',
  juego:'Has juntado equity en varias empresas. La mayoría valdrá cero. Una, quizás, todo.',
  cuando:function(e,c){ return c && c.equities && c.equities.length >= 3; } },

{ id:'psych', pilar:'capital', titulo:'The Psychology of Money', autor:'Morgan Housel',
  concepto:'Rico vs. libre',
  idea:'La plata compra opciones, no cosas. Nadie quiebra por falta de retornos: quiebra por falta '+
       'de margen de seguridad. Vender una tajada cuando vas arriba no es falta de fe — es '+
       'entender que sobrevivir es el prerrequisito de todo lo demás.',
  juego:'Vendiste parte de tus acciones. Vas a jugar mejor sin el miedo a quebrar.',
  cuando:function(e,c){ return (e.ventaSecundaria || 0) > 0; } },

{ id:'voss', pilar:'capital', titulo:'Never Split the Difference', autor:'Chris Voss',
  concepto:'Empatía táctica',
  idea:'Un negociador del FBI no parte la diferencia con secuestradores. Las herramientas: escuchar '+
       'de verdad, etiquetar emociones, preguntas calibradas que empiezan con cómo, y el poder del '+
       '"no" como inicio de la conversación real.',
  juego:'Firmaste términos limpios: alguien negoció bien en esa mesa. Ojalá tú.',
  cuando:function(e,c){ var i; for(i=0;i<e.preferencias.length;i++){ if(e.preferencias[i].mult===1 && !e.preferencias[i].part) return true; } return false; } },

/* ================= GENTE ================= */
{ id:'radical', pilar:'gente', titulo:'Radical Candor', autor:'Kim Scott',
  concepto:'Di la cosa, con cariño',
  idea:'Las dos fallas del feedback: agresión sin cariño, y peor, la "empatía ruinosa" — no decir '+
       'nada por no herir, hasta que el problema es indefendible. Que la persona te importe Y '+
       'retarla de frente no son opuestos: son el mismo acto.',
  juego:'Tu equipo tocó fondo y se recuperó. En el medio hubo conversaciones como estas.',
  cuando:function(e,c){ return e.moral >= 70 && (e.moralMin || 100) <= 48; } },

{ id:'lencioni', pilar:'gente', titulo:'The Five Dysfunctions of a Team', autor:'Patrick Lencioni',
  concepto:'La pirámide de la confianza',
  idea:'Todo arranca en la base: sin confianza no hay conflicto honesto; sin conflicto no hay '+
       'compromiso real; sin compromiso nadie se hace cargo; y sin eso, los resultados no son de '+
       'nadie. La armonía permanente es el síntoma, no la salud.',
  juego:'La moral está rota. Antes de procesos y OKRs, mira la base de la pirámide.',
  cuando:function(e,c){ return e.moral < 38; } },

{ id:'drive', pilar:'gente', titulo:'Drive', autor:'Daniel Pink',
  concepto:'Autonomía, maestría, propósito',
  idea:'Los premios y castigos funcionan para tareas mecánicas y destruyen las creativas. Lo que '+
       'mueve el trabajo de conocimiento son tres cosas: decidir el cómo (autonomía), mejorar en algo '+
       '(maestría) y que importe (propósito). El bono no compra ninguna.',
  juego:'Equipo empoderado con moral alta: estás pagando en la moneda correcta.',
  cuando:function(e,c){ return e.empoderado && e.moral >= 75; } },

{ id:'coachb', pilar:'gente', titulo:'Trillion Dollar Coach', autor:'Eric Schmidt and others',
  concepto:'El coach de Silicon Valley',
  idea:'Bill Campbell entrenó a los fundadores de Google, Apple y Amazon con ideas simples: el '+
       'equipo primero, la confianza antes que todo, y decir la verdad rápido. La gerencia es un '+
       'oficio de personas que a veces involucra computadoras.',
  juego:'Dos ascensos seguidos. Alguien te está entrenando bien — o lo aprendiste solo.',
  cuando:function(e,c){ if (!c || !c.puestos || c.puestos.length < 2) return false;
    return c.puestos[c.puestos.length-1].promocion && c.puestos[c.puestos.length-2].promocion; } },

{ id:'managerpath', pilar:'gente', titulo:'The Manager\'s Path', autor:'Camille Fournier',
  concepto:'Cada nivel es otro trabajo',
  idea:'De hacer, a liderar a los que hacen, a liderar líderes: cada salto no es más de lo mismo, '+
       'es un trabajo nuevo con herramientas nuevas. El error clásico es seguir haciendo el trabajo '+
       'viejo, pero con reuniones.',
  juego:'Llegaste a Group PM: tu output ahora es la organización, no tus manos.',
  cuando:function(e,c){ return e.rolN >= 3; } },

{ id:'norules', pilar:'gente', titulo:'No Rules Rules', autor:'Reed Hastings and Erin Meyer',
  concepto:'Densidad de talento',
  idea:'Los controles existen por los mediocres: si pagas sobre el mercado y actúas rápido con quien '+
       'no entrega, puedes borrar las reglas — vacaciones, gastos, aprobaciones — y la velocidad que '+
       'ganas lo paga todo. Solo funciona si la densidad es real.',
  juego:'Peleaste por quedarte con tu estrella. Así se defiende la densidad de talento.',
  cuando:function(e,c){ return !!e.eventosVistos.caza; } },

{ id:'deepwork', pilar:'gente', titulo:'Deep Work', autor:'Cal Newport',
  concepto:'La concentración como ventaja',
  idea:'El trabajo profundo — horas sin interrupciones sobre algo difícil — es cada vez más raro, '+
       'y por eso más valioso. Una organización que protege la concentración de su gente '+
       'compite contra empresas que viven en la ventana del chat.',
  juego:'Foco arriba de 80. Tu equipo hace un trabajo que otros simplemente no pueden.',
  cuando:function(e,c){ return e.foco >= 80; } },

{ id:'crucial', pilar:'gente', titulo:'Crucial Conversations', autor:'Patterson, Grenny and others',
  concepto:'La conversación que estás evitando',
  idea:'Los problemas grandes de una organización son casi siempre una conversación difícil que nadie '+
       'tuvo a tiempo. La técnica: seguridad psicológica primero, hechos antes que juicios, '+
       'y la meta compartida visible sobre la mesa.',
  juego:'Tu capital político está bajo: hay una conversación que le debes a alguien.',
  cuando:function(e,c){ return e.politico < 30; } },

{ id:'walsh', pilar:'gente', titulo:'The Score Takes Care of Itself', autor:'Bill Walsh',
  concepto:'El estándar antes que el marcador',
  idea:'Walsh tomó el peor equipo de la NFL y ganó tres Super Bowls sin hablar de ganar: definió '+
       'el estándar de cómo se hace todo — hasta cómo se contesta el teléfono — y el marcador '+
       'se acomodó solo. La cultura es el cómo, repetido.',
  juego:'Tres mandatos cumplidos en tu carrera. El estándar ya es tuyo.',
  cuando:function(e,c){ if (!c || !c.puestos) return false;
    var n=0,i; for(i=0;i<c.puestos.length;i++) if(c.puestos[i].cumplido) n++; return n >= 3; } },

/* ================= TECNOLOGÍA (más) ================= */
{ id:'pragmatic', pilar:'tech', titulo:'The Pragmatic Programmer', autor:'Andrew Hunt and David Thomas',
  concepto:'Ventanas rotas',
  idea:'Una ventana rota sin arreglar invita a romper el resto: el código malo tolerado enseña '+
       'que aquí se tolera el código malo. La entropía del software no se detiene sola — se detiene '+
       'con arreglos chicos constantes y orgullo por el oficio.',
  juego:'Deuda técnica debajo de 15. Sin ventanas rotas en tu edificio.',
  cuando:function(e,c){ return e.deuda <= 15; } },

{ id:'ousterhout', pilar:'tech', titulo:'A Philosophy of Software Design', autor:'John Ousterhout',
  concepto:'Módulos profundos',
  idea:'La complejidad es EL enemigo, y se combate con módulos profundos: interfaz chica, '+
       'implementación poderosa. Las clases superficiales y las capas que solo pasan datos multiplican '+
       'la carga cognitiva sin aportar nada. Diséñalo dos veces antes de escribirlo una.',
  juego:'Arquitectura arriba de 60: alguien está pensando antes de teclear.',
  cuando:function(e,c){ return e.arquitectura >= 60; } },

{ id:'phoenix', pilar:'tech', titulo:'The Phoenix Project', autor:'Gene Kim and others',
  concepto:'TI como piso de fábrica',
  idea:'Una novela sobre un deploy que sale mal, y la revelación: el trabajo de tecnología fluye '+
       'como una fábrica — cuellos de botella, trabajo en curso invisible, y un Brent del que todo '+
       'depende. Ver el flujo es el primer arreglo.',
  juego:'Entraste en congelamiento: tu fábrica se atascó en trabajo invisible.',
  cuando:function(e,c){ return !!e.congelado; } },

{ id:'contdel', pilar:'tech', titulo:'Continuous Delivery', autor:'Jez Humble and David Farley',
  concepto:'Si duele, hazlo seguido',
  idea:'Un deploy doloroso no se arregla haciéndolo menos: se arregla haciéndolo tan seguido que deja '+
       'de doler. Automatizar el camino a producción — build, test, release — convierte el '+
       'evento del jueves por la noche en un no-evento cotidiano.',
  juego:'Encendiste el despliegue continuo. Los jueves por la noche vuelven a ser tuyos.',
  cuando:function(e,c){ return !!e.cd; } },

{ id:'releaseit', pilar:'tech', titulo:'Release It!', autor:'Michael Nygard',
  concepto:'Diseña para el viernes a las 5',
  idea:'El sistema que pasa los tests no es el que sobrevive producción: sobrevive el que asume que '+
       'TODO va a fallar — timeouts, circuit breakers, mamparos. La pregunta de diseño no es '+
       '"¿funciona?" sino "¿qué pasa cuando lo de al lado no?".',
  juego:'Dos incidentes en el mismo puesto. Tu sistema necesita mamparos, no parches.',
  cuando:function(e,c){ return e.incidentesPuesto >= 2; } },

{ id:'staffeng', pilar:'tech', titulo:'Staff Engineer', autor:'Will Larson',
  concepto:'Senior no es el techo',
  idea:'Después de senior hay un camino que no es gerencia: el staff engineer que opera por '+
       'influencia — dirección técnica, desbloquear equipos, decirle no a la arquitectura de moda. '+
       'Otro trabajo, otra moneda: contexto y confianza.',
  juego:'Organizaste equipos con dueños claros. Alguien técnico con influencia estuvo en esa sala.',
  cuando:function(e,c){ return !!e.teamTopo; } },

{ id:'elegant', pilar:'tech', titulo:'An Elegant Puzzle', autor:'Will Larson',
  concepto:'Sistemas de ingeniería',
  idea:'Los problemas de una organización grande de ingeniería son sistémicos: tamaños de equipo, colas de trabajo, '+
       'ratios de gestión. Gestionar por anécdota falla a escala; gestionar el sistema '+
       '— tamaños, flujos, fronteras — es lo que queda.',
  juego:'Tu área pasó de 13 personas: bienvenido a los problemas de sistemas.',
  cuando:function(e,c){ return (e.ing + e.prod) >= 13; } },

/* ================= HISTORIAS DE GUERRA ================= */
{ id:'shoedog', pilar:'historias', titulo:'Shoe Dog', autor:'Phil Knight',
  concepto:'Nike vivió al borde',
  idea:'Las memorias del fundador de Nike son una década entera sin caja: bancos echándolo, un '+
       'socio japonés que casi lo hunde, cheques rebotando mientras la marca explota. El mito del '+
       'crecimiento ordenado es exactamente eso, un mito: crecer se come la caja.',
  juego:'Runway crítico y sigues operando. Knight vivió ahí diez años.',
  cuando:function(e,c){ return Motor.runwayMeses(e) < 2 && e.vivo; } },

{ id:'badblood', pilar:'historias', titulo:'Bad Blood', autor:'John Carreyrou',
  concepto:'Theranos: fraude compuesto',
  idea:'Una mentira chica para cerrar una ronda exige una más grande para sostenerla, hasta que '+
       'el producto ES la mentira. Theranos no empezó como fraude: llegó ahí por el interés '+
       'compuesto de los atajos. Nadie amanece una mañana siendo Elizabeth Holmes.',
  juego:'Tu Lupa pasó de 60. Este libro es una fotografía del final de ese camino.',
  cuando:function(e,c){ return e.lupa >= 60; } },

{ id:'hatching', pilar:'historias', titulo:'Hatching Twitter', autor:'Nick Bilton',
  concepto:'Los cofundadores se comen entre sí',
  idea:'Cuatro fundadores, cuatro versiones de la historia, y un patrón: en las empresas que valen '+
       'algo, la pelea de cofundadores es la regla, no la excepción. Las traiciones de Twitter no las '+
       'causó la maldad: las causó no hablar del poder a tiempo.',
  juego:'Tuviste tu momento con el cofundador fantasma. Así empiezan estos libros.',
  cuando:function(e,c){ return !!e.eventosVistos.socio; } },

{ id:'chaosm', pilar:'historias', titulo:'Chaos Monkeys', autor:'Antonio García Martínez',
  concepto:'El Valle, sin filtro',
  idea:'La versión cínica y divertida: aceleradoras como casinos, adquisiciones que son despidos '+
       'con champaña, y la verdad incómoda de que muchas carreras se construyen estando en la '+
       'sala correcta cuando revienta la piñata.',
  juego:'Te despidieron una vez. Este libro ahora te va a dar risa.',
  cuando:function(e,c){ if (!c || !c.puestos) return false;
    var i; for(i=0;i<c.puestos.length;i++) if(c.puestos[i].despido) return true; return false; } },

{ id:'superpumped', pilar:'historias', titulo:'Super Pumped', autor:'Mike Isaac',
  concepto:'Uber: crecimiento sin frenos',
  idea:'La cultura que conquistó cien ciudades era la misma que espiaba reguladores y quemaba '+
       'a su propia gente. La lección incómoda: los rasgos que ganan la guerra son los que '+
       'después incendian la casa — si nadie traza una línea.',
  juego:'Cocinaste los números bajo presión. Kalanick también empezó "ganando".',
  cuando:function(e,c){ return !!e.eventosVistos.cocinar; } },

{ id:'everything', pilar:'historias', titulo:'The Everything Store', autor:'Brad Stone',
  concepto:'Amazon: la escala como religión',
  idea:'Bezos construyó sobre una idea incómoda: tu margen es mi oportunidad. Precios de piso, '+
       'años de pérdidas y obsesión operativa, apostando a que la escala compra lo que la '+
       'rentabilidad temprana nunca puede: inevitabilidad.',
  juego:'Saturaste la necesidad de escala. Estás jugando el juego largo de Bezos.',
  cuando:function(e,c){ return (e.cobertura.escala || 0) >= 70; } },

{ id:'masters', pilar:'historias', titulo:'Masters of Scale', autor:'Reid Hoffman',
  concepto:'Qué escala y qué no',
  idea:'Del podcast a la página: fundadores contando el momento exacto en que algo chico se volvió '+
       'enorme. El patrón repetido: primero haz algo que cien personas amen, y después — y solo '+
       'después — preocúpate por los millones.',
  juego:'Tu organización pasó de 18 personas. Empezó el juego de escalar gente.',
  cuando:function(e,c){ return (e.ing + e.prod + e.gtm) >= 18; } },

{ id:'lostfounder', pilar:'historias', titulo:'Lost and Founder', autor:'Rand Fishkin',
  concepto:'La startup, sin filtro',
  idea:'El fundador de Moz contando lo que nadie cuenta: la down round, la depresión, el directorio que '+
       'te sonríe mientras vota tu reemplazo, y la matemática del VC que convierte una buena '+
       'empresa en una decepción. La honestidad como género literario.',
  juego:'Pasaste por una down round. Fishkin escribió este libro para este momento exacto.',
  cuando:function(e,c){ return !!e.eventosVistos.downround; } },

/* ================= LA CALLE ================= */
{ id:'elprincipe', pilar:'calle', titulo:'The Prince', autor:'Niccolo Machiavelli',
  concepto:'Temido o amado',
  idea:'Quinientos años y sigue siendo el manual de operaciones que nadie admite haber leído: el poder se conserva, '+
       'no se merece; es mejor ser temido que amado si no puedes ser ambos; y los príncipes mantienen las manos '+
       'limpias alquilando manos sucias. Maquiavelo no inventó el juego — solo se negó a mentir sobre él.',
  juego:'Se abrió porque tocaste una decisión de chivo expiatorio o tu capital político tocó el piso. El juego ya era maquiavélico; ahora tienes el manual.',
  cuando:function(e,c){ return e.politico < 25 || !!(c && c.dilemasVistos && c.dilemasVistos.chivoexpiatorio); } },

{ id:'48laws', pilar:'calle', titulo:'The 48 Laws of Power', autor:'Robert Greene',
  concepto:'Nunca opaques al maestro',
  idea:'Greene catalogó lo que los cortesanos siempre supieron: el crédito fluye hacia arriba, las apariencias pesan más que los hechos, y '+
       'quien corrige al jefe en público gana la discusión y pierde la guerra. Léelo como manual o '+
       'como vacuna — la mayoría necesita la vacuna.',
  juego:'Alguien tocó el crédito de tu equipo, o jugaste la contra silenciosa. Da igual: la ley 1 rige en tu empresa, la hayas leído o no.',
  cuando:function(e,c){ return !!(c && c.dilemasVistos && (c.dilemasVistos.creditos || c.dilemasVistos.kompromat)); } },

{ id:'artofwar', pilar:'calle', titulo:'The Art of War', autor:'Sun Tzu',
  concepto:'Ganar sin pelear',
  idea:'El arte supremo es someter al enemigo sin batalla: conócete, conócelo, elige el terreno, '+
       'y deja que su estructura lo derrote. Cada jugada sucia competitiva de tu industria es una peor '+
       'traducción de un capítulo que Sun Tzu escribió mejor, sobrio, hace 2.500 años.',
  juego:'Tu competidor ya te está mirando. Cada opción que te aparece contra él — el rumor, el robo de talento, el bake-off — es un capítulo de Sun Tzu con departamento legal.',
  cuando:function(e,c){ return e.competidor.atencion >= 0.5 || !!(c && c.dilemasVistos && (c.dilemasVistos.rumor || c.dilemasVistos.cazatalentos)); } },

{ id:'pitchanything', pilar:'calle', titulo:'Pitch Anything', autor:'Oren Klaff',
  concepto:'Control del marco',
  idea:'La tesis de Klaff tras mil salas de deals: quien es dueño del marco es dueño de la reunión. A los premios se los '+
       'persigue, a los que persiguen se los descuenta — así que sé el premio. Los juegos de estatus pasan en los primeros noventa segundos, '+
       'juegues o no; lo único que eliges es si te das cuenta.',
  juego:'Ya te sentaste a la mesa de levantamiento como fundador. Recuerda quién puso el marco en esa sala — la plata, o tú.',
  cuando:function(e,c){ return e.esFundador && e.rondas.length >= 1; } },

{ id:'mafia', pilar:'calle', titulo:'The Godfather', autor:'Mario Puzo',
  concepto:'No es personal',
  idea:'Una novela sobre un negocio familiar que todo operador cita en el trabajo: los favores son moneda, la lealtad '+
       'se prueba, no se asume, y "no es personal, son solo negocios" es lo que la gente dice '+
       'justo cuando es profundamente personal. La calle corre sobre deudas — sabe quién tiene las tuyas.',
  juego:'Conociste al hombre que conoce a todos, o tienes una palanca en la mano. Alguien, en algún lugar, tiene tu nombre en un libro de favores. Este juego también.',
  cuando:function(e,c){ return e.palancaSecreta || !!(c && c.dilemasVistos && (c.dilemasVistos.padrino || c.dilemasVistos.favores)); } }
];

function libroPorId(id) {
  for (var i = 0; i < LIBROS.length; i++) if (LIBROS[i].id === id) return LIBROS[i];
  return null;
}

/* Pilares para la biblioteca */
var PILARES = [
  { id:'startup',  nombre:'Startup',      cls:'pil-s' },
  { id:'producto', nombre:'Producto',      cls:'pil-p' },
  { id:'tech',     nombre:'Tecnología',         cls:'pil-t' },
  { id:'yc',       nombre:'YC y ensayos',  cls:'pil-y' },
  { id:'growth',   nombre:'Growth y ventas', cls:'pil-g' },
  { id:'capital',  nombre:'Capital',      cls:'pil-c' },
  { id:'gente',    nombre:'Gente',       cls:'pil-e' },
  { id:'historias',nombre:'Historias de guerra',  cls:'pil-h' },
  { id:'calle', nombre:'La Calle', cls:'pil-k' }
];
function pilarDe(id) {
  for (var i = 0; i < PILARES.length; i++) if (PILARES[i].id === id) return PILARES[i];
  return PILARES[0];
}

/* Fichas contextuales: se abren cuando la partida vive el concepto.
   Máximo 2 por mes para que el goteo no ensucie el final del juego. */
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
   Aplicado a tu caso: cada función toma el puesto actual y
   devuelve la teoría aplicada a TUS números de hoy. Se muestra al
   abrir una ficha y al decidir un dilema. Sin build ni dependencias.
   ================================================================ */
var APLICAR = {

  lean: function (e) {
    var n = Math.round(e.evidencia);
    if (n < 40) return 'Tu evidencia está en ' + n + ': lo que ves en el backlog es ruido con cara de número. ' +
      'Cada apuesta que construyas ahora es una hipótesis sin probar — y ya viste cuánto se aleja el impacto real del esperado.';
    if (n < 70) return 'Evidencia ' + n + ': sabes a medias. Tus estimaciones se van acercando, pero el circuito construir-medir-aprender todavía tiene el segundo paso débil.';
    return 'Evidencia ' + n + ': estás decidiendo con datos reales. Cuidado: decae sola cada mes — el aprendizaje validado se vence.';
  },

  momtest: function (e) {
    if (e.calidadDesc >= 1) return 'Elegiste preguntar por hechos del pasado: tus entrevistas en ' + e.empresa +
      ' producen datos usables. Por eso tus estimaciones del backlog ≈ convergen a la verdad.';
    return 'En ' + e.empresa + ' las entrevistas pescan opiniones (calidad ' + Math.round(e.calidadDesc * 100) +
      '%): la gente está siendo amable contigo, no honesta. Tus estimaciones vienen infladas de fábrica por ese sesgo.';
  },

  fowler: function (e) {
    var tax = Math.round((e.deuda / 100) * 55);
    return 'Tu deuda está en ' + Math.round(e.deuda) + ': este mes el equipo entero pierde ~' + tax +
      '% de su capacidad pagando ese interés. Con ' + (e.ing + e.prod) + ' personas construyendo, es como si ' +
      Math.round((e.ing + e.prod) * tax / 100) + ' trabajaran solo para el pasado.';
  },

  brooks: function (e) {
    if (e.rampa.length) return 'Tienes ' + e.rampa.length + ' persona(s) en rampa: todavía no producen, y cuestan ' +
      (e.rampa.length * 6) + ' pts de mentoría al mes de los que sí. La ley de Brooks, en vivo.';
    return 'Hoy nadie está en rampa. Si contratas, recuerda: cada contratación son 2 meses de output cero más 6 pts/mes de mentoría de todos los demás.';
  },

  chasm: function (e) {
    var r = Motor.requisitosGate(e), ok = 0, i;
    for (i = 0; i < r.length; i++) if (r[i].ok) ok++;
    var g = Motor.compuerta(e, 'pragm');
    if (g >= 1) return 'Cruzaste: cumples los ' + r.length + ' requisitos de "' + e.gateNombre + '" y el mercado grande está comprando.';
    return 'Tu compuerta es "' + e.gateNombre + '": cumples ' + ok + ' de ' + r.length + ' requisitos, así que el mercado grande ' +
      'convierte al ' + Math.round(g * 100) + '% de lo normal. Todo lo que gastes en alcance hacia ellos se fuga en esa proporción.';
  },

  sre: function (e) {
    return 'Tu presupuesto de error está en ' + Math.round(e.presupuestoError) + '/100 este trimestre' +
      (e.congelado ? ' — gastado: por eso estás en congelamiento y casi nada se construye.' :
       e.presupuestoError < 40 ? '. Un incidente más y se acaba: el congelamiento invierte las prioridades solo.' :
       '. Tienes margen para moverte rápido; para eso está.');
  },

  ddia: function (e) {
    var c = Math.round(Motor.carga(e) * 100);
    return 'Tu carga está al ' + c + '% de lo que aguanta la arquitectura de ' + e.empresa + '. ' +
      (c > 85 ? 'Estás en la zona donde los supuestos invisibles se rompen todos de golpe: la probabilidad de caída crece de forma no lineal desde aquí.' :
       c > 60 ? 'Todavía respira, pero si los usuarios crecen más rápido que la arquitectura, el éxito te tumba.' :
       'Hay espacio. El momento barato para invertir en escala es antes de necesitarla.');
  },

  topologies: function (e) {
    var tam = e.ing + e.prod, umbral = (e.teamTopo ? 12 : 8) + Math.round(e.hab.liderazgo / 12);
    if (tam > umbral) return 'Tu área tiene ' + tam + ' personas y el techo cognitivo es ' + umbral +
      ': cada persona por encima rinde menos. El esfuerzo no lo arregla: cortar el sistema en equipos con dueño, sí.';
    return 'Área de ' + tam + ' con techo de ' + umbral + ': la carga cognitiva todavía cabe en las cabezas. Cuando crezcas, corta por fronteras, no por capas.';
  },

  deals: function (e) {
    if (!e.preferencias.length) return 'Todavía no has firmado términos en ' + e.empresa + '. Cuando llegue la hoja: la valuación es el titular; la preferencia de liquidación es la letra chica que decide qué te llevas a casa.';
    var pref = 0, part = false, i;
    for (i = 0; i < e.preferencias.length; i++) { pref += e.preferencias[i].monto * e.preferencias[i].mult; if (e.preferencias[i].part) part = true; }
    return 'Hay $' + Math.round(pref / 1000000) + 'M de preferencias ' + (part ? 'PARTICIPATIVAS ' : '') + 'por delante de ti en la cascada: en cualquier exit, eso se paga primero' +
      (part ? ' y encima se lleva una tajada del resto. El titular de la ronda era bonito; esta línea es la que importa.' : '.');
  },

  analytics: function (e) {
    return 'Tus usuarios totales solo saben subir — por eso calman y no informan. El número que decide es la retención: hoy ' +
      Math.round(Motor.retencionMedia(e) * 100) + '% mensual. A ese ritmo, de cada 100 que entran hoy, ' +
      Math.round(Math.pow(Motor.retencionMedia(e), 6) * 100) + ' siguen ahí en seis meses. Esa es tu verdad.';
  },

  hooked: function (e) {
    var r = Math.round(Motor.retencionMedia(e) * 100);
    return 'Retención ' + r + '%: ' + (r >= 90 ? 'hay un hábito real — el gatillo interno existe y el boca a boca fluye desde aquí.' :
      'todavía no hay circuito. Pregúntate qué deposita el usuario dentro de ' + e.empresa + ' que haga que la próxima visita valga más que la anterior.');
  },

  krug: function (e) {
    var u = Math.round(e.usabilidad);
    return 'Usabilidad ' + u + ': la conversión de TODO tu tráfico se multiplica por ~' +
      (Math.round((0.35 + u / 100 * 0.65) * 100) / 100) + ' solo por esta variable. ' +
      (u < 50 ? 'Es la palanca más barata que tienes, y la estás pagando con cada visitante que se va.' : 'Está trabajando a tu favor.');
  },

  grove: function (e) {
    return 'Tu output es el de tu organización: con moral ' + Math.round(e.moral) + ' y foco ' + Math.round(e.foco) +
      ', el equipo corre al ~' + Math.round((0.75 + e.moral / 100 * 0.35) * (0.85 + e.foco / 100 * 0.30) * 100) +
      '% de su línea base. Subir esos dos números es apalancamiento puro: multiplica todo lo demás que hagas.';
  },

  torres: function (e) {
    return 'Tu evidencia cae ' + (e.cadenciaDesc ? '1,5' : '3,5') + ' puntos por mes ' +
      (e.cadenciaDesc ? 'porque instalaste la cadencia semanal: el discovery continuo frena la evaporación.' :
       'porque descubres a ráfagas. Torres diría: no es un proyecto, es un hábito — y el tuyo todavía no existe.');
  },

  inspired: function (e) {
    return 'Llevas ' + e.apuestasCompletadas + ' apuestas lanzadas en ' + e.empresa + ' con evidencia ' + Math.round(e.evidencia) +
      '. Cagan preguntaría: ¿atacaste el riesgo de valor ANTES de construir, o estás validando la factibilidad de cosas que nadie pidió?';
  },

  trap: function (e) {
    return e.fabrica ? e.empresa + ' está en modo fábrica: roadmap de fechas, éxito medido en entregas. Vas a lanzar mucho y mover poco — la boleta final califica resultados.' :
      'Estás gestionando por resultados, no por entregables. Sostener esa línea cuesta capital político cada vez que ventas pide fechas; vale la pena.';
  },

  zero: function (e) {
    var a = Math.round(e.competidor.atencion * 100);
    return 'El competidor te está prestando ' + a + '% de atención. ' +
      (a < 30 ? 'Eres invisible: eso es tiempo gratis para profundizar tu diferencia antes de que te copien.' :
       'Ya te están mirando: la paridad de features desde aquí es una carrera que gana el que va adelante. Tu única salida es ser distinto en algo que no quieran copiar.');
  },

  innov: function (e) {
    return e.precio > (e.precioInicio || e.precio) ?
      'Subiste el precio de $' + e.precioInicio + ' a $' + e.precio + ': la clásica marcha hacia arriba. La advertencia de Christensen: cada escalón que subes deja vacío el de abajo — por ahí van a entrar.' :
      'Sigues en el escalón de entrada ($' + e.precio + '). Aburrido y correcto: el disruptor crece desde abajo mientras el líder mira a sus mejores clientes.';
  },

  hard: function (e) {
    var run = Motor.runwayMeses(e);
    return 'Hoy en ' + e.empresa + ': runway ' + (run > 90 ? 'infinito' : run.toFixed(1) + ' meses') + ', capital político ' + Math.round(e.politico) +
      '. Horowitz diría: no hay jugada perfecta desde aquí — elige rápido entre opciones malas y hazte cargo. Estancarse también es una decisión.';
  },

  accelerate: function (e) {
    return e.cd ? 'Con despliegue continuo encendido: lotes chicos, menos riesgo de incidentes y +12% de capacidad. La paradoja, confirmada: eres más rápido Y más estable.' :
      'Todavía despliegas por evento. Los datos del libro: los equipos de élite despliegan más seguido Y fallan menos. Tu lote grande no te está protegiendo — es la causa del riesgo.';
  },

  pgdefault: function (e) {
    var run = Motor.runwayMeses(e);
    var crece = e.hist.length >= 2 && e.hist[e.hist.length - 1].mrr > e.hist[e.hist.length - 2].mrr * 1.03;
    if (e.mrr > Motor.burnMensual(e)) return e.empresa + ' está VIVA POR DEFECTO: los ingresos ya cubren el burn. Desde aquí, nadie puede matarte.';
    return e.empresa + ' hoy está MUERTA POR DEFECTO: burn de $' + Math.round(Motor.burnMensual(e) / 1000) + 'k contra ingresos de $' + Math.round(e.mrr / 1000) +
      'k, runway ' + (run > 90 ? '∞' : run.toFixed(1) + 'm') + (crece ? ', pero los ingresos crecen: la pregunta es si llegan antes que el cero.' : ' y los ingresos no crecen. ESE es el problema, no el roadmap.');
  },

  seibel: function (e) {
    var f = Math.round(Motor.fitMax(e) * 100);
    return 'Tu mejor fit está en ' + f + '%. ' + (f >= 70 ? 'Ya puedes empezar a sentirlo: si la demanda todavía no te ahoga, estás cerca.' :
      'Seibel sería brutal: no lo tienes, y hasta que lo tengas, cualquier otra prioridad — crecer, escalar, contratar — es prematura.');
  },

  badblood: function (e) {
    return 'Tu Lupa está en ' + Math.round(e.lupa) + '. Theranos empezó con una mentira de este tamaño para cerrar una ronda: ' +
      'el interés compuesto de los atajos es la tesis del libro, y tu medidor ya está corriendo.';
  },

  wasserman: function (e) {
    return e.esFundador ? 'Tienes el ' + Math.round(e.capTable.fund * 100) + '% de ' + e.empresa +
      ': cada decisión de aquí en adelante te va a pedir elegir entre control y valor. Rico o rey — casi nunca ambos.' :
      'Como empleado tu dilema es el espejo: autoridad hoy contra equity que hace vesting mañana. Elígelo consciente en la próxima oferta.';
  },

  pricing: function (e) {
    return 'Tu precio hoy: $' + e.precio + '/mes' + (e.precio !== e.precioInicio ? ' (empezaste en $' + e.precioInicio + ')' : '') +
      '. La pregunta del libro: ¿lo decidió una investigación de disposición a pagar, o es un sobrante del pitch original? El precio es diseño de producto.';
  }
};

function aplicarLibro(id, e) {
  if (!e || !APLICAR[id]) return null;
  var t = null;
  try { t = APLICAR[id](e); } catch (err) { t = null; }
  return t;
}
