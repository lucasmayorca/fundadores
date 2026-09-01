/* Biblioteca: los 20 libros que el juego usa como modelo mental.
   Cada ficha explica el concepto con mis palabras y dice cómo lo simula el motor.
   ES5 estricto (Safari 9). */

var LIBROS = [

/* ---------------- STARTUP ---------------- */
{ id:'lean', pilar:'startup',
  titulo:'The Lean Startup', autor:'Eric Ries',
  concepto:'Aprendizaje validado',
  idea:'Una startup no es una empresa chica: es un experimento para descubrir si '+
       'un negocio es posible. Lo que se produce no son features, es conocimiento. '+
       'El ciclo construir-medir-aprender vale por la vuelta completa, no por la '+
       'primera parte, y cuando la evidencia dice que la hipótesis era falsa, la '+
       'respuesta honesta es pivotar en vez de seguir remando.',
  juego:'Tu "evidencia" es una variable real. Con evidencia baja, las estimaciones '+
        'de impacto que ves en el backlog son ruido disfrazado de número.' },

{ id:'zero', pilar:'startup',
  titulo:'Zero to One', autor:'Peter Thiel',
  concepto:'Diferenciarse, no competir',
  idea:'Copiar lo que ya existe te mete en una pelea de márgenes que no vas a ganar. '+
       'El valor se captura siendo distinto de forma defendible en un nicho chico '+
       'que podés dominar, no siendo el 5% mejor que el líder en su propio terreno.',
  juego:'Construir paridad con el competidor sube poco el fit y despierta su atención. '+
        'Cubrir necesidades que él ignora te da crecimiento que no te pueden copiar rápido.' },

{ id:'chasm', pilar:'startup',
  titulo:'Crossing the Chasm', autor:'Geoffrey Moore',
  concepto:'El abismo y el producto completo',
  idea:'Los visionarios te compran una promesa; los pragmáticos compran algo que ya '+
       'le funciona a alguien parecido a ellos. Entre esos dos grupos hay un abismo: '+
       'no se cruza con más marketing, se cruza eligiendo un nicho angosto y '+
       'entregándole todo lo que necesita para no correr riesgo — integraciones, '+
       'soporte, referencias, seguridad.',
  juego:'La mayoría temprana tiene una compuerta. Si no cumplís sus requisitos, tu '+
        'gasto en crecimiento se evapora aunque los early adopters te amen.' },

{ id:'innov', pilar:'startup',
  titulo:'The Innovator’s Dilemma', autor:'Clayton Christensen',
  concepto:'Disrupción desde abajo',
  idea:'Las empresas grandes no pierden por tontas: pierden por hacerle caso a sus '+
       'mejores clientes, que siempre piden más de lo mismo. Eso las empuja hacia '+
       'arriba y les deja libre la gama baja, que es justo donde un producto peor '+
       'pero más simple puede crecer sin que nadie reaccione.',
  juego:'El competidor tiene "atención". Si entrás por su segmento premium te aplasta; '+
        'si crecés por abajo te ignora hasta que ya es tarde para él.' },

{ id:'hard', pilar:'startup',
  titulo:'The Hard Thing About Hard Things', autor:'Ben Horowitz',
  concepto:'Decisiones sin opción buena',
  idea:'Los problemas difíciles de verdad no tienen una respuesta correcta esperando '+
       'a que la encuentres: tienen dos caminos malos y hay que elegir uno rápido y '+
       'bancarlo. Las recetas sirven en tiempos de paz; en tiempos de guerra lo único '+
       'que queda es cuidar a la gente y decir la verdad temprano.',
  juego:'Varios dilemas no tienen opción óptima. Postergar también es elegir, y el '+
        'motor lo cobra.' },

{ id:'deals', pilar:'startup',
  titulo:'Venture Deals', autor:'Brad Feld y Jason Mendelson',
  concepto:'Los términos pesan más que la valoración',
  idea:'El titular de una ronda es la valoración, pero lo que define cuánto te llevás '+
       'está en la letra chica: preferencia de liquidación, si es participativa, y de '+
       'qué lado de la ronda se crea el pool de opciones. Una valoración alta con '+
       'términos duros puede dejarte con menos que una valoración baja y limpia.',
  juego:'Las hojas de términos son reales. Al final del juego ves la cascada de salida '+
        'y cuánto te costó cada cláusula que firmaste.' },

{ id:'grove', pilar:'startup',
  titulo:'High Output Management', autor:'Andy Grove',
  concepto:'Apalancamiento gerencial',
  idea:'El resultado de un manager es el resultado de su organización, no el suyo '+
       'propio. Por eso conviene medir las actividades por cuánto multiplican el '+
       'trabajo de los demás, y mirar indicadores adelantados en vez de enterarte del '+
       'problema cuando ya explotó.',
  juego:'Moral, foco y estructura multiplican tu capacidad. Sin ellos, sumar gente '+
        'produce menos de lo que cuesta.' },

/* ---------------- PRODUCTO ---------------- */
{ id:'inspired', pilar:'producto',
  titulo:'Inspired', autor:'Marty Cagan',
  concepto:'Los cuatro riesgos',
  idea:'Antes de construir hay que atacar cuatro riesgos distintos: si alguien lo va a '+
       'querer, si lo va a poder usar, si lo podemos construir y si tiene sentido para '+
       'el negocio. Los equipos que reciben una lista de features cerrada nunca atacan '+
       'los dos primeros, que son los que matan productos.',
  juego:'Cada apuesta del backlog cubre una necesidad concreta. Construir sin haber '+
        'reducido el riesgo de valor es apostar a ciegas.' },

{ id:'torres', pilar:'producto',
  titulo:'Continuous Discovery Habits', autor:'Teresa Torres',
  concepto:'Cadencia de descubrimiento',
  idea:'El descubrimiento no es una fase que hacés al principio: es un hábito semanal '+
       'del mismo equipo que construye. Se mapean oportunidades reales que salen de '+
       'entrevistas y recién ahí se piensan soluciones, siempre varias en paralelo '+
       'para poder compararlas.',
  juego:'La evidencia se degrada sola cada sprint. Descubrir de a ráfagas no alcanza: '+
        'hay que sostener la cadencia.' },

{ id:'momtest', pilar:'producto',
  titulo:'The Mom Test', autor:'Rob Fitzpatrick',
  concepto:'Preguntar por el pasado, no por el futuro',
  idea:'Si preguntás si tu idea gusta, todo el mundo te va a mentir para no lastimarte. '+
       'Las respuestas útiles salen de hechos: qué hicieron la última vez que tuvieron '+
       'el problema, cuánto les costó, qué probaron. Los cumplidos son ruido; los '+
       'compromisos concretos son datos.',
  juego:'Define la calidad de tu descubrimiento. Entrevistas malas no te dejan sin '+
        'información: te dan información falsa y optimista, que es peor.' },

{ id:'trap', pilar:'producto',
  titulo:'Escaping the Build Trap', autor:'Melissa Perri',
  concepto:'Resultados, no entregables',
  idea:'La trampa es medir el éxito por cuántas cosas se entregaron en vez de por qué '+
       'cambió en el comportamiento del usuario o del negocio. Un roadmap lleno de '+
       'features es una lista de outputs disfrazada de estrategia.',
  juego:'Entregar mucho no mueve la aguja si las apuestas no tocan necesidades reales. '+
        'El boletín final te puntúa por resultados, no por features enviadas.' },

{ id:'hooked', pilar:'producto',
  titulo:'Hooked', autor:'Nir Eyal',
  concepto:'Bucle de hábito',
  idea:'Los productos que se usan solos cierran un ciclo: un disparador lleva a una '+
       'acción simple, la acción da una recompensa algo variable, y el usuario deja '+
       'algo suyo adentro que hace que la próxima vuelta valga más. Ese depósito es lo '+
       'que convierte uso en costumbre.',
  juego:'La retención alimenta el boca a boca. Pero forzar el bucle sin valor real '+
        'sube el uso a corto plazo y te destruye la marca.' },

{ id:'krug', pilar:'producto',
  titulo:'Don’t Make Me Think', autor:'Steve Krug',
  concepto:'Fricción y activación',
  idea:'Nadie lee tu interfaz: la escanea y adivina. Cada momento en que alguien tiene '+
       'que detenerse a entender qué hacer es una fuga, y esas fugas se acumulan '+
       'silenciosamente en el camino de entrada al producto.',
  juego:'La usabilidad multiplica la conversión de todo el tráfico que traés. Es la '+
        'palanca más barata y la que más se posterga.' },

{ id:'analytics', pilar:'producto',
  titulo:'Lean Analytics', autor:'Alistair Croll y Benjamin Yoskovitz',
  concepto:'Métrica de vanidad vs. accionable',
  idea:'Los totales acumulados siempre suben y por eso no te dicen nada. Las métricas '+
       'que sirven son tasas y cohortes, comparadas contra una línea que definiste '+
       'antes, y conviene tener una sola que importe en cada etapa.',
  juego:'El HUD muestra usuarios totales bien grandes. La retención por segmento está '+
        'más chica y es la que decide si sobrevivís.' },

/* ---------------- TECNOLOGÍA ---------------- */
{ id:'accelerate', pilar:'tech',
  titulo:'Accelerate', autor:'Nicole Forsgren, Jez Humble y Gene Kim',
  concepto:'Velocidad y estabilidad no se negocian entre sí',
  idea:'La intuición dice que ir más rápido rompe más cosas, y los datos dicen lo '+
       'contrario: los equipos que despliegan seguido y en lotes chicos también '+
       'fallan menos y se recuperan antes. Entregas grandes y espaciadas son la causa '+
       'del riesgo, no la protección contra él.',
  juego:'Invertir en plataforma baja la probabilidad de incidente Y sube tu capacidad. '+
        'No es un impuesto: es la palanca compuesta.' },

{ id:'brooks', pilar:'tech',
  titulo:'The Mythical Man-Month', autor:'Fred Brooks',
  concepto:'Ley de Brooks y ley de Conway',
  idea:'Sumar gente a un proyecto atrasado lo atrasa más, porque los recién llegados '+
       'no producen todavía y consumen tiempo de los que sí producían, mientras los '+
       'canales de comunicación crecen mucho más rápido que el equipo. Y el sistema '+
       'que termina saliendo copia la forma de la organización que lo construyó.',
  juego:'Cada contratación tarda dos sprints en producir y te cobra mentoría mientras '+
        'tanto. Contratar cinco de golpe te borra el trimestre.' },

{ id:'sre', pilar:'tech',
  titulo:'Site Reliability Engineering', autor:'Google (Beyer, Jones, Petoff, Murphy)',
  concepto:'Presupuesto de error',
  idea:'El 100% de disponibilidad es el objetivo equivocado: cuesta muchísimo y nadie '+
       'lo nota. Si acordás un objetivo realista, la diferencia hasta el 100% es un '+
       'presupuesto que podés gastar a propósito en ir más rápido, y cuando se agota, '+
       'la prioridad cambia sola sin que nadie tenga que discutirlo.',
  juego:'Tenés un presupuesto de error por trimestre. Si lo quemás, el próximo sprint '+
        'entra en congelamiento y no podés construir.' },

{ id:'topologies', pilar:'tech',
  titulo:'Team Topologies', autor:'Matthew Skelton y Manuel Pais',
  concepto:'Carga cognitiva como límite',
  idea:'Un equipo tiene un techo de cuánto sistema puede tener en la cabeza, y cuando '+
       'lo pasás no se arregla con esfuerzo. La solución es cortar el trabajo por '+
       'límites que un equipo pueda dueñar entero y hacer que las interacciones entre '+
       'equipos sean explícitas en vez de improvisadas.',
  juego:'Pasando cierto tamaño, cada persona nueva rinde menos hasta que reorganizás '+
        'en equipos con límites claros.' },

{ id:'ddia', pilar:'tech',
  titulo:'Designing Data-Intensive Applications', autor:'Martin Kleppmann',
  concepto:'La escala rompe supuestos',
  idea:'Una arquitectura no se degrada suave: aguanta, aguanta, y en algún punto de '+
       'carga se cae de golpe porque un supuesto que era invisible dejó de valer. Por '+
       'eso conviene diseñar sabiendo dónde está ese punto en vez de descubrirlo un '+
       'martes a la noche.',
  juego:'Si los usuarios crecen más rápido que tu arquitectura, la probabilidad de '+
        'incidente se dispara de forma no lineal. El éxito es lo que te tira abajo.' },

{ id:'fowler', pilar:'tech',
  titulo:'Refactoring', autor:'Martin Fowler',
  concepto:'Deuda técnica e interés compuesto',
  idea:'Tomar un atajo es pedir prestado tiempo, y como todo préstamo paga interés: '+
       'cada cambio futuro sale un poco más caro. Se devuelve en cuotas chicas y '+
       'continuas mientras trabajás; la reescritura desde cero casi siempre es la '+
       'forma más cara de pagar la misma deuda.',
  juego:'La deuda te grava un porcentaje de TODA tu capacidad, cada sprint, para '+
        'siempre. Es la variable que más gente deja crecer sin mirar.' }
,

/* ================= YC Y ENSAYOS ================= */
{ id:'pgdefault', pilar:'yc', titulo:'Default Alive or Default Dead?', autor:'Paul Graham',
  concepto:'Vivo o muerto por defecto',
  idea:'La pregunta que casi nadie se hace a tiempo: si nada cambia, con este crecimiento y este '+
       'gasto, ¿llegás a rentable antes de quedarte sin caja? Si la respuesta es no, sos "muerto '+
       'por defecto" y todas tus decisiones deberían ser otras. No saberlo es la forma más común de morir.',
  juego:'Se abrió porque tu runway bajó de 7 meses. Ahora contestá la pregunta.',
  cuando:function(e,c){ return Motor.runwayMeses(e) < 7; } },

{ id:'pgscale', pilar:'yc', titulo:'Do Things That Don\'t Scale', autor:'Paul Graham',
  concepto:'Hacé lo que no escala',
  idea:'Al principio conseguí usuarios a mano, de a uno, y dales un servicio absurdamente bueno. '+
       'Lo que no escala es justo lo que te enseña qué construir. Escalar es un problema que ojalá '+
       'tengas después; hoy tu problema es que a alguien le importe.',
  juego:'En semilla, el descubrimiento manual rinde más que cualquier campaña.',
  cuando:function(e,c){ return e.etapa === 'semilla' && e.mesPuesto <= 3; } },

{ id:'pgmakers', pilar:'yc', titulo:'Maker\'s Schedule, Manager\'s Schedule', autor:'Paul Graham',
  concepto:'Dos agendas incompatibles',
  idea:'El que construye necesita bloques largos; el que gestiona vive en bloques de una hora. Una '+
       'sola reunión mal puesta le rompe la tarde entera a un maker. Mezclar las dos agendas sin '+
       'darse cuenta destruye más capacidad que cualquier bug.',
  juego:'Tu foco cayó abajo de 40: la capacidad efectiva del equipo cae con él.',
  cuando:function(e,c){ return e.foco < 40; } },

{ id:'pgramen', pilar:'yc', titulo:'Ramen Profitability', autor:'Paul Graham',
  concepto:'Rentabilidad ramen',
  idea:'El punto donde los ingresos pagan los fideos de los fundadores. No es éxito: es libertad. '+
       'Desde ahí nadie te puede matar — ni el mercado de capital ni un inversor apurado — y eso '+
       'cambia el tono de todas tus negociaciones.',
  juego:'Tus ingresos superaron el burn en etapa semilla. El reloj de la muerte se apagó.',
  cuando:function(e,c){ return e.etapa === 'semilla' && e.mrr > Motor.burnMensual(e); } },

{ id:'pgdie', pilar:'yc', titulo:'How Not to Die', autor:'Paul Graham',
  concepto:'No morir es una habilidad',
  idea:'Las startups casi nunca mueren asesinadas: se suicidan. Los fundadores se cansan, se pelean, '+
       'se van a un trabajo. Si simplemente no morís y algo mejora cada semana, el tiempo empieza a '+
       'jugar para vos. Sobrevivir feo también es sobrevivir.',
  juego:'Estuviste con la caja al límite y seguís acá. Exactamente de esto hablaba.',
  cuando:function(e,c){ return e.caja < Motor.burnMensual(e) * 2 && e.mesPuesto > 3; } },

{ id:'yclaunch', pilar:'yc', titulo:'Launch Now', autor:'Y Combinator',
  concepto:'Lanzá ahora',
  idea:'Si tu primera versión no te da un poco de vergüenza, lanzaste tarde. El lanzamiento no es '+
       'el final del desarrollo: es el comienzo del aprendizaje. Todo lo que hiciste antes de tener '+
       'usuarios reales era, con suerte, una hipótesis bien escrita.',
  juego:'Entregaste tu primera apuesta: recién ahora el "impacto real" existe.',
  cuando:function(e,c){ return e.apuestasCompletadas >= 1; } },

{ id:'yctalk', pilar:'yc', titulo:'Write Code and Talk to Users', autor:'Y Combinator',
  concepto:'El mantra de YC',
  idea:'Escribí código y hablá con usuarios: todo lo demás es opcional. La mitad de los fundadores '+
       'hace solo lo primero y construye en el vacío; la otra mitad hace solo reuniones. El bucle '+
       'completo son las dos cosas, todas las semanas.',
  juego:'Este mes hiciste descubrimiento Y construcción. Ese es el bucle.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.desc > 0 && e.gastoPropio.cons > 0; } },

{ id:'ycgrowth', pilar:'yc', titulo:'Startup = Growth', autor:'Paul Graham',
  concepto:'Startup es crecimiento',
  idea:'Una startup no es una empresa nueva ni una empresa de tecnología: es una empresa diseñada '+
       'para crecer rápido. Ese compromiso define todo lo demás — qué problemas valen, qué mercados '+
       'sirven, cuánta prolijidad podés permitirte.',
  juego:'Creciste más de 15% en un mes. Esto es lo que viniste a buscar.',
  cuando:function(e,c){ var h = e.hist; if (h.length < 2) return false;
    var a = h[h.length-2].u, b = h[h.length-1].u; return a > 100 && b > a * 1.15; } },

{ id:'pgfund', pilar:'yc', titulo:'A Fundraising Survival Guide', autor:'Paul Graham',
  concepto:'Sobrevivir a levantar',
  idea:'Levantar plata es un segundo trabajo de tiempo completo que nadie pidió. Las reglas: hacelo '+
       'rápido, en paralelo, sin enamorarte de ningún fondo, y volvé a construir. El peor estado '+
       'posible es el "casi cerrando" eterno, que consume empresas enteras.',
  juego:'Cerraste tu primera ronda. Ahora volvé al producto.',
  cuando:function(e,c){ return e.rondas.length >= 1; } },

{ id:'pgmean', pilar:'yc', titulo:'Mean People Fail', autor:'Paul Graham',
  concepto:'Los malos pierden, a la larga',
  idea:'En startups la maldad es cara: espanta a la gente buena, cierra puertas que no sabías que '+
       'existían y te deja rodeado solo de gente que negocia como vos. Ser derecho no es solo ético: '+
       'es, egoístamente, la mejor estrategia disponible.',
  juego:'La Lupa te está mirando. Esta ficha se abre sola cuando eso pasa.',
  cuando:function(e,c){ return e.lupa >= 35; } },

{ id:'pgrr', pilar:'yc', titulo:'Relentlessly Resourceful', autor:'Paul Graham',
  concepto:'Implacablemente ingenioso',
  idea:'Graham buscó dos palabras que definieran al buen fundador y llegó a estas: implacable e '+
       'ingenioso. No aceptar el mundo como viene — pero adaptarse en los medios, jamás en el '+
       'objetivo. Lo contrario de quedarse quieto con elegancia.',
  juego:'Estás operando en pleno invierno del capital. Momento de demostrarlo.',
  cuando:function(e,c){ return e.eraId === 'invierno' && e.mesPuesto > 4; } },

{ id:'seibel', pilar:'yc', titulo:'The Real Product-Market Fit', autor:'Michael Seibel',
  concepto:'PMF de verdad',
  idea:'Product-market fit no es sentirse bien con el producto: es estar tapado de demanda que no '+
       'podés atender, con servidores que sufren y clientes que insisten. Si tenés que preguntarte '+
       'si lo tenés, no lo tenés — y buscarlo es tu única tarea.',
  juego:'Tu fit superó 0,7 en algún segmento. Esto empieza a parecerse.',
  cuando:function(e,c){ return Motor.fitMax(e) > 0.72; } },

/* ================= STARTUP (más) ================= */
{ id:'blank', pilar:'startup', titulo:'The Four Steps to the Epiphany', autor:'Steve Blank',
  concepto:'Desarrollo de clientes',
  idea:'El libro que originó todo el movimiento lean: los hechos no viven en tu oficina, viven '+
       'afuera del edificio. Los clientes se descubren con el mismo rigor con que se construye el '+
       'producto — en fases, con hipótesis, y antes de escalar nada.',
  juego:'Llegaste a evidencia 70. Saliste del edificio de verdad.',
  cuando:function(e,c){ return e.evidencia >= 70; } },

{ id:'whatyoudo', pilar:'startup', titulo:'What You Do Is Who You Are', autor:'Ben Horowitz',
  concepto:'Cultura = decisiones',
  idea:'La cultura no es lo que declarás en la pared: es lo que tu gente hace cuando no estás. Se '+
       'define en las decisiones incómodas — a quién ascendés, qué perdonás, qué atajo aceptás. '+
       'Cada una enseña más que cualquier documento de valores.',
  juego:'Tu equipo está mirando cómo decidís en la zona gris. Y aprende de eso.',
  cuando:function(e,c){ return e.moral < 50 && e.lupa >= 25; } },

{ id:'runninglean', pilar:'startup', titulo:'Running Lean', autor:'Ash Maurya',
  concepto:'Iterar del plan A al plan que funciona',
  idea:'Tu plan A casi seguro está mal, y está bien que lo esté: el trabajo es documentarlo en una '+
       'página, atacar lo más riesgoso primero y cambiar de plan con método, no con pánico. El pivote '+
       'es una herramienta, no una derrota.',
  juego:'Pivotaste. Conservaste el aprendizaje y soltaste el plan: eso era.',
  cuando:function(e,c){ return !!e.pivoteHecho; } },

{ id:'blitz', pilar:'startup', titulo:'Blitzscaling', autor:'Reid Hoffman',
  concepto:'Velocidad sobre eficiencia',
  idea:'Cuando el mercado es enorme y el ganador se lleva todo, crecer desprolijo le gana a crecer '+
       'bien. Es carísimo, rompe la organización a propósito y casi siempre es la excusa equivocada '+
       '— pero cuando de verdad aplica, el que duda pierde.',
  juego:'Tenés 3+ personas en rampa a la vez. Estás pagando el precio del blitz.',
  cuando:function(e,c){ return e.rampa.length >= 3; } },

{ id:'rework', pilar:'startup', titulo:'Rework', autor:'Jason Fried y DHH',
  concepto:'Chico es una ventaja',
  idea:'La herejía que funciona: no levantar, no crecer por crecer, no hacer reuniones. La '+
       'restricción es un regalo — te obliga a construir solo lo esencial y a cobrar desde el día '+
       'uno. No toda empresa buena es una startup de capital de riesgo.',
  juego:'Sos fundador, llevás meses sin levantar, y seguís vivo. Hay otro camino y lo estás pisando.',
  cuando:function(e,c){ return e.esFundador && e.rondas.length === 0 && e.mesPuesto > 9; } },

{ id:'foundersatwork', pilar:'startup', titulo:'Founders at Work', autor:'Jessica Livingston',
  concepto:'Todos empezaron mal',
  idea:'Decenas de fundadores famosos contando el principio real: ideas que eran otras, socios que '+
       'se fueron, meses de nada. El patrón no es el genio: es aguantar la incomodidad de que nada '+
       'funcione todavía, sin dejar de moverse.',
  juego:'Fundaste. Bienvenido al club de los que empezaron sin saber.',
  cuando:function(e,c){ return e.esFundador; } },

{ id:'dunford', pilar:'startup', titulo:'Obviously Awesome', autor:'April Dunford',
  concepto:'Posicionamiento deliberado',
  idea:'Tu producto no compite contra quien vos creés: compite contra lo que el cliente ya usa, '+
       'aunque sea una planilla. Elegir el contexto correcto — qué sos, para quién, en vez de qué — '+
       'puede duplicar la conversión sin tocar una línea de código.',
  juego:'Te compararon con el competidor. El encuadre de esa comparación era elegible.',
  cuando:function(e,c){ return !!e.eventosVistos.paridad; } },

{ id:'playbigger', pilar:'startup', titulo:'Play Bigger', autor:'Ramadan, Peterson y otros',
  concepto:'Diseñar la categoría',
  idea:'Las empresas legendarias no ganan mercados: los crean. Diseñar la categoría es definir el '+
       'problema en tus términos, ponerle nombre y educarlo, para que cuando el mercado madure, la '+
       'respuesta obvia seas vos.',
  juego:'Tu marca pasó de 60: empezás a definir cómo se habla del problema.',
  cuando:function(e,c){ return e.marca >= 60; } },

{ id:'helmer', pilar:'startup', titulo:'7 Powers', autor:'Hamilton Helmer',
  concepto:'Poder, no ventaja',
  idea:'Una feature no es una ventaja: es una demora. El poder durable viene de siete lugares — '+
       'escala, red, costos de cambio, marca, recurso cautivo, contra-posicionamiento, poder de '+
       'proceso. Si no podés nombrar el tuyo, no lo tenés.',
  juego:'Tenés fit alto y el competidor sigue sin mirarte: eso ES contra-posicionamiento.',
  cuando:function(e,c){ return Motor.fitMax(e) > 0.6 && e.competidor.atencion < 0.3; } },

{ id:'innovsol', pilar:'startup', titulo:'The Innovator\'s Solution', autor:'Clayton Christensen',
  concepto:'La secuela con el manual',
  idea:'Si el Dilema explica por qué caen los grandes, la Solución explica cómo atacarlos: entrar '+
       'por donde su estructura de costos les prohíbe seguirte, y crecer hacia arriba a tu ritmo, '+
       'no al de tu ego.',
  juego:'Te enfrentaste a la decisión de subir de gama o quedarte abajo. Este libro es esa decisión.',
  cuando:function(e,c){ return !!e.eventosVistos.upmarket; } },

{ id:'paranoid', pilar:'startup', titulo:'Only the Paranoid Survive', autor:'Andy Grove',
  concepto:'Puntos de inflexión estratégicos',
  idea:'Hay momentos donde las reglas del negocio cambian 10x — una tecnología, un competidor, una '+
       'regulación — y la empresa que los atraviesa con el plan viejo muere con prolijidad. La '+
       'paranoia útil es institucional: alguien tiene que estar mirando el borde.',
  juego:'El competidor te está mirando de frente. Las reglas de tu partida acaban de cambiar.',
  cuando:function(e,c){ return e.competidor.atencion >= 0.6; } },

{ id:'antifragile', pilar:'startup', titulo:'Antifragile', autor:'Nassim Taleb',
  concepto:'Lo que mejora con el golpe',
  idea:'Robusto es lo que aguanta el caos; antifrágil es lo que se beneficia de él. Una startup '+
       'chica con caja positiva en una crisis no sobrevive al invierno: lo usa, porque sus '+
       'competidores financiados mueren más rápido que ella.',
  juego:'Ingresos mayores al burn en pleno invierno del capital. El caos trabaja para vos.',
  cuando:function(e,c){ return e.eraId === 'invierno' && e.mrr > Motor.burnMensual(e); } },

/* ================= PRODUCTO (más) ================= */
{ id:'empowered', pilar:'producto', titulo:'Empowered', autor:'Marty Cagan',
  concepto:'Equipos con problemas, no con listas',
  idea:'La secuela de Inspired apunta a los líderes: tu trabajo no es decidir qué se construye, es '+
       'armar equipos capaces de decidirlo mejor que vos. Contexto y problema hacia abajo; '+
       'soluciones y evidencia hacia arriba.',
  juego:'Empoderaste al equipo. El techo de la organización ya no sos vos.',
  cuando:function(e,c){ return !!e.empoderado; } },

{ id:'shapeup', pilar:'producto', titulo:'Shape Up', autor:'Ryan Singer',
  concepto:'Apetito, no estimación',
  idea:'En vez de preguntar cuánto tarda, preguntá cuánto vale gastarle: seis semanas, y si no '+
       'entra, se recorta el alcance, no el deadline. Y nada de empezar diez cosas: el trabajo en '+
       'paralelo es donde van los proyectos a no terminarse.',
  juego:'Tenés más de dos apuestas en vuelo: el cambio de contexto ya te está cobrando.',
  cuando:function(e,c){ var n=0,k; for(k in e.enVuelo) if(e.enVuelo.hasOwnProperty(k)) n++; return n > 2; } },

{ id:'sprintk', pilar:'producto', titulo:'Sprint', autor:'Jake Knapp',
  concepto:'Cinco días para saber',
  idea:'Un proceso para comprimir meses de debate en una semana: lunes se mapea, martes se bocetan '+
       'soluciones, miércoles se decide, jueves se prototipa, viernes se prueba con cinco usuarios '+
       'reales. La velocidad no está en construir rápido: está en decidir con datos chicos.',
  juego:'Le metiste casi la mitad de tu mes al descubrimiento. Eso es un sprint de verdad.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.desc >= 8; } },

{ id:'storymap', pilar:'producto', titulo:'User Story Mapping', autor:'Jeff Patton',
  concepto:'El mapa antes que la lista',
  idea:'Un backlog plano miente: esconde el viaje del usuario detrás de una pila de tickets. '+
       'Mapear el recorrido completo y cortarlo en rebanadas que funcionen de punta a punta evita '+
       'el clásico producto 80% hecho que no sirve para nada entero.',
  juego:'Llevás cinco apuestas entregadas: ¿forman un viaje completo o cinco pedazos sueltos?',
  cuando:function(e,c){ return e.apuestasCompletadas >= 5; } },

{ id:'jtbd', pilar:'producto', titulo:'Competing Against Luck', autor:'Clayton Christensen',
  concepto:'El trabajo por hacer',
  idea:'Nadie quiere tu producto: la gente "contrata" cosas para hacer un trabajo en su vida. El '+
       'competidor del cine no es otro cine, es el sillón. Entender el trabajo — funcional, social, '+
       'emocional — predice la compra mejor que cualquier demografía.',
  juego:'Saturaste una necesidad entera del mapa. Ese "trabajo" ya te contrata a vos.',
  cuando:function(e,c){ var k; for(k in e.cobertura) if(e.cobertura.hasOwnProperty(k) && e.cobertura[k]>=80) return true; return false; } },

{ id:'norman', pilar:'producto', titulo:'The Design of Everyday Things', autor:'Don Norman',
  concepto:'La culpa es del diseño',
  idea:'Cuando alguien usa mal tu producto, el error es tuyo: los objetos bien diseñados enseñan '+
       'su uso con la forma. Puertas que dicen si se empujan, controles que se mapean a lo que '+
       'mueven. El manual es una confesión de fracaso.',
  juego:'Usabilidad arriba de 70: tu producto empezó a explicarse solo.',
  cuando:function(e,c){ return e.usabilidad >= 70; } },

{ id:'okrdoerr', pilar:'producto', titulo:'Measure What Matters', autor:'John Doerr',
  concepto:'OKRs: enfoque comprometido',
  idea:'El sistema que Grove inventó y Doerr evangelizó: pocos objetivos que importen, resultados '+
       'clave medibles, públicos para toda la empresa, y separados del bono — para que la gente '+
       'apunte alto sin miedo a fallar honestamente.',
  juego:'Definiste el semestre. Un objetivo claro vale más que nueve consensuados.',
  cuando:function(e,c){ return !!e.eventosVistos.okr; } },

{ id:'workingback', pilar:'producto', titulo:'Working Backwards', autor:'Colin Bryar y Bill Carr',
  concepto:'Empezar por el comunicado',
  idea:'En Amazon, antes de construir se escribe el comunicado de prensa del lanzamiento y las '+
       'preguntas frecuentes del cliente. Si el comunicado no entusiasma, el producto tampoco va a '+
       'hacerlo — y descubrirlo en un documento cuesta mil veces menos.',
  juego:'Estás manejando por resultados y no por fechas. Amazon aprueba.',
  cuando:function(e,c){ return e.fabrica === false && e.mesPuesto > 6; } },

{ id:'rumelt', pilar:'producto', titulo:'Good Strategy Bad Strategy', autor:'Richard Rumelt',
  concepto:'El kernel de la estrategia',
  idea:'La estrategia buena tiene tres partes: un diagnóstico honesto, una política que guía, y '+
       'acciones coherentes entre sí. Todo lo demás — visión, misión, metas ambiciosas — no es '+
       'estrategia: es deseo con formato de PowerPoint.',
  juego:'Tu foco pasó de 75. Se nota cuando hay una estrategia de verdad.',
  cuando:function(e,c){ return e.foco >= 75; } },

{ id:'leanux', pilar:'producto', titulo:'Lean UX', autor:'Jeff Gothelf',
  concepto:'Diseño como hipótesis',
  idea:'El diseño no es la fase donde se dibuja lo ya decidido: cada pantalla es una hipótesis con '+
       'un resultado esperado. Menos entregables perfectos, más experimentos baratos con el equipo '+
       'entero mirando al usuario junto.',
  juego:'Viste a usuarios trabarse en tu embudo. Cada arreglo desde ahí es una hipótesis probada.',
  cuando:function(e,c){ return !!e.eventosVistos.friccion; } },

{ id:'justenough', pilar:'producto', titulo:'Just Enough Research', autor:'Erika Hall',
  concepto:'Investigación suficiente',
  idea:'No hace falta un departamento de research: hace falta disciplina para preguntar bien y '+
       'humildad para escuchar la respuesta. La investigación cara que no cambia decisiones vale '+
       'menos que una entrevista corta que sí.',
  juego:'Estás entrevistando bien y tu evidencia lo muestra. Suficiente ES la meta.',
  cuando:function(e,c){ return e.calidadDesc >= 1 && e.evidencia >= 50; } },

{ id:'outcomes', pilar:'producto', titulo:'Outcomes Over Output', autor:'Josh Seiden',
  concepto:'Resultado ≠ entregable',
  idea:'Un outcome es un cambio de comportamiento humano que genera valor: el cliente vuelve, el '+
       'usuario invita, el proceso deja de doler. Los features son apenas apuestas para producir '+
       'esos cambios — y la mayoría no los produce.',
  juego:'Rechazaste el roadmap de fechas. Ahora medí comportamientos, no entregas.',
  cuando:function(e,c){ return !!e.eventosVistos.roadmap; } },

{ id:'alchemy', pilar:'producto', titulo:'Alchemy', autor:'Rory Sutherland',
  concepto:'La lógica no vende',
  idea:'Lo opuesto de una buena idea puede ser otra buena idea. Los humanos no compran lo óptimo: '+
       'compran significado, señales y contexto. Un tren no mejora solo yendo más rápido; mejora '+
       'con wifi y una historia. La magia psicológica es ingeniería legítima.',
  juego:'Tu marca pasó de 70: la gente ya no compra tu producto, compra su historia.',
  cuando:function(e,c){ return e.marca >= 70; } },

{ id:'badass', pilar:'producto', titulo:'Badass: Making Users Awesome', autor:'Kathy Sierra',
  concepto:'Usuarios que la rompen',
  idea:'Nadie recomienda un producto: la gente se recomienda a sí misma siendo mejor en algo. No '+
       'hagas un producto increíble; hacé usuarios increíbles en el contexto donde tu producto '+
       'vive. El boca a boca sale de ahí, no del marketing.',
  juego:'Retención arriba de 93%: tus usuarios están ganando con vos.',
  cuando:function(e,c){ return Motor.retencionMedia(e) > 0.93; } },

{ id:'coldstart', pilar:'producto', titulo:'The Cold Start Problem', autor:'Andrew Chen',
  concepto:'La red atómica',
  idea:'Los efectos de red no arrancan grandes: arrancan en la red atómica — el grupo más chico '+
       'que se sostiene solo, aunque sean cien personas en una universidad. Ganar mil redes chicas '+
       'en serie le gana a perseguir una grande de entrada.',
  juego:'Tu sector es viral: el problema del arranque en frío es TU problema.',
  cuando:function(e,c){ return e.viral >= 2 && Motor.usuarios(e) >= 100; } },

{ id:'olsen', pilar:'producto', titulo:'The Lean Product Playbook', autor:'Dan Olsen',
  concepto:'La pirámide del PMF',
  idea:'Seis capas ordenadas: mercado, necesidades desatendidas, propuesta de valor, features, UX '+
       'y, recién arriba, el producto. El error clásico es empezar por las dos últimas capas y '+
       'rezar. El fit se diseña de abajo hacia arriba.',
  juego:'Tu fit con visionarios superó 0,6: la pirámide tiene base.',
  cuando:function(e,c){ return Motor.fit(e, 'visio') > 0.6; } },

{ id:'thinkingbets', pilar:'producto', titulo:'Thinking in Bets', autor:'Annie Duke',
  concepto:'Decisión ≠ resultado',
  idea:'Una decisión buena puede salir mal y una mala puede salir bien: juzgar por resultados '+
       'enseña las lecciones equivocadas. Pensar en apuestas — probabilidades, tamaños, información '+
       'incompleta — es lo único honesto en un mundo con azar.',
  juego:'Trabajás en la industria de las apuestas. Ironía: acá el azar es el producto.',
  cuando:function(e,c){ return e.sectorId === 'apuestas'; } },

/* ================= GROWTH Y VENTAS ================= */
{ id:'traction', pilar:'growth', titulo:'Traction', autor:'Gabriel Weinberg y Justin Mares',
  concepto:'El 50% olvidado',
  idea:'Una startup es mitad producto y mitad distribución, y los fundadores de producto le dedican '+
       '100 y 0. Hay 19 canales; el que te va a funcionar probablemente no es el que te gusta. Se '+
       'descubre con experimentos baratos, no con opiniones.',
  juego:'Pusiste tu primer punto en crecimiento. Ahora probá canales, no corazonadas.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.crec > 0; } },

{ id:'hackingg', pilar:'growth', titulo:'Hacking Growth', autor:'Sean Ellis y Morgan Brown',
  concepto:'El proceso, no el truco',
  idea:'Growth hacking no es una bolsa de trucos: es un proceso semanal — analizar, idear, '+
       'priorizar, testear — corrido por un equipo cruzado sobre TODO el embudo. El growth hack '+
       'famoso de otro casi nunca es tu palanca.',
  juego:'Ya tenés equipo de go-to-market: dales proceso, no ocurrencias.',
  cuando:function(e,c){ return e.gtm >= 3; } },

{ id:'influence', pilar:'growth', titulo:'Influence', autor:'Robert Cialdini',
  concepto:'Las seis palancas',
  idea:'Reciprocidad, compromiso, prueba social, autoridad, simpatía y escasez: seis atajos '+
       'mentales que la gente usa para decidir sin pensar. Conocerlos es marketing; abusarlos es '+
       'el camino corto a que no te crean nunca más.',
  juego:'Publicaste casos de éxito: eso es prueba social haciendo tu venta.',
  cuando:function(e,c){ return !!e.hechas.casos; } },

{ id:'positioning', pilar:'growth', titulo:'Positioning', autor:'Al Ries y Jack Trout',
  concepto:'La batalla es mental',
  idea:'El posicionamiento no se hace en el producto: se hace en la cabeza del cliente, que tiene '+
       'lugar para dos o tres marcas por categoría. Si no podés ser primero en la categoría, creá '+
       'una donde sí — la mente no se reordena, se estrena.',
  juego:'Elegiste tu cabeza de playa. Ahora sé el número uno de algo chico.',
  cuando:function(e,c){ return !!e.eventosVistos.chasm; } },

{ id:'challenger', pilar:'growth', titulo:'The Challenger Sale', autor:'Matthew Dixon y Brent Adamson',
  concepto:'Enseñar, no complacer',
  idea:'El mejor vendedor B2B no es el que construye relaciones: es el que le enseña al cliente '+
       'algo sobre su propio negocio que no sabía, adapta el mensaje y toma control de la venta. '+
       'La amabilidad empata; la perspectiva vende.',
  juego:'Negociaste con un cliente grande. El que enseñó en esa mesa, ganó.',
  cuando:function(e,c){ return !!e.eventosVistos.clientegrande; } },

{ id:'predictable', pilar:'growth', titulo:'Predictable Revenue', autor:'Aaron Ross',
  concepto:'La máquina de ingresos',
  idea:'El ingreso predecible sale de especializar: quien prospecta no cierra, quien cierra no '+
       'atiende. El embudo se vuelve una fábrica con métricas por etapa en vez de un héroe '+
       'comercial que un día se va con la agenda.',
  juego:'Tus ingresos ya pagan el burn: es hora de que dejen de depender de milagros.',
  cuando:function(e,c){ return e.mrr > Motor.burnMensual(e) && e.etapa !== 'semilla'; } },

{ id:'contagious', pilar:'growth', titulo:'Contagious', autor:'Jonah Berger',
  concepto:'Por qué se comparte',
  idea:'Las cosas no se comparten porque sean buenas: se comparten porque dan estatus social, '+
       'tienen disparadores en la vida diaria, emocionan, se ven en público o cuentan una historia. '+
       'El boca a boca se diseña, no se reza.',
  juego:'Tu producto se mueve solo de boca en boca. Alguien está quedando bien al contarlo.',
  cuando:function(e,c){ return e.viral >= 1.3 && Motor.usuarios(e) > 800; } },

{ id:'pricing', pilar:'growth', titulo:'Monetizing Innovation', autor:'Madhavan Ramanujam',
  concepto:'El precio antes que el producto',
  idea:'El 72% de los productos nuevos falla en monetizar, y la causa es siempre la misma: el '+
       'precio se decidió al final. La disposición a pagar se investiga ANTES de construir — el '+
       'precio no es un número, es diseño de producto.',
  juego:'Subiste el precio. ¿Lo decidió una investigación o un apuro?',
  cuando:function(e,c){ return e.precioInicio && e.precio > e.precioInicio; } },

{ id:'foundingsales', pilar:'growth', titulo:'Founding Sales', autor:'Pete Kazanjy',
  concepto:'El fundador vende primero',
  idea:'Nadie puede vender tu producto antes que vos: no porque seas bueno vendiendo, sino porque '+
       'las primeras cien conversaciones de venta SON el descubrimiento. Contratar un vendedor para '+
       'esquivar esa incomodidad es tirar el aprendizaje más caro.',
  juego:'Sos fundador y ya hay ingresos: esas ventas que hiciste vos valen doble.',
  cuando:function(e,c){ return e.esFundador && e.mrr > 0; } },

{ id:'purplecow', pilar:'growth', titulo:'Purple Cow', autor:'Seth Godin',
  concepto:'Notable o invisible',
  idea:'La publicidad murió de promedio: la gente ignora lo bueno y comenta lo notable. Una vaca '+
       'púrpura en el campo se cuenta sola. Si necesitás gritar para que noten tu producto, el '+
       'problema no es el volumen: es la vaca.',
  juego:'Tu marca cruzó 50. Algo de lo que hacés ya se cuenta solo.',
  cuando:function(e,c){ return e.marca >= 50; } },

/* ================= CAPITAL ================= */
{ id:'sandhill', pilar:'capital', titulo:'Secrets of Sand Hill Road', autor:'Scott Kupor',
  concepto:'Cómo piensa un VC',
  idea:'El VC no busca empresas buenas: busca las poquísimas que devuelven el fondo entero. Tu '+
       'empresa no compite contra tu mercado en esa mesa — compite contra su portfolio. Entender '+
       'esa matemática explica cada consejo raro que te dan.',
  juego:'Vas dos rondas adentro. Ya conocés la mesa; ahora conocé sus incentivos.',
  cuando:function(e,c){ return e.rondas.length >= 2; } },

{ id:'wasserman', pilar:'capital', titulo:'The Founder\'s Dilemmas', autor:'Noam Wasserman',
  concepto:'Rey o rico',
  idea:'El dato incómodo tras estudiar diez mil startups: las decisiones que maximizan tu control '+
       'y las que maximizan tu plata casi siempre son opuestas. Cofundadores, equity, inversores: '+
       'cada cruce te pide elegir, y no elegir es elegir mal las dos cosas.',
  juego:'Tu cap table ya tiene historia. Cada punto que cediste fue una de estas decisiones.',
  cuando:function(e,c){ return e.esFundador && e.capTable.fund < 0.6; } },

{ id:'powerlaw', pilar:'capital', titulo:'The Power Law', autor:'Sebastian Mallaby',
  concepto:'La ley de potencias',
  idea:'En capital de riesgo no existe el promedio: una inversión paga el fondo y las demás son '+
       'ruido. Esa matemática moldea todo el ecosistema — por qué te empujan a crecer, por qué '+
       'prefieren que mueras rápido a que vivas chico.',
  juego:'Ya juntaste equity en varias empresas. La mayoría valdrá cero. Una, quizá, todo.',
  cuando:function(e,c){ return c && c.equities && c.equities.length >= 3; } },

{ id:'psych', pilar:'capital', titulo:'The Psychology of Money', autor:'Morgan Housel',
  concepto:'Rico vs. libre',
  idea:'La plata compra opciones, no cosas. Nadie quiebra por falta de retorno: quiebra por falta '+
       'de margen de seguridad. Vender una parte cuando estás arriba no es falta de fe — es '+
       'entender que sobrevivir es el prerequisito de todo lo demás.',
  juego:'Vendiste parte de tus acciones. Jugarás mejor sin miedo a quebrar.',
  cuando:function(e,c){ return (e.ventaSecundaria || 0) > 0; } },

{ id:'voss', pilar:'capital', titulo:'Never Split the Difference', autor:'Chris Voss',
  concepto:'Empatía táctica',
  idea:'Un negociador del FBI no parte la diferencia con secuestradores. Las herramientas: escuchar '+
       'de verdad, etiquetar emociones, preguntas calibradas que empiezan con cómo, y el poder del '+
       '"no" como comienzo de la conversación real.',
  juego:'Firmaste términos limpios: alguien negoció bien en esa mesa. Ojalá vos.',
  cuando:function(e,c){ var i; for(i=0;i<e.preferencias.length;i++){ if(e.preferencias[i].mult===1 && !e.preferencias[i].part) return true; } return false; } },

/* ================= GENTE ================= */
{ id:'radical', pilar:'gente', titulo:'Radical Candor', autor:'Kim Scott',
  concepto:'Decir las cosas, con cuidado',
  idea:'Los dos fracasos del feedback: la agresión sin cuidado, y peor, la "empatía ruinosa" — no '+
       'decir nada para no herir, hasta que el problema es indefendible. Importarte la persona Y '+
       'desafiarla directo no son opuestos: son el mismo acto.',
  juego:'Tu equipo tocó fondo y se recuperó. En el medio hubo conversaciones de estas.',
  cuando:function(e,c){ return e.moral >= 70 && (e.moralMin || 100) <= 48; } },

{ id:'lencioni', pilar:'gente', titulo:'The Five Dysfunctions of a Team', autor:'Patrick Lencioni',
  concepto:'La pirámide de la confianza',
  idea:'Todo empieza en la base: sin confianza no hay conflicto honesto; sin conflicto no hay '+
       'compromiso real; sin compromiso nadie se hace cargo; y sin eso, los resultados son de '+
       'nadie. La armonía permanente es el síntoma, no la salud.',
  juego:'La moral está rota. Antes de procesos y OKRs, mirá la base de la pirámide.',
  cuando:function(e,c){ return e.moral < 38; } },

{ id:'drive', pilar:'gente', titulo:'Drive', autor:'Daniel Pink',
  concepto:'Autonomía, maestría, propósito',
  idea:'Los premios y castigos funcionan para tareas mecánicas y destruyen las creativas. Lo que '+
       'mueve al trabajo del conocimiento son tres cosas: decidir cómo (autonomía), mejorar en algo '+
       '(maestría) y que importe (propósito). El bono no compra ninguna.',
  juego:'Equipo empoderado y con moral alta: estás pagando con la moneda correcta.',
  cuando:function(e,c){ return e.empoderado && e.moral >= 75; } },

{ id:'coachb', pilar:'gente', titulo:'Trillion Dollar Coach', autor:'Eric Schmidt y otros',
  concepto:'El coach de Silicon Valley',
  idea:'Bill Campbell entrenó a los fundadores de Google, Apple y Amazon con ideas simples: el '+
       'equipo primero, la confianza antes que todo, y decir la verdad rápido. El management es un '+
       'oficio de personas que a veces incluye computadoras.',
  juego:'Dos ascensos seguidos. Alguien te está entrenando bien — o aprendiste solo.',
  cuando:function(e,c){ if (!c || !c.puestos || c.puestos.length < 2) return false;
    return c.puestos[c.puestos.length-1].promocion && c.puestos[c.puestos.length-2].promocion; } },

{ id:'managerpath', pilar:'gente', titulo:'The Manager\'s Path', autor:'Camille Fournier',
  concepto:'Cada nivel es otro trabajo',
  idea:'De hacer, a liderar a los que hacen, a liderar líderes: cada salto no es más de lo mismo, '+
       'es un trabajo nuevo con herramientas nuevas. El error clásico es seguir haciendo el trabajo '+
       'anterior, pero con reuniones.',
  juego:'Llegaste a Group PM: tu output ya es la organización, no tus manos.',
  cuando:function(e,c){ return e.rolN >= 3; } },

{ id:'norules', pilar:'gente', titulo:'No Rules Rules', autor:'Reed Hastings y Erin Meyer',
  concepto:'Densidad de talento',
  idea:'Los controles existen por los mediocres: si pagás arriba del mercado y sacás rápido a quien '+
       'no rinde, podés borrar las reglas — vacaciones, gastos, aprobaciones — y la velocidad que '+
       'ganás paga todo. Funciona solo si la densidad es real.',
  juego:'Peleaste por retener a tu estrella. La densidad de talento se defiende así.',
  cuando:function(e,c){ return !!e.eventosVistos.caza; } },

{ id:'deepwork', pilar:'gente', titulo:'Deep Work', autor:'Cal Newport',
  concepto:'Concentración como ventaja',
  idea:'El trabajo profundo — horas sin interrupciones sobre algo difícil — es cada vez más raro '+
       'y por eso cada vez más valioso. Una organización que protege la concentración de su gente '+
       'compite contra empresas que viven en el chat.',
  juego:'Foco arriba de 80. Tu equipo está haciendo trabajo que otros no pueden.',
  cuando:function(e,c){ return e.foco >= 80; } },

{ id:'crucial', pilar:'gente', titulo:'Crucial Conversations', autor:'Patterson, Grenny y otros',
  concepto:'La conversación que evitás',
  idea:'Los problemas grandes de una organización casi siempre son una conversación difícil que '+
       'nadie tuvo a tiempo. La técnica: seguridad psicológica primero, hechos antes que juicios, '+
       'y el objetivo compartido visible sobre la mesa.',
  juego:'Tu capital político está bajo: hay una conversación que estás debiendo.',
  cuando:function(e,c){ return e.politico < 30; } },

{ id:'walsh', pilar:'gente', titulo:'The Score Takes Care of Itself', autor:'Bill Walsh',
  concepto:'El estándar antes que el marcador',
  idea:'Walsh agarró al peor equipo de la NFL y ganó tres Super Bowls sin hablar de ganar: definió '+
       'el estándar de cómo se hace cada cosa — hasta cómo se atiende el teléfono — y el marcador '+
       'se acomodó solo. La cultura es el cómo, repetido.',
  juego:'Tres mandatos cumplidos en tu carrera. El estándar ya es tuyo.',
  cuando:function(e,c){ if (!c || !c.puestos) return false;
    var n=0,i; for(i=0;i<c.puestos.length;i++) if(c.puestos[i].cumplido) n++; return n >= 3; } },

/* ================= TECNOLOGÍA (más) ================= */
{ id:'pragmatic', pilar:'tech', titulo:'The Pragmatic Programmer', autor:'Andrew Hunt y David Thomas',
  concepto:'Ventanas rotas',
  idea:'Una ventana rota sin arreglar invita a romper las demás: el código malo tolerado enseña '+
       'que acá se tolera el código malo. La entropía del software no se detiene sola — se detiene '+
       'con pequeños arreglos constantes y orgullo de oficio.',
  juego:'Deuda técnica abajo de 15. En tu edificio no hay ventanas rotas.',
  cuando:function(e,c){ return e.deuda <= 15; } },

{ id:'ousterhout', pilar:'tech', titulo:'A Philosophy of Software Design', autor:'John Ousterhout',
  concepto:'Módulos profundos',
  idea:'La complejidad es EL enemigo, y se combate con módulos profundos: interfaz chica, '+
       'implementación potente. Las clases finitas y las capas que solo pasan datos multiplican la '+
       'carga cognitiva sin agregar nada. Diseñar dos veces antes de escribir una.',
  juego:'Arquitectura arriba de 60: alguien está pensando antes de escribir.',
  cuando:function(e,c){ return e.arquitectura >= 60; } },

{ id:'phoenix', pilar:'tech', titulo:'The Phoenix Project', autor:'Gene Kim y otros',
  concepto:'TI como planta fabril',
  idea:'Una novela sobre un deploy que sale mal, y la revelación: el trabajo de tecnología fluye '+
       'como una fábrica — cuellos de botella, trabajo en proceso invisible, y un Brent del que '+
       'todo depende. Ver el flujo es el primer arreglo.',
  juego:'Entraste en congelamiento: tu fábrica se frenó por el trabajo invisible.',
  cuando:function(e,c){ return !!e.congelado; } },

{ id:'contdel', pilar:'tech', titulo:'Continuous Delivery', autor:'Jez Humble y David Farley',
  concepto:'Si duele, hacelo seguido',
  idea:'El deploy doloroso no se arregla haciéndolo menos: se arregla haciéndolo tanto que duela '+
       'cero. Automatizar el camino a producción — build, test, release — convierte el evento del '+
       'jueves a la noche en un no-evento de todos los días.',
  juego:'Activaste despliegue continuo. El jueves a la noche vuelve a ser tuyo.',
  cuando:function(e,c){ return !!e.cd; } },

{ id:'releaseit', pilar:'tech', titulo:'Release It!', autor:'Michael Nygard',
  concepto:'Diseñar para el viernes a las 5',
  idea:'El sistema que pasa los tests no es el que sobrevive producción: sobrevive el que asume '+
       'que TODO va a fallar — timeouts, circuit breakers, bulkheads. La pregunta de diseño no es '+
       '"¿funciona?" sino "¿qué pasa cuando esto de al lado no funcione?".',
  juego:'Dos incidentes en el mismo puesto. Tu sistema necesita mamparas, no parches.',
  cuando:function(e,c){ return e.incidentesPuesto >= 2; } },

{ id:'staffeng', pilar:'tech', titulo:'Staff Engineer', autor:'Will Larson',
  concepto:'Senior no es el techo',
  idea:'Después de senior hay un camino que no es management: el ingeniero de staff que opera por '+
       'influencia — dirección técnica, destrabar equipos, decir que no a la arquitectura de moda. '+
       'Distinto trabajo, distinta moneda: contexto y confianza.',
  juego:'Organizaste equipos con dueños claros. Alguien técnico con influencia estuvo ahí.',
  cuando:function(e,c){ return !!e.teamTopo; } },

{ id:'elegant', pilar:'tech', titulo:'An Elegant Puzzle', autor:'Will Larson',
  concepto:'Sistemas de ingeniería',
  idea:'Los problemas de un equipo de ingeniería grande son sistémicos: tamaños de equipo, colas '+
       'de trabajo, ratios de gestión. Gestionar por anécdota falla a escala; gestionar el sistema '+
       '— tamaños, flujos, límites — es lo que queda.',
  juego:'Tu área pasó de 13 personas: bienvenido a los problemas de sistema.',
  cuando:function(e,c){ return (e.ing + e.prod) >= 13; } },

/* ================= HISTORIAS ================= */
{ id:'shoedog', pilar:'historias', titulo:'Shoe Dog', autor:'Phil Knight',
  concepto:'Nike vivió al borde',
  idea:'La memoria del fundador de Nike es una década entera sin caja: bancos que lo echan, un '+
       'socio japonés que casi lo funde, cheques que rebotan mientras la marca explota. El mito del '+
       'crecimiento prolijo es eso, un mito: crecer come caja.',
  juego:'Runway crítico y seguís operando. Knight vivió ahí diez años.',
  cuando:function(e,c){ return Motor.runwayMeses(e) < 2 && e.vivo; } },

{ id:'badblood', pilar:'historias', titulo:'Bad Blood', autor:'John Carreyrou',
  concepto:'Theranos: el fraude compuesto',
  idea:'Una mentira chica para cerrar una ronda exige otra más grande para sostenerla, hasta que '+
       'el producto es la mentira. Theranos no empezó siendo fraude: llegó ahí por interés '+
       'compuesto de atajos. Nadie se despierta un día siendo Elizabeth Holmes.',
  juego:'Tu Lupa pasó de 60. Este libro es la fotografía del final de ese camino.',
  cuando:function(e,c){ return e.lupa >= 60; } },

{ id:'hatching', pilar:'historias', titulo:'Hatching Twitter', autor:'Nick Bilton',
  concepto:'Los socios se comen entre sí',
  idea:'Cuatro fundadores, cuatro versiones de la historia, y un patrón: en las empresas que valen '+
       'algo, la pelea de socios es la regla, no la excepción. Las traiciones de Twitter no las '+
       'causó la maldad: las causó no haber hablado de poder a tiempo.',
  juego:'Tuviste tu momento con el socio fantasma. Así empiezan estos libros.',
  cuando:function(e,c){ return !!e.eventosVistos.socio; } },

{ id:'chaosm', pilar:'historias', titulo:'Chaos Monkeys', autor:'Antonio García Martínez',
  concepto:'El Valle sin filtro',
  idea:'La versión cínica y divertida: aceleradoras como casinos, adquisiciones que son despidos '+
       'con champagne, y la verdad incómoda de que muchas carreras se construyen sobre estar en la '+
       'sala correcta cuando explota la piñata.',
  juego:'Te despidieron una vez. Ahora este libro te va a resultar gracioso.',
  cuando:function(e,c){ if (!c || !c.puestos) return false;
    var i; for(i=0;i<c.puestos.length;i++) if(c.puestos[i].despido) return true; return false; } },

{ id:'superpumped', pilar:'historias', titulo:'Super Pumped', autor:'Mike Isaac',
  concepto:'Uber: crecer sin frenos',
  idea:'La cultura que conquistó cien ciudades era la misma que espiaba reguladores y quemaba '+
       'gente adentro. La lección incómoda: los rasgos que hacen ganar la guerra son los que '+
       'después incendian la casa — si nadie les pone borde.',
  juego:'Cocinaste números bajo presión. Kalanick también empezó "ganando".',
  cuando:function(e,c){ return !!e.eventosVistos.cocinar; } },

{ id:'everything', pilar:'historias', titulo:'The Everything Store', autor:'Brad Stone',
  concepto:'Amazon: la escala como religión',
  idea:'Bezos construyó sobre una idea incómoda: tu margen es mi oportunidad. Precios al piso, '+
       'pérdidas por años y obsesión operativa, apostando a que la escala compra lo que la '+
       'rentabilidad temprana nunca podrá: inevitabilidad.',
  juego:'Saturaste la necesidad de escala. Jugás al juego largo de Bezos.',
  cuando:function(e,c){ return (e.cobertura.escala || 0) >= 70; } },

{ id:'masters', pilar:'historias', titulo:'Masters of Scale', autor:'Reid Hoffman',
  concepto:'Lo que escala y lo que no',
  idea:'Del podcast al papel: fundadores contando el momento exacto donde algo chico se volvió '+
       'enorme. El patrón repetido: primero hacé algo que cien personas amen, después — y solo '+
       'después — preocupate por los millones.',
  juego:'Tu organización pasó de 18 personas. Empezó el juego de escalar gente.',
  cuando:function(e,c){ return (e.ing + e.prod + e.gtm) >= 18; } },

{ id:'lostfounder', pilar:'historias', titulo:'Lost and Founder', autor:'Rand Fishkin',
  concepto:'La startup sin filtro',
  idea:'El fundador de Moz contando lo que nadie cuenta: el down round, la depresión, el board que '+
       'te sonríe mientras vota tu reemplazo, y la matemática del VC que convierte una empresa '+
       'buena en una decepción. Honestidad como género literario.',
  juego:'Pasaste por un down round. Fishkin escribió este libro para este momento.',
  cuando:function(e,c){ return !!e.eventosVistos.downround; } }
];

function libroPorId(id) {
  for (var i = 0; i < LIBROS.length; i++) if (LIBROS[i].id === id) return LIBROS[i];
  return null;
}

/* Pilares para la biblioteca */
var PILARES = [
  { id:'startup',  nombre:'Startup',      cls:'pil-s' },
  { id:'producto', nombre:'Producto',     cls:'pil-p' },
  { id:'tech',     nombre:'Tecnología',   cls:'pil-t' },
  { id:'yc',       nombre:'YC y ensayos', cls:'pil-y' },
  { id:'growth',   nombre:'Growth y ventas', cls:'pil-g' },
  { id:'capital',  nombre:'Capital',      cls:'pil-c' },
  { id:'gente',    nombre:'Gente',        cls:'pil-e' },
  { id:'historias',nombre:'Historias',    cls:'pil-h' }
];
function pilarDe(id) {
  for (var i = 0; i < PILARES.length; i++) if (PILARES[i].id === id) return PILARES[i];
  return PILARES[0];
}

/* Fichas contextuales: se abren cuando la partida vive el concepto.
   Máximo 2 por mes para que el goteo no ensucie el cierre. */
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
   Aplicación al caso: cada función recibe el puesto en curso y
   devuelve la teoría aplicada a TUS números de hoy. Se muestra al
   abrir la ficha y al decidir un dilema. ES5 estricto.
   ================================================================ */
var APLICAR = {

  lean: function (e) {
    var n = Math.round(e.evidencia);
    if (n < 40) return 'Tu evidencia está en ' + n + ': lo que ves en el backlog es ruido con cara de número. ' +
      'Cada apuesta que construyas ahora es una hipótesis sin testear — y ya viste cuánto difiere el impacto real del esperado.';
    if (n < 70) return 'Evidencia ' + n + ': sabés a medias. Tus estimaciones se acercan, pero el ciclo construir-medir-aprender todavía tiene el segundo paso flojo.';
    return 'Evidencia ' + n + ': estás decidiendo con datos de verdad. Ojo: se degrada sola cada mes — el aprendizaje validado caduca.';
  },

  momtest: function (e) {
    if (e.calidadDesc >= 1) return 'Elegiste preguntar por hechos del pasado: tus entrevistas en ' + e.empresa +
      ' producen datos usables. Por eso tus ≈ del backlog convergen a la verdad.';
    return 'En ' + e.empresa + ' se entrevista pidiendo opiniones (calidad ' + Math.round(e.calidadDesc * 100) +
      '%): la gente te está siendo amable, no honesta. Tus estimaciones vienen infladas por ese sesgo.';
  },

  fowler: function (e) {
    var tax = Math.round((e.deuda / 100) * 55);
    return 'Tu deuda está en ' + Math.round(e.deuda) + ': este mes el equipo entero pierde ~' + tax +
      '% de su capacidad pagando ese interés. Con ' + (e.ing + e.prod) + ' personas construyendo, es como si ' +
      Math.round((e.ing + e.prod) * tax / 100) + ' trabajaran solo para el pasado.';
  },

  brooks: function (e) {
    if (e.rampa.length) return 'Tenés ' + e.rampa.length + ' persona(s) en rampa: todavía no producen y le cuestan ' +
      (e.rampa.length * 6) + ' pts de mentoría por mes a los que sí producían. Exactamente la ley de Brooks en acción.';
    return 'Hoy nadie está en rampa. Si contratás, recordá: cada incorporación son 2 meses sin producir y 6 pts/mes de mentoría del resto.';
  },

  chasm: function (e) {
    var r = Motor.requisitosGate(e), ok = 0, i;
    for (i = 0; i < r.length; i++) if (r[i].ok) ok++;
    var g = Motor.compuerta(e, 'pragm');
    if (g >= 1) return 'Cruzaste: cumplís los ' + r.length + ' requisitos de "' + e.gateNombre + '" y el mercado grande te compra.';
    return 'Tu compuerta es "' + e.gateNombre + '": cumplís ' + ok + ' de ' + r.length + ' requisitos, así que el mercado grande ' +
      'convierte al ' + Math.round(g * 100) + '% de lo normal. Todo lo que gastes en alcance hacia ellos se pierde en esa proporción.';
  },

  sre: function (e) {
    return 'Tu presupuesto de error está en ' + Math.round(e.presupuestoError) + '/100 este trimestre' +
      (e.congelado ? ' — agotado: por eso estás en congelamiento y casi no se construye.' :
       e.presupuestoError < 40 ? '. Un incidente más y se agota: el congelamiento cambia la prioridad solo.' :
       '. Tenés margen para moverte rápido; para eso existe.');
  },

  ddia: function (e) {
    var c = Math.round(Motor.carga(e) * 100);
    return 'Tu carga está al ' + c + '% de lo que aguanta la arquitectura de ' + e.empresa + '. ' +
      (c > 85 ? 'Estás en la zona donde los supuestos invisibles se rompen de golpe: la probabilidad de caída crece no lineal desde acá.' :
       c > 60 ? 'Todavía respira, pero si los usuarios crecen más rápido que la arquitectura, el éxito te tira abajo.' :
       'Hay margen. El momento barato de invertir en escala es antes de necesitarla.');
  },

  topologies: function (e) {
    var tam = e.ing + e.prod, umbral = (e.teamTopo ? 12 : 8) + Math.round(e.hab.liderazgo / 12);
    if (tam > umbral) return 'Tu área tiene ' + tam + ' personas y el techo cognitivo está en ' + umbral +
      ': cada persona por encima rinde menos. No se arregla con esfuerzo: se arregla cortando el sistema en equipos con dueño.';
    return 'Área de ' + tam + ' con techo en ' + umbral + ': la carga cognitiva todavía entra en las cabezas. Cuando crezcas, cortá por límites, no por capas.';
  },

  deals: function (e) {
    if (!e.preferencias.length) return 'Todavía no firmaste términos en ' + e.empresa + '. Cuando llegue la hoja: la valoración es el titular; la preferencia de liquidación es la letra que decide cuánto te llevás.';
    var pref = 0, part = false, i;
    for (i = 0; i < e.preferencias.length; i++) { pref += e.preferencias[i].monto * e.preferencias[i].mult; if (e.preferencias[i].part) part = true; }
    return 'Hay $' + Math.round(pref / 1000000) + 'M de preferencias ' + (part ? 'PARTICIPATIVAS ' : '') + 'delante tuyo en la cascada: en cualquier salida, eso cobra primero' +
      (part ? ' y además participa del resto. El titular de la ronda era lindo; esta línea es la que importa.' : '.');
  },

  analytics: function (e) {
    return 'Tus usuarios totales solo suben — por eso tranquilizan y no informan. El número que decide es la retención: hoy ' +
      Math.round(Motor.retencionMedia(e) * 100) + '% mensual. Con eso, de cada 100 que entran hoy quedan ' +
      Math.round(Math.pow(Motor.retencionMedia(e), 6) * 100) + ' en seis meses. Esa es tu verdad.';
  },

  hooked: function (e) {
    var r = Math.round(Motor.retencionMedia(e) * 100);
    return 'Retención ' + r + '%: ' + (r >= 90 ? 'hay hábito de verdad — el disparador interno ya existe y el boca a boca sale de acá.' :
      'todavía no hay bucle. Preguntate qué deposita el usuario adentro de ' + e.empresa + ' que haga que la próxima visita valga más que la anterior.');
  },

  krug: function (e) {
    var u = Math.round(e.usabilidad);
    return 'Usabilidad ' + u + ': la conversión de TODO tu tráfico se multiplica por ~' +
      (Math.round((0.35 + u / 100 * 0.65) * 100) / 100) + ' por esta sola variable. ' +
      (u < 50 ? 'Es la palanca más barata que tenés y la estás pagando en cada visita que se va.' : 'Está trabajando a favor tuyo.');
  },

  grove: function (e) {
    return 'Tu output es el de tu organización: con moral ' + Math.round(e.moral) + ' y foco ' + Math.round(e.foco) +
      ', el equipo rinde al ~' + Math.round((0.75 + e.moral / 100 * 0.35) * (0.85 + e.foco / 100 * 0.30) * 100) +
      '% de su base. Subir esos dos números es apalancamiento puro: multiplica todo lo demás que hagas.';
  },

  torres: function (e) {
    return 'Tu evidencia cae ' + (e.cadenciaDesc ? '1,5' : '3,5') + ' puntos por mes ' +
      (e.cadenciaDesc ? 'porque instalaste la cadencia semanal: el descubrimiento continuo frena la evaporación.' :
       'porque descubrís de a ráfagas. Torres diría: no es un proyecto, es un hábito — y el tuyo todavía no existe.');
  },

  inspired: function (e) {
    return 'Llevás ' + e.apuestasCompletadas + ' apuestas entregadas en ' + e.empresa + ' con evidencia ' + Math.round(e.evidencia) +
      '. Cagan preguntaría: ¿atacaste el riesgo de valor ANTES de construir, o estás validando factibilidad de cosas que nadie pidió?';
  },

  trap: function (e) {
    return e.fabrica ? e.empresa + ' está en modo fábrica: roadmap de fechas, éxito medido por entregas. Vas a shippear mucho y mover poco — el boletín final puntúa resultados.' :
      'Estás manejando por resultados, no por entregables. Sostenerlo cuesta político cada vez que ventas pide fechas; vale la pena.';
  },

  zero: function (e) {
    var a = Math.round(e.competidor.atencion * 100);
    return 'El competidor te presta ' + a + '% de atención. ' +
      (a < 30 ? 'Sos invisible: eso es tiempo regalado para profundizar tu diferencia antes de que te copien.' :
       'Ya te están mirando: la paridad de features desde acá es una carrera que gana el que va adelante. Tu única salida es ser distinto en algo que no quieran copiar.');
  },

  innov: function (e) {
    return e.precio > (e.precioInicio || e.precio) ?
      'Subiste el precio de $' + e.precioInicio + ' a $' + e.precio + ': el movimiento clásico hacia arriba. Christensen avisa: cada escalón que subís deja libre el de abajo — por ahí van a entrar.' :
      'Seguís en la gama de entrada ($' + e.precio + '). Aburrido y correcto: el disruptor crece por abajo mientras el líder mira a sus mejores clientes.';
  },

  hard: function (e) {
    var run = Motor.runwayMeses(e);
    return 'Hoy en ' + e.empresa + ': runway ' + (run > 90 ? 'infinito' : run.toFixed(1) + ' meses') + ', capital político ' + Math.round(e.politico) +
      '. Horowitz diría: no hay jugada perfecta desde acá — hay que elegir rápido entre malas y bancarla. Postergar también es elegir.';
  },

  accelerate: function (e) {
    return e.cd ? 'Con despliegue continuo activo: lotes chicos, menos riesgo de incidente y +12% de capacidad. La paradoja confirmada: vas más rápido Y más estable.' :
      'Seguís desplegando por evento. Los datos del libro: los equipos de élite despliegan más seguido Y fallan menos. Tu lote grande no te protege — es la causa del riesgo.';
  },

  pgdefault: function (e) {
    var run = Motor.runwayMeses(e);
    var crece = e.hist.length >= 2 && e.hist[e.hist.length - 1].mrr > e.hist[e.hist.length - 2].mrr * 1.03;
    if (e.mrr > Motor.burnMensual(e)) return e.empresa + ' es DEFAULT ALIVE: los ingresos ya pagan el burn. Desde acá nadie te puede matar.';
    return e.empresa + ' es DEFAULT DEAD hoy: burn $' + Math.round(Motor.burnMensual(e) / 1000) + 'k contra ingresos $' + Math.round(e.mrr / 1000) +
      'k, runway ' + (run > 90 ? '∞' : run.toFixed(1) + 'm') + (crece ? ', pero el ingreso viene creciendo: la pregunta es si llega antes que el cero.' : ' y el ingreso no está creciendo. Ese es EL problema, no el roadmap.');
  },

  seibel: function (e) {
    var f = Math.round(Motor.fitMax(e) * 100);
    return 'Tu mejor fit está en ' + f + '%. ' + (f >= 70 ? 'Se empieza a sentir: si la demanda no te tapa todavía, cerca estás.' :
      'Seibel sería brutal: no lo tenés, y hasta tenerlo, cualquier otra prioridad — crecer, escalar, contratar — es prematura.');
  },

  badblood: function (e) {
    return 'Tu Lupa está en ' + Math.round(e.lupa) + '. Theranos empezó con una mentira de este tamaño para cerrar una ronda: ' +
      'el interés compuesto de los atajos es la tesis del libro, y tu contador ya arrancó.';
  },

  wasserman: function (e) {
    return e.esFundador ? 'Tenés el ' + Math.round(e.capTable.fund * 100) + '% de ' + e.empresa +
      ': cada decisión de acá en más te va a pedir elegir entre control y valor. Rey o rico — las dos casi nunca.' :
      'Como empleado tu dilema es espejo: mando hoy contra equity que vista mañana. Elegilo consciente en la próxima oferta.';
  },

  pricing: function (e) {
    return 'Tu precio hoy: $' + e.precio + '/mes' + (e.precio !== e.precioInicio ? ' (arrancaste en $' + e.precioInicio + ')' : '') +
      '. La pregunta del libro: ¿lo decidió una investigación de disposición a pagar, o quedó del pitch original? El precio es diseño de producto.';
  }
};

function aplicarLibro(id, e) {
  if (!e || !APLICAR[id]) return null;
  var t = null;
  try { t = APLICAR[id](e); } catch (err) { t = null; }
  return t;
}
