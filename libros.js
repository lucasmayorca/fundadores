/* Biblioteca: los libros que el juego usa como modelo mental.
   Cada ficha explica el concepto desde el asiento en el que estás sentado —
   el de quien decide qué se construye este mes — y dice con qué variable del
   motor se paga el concepto. Sin build ni dependencias.

   Tres campos por ficha:
     idea   la tesis del libro, contada como oficio de producto y no como
            resumen: qué afirma, por qué es contraintuitivo, y qué hace
            distinto el lunes alguien que la entendió.
     juego  qué variable del motor ES ese concepto. No el gatillo que abrió
            la tarjeta: la mecánica.
     APLICAR (abajo) la lectura contra TUS números de hoy y la jugada que se
            desprende. Es lo único que cambia entre dos partidas. */

var LIBROS = [

/* ---------------- STARTUP ---------------- */
{ id:'lean', pilar:'startup',
  titulo:'The Lean Startup', autor:'Eric Ries',
  concepto:'Aprendizaje validado',
  idea:'Una startup no es una empresa chica: es un experimento montado para averiguar si un '+
       'negocio puede existir. Lo que produces no son features, es conocimiento, y eso cambia la '+
       'unidad de trabajo: no es el ticket, es la pregunta que el ticket contesta. El ciclo '+
       'construir-medir-aprender solo cuenta cuando cierras el circuito completo — casi todos los '+
       'equipos cierran el primer tramo, construyen, lanzan, y nunca vuelven a mirar. La disciplina '+
       'concreta es escribir, antes del spec, qué tendrías que ver para saber que estabas '+
       'equivocado; si ninguna medición te haría cambiar de opinión, no estás construyendo un '+
       'producto, estás decorando una opinión. Y cuando la evidencia dice que la hipótesis estaba '+
       'mal, la respuesta honesta es pivotar en vez de remar más fuerte: lo hundido ya está '+
       'hundido, lo que estás decidiendo es el mes que viene, no el que pasó.',
  juego:'Tu evidencia es una variable de 0 a 100 y es literalmente el ancho de la venda: con '+
        'evidencia baja, el impacto que el backlog te promete se desvía mucho del que la apuesta '+
        'rinde al entregarse. Cada punto en descubrir la sube; el mes que no la alimentas, decae '+
        'sola. No se puede comprar certeza — solo bajar el ruido antes de gastar el mes.' },

{ id:'zero', pilar:'startup',
  titulo:'Zero to One', autor:'Peter Thiel',
  concepto:'Diferénciate, no compitas',
  idea:'Copiar lo que ya existe te arrastra a una guerra de márgenes que no vas a ganar, porque el '+
       'que va adelante tiene más usuarios, más plata y más años de ventaja sobre el mismo tablero. '+
       'El valor se captura siendo defendiblemente distinto en un nicho chico que puedas dominar, '+
       'no siendo 5% mejor que el líder en su propia cancha. Para quien prioriza, la traducción es '+
       'incómoda: casi todo pedido de paridad — "nos falta lo que ellos tienen" — es una apuesta '+
       'con techo conocido y sin retorno defendible, y aun así es la más fácil de justificar en una '+
       'reunión. La pregunta que ordena el backlog no es qué nos falta, sino qué podemos hacer que '+
       'ellos no puedan copiar sin dejar de ser lo que son. Si la respuesta es "nada", el problema '+
       'no es el roadmap: es el posicionamiento.',
  juego:'Construir paridad sube tu cobertura en necesidades que el competidor ya cubre: mueve poco '+
        'tu fit y le sube la atención, o sea que pagas el costo y encima lo despiertas. Cubrir '+
        'necesidades que él ignora mueve el fit de los segmentos que él no atiende, y ese '+
        'crecimiento no se le puede copiar en un trimestre.' },

{ id:'chasm', pilar:'startup',
  titulo:'Crossing the Chasm', autor:'Geoffrey Moore',
  concepto:'El abismo y el producto completo',
  idea:'Los visionarios te compran por una promesa; los pragmáticos compran algo que ya funciona '+
       'para alguien parecido a ellos. Entre esos dos grupos hay un abismo, y no se cruza con más '+
       'marketing: se cruza eligiendo un nicho angosto y entregándole todo lo que necesita para '+
       'sentir riesgo cero — integraciones, soporte, referencias, seguridad, el aburrido producto '+
       'completo. Lo que hace difícil el cruce es que la lista de requisitos no la escribes tú: la '+
       'escribe el comprador pragmático, y es larga, poco emocionante y no negociable. El error '+
       'clásico de producto es leer el amor de los early adopters como señal de que el mercado '+
       'grande está a un lanzamiento de distancia, y meter el presupuesto de crecimiento en un '+
       'embudo que todavía tiene la compuerta cerrada. Primero se completan los requisitos; después '+
       'se abre la canilla.',
  juego:'El segmento de mayoría temprana está detrás de una compuerta con requisitos explícitos, '+
        'que tu sector nombra a su manera. Mientras no los cumplas, ese segmento convierte a una '+
        'fracción de lo normal: cada punto que pongas en crecer hacia ellos se fuga en esa '+
        'proporción, sin importar cuánto te amen los innovadores.' },

{ id:'innov', pilar:'startup',
  titulo:'The Innovator\'s Dilemma', autor:'Clayton Christensen',
  concepto:'Disrupción desde abajo',
  idea:'Las empresas grandes no pierden por tontas: pierden por hacer bien todo lo que les '+
       'enseñaron. Escuchan a sus mejores clientes, que siempre piden más de lo mismo y más caro, y '+
       'ese pedido es rentable, medible y fácil de defender ante un directorio. Cada escalón que '+
       'suben para atenderlo deja la gama baja abierta de par en par — justo donde un producto peor '+
       'pero más simple y más barato puede crecer sin que nadie reaccione, porque reaccionar '+
       'significaría bajar el margen promedio a propósito. Para el que prioriza, la lección tiene '+
       'dos filos: si eres el chico, tu ventaja es servir bien a los clientes que al grande no le '+
       'conviene atender; y si estás subiendo de mercado, cada escalón que ganas es un escalón que '+
       'dejas vacío detrás de ti. La disrupción casi nunca se ve venir en las métricas, porque al '+
       'principio se ve exactamente igual que clientes que no valían la pena.',
  juego:'El competidor tiene una variable de atención. Apuntar a su segmento premium se la sube y '+
        'te aplasta con su fuerza; crecer desde abajo, en el segmento que él descuida, la mantiene '+
        'baja y te compra meses de invisibilidad. El precio es la palanca que decide en qué escalón '+
        'estás parado.' },

{ id:'hard', pilar:'startup',
  titulo:'The Hard Thing About Hard Things', autor:'Ben Horowitz',
  concepto:'Decisiones sin opción buena',
  idea:'Los problemas de verdad difíciles no tienen una respuesta correcta esperando a ser '+
       'encontrada: tienen dos caminos malos, y el trabajo es elegir uno rápido y hacerse cargo del '+
       'que elegiste. Los manuales sirven en tiempos de paz — cuando la pregunta es cómo optimizar '+
       'una operación que ya funciona — y no sirven en guerra, cuando la pregunta es si la empresa '+
       'existe en seis meses. Lo que más cuesta de ese asiento no es decidir: es que nadie te va a '+
       'decir que estuvo bien, y que la mitad de las decisiones correctas se sienten idénticas a '+
       'las cobardes. Las dos reglas que quedan cuando se cae todo lo demás: cuida a tu gente y '+
       'cuenta la verdad temprano, sobre todo la mala, porque el equipo ya la sospecha y lo único '+
       'que estás protegiendo con el silencio es tu propia incomodidad. Estancarse, esperando que '+
       'aparezca la opción buena, también es una decisión — y suele ser la peor.',
  juego:'Varios dilemas del juego no tienen opción óptima: las dos ramas cobran algo, y el motor '+
        'las resuelve igual si no eliges. No decidir consume el mes con el estado que ya tenías, '+
        'que casi siempre es el que te trajo el problema.' },

{ id:'deals', pilar:'startup',
  titulo:'Venture Deals', autor:'Brad Feld and Jason Mendelson',
  concepto:'Los términos importan más que la valuación',
  idea:'El titular de una ronda es la valuación, pero lo que decide cuánto te llevas a casa vive en '+
       'la letra chica: la preferencia de liquidación, si es participativa, y de qué lado de la '+
       'ronda sale el pool de opciones. Una valuación alta con términos brutales puede dejarte '+
       'menos que una baja y limpia, y la diferencia solo se hace visible el día del exit, cuando '+
       'ya no se negocia nada. La razón de que esto le importe a alguien de producto y no solo al '+
       'CFO es que los términos definen el juego que vas a estar jugando después: una preferencia '+
       'grande convierte cualquier venta razonable en cero para el equipo, y eso cambia qué '+
       'apuestas tiene sentido hacer y a quién puedes contratar con equity. La regla práctica: '+
       'negocia la estructura, no el número del titular, y desconfía de tu propio entusiasmo cuando '+
       'la valuación sube y nadie quiere hablar de las cláusulas.',
  juego:'Los term sheets son reales y quedan guardados en el puesto. Al cerrar la carrera ves la '+
        'cascada del exit repartida en orden, y ahí se lee cuánto costó de verdad cada cláusula que '+
        'firmaste sin leer.' },

{ id:'grove', pilar:'startup',
  titulo:'High Output Management', autor:'Andy Grove',
  concepto:'Apalancamiento gerencial',
  idea:'El output de un gerente no es su propio trabajo: es el output de toda la organización que '+
       'toca, más el de las organizaciones vecinas que influye. Eso reordena la agenda por completo, '+
       'porque deja de importar cuánto hiciste y empieza a importar cuánto multiplicaste: una '+
       'decisión que desbloquea a diez personas vale más que una semana de trabajo tuyo, y una '+
       'reunión mal preparada resta el tiempo de todos los que asistieron. Grove agrega la segunda '+
       'mitad, que es la que se olvida: mide indicadores tempranos, los que se mueven antes que el '+
       'resultado, porque enterarse por el número final es enterarse cuando ya no se puede hacer '+
       'nada. Para quien prioriza, el apalancamiento tiene una forma muy concreta: claridad de '+
       'objetivo, foco, y estructura de equipos: las tres cosas que hacen que la misma gente '+
       'produzca el doble sin trabajar una hora más.',
  juego:'La moral, el foco y la estructura de equipos son multiplicadores de tu capacidad mensual, '+
        'no sumandos. Con los tres abajo, sumar gente produce menos puntos de los que cuesta la '+
        'nómina — y ese es el resultado por defecto de crecer sin mirarlos.' },

/* ---------------- PRODUCTO ---------------- */
{ id:'inspired', pilar:'producto',
  titulo:'Inspired', autor:'Marty Cagan',
  concepto:'Los cuatro riesgos',
  idea:'Antes de construir hay cuatro riesgos separados y hay que atacarlos en este orden: si '+
       'alguien lo va a querer (valor), si van a poder usarlo (usabilidad), si podemos construirlo '+
       '(viabilidad técnica) y si tiene sentido para el negocio. Están en ese orden porque los dos '+
       'primeros son los que matan productos y los dos últimos los que matan proyectos, y un '+
       'proyecto muerto cuesta un trimestre mientras un producto muerto cuesta la empresa. El '+
       'diagnóstico de Cagan es que los equipos que reciben una lista de features cerrada nunca '+
       'llegan a tocar el riesgo de valor: cuando el qué ya viene decidido, lo único que queda es '+
       'estimar, y estimar bien una cosa que nadie quería es la forma más prolija de perder un año. '+
       'La versión operativa: el equipo tiene que recibir problemas y contexto, no soluciones, y el '+
       'riesgo de valor se desactiva antes del spec — con evidencia, no con confianza.',
  juego:'Cada apuesta del backlog cubre una necesidad concreta del mapa, y el motor calcula su '+
        'impacto real contra el fit de los segmentos, no contra tu entusiasmo. Construir sin haber '+
        'desactivado el riesgo de valor es gastar puntos contra una estimación que el motor sabe '+
        'que está mal y tú no.' },

{ id:'torres', pilar:'producto',
  titulo:'Continuous Discovery Habits', autor:'Teresa Torres',
  concepto:'Cadencia de discovery',
  idea:'El discovery no es una fase que se hace al principio y se cierra: es un hábito semanal del '+
       'mismo equipo que construye, con contacto real con usuarios todas las semanas y no cuando '+
       'hay presupuesto de research. Torres ordena el desorden con dos ideas: primero mapeas '+
       'oportunidades — problemas y necesidades que salieron de entrevistas, no de una lluvia de '+
       'ideas — y solo entonces piensas soluciones, siempre varias en paralelo para poder '+
       'compararlas contra el mismo problema. La razón por la que hay que pensar tres y no una es '+
       'que con una sola solución sobre la mesa la conversación deja de ser "¿esto resuelve el '+
       'problema?" y pasa a ser "¿cómo hacemos que esto funcione?", que es una pregunta distinta y '+
       'peor. Y la razón por la que tiene que ser semanal es que el conocimiento se vence: el '+
       'mercado se mueve, los usuarios cambian, y la entrevista de hace cuatro meses ya describe '+
       'una empresa que no existe.',
  juego:'La evidencia decae sola todos los meses. Descubrir a ráfagas te deja un pico y después una '+
        'caída: el motor premia el punto sostenido en descubrir mes a mes, porque la tasa de '+
        'decaimiento no le pregunta cuánto invertiste el trimestre pasado.' },

{ id:'momtest', pilar:'producto',
  titulo:'The Mom Test', autor:'Rob Fitzpatrick',
  concepto:'Pregunta por el pasado, no por el futuro',
  idea:'Pregúntale a la gente si le gusta tu idea y todos van a mentir, no por maldad sino por '+
       'cortesía: nadie quiere ser el que te dice que tu bebé es feo. Las respuestas útiles no salen '+
       'de opiniones ni de futuros hipotéticos, salen de hechos del pasado: qué hiciste la última '+
       'vez que tuviste este problema, cuánto te costó, qué probaste antes, cuánto pagaste. La '+
       'prueba que le da el nombre al libro es esa: la conversación tiene que estar armada de tal '+
       'forma que ni tu mamá pueda mentirte, porque no le estás preguntando por tu idea. Lo que '+
       'convierte esto en oficio y no en truco es la clasificación de las respuestas: los cumplidos '+
       'son ruido y hay que descartarlos aunque se sientan bien, y el único dato duro es un '+
       'compromiso concreto — tiempo, presupuesto, reputación, una reunión con su jefe. Y lo peor '+
       'de una mala entrevista no es que no informe: es que informa mal, con optimismo, y te deja '+
       'más confiado que antes.',
  juego:'Tu calidad de discovery define el sesgo de las estimaciones. Con entrevistas malas el '+
        'motor no te deja sin números: te da números inflados en la dirección que te gusta, y '+
        'construir contra ellos se siente como tener razón hasta el mes en que la apuesta se '+
        'entrega.' },

{ id:'trap', pilar:'producto',
  titulo:'Escaping the Build Trap', autor:'Melissa Perri',
  concepto:'Resultados, no entregables',
  idea:'La trampa de construir es medir el éxito por cuánto se lanzó en vez de por qué cambió en el '+
       'comportamiento del usuario o del negocio, y es una trampa porque el output es fácil de '+
       'contar, fácil de celebrar y sale en el reporte trimestral. Un roadmap repleto de features '+
       'con fechas es una lista de outputs disfrazada de estrategia: no dice qué problema resuelve '+
       'la empresa, dice qué va a estar ocupado haciendo el equipo. Perri señala que la trampa es '+
       'estructural y no de actitud: cuando el incentivo, el reporte y el bono miran entregas, todo '+
       'el mundo racionalmente entrega. Salir se hace cambiando la unidad de compromiso — el equipo '+
       'se compromete con mover una métrica, no con lanzar una lista — y aceptando que eso implica '+
       'contar meses en los que no se lanzó nada y sin embargo se aprendió lo que hacía falta.',
  juego:'Lanzar mucho no mueve la aguja si las apuestas no tocan necesidades con fit real: el motor '+
        'cuenta el impacto en las métricas, no las entregas. Tu boleta al cerrar el puesto califica '+
        'el mandato cumplido, no la cantidad de cosas que salieron.' },

{ id:'hooked', pilar:'producto',
  titulo:'Hooked', autor:'Nir Eyal',
  concepto:'El circuito del hábito',
  idea:'Los productos que se usan solos cierran un circuito de cuatro pasos: un gatillo lleva a una '+
       'acción simple, la acción paga una recompensa algo variable, y el usuario deja algo suyo '+
       'adentro — datos, contenido, configuración, reputación — que hace que la próxima vuelta valga '+
       'más que la anterior. Ese depósito es la pieza que casi todos se saltan, y es la única que '+
       'convierte uso en hábito: sin inversión del usuario tienes entretenimiento, que se abandona '+
       'el día que aparece algo más nuevo. La variabilidad de la recompensa importa porque lo '+
       'perfectamente predecible deja de registrarse, pero es también la parte peligrosa: el mismo '+
       'mecanismo que sostiene un producto útil sostiene uno que la gente usa y no quiere usar. La '+
       'prueba que Eyal propone para quedarse del lado correcto es simple y molesta: ¿usarías tu '+
       'propio producto, y se lo recomendarías a alguien que te importa?',
  juego:'La retención alimenta el boca a boca y el boca a boca alimenta la adquisición: es el único '+
        'circuito compuesto del motor. Forzar el gancho sin valor real infla el uso unos meses y '+
        'después te cobra en marca y en churn, que es el interés de esa deuda.' },

{ id:'krug', pilar:'producto',
  titulo:'Don\'t Make Me Think', autor:'Steve Krug',
  concepto:'Fricción y activación',
  idea:'Nadie lee tu interfaz: la escanea, adivina y sigue, y si adivinó mal se va sin avisarte. '+
       'Cada momento en que alguien tiene que detenerse a pensar qué hacer es una fuga, y esas '+
       'fugas no se ven una por una — se acumulan en silencio a lo largo del camino hasta el valor. '+
       'Lo que hace de esto la palanca más barata que existe es la aritmética: la usabilidad '+
       'multiplica la conversión de TODO el tráfico que ya estás pagando, así que arreglar un paso '+
       'del onboarding rinde sobre cada usuario que llegue en los próximos dos años, mientras una '+
       'campaña rinde una vez. Y lo que la hace la más postergada es que no tiene dueño: nadie '+
       'pide en una reunión de directorio que se arregle el tercer paso del registro, porque no se '+
       've como un logro. La disciplina de Krug es probar con cinco personas, mirar en silencio y '+
       'arreglar lo que las cinco hicieron mal.',
  juego:'La usabilidad multiplica la activación de todo el tráfico que traigas: con usabilidad baja, '+
        'cada punto en crecer entra a una cañería agujereada. Es la única palanca del juego que '+
        'mejora el rendimiento de otra palanca en vez de sumar por su cuenta.' },

{ id:'analytics', pilar:'producto',
  titulo:'Lean Analytics', autor:'Alistair Croll and Benjamin Yoskovitz',
  concepto:'Métricas de vanidad vs. accionables',
  idea:'Los totales acumulados solo saben subir, y por eso no te dicen nada: usuarios registrados, '+
       'descargas totales, visitas del mes son números que suben incluso mientras la empresa se '+
       'muere. Las métricas que sirven son tasas y cohortes — qué porcentaje de los que entraron en '+
       'marzo sigue acá en junio — comparadas contra una línea que dibujaste antes de mirar, porque '+
       'un número sin umbral previo no es una medición, es una anécdota con decimales. La segunda '+
       'idea del libro es más incómoda: quieres exactamente UNA métrica que importe por etapa, y '+
       'todo lo demás como diagnóstico. Un tablero con cuarenta indicadores no informa mejor: '+
       'informa igual y permite elegir, después del hecho, el gráfico que confirma la decisión que '+
       'ya tomaste. Elegir esa única métrica es un acto de estrategia, y renunciar a las otras '+
       'treinta y nueve es la parte difícil.',
  juego:'El tablero te muestra los usuarios totales bien grandes porque así se ven los tableros '+
        'reales. La retención por segmento y el fit salen más chicos y en otra pantalla — y son los '+
        'que deciden si el mes que viene existe.' },

/* ---------------- TECNOLOGÍA ---------------- */
{ id:'accelerate', pilar:'tech',
  titulo:'Accelerate', autor:'Nicole Forsgren, Jez Humble and Gene Kim',
  concepto:'Velocidad y estabilidad no son un trade-off',
  idea:'La intuición dice que ir más rápido rompe más cosas, y cuatro años de datos sobre miles de '+
       'equipos dicen exactamente lo contrario: los que despliegan seguido y en lotes chicos '+
       'también fallan menos y se recuperan más rápido. No es que sean mejores en las dos '+
       'dimensiones por casualidad — es que son la misma dimensión. Un lote chico tiene poco '+
       'adentro, así que cuando falla el diagnóstico es corto y la vuelta atrás es barata; un '+
       'release grande y espaciado acumula cientos de cambios y convierte cada incidente en una '+
       'investigación. Eso da vuelta la política interna del asunto: los releases grandes no son la '+
       'protección contra el riesgo, son su causa, y la gente que pide "menos deploys para estar '+
       'más seguros" está pidiendo con las mejores intenciones exactamente lo que va a romperlos '+
       'más. Para quien prioriza, invertir en el camino a producción no es un impuesto técnico: es '+
       'la única inversión que paga en velocidad y en estabilidad al mismo tiempo.',
  juego:'Invertir en plataforma baja la probabilidad de incidentes Y sube tu capacidad mensual: es '+
        'la palanca compuesta del motor. El despliegue continuo, una vez encendido, mantiene ese '+
        'bono todos los meses sin volver a pagarlo.' },

{ id:'brooks', pilar:'tech',
  titulo:'The Mythical Man-Month', autor:'Fred Brooks',
  concepto:'La ley de Brooks y la ley de Conway',
  idea:'Sumar gente a un proyecto atrasado lo atrasa más, y la razón no es moral sino aritmética: '+
       'los nuevos todavía no producen, queman el tiempo de los que sí para aprender, y los canales '+
       'de comunicación crecen con el cuadrado del equipo mientras el output crece, en el mejor '+
       'caso, lineal. Un mes-hombre no es una unidad intercambiable: nueve mujeres no hacen un bebé '+
       'en un mes, y ningún proyecto con dependencias entre sus partes se acelera repartiéndolo en '+
       'más manos. La segunda ley del libro es la que más se usa y menos se cita bien: el sistema '+
       'que sale del otro lado copia la forma de la organización que lo construyó, así que si el '+
       'diagrama de tu producto no se parece al que querías, mirá el organigrama antes que la '+
       'arquitectura. Para quien prioriza, las dos leyes juntas dicen algo simple: la respuesta a un '+
       'trimestre atrasado no es contratar, es recortar alcance.',
  juego:'Cada contratación tarda dos meses en producir y mientras tanto le cobra puntos de mentoría '+
        'a los que ya estaban. Contratar cinco de golpe hace que tu capacidad efectiva baje antes '+
        'de subir: el trimestre desaparece y el equipo es más grande.' },

{ id:'sre', pilar:'tech',
  titulo:'Site Reliability Engineering', autor:'Google (Beyer, Jones, Petoff, Murphy)',
  concepto:'Presupuesto de error',
  idea:'El 100% de disponibilidad es la meta equivocada: cuesta una fortuna, es técnicamente '+
       'imposible y además nadie lo nota, porque entre tu producto y el usuario hay un wifi que '+
       'falla más que tú. La jugada de Google es acordar una meta realista y convertir la brecha '+
       'hasta el 100% en un presupuesto de error: si prometiste 99,9%, tienes un rato de caída al '+
       'mes que puedes gastar a propósito, en lanzar rápido, en experimentar, en tomar riesgo. Lo '+
       'elegante del mecanismo es que resuelve la pelea política más vieja de cualquier empresa de '+
       'software sin que nadie tenga que discutir: si sobra presupuesto, producto manda y se acelera; '+
       'si se acabó, confiabilidad manda y se congela. La prioridad no la decide quien grita más '+
       'fuerte en la reunión, la decide un número que las dos partes acordaron cuando estaban '+
       'tranquilas.',
  juego:'Tienes un presupuesto de error por trimestre que los incidentes consumen. Cuando se acaba '+
        'entras en congelamiento: casi nada se construye ese mes, y las prioridades se invierten '+
        'solas sin que puedas negociarlo.' },

{ id:'topologies', pilar:'tech',
  titulo:'Team Topologies', autor:'Matthew Skelton and Manuel Pais',
  concepto:'La carga cognitiva como límite',
  idea:'Un equipo tiene un techo de cuánto sistema puede sostener en la cabeza, y una vez que lo '+
       'revientas el esfuerzo no lo arregla: más horas sobre un sistema que nadie entiende '+
       'completo producen más bugs, no más features. El arreglo no es motivacional ni de proceso, '+
       'es de fronteras: cortar el trabajo por líneas que un equipo pueda ser dueño de punta a '+
       'punta, con su propio despliegue y su propia responsabilidad, en vez de repartirlo por capas '+
       'técnicas que obligan a coordinar cada cambio con otros tres equipos. La segunda mitad del '+
       'libro es la que se ignora: las interacciones entre equipos también hay que diseñarlas — '+
       'quién le da un servicio a quién, quién colabora temporalmente con quién — porque cuando no '+
       'están definidas se improvisan en el chat, y esa improvisación es el trabajo real que se '+
       'come tus trimestres sin aparecer en ningún roadmap.',
  juego:'Pasado cierto tamaño, cada persona nueva rinde menos que la anterior. Reorganizarte en '+
        'equipos con fronteras claras sube ese umbral y devuelve el rendimiento marginal — es un '+
        'evento del juego, no un ajuste que puedas hacer todos los meses.' },

{ id:'ddia', pilar:'tech',
  titulo:'Designing Data-Intensive Applications', autor:'Martin Kleppmann',
  concepto:'La escala rompe supuestos',
  idea:'Una arquitectura no se degrada con gracia: aguanta, y aguanta, y en algún punto de carga '+
       'colapsa de golpe, porque un supuesto que nunca escribiste dejó de ser cierto — la tabla '+
       'entraba en memoria, la cola nunca tenía más de mil elementos, el trabajo nocturno terminaba '+
       'antes del amanecer. Ninguno de esos supuestos estaba mal cuando se tomó: estaban bien para '+
       'la escala de ese momento, y eso es precisamente lo que los hace invisibles. La consecuencia '+
       'operativa es que el crecimiento no es un problema gradual sino una serie de acantilados, y '+
       'que los acantilados llegan todos juntos cuando llega el éxito, que es el peor momento para '+
       'descubrirlos. Vale mucho más diseñar sabiendo dónde está el próximo punto de quiebre — y '+
       'medirlo — que enterarse un martes a medianoche con la mitad de los usuarios afuera y el '+
       'canal de soporte en llamas.',
  juego:'Si los usuarios crecen más rápido que tu arquitectura, la probabilidad de incidentes se '+
        'dispara de forma no lineal: la carga contra la capacidad del sistema es una razón, no una '+
        'resta. El éxito es lo que te tumba, y el momento barato para invertir en escala es siempre '+
        'antes de necesitarla.' },

{ id:'fowler', pilar:'tech',
  titulo:'Refactoring', autor:'Martin Fowler',
  concepto:'Deuda técnica e interés compuesto',
  idea:'Tomar un atajo es pedir tiempo prestado, y como todo préstamo paga intereses: cada cambio '+
       'futuro sobre ese código cuesta un poco más que el anterior. El interés es lo que hace que la '+
       'metáfora funcione — no es un costo fijo que puedas ignorar, es un porcentaje que le cobra a '+
       'todo el trabajo que venga después, para siempre, hasta que se pague. Fowler es explícito en '+
       'cómo se paga: en cuotas chicas y continuas, mientras trabajas en el código por otra razón, '+
       'nunca como un proyecto de tres meses llamado "refactor". Y es igual de explícito sobre la '+
       'reescritura desde cero: es casi siempre la forma más cara de pagar la misma deuda, porque '+
       'durante todo el proyecto la empresa no avanza y al final tienes el mismo producto con bugs '+
       'nuevos. Para quien prioriza, la deuda es la única variable que empeora sola si la ignoras, '+
       'y la única que se paga más barato ahora que el mes que viene.',
  juego:'La deuda le cobra un porcentaje a TODA tu capacidad mensual, todos los meses, para '+
        'siempre. No aparece como una línea en tu plan: aparece como menos puntos disponibles, y es '+
        'la variable que la mayoría de las partidas deja crecer sin mirarla hasta que se come el '+
        'mandato.' }
,

/* ================= YC Y ENSAYOS ================= */
{ id:'pgdefault', pilar:'yc', titulo:'Default Alive or Default Dead?', autor:'Paul Graham',
  concepto:'Vivo o muerto por defecto',
  idea:'La pregunta que casi nadie hace a tiempo: si nada cambia — este ritmo de crecimiento, este '+
       'burn, sin ronda nueva — ¿llegas a cubrir tus costos antes de que se acabe la caja? Es una '+
       'sola cuenta y parte la realidad en dos mundos con estrategias opuestas. Si estás vivo por '+
       'defecto, puedes invertir en cosas que rinden en un año, contratar con calma y negociar sin '+
       'apuro, porque el tiempo trabaja para ti. Si estás muerto por defecto, cada decisión debería '+
       'ser otra: recortar lo que no mueve ingresos este trimestre, subir precios antes que buscar '+
       'volumen, y dejar de tratar la ronda como un plan. Lo que Graham señala es que la mayoría no '+
       'sabe en qué mundo está, y esa ignorancia no es neutral: por defecto uno se comporta como si '+
       'estuviera vivo, porque es más cómodo, y descubre lo contrario cuando ya no hay margen para '+
       'reaccionar. Hacé la cuenta hoy, y volvé a hacerla cada mes.',
  juego:'Tu runway es caja dividida por burn, y el burn sube solo con cada contratación e '+
        'incidente. Debajo de cierto umbral el juego cambia de física: los eventos se vuelven más '+
        'duros, el capital político se vuelve caro y las opciones que te ofrecen empeoran.',
  cuando:function(e,c){ return Motor.runwayMeses(e) < 7; } },

{ id:'pgscale', pilar:'yc', titulo:'Do Things That Don\'t Scale', autor:'Paul Graham',
  concepto:'Haz cosas que no escalan',
  idea:'Al principio hay que reclutar usuarios a mano, uno por uno, y darles un servicio '+
       'absurdamente bueno: escribirles, instalarles el producto, resolverles el problema por '+
       'teléfono. La objeción obvia es que eso no escala, y es cierta y no importa, porque el '+
       'objetivo de esa etapa no es escalar sino aprender: cada conversación manual te dice qué '+
       'construir con una precisión que ninguna encuesta iguala. Hay una segunda razón, menos '+
       'citada: un grupo chico de usuarios fanáticos vale más que un grupo grande de usuarios '+
       'tibios, porque los fanáticos hablan, perdonan errores y te dan un caso de referencia. '+
       'Escalar es un problema que ojalá tengas después; hoy tu problema es que a alguien le importe '+
       'de verdad, y eso no se resuelve con automatización.',
  juego:'En etapa semilla, cada punto en descubrir rinde mucho más en evidencia y en fit que el '+
        'mismo punto en crecer, porque el embudo todavía no tiene nada que amplificar. La palanca '+
        'de crecimiento existe y se puede tocar: simplemente devuelve menos que la de al lado.',
  cuando:function(e,c){ return e.etapa === 'semilla' && e.mesPuesto <= 3; } },

{ id:'pgmakers', pilar:'yc', titulo:'Maker\'s Schedule, Manager\'s Schedule', autor:'Paul Graham',
  concepto:'Dos agendas incompatibles',
  idea:'El que construye necesita bloques largos — medio día, mínimo — porque el trabajo difícil '+
       'tarda en arrancar y se pierde entero al interrumpirse. El que gestiona vive en casillas de '+
       'una hora y le parece razonable poner una reunión a las tres de la tarde, porque en su agenda '+
       'eso cuesta exactamente una hora. En la agenda del maker cuesta la tarde completa: no puede '+
       'empezar algo grande a la una sabiendo que a las tres se corta, así que hace tareas chicas y '+
       'la tarde se evapora. Nadie está actuando de mala fe, y ahí está el problema: es un choque de '+
       'unidades de medida, invisible desde los dos lados. Quien ocupa el asiento del medio — el que '+
       'gestiona pero le entrega trabajo a los que construyen — es el único que puede arreglarlo, y '+
       'se arregla agrupando las reuniones en los bordes del día y defendiendo el bloque de nadie.',
  juego:'El foco es un multiplicador directo de tu capacidad mensual: con foco bajo, los mismos '+
        'puntos de gente producen menos entregas. Es la variable que más rápido se destruye — cada '+
        'apuesta extra en vuelo y cada frente abierto le pega — y la más lenta de recuperar.',
  cuando:function(e,c){ return e.foco < 40; } },

{ id:'pgramen', pilar:'yc', titulo:'Ramen Profitability', autor:'Paul Graham',
  concepto:'Rentabilidad ramen',
  idea:'El punto donde los ingresos cubren los gastos de vida de los fundadores. No es éxito y '+
       'Graham es explícito: es libertad. Desde ahí nadie puede matarte — ni un mercado de capitales '+
       'cerrado, ni un inversionista impaciente, ni un trimestre malo — y eso cambia el tono de '+
       'todas las conversaciones que tengas después, porque negociar sin fecha de vencimiento es '+
       'otro deporte. Lo interesante es que casi siempre está más cerca de lo que parece: no exige '+
       'un negocio grande, exige un negocio chico con costos honestos, y muchas empresas que se '+
       'sienten al borde del abismo están a un aumento de precios y dos recortes de distancia. La '+
       'trampa es que la rentabilidad ramen no se ve bien en un pitch, así que se posterga a favor '+
       'de un crecimiento que necesita permiso de otros.',
  juego:'Cuando el MRR pasa el burn, el reloj de la muerte se detiene: el runway deja de ser una '+
        'cuenta regresiva y las opciones que el juego te ofrece cambian, porque ya no negocias '+
        'contra una fecha.',
  cuando:function(e,c){ return e.etapa === 'semilla' && e.mrr > Motor.burnMensual(e); } },

{ id:'pgdie', pilar:'yc', titulo:'How Not to Die', autor:'Paul Graham',
  concepto:'No morir es una habilidad',
  idea:'A las startups casi nunca las asesinan: se suicidan. Los fundadores se cansan, se pelean, '+
       'se desmoralizan por un mes malo y aceptan un empleo que les ofrecieron con cariño. Graham '+
       'dice que la startup que simplemente se niega a morir tiene, con el tiempo, una probabilidad '+
       'sorprendentemente alta de terminar bien, porque casi todos los competidores se van a rendir '+
       'antes. La condición no es aguantar quieto: es que algo mejore cada semana, aunque sea poco, '+
       'porque lo que mata no es ir despacio sino dejar de moverse. Sobrevivir feo — con el producto '+
       'a medias, el equipo chico y la caja al límite — cuenta como sobrevivir, y desde ahí todavía '+
       'se puede ganar. Lo que no se puede es volver.',
  juego:'Sobrevivir con caja al límite no te castiga de golpe: te castiga cobrándote capital '+
        'político y moral todos los meses. Mientras el mandato avance, el motor te deja seguir — el '+
        'puesto se cierra por caja en cero, no por incomodidad.',
  cuando:function(e,c){ return e.caja < Motor.burnMensual(e) * 2 && e.mesPuesto > 3; } },

{ id:'yclaunch', pilar:'yc', titulo:'Launch Now', autor:'Y Combinator',
  concepto:'Lanza ya',
  idea:'Si tu primera versión no te da un poco de vergüenza, lanzaste tarde. El argumento no es que '+
       'la calidad no importe, es que antes de tener usuarios reales no sabés qué parte de la '+
       'calidad importa: estás puliendo por intuición, y la intuición sin datos pule lo que te '+
       'resulta más entretenido pulir. Lanzar no es el final del desarrollo, es el inicio del '+
       'aprendizaje — el momento en que las hipótesis pasan a tener un número al lado. El costo '+
       'real de esperar tres meses más no es el retraso: es que esos tres meses de trabajo se '+
       'hicieron a ciegas, y una parte de ellos va a haber que tirarla. Para quien prioriza, la '+
       'consecuencia práctica es preferir el corte más chico que un usuario pueda usar de punta a '+
       'punta, y resistir el pedido — siempre razonable, siempre sincero — de agregarle una cosa '+
       'más antes de mostrarlo.',
  juego:'Hasta que una apuesta se entrega, el impacto que ves es una estimación con ruido; recién '+
        'al entregarse el motor calcula el impacto real y te muestra la diferencia. Ese delta es '+
        'todo el aprendizaje disponible en el juego: sin entregas, no hay ninguno.',
  cuando:function(e,c){ return e.apuestasCompletadas >= 1; } },

{ id:'yctalk', pilar:'yc', titulo:'Write Code and Talk to Users', autor:'Y Combinator',
  concepto:'El mantra de YC',
  idea:'Escribe código y habla con usuarios: todo lo demás es opcional. Suena a simplificación y es '+
       'una herramienta de diagnóstico bastante filosa, porque casi cualquier semana improductiva '+
       'de una startup se explica mirando cuántas horas fueron a una de las dos cosas. La mitad de '+
       'los equipos hace solo lo primero y construye en el vacío, prolijamente, durante meses. La '+
       'otra mitad no hace más que reuniones, conferencias y café con inversionistas, y confunde '+
       'actividad con progreso. El circuito completo son las dos cosas en la misma semana, no en '+
       'trimestres alternados: hablar con usuarios sin construir es turismo, y construir sin hablar '+
       'con usuarios es artesanía.',
  juego:'El motor separa el gasto en descubrir del gasto en construir y los premia junto: la '+
        'evidencia alta hace que las estimaciones se acerquen a lo real, y sin construcción no hay '+
        'nada que estimar. Un mes con los dos rinde más que dos meses con uno solo.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.desc > 0 && e.gastoPropio.cons > 0; } },

{ id:'ycgrowth', pilar:'yc', titulo:'Startup = Growth', autor:'Paul Graham',
  concepto:'Startup significa crecimiento',
  idea:'Una startup no es una empresa nueva ni una empresa de tecnología: es una empresa diseñada '+
       'para crecer rápido, y ese compromiso — no el sector, no la edad — es lo que define todo lo '+
       'demás. Determina qué problemas valen la pena (los que tienen un mercado grande detrás), qué '+
       'mercados funcionan (los que puedes servir sin límites físicos), y cuánta prolijidad puedes '+
       'permitirte. También determina qué es un fracaso: una empresa rentable que crece 20% al año '+
       'es un buen negocio y una startup fallida, y confundir las dos cosas hace infeliz a todo el '+
       'mundo. Graham propone medir el crecimiento semanal como signo vital único durante la etapa '+
       'temprana, porque es el número que no se puede maquillar y el que fuerza las conversaciones '+
       'honestas.',
  juego:'El crecimiento se compone: los usuarios de este mes alimentan el boca a boca del que '+
        'viene, y el motor lo calcula sobre la base que ya tienes. Un mes de crecimiento fuerte no '+
        'se suma, se multiplica hacia adelante — y un mes plano cuesta todos los meses siguientes.',
  cuando:function(e,c){ var h = e.hist; if (h.length < 2) return false;
    var a = h[h.length-2].u, b = h[h.length-1].u; return a > 100 && b > a * 1.15; } },

{ id:'pgfund', pilar:'yc', titulo:'A Fundraising Survival Guide', autor:'Paul Graham',
  concepto:'Sobrevivir el levantamiento',
  idea:'Levantar plata es un segundo trabajo de tiempo completo que nadie pidió, y que se come '+
       'exactamente la atención que la empresa necesitaba para tener buenas noticias que contar. '+
       'Las reglas de Graham son de supervivencia, no de optimización: hacelo rápido, en paralelo — '+
       'nunca en serie, porque en serie cada "no" te deja peor posicionado para el siguiente — sin '+
       'enamorarte de ningún fondo, y volvé a construir el día que cierre. El peor estado posible no '+
       'es que te digan no: es el eterno "casi cerramos", que consume meses de atención sin producir '+
       'ni plata ni información. Y hay una asimetría que conviene tener presente: los inversionistas '+
       'están evaluando decenas de empresas y para ellos la conversación es barata; para ti es el '+
       'trimestre entero.',
  juego:'Levantar consume tus puntos del mes y capital político mientras la ronda está abierta: no '+
        'es gratis ni instantáneo. Lo que compra es capital de fondeo, que es lo único que hace '+
        'crecer las capacidades de la empresa — sin él, se erosionan solas.',
  cuando:function(e,c){ return e.rondas.length >= 1; } },

{ id:'pgmean', pilar:'yc', titulo:'Mean People Fail', autor:'Paul Graham',
  concepto:'A los malvados les va mal, tarde o temprano',
  idea:'En startups la maldad sale cara, y el argumento de Graham es económico antes que moral: '+
       'espanta a la gente buena, que tiene opciones y se va sin hacer ruido; cierra puertas que no '+
       'sabías que existían, porque el mundo de las startups corre sobre referencias informales; y '+
       'te deja rodeado solo de gente que negocia como tú, que es el peor equipo posible para un '+
       'momento difícil. Hay una razón estructural: construir algo nuevo requiere que mucha gente '+
       'te dé el beneficio de la duda gratis — empleados que aceptan menos sueldo, usuarios que '+
       'toleran un producto a medias, socios que firman sin garantías — y eso solo se consigue con '+
       'crédito social. Jugar limpio no es solo ética: es, egoístamente, la mejor estrategia '+
       'disponible en un juego de plazos largos y memoria larga.',
  juego:'La Lupa mide cuánta atención incómoda acumulaste, y no baja sola: sube con cada atajo y se '+
        'queda. Pasado cierto nivel abre eventos que no puedes esquivar y que terminan puestos — el '+
        'costo de los atajos se paga siempre, con retraso.',
  cuando:function(e,c){ return e.lupa >= 35; } },

{ id:'pgrr', pilar:'yc', titulo:'Relentlessly Resourceful', autor:'Paul Graham',
  concepto:'Implacablemente recursivo',
  idea:'Graham salió a buscar dos palabras que definieran a un buen fundador y aterrizó en estas: '+
       'implacable y recursivo. Lo que describe no es tenacidad — eso es apretar los dientes y '+
       'seguir haciendo lo mismo — sino una forma de tenacidad con creatividad adentro: negarse a '+
       'aceptar el mundo como viene, y al mismo tiempo cambiar de medio cada vez que el medio no '+
       'funciona. La distinción operativa importa mucho: adaptás los medios, nunca la meta. El que '+
       'adapta la meta se llama razonable y termina con una empresa distinta y peor; el que no '+
       'adapta los medios se llama persistente y termina golpeando la misma pared con más fuerza. '+
       'Lo opuesto de esto no es rendirse: es quedarse quieto con elegancia, ejecutando un plan que '+
       'ya se sabe que no va a funcionar porque era el plan aprobado.',
  juego:'En invierno de capital las rondas son caras o imposibles y las capacidades de la empresa '+
        'se erosionan sin fondeo. Las palancas internas — precio, retención, deuda, foco — siguen '+
        'todas disponibles, y son las únicas que el mundo no te puede cerrar.',
  cuando:function(e,c){ return e.eraId === 'invierno' && e.mesPuesto > 4; } },

{ id:'seibel', pilar:'yc', titulo:'The Real Product-Market Fit', autor:'Michael Seibel',
  concepto:'El PMF de verdad',
  idea:'El product-market fit no es sentirse bien con el producto ni tener una métrica linda: es '+
       'ahogarse en demanda que no puedes atender, con los servidores sufriendo, el soporte '+
       'desbordado y clientes insistiendo por canales que no habilitaste. Seibel es brutal con el '+
       'test: si tenés que preguntarte si lo tenés, no lo tenés. La consecuencia es dura para '+
       'cualquier plan trimestral, porque significa que mientras no lo tengas, casi todo lo demás '+
       'es prematuro: escalar el equipo, armar la máquina de ventas, pulir la marca, contratar '+
       'gerentes. Todas esas cosas son formas de sentirse productivo mientras se evita la única '+
       'pregunta abierta. El fit tampoco es global: es de un segmento concreto, y tenerlo con los '+
       'innovadores mientras el mercado grande te ignora es exactamente cómo se ve no tenerlo.',
  juego:'El fit se calcula por segmento contra la cobertura de las necesidades que ESE segmento '+
        'exige, y es el multiplicador de todo lo demás: con fit bajo, cada punto en crecer compra '+
        'usuarios que se van. Tu mejor fit es el número que decide si vale la pena acelerar.',
  cuando:function(e,c){ return Motor.fitMax(e) > 0.72; } },

/* ================= STARTUP (más) ================= */
{ id:'blank', pilar:'startup', titulo:'The Four Steps to the Epiphany', autor:'Steve Blank',
  concepto:'Desarrollo de clientes',
  idea:'El libro que arrancó todo el movimiento lean, con una tesis de una línea: los hechos no '+
       'viven en tu oficina, viven afuera del edificio. Blank observó que las empresas tenían un '+
       'proceso riguroso y por etapas para desarrollar el producto, y absolutamente nada equivalente '+
       'para desarrollar el cliente — se asumía que el cliente estaba ahí y que aparecería cuando el '+
       'producto estuviera listo. Su propuesta es un proceso paralelo con la misma disciplina: '+
       'descubrir el cliente, validarlo, y solo entonces crear la demanda y construir la empresa, '+
       'en ese orden y sin saltearse pasos. Lo importante es la puerta entre validación y escala: '+
       'contratar vendedores, gastar en marketing y armar estructura antes de haber validado que '+
       'alguien compra repetidamente es la forma más común y más cara de morir, porque escala un '+
       'error hasta hacerlo irreversible.',
  juego:'La evidencia alta hace que las estimaciones del backlog converjan a los impactos reales: '+
        'el motor deja de mentirte. Es la única variable del juego que mejora la calidad de tu '+
        'información en vez de tus números — y decae si dejás de alimentarla.',
  cuando:function(e,c){ return e.evidencia >= 70; } },

{ id:'whatyoudo', pilar:'startup', titulo:'What You Do Is Who You Are', autor:'Ben Horowitz',
  concepto:'Cultura = decisiones',
  idea:'La cultura no es lo que declaras en la pared ni lo que dice el onboarding: es lo que hace '+
       'tu gente cuando no estás mirando, y eso se define en las decisiones incómodas. A quién '+
       'asciendes cuando el que entrega es insoportable, qué perdonas cuando el número está en '+
       'riesgo, qué atajo aceptas la primera vez. Cada una de esas decisiones enseña más que '+
       'cualquier documento de valores, porque el equipo aprende de lo que ve premiado, no de lo '+
       'que ve escrito. Horowitz insiste en algo que se olvida: la cultura no se elige de una lista '+
       'de virtudes lindas, se diseña para el negocio que tenés — y tiene que doler un poco, porque '+
       'un valor que no te cuesta nada mantener no es un valor, es una preferencia. Lo que hace '+
       'este libro incómodo es que la unidad de cultura no es la campaña interna: es la próxima '+
       'decisión de zona gris que te toque firmar.',
  juego:'La moral y la Lupa se mueven con las decisiones de los dilemas, no con lo que declares. '+
        'Los atajos suben la Lupa y bajan la moral al mismo tiempo, y la moral es un multiplicador '+
        'de capacidad: la cultura se paga en puntos entregables.',
  cuando:function(e,c){ return e.moral < 50 && e.lupa >= 25; } },

{ id:'runninglean', pilar:'startup', titulo:'Running Lean', autor:'Ash Maurya',
  concepto:'Itera del plan A al plan que funciona',
  idea:'Tu plan A está casi seguramente mal, y no pasa nada: lo raro sería acertar de entrada sobre '+
       'un mercado que todavía no observaste. Maurya convierte eso en método: documentá el plan '+
       'entero en una página — problema, segmento, propuesta, canales, métricas — para poder verlo '+
       'de un vistazo, identificá cuál es la parte más riesgosa, y atacá esa primero, no la más '+
       'fácil ni la más divertida. Trabajar en el riesgo más alto se siente mal porque es donde es '+
       'más probable descubrir que estabas equivocado, y ahí está justamente el valor: descubrirlo '+
       'ahora cuesta una semana, descubrirlo en un año cuesta la empresa. El pivote, en este marco, '+
       'es una herramienta y no una derrota: cambiás de plan conservando el aprendizaje, con método '+
       'y no con pánico, y la diferencia entre las dos cosas se nota en si podés explicar qué '+
       'aprendiste que te llevó ahí.',
  juego:'Pivotar reinicia parte de la cobertura y del fit pero conserva la evidencia acumulada: el '+
        'motor te cobra el producto, no el aprendizaje. Es la única jugada que cambia la pregunta en '+
        'vez de la respuesta, y solo rinde si la evidencia ya te dijo que la pregunta estaba mal.',
  cuando:function(e,c){ return !!e.pivoteHecho; } },

{ id:'blitz', pilar:'startup', titulo:'Blitzscaling', autor:'Reid Hoffman',
  concepto:'Velocidad sobre eficiencia',
  idea:'Cuando el mercado es enorme y tiene dinámica de ganador se lleva todo, crecer desordenado '+
       'le gana a crecer bien: aceptás ineficiencia, caos organizacional y quemar plata a cambio de '+
       'llegar primero a una posición que después nadie te puede sacar. Hoffman es honesto sobre el '+
       'costo — la organización se rompe a propósito, se contrata gente que no alcanza para el '+
       'puesto siguiente, se acumula deuda de todo tipo — y sobre la condición: solo aplica si el '+
       'premio es realmente winner-take-most y si el mercado ya validó que hay demanda. Por eso es '+
       'la tesis más citada como excusa: se usa para justificar contratar rápido y gastar fuerte en '+
       'mercados donde el ganador no se lleva nada y donde el fit todavía no existe, que es la forma '+
       'más cara de perder. Cuando aplica de verdad, el que duda pierde; el trabajo difícil es saber '+
       'si aplica.',
  juego:'Cada persona en rampa cuesta dos meses sin producir más mentoría de los que ya estaban: '+
        'con varias a la vez, tu capacidad efectiva cae justo cuando más necesitás entregar. Ese '+
        'valle es el impuesto del blitz, y solo se paga si el crecimiento del otro lado es real.',
  cuando:function(e,c){ return e.rampa.length >= 3; } },

{ id:'rework', pilar:'startup', titulo:'Rework', autor:'Jason Fried and DHH',
  concepto:'Ser chico es una ventaja',
  idea:'La herejía que funciona: no levantes plata, no crezcas por crecer, no hagas reuniones, no '+
       'trabajes de noche. El argumento de fondo es que la restricción es un regalo, porque te '+
       'obliga a construir solo lo esencial, a cobrar desde el día uno y a decirle no a casi todo '+
       '— y decir no es la única forma conocida de tener foco. Ser chico deja de ser una etapa que '+
       'hay que superar y pasa a ser una posición defendible: menos costos, decisiones más rápidas, '+
       'y libertad para elegir clientes en vez de aceptarlos. La parte que más molesta es la '+
       'implícita: no toda buena empresa es una startup con venture capital, y mucha gente levanta '+
       'plata no porque el negocio lo necesite sino porque es lo que se hace, lo que convierte un '+
       'negocio sano en una apuesta que tiene que devolver cien veces o nada.',
  juego:'Sin rondas no hay capital de fondeo, y sin fondeo las capacidades de la empresa no se '+
        'componen: creces por precio, retención y boca a boca en vez de por combustible. Es más '+
        'lento y no diluye: el cap table se queda entero, y en el exit eso es la mitad del '+
        'resultado.',
  cuando:function(e,c){ return e.esFundador && e.rondas.length === 0 && e.mesPuesto > 9; } },

{ id:'foundersatwork', pilar:'startup', titulo:'Founders at Work', autor:'Jessica Livingston',
  concepto:'Todos empezaron mal',
  idea:'Decenas de entrevistas a fundadores famosos contando cómo empezó de verdad, sin la versión '+
       'de la conferencia: ideas que originalmente eran otra cosa, socios que se fueron, productos '+
       'que nadie usó durante meses, rondas que no cerraron. El patrón que Livingston encuentra no '+
       'es genialidad ni timing perfecto: es una tolerancia inusual a la incomodidad de que nada '+
       'funcione todavía, sin quedarse quietos ni un mes. La utilidad práctica del libro es de '+
       'calibración: cuando estás adentro, el desorden se siente como evidencia de que estás '+
       'haciendo algo mal, porque las historias que escuchás de los demás vienen editadas hacia '+
       'atrás desde el final feliz. Saber que la etapa fea es la etapa normal no arregla nada, pero '+
       'evita la peor decisión disponible, que es abandonar algo que estaba funcionando lento.',
  juego:'Fundar arranca con capacidades bajas, caja propia y cero rondas: la empresa no viene '+
        'construida como los puestos de empleado. Todo lo que suba de ahí lo subiste vos, y por eso '+
        'el cap table entero es tuyo al empezar.',
  cuando:function(e,c){ return e.esFundador; } },

{ id:'dunford', pilar:'startup', titulo:'Obviously Awesome', autor:'April Dunford',
  concepto:'Posicionamiento deliberado',
  idea:'Tu producto no compite contra quien crees: compite contra lo que el cliente usa hoy para '+
       'resolver el problema, y eso muchas veces es una hoja de cálculo, un becario o no hacer nada. '+
       'Dunford desarma el posicionamiento en piezas que se pueden elegir a propósito: cuáles son '+
       'las alternativas reales, qué atributos tenés que ellas no, qué valor sale de esos '+
       'atributos, quién le importa mucho ese valor, y en qué categoría de mercado querés que te '+
       'ubiquen. La categoría es la decisión más subestimada de la lista: define contra qué te '+
       'comparan, qué features esperan que tengas y cuánto creen que deberías costar, todo antes de '+
       'que abras la boca. Elegir bien ese marco puede duplicar la conversión sin tocar una línea '+
       'de código; elegir mal hace que tu mejor feature parezca una carencia.',
  juego:'La marca modera cómo te compara el mercado y cuánto pesa la paridad de features frente al '+
        'competidor. Con marca alta, cubrir necesidades distintas te distingue; con marca baja, el '+
        'mercado te lee como una versión peor del que ya conoce.',
  cuando:function(e,c){ return !!e.eventosVistos.paridad; } },

{ id:'playbigger', pilar:'startup', titulo:'Play Bigger', autor:'Ramadan, Peterson and others',
  concepto:'Diseño de categoría',
  idea:'Las empresas legendarias no ganan mercados: los crean. La tesis del libro es que el premio '+
       'grande no va al mejor producto de una categoría existente sino a quien define la categoría '+
       'misma — el problema, su nombre, y el criterio con el que se evalúan las soluciones — porque '+
       'el que define el problema en sus términos ya ganó la mitad de la evaluación. Diseñar '+
       'categoría es un trabajo raro, mitad producto y mitad narrativa: hay que educar al mercado '+
       'sobre un problema que todavía no sabe que tiene, sostener ese mensaje durante años, y '+
       'construir el producto que haga verdadera la promesa. Es caro y lento, y cuando funciona la '+
       'recompensa es que la categoría madura con tu vocabulario adentro, así que cuando el mercado '+
       'grande finalmente compra, la respuesta obvia sos vos.',
  juego:'La marca es acumulativa y cara: sube despacio con cobertura, fiabilidad y prensa, y baja '+
        'rápido con incidentes y atajos. Pasado cierto nivel deja de ser cosmética y empieza a '+
        'bajarte el CAC y a moderar la comparación con el competidor.',
  cuando:function(e,c){ return e.marca >= 60; } },

{ id:'helmer', pilar:'startup', titulo:'7 Powers', autor:'Hamilton Helmer',
  concepto:'Poder, no ventaja',
  idea:'Un feature no es una ventaja: es una demora, del tamaño de lo que tarde el competidor en '+
       'copiarlo. Helmer separa dos cosas que el lenguaje corriente mezcla — ser mejor y tener '+
       'poder — y define poder como algo muy específico: una condición que te permite sostener '+
       'márgenes superiores frente a un competidor que ya sabe todo lo que vos sabés. Hay siete '+
       'fuentes y solo siete: economías de escala, efectos de red, costos de cambio, marca, recurso '+
       'acaparado, contraposicionamiento y poder de proceso. La disciplina del marco está en su '+
       'estrechez: si no podés nombrar cuál de las siete es la tuya y por qué el competidor no '+
       'puede replicarla sin dañar su propio negocio, no tenés poder, tenés una buena racha. Para '+
       'quien prioriza, eso convierte cada apuesta grande en una pregunta única: ¿esto construye '+
       'una de las siete, o solo mejora el producto?',
  juego:'El fit alto con el competidor distraído es la única ventana barata del juego: subís '+
        'cobertura en necesidades que él ignora mientras su atención se queda baja. Cuando la '+
        'atención sube, esa misma cobertura pasa a costar el doble en puntos y en tiempo.',
  cuando:function(e,c){ return Motor.fitMax(e) > 0.6 && e.competidor.atencion < 0.3; } },

{ id:'innovsol', pilar:'startup', titulo:'The Innovator\'s Solution', autor:'Clayton Christensen',
  concepto:'La secuela con el manual',
  idea:'Si el Dilema explica por qué caen los incumbentes, la Solución explica cómo atacarlos a '+
       'propósito. La jugada central es entrar donde la estructura de costos del grande le prohíbe '+
       'seguirte: un segmento que para él tiene márgenes inaceptables, o un producto tan simple que '+
       'venderlo canibalizaría su línea buena. Ahí no te ignoran por descuido, te ignoran '+
       'racionalmente, y eso te compra años. La segunda mitad es sobre el ascenso: subir de mercado '+
       'es correcto y necesario, pero al ritmo que te permita tu producto y no al que te pide tu '+
       'ego, porque cada escalón que subís antes de tiempo te pone a competir de frente contra '+
       'alguien que juega mejor ese partido. Christensen también advierte lo obvio y lo olvidado: '+
       'cuando subís, dejás vacío el escalón de abajo, que es exactamente por donde entraste vos.',
  juego:'El precio decide en qué escalón competís, y con él el segmento que puede comprarte y la '+
        'atención que despertás. Subirlo mejora el MRR por usuario y te acerca a la zona donde el '+
        'competidor sí reacciona; bajarlo te devuelve invisibilidad y volumen.',
  cuando:function(e,c){ return !!e.eventosVistos.upmarket; } },

{ id:'paranoid', pilar:'startup', titulo:'Only the Paranoid Survive', autor:'Andy Grove',
  concepto:'Puntos de inflexión estratégica',
  idea:'Hay momentos en que las reglas del negocio cambian diez veces de magnitud — una tecnología '+
       'nueva, un competidor con otra estructura, una regulación, un cambio de canal — y la empresa '+
       'que los atraviesa con el plan viejo muere de forma muy ordenada, cumpliendo sus OKRs hasta '+
       'el final. Grove llama a eso un punto de inflexión estratégica y describe cómo se siente '+
       'desde adentro: primero como ruido, después como una serie de excepciones que se explican '+
       'una por una, y solo al final como un patrón. La paranoia que propone no es un rasgo de '+
       'carácter, es un mecanismo institucional: alguien tiene que estar mirando el borde, los '+
       'clientes raros que se van y los competidores que no cuentan, y tiene que tener permiso de '+
       'decirlo en voz alta sin quedar como el pesimista de la reunión. Y cuando el punto llegó, '+
       'las medias tintas son la peor opción: el plan viejo y el nuevo cuestan menos, cada uno por '+
       'separado, que el promedio de los dos.',
  juego:'Cuando la atención del competidor cruza la mitad, su fuerza empieza a descontar tu '+
        'crecimiento todos los meses y la paridad deja de alcanzar. Es un cambio de régimen, no un '+
        'ajuste: la misma jugada que funcionaba hace tres meses ahora rinde la mitad.',
  cuando:function(e,c){ return e.competidor.atencion >= 0.6; } },

{ id:'antifragile', pilar:'startup', titulo:'Antifragile', autor:'Nassim Taleb',
  concepto:'Lo que se fortalece con los golpes',
  idea:'Frágil es lo que se rompe con el desorden, robusto es lo que lo aguanta, y antifrágil es lo '+
       'que se beneficia de él: la distinción importa porque casi toda la gestión de riesgo apunta a '+
       'lo segundo cuando lo tercero está disponible y es más barato. Lo antifrágil no se logra '+
       'prediciendo mejor — Taleb es implacable con eso — sino cambiando la forma de la exposición: '+
       'costos fijos bajos, muchas apuestas chicas con pérdida acotada, y ninguna que pueda matarte. '+
       'Una empresa chica con caja positiva en una crisis no solo sobrevive el invierno: lo usa, '+
       'porque sus competidores financiados tienen estructuras que necesitan una ronda que ya no '+
       'existe, y el talento y los clientes que se sueltan van a algún lado. La regla operativa que '+
       'queda es simple: preferí muchas apuestas chicas reversibles a una grande irreversible, sobre '+
       'todo cuando no sabés qué va a pasar.',
  juego:'En invierno, el motor encarece las rondas para todos por igual: la ventaja no la da tu '+
        'plan sino tener el MRR por encima del burn cuando el capital desaparece. Tus costos fijos '+
        '— nómina e infra — son la variable que decide si el caos te tumba o te deja el campo libre.',
  cuando:function(e,c){ return e.eraId === 'invierno' && e.mrr > Motor.burnMensual(e); } },

/* ================= PRODUCTO (más) ================= */
{ id:'empowered', pilar:'producto', titulo:'Empowered', autor:'Marty Cagan',
  concepto:'Equipos con problemas, no listas',
  idea:'La secuela de Inspired apunta a los líderes y tiene una tesis que duele: tu trabajo no es '+
       'decidir qué se construye, es construir equipos capaces de decidirlo mejor que vos. El '+
       'contexto y los problemas bajan — estrategia, restricciones, la métrica que importa, por qué '+
       'importa — y las soluciones y la evidencia suben. Cagan es preciso sobre por qué la versión '+
       'contraria falla: cuando el líder decide las soluciones, el equipo pierde la única cosa que '+
       'lo haría bueno, que es tener que descubrir por sí mismo qué funciona, y además el líder se '+
       'convierte en el techo de la organización — nada puede ser mejor que lo que él alcance a '+
       'pensar entre reuniones. La condición que casi nadie cumple es de personal: equipos '+
       'empoderados requieren gente capaz de sostener ese nivel de decisión, y empoderar a un '+
       'equipo que no está listo no es generosidad, es abandono.',
  juego:'Empoderar sube el rendimiento por persona de forma permanente y baja tu control directo: '+
        'el equipo entrega más pero elige parte del cómo. Es el único cambio del juego que sube el '+
        'techo de la organización en vez de moverte adentro del que ya tenías.',
  cuando:function(e,c){ return !!e.empoderado; } },

{ id:'shapeup', pilar:'producto', titulo:'Shape Up', autor:'Ryan Singer',
  concepto:'Apetito, no estimación',
  idea:'En vez de preguntar cuánto tarda una cosa, Basecamp pregunta cuánto vale la pena gastar en '+
       'ella: seis semanas, dos semanas, un día. Eso se llama apetito y da vuelta la conversación, '+
       'porque una estimación es una predicción que casi siempre falla mientras un apetito es una '+
       'decisión de negocio que no puede fallar — si no cabe, se recorta alcance, nunca se mueve la '+
       'fecha. La segunda pieza es el shaping: antes de comprometer el ciclo, alguien define el '+
       'problema a un nivel intermedio, ni un ticket detallado ni una idea vaga, con los bordes y '+
       'los riesgos ya resueltos. Y la tercera es la que más cuesta respetar: no arranques diez '+
       'cosas a la vez. El trabajo en paralelo es donde los proyectos van a no terminarse nunca, '+
       'porque cada cambio de contexto cuesta más de lo que parece y porque diez cosas al 60% '+
       'entregan cero valor.',
  juego:'Cada apuesta en vuelo simultánea te cobra cambio de contexto: la misma capacidad reparte '+
        'peor y todo tarda más. Dos apuestas grandes terminadas rinden más que cinco a medio '+
        'camino, porque el impacto solo se cobra al entregarse.',
  cuando:function(e,c){ var n=0,k; for(k in e.enVuelo) if(e.enVuelo.hasOwnProperty(k)) n++; return n > 2; } },

{ id:'sprintk', pilar:'producto', titulo:'Sprint', autor:'Jake Knapp',
  concepto:'Cinco días para saber',
  idea:'Un proceso para comprimir meses de debate en una semana: el lunes mapeás el problema y '+
       'elegís un objetivo, el martes cada uno boceta soluciones en silencio, el miércoles se '+
       'decide, el jueves se prototipa una fachada creíble y el viernes se prueba con cinco '+
       'usuarios reales. Lo que hace que funcione no es la velocidad de construcción sino la '+
       'estructura de la decisión: bocetos individuales antes de discutir en grupo, para que la '+
       'idea del que habla más fuerte no arrastre a los demás, y un decisor único al final, para '+
       'que la reunión no termine en el promedio de todas las opiniones. El prototipo es de '+
       'cartón a propósito: no sirve para lanzar, sirve para que cinco personas reaccionen a algo '+
       'concreto en vez de opinar sobre una descripción. Cinco días bien gastados suelen matar la '+
       'idea equivocada antes de que se convierta en un trimestre.',
  juego:'Un mes con casi la mitad de los puntos en descubrir sube la evidencia de golpe y baja el '+
        'sesgo de todas las estimaciones que veas después. Es la jugada que cuesta un mes y salva '+
        'los tres siguientes: no entrega nada y cambia lo que vas a construir.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.desc >= 8; } },

{ id:'storymap', pilar:'producto', titulo:'User Story Mapping', autor:'Jeff Patton',
  concepto:'El mapa antes que la lista',
  idea:'Un backlog plano miente: esconde el recorrido del usuario detrás de una pila de tickets '+
       'ordenada por prioridad, y en esa forma es imposible ver si lo que estás por lanzar sirve '+
       'como conjunto. Patton propone acostar la historia sobre dos ejes: de izquierda a derecha el '+
       'recorrido en el tiempo — lo que la persona hace, en orden — y hacia abajo el detalle de cada '+
       'paso. Con el mapa a la vista aparecen dos cosas que la lista oculta: los huecos, pasos que '+
       'nadie estaba construyendo, y los cortes, rebanadas horizontales que atraviesan todo el '+
       'recorrido y funcionan de punta a punta aunque sean pobres en cada paso. Ese segundo hallazgo '+
       'es el valioso: la alternativa por defecto es terminar el primer paso perfecto y el último '+
       'inexistente, o sea el clásico producto 80% hecho que no sirve para nada, porque un recorrido '+
       'roto en un solo punto está roto entero.',
  juego:'Las necesidades del mapa no son independientes: los segmentos exigen combinaciones, y la '+
        'compuerta del mercado grande pide varias a la vez con umbrales concretos. Cinco apuestas '+
        'sobre la misma necesidad dejan el recorrido igual de roto que antes.',
  cuando:function(e,c){ return e.apuestasCompletadas >= 5; } },

{ id:'jtbd', pilar:'producto', titulo:'Competing Against Luck', autor:'Clayton Christensen',
  concepto:'El trabajo por hacer',
  idea:'Nadie quiere tu producto: la gente contrata cosas para hacer un trabajo que apareció en su '+
       'vida, y las despide cuando aparece algo que lo hace mejor. El ejemplo que Christensen usa '+
       'para desarmar la intuición es el milkshake que se vende a las siete de la mañana: el '+
       'trabajo no era desayunar rico, era entretener una mano durante un viaje largo y aguantar '+
       'hasta el mediodía, y por eso el competidor no era otro milkshake sino una banana. Pensar en '+
       'trabajos en vez de en features tiene una consecuencia práctica inmediata: el trabajo tiene '+
       'tres capas — funcional, social y emocional — y las dos últimas explican la mayoría de las '+
       'decisiones de compra que los datos demográficos no logran predecir. Y define el competidor '+
       'de verdad, que casi nunca es la empresa del mismo rubro: es el sofá, la hoja de cálculo, o '+
       'no hacer nada, que es el que gana más veces.',
  juego:'Saturar una necesidad del mapa da retornos decrecientes: pasado cierto umbral, cada punto '+
        'extra en la misma necesidad casi no mueve el fit. El motor premia cubrir el trabajo '+
        'completo de un segmento antes que perfeccionar la parte que ya funcionaba.',
  cuando:function(e,c){ var k; for(k in e.cobertura) if(e.cobertura.hasOwnProperty(k) && e.cobertura[k]>=80) return true; return false; } },

{ id:'norman', pilar:'producto', titulo:'The Design of Everyday Things', autor:'Don Norman',
  concepto:'La culpa es del diseño',
  idea:'Cuando alguien usa mal tu producto, el error es tuyo. Norman construye el argumento con '+
       'puertas: si tenés que poner un cartel que diga empujar, la puerta está mal diseñada, porque '+
       'un objeto bien hecho enseña su uso con su forma. Las piezas del vocabulario son útiles y '+
       'concretas: affordances, lo que el objeto sugiere que se puede hacer; signifiers, las señales '+
       'que lo comunican; mapeo, la correspondencia entre el control y lo que mueve; y feedback, la '+
       'confirmación inmediata de que algo pasó. La consecuencia más incómoda para un equipo de '+
       'producto es sobre la culpa: cuando el soporte reporta que los usuarios no entienden, la '+
       'reacción por defecto es capacitar, documentar o agregar un tour, y todas son formas de '+
       'trasladar el costo al usuario. El manual es una confesión de fracaso, y arreglar el diseño '+
       'es más barato que explicarlo para siempre.',
  juego:'La usabilidad multiplica la activación de todo el tráfico y modera la fricción de cada '+
        'necesidad nueva que agregues. Cada feature suma superficie, y la superficie sin diseño '+
        'baja la usabilidad: por eso construir puede empeorar la conversión.',
  cuando:function(e,c){ return e.usabilidad >= 70; } },

{ id:'okrdoerr', pilar:'producto', titulo:'Measure What Matters', autor:'John Doerr',
  concepto:'OKRs: foco comprometido',
  idea:'El sistema que Grove inventó en Intel y Doerr evangelizó: pocos objetivos que de verdad '+
       'importen, cada uno con dos o tres resultados clave medibles, públicos para toda la empresa, '+
       'y desacoplados del bono. Cada una de esas cuatro condiciones hace un trabajo específico. '+
       'Pocos, porque una lista de nueve objetivos no es foco, es un inventario. Medibles, porque '+
       'un objetivo sin número admite cualquier interpretación al cierre del trimestre. Públicos, '+
       'porque la mitad del valor está en que los equipos vean las dependencias entre ellos sin '+
       'tener que preguntar. Y desacoplados del bono, que es la que casi todas las empresas rompen: '+
       'si el OKR define tu compensación, todo el mundo va a poner metas que ya sabe que puede '+
       'cumplir, y el sistema pasa a medir habilidad para negociar metas en lugar de ambición.',
  juego:'El foco es el multiplicador más volátil del juego: se cae al repartir puntos entre muchos '+
        'frentes y sube al concentrarlos donde apunta el mandato. La alineación entre tu plan y el '+
        'mandato es un número que el motor calcula todos los meses, te guste o no.',
  cuando:function(e,c){ return !!e.eventosVistos.okr; } },

{ id:'workingback', pilar:'producto', titulo:'Working Backwards', autor:'Colin Bryar and Bill Carr',
  concepto:'Empieza por el comunicado de prensa',
  idea:'En Amazon, antes de construir nada se escribe el comunicado de prensa del lanzamiento y el '+
       'FAQ del cliente: el documento describe el producto terminado desde los ojos de quien lo va '+
       'a usar, con el beneficio arriba y sin jerga interna. Si el comunicado no emociona a nadie, '+
       'el producto tampoco lo va a hacer, y descubrirlo en un documento de seis páginas cuesta mil '+
       'veces menos que descubrirlo en un lanzamiento. Lo que hace el mecanismo poderoso no es el '+
       'formato sino la obligación de empezar por el final: escribir el resultado antes del plan '+
       'fuerza a definir para quién es, qué cambia en su vida y cómo se mide, tres cosas que un '+
       'roadmap con fechas te permite dejar convenientemente vagas. El FAQ hace el trabajo sucio: '+
       'ahí van las preguntas incómodas — precio, canibalización, qué pasa si no funciona — y '+
       'contestarlas por escrito es lo que separa una idea de una apuesta.',
  juego:'El motor califica el mandato — una métrica en movimiento — y no la cantidad de entregas: '+
        'un mes sin lanzamientos que mueve la métrica vale más que cuatro entregas que no la tocan. '+
        'La jugada del mes se elige por impacto real, no por volumen.',
  cuando:function(e,c){ return e.fabrica === false && e.mesPuesto > 6; } },

{ id:'rumelt', pilar:'producto', titulo:'Good Strategy Bad Strategy', autor:'Richard Rumelt',
  concepto:'El núcleo de la estrategia',
  idea:'La buena estrategia tiene tres partes y ninguna es opcional: un diagnóstico honesto de qué '+
       'está pasando de verdad, una política que guía y descarta opciones, y un conjunto de acciones '+
       'coherentes que se apoyan entre sí. Todo lo demás — visión, misión, metas ambiciosas, valores '+
       '— no es estrategia: Rumelt lo llama mala estrategia y es específico sobre sus síntomas, que '+
       'cualquiera reconoce en su propia empresa. Palabrería que suena profunda y no dice nada; '+
       'evitar el problema difícil porque nombrarlo obligaría a decidir; confundir metas con planes, '+
       'como si declarar que vas a crecer 40% fuera una forma de crecer 40%; y objetivos '+
       'contradictorios que sobreviven porque cada uno tiene su defensor. El diagnóstico es la parte '+
       'que más se saltea y la más valiosa, porque nombrar bien el problema descarta el 80% de las '+
       'opciones sin discutir ninguna.',
  juego:'La alineación de tu plan con el mandato multiplica el progreso del mes: repartir parejo '+
        'entre las cinco palancas avanza en todo y no cumple nada. El motor no premia el esfuerzo '+
        'total, premia la concentración sobre la métrica que firmaste.',
  cuando:function(e,c){ return e.foco >= 75; } },

{ id:'leanux', pilar:'producto', titulo:'Lean UX', autor:'Jeff Gothelf',
  concepto:'El diseño como hipótesis',
  idea:'Diseñar no es la fase donde se dibuja bonito lo que ya se decidió: cada pantalla es una '+
       'hipótesis sobre cómo se va a comportar una persona, y una hipótesis se escribe con un '+
       'resultado esperado y se prueba. Gothelf reemplaza el entregable por el aprendizaje: menos '+
       'especificaciones perfectas que nadie lee dos veces, más experimentos baratos con el equipo '+
       'entero mirando al mismo usuario al mismo tiempo. Esa última parte es la que cambia la '+
       'dinámica de verdad, porque cuando el ingeniero ve al usuario trabarse en persona, la '+
       'discusión sobre si vale la pena arreglarlo se termina en treinta segundos y sin argumentos '+
       'de autoridad. La renuncia que el método pide es real: hay que soltar la idea de que el '+
       'diseño se aprueba, y aceptar que se prueba — lo que significa que a veces se descarta '+
       'trabajo lindo que estaba objetivamente bien hecho.',
  juego:'La fricción en el embudo se ve en la activación de tus segmentos, no en el total de '+
        'usuarios. Arreglarla no suma usuarios nuevos: mejora la conversión de todos los que ya '+
        'estabas pagando por traer, y ese efecto se compone con cada mes de crecimiento.',
  cuando:function(e,c){ return !!e.eventosVistos.friccion; } },

{ id:'justenough', pilar:'producto', titulo:'Just Enough Research', autor:'Erika Hall',
  concepto:'Investigación justa y suficiente',
  idea:'No necesitás un departamento de investigación: necesitás la disciplina de preguntar bien y '+
       'la humildad de escuchar la respuesta, sobre todo cuando no es la que esperabas. Hall es '+
       'directa sobre el criterio de utilidad: la investigación cara que no cambia ninguna decisión '+
       'vale menos que una entrevista de veinte minutos que sí, así que la primera pregunta antes de '+
       'cualquier estudio es qué decisión está esperando este dato y qué haríamos distinto según el '+
       'resultado. Si la respuesta es "nada, es para entender mejor", no lo hagas. La otra mitad del '+
       'libro es sobre el sesgo del propio investigador, que es el riesgo más grande cuando el que '+
       'pregunta es también el dueño de la idea: se elige mal a quién entrevistar, se hacen '+
       'preguntas que sugieren la respuesta, y se recuerda con nitidez la única cita que confirmaba '+
       'la hipótesis. Suficiente sí es la meta; perfecto no está en la lista.',
  juego:'La calidad de tu discovery define el sesgo, y la evidencia define el ruido: son dos '+
        'variables distintas y las dos deforman la misma estimación. Con calidad alta y evidencia '+
        'media ya decidís razonablemente bien — el motor no exige certeza, exige honestidad.',
  cuando:function(e,c){ return e.calidadDesc >= 1 && e.evidencia >= 50; } },

{ id:'outcomes', pilar:'producto', titulo:'Outcomes Over Output', autor:'Josh Seiden',
  concepto:'Resultado ≠ entregable',
  idea:'Un resultado es un cambio de comportamiento humano que crea valor: el cliente vuelve, el '+
       'usuario invita a otros, el equipo de soporte deja de recibir el mismo ticket. La definición '+
       'es corta a propósito y sirve como filtro: si lo que estás midiendo no es algo que una '+
       'persona hace distinto, no es un resultado, es un entregable o una métrica de vanidad. Seiden '+
       'agrega la pregunta que hace el trabajo: ¿qué están haciendo las personas de otra manera, y '+
       'cómo lo vamos a saber? Los features son apenas apuestas puestas para producir esos cambios, '+
       'y la estadística incómoda es que la mayoría no lo logra — lo cual está bien si lo sabés y es '+
       'catastrófico si no, porque sin la distinción el equipo celebra el lanzamiento y nadie vuelve '+
       'a mirar. Comprometerse con resultados también cambia quién decide el cómo: si el equipo '+
       'responde por el comportamiento, tiene que poder elegir la solución.',
  juego:'El vector de impacto de cada apuesta se mide en métricas de comportamiento: adquisición, '+
        'activación, retención, ingresos, fiabilidad. Algunas apuestas mueven una en positivo y '+
        'otra en negativo — la superficie nueva cuesta fiabilidad — y ese saldo es el resultado real.',
  cuando:function(e,c){ return !!e.eventosVistos.roadmap; } },

{ id:'alchemy', pilar:'producto', titulo:'Alchemy', autor:'Rory Sutherland',
  concepto:'La lógica no vende',
  idea:'Lo opuesto a una buena idea puede ser otra buena idea, y esa frase es una herramienta y no '+
       'una boutade: significa que el espacio de soluciones psicológicas es más grande y más barato '+
       'que el de soluciones técnicas, y que casi nadie lo explora porque no se puede justificar en '+
       'una hoja de cálculo. Sutherland insiste en que los humanos no compran lo óptimo: compran '+
       'significado, señales y contexto. El tren no mejora solo yendo más rápido — eso cuesta miles '+
       'de millones — mejora con wifi, con una historia y con que el viaje se sienta corto, que '+
       'cuesta mucho menos y produce el mismo resultado percibido. Para un equipo de producto la '+
       'consecuencia práctica es que la percepción de valor es una palanca de diseño legítima: el '+
       'mismo tiempo de espera con una barra de progreso honesta se experimenta distinto, y eso no '+
       'es engañar al usuario, es diseñar la parte de la experiencia que ocurre en su cabeza.',
  juego:'La marca modifica cuánto valor percibe el mercado por el mismo producto: mueve el CAC, la '+
        'disposición a pagar y cómo pesa la comparación con el competidor. Es la única variable del '+
        'juego que mejora los números sin tocar el producto.',
  cuando:function(e,c){ return e.marca >= 70; } },

{ id:'badass', pilar:'producto', titulo:'Badass: Making Users Awesome', autor:'Kathy Sierra',
  concepto:'Usuarios que la rompen',
  idea:'Nadie recomienda un producto: la gente se recomienda a sí misma siendo mejor en algo, y tu '+
       'producto aparece en esa historia como la herramienta. Sierra invierte el objetivo por '+
       'completo: no hagas un producto increíble, hacé usuarios increíbles en el contexto donde vive '+
       'tu producto. El cambio de foco tiene consecuencias concretas en el backlog, porque deja de '+
       'importar la lista de capacidades del producto y empieza a importar la curva de aprendizaje '+
       'del usuario: qué puede hacer en los primeros cinco minutos, dónde se estanca, qué le falta '+
       'para pasar de aceptable a bueno en la tarea que le importa. El boca a boca sale de ahí y no '+
       'del marketing, porque lo que la gente comparte no es una herramienta, es un resultado del '+
       'que está orgullosa. Y hay un corolario incómodo: si tus usuarios no mejoran con el uso, '+
       'ninguna campaña va a producir recomendación sostenida.',
  juego:'La retención alta alimenta el boca a boca, que baja el CAC y alimenta la adquisición del '+
        'mes siguiente. Es el único bucle del motor que se compone solo — y el único crecimiento '+
        'que no se apaga cuando dejás de pagarlo.',
  cuando:function(e,c){ return Motor.retencionMedia(e) > 0.93; } },

{ id:'coldstart', pilar:'producto', titulo:'The Cold Start Problem', autor:'Andrew Chen',
  concepto:'La red atómica',
  idea:'Los efectos de red no empiezan grandes: empiezan con la red atómica, el grupo más chico que '+
       'se sostiene solo — cien personas en una universidad, los conductores de un barrio, un '+
       'equipo dentro de una empresa. Chen desarma el error clásico de perseguir la red grande desde '+
       'el día uno: en una red vacía el producto no funciona para nadie, así que cada usuario que '+
       'traés con esfuerzo se va, y el gasto de adquisición se evapora. La estrategia correcta es '+
       'saturar una red chica hasta que tenga vida propia y después ganar mil redes chicas en fila, '+
       'lo cual se siente lento y es la única forma que funciona. La otra mitad del libro es sobre '+
       'lo que pasa después: los efectos de red también se rompen — saturación, spam, usuarios que '+
       'ya no encuentran valor entre el ruido — y esa parte del ciclo también hay que gestionarla.',
  juego:'El coeficiente viral de tu sector amplifica lo que ya tenés: multiplica una base, así que '+
        'sobre poca base rinde poco. Concentrar usuarios en un solo segmento hasta que el fit sea '+
        'alto es lo que enciende el bucle; repartirlos entre cuatro lo deja apagado en todos.',
  cuando:function(e,c){ return e.viral >= 2 && Motor.usuarios(e) >= 100; } },

{ id:'olsen', pilar:'producto', titulo:'The Lean Product Playbook', autor:'Dan Olsen',
  concepto:'La pirámide del PMF',
  idea:'Seis capas en un orden que no se puede alterar: mercado objetivo, necesidades desatendidas '+
       'de ese mercado, propuesta de valor, conjunto de features del MVP, experiencia de usuario y, '+
       'solo en la punta, el producto. Olsen sostiene que el product-market fit no es un accidente '+
       'afortunado sino algo que se diseña desde abajo, y que el error clásico es empezar por las '+
       'dos capas de arriba — las divertidas, las que se pueden mostrar — y rezar. Lo que hace útil '+
       'la pirámide es que localiza el problema cuando algo no funciona: si la retención es mala, la '+
       'pregunta no es qué feature falta, es en qué capa se rompió la cadena. Puede ser que el '+
       'segmento esté mal elegido, que la necesidad ya estuviera bien atendida por otro, o que la '+
       'propuesta prometa algo que las features no entregan. Arreglar la capa equivocada es lo que '+
       'hace que los equipos trabajen un año sin mover nada.',
  juego:'El fit se calcula por segmento: la misma cobertura da fit alto con los innovadores y bajo '+
        'con los pragmáticos, porque cada segmento pesa las necesidades distinto. Perseguir "el '+
        'fit" en general no significa nada — el motor solo conoce fit con alguien.',
  cuando:function(e,c){ return Motor.fit(e, 'visio') > 0.6; } },

{ id:'thinkingbets', pilar:'producto', titulo:'Thinking in Bets', autor:'Annie Duke',
  concepto:'Decisión ≠ resultado',
  idea:'Una buena decisión puede salir mal y una mala puede salir bien, y como aprendemos de los '+
       'resultados, la mayor parte de lo que creemos saber por experiencia está mal aprendido. Duke '+
       'viene del póker profesional y trae el vocabulario: resulting es juzgar la calidad de una '+
       'decisión por cómo salió, y es el error más común y más costoso de cualquier organización, '+
       'porque premia la suerte y castiga el buen criterio con mala fortuna. La alternativa es '+
       'pensar en apuestas: qué probabilidades le asigno, cuánto pongo, con qué información cuento y '+
       'qué me falta. Eso obliga a separar dos preguntas que se mezclan siempre — "¿fue una buena '+
       'decisión?" y "¿salió bien?" — y hace posible la única forma honesta de revisar el pasado, '+
       'que es preguntar qué sabíamos en ese momento y no qué sabemos ahora.',
  juego:'Varias opciones del juego muestran su probabilidad antes de elegir y tiran los dados una '+
        'sola vez: la rama mala de una apuesta correcta existe. El motor guarda el historial de '+
        'impacto esperado contra real — ahí se ve si decidías bien o si venías teniendo suerte.',
  cuando:function(e,c){ return e.sectorId === 'apuestas'; } },

/* ================= GROWTH Y VENTAS ================= */
{ id:'traction', pilar:'growth', titulo:'Traction', autor:'Gabriel Weinberg and Justin Mares',
  concepto:'El 50% olvidado',
  idea:'Una startup es mitad producto y mitad distribución, y los fundadores de producto reparten su '+
       'tiempo 100 y 0 — no por descuido, sino porque construir se siente como trabajo y distribuir '+
       'se siente como molestar. Weinberg cataloga diecinueve canales de tracción y hace la '+
       'observación que da vuelta el problema: el canal que te va a funcionar probablemente no es el '+
       'que te gusta, y como cada canal tiene su propia física, la intuición de un equipo sobre '+
       'cuál probar primero no vale nada. Su método es el 50/50 con un embudo de canales: enumerar '+
       'los diecinueve sin descartar por gusto, elegir unos pocos plausibles, y correr pruebas '+
       'chicas y baratas cuyo objetivo no es crecer sino saber. La mayoría de los canales van a '+
       'fallar, uno o dos van a funcionar, y el que funciona suele agotarse — así que el proceso no '+
       'termina nunca.',
  juego:'La palanca de crecer convierte puntos en usuarios a través del CAC de tu sector, moderado '+
        'por tu marca y tu usabilidad. Con fit bajo compra usuarios que se van: es el gasto más '+
        'fácil de justificar y el más fácil de tirar a la basura.',
  cuando:function(e,c){ return e.gastoPropio && e.gastoPropio.crec > 0; } },

{ id:'hackingg', pilar:'growth', titulo:'Hacking Growth', autor:'Sean Ellis and Morgan Brown',
  concepto:'El proceso, no el truco',
  idea:'El growth hacking no es una bolsa de trucos: es un proceso semanal — analizar datos, '+
       'generar ideas, priorizarlas con un criterio explícito, probar, y volver a empezar — corrido '+
       'por un equipo transversal que puede tocar producto, no solo marketing. Ellis es tajante '+
       'sobre el prerrequisito, y es el que casi todos se saltean: antes de acelerar hay que tener '+
       'el producto imprescindible, porque acelerar un producto que la gente abandona solo hace que '+
       'lo abandone más gente más rápido. Su test es el famoso 40%: qué porcentaje de tus usuarios '+
       'estaría muy decepcionado si el producto desapareciera. La otra idea fuerte es que el growth '+
       'no vive en la punta del embudo: la mayoría de las palancas grandes están en activación y '+
       'retención, que son territorio de producto, y el growth hack famoso de otra empresa casi '+
       'nunca es tu palanca porque su embudo no es tu embudo.',
  juego:'El equipo de go-to-market convierte puntos en alcance con más eficiencia que tu gasto '+
        'directo, pero multiplica sobre la conversión que ya tenés. Con activación y retención '+
        'bajas, más gente de GTM es más presupuesto entrando a la misma cañería agujereada.',
  cuando:function(e,c){ return e.gtm >= 3; } },

{ id:'influence', pilar:'growth', titulo:'Influence', autor:'Robert Cialdini',
  concepto:'Las seis palancas',
  idea:'Reciprocidad, compromiso y coherencia, prueba social, autoridad, simpatía y escasez: seis '+
       'atajos mentales que la gente usa para decidir sin pensar, documentados por Cialdini con '+
       'experimentos y no con anécdotas. Los atajos existen porque son útiles — nadie puede evaluar '+
       'desde cero cada decisión del día — y por eso no desaparecen cuando los conocés. Para un '+
       'producto, la prueba social y la autoridad son las dos que más peso tienen en una compra B2B, '+
       'porque el que firma no está evaluando tu producto: está evaluando el riesgo de haberse '+
       'equivocado frente a su jefe, y un caso de éxito de una empresa parecida a la suya resuelve '+
       'ese problema mejor que cualquier demo. El compromiso y la coherencia explican por qué los '+
       'pasos chicos funcionan mejor que el pedido grande. Y la advertencia de Cialdini es explícita: '+
       'conocerlos es marketing, abusarlos es el camino corto a que nunca te vuelvan a creer.',
  juego:'Los casos de éxito publicados suben la marca y la evidencia a la vez, y desbloquean parte '+
        'de los requisitos de la compuerta al mercado grande. Son la jugada de crecimiento que no '+
        'compra usuarios: baja la desconfianza del que todavía no te compró.',
  cuando:function(e,c){ return !!e.hechas.casos; } },

{ id:'positioning', pilar:'growth', titulo:'Positioning', autor:'Al Ries and Jack Trout',
  concepto:'La batalla es mental',
  idea:'El posicionamiento no pasa en el producto: pasa en la cabeza del cliente, donde caben dos o '+
       'tres marcas por categoría y no más. Ries y Trout observaron que la mente no se reordena — no '+
       'vas a convencer a nadie de que sos mejor que el líder en el atributo que el líder ya ocupa, '+
       'porque ese casillero está lleno — pero sí acepta un casillero nuevo. De ahí la ley que da '+
       'el título: si no podés ser el primero en una categoría, creá una donde sí puedas serlo, '+
       'aunque sea absurdamente angosta al principio. La consecuencia estratégica es contraintuitiva '+
       'para cualquiera que priorice features: agregar capacidades para parecerte al líder te hace '+
       'menos memorable, no más competitivo, porque diluye la única cosa por la que alguien podría '+
       'acordarse de vos. Ser el número uno de algo chico le gana a ser el número cuatro de algo '+
       'grande, y la aritmética de la atención es la razón.',
  juego:'Elegir cabeza de playa es elegir a qué segmento le vas a cumplir los requisitos primero: '+
        'la compuerta del mercado grande pide una lista concreta y no se abre a medias. Repartir el '+
        'esfuerzo entre dos frentes deja las dos compuertas cerradas.',
  cuando:function(e,c){ return !!e.eventosVistos.chasm; } },

{ id:'challenger', pilar:'growth', titulo:'The Challenger Sale', autor:'Matthew Dixon and Brent Adamson',
  concepto:'Enseña, no complazcas',
  idea:'El estudio detrás del libro clasificó miles de vendedores B2B en cinco perfiles y encontró '+
       'algo que molestó a toda la industria: el que construye relaciones no es el mejor, y en '+
       'ventas complejas es el peor. El que gana es el challenger, que hace tres cosas — le enseña '+
       'al cliente algo sobre su propio negocio que no sabía, ajusta ese mensaje a quien tiene '+
       'enfrente, y toma el control de la conversación, incluido el precio. La razón por la que la '+
       'simpatía no alcanza es estructural: en una compra grande hay muchos decisores y ninguno se '+
       'juega el puesto por alguien agradable, mientras un insight que reencuadra el problema le da '+
       'a tu contacto algo para llevar a su propia reunión interna. Para producto hay una lectura '+
       'directa: la venta necesita una perspectiva, y esa perspectiva la construye quien entiende '+
       'el problema del cliente mejor que el cliente — o sea, el equipo que hizo el discovery.',
  juego:'Los clientes grandes piden cobertura específica y fiabilidad antes de firmar, y su '+
        'requisito no se negocia con precio. Lo que se negocia es cuánto de tu mes se va a construir '+
        'para uno solo — y si eso te acerca o te desvía de la compuerta del mercado.',
  cuando:function(e,c){ return !!e.eventosVistos.clientegrande; } },

{ id:'predictable', pilar:'growth', titulo:'Predictable Revenue', autor:'Aaron Ross',
  concepto:'La máquina de ingresos',
  idea:'Los ingresos predecibles salen de especializar el embudo: el que prospecta no cierra, el que '+
       'cierra no hace onboarding, el que hace onboarding no renueva. Ross lo aprendió en Salesforce '+
       'y el mecanismo es aburrido y potente, porque una vez que cada etapa tiene su dueño, su '+
       'métrica y su tasa de conversión, el embudo deja de ser un misterio y pasa a ser aritmética: '+
       'sabés cuántas conversaciones necesitás arriba para cerrar un número abajo, y contratar deja '+
       'de ser un acto de fe. La alternativa —el vendedor heroico que hace todo— funciona hasta el '+
       'día en que se va con el Rolodex, y mientras funciona no enseña nada, porque nadie puede '+
       'separar qué parte del resultado era el proceso y qué parte era él. La advertencia es la '+
       'misma de siempre: la máquina se construye después de saber que alguien compra, no antes.',
  juego:'Cuando el MRR supera el burn, el juego cambia de moneda: dejás de comprar tiempo con '+
        'rondas y empezás a comprarlo con ingresos. Sostenerlo depende del churn, que el motor '+
        'calcula sobre la retención por segmento — no sobre el total que te gusta mirar.',
  cuando:function(e,c){ return e.mrr > Motor.burnMensual(e) && e.etapa !== 'semilla'; } },

{ id:'contagious', pilar:'growth', titulo:'Contagious', autor:'Jonah Berger',
  concepto:'Por qué se comparten las cosas',
  idea:'Las cosas no se comparten por ser buenas: se comparten por seis razones que Berger '+
       'documentó y que se pueden diseñar. Moneda social — el que comparte queda bien; gatillos — '+
       'algo en la vida diaria te lo recuerda; emoción — sobre todo las de alta activación, no la '+
       'tristeza; visibilidad pública — si el uso no se ve, no se imita; valor práctico; e '+
       'historias, que son el envase que hace que el mensaje viaje. La más útil para producto es la '+
       'primera: la gente comparte lo que la hace ver bien, así que la pregunta de diseño no es "¿es '+
       'compartible?" sino "¿qué dice de alguien que comparte esto?". Y la segunda más útil es la '+
       'visibilidad: hacer visible el uso — un artefacto, una firma, un resultado que se muestra — '+
       'convierte cada usuario en publicidad pasiva. El boca a boca se diseña, no se reza.',
  juego:'El boca a boca es una función de la retención y del coeficiente viral del sector, y entra '+
        'como adquisición gratis todos los meses. Es el único canal cuyo costo no sube cuando '+
        'creces: por eso vale más arreglar retención que comprar alcance.',
  cuando:function(e,c){ return e.viral >= 1.3 && Motor.usuarios(e) > 800; } },

{ id:'pricing', pilar:'growth', titulo:'Monetizing Innovation', autor:'Madhavan Ramanujam',
  concepto:'El precio antes que el producto',
  idea:'Tres de cada cuatro productos nuevos fracasan en monetizar, y Ramanujam sostiene que la '+
       'causa es siempre la misma: el precio se decidió al final, cuando el producto ya estaba '+
       'construido y no quedaba nada por cambiar. La propuesta es invertir el orden y tener la '+
       'conversación de disposición a pagar durante el discovery, con la misma gente a la que le '+
       'estás preguntando por el problema — porque la respuesta define qué features valen la pena, '+
       'cómo se empaquetan y qué segmento tiene sentido perseguir. El precio no es un número que se '+
       'pone al final: es diseño de producto, y determina el negocio entero. El error espejo también '+
       'es común: fijar el precio por costos o por el del competidor, cuando lo único que importa es '+
       'el valor que el cliente percibe, que casi nunca es proporcional a lo que costó construirlo.',
  juego:'El precio multiplica el MRR de cada usuario y a la vez frena la adquisición y sube la '+
        'atención del competidor. Es la palanca más rápida del juego — mueve la caja el mismo mes — '+
        'y la única que puede arreglar el runway sin construir nada.',
  cuando:function(e,c){ return e.precioInicio && e.precio > e.precioInicio; } },

{ id:'foundingsales', pilar:'growth', titulo:'Founding Sales', autor:'Pete Kazanjy',
  concepto:'El fundador vende primero',
  idea:'Nadie puede vender tu producto antes que vos, y no porque seas bueno vendiendo — casi seguro '+
       'no lo sos — sino porque las primeras cien conversaciones de venta SON el discovery. Ahí se '+
       'descubre con qué palabras el cliente describe el problema, qué objeción aparece siempre, en '+
       'qué momento del pitch se apaga la cara del otro, y cuánto está dispuesto a pagar antes de '+
       'pedir descuento. Kazanjy señala que contratar un vendedor para esquivar esa incomodidad es '+
       'tirar el aprendizaje más caro que existe, y que además no funciona: un vendedor profesional '+
       'necesita un guion que todavía no existe, así que fracasa y encima te deja con la duda de si '+
       'era él o el producto. La regla práctica es no contratar ventas hasta poder escribir el guion '+
       'que el otro va a usar — y ese guion solo se escribe después de haber perdido bastantes '+
       'ventas en persona.',
  juego:'Como fundador, tu mando es total y tus puntos son los de la empresa: lo que hagas vos pesa '+
        'más que cualquier otro rol del escalafón. Las mismas horas en descubrir rinden doble, '+
        'porque no hay traducción entre el que habla con el cliente y el que decide.',
  cuando:function(e,c){ return e.esFundador && e.mrr > 0; } },

{ id:'purplecow', pilar:'growth', titulo:'Purple Cow', autor:'Seth Godin',
  concepto:'Notable o invisible',
  idea:'La publicidad murió de promedio: la gente ignora lo bueno y solo habla de lo notable, o sea '+
       'de lo que merece un comentario. Godin usa la imagen del campo lleno de vacas marrones donde '+
       'nadie frena el auto, y una vaca púrpura que cuenta su propia historia sin necesidad de '+
       'presupuesto. La consecuencia es incómoda para cualquier equipo que optimiza: lo seguro y lo '+
       'promedio son la misma cosa, y en un mercado saturado el riesgo grande no es hacer algo raro, '+
       'es hacer algo correcto que nadie note. Para producto eso significa que la remarcabilidad es '+
       'una decisión que se toma en el diseño y no en la campaña — hay que meterla en el producto, '+
       'donde el usuario la encuentra, no en el mensaje que lo rodea. Y si necesitás gritar para que '+
       'tu producto se note, el problema no es el volumen: es la vaca.',
  juego:'La marca es lo que hace que la adquisición no cueste lo mismo todos los meses: baja el CAC '+
        'y sube la disposición a pagar. Sube con cobertura, fiabilidad y prensa, y un solo incidente '+
        'grande le pega más que tres meses de buenas noticias.',
  cuando:function(e,c){ return e.marca >= 50; } },

/* ================= CAPITAL ================= */
{ id:'sandhill', pilar:'capital', titulo:'Secrets of Sand Hill Road', autor:'Scott Kupor',
  concepto:'Cómo piensa un VC',
  idea:'Un VC no busca buenas empresas: busca las poquísimas que devuelven el fondo entero, y esa '+
       'diferencia explica casi todo lo que desde afuera parece irracional. Kupor lo cuenta desde '+
       'adentro, empezando por el detalle que nadie mira: el VC también le rinde a alguien, tiene '+
       'inversores propios, un plazo de diez años y una promesa de retorno que cumplir. En esa mesa '+
       'tu empresa no compite contra tu mercado, compite contra el resto de su portafolio por '+
       'atención y por capital de seguimiento. Entendida la matemática, cada consejo raro cobra '+
       'sentido: por qué te empujan a crecer más rápido de lo que te conviene, por qué prefieren un '+
       'fracaso rápido a un negocio sano y chico, y por qué el mismo inversor que te felicitó en '+
       'enero no participa en tu ronda de junio. Nada de eso es traición — es su función objetivo, '+
       'que no es la tuya, y conviene saberlo antes de firmar.',
  juego:'Cada ronda mete capital de fondeo, que es lo único que compone las capacidades de la '+
        'empresa, y a la vez diluye tu cap table y suma preferencias a la cascada del exit. El '+
        'motor cobra las dos cosas: el combustible ahora, la cláusula al final.',
  cuando:function(e,c){ return e.rondas.length >= 2; } },

{ id:'wasserman', pilar:'capital', titulo:'The Founder\'s Dilemmas', autor:'Noam Wasserman',
  concepto:'Rico o rey',
  idea:'Wasserman estudió diez mil startups y encontró un patrón incómodo: las decisiones que '+
       'maximizan tu control y las que maximizan tu plata son casi siempre opuestas. Quedarte con '+
       'el mando significa levantar menos, contratar gente menos costosa, crecer más despacio y '+
       'quedarte con un porcentaje grande de algo más chico; buscar el valor máximo significa '+
       'diluirte, traer ejecutivos que saben más que vos, aceptar un directorio con poder real, y '+
       'quedarte con un porcentaje chico de algo grande. Cada cruce del camino — cofundadores, '+
       'reparto de equity, primer ejecutivo, cada ronda — te vuelve a preguntar lo mismo. Y la '+
       'conclusión más útil del estudio es sobre no elegir: quien evita la decisión y trata de '+
       'tener las dos cosas suele terminar sin ninguna, porque los inversionistas y los ejecutivos '+
       'buenos detectan la ambivalencia y se van con otro.',
  juego:'Tu porcentaje en el cap table y las preferencias que firmaste se aplican en orden en la '+
        'cascada del exit: primero los inversores, después lo que quede. Un porcentaje grande de una '+
        'empresa que no levantó puede pagar más que uno chico de una que valuó diez veces.',
  cuando:function(e,c){ return e.esFundador && e.capTable.fund < 0.6; } },

{ id:'powerlaw', pilar:'capital', titulo:'The Power Law', autor:'Sebastian Mallaby',
  concepto:'La ley de potencia',
  idea:'En venture capital no existe el promedio: en un fondo bueno, una inversión paga el fondo '+
       'entero y el resto es ruido estadístico. Mallaby recorre la historia de la industria y '+
       'muestra cómo esa única propiedad matemática moldeó todo el ecosistema alrededor: por qué se '+
       'financian ideas que parecen absurdas, por qué el precio de entrada importa menos que el '+
       'tamaño del techo, por qué te empujan a perseguir un mercado enorme aunque uno mediano '+
       'estuviera al alcance. También explica el consejo que más duele recibir: prefieren que mueras '+
       'rápido a que vivas chico, porque una empresa mediana consume la atención de un socio durante '+
       'años sin poder mover el retorno del fondo. Para quien está adentro, la lección práctica es '+
       'que tu carrera funciona igual: casi todo tu resultado va a venir de uno o dos lugares donde '+
       'estuviste en el momento correcto, y el trabajo es no perderte esos.',
  juego:'Cada puesto te deja equity vestido en tu portafolio, y al retirarte el juego valúa todo '+
        'junto. La mayoría de esas posiciones va a valer cero: el resultado de la carrera lo define '+
        'la mejor, no el promedio.',
  cuando:function(e,c){ return c && c.equities && c.equities.length >= 3; } },

{ id:'psych', pilar:'capital', titulo:'The Psychology of Money', autor:'Morgan Housel',
  concepto:'Rico vs. libre',
  idea:'La plata compra opciones, no cosas, y confundir las dos es el error central que Housel '+
       'documenta con historias en vez de fórmulas. Nadie quiebra por falta de retornos: quiebra por '+
       'falta de margen de seguridad, o sea por quedarse sin aire justo antes de que la apuesta '+
       'buena madure. De ahí sale la idea más útil para alguien con equity iliquido en una sola '+
       'empresa: vender una tajada cuando vas arriba no es falta de fe, es entender que sobrevivir '+
       'es el prerrequisito de todo lo demás, y que un resultado bueno que no podés esperar a '+
       'cobrar es equivalente a ninguno. Housel también insiste en la parte psicológica, que es la '+
       'que decide de verdad: la mayoría de las malas decisiones financieras no son errores de '+
       'cálculo, son reacciones al miedo o a la comparación con lo que le está pasando a otro.',
  juego:'La venta secundaria convierte papel en ahorros reales, que son lo único que sobrevive al '+
        'cierre del puesto y financia tu propia empresa después. Baja tu techo y sube tu piso — y el '+
        'piso es lo que decide cuántas apuestas más podés hacer.',
  cuando:function(e,c){ return (e.ventaSecundaria || 0) > 0; } },

{ id:'voss', pilar:'capital', titulo:'Never Split the Difference', autor:'Chris Voss',
  concepto:'Empatía táctica',
  idea:'Un negociador de rehenes del FBI no parte la diferencia, porque en su mesa no hay medio '+
       'rehén, y de ahí Voss deriva un método que funciona sorprendentemente bien en negociaciones '+
       'comunes. Las herramientas concretas: escuchar de verdad y demostrarlo repitiendo las últimas '+
       'palabras del otro; etiquetar la emoción que ves — parece que esto te preocupa — para que '+
       'baje de intensidad al ser nombrada; preguntas calibradas que empiezan con cómo y obligan al '+
       'otro a resolver tu problema; y el reconocimiento de que el "no" no cierra la conversación, '+
       'la empieza, porque recién ahí el otro se siente a salvo. La idea de fondo es que la '+
       'información vale más que la firmeza: el que más entiende de las restricciones del otro '+
       'controla la negociación, y eso se consigue preguntando, no argumentando.',
  juego:'Los términos de cada ronda quedan guardados y se aplican en la cascada del exit: una '+
        'preferencia limpia y no participativa puede valer más que un 30% extra de valuación. La '+
        'negociación se hace una vez y se cobra al final.',
  cuando:function(e,c){ var i; for(i=0;i<e.preferencias.length;i++){ if(e.preferencias[i].mult===1 && !e.preferencias[i].part) return true; } return false; } },

/* ================= GENTE ================= */
{ id:'radical', pilar:'gente', titulo:'Radical Candor', autor:'Kim Scott',
  concepto:'Di la cosa, con cariño',
  idea:'Scott cruza dos ejes — cuánto te importa la persona y cuánto te animás a retarla de frente '+
       '— y de ahí salen cuatro cuadrantes con nombre. La agresión odiosa: retar sin que te importe. '+
       'La insinceridad manipuladora: ni una cosa ni la otra, el peor lugar posible. Y la que '+
       'atrapa a la gente bienintencionada, que es la empatía ruinosa: te importa mucho y por eso no '+
       'decís nada, hasta que el problema es indefendible y la conversación que evitaste durante '+
       'seis meses se convierte en un despido. El cuadrante bueno no es un promedio de los otros: '+
       'que la persona te importe Y retarla de frente no son opuestos que hay que equilibrar, son '+
       'el mismo acto. La regla operativa que más rinde es de tiempo: el feedback pierde valor '+
       'exponencialmente con los días, así que se da en el momento, en privado, y sobre el hecho '+
       'concreto — no acumulado en una revisión trimestral.',
  juego:'La moral es un multiplicador de tu capacidad mensual y se mueve con las decisiones, no con '+
        'lo que digas: sube al defender al equipo y cae con cada atajo que lo expone. Recuperarla '+
        'cuesta varios meses; perderla, uno.',
  cuando:function(e,c){ return e.moral >= 70 && (e.moralMin || 100) <= 48; } },

{ id:'lencioni', pilar:'gente', titulo:'The Five Dysfunctions of a Team', autor:'Patrick Lencioni',
  concepto:'La pirámide de la confianza',
  idea:'Cinco disfunciones apiladas, y el orden es el aporte del libro: sin confianza nadie se '+
       'anima al conflicto honesto; sin conflicto honesto no hay compromiso real, solo asentimiento '+
       'en la reunión; sin compromiso nadie se hace cargo de nada; y sin responsabilidad, los '+
       'resultados no son de nadie. Lencioni señala el síntoma que la mayoría de los líderes lee al '+
       'revés: un equipo que nunca discute no es un equipo sano, es un equipo donde decir lo que '+
       'pensás tiene costo. La armonía permanente es la señal de alarma. Y la implicación práctica '+
       'para quien gestiona es que el orden importa: instalar procesos, OKRs y rituales sobre una '+
       'base sin confianza produce cumplimiento formal y cero cambio, porque los procesos no '+
       'reemplazan la conversación que nadie está teniendo. Se empieza por la base, y la base la '+
       'construye el que manda mostrando primero su propia vulnerabilidad.',
  juego:'Con moral en el piso, cada punto de capacidad rinde menos y los eventos de gente se '+
        'multiplican: renuncias, robos de talento, fugas. Ningún proceso del juego arregla eso — la '+
        'moral se recupera con decisiones, y son las que cuestan capital político.',
  cuando:function(e,c){ return e.moral < 38; } },

{ id:'drive', pilar:'gente', titulo:'Drive', autor:'Daniel Pink',
  concepto:'Autonomía, maestría, propósito',
  idea:'Los premios y castigos funcionan bien para tareas mecánicas y destruyen las creativas, y '+
       'Pink construye el caso con décadas de experimentos que la práctica gerencial ignoró '+
       'alegremente. El mecanismo del daño es específico: un incentivo externo reemplaza la '+
       'motivación interna en vez de sumarse a ella, estrecha el campo de visión — útil para '+
       'apurar, fatal para resolver — y convierte cualquier tarea interesante en un trámite por el '+
       'que te pagan. Lo que mueve el trabajo de conocimiento son tres cosas: decidir el cómo '+
       '(autonomía), mejorar visiblemente en algo difícil (maestría) y que lo que hacés le importe '+
       'a alguien (propósito). Ninguna de las tres se compra con un bono, y las tres se destruyen '+
       'con facilidad desde arriba: basta con decidir el cómo por ellos, cambiar de prioridad cada '+
       'tres semanas, y no contarles nunca qué pasó con lo que construyeron.',
  juego:'Empoderar al equipo sube el rendimiento por persona de forma permanente, y ese bono se '+
        'multiplica con la moral. Es más barato que contratar y no tiene rampa: la misma gente '+
        'entrega más porque decide más.',
  cuando:function(e,c){ return e.empoderado && e.moral >= 75; } },

{ id:'coachb', pilar:'gente', titulo:'Trillion Dollar Coach', autor:'Eric Schmidt and others',
  concepto:'El coach de Silicon Valley',
  idea:'Bill Campbell entrenó a los fundadores de Google, Apple y Amazon sin ser experto en producto '+
       'ni en tecnología, y sus ideas eran casi banales dichas en voz alta: el equipo primero, la '+
       'confianza antes que todo, decir la verdad rápido, y que las personas no son un medio para el '+
       'resultado sino la única forma de conseguirlo. Lo específico de su método era operativo: '+
       'empezar las reuniones por lo personal, obligar a que los desacuerdos se dijeran en la sala y '+
       'no en el pasillo, y no dejar que el líder decidiera antes de que el equipo hubiera hablado, '+
       'porque una decisión tomada de antemano convierte la discusión en teatro. La tesis del libro, '+
       'incómoda para cualquier cultura que se enorgullezca de su rigor técnico, es que la gerencia '+
       'es un oficio de personas que a veces involucra computadoras — y que la parte de las personas '+
       'no es el costo del trabajo, es el trabajo.',
  juego:'Tu reputación de carrera decide qué ofertas ves y en qué nivel del escalafón entrás. Se '+
        'construye cumpliendo mandatos, y abre palancas: cada nivel te da una partida más del plan '+
        'para mover.',
  cuando:function(e,c){ if (!c || !c.puestos || c.puestos.length < 2) return false;
    return c.puestos[c.puestos.length-1].promocion && c.puestos[c.puestos.length-2].promocion; } },

{ id:'managerpath', pilar:'gente', titulo:'The Manager\'s Path', autor:'Camille Fournier',
  concepto:'Cada nivel es otro trabajo',
  idea:'De hacer, a liderar a los que hacen, a liderar a los que lideran: Fournier recorre la '+
       'escalera y en cada peldaño repite el mismo hallazgo — no es más de lo mismo, es un trabajo '+
       'nuevo con herramientas nuevas y con una definición distinta de qué cuenta como un buen día. '+
       'El error clásico, y el más cómodo, es seguir haciendo el trabajo viejo pero con reuniones '+
       'encima: el que era buen ejecutor sigue metiéndose en la ejecución, porque ahí sabe que es '+
       'bueno, y su equipo aprende que las decisiones importantes se las va a llevar él. Lo que '+
       'cambia en cada salto es la moneda del apalancamiento: primero tu propio output, después la '+
       'calidad de las decisiones de tu equipo, después la estructura y la gente que elegís poner '+
       'en cada lugar. Y hay una honestidad que el libro pide: querer volver a la rama técnica es '+
       'una respuesta legítima, no un fracaso.',
  juego:'Tu nivel en el escalafón define tu mando — qué fracción de la capacidad del área te '+
        'responde — y qué palancas del plan podés tocar. Subir no te da más puntos propios: te da '+
        'más gente que se mueve con tu decisión.',
  cuando:function(e,c){ return e.rolN >= 3; } },

{ id:'norules', pilar:'gente', titulo:'No Rules Rules', autor:'Reed Hastings and Erin Meyer',
  concepto:'Densidad de talento',
  idea:'Los controles existen por los mediocres: la política de gastos, la aprobación de vacaciones '+
       'y los tres niveles de firma están ahí para el 3% que abusaría, y el precio lo paga el 97% '+
       'restante en velocidad. La apuesta de Netflix fue invertir el orden: pagar arriba del '+
       'mercado, actuar rápido con quien no entrega, y una vez que la densidad de talento es real, '+
       'borrar las reglas. Hastings es explícito en que las dos mitades son inseparables: la '+
       'libertad sin densidad es caos, y muchas empresas copiaron la parte divertida — vacaciones '+
       'ilimitadas, sin política de gastos — sin la parte difícil, que es despedir gente buena pero '+
       'no excelente y sostener eso culturalmente. Para producto la consecuencia es directa: la '+
       'velocidad de decisión de una organización es una función de en quién confiás, y ninguna '+
       'herramienta de proceso mejora eso.',
  juego:'Perder una persona clave cuesta más que su capacidad: se lleva contexto y le pega a la '+
        'moral de los que quedan. Defenderla cuesta capital político o plata, y es una de las pocas '+
        'jugadas del juego que se paga sola.',
  cuando:function(e,c){ return !!e.eventosVistos.caza; } },

{ id:'deepwork', pilar:'gente', titulo:'Deep Work', autor:'Cal Newport',
  concepto:'La concentración como ventaja',
  idea:'El trabajo profundo — horas seguidas, sin interrupciones, sobre algo difícil — es cada vez '+
       'más raro, y por eso más valioso: Newport argumenta que se está volviendo la habilidad '+
       'escasa de la economía del conocimiento justo cuando todas las herramientas del trabajo '+
       'están diseñadas para impedirla. El costo del cambio de contexto no es el minuto de la '+
       'interrupción: es el residuo de atención que queda en la tarea anterior, que degrada la '+
       'siguiente media hora sin que lo notes. La parte organizacional es la que más importa desde '+
       'un asiento de gestión: la concentración de un equipo no depende de la disciplina individual '+
       'de cada uno, depende de las normas del grupo — cuánto se espera que respondas, cuántos '+
       'frentes abiertos tolera el sistema, si existe un bloque que nadie puede reservar. Una '+
       'organización que protege eso compite contra empresas que viven en la ventana del chat.',
  juego:'El foco multiplica la capacidad de todo el equipo y se destruye repartiendo puntos entre '+
        'muchos frentes. Es la variable de gente más fácil de mover con tus propias decisiones — no '+
        'necesita presupuesto, necesita decir no.',
  cuando:function(e,c){ return e.foco >= 80; } },

{ id:'crucial', pilar:'gente', titulo:'Crucial Conversations', autor:'Patterson, Grenny and others',
  concepto:'La conversación que estás evitando',
  idea:'Los problemas grandes de una organización son casi siempre una conversación difícil que '+
       'nadie tuvo a tiempo, y el libro es un método para tenerla. La definición de conversación '+
       'crucial es precisa: hay opiniones opuestas, hay algo importante en juego y las emociones '+
       'están altas — y en esas tres condiciones la gente hace una de dos cosas, se calla o '+
       'ataca, y las dos destruyen información. La técnica ordena la salida: primero seguridad, '+
       'porque nadie dice nada útil si se siente en riesgo; después hechos antes que juicios, '+
       'porque el hecho se puede verificar y el juicio solo se puede defender; y la meta compartida '+
       'visible sobre la mesa, para que la conversación no se lea como un ataque. Lo más útil es el '+
       'diagnóstico: cuando la discusión se pone tensa, el problema dejó de ser el contenido y pasó '+
       'a ser la seguridad — y hay que arreglar eso primero, no seguir argumentando mejor.',
  juego:'El capital político es lo que te permite defender inversiones que no rinden este mes — '+
        'plataforma, fiabilidad, deuda. Se gasta pidiendo y se recupera cumpliendo: con el capital '+
        'en el piso, el motor te niega las jugadas que más necesitás.',
  cuando:function(e,c){ return e.politico < 30; } },

{ id:'walsh', pilar:'gente', titulo:'The Score Takes Care of Itself', autor:'Bill Walsh',
  concepto:'El estándar antes que el marcador',
  idea:'Walsh tomó el peor equipo de la NFL y ganó tres Super Bowls sin hablar nunca de ganar. Su '+
       'método fue definir el estándar de cómo se hace todo — hasta cómo se contesta el teléfono en '+
       'las oficinas, cómo se para uno en el campo, cómo se sale del vestuario — con el argumento '+
       'de que el marcador es un resultado y no una conducta, así que no se puede practicar. Lo que '+
       'se puede practicar es el estándar, y si el estándar es alto y se sostiene cuando nadie mira, '+
       'el marcador se acomoda solo. La otra mitad, menos citada, es sobre el costo personal: Walsh '+
       'describe con honestidad el desgaste de sostener ese nivel de exigencia, y admite que la '+
       'misma obsesión que produjo los títulos casi lo destruye. La cultura es el cómo, repetido — '+
       'y repetirlo es un trabajo, no una declaración.',
  juego:'Los mandatos cumplidos suben tu reputación de carrera, y la reputación decide en qué nivel '+
        'te contratan después y con qué palancas. El puesto se cierra y se olvida; la reputación es '+
        'lo único que viaja con vos.',
  cuando:function(e,c){ if (!c || !c.puestos) return false;
    var n=0,i; for(i=0;i<c.puestos.length;i++) if(c.puestos[i].cumplido) n++; return n >= 3; } },

/* ================= TECNOLOGÍA (más) ================= */
{ id:'pragmatic', pilar:'tech', titulo:'The Pragmatic Programmer', autor:'Andrew Hunt and David Thomas',
  concepto:'Ventanas rotas',
  idea:'Una ventana rota sin arreglar invita a romper el resto: la metáfora viene de la '+
       'criminología urbana y describe exactamente lo que pasa con el código malo tolerado, porque '+
       'enseña que aquí se tolera el código malo. El deterioro no es técnico sino social — la '+
       'siguiente persona que pasa por ese archivo calibra su estándar con lo que encuentra, no con '+
       'lo que dice la guía de estilo. De ahí sale la parte más útil del libro, que es una ética de '+
       'oficio con consecuencias operativas: la entropía del software no se detiene sola ni se '+
       'detiene con un proyecto de limpieza, se detiene con arreglos chicos y constantes hechos '+
       'mientras se pasa por ahí. Y hay un corolario para quien prioriza: un equipo al que nunca se '+
       'le permite arreglar la ventana rota que ve, aprende a no verla, y eso es mucho más caro que '+
       'las horas que le negaste.',
  juego:'La deuda baja con puntos en plataforma y sube con cada atajo y cada superficie nueva sin '+
        'cuidar. Mantenerla baja no da un bono visible: devuelve capacidad completa todos los meses, '+
        'que es la forma más aburrida y más grande de ganar.',
  cuando:function(e,c){ return e.deuda <= 15; } },

{ id:'ousterhout', pilar:'tech', titulo:'A Philosophy of Software Design', autor:'John Ousterhout',
  concepto:'Módulos profundos',
  idea:'La complejidad es el enemigo, y Ousterhout la define de forma operativa: es todo lo que '+
       'hace un sistema difícil de entender y de modificar, y se manifiesta en tres síntomas — '+
       'cambios que se propagan por muchos lugares, carga cognitiva alta para hacer algo simple, y '+
       'desconocidos desconocidos, o sea no saber qué hay que tocar. Su arma principal son los '+
       'módulos profundos: interfaz chica, implementación poderosa, mucha funcionalidad escondida '+
       'detrás de poca superficie. El opuesto es lo que la mayoría de las convenciones premian: '+
       'clases superficiales, capas que solo pasan datos hacia abajo, métodos de tres líneas que '+
       'obligan a leer diez archivos para entender uno. Y la recomendación más simple es la que más '+
       'rinde y menos se hace: diseñalo dos veces antes de escribirlo una, porque la segunda '+
       'alternativa casi siempre mejora la primera y pensar es barato.',
  juego:'La arquitectura define la capacidad de tu sistema, o sea cuántos usuarios aguanta antes de '+
        'que la probabilidad de incidente se dispare. Sube con plataforma y con entregas de escala, '+
        'y es lo que decide si el crecimiento del mes que viene te sirve o te tumba.',
  cuando:function(e,c){ return e.arquitectura >= 60; } },

{ id:'phoenix', pilar:'tech', titulo:'The Phoenix Project', autor:'Gene Kim and others',
  concepto:'TI como piso de fábrica',
  idea:'Una novela sobre un deploy que sale mal y una empresa que se está muriendo, con una '+
       'revelación en el medio: el trabajo de tecnología fluye como una fábrica, y todo lo que se '+
       'sabe de fábricas aplica. Hay cuellos de botella, y mejorar cualquier cosa que no sea el '+
       'cuello no mejora nada. Hay trabajo en curso invisible que nadie contabiliza — los pedidos '+
       'informales, las urgencias, los favores — y es la mayor parte de la carga real. Y hay un '+
       'Brent, la persona de la que todo depende, cuyo heroísmo es el síntoma más claro de que el '+
       'sistema está roto, porque cada vez que salva el día refuerza la razón por la que sigue '+
       'siendo indispensable. La primera intervención del libro no es técnica: es hacer visible el '+
       'flujo — todo el trabajo en un tablero, incluido el que nadie pidió por los canales '+
       'oficiales — porque no se puede gestionar una cola que no se ve.',
  juego:'El congelamiento por presupuesto de error agotado te deja construir un cuarto de tu '+
        'capacidad y manda el resto a fiabilidad. No lo elegís vos: es el sistema imponiendo la '+
        'prioridad que vos venías postergando, y dura hasta el trimestre siguiente.',
  cuando:function(e,c){ return !!e.congelado; } },

{ id:'contdel', pilar:'tech', titulo:'Continuous Delivery', autor:'Jez Humble and David Farley',
  concepto:'Si duele, hazlo seguido',
  idea:'Un deploy doloroso no se arregla haciéndolo menos: se arregla haciéndolo tan seguido que '+
       'deja de doler, porque cada repetición fuerza a automatizar el paso que fallaba. El objetivo '+
       'del libro es el pipeline de despliegue: build, tests, ambientes y release automatizados de '+
       'punta a punta, con la propiedad clave de que cualquier commit es un candidato a producción y '+
       'la decisión de publicar es de negocio, no de ingeniería. Lo que se gana no es solo '+
       'velocidad, es reversibilidad: cuando volver atrás cuesta dos minutos, lanzar deja de ser una '+
       'apuesta y empieza a ser un experimento, y eso cambia qué se anima a probar el equipo. La '+
       'objeción habitual — no tenemos tiempo para automatizar — se responde sola, porque el tiempo '+
       'ya se está gastando, repartido en cada jueves a la noche que nadie contabiliza como '+
       'proyecto.',
  juego:'El despliegue continuo, una vez encendido, baja la probabilidad de incidentes y suma '+
        'capacidad todos los meses sin volver a pagarlo. Es la única mejora permanente del lado '+
        'técnico: se compra una vez y rinde hasta el final del puesto.',
  cuando:function(e,c){ return !!e.cd; } },

{ id:'releaseit', pilar:'tech', titulo:'Release It!', autor:'Michael Nygard',
  concepto:'Diseña para el viernes a las 5',
  idea:'El sistema que pasa los tests no es el que sobrevive producción: sobrevive el que asume que '+
       'todo lo de al lado va a fallar, y en el peor momento. Nygard cataloga los patrones de '+
       'falla que se repiten en todos los sistemas reales — cascadas donde un componente lento '+
       'agota los hilos del que lo llama, reintentos que convierten un problema chico en una '+
       'tormenta, colas sin límite que esconden el desastre hasta que revientan — y los antídotos '+
       'que se diseñan a propósito: timeouts en todo, circuit breakers que cortan antes de agotar '+
       'recursos, mamparos que aíslan una parte del sistema del resto. La pregunta de diseño que '+
       'propone no es "¿funciona?" sino "¿qué pasa cuando lo de al lado no funciona?", y es la '+
       'diferencia entre un incidente de diez minutos y uno de seis horas con la mitad de los '+
       'usuarios afuera.',
  juego:'Cada incidente quema presupuesto de error, pega en la fiabilidad percibida y sube el '+
        'churn. Los puntos en fiabilidad bajan esa probabilidad de forma permanente; los parches '+
        'después del hecho solo pagan el incidente que ya ocurrió.',
  cuando:function(e,c){ return e.incidentesPuesto >= 2; } },

{ id:'staffeng', pilar:'tech', titulo:'Staff Engineer', autor:'Will Larson',
  concepto:'Senior no es el techo',
  idea:'Después de senior hay un camino que no es gerencia, y Larson lo documenta con entrevistas '+
       'en vez de con teoría: el staff engineer opera por influencia y no por autoridad — fija '+
       'dirección técnica, desbloquea equipos ajenos, le dice no a la arquitectura de moda con '+
       'argumentos y no con jerarquía. Es otro trabajo, con otra moneda: contexto y confianza, '+
       'acumulados en el tiempo y no otorgados por un título. Los arquetipos que describe son '+
       'útiles para no confundirse de rol: el tech lead que empuja un equipo, el arquitecto que '+
       'sostiene un área crítica, el solucionador al que se manda al incendio, y el que actúa como '+
       'pegamento entre equipos y cuyo trabajo es el más valioso y el más invisible en cualquier '+
       'evaluación. Para quien prioriza, la lección es de dónde viene el apalancamiento técnico '+
       'real: de la persona que puede cambiar cómo se decide en tres equipos sin ser jefe de '+
       'ninguno.',
  juego:'Reorganizarte en equipos con fronteras claras sube el umbral desde el que cada persona '+
        'nueva empieza a rendir menos. Es un cambio estructural: no suma puntos este mes, cambia la '+
        'pendiente de todos los meses que vienen.',
  cuando:function(e,c){ return !!e.teamTopo; } },

{ id:'elegant', pilar:'tech', titulo:'An Elegant Puzzle', autor:'Will Larson',
  concepto:'Sistemas de ingeniería',
  idea:'Los problemas de una organización grande de ingeniería son sistémicos, no individuales: '+
       'tamaños de equipo, colas de trabajo, ratios de gestión, cómo se reparte la gente entre '+
       'mantener y construir. Larson trata la organización como un sistema con flujos y reservorios '+
       'y de ahí saca reglas contraintuitivas: un equipo con demasiada gente y otro con muy poca '+
       'producen menos que dos parejos; agregar gente a un equipo que ya está en deuda operativa lo '+
       'empeora; y hay cuatro estados posibles — cayéndose, al día, endeudado, innovando — que '+
       'requieren intervenciones distintas y opuestas. Lo importante del enfoque es la renuncia que '+
       'exige: gestionar por anécdota funciona con veinte personas y falla a escala, porque cada '+
       'anécdota es cierta y ninguna es representativa. Lo que queda es gestionar el sistema — '+
       'tamaños, flujos, fronteras — y aceptar que eso se siente menos heroico.',
  juego:'Pasado cierto tamaño de organización, cada persona nueva rinde menos que la anterior: el '+
        'rendimiento marginal decae por carga de coordinación. La única salida es estructural, y '+
        'está en los eventos de reorganización, no en el plan del mes.',
  cuando:function(e,c){ return (e.ing + e.prod) >= 13; } },

/* ================= HISTORIAS DE GUERRA ================= */
{ id:'shoedog', pilar:'historias', titulo:'Shoe Dog', autor:'Phil Knight',
  concepto:'Nike vivió al borde',
  idea:'Las memorias del fundador de Nike son una década entera sin caja: bancos que lo echan por '+
       'crecer demasiado rápido, un socio japonés que casi lo hunde, cheques rebotando mientras la '+
       'marca explota en las calles. La lección que a nadie le gusta es de tesorería: crecer se '+
       'come la caja, porque hay que pagar el inventario o la nómina antes de cobrar la venta, así '+
       'que las empresas que crecen rápido viven más cerca de la muerte que las que crecen lento. El '+
       'mito del crecimiento ordenado es exactamente eso, un mito, y Knight lo desarma sin '+
       'romantizarlo: cuenta el miedo, las noches sin dormir y las decisiones tomadas con '+
       'información incompleta porque no había otra opción. Lo que queda es una calibración útil '+
       'para cualquiera que esté adentro de algo que se siente al borde: al borde es donde estuvo '+
       'Nike durante diez años.',
  juego:'Con runway crítico el motor endurece todo: los eventos pegan más, las opciones empeoran y '+
        'el capital político se vuelve caro. Sigue siendo jugable — el puesto se cierra con la caja '+
        'en cero, no antes — pero cada mes ahí cuesta más que el anterior.',
  cuando:function(e,c){ return Motor.runwayMeses(e) < 2 && e.vivo; } },

{ id:'badblood', pilar:'historias', titulo:'Bad Blood', autor:'John Carreyrou',
  concepto:'Theranos: fraude compuesto',
  idea:'Una mentira chica para cerrar una ronda exige una más grande para sostenerla, y después '+
       'otra, hasta que el producto ES la mentira y no hay forma de volver. Theranos no empezó como '+
       'fraude: empezó con una demo arreglada, un resultado presentado de forma optimista, un plazo '+
       'que se prometió sabiendo que no se cumplía — cosas que pasan en muchísimas empresas — y '+
       'llegó al final por el interés compuesto de los atajos. Carreyrou documenta el mecanismo que '+
       'lo hizo posible, y es más aterrador que la protagonista: un directorio prestigioso que no '+
       'pedía datos, empleados que se iban en silencio con acuerdos de confidencialidad, y un '+
       'entorno que premiaba la narrativa sobre la verificación. Nadie amanece una mañana siendo '+
       'Elizabeth Holmes; se llega por una escalera de decisiones que en su momento parecían '+
       'defendibles, y cada peldaño hace más caro bajarse.',
  juego:'La Lupa no baja sola: cada atajo la sube y se queda ahí para siempre. Pasado cierto nivel '+
        'abre eventos que ya no podés esquivar — allanamientos, fiscales, imputación — y esos '+
        'cierran el puesto sin importar cómo venía el mandato.',
  cuando:function(e,c){ return e.lupa >= 60; } },

{ id:'hatching', pilar:'historias', titulo:'Hatching Twitter', autor:'Nick Bilton',
  concepto:'Los cofundadores se comen entre sí',
  idea:'Cuatro fundadores, cuatro versiones incompatibles de la misma historia, y tres CEOs '+
       'echados por sus propios socios en cinco años. El patrón que el libro deja claro es que en '+
       'las empresas que valen algo la pelea de cofundadores es la regla y no la excepción, porque '+
       'el valor mismo es lo que la produce: mientras no hay nada, no hay nada que repartir ni '+
       'ningún puesto que valga la pena disputar. Bilton muestra que las traiciones de Twitter no '+
       'las causó la maldad de nadie en particular: las causó no haber hablado del poder a tiempo — '+
       'quién decide qué, qué pasa si dos no se ponen de acuerdo, qué significa exactamente el '+
       'título de cada uno — porque todas esas conversaciones eran incómodas en un momento en que '+
       'la amistad hacía que parecieran innecesarias. Lo que en el año uno se resuelve con un '+
       'documento, en el año cuatro se resuelve con abogados.',
  juego:'Los dilemas de socios y de crédito mueven moral, capital político y Lupa a la vez, y '+
        'ninguna rama sale gratis. El motor los recuerda: la decisión de este mes cambia qué '+
        'opciones te ofrece el que viene.',
  cuando:function(e,c){ return !!e.eventosVistos.socio; } },

{ id:'chaosm', pilar:'historias', titulo:'Chaos Monkeys', autor:'Antonio García Martínez',
  concepto:'El Valle, sin filtro',
  idea:'La versión cínica y divertida de Silicon Valley, escrita por alguien que estuvo adentro y '+
       'quemó todos los puentes al salir: aceleradoras que funcionan como casinos, adquisiciones que '+
       'son despidos con champaña, y la verdad incómoda de que muchas carreras se construyen '+
       'estando en la sala correcta cuando revienta la piñata. El valor del libro no es la '+
       'denuncia, es la calibración: cuenta cuánto del resultado de una carrera es timing y '+
       'posición, y cuánto es mérito, sin fingir que la proporción es cómoda. También describe con '+
       'precisión el mecanismo del acqui-hire y del cierre suave, que desde afuera se leen como '+
       'éxitos y desde adentro son otra cosa. Sirve para que un despido o una salida rara dejen de '+
       'sentirse como un juicio personal y empiecen a verse como lo que casi siempre son: el '+
       'resultado de una negociación entre gente que no estaba pensando en vos.',
  juego:'Un despido no borra tu carrera: el equity vestido se queda en tu portafolio y la '+
        'reputación baja pero se recupera cumpliendo el mandato siguiente. Lo único irreversible del '+
        'juego es la imputación.',
  cuando:function(e,c){ if (!c || !c.puestos) return false;
    var i; for(i=0;i<c.puestos.length;i++) if(c.puestos[i].despido) return true; return false; } },

{ id:'superpumped', pilar:'historias', titulo:'Super Pumped', autor:'Mike Isaac',
  concepto:'Uber: crecimiento sin frenos',
  idea:'La cultura que conquistó cien ciudades en cinco años era la misma que espiaba reguladores, '+
       'construía herramientas para esconderse de inspecciones y quemaba a su propia gente: no eran '+
       'dos culturas, una buena para crecer y otra mala, era una sola. Isaac documenta la lección '+
       'incómoda: los rasgos que ganan la guerra — velocidad extrema, tolerancia al conflicto, '+
       'desprecio por el permiso — son exactamente los que después incendian la casa, si nadie '+
       'traza una línea temprano y la sostiene cuando cuesta. Y el momento en que se traza importa: '+
       'cada atajo que funciona se convierte en política informal, y para cuando el problema es '+
       'visible desde afuera, la empresa entera está construida sobre él. Para quien decide, el '+
       'mensaje es sobre el orden de los factores: la línea se define antes de necesitarla, porque '+
       'después de necesitarla ya es una concesión.',
  juego:'Los atajos suben la Lupa y bajan la moral, y las dos cosas se quedan. La Lupa alta abre '+
        'eventos irreversibles y la moral baja te resta capacidad todos los meses: el atajo compra '+
        'un mes y cobra el resto del puesto.',
  cuando:function(e,c){ return !!e.eventosVistos.cocinar; } },

{ id:'everything', pilar:'historias', titulo:'The Everything Store', autor:'Brad Stone',
  concepto:'Amazon: la escala como religión',
  idea:'Bezos construyó sobre una idea que la mayoría de las empresas no se atreve a decir en voz '+
       'alta: tu margen es mi oportunidad. Precios de piso sostenidos durante años, pérdidas '+
       'deliberadas, y una obsesión operativa con el costo por unidad, apostando a que la escala '+
       'compra algo que la rentabilidad temprana nunca puede comprar — inevitabilidad. Stone '+
       'documenta cómo se ve eso desde adentro, incluido el costo humano y la disposición a '+
       'desangrar a un competidor durante el tiempo que haga falta. Lo que hace la estrategia '+
       'coherente y no solo agresiva es el círculo: precios bajos traen volumen, el volumen baja el '+
       'costo, el costo menor permite precios más bajos. Es un modelo que solo funciona si podés '+
       'financiar la parte de abajo del ciclo durante años, y esa condición — no la ambición — es '+
       'la que separa a Amazon de las mil empresas que intentaron lo mismo.',
  juego:'La necesidad de escala alimenta directamente la capacidad del sistema y la fiabilidad: es '+
        'la inversión que no se ve en ninguna métrica de producto y decide cuántos usuarios podés '+
        'aceptar. Invertir ahí antes de necesitarlo es lo único barato del juego largo.',
  cuando:function(e,c){ return (e.cobertura.escala || 0) >= 70; } },

{ id:'masters', pilar:'historias', titulo:'Masters of Scale', autor:'Reid Hoffman',
  concepto:'Qué escala y qué no',
  idea:'Del podcast a la página: decenas de fundadores contando el momento exacto en que algo chico '+
       'se volvió enorme, y qué tuvieron que dejar de hacer para que pasara. El patrón que se '+
       'repite en casi todas las historias es el mismo y es contraintuitivo para cualquiera con '+
       'presión de crecimiento: primero hacé algo que cien personas amen, y después — y solo '+
       'después — preocupate por los millones. La razón es que el amor de cien personas contiene la '+
       'información de por qué funciona, y sin esa información escalar amplifica algo que no '+
       'entendés. La segunda mitad del patrón es sobre las cosas que dejan de servir: el fundador '+
       'que respondía todos los mails no puede seguir haciéndolo, la decisión que tomaba solo tiene '+
       'que delegarse, y casi todos los entrevistados describen ese momento como el más difícil de '+
       'su carrera — no por ego, sino porque hay que soltar exactamente lo que había funcionado.',
  juego:'Pasada cierta cantidad de gente, la coordinación empieza a comerse el rendimiento '+
        'marginal: la misma decisión que antes tomabas sola ahora necesita estructura. El juego lo '+
        'modela con el umbral de carga cognitiva, y solo se mueve reorganizando.',
  cuando:function(e,c){ return (e.ing + e.prod + e.gtm) >= 18; } },

{ id:'lostfounder', pilar:'historias', titulo:'Lost and Founder', autor:'Rand Fishkin',
  concepto:'La startup, sin filtro',
  idea:'El fundador de Moz contando lo que nadie cuenta en una conferencia: la down round, la '+
       'depresión clínica, el directorio que te sonríe mientras vota tu reemplazo, y la matemática '+
       'del venture capital que convierte una empresa buena y rentable en una decepción porque no '+
       'iba a devolver el fondo. Fishkin es específico donde otros son vagos: muestra los números '+
       'reales, los términos que firmó sin entender, y las decisiones que tomó porque eran las que '+
       'se esperaban de él. La tesis que queda es sobre la elección de camino: levantar venture '+
       'capital no es una graduación, es elegir un juego con reglas particulares — crecimiento '+
       'exponencial o nada — y hay negocios excelentes que no son ese juego. La honestidad como '+
       'género literario tiene un uso práctico: es la única forma de saber cómo se siente el camino '+
       'antes de estar adentro y sin poder bajarse.',
  juego:'Una down round rebaja la valuación y diluye más por el mismo capital, y las preferencias '+
        'viejas siguen firmes arriba de tu porcentaje nuevo. En la cascada del exit eso se acumula: '+
        'la ronda que te salvó el mes puede ser la que te dejó en cero.',
  cuando:function(e,c){ return !!e.eventosVistos.downround; } },

/* ================= LA CALLE ================= */
{ id:'elprincipe', pilar:'calle', titulo:'The Prince', autor:'Niccolo Machiavelli',
  concepto:'Temido o amado',
  idea:'Quinientos años y sigue siendo el manual de operaciones que nadie admite haber leído. Las '+
       'tesis, dichas sin el maquillaje habitual: el poder se conserva, no se merece; es mejor ser '+
       'temido que amado si no podés ser las dos cosas, porque el miedo depende de vos y el cariño '+
       'del otro; y los príncipes prudentes mantienen las manos limpias alquilando manos sucias. '+
       'Maquiavelo no inventó el juego, solo se negó a mentir sobre él, y ahí está su utilidad '+
       'incómoda: describe cómo funciona el poder en cualquier organización, incluida la tuya, sin '+
       'la capa de lenguaje que lo hace tolerable. Hay una lectura defensiva que es la que más '+
       'sirve: reconocer estas jugadas cuando las hacen sobre vos — el crédito que se desvía, el '+
       'aliado que se enfría, el chivo que se elige antes de la reunión — es más valioso que '+
       'ejecutarlas, porque el que las ejecuta paga un costo compuesto que el libro no menciona.',
  juego:'El capital político es real y se gasta: pedir inversiones impopulares, defender gente, '+
        'negarse a un pedido de arriba. Con el capital en el piso, el motor te niega las jugadas que '+
        'más necesitás, y recuperarlo cuesta meses de cumplir sin pedir nada.',
  cuando:function(e,c){ return e.politico < 25 || !!(c && c.dilemasVistos && c.dilemasVistos.chivoexpiatorio); } },

{ id:'48laws', pilar:'calle', titulo:'The 48 Laws of Power', autor:'Robert Greene',
  concepto:'Nunca opaques al maestro',
  idea:'Greene catalogó lo que los cortesanos siempre supieron y lo puso en un libro que se vende '+
       'en aeropuertos: el crédito fluye hacia arriba por defecto, las apariencias pesan más que '+
       'los hechos en cualquier organización con más de veinte personas, y quien corrige al jefe en '+
       'público gana la discusión y pierde la guerra. La primera ley es la que más se cumple sin '+
       'que nadie la enuncie: nunca opaques al maestro. Hay dos formas de leerlo y conviene ser '+
       'consciente de cuál estás usando. Como manual, funciona a corto plazo y te deja rodeado de '+
       'gente que juega igual, que es una posición mucho peor de la que empezaste. Como vacuna, es '+
       'enormemente útil: sirve para reconocer la jugada cuando te la hacen, y para entender por '+
       'qué la mejor idea presentada de la peor manera pierde contra una idea mediocre presentada '+
       'con cuidado. La mayoría necesita la vacuna.',
  juego:'El crédito y la visibilidad son moneda del juego: mueven capital político y reputación, y '+
        'la reputación decide tus ofertas siguientes. Los dilemas de crédito no tienen rama gratis '+
        '— se paga en política o se paga en moral.',
  cuando:function(e,c){ return !!(c && c.dilemasVistos && (c.dilemasVistos.creditos || c.dilemasVistos.kompromat)); } },

{ id:'artofwar', pilar:'calle', titulo:'The Art of War', autor:'Sun Tzu',
  concepto:'Ganar sin pelear',
  idea:'El arte supremo es someter al enemigo sin batalla, y todo lo demás en el libro son maneras '+
       'de conseguir eso: conocete, conocelo, elegí el terreno y dejá que su propia estructura lo '+
       'derrote. Las ideas centrales se traducen sin esfuerzo al lenguaje competitivo de una '+
       'empresa. El terreno es la elección de segmento y de categoría, y elegir bien es la mitad '+
       'del resultado antes de que empiece nada. La velocidad vale más que la fuerza cuando el otro '+
       'es más grande, porque su tamaño es también su latencia. Y el mejor movimiento suele ser el '+
       'que hace que pelear no le convenga: crecer donde su estructura de costos le prohíbe '+
       'seguirte. Cada jugada sucia competitiva de tu industria — el rumor, el bake-off arreglado, '+
       'el robo de talento — es una peor traducción de un capítulo que Sun Tzu escribió mejor, '+
       'sobrio, hace dos mil quinientos años.',
  juego:'La atención del competidor es tu variable de terreno: baja, tenés meses gratis para '+
        'profundizar la diferencia; alta, su fuerza descuenta tu crecimiento todos los meses. Cada '+
        'jugada tuya sobre su cancha la sube, y no baja rápido.',
  cuando:function(e,c){ return e.competidor.atencion >= 0.5 || !!(c && c.dilemasVistos && (c.dilemasVistos.rumor || c.dilemasVistos.cazatalentos)); } },

{ id:'pitchanything', pilar:'calle', titulo:'Pitch Anything', autor:'Oren Klaff',
  concepto:'Control del marco',
  idea:'La tesis de Klaff después de mil salas de deals: quien es dueño del marco es dueño de la '+
       'reunión, y el marco se define en los primeros noventa segundos, juegues o no. Su modelo '+
       'tiene una parte neurológica discutible y una parte de observación social bastante afilada: a '+
       'los premios se los persigue y a los que persiguen se los descuenta, así que la postura '+
       'importa tanto como el contenido. De ahí salen movimientos concretos: fijar el tiempo y la '+
       'agenda al empezar, no pedir aprobación con el lenguaje corporal, plantear escasez real y no '+
       'inventada, y estar dispuesto a irse — que es la única fuente de poder de negociación que no '+
       'se puede simular. Lo que se le suele criticar es lo mismo que lo hace útil: pone en palabras '+
       'los juegos de estatus que ocurren en toda reunión de plata o de poder, y lo único que elegís '+
       'es si te das cuenta de que están ocurriendo.',
  juego:'Levantar cuesta puntos y capital político mientras la ronda está abierta, y los términos '+
        'que salen de ahí se aplican en la cascada del exit. Es la única mesa del juego donde una '+
        'sola conversación cambia el resultado final de la carrera.',
  cuando:function(e,c){ return e.esFundador && e.rondas.length >= 1; } },

{ id:'mafia', pilar:'calle', titulo:'The Godfather', autor:'Mario Puzo',
  concepto:'No es personal',
  idea:'Una novela sobre un negocio familiar que todo operador cita en el trabajo, y no por gusto '+
       'por la violencia: describe con precisión una economía de favores, que es cómo funciona en '+
       'realidad cualquier red profesional. Los favores son moneda y se contabilizan aunque nadie '+
       'lleve el registro por escrito. La lealtad se prueba, no se asume, y quien la asume descubre '+
       'tarde que no la tenía. Y "no es personal, son solo negocios" es lo que la gente dice justo '+
       'cuando es profundamente personal — la frase existe para hacer tolerable la parte '+
       'intolerable. La lectura útil para una carrera es sobre la contabilidad invisible: alguien, '+
       'en algún lugar, tiene tu nombre en un libro de favores, y las puertas que se abren o se '+
       'cierran diez años después casi siempre vienen de ahí. Este juego también lleva ese libro.',
  juego:'Las palancas y los favores quedan guardados en tu carrera, no solo en el puesto: una carta '+
        'jugada se gasta y una deuda pendiente se cobra cuando menos te conviene. El motor recuerda '+
        'lo que firmaste con quién.',
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
   APLICADO A TU CASO

   Cada función toma el puesto actual y devuelve el concepto leído contra
   TUS números de hoy, terminando en la jugada que se desprende con las
   palancas que tu nivel del escalafón te deja tocar. Es lo único de la
   ficha que cambia entre dos partidas, y es la razón de que la teoría no
   se lea como una cita: acá el libro habla de esta empresa.

   Todas devuelven texto plano, todas toleran campos ausentes de partidas
   viejas, y ninguna toca el DOM. ES5 plano, sin dependencias.
   ================================================================ */

/* --- utilidades de redacción, para que cien funciones no repitan cuentas --- */
function _n(v) { return Math.round(v || 0); }
function _pc(v) { return Math.round((v || 0) * 100) + '%'; }
function _k(v) { return Math.round((v || 0) / 1000) + 'k'; }
function _mil(v) {
  var n = Math.round(v || 0);
  return n.toLocaleString ? n.toLocaleString('en') : '' + n;
}
function _run(e) {
  var r = Motor.runwayMeses(e);
  return r > 90 ? 'runway infinito' : 'runway de ' + r.toFixed(1) + ' meses';
}
function _equipo(e) { return (e.ing || 0) + (e.prod || 0); }
function _wip(e) {
  var n = 0, k2;
  for (k2 in e.enVuelo) if (e.enVuelo.hasOwnProperty(k2)) n++;
  return n;
}
/* ¿tu nivel del escalafón te deja tocar esta partida del plan? La misma
   teoría se aplica distinto según qué puedas mover de verdad. */
function _tiene(e, palanca) {
  return !!(e.palancas && e.palancas.indexOf(palanca) >= 0);
}
function _segMejor(e) {
  var mix = Motor.mixSegmentos(e);
  return mix && mix.length ? mix[0].seg.nombre : null;
}
/* Tu calibración: cuántas de las llamadas que te animaste a hacer resultaron
   ciertas. Es lo único del juego que califica tu CRITERIO en vez de tu
   resultado, así que varias fichas de clase `info` la citan — es su prueba. */
function _calib(e, c) {
  var p = Motor.calibracion(e), acum = (c && c.calibracion) || null;
  var n = p.n, ok = p.ok;
  if (acum && acum.n) { n = acum.n + p.n; ok = acum.ok + p.ok; }
  if (!n) return null;
  return { ok:ok, n:n, pct:Math.round(ok / n * 100) };
}

/* el requisito de la compuerta que más te falta: la frase más útil del juego */
function _gateFalta(e) {
  var r = Motor.requisitosGate(e), i;
  for (i = 0; i < r.length; i++) if (!r[i].ok) return r[i].txt;
  return null;
}

var APLICAR = {

  /* ---------------- STARTUP ---------------- */

  lean: function (e, c) {
    var n = _n(e.evidencia), h = e.historialImpacto || [], cal = _calib(e, c);
    var desvio = null;
    if (h.length) {
      var s = 0, i;
      for (i = 0; i < h.length; i++) s += Math.abs(h[i].real - h[i].esperado) / Math.max(1, h[i].esperado);
      desvio = Math.round(s / h.length * 100);
    }
    var base = 'Tu evidencia en ' + e.empresa + ' está en ' + n + '/100' +
      (desvio !== null ? ', y tus últimas ' + h.length + ' entregas se desviaron en promedio ' + desvio +
        '% de lo que el backlog te había prometido' : '') +
      (cal ? '. Tus llamadas van ' + cal.ok + ' de ' + cal.n + ' (' + cal.pct + '%)' : '') + '. ';
    if (n < 40) return base + 'Eso no es una estimación: es una opinión con decimales. Cada apuesta que ' +
      'metas este mes es una hipótesis sin probar, y el motor ya te está cobrando la diferencia. Si tenés la ' +
      'palanca de descubrir, este es el mes de gastarla' + (_tiene(e, 'desc') ? '' : ' — y como en tu nivel todavía no la tenés, ' +
      'lo único que podés hacer es elegir apuestas chicas y reversibles hasta que alguien te la dé') + '.';
    if (n < 70) return base + 'Sabés a medias: las estimaciones se van acercando pero el segundo paso del ' +
      'circuito sigue flojo. La pregunta que ordena tu mes: ¿qué tendrías que ver al entregar para saber que ' +
      'esta apuesta estaba mal? Si no podés contestarla, no la pongas en el plan.';
    return base + 'Estás decidiendo con datos reales, que es exactamente donde querías estar. Ojo con lo que ' +
      'viene: la evidencia decae sola todos los meses, así que el aprendizaje validado se vence — y esta ' +
      'ventaja se pierde por dejar de alimentarla, no por gastarla.';
  },

  zero: function (e) {
    var at = _n(e.competidor.atencion * 100), f = _pc(Motor.fitMax(e));
    return 'El competidor de ' + e.sector + ' tiene fuerza ' + _pc(e.competidor.fuerza) + ' y te está ' +
      'prestando ' + at + '% de atención, con tu mejor fit en ' + f + '. ' +
      (at < 30 ? 'Sos invisible para él, que es la posición más barata del juego: cada punto que pongas en ' +
        'necesidades que él ignora te compra crecimiento que no puede copiar en un trimestre. La tentación ' +
        'de cerrar la brecha de features es exactamente lo que le devolvería la atención.' :
        'Ya te está mirando, así que la paridad desde acá es una carrera que gana el que va adelante — y no ' +
        'sos vos. Tu única salida es ser distinto en algo que a él le cueste copiar sin dañar su propio ' +
        'negocio: buscá la necesidad del mapa donde tu cobertura es alta y su interés es bajo.');
  },

  chasm: function (e) {
    var r = Motor.requisitosGate(e), ok = 0, i;
    for (i = 0; i < r.length; i++) if (r[i].ok) ok++;
    var g = Motor.compuerta(e, 'pragm'), falta = _gateFalta(e);
    if (g >= 1) return 'Cruzaste: cumplís los ' + r.length + ' requisitos de "' + e.gateNombre + '" y el ' +
      'mercado grande está comprando a tasa completa. Desde acá el gasto en crecer rinde lo que dice la ' +
      'etiqueta — es el único momento del puesto en que eso es cierto.';
    return 'Tu compuerta se llama "' + e.gateNombre + '" y cumplís ' + ok + ' de ' + r.length + ' requisitos, ' +
      'así que la mayoría temprana convierte al ' + _pc(g) + ' de lo normal: de cada 100 usuarios que pagues ' +
      'para traer de ese segmento, entran ' + _n(g * 100) + '. ' +
      (falta ? 'El que más te falta es "' + falta + '", y no se compensa con precio ni con mensaje. ' : '') +
      'Mientras la compuerta esté cerrada, cada punto en crecer hacia ellos se fuga en esa proporción: ' +
      'primero la lista, después la canilla.';
  },

  innov: function (e) {
    var subio = e.precio > (e.precioInicio || e.precio);
    return 'Estás a $' + e.precio + '/mes' + (subio ? ', arriba del $' + e.precioInicio + ' con el que ' +
      'arrancaste' : ', el mismo precio del día uno') + ', con ' + _n(e.competidor.atencion * 100) +
      '% de atención del competidor. ' +
      (subio ? 'Esa es la marcha hacia arriba de Christensen, y es rentable: te sube el MRR por usuario y te ' +
        'acerca al segmento que el grande sí defiende. La advertencia es la otra mitad: cada escalón que subís ' +
        'deja vacío el de abajo, y por ahí entra el que te va a hacer a vos lo que vos le estás haciendo a él.' :
        'Seguís en el escalón de entrada, que es aburrido y correcto: es la posición desde la que se crece sin ' +
        'que nadie reaccione. El grande no te ignora por descuido — te ignora porque atenderte le arruinaría el ' +
        'margen promedio, y eso te compra meses.');
  },

  hard: function (e) {
    var run = Motor.runwayMeses(e), rit = Motor.ritmoMandato(e);
    var m = mandatoPorId(e.mandatoId);
    return 'Hoy en ' + e.empresa + ': ' + _run(e) + ', capital político ' + _n(e.politico) + ', moral ' +
      _n(e.moral) + ', y el mandato al ' + _pc(rit.prog) + ' con ' + rit.restantesPuesto + ' meses por delante. ' +
      (rit.mesesMeta > rit.restantesPuesto ?
        'A este ritmo no llegás: la aritmética ya dijo que hace falta un cambio de plan, no un mes más de ' +
        'esfuerzo.' : 'A este ritmo llegás, y eso hace más fácil el error de no tocar nada.') +
      ' Horowitz diría lo mismo desde acá: no hay jugada limpia, hay dos caminos malos. Elegí rápido y ' +
      'hacete cargo — estancarse esperando la opción buena también es una decisión, y el motor te la cobra ' +
      'igual.' + (run < 6 ? ' Con este runway, además, te la cobra el mes que viene.' : '');
  },

  deals: function (e) {
    if (!e.rondas || !e.rondas.length) return 'Todavía no firmaste ninguna ronda en ' + e.empresa +
      ', así que la cascada del exit está limpia: lo que valga la empresa se reparte sin nadie cobrando ' +
      'primero. Cuando llegue el term sheet, la valuación va a ser el titular y la preferencia de liquidación ' +
      'la que decide cuánto te llevás — negociá la estructura, no el número.';
    var pref = e.preferencias || [], part = 0, mult = 0, i;
    for (i = 0; i < pref.length; i++) { if (pref[i].part) part++; if ((pref[i].mult || 1) > 1) mult++; }
    return 'Llevás ' + e.rondas.length + ' ronda(s) en ' + e.empresa + ' con ' + pref.length +
      ' preferencia(s) firmadas' + (part ? ', ' + part + ' de ellas participativa(s)' : '') +
      (mult ? ' y ' + mult + ' con múltiplo arriba de 1x' : '') + ', y tu porcentaje quedó en ' +
      _pc(e.capTable.fund) + '. ' +
      (part || mult ? 'Esas cláusulas cobran antes que vos y encima vuelven a cobrar con el resto: en un exit ' +
        'mediano se comen la parte del equipo entera antes de que el cap table importe. Es la letra chica que ' +
        'vas a leer recién en la cascada final.' :
        'Términos limpios: cobran una vez y se apartan. Vale más que varios puntos de valuación, y no se ve ' +
        'en ningún titular.');
  },

  grove: function (e) {
    var cap = Motor.capacidad(e), mio = _n(cap * e.mando);
    return 'Sos ' + e.rol + ': de los ' + _n(cap) + ' puntos de capacidad que produce el área, te responden ' +
      mio + ' — el ' + _pc(e.mando) + '. Tu output no son esos puntos, es lo que hace toda la organización ' +
      'que tocás, y eso lo multiplican tres variables que hoy están en moral ' + _n(e.moral) + ', foco ' +
      _n(e.foco) + ' y ' + (e.teamTopo ? 'equipos con fronteras claras' : 'una estructura sin fronteras definidas') +
      '. ' + (e.moral < 55 || e.foco < 55 ?
        'Con esos números, sumar gente produce menos de lo que cuesta la nómina: el apalancamiento está en ' +
        'arreglar el multiplicador, no en agrandar el multiplicando.' :
        'Con esos números el multiplicador trabaja para vos, y ahí sí conviene agrandar el equipo. Mirá ' +
        'indicadores tempranos — moral, foco, deuda — porque el mandato es el número que llega tarde.');
  },

  /* ---------------- PRODUCTO ---------------- */

  inspired: function (e) {
    var n = _n(e.evidencia), seg = _segMejor(e);
    return 'De los cuatro riesgos, el que tu partida mide es el de valor, y su termómetro es la evidencia: ' +
      n + '/100' + (seg ? ', con tu base concentrada en ' + seg : '') + '. El de usabilidad lo mide tu ' +
      'usabilidad, en ' + _n(e.usabilidad) + '. ' +
      (n < 50 ? 'Con evidencia en ' + n + ' estás construyendo con el riesgo de valor intacto: el motor ya ' +
        'sabe qué apuestas no van a rendir y vos no. Desactivalo antes del plan, no después de la entrega.' :
        'El riesgo de valor está razonablemente desactivado, así que el cuello de botella se mudó: mirá ' +
        (e.usabilidad < 60 ? 'usabilidad, que en ' + _n(e.usabilidad) + ' te está tapando la activación de todo lo que entregues.' :
          'viabilidad y negocio — deuda en ' + _n(e.deuda) + ' y ' + _run(e) + '.'));
  },

  torres: function (e) {
    var g = e.gastoPropio || {};
    return 'Tu evidencia está en ' + _n(e.evidencia) + ' y este mes le pusiste ' + _n(g.desc || 0) +
      ' punto(s) a descubrir. La cadencia importa más que el volumen porque la evidencia decae sola todos ' +
      'los meses: un punto sostenido gana a cuatro puntos cada cuatro meses, y el motor no te pregunta qué ' +
      'invertiste el trimestre pasado. ' + (!(g.desc > 0) ?
        'Este mes no pusiste ninguno, así que arrancás el que viene con menos información que hoy.' :
        'Mantené ese punto y las estimaciones del backlog siguen convergiendo a la verdad.') +
      ' Y la otra mitad del hábito: pensá tres soluciones para el mismo problema, porque con una sola sobre ' +
      'la mesa la pregunta deja de ser si resuelve algo.';
  },

  momtest: function (e, c) {
    var cal = _calib(e, c);
    if (e.calidadDesc < 0.6 && cal) return 'En ' + e.empresa + ' las entrevistas pescan opiniones (calidad ' +
      _pc(e.calidadDesc) + ') y se ve en tus llamadas: van ' + cal.ok + ' de ' + cal.n + ' (' + cal.pct +
      '%). El sesgo no te deja sin información, te deja con información optimista — las estimaciones vienen ' +
      'infladas de fábrica hacia el lado que te gusta, así que si venís llamando IGUAL o MÁS y te viene ' +
      'saliendo MENOS, ese patrón no es mala suerte: es el sesgo, medido. Cambiá la pregunta: qué hiciste la ' +
      'última vez que tuviste este problema, cuánto te costó, qué probaste. Los cumplidos son ruido; el ' +
      'único dato es un compromiso concreto.';
    if (e.calidadDesc >= 1) return 'Elegiste preguntar por hechos del pasado, y tus entrevistas en ' +
      e.empresa + ' producen datos usables (calidad ' + _pc(e.calidadDesc) + '). Por eso tus estimaciones ' +
      'del backlog convergen a lo real en vez de quedarse infladas: el sesgo está en cero y lo único que te ' +
      'separa de la verdad es el ruido, que baja con evidencia — hoy en ' + _n(e.evidencia) + '.';
    return 'En ' + e.empresa + ' las entrevistas están pescando opiniones (calidad ' + _pc(e.calidadDesc) +
      '): la gente está siendo amable con vos, no honesta, y eso no te deja sin información — te deja con ' +
      'información falsa y optimista, que es peor. El motor lo modela como sesgo: tus estimaciones vienen ' +
      'infladas de fábrica hacia el lado que te gusta. Cambiá la pregunta: qué hiciste la última vez que ' +
      'tuviste este problema, cuánto te costó, qué probaste. Los cumplidos son ruido; el único dato es un ' +
      'compromiso concreto.';
  },

  trap: function (e) {
    var m = mandatoPorId(e.mandatoId), rit = Motor.ritmoMandato(e);
    return 'Llevás ' + (e.apuestasCompletadas || 0) + ' apuesta(s) entregada(s) en ' + e.mesPuesto +
      ' meses, y tu mandato — ' + (m ? m.txt.toLowerCase() : 'el que firmaste') + ' — va al ' + _pc(rit.prog) +
      '. ' + ((e.apuestasCompletadas || 0) >= 4 && rit.prog < 0.4 ?
        'Ahí está la trampa completa, medida: lanzaste mucho y la métrica no se movió. El problema no es la ' +
        'velocidad de entrega, es que las apuestas no están tocando necesidades con fit real — y ninguna ' +
        'cantidad de entregas arregla eso.' :
        'Tu boleta al cerrar el puesto califica esa métrica y no la cantidad de entregas: un mes sin lanzar ' +
        'nada que la mueva vale más que cuatro entregas que no la tocan.');
  },

  hooked: function (e) {
    var ret = Motor.retencionMedia(e);
    return 'Tu retención media está en ' + _pc(ret) + ' y el coeficiente viral de ' + e.sector + ' es ' +
      e.viral + '. Esas dos cosas son el circuito: la retención alimenta el boca a boca y el boca a boca ' +
      'alimenta la adquisición del mes siguiente, gratis. ' +
      (ret < 0.85 ? 'Con ' + _pc(ret) + ' el circuito está abierto: los usuarios se van antes de dejar nada ' +
        'adentro, así que cada mes tenés que volver a comprarlos. Es el único agujero del juego que se ' +
        'agranda con el crecimiento.' :
        'Con ' + _pc(ret) + ' el circuito engancha y se compone solo. La pregunta de Eyal desde acá es la ' +
        'incómoda: ¿los usuarios vuelven porque el producto les sirve, o porque lo diseñaste para que no ' +
        'puedan irse? Lo segundo se cobra en marca.');
  },

  krug: function (e) {
    var u = _n(e.usabilidad);
    return 'Tu usabilidad está en ' + u + '/100, y no es una métrica más: multiplica la activación de TODO ' +
      'el tráfico que traés, así que hoy convierte al ' + _n(35 + u * 0.65) + '% de lo que sería posible. ' +
      (u < 55 ? 'Con esto, cada punto que pongas en crecer entra a una cañería agujereada: estás pagando ' +
        'CAC completo por usuarios que se traban antes de llegar al valor. Arreglar la fricción rinde sobre ' +
        'cada usuario de los próximos dos años; una campaña rinde una vez.' :
        'Con esto la cañería aguanta y el gasto en crecer rinde cerca de lo que promete. Ojo con lo que ' +
        'viene: cada feature nueva suma superficie, y la superficie sin cuidar baja este número — construir ' +
        'puede empeorarte la conversión.');
  },

  analytics: function (e, c) {
    var cal = _calib(e, c), mix = Motor.mixSegmentos(e), det = '', llam = '';
    if (cal) llam = ' Y una tasa que sí es accionable: tus llamadas van ' + cal.ok + ' de ' + cal.n +
      ' — una tasa contra una línea que dibujaste antes de mirar, que es la única forma de que un número ' +
      'signifique algo.';
    if (mix && mix.length) {
      var i, ps = [];
      for (i = 0; i < mix.length && i < 3; i++) ps.push(_pc(Motor.retencion(e, mix[i].seg.id)) + ' en ' + mix[i].seg.nombre);
      det = ' Por segmento: ' + ps.join(', ') + '.';
    }
    return 'El tablero te muestra ' + _mil(Motor.usuarios(e)) + ' usuarios en grande, y ese número solo sabe ' +
      'subir. La métrica que decide si el mes que viene existe es la retención, hoy en ' +
      _pc(Motor.retencionMedia(e)) + ' de promedio.' + det + llam + ' El promedio esconde el diagnóstico: un ' +
      'segmento reteniendo bien y otro fugándose se leen igual en el total. Elegí la única métrica de esta ' +
      'etapa — la que tu mandato ya eligió por vos — y tratá el resto como diagnóstico.';
  },

  /* ---------------- TECNOLOGÍA ---------------- */

  accelerate: function (e) {
    return e.cd ? 'Tenés despliegue continuo encendido en ' + e.empresa + ': lotes chicos, menos ' +
      'probabilidad de incidente y capacidad extra todos los meses, sin volver a pagarlo. La paradoja del ' +
      'libro, confirmada en tus números — sos más rápido Y más estable, porque son la misma cosa.' :
      'Todavía desplegás por evento, con arquitectura en ' + _n(e.arquitectura) + ' y ' +
      (e.incidentesPuesto || 0) + ' incidente(s) en el puesto. Los datos del libro son incómodos acá: tu lote ' +
      'grande no te está protegiendo, es la causa del riesgo. ' + (_tiene(e, 'plat') ?
      'Tenés la palanca de plataforma: es la única inversión que te paga en velocidad y en estabilidad al ' +
      'mismo tiempo.' : 'En tu nivel todavía no podés mover plataforma — es lo primero que se abre al subir, y ' +
      'vale gastar capital político para pedirlo.');
  },

  brooks: function (e) {
    var r = (e.rampa || []).length, eq = _equipo(e);
    if (r) return 'Tenés ' + r + ' persona(s) en rampa: no producen todavía y le están cobrando ' + (r * 6) +
      ' pts de mentoría al mes a los ' + eq + ' que sí producen. O sea que tu equipo de ' + eq + ' rinde hoy ' +
      'como uno de ' + Math.max(1, eq - Math.round(r * 6 / 8)) + '. Es la ley de Brooks en vivo, y no se ' +
      'arregla con más contrataciones: si el trimestre va atrasado, lo que se recorta es alcance.';
    return 'Hoy nadie está en rampa y tu equipo de ' + eq + ' rinde completo. Si contratás, la cuenta es ' +
      'esta: dos meses de output cero por persona más 6 pts/mes de mentoría de todos los demás — o sea que ' +
      'la capacidad baja antes de subir. Y la segunda ley: el sistema que salga del otro lado va a copiar la ' +
      'forma de la organización que armes ahora.';
  },

  sre: function (e) {
    return 'Tu presupuesto de error está en ' + _n(e.presupuestoError) + '/100 este trimestre, con ' +
      (e.incidentesPuesto || 0) + ' incidente(s) acumulados en el puesto' +
      (e.congelado ? ' — y agotado: por eso estás en congelamiento, construyendo un cuarto de tu capacidad ' +
        'con el resto forzado a fiabilidad. Nadie decidió esto en una reunión: lo decidió el número que se ' +
        'acordó cuando había margen, que es exactamente para lo que sirve el mecanismo.' :
       e.presupuestoError < 40 ? '. Un incidente más y se acaba, y el congelamiento invierte las prioridades ' +
        'solo, sin que puedas negociarlo. Si venías postergando fiabilidad, este es el mes.' :
       '. Tenés margen y para eso está: gastalo a propósito en ir rápido, no lo guardes. Un presupuesto de ' +
        'error sin usar es plata dejada en la mesa.');
  },

  topologies: function (e) {
    var tam = _equipo(e), umbral = (e.teamTopo ? 12 : 8) + Math.round(e.hab.liderazgo / 12);
    return 'Tenés ' + tam + ' personas construyendo y tu umbral de carga cognitiva está en ' + umbral +
      (e.teamTopo ? ' (ya reorganizado en equipos con fronteras claras)' : ' (sin fronteras definidas)') + '. ' +
      (tam > umbral ? 'Estás ' + (tam - umbral) + ' arriba: desde acá cada persona nueva rinde menos que la ' +
        'anterior, y el esfuerzo no lo arregla porque el problema es cuánto sistema cabe en una cabeza. La ' +
        'salida es estructural — cortar por fronteras que un equipo pueda ser dueño de punta a punta — y no ' +
        'está en el plan del mes.' :
        'Estás debajo del umbral, así que cada persona nueva todavía rinde completo. El momento de diseñar ' +
        'las fronteras es este, antes de necesitarlas: reorganizar en crisis cuesta el doble.');
  },

  ddia: function (e) {
    var c = _n(Motor.carga(e) * 100);
    return 'La carga de ' + e.empresa + ' está al ' + c + '% de lo que aguanta su arquitectura (hoy en ' +
      _n(e.arquitectura) + '), con ' + _mil(Motor.usuarios(e)) + ' usuarios. ' +
      (c > 85 ? 'Estás en la zona donde los supuestos invisibles se rompen todos juntos: la probabilidad de ' +
        'caída crece de forma no lineal desde acá, así que el próximo mes bueno de crecimiento es el que te ' +
        'tumba. Es un acantilado, no una pendiente.' :
       c > 60 ? 'Todavía respira, pero si los usuarios crecen más rápido que la arquitectura el éxito te ' +
        'tumba. Mirá los dos números juntos, no uno por vez.' :
        'Hay espacio de sobra. El momento barato para invertir en escala es siempre antes de necesitarla, y ' +
        'esa ventana es esta.');
  },

  fowler: function (e) {
    var tax = _n((e.deuda / 100) * 55), eq = _equipo(e);
    return 'Tu deuda técnica está en ' + _n(e.deuda) + ', y este mes el equipo entero pierde ~' + tax +
      '% de su capacidad pagando ese interés: con ' + eq + ' personas construyendo, es como si ' +
      _n(eq * tax / 100) + ' trabajaran solo para el pasado. ' +
      (e.deuda > 40 ? 'A este nivel el interés se come el mandato antes que cualquier decisión de producto, y ' +
        'crece solo si no lo pagás. ' + (_tiene(e, 'plat') ? 'Pagalo en cuotas chicas con plataforma, todos ' +
        'los meses — la reescritura es la forma más cara de pagar la misma deuda.' : 'En tu nivel no podés ' +
        'mover plataforma todavía: lo que sí podés es dejar de agregar superficie nueva sin cuidar.') :
        'Está bajo control, y eso no da ningún bono visible: te devuelve capacidad completa todos los meses, ' +
        'que es la forma más aburrida y más grande de ganar.');
  },

  /* ---------------- YC Y ENSAYOS ---------------- */

  pgdefault: function (e) {
    var run = Motor.runwayMeses(e), burn = Motor.burnMensual(e);
    var crece = e.hist.length >= 2 && e.hist[e.hist.length - 1].mrr > e.hist[e.hist.length - 2].mrr * 1.03;
    if (e.mrr > burn) return e.empresa + ' está VIVA POR DEFECTO: los ingresos ($' + _k(e.mrr) + '/mes) ya ' +
      'cubren el burn ($' + _k(burn) + '). Desde acá nadie puede matarte, y eso cambia qué apuestas tienen ' +
      'sentido: podés invertir en cosas que rinden en un año, contratar con calma y negociar sin fecha de ' +
      'vencimiento. La trampa de este lado es distinta — la comodidad.';
    return e.empresa + ' hoy está MUERTA POR DEFECTO: burn de $' + _k(burn) + ' contra ingresos de $' +
      _k(e.mrr) + ', ' + _run(e) + '. ' + (crece ?
        'Los ingresos crecen, así que la pregunta es aritmética: ¿llegan antes que el cero? Corré esa cuenta ' +
        'con el ritmo real, no con el que te gustaría.' :
        'Y los ingresos no crecen. ESE es el problema, no el roadmap.') +
      ' Cada decisión de este mes debería ser otra que la que tomarías del otro lado: ' +
      (_tiene(e, 'crec') ? 'precio antes que volumen, y recortar lo que no mueve ingresos este trimestre.' :
        'y desde tu nivel eso significa pelear por lo que sí mueve la métrica, no por lo que es más prolijo.');
  },

  pgscale: function (e) {
    var g = e.gastoPropio || {};
    return 'Mes ' + (e.mesPuesto + 1) + ' en etapa semilla, con ' + _mil(Motor.usuarios(e)) + ' usuarios y ' +
      'evidencia en ' + _n(e.evidencia) + '. A esta escala, cada punto en descubrir rinde mucho más que el ' +
      'mismo punto en crecer, porque el embudo todavía no tiene nada que amplificar: comprar alcance sobre ' +
      'fit bajo es pagar CAC por usuarios que se van. ' + ((g.crec || 0) > (g.desc || 0) ?
        'Y este mes pusiste más en crecer (' + _n(g.crec) + ') que en descubrir (' + _n(g.desc || 0) + '): estás ' +
        'escalando algo que todavía no entendés.' :
        'Reclutá a mano, uno por uno, y dales un servicio absurdamente bueno: eso es lo que te dice qué ' +
        'construir con una precisión que ninguna campaña iguala.');
  },

  pgmakers: function (e) {
    return 'Tu foco está en ' + _n(e.foco) + ' con ' + _wip(e) + ' apuesta(s) en vuelo, y el foco es un ' +
      'multiplicador directo de la capacidad del equipo — no un sumando. ' +
      (e.foco < 40 ? 'Debajo de 40 la misma gente entrega mucho menos, y la causa casi nunca es motivación: ' +
        'son los frentes abiertos y las interrupciones que parecen baratas desde una agenda de reuniones y ' +
        'cuestan la tarde completa desde una de construcción. Cerrá frentes antes de pedir esfuerzo.' :
        'Con este número el equipo puede sostener trabajo profundo. Protegerlo es una decisión tuya y no ' +
        'necesita presupuesto: necesita decir no, y aceptar el costo político de decirlo.');
  },

  pgramen: function (e) {
    var burn = Motor.burnMensual(e);
    if (e.mrr > burn) return e.empresa + ' llegó a rentabilidad ramen: $' + _k(e.mrr) + ' de ingresos contra ' +
      '$' + _k(burn) + ' de burn. El reloj de la muerte se detuvo, y eso no es éxito — es libertad. Lo que ' +
      'cambia de verdad es el tono de cada negociación que te queda: rondas, clientes grandes, ' +
      'contrataciones. Ya no negociás contra una fecha, y del otro lado se nota.';
    return 'Te faltan $' + _k(burn - e.mrr) + '/mes para rentabilidad ramen: $' + _k(e.mrr) + ' de ingresos ' +
      'contra $' + _k(burn) + ' de burn. Casi siempre está más cerca de lo que parece, porque no exige un ' +
      'negocio grande — exige uno chico con costos honestos, y se llega tanto subiendo el precio (hoy $' +
      e.precio + ') como recortando la estructura. No es éxito: es que nadie pueda matarte, ni un mercado de ' +
      'capitales cerrado ni un inversionista impaciente.';
  },

  pgdie: function (e) {
    if (Motor.runwayMeses(e) > 8) return 'Con ' + _run(e) + ' no estás en la zona de este ensayo, y vale ' +
      'saber para qué sirve antes de llegar: a las startups casi nunca las asesinan, se suicidan — los ' +
      'fundadores se cansan, se pelean, aceptan un empleo. La que se niega a morir termina bien más seguido ' +
      'de lo que parece, porque casi todos los competidores se rinden antes. La condición no es aguantar ' +
      'quieto: es que algo mejore cada mes. Tu moral está en ' + _n(e.moral) + ', y eso es lo que se rompe ' +
      'primero, antes que la caja.';
    return 'Llevaste la caja al límite ($' + _k(e.caja) + ' contra un burn de $' + _k(Motor.burnMensual(e)) +
      ') y seguís operando en el mes ' + e.mesPuesto + ', con moral en ' + _n(e.moral) + '. Esto es ' +
      'exactamente lo que Graham quería decir: casi nadie asesina a una startup, se suicidan — y sobrevivir ' +
      'feo cuenta como sobrevivir. La condición es que algo mejore cada mes, no que aguantes quieto: ' +
      (e.moral < 45 ? 'y con la moral en ' + _n(e.moral) + ', lo que está por romperse no es la caja, es la ' +
        'gente.' : 'y con la moral en ' + _n(e.moral) + ' todavía tenés equipo para hacerlo.');
  },

  yclaunch: function (e) {
    var h = e.historialImpacto || [];
    var ult = h.length ? h[0] : null;
    return 'Llevás ' + (e.apuestasCompletadas || 0) + ' apuesta(s) entregada(s), y recién por eso existe el ' +
      '"impacto real" en tu pantalla. ' + (ult ?
        'La última — "' + ult.n + '" — rindió ' + ult.real + ' contra ' + ult.esperado + ' esperado: ese delta ' +
        'de ' + Math.abs(ult.real - ult.esperado) + ' es todo el aprendizaje que el mes te dio, y no había ' +
        'forma de conseguirlo sin lanzar.' :
        'Hasta que algo se entrega, lo que ves en el backlog es una estimación con ruido: el delta entre ' +
        'esperado y real es el único aprendizaje disponible en el juego.') +
      ' Por eso el corte más chico que un usuario pueda usar de punta a punta le gana a la versión completa ' +
      'de la que estás orgulloso.';
  },

  yctalk: function (e) {
    var g = e.gastoPropio || {};
    return 'Este mes hiciste las dos cosas: ' + _n(g.desc || 0) + ' punto(s) en descubrir y ' + _n(g.cons || 0) +
      ' en construir. Ese es el circuito completo, y el motor lo premia junto — la evidencia acerca las ' +
      'estimaciones a lo real, y sin construcción no hay nada que estimar. La mitad de los equipos hace solo ' +
      'lo segundo y construye en el vacío con mucha prolijidad; la otra mitad confunde reuniones con ' +
      'progreso. Un mes con los dos rinde más que dos meses con uno solo.';
  },

  ycgrowth: function (e) {
    var h = e.hist || [];
    if (h.length < 2) return 'Todavía no hay dos meses de historia para medir crecimiento, y esa es la única ' +
      'métrica que la etapa temprana no permite maquillar. Una startup no es una empresa nueva ni una de ' +
      'tecnología: es una empresa diseñada para crecer rápido, y ese compromiso define qué problemas valen ' +
      'la pena y cuánta prolijidad podés permitirte. Hoy tenés ' + _mil(Motor.usuarios(e)) + ' usuarios y ' +
      'retención en ' + _pc(Motor.retencionMedia(e)) + ': el crecimiento se compone sobre esa base, y la ' +
      'fuga también.';
    var a = h[h.length - 2].u, b = h[h.length - 1].u;
    return 'Creciste de ' + _mil(a) + ' a ' + _mil(b) + ' usuarios este mes: ' +
      _n((b / Math.max(1, a) - 1) * 100) + '%. Y eso no se suma, se compone: los usuarios de este mes ' +
      'alimentan el boca a boca del que viene sobre una base más grande, así que un mes fuerte rinde en ' +
      'todos los siguientes — y un mes plano cuesta en todos los siguientes. Con retención en ' +
      _pc(Motor.retencionMedia(e)) + ', ' + (Motor.retencionMedia(e) > 0.88 ?
      'la base aguanta y el compuesto trabaja para vos.' :
      'una parte de lo que sumás se está fugando por abajo: el crecimiento se compone, la fuga también.');
  },

  pgfund: function (e) {
    return 'Cerraste ' + e.rondas.length + ' ronda(s) y tenés $' + _k(e.capFondeo || 0) + ' de capital de ' +
      'fondeo trabajando — que es lo único que compone las capacidades de la empresa. Levantar te costó ' +
      'puntos del mes y capital político (hoy en ' + _n(e.politico) + '), y esa es la parte que nadie ' +
      'presupuesta. La regla de Graham desde acá es una sola: volvé al producto. El peor estado posible no ' +
      'es un "no", es el eterno "casi cerramos", que consume trimestres sin producir plata ni información.';
  },

  pgmean: function (e) {
    return 'Tu Lupa está en ' + _n(e.lupa) + ' (arrancaste en ' + _n(e.lupaBase) + ' por el sector) y no baja ' +
      'sola: cada atajo la sube y se queda. Pasado cierto nivel abre eventos que ya no podés esquivar, y ' +
      'esos cierran puestos sin preguntar cómo venía el mandato. El argumento de Graham no es moral, es ' +
      'económico: construir algo nuevo requiere que mucha gente te dé el beneficio de la duda gratis, y eso ' +
      'solo se consigue con crédito social. Jugar limpio es, egoístamente, la mejor estrategia en un juego ' +
      'con memoria larga — y este juego la tiene.';
  },

  pgrr: function (e) {
    if (e.eraId !== 'invierno') return 'Implacable y recursivo: las dos palabras con las que Graham define a ' +
      'un buen fundador, y la distinción está en la segunda. Tenacidad es apretar los dientes y seguir ' +
      'haciendo lo mismo; esto es negarse a aceptar el mundo como viene y cambiar de medio cada vez que el ' +
      'medio falla. Adaptás los medios, nunca la meta. Hoy tus medios disponibles son estos: ' +
      (e.palancas || []).join(', ') + ' — y lo opuesto de esto no es rendirse, es quedarse quieto con ' +
      'elegancia ejecutando un plan que ya se sabe que no funciona porque era el plan aprobado.';
    return 'Mes ' + e.mesPuesto + ' operando en lo más hondo de un invierno de capital: las rondas están ' +
      'caras o cerradas para todos, y sin fondeo las capacidades de ' + e.empresa + ' se erosionan solas. Lo ' +
      'que el mundo no te puede cerrar son las palancas internas' +
      (_tiene(e, 'crec') ? ' — precio ($' + e.precio + '), retención (' + _pc(Motor.retencionMedia(e)) +
        '), deuda (' + _n(e.deuda) + ') y foco (' + _n(e.foco) + ')' :
        ' que tu nivel te deja tocar hoy: ' + (e.palancas || []).join(', ')) +
      '. Implacable y recursivo significa exactamente esto: adaptás los medios, nunca la meta.';
  },

  seibel: function (e) {
    var f = Motor.fitMax(e), seg = _segMejor(e);
    return 'Tu mejor fit está en ' + _pc(f) + (seg ? ', concentrado en ' + seg : '') + '. ' +
      (f >= 0.72 ? 'Ya se empieza a sentir: si la demanda todavía no te ahoga, estás cerca pero no llegaste. ' +
        'El test de Seibel no admite matices — si tenés que preguntarte si lo tenés, no lo tenés.' :
        'Seibel sería brutal acá: no lo tenés, y hasta que lo tengas cualquier otra prioridad — crecer, ' +
        'escalar, contratar, pulir la marca — es prematura. Todas esas cosas son formas de sentirse ' +
        'productivo mientras se evita la única pregunta abierta.') +
      ' Y el fit no es global: es con un segmento concreto. Tenerlo con los innovadores mientras el mercado ' +
      'grande te ignora es exactamente cómo se ve no tenerlo.';
  }
,

  /* ---------------- STARTUP (más) ---------------- */

  blank: function (e) {
    if (e.evidencia < 70) return 'Evidencia en ' + _n(e.evidencia) + ' con calidad de discovery en ' +
      _pc(e.calidadDesc) + ': todavía no saliste del edificio lo suficiente. Blank observó que las empresas ' +
      'tenían un proceso riguroso y por etapas para desarrollar el producto y nada equivalente para ' +
      'desarrollar el cliente — se asumía que estaba ahí y que aparecería cuando el producto estuviera ' +
      'listo. Su propuesta es un proceso paralelo con la misma disciplina, y la puerta que importa es la de ' +
      'validación a escala: contratar y gastar antes de saber que alguien compra repetidamente escala el ' +
      'error hasta hacerlo irreversible.';
    return 'Llegaste a evidencia ' + _n(e.evidencia) + ' con calidad de discovery en ' + _pc(e.calidadDesc) +
      ': de verdad saliste del edificio. Lo que eso te compró es concreto — las estimaciones del backlog ' +
      'ahora convergen a los impactos reales, así que el motor dejó de mentirte. La puerta que Blank marca ' +
      'es la siguiente: validar no es escalar. Contratar, gastar en alcance y armar estructura antes de ' +
      'saber que alguien compra repetidamente escala el error hasta hacerlo irreversible. Tu fit máximo hoy ' +
      'es ' + _pc(Motor.fitMax(e)) + ': ese es el número que dice si ya podés cruzar.';
  },

  whatyoudo: function (e) {
    return 'Moral en ' + _n(e.moral) + ' y Lupa en ' + _n(e.lupa) + ': tu equipo está mirando exactamente ' +
      'cómo decidís en la zona gris, y está aprendiendo. Esa combinación es el diagnóstico de Horowitz en un ' +
      'renglón — la cultura no es lo que declarás, es lo que se ve premiado. En el motor las dos variables ' +
      'están acopladas: los atajos suben la Lupa y bajan la moral al mismo tiempo, y la moral es un ' +
      'multiplicador de capacidad. Así que la cultura no se paga en discursos: se paga en puntos ' +
      'entregables, todos los meses, hasta el final del puesto.';
  },

  runninglean: function (e) {
    if (!e.pivoteHecho) return 'Tu plan A está casi seguramente mal, y no pasa nada: lo raro sería acertar ' +
      'de entrada sobre un mercado que todavía no observaste. Con evidencia en ' + _n(e.evidencia) +
      ' y fit máximo en ' + _pc(Motor.fitMax(e)) + ', la pregunta de Maurya es cuál es la parte más riesgosa ' +
      'de tu plan y si la estás atacando primero — trabajar ahí se siente mal porque es donde es más ' +
      'probable descubrir que estabas equivocado, y ahí está el valor. El pivote existe como herramienta y ' +
      'solo rinde si la evidencia ya te dijo que la pregunta estaba mal.';
    return 'Pivotaste en ' + e.empresa + ' y el motor te cobró el producto pero te dejó el aprendizaje: la ' +
      'cobertura y el fit se reacomodaron, la evidencia (' + _n(e.evidencia) + ') sigue tuya. Eso es ' +
      'exactamente la tesis de Maurya — el pivote es una herramienta, no una derrota, si conservás lo que ' +
      'aprendiste y podés explicar qué te llevó ahí. Lo que viene ahora es la parte que casi nadie hace: ' +
      'atacar primero la parte más riesgosa del plan nuevo, no la más fácil. Tu mejor fit está en ' +
      _pc(Motor.fitMax(e)) + ' — ahí se va a ver si el plan B era mejor o solo distinto.';
  },

  blitz: function (e) {
    var r = (e.rampa || []).length;
    if (!r) return 'Hoy no tenés a nadie en rampa, con ' + _run(e) + ' y fit máximo en ' +
      _pc(Motor.fitMax(e)) + '. El impuesto del blitz se paga por adelantado: cada persona son dos meses sin ' +
      'producir más 6 pts/mes de mentoría de los que sí, así que contratar de golpe hace caer tu capacidad ' +
      'justo cuando más necesitás entregar. La condición de Hoffman para que valga la pena es que el premio ' +
      'sea de ganador se lleva todo y que la demanda ya esté validada — con fit en ' + _pc(Motor.fitMax(e)) +
      (Motor.fitMax(e) < 0.6 ? ', todavía no.' : ', la apuesta empieza a ser defendible.');
    return 'Tenés ' + r + ' persona(s) en rampa a la vez: eso es ' + (r * 6) + ' pts/mes de mentoría saliendo ' +
      'de los ' + _equipo(e) + ' que sí producen, más dos meses de output cero por cabeza. Estás pagando el ' +
      'impuesto del blitz con la caja en $' + _k(e.caja) + ' y ' + _run(e) + '. La condición de Hoffman para ' +
      'que eso valga la pena es que el premio sea realmente de ganador se lleva todo y que la demanda ya esté ' +
      'validada: tu fit máximo está en ' + _pc(Motor.fitMax(e)) + '. ' +
      (Motor.fitMax(e) < 0.6 ? 'Con ese fit no estás blitzscaleando: estás escalando un error rápido.' :
        'Con ese fit la apuesta es defendible — y el que duda pierde.');
  },

  rework: function (e) {
    if (!e.esFundador || (e.rondas && e.rondas.length)) return 'La herejía de Rework se mide contra tu ' +
      'estructura: $' + _k(Motor.burnMensual(e)) + ' de burn contra $' + _k(e.mrr) + ' de ingresos, con ' +
      (e.rondas ? e.rondas.length : 0) + ' ronda(s) firmadas. La restricción es un regalo porque obliga a ' +
      'construir solo lo esencial y a cobrar temprano, y ese camino existe también acá: precio, retención y ' +
      'boca a boca crecen sin permiso de nadie. Lo que compra el capital levantado es velocidad; lo que ' +
      'cuesta es que el negocio ahora tiene que devolver cien veces o nada.';
    return 'Mes ' + e.mesPuesto + ' como fundador, cero rondas, y ' + e.empresa + ' sigue viva con $' +
      _k(e.mrr) + ' de ingresos contra $' + _k(Motor.burnMensual(e)) + ' de burn. Sin fondeo las capacidades ' +
      'no se componen, así que estás creciendo por precio, retención y boca a boca — más lento, y sin ceder ' +
      'nada: tu cap table sigue en ' + _pc(e.capTable.fund) + '. En la cascada del exit eso es la mitad del ' +
      'resultado. La restricción te obligó a construir solo lo esencial, que es el regalo que el libro ' +
      'promete y que nadie elige a propósito.';
  },

  foundersatwork: function (e) {
    if (!e.esFundador) return 'Todavía no fundaste nada: sos ' + e.rol + ' en una empresa que ya venía ' +
      'construida, con capacidades y producto heredados. El patrón que Livingston encontró entrevistando a ' +
      'los famosos sirve igual desde acá, porque describe cómo se ve por dentro cualquier cosa que todavía ' +
      'no funciona: no es genialidad ni timing, es tolerar la incomodidad de que nada ande sin quedarse ' +
      'quieto ni un mes. La etapa fea es la etapa normal, y las historias que escuchaste venían editadas ' +
      'hacia atrás desde el final feliz.';
    return 'Fundaste ' + e.empresa + ': capacidades bajas, caja propia de $' + _k(e.caja) + ', ' +
      (e.rondas.length ? e.rondas.length + ' ronda(s)' : 'cero rondas') + ' y ' + _pc(e.capTable.fund) +
      ' del cap table. La empresa no viene construida como los puestos de empleado — todo lo que suba ' +
      'de acá lo subís vos. El patrón que Livingston encontró entrevistando a los famosos no es genialidad ' +
      'ni timing: es tolerar la incomodidad de que nada funcione todavía sin quedarse quieto ni un mes. ' +
      'Sirve como calibración: la etapa fea es la etapa normal, y las historias que escuchaste venían ' +
      'editadas hacia atrás desde el final feliz.';
  },

  dunford: function (e) {
    return 'Te compararon de frente con el competidor, con tu marca en ' + _n(e.marca) + ' y ' +
      _n(e.competidor.atencion * 100) + '% de su atención encima. El encuadre de esa comparación era tuyo ' +
      'para elegir y probablemente lo eligió él: cuando la categoría la define el otro, tu mejor feature ' +
      'parece una carencia y tu diferencia parece un hueco. ' + (e.marca < 50 ?
      'Con marca en ' + _n(e.marca) + ' el mercado te lee como una versión peor de lo que ya conoce, así que ' +
      'la paridad de features te hunde más rápido.' :
      'Con marca en ' + _n(e.marca) + ' ya tenés algo de poder sobre el marco: cubrir necesidades distintas ' +
      'te distingue en vez de dejarte corto.') + ' Y acordate contra qué competís de verdad: casi siempre es ' +
      'lo que el cliente usa hoy, no la empresa del mismo rubro.';
  },

  playbigger: function (e) {
    if (e.marca < 60) return 'Tu marca está en ' + _n(e.marca) + ', debajo del punto donde deja de ser ' +
      'cosmética y empieza a bajarte el CAC de ' + e.sector + '. Las empresas legendarias no ganan mercados: ' +
      'los crean, definiendo el problema, su nombre y el criterio con el que se evalúan las soluciones — y ' +
      'quien define el problema en sus términos ya ganó la mitad de la evaluación. Es caro y lento: sube con ' +
      'cobertura, fiabilidad y prensa, y baja rápido con un solo incidente. Tu presupuesto de error está en ' +
      _n(e.presupuestoError) + '.';
    return 'Tu marca pasó de 60 (hoy en ' + _n(e.marca) + ') y a partir de acá deja de ser cosmética: te baja ' +
      'el CAC de ' + e.sector + ' y modera cómo pesa la comparación con el competidor. Empezás a definir con ' +
      'qué vocabulario se habla del problema, que es la mitad de la evaluación antes de que abras la boca. La ' +
      'advertencia estructural del libro: la marca sube despacio con cobertura, fiabilidad y prensa, y baja ' +
      'rápido con un solo incidente — tu presupuesto de error está en ' + _n(e.presupuestoError) + '.';
  },

  helmer: function (e) {
    if (!(Motor.fitMax(e) > 0.6 && e.competidor.atencion < 0.3)) return 'Fit máximo en ' +
      _pc(Motor.fitMax(e)) + ' con ' + _n(e.competidor.atencion * 100) + '% de atención del competidor: hoy ' +
      'no tenés la ventana de contraposicionamiento abierta. Un feature no es una ventaja, es una demora del ' +
      'tamaño de lo que él tarde en copiarlo. Hay siete fuentes de poder y solo siete — escala, red, costos ' +
      'de cambio, marca, recurso acaparado, contraposicionamiento, proceso — y la disciplina del marco está ' +
      'en su estrechez: si no podés nombrar cuál es la tuya y por qué él no puede replicarla sin dañar su ' +
      'propio negocio, no tenés poder, tenés una buena racha.';
    return 'Fit máximo en ' + _pc(Motor.fitMax(e)) + ' con el competidor prestándote apenas ' +
      _n(e.competidor.atencion * 100) + '% de atención: eso ES contraposicionamiento, una de las siete ' +
      'fuentes de poder, y es la única ventana barata del juego. Estás creciendo donde a él le conviene ' +
      'ignorarte. La pregunta de Helmer para cada apuesta grande de tu backlog es única: ¿esto construye una ' +
      'de las siete — escala, red, costos de cambio, marca, recurso, contraposicionamiento, proceso — o solo ' +
      'mejora el producto? Si es lo segundo, es una demora del tamaño de lo que él tarde en copiarla.';
  },

  innovsol: function (e) {
    return 'Enfrentaste la decisión de subir de mercado con el precio en $' + e.precio +
      (e.precioInicio && e.precio !== e.precioInicio ? ' (arrancaste en $' + e.precioInicio + ')' : '') +
      ' y ' + _n(e.competidor.atencion * 100) + '% de atención del competidor. Esa es la decisión entera del ' +
      'libro: subir mejora el MRR por usuario y te acerca a la zona donde el grande sí reacciona; quedarte ' +
      'abajo te devuelve invisibilidad y volumen. La regla de Christensen es de ritmo — subí al que te ' +
      'permita tu producto, no al que te pide el ego — y de memoria: cada escalón que ganás lo dejás vacío ' +
      'detrás, que es por donde entraste vos.';
  },

  paranoid: function (e) {
    if (e.competidor.atencion < 0.6) return 'La atención del competidor está en ' +
      _n(e.competidor.atencion * 100) + '% con fuerza ' + _pc(e.competidor.fuerza) + ': todavía no cruzaste ' +
      'el punto de inflexión. Grove describe cómo se siente desde adentro cuando llega — primero como ' +
      'ruido, después como excepciones que se explican una por una, y solo al final como un patrón — y por ' +
      'eso la paranoia que propone no es un rasgo de carácter sino un mecanismo: alguien tiene que estar ' +
      'mirando el borde, los clientes raros que se van, y tener permiso de decirlo sin quedar como el ' +
      'pesimista de la reunión.';
    return 'La atención del competidor cruzó la mitad (' + _n(e.competidor.atencion * 100) + '%) con su ' +
      'fuerza en ' + _pc(e.competidor.fuerza) + ': desde acá descuenta tu crecimiento todos los meses y la ' +
      'paridad dejó de alcanzar. Esto es un cambio de régimen, no un ajuste — la misma jugada que rendía hace ' +
      'tres meses ahora rinde la mitad, y seguir el plan viejo con más disciplina es la forma más ordenada de ' +
      'perder. Grove diría que las medias tintas son la peor opción disponible: el plan viejo y el nuevo, cada ' +
      'uno por separado, cuestan menos que el promedio de los dos.';
  },

  antifragile: function (e) {
    var burn = Motor.burnMensual(e);
    if (e.mrr <= burn) return e.empresa + ' tiene ingresos de $' + _k(e.mrr) + ' contra $' + _k(burn) +
      ' de burn: hoy sos frágil al desorden, no antifrágil — dependés de que el capital siga existiendo. Lo ' +
      'antifrágil no se logra prediciendo mejor, se logra cambiando la forma de la exposición: costos fijos ' +
      'bajos, muchas apuestas chicas con pérdida acotada, y ninguna que pueda matarte. Tus costos fijos son ' +
      'nómina e infra, y son la variable que decide si el próximo golpe te tumba o te deja el campo libre.';
    return (e.eraId === 'invierno' ? 'Invierno de capital, y ' : '') + e.empresa + ' tiene ingresos ($' +
      _k(e.mrr) + ') por encima del burn ($' + _k(burn) + '). El caos está trabajando para vos y no por mérito de tu ' +
      'predicción: es la forma de tu exposición — costos fijos bajos y nada que dependa de una ronda que hoy ' +
      'no existe. Tus competidores financiados tienen estructuras que necesitan capital que desapareció, y ' +
      'el talento y los clientes que se suelten van a ir a algún lado. La regla que queda: preferí muchas ' +
      'apuestas chicas reversibles a una grande irreversible, sobre todo cuando no sabés qué viene.';
  },

  /* ---------------- PRODUCTO (más) ---------------- */

  empowered: function (e) {
    if (!e.empoderado) return 'Con ' + _equipo(e) + ' personas construyendo y moral en ' + _n(e.moral) +
      ', hoy el techo de la organización sos vos: nada puede ser mejor que lo que alcances a pensar entre ' +
      'reuniones. Empoderar al equipo sube el rendimiento por persona de forma permanente y te saca del ' +
      'medio — el contexto y los problemas bajan, las soluciones y la evidencia suben. La condición que casi ' +
      'nadie cumple es de personal: empoderar a un equipo que no está listo no es generosidad, es abandono.';
    return 'Empoderaste al equipo de ' + e.empresa + ': el rendimiento por persona subió de forma permanente ' +
      'y perdiste parte del control del cómo. Con moral en ' + _n(e.moral) + ' ese bono ' +
      (e.moral >= 70 ? 'está trabajando a pleno — se multiplica con la moral.' :
        'está a media máquina: el bono se multiplica con la moral, y la tenés en ' + _n(e.moral) + '.') +
      ' Lo que cambió de verdad es que ya no sos el techo de la organización: el contexto y los problemas ' +
      'bajan, las soluciones y la evidencia suben. Es el único cambio del juego que sube el techo en vez de ' +
      'moverte adentro del que ya tenías.';
  },

  shapeup: function (e) {
    var n = _wip(e), perd = Math.max(0, Math.min(50, 15 * (n - 2)));
    var cierre = 'La pregunta de Singer no es cuánto tarda cada cosa, es cuánto vale la pena gastar: fijá el ' +
      'apetito, y si no cabe recortá alcance, nunca fecha. Tenés ' + e.slots + ' slot(s) de obra abierta.';
    if (n > 2) return 'Tenés ' + n + ' apuestas en vuelo y el cambio de contexto se está comiendo ~' + perd +
      '% de tu capacidad: pagás ' + n + ' frentes y trabajan ' + (Math.round(n * (1 - perd / 100) * 10) / 10) +
      '. Y como el impacto solo se cobra al entregar, ' + n + ' cosas a medias valen cero — con dos habrías ' +
      'entregado dos. ' + cierre;
    if (n === 0) return 'No tenés nada en vuelo, así que arrancás el mes con la capacidad entera y sin ' +
      'impuesto de contexto. Es el momento en que se decide el problema: cada frente que abras arriba de dos ' +
      'te va a cobrar ~15% de capacidad, así que elegí pocos y grandes. ' + cierre;
    return 'Tenés ' + n + ' apuesta(s) en vuelo, debajo del umbral donde el cambio de contexto empieza a ' +
      'cobrar: tu capacidad rinde completa. Abrir un tercer frente cuesta ~15% de todo lo demás, y como el ' +
      'impacto solo se cobra al entregar, tres cosas a medias valen menos que dos terminadas. ' + cierre;
  },

  sprintk: function (e) {
    var g = e.gastoPropio || {};
    if (!(g.desc >= 8)) return 'Este mes le pusiste ' + _n(g.desc || 0) + ' punto(s) a descubrir, con ' +
      'evidencia en ' + _n(e.evidencia) + '. Un sprint concentrado — casi la mitad del mes en discovery — no ' +
      'entrega nada y baja el sesgo de todas las estimaciones que veas después: cuesta un mes y salva los ' +
      'tres siguientes, porque cambia QUÉ vas a construir. Lo que lo hace funcionar no es la velocidad, es ' +
      'la estructura de la decisión: varias soluciones en paralelo contra el mismo problema, bocetadas en ' +
      'silencio antes de discutir, con un decisor al final.';
    return 'Pusiste ' + _n(g.desc || 0) + ' puntos en descubrir este mes, casi la mitad de lo tuyo: eso es un ' +
      'sprint de verdad, y no entregó nada. Lo que compró es información — la evidencia subió a ' +
      _n(e.evidencia) + ' y el sesgo de todas las estimaciones que veas ahora bajó. Es la jugada que cuesta ' +
      'un mes y salva los tres siguientes, porque cambia QUÉ vas a construir en vez de cuánto. Lo que hace ' +
      'que funcione no es la velocidad: es la estructura de la decisión — varias soluciones en paralelo, ' +
      'comparadas contra el mismo problema, con un decisor al final.';
  },

  storymap: function (e) {
    var cob = e.cobertura || {}, altas = 0, bajas = 0, k2;
    for (k2 in cob) if (cob.hasOwnProperty(k2)) { if (cob[k2] >= 60) altas++; else if (cob[k2] < 25) bajas++; }
    if (!(e.apuestasCompletadas > 0)) return 'Todavía no lanzaste nada, y ' + bajas + ' necesidad(es) del ' +
      'mapa están casi en cero: es el momento exacto para mirar el recorrido antes que la lista. Un backlog ' +
      'plano miente — esconde el camino del usuario detrás de una pila ordenada por prioridad, y en esa ' +
      'forma es imposible ver si lo que vas a lanzar sirve como conjunto. La alternativa por defecto es ' +
      'terminar el primer paso perfecto y el último inexistente, o sea el producto 80% hecho que no sirve ' +
      'para nada, porque un recorrido roto en un solo punto está roto entero. Y acá tiene consecuencia: la ' +
      'compuerta "' + e.gateNombre + '" pide varias necesidades a la vez con umbrales concretos.';
    return 'Llevás ' + (e.apuestasCompletadas || 0) + ' apuesta(s) lanzada(s), con ' + altas + ' necesidad(es) ' +
      'del mapa bien cubiertas y ' + bajas + ' casi en cero. La pregunta de Patton es si eso forma un ' +
      'recorrido completo o cinco piezas sueltas, y en tu partida tiene respuesta dura: los segmentos exigen ' +
      'combinaciones, y la compuerta "' + e.gateNombre + '" pide varias a la vez con umbrales concretos. ' +
      (bajas ? 'Un recorrido roto en un solo punto está roto entero: con ' + bajas + ' necesidades en cero, ' +
        'perfeccionar las que ya andan no mueve a nadie.' :
        'No hay huecos evidentes: ahí es cuando conviene profundizar en vez de ensanchar.');
  },

  jtbd: function (e) {
    var cob = e.cobertura || {}, sat = null, k2;
    for (k2 in cob) if (cob.hasOwnProperty(k2) && cob[k2] >= 80) { sat = k2; break; }
    var nec = null, i;
    if (sat) for (i = 0; i < NECESIDADES.length; i++) if (NECESIDADES[i].id === sat) nec = NECESIDADES[i];
    if (!sat) return 'Ninguna necesidad de tu mapa pasa de 80 todavía, así que no hay ningún trabajo que ' +
      'estés haciendo completo. Nadie quiere tu producto: la gente contrata cosas para hacer un trabajo que ' +
      'apareció en su vida, y el trabajo tiene tres capas — funcional, social y emocional — donde las dos ' +
      'últimas explican la mayoría de las compras que la demografía no predice. Con fit máximo en ' +
      _pc(Motor.fitMax(e)) + ', la pregunta no es qué feature falta: es qué trabajo estás haciendo a medias. ' +
      'Y acordate de quién es el competidor real: casi nunca es la empresa del mismo rubro, es no hacer nada.';
    return 'Saturaste ' + (nec ? '"' + nec.nombre + '"' : 'una necesidad entera') + ' del mapa (arriba de 80): ' +
      'ese trabajo ahora te contrata a vos. Y ahí empieza el retorno decreciente — pasado ese umbral, cada ' +
      'punto extra en la misma necesidad casi no mueve el fit, porque el trabajo ya está hecho. El motor ' +
      'premia cubrir el trabajo COMPLETO de un segmento antes que perfeccionar la parte que ya funcionaba. Y ' +
      'acordate de quién es el competidor real del trabajo: casi nunca es la empresa del mismo rubro, es no ' +
      'hacer nada.';
  },

  norman: function (e) {
    if (e.usabilidad < 70) return 'Usabilidad en ' + _n(e.usabilidad) + ': tu producto todavía no se explica ' +
      'solo, y eso se paga en la activación de todo el tráfico que traés. Cuando alguien usa mal tu ' +
      'producto, el error es tuyo — si hay que poner un cartel que diga empujar, la puerta está mal ' +
      'diseñada. Cuando el soporte reporte que los usuarios no entienden, la reacción por defecto va a ser ' +
      'capacitar o agregar un tour: las dos trasladan el costo al usuario. El manual es una confesión de ' +
      'fracaso, y arreglar el diseño es más barato que explicarlo para siempre.';
    return 'Usabilidad en ' + _n(e.usabilidad) + ': tu producto empezó a explicarse solo, y eso se ve en la ' +
      'activación de todo el tráfico que traés, no en una métrica aparte. Lo que Norman agrega desde acá es ' +
      'la parte defensiva: cada feature nueva suma superficie, y la superficie sin diseño baja este número — ' +
      'por eso construir puede empeorarte la conversión. Cuando el soporte reporte que los usuarios no ' +
      'entienden, la reacción por defecto va a ser capacitar o agregar un tour: las dos trasladan el costo al ' +
      'usuario. Arreglar el diseño es más barato que explicarlo para siempre.';
  },

  okrdoerr: function (e) {
    var m = mandatoPorId(e.mandatoId), rit = Motor.ritmoMandato(e);
    return 'Tu objetivo del puesto es uno: ' + (m ? m.txt.toLowerCase() : 'el mandato que firmaste') +
      ', hoy al ' + _pc(rit.prog) + ' con foco en ' + _n(e.foco) + '. Un objetivo claro le gana a nueve ' +
      'consensuados, y el motor lo hace literal: la alineación entre tu plan y el mandato multiplica el ' +
      'progreso del mes, así que repartir parejo entre las cinco palancas avanza en todo y no cumple nada. ' +
      'La condición que casi todas las empresas rompen es la última de Doerr: si el objetivo define tu ' +
      'compensación, todos ponen metas que ya saben que pueden cumplir — y el sistema pasa a medir habilidad ' +
      'para negociar metas.';
  },

  workingback: function (e) {
    var m = mandatoPorId(e.mandatoId);
    return 'Mes ' + e.mesPuesto + ' y estás gestionando por resultados, no por fechas: el motor califica ' +
      (m ? m.txt.toLowerCase() : 'tu mandato') + ' y no la cantidad de entregas, así que un mes sin lanzar ' +
      'nada que mueva la métrica vale más que cuatro entregas que no la tocan. El mecanismo de Amazon para ' +
      'llegar ahí es el comunicado de prensa antes del plan: escribir el resultado primero obliga a definir ' +
      'para quién es, qué cambia en su vida y cómo se mide — las tres cosas que un roadmap con fechas te ' +
      'deja dejar convenientemente vagas.';
  },

  rumelt: function (e) {
    var m = mandatoPorId(e.mandatoId);
    return 'Foco en ' + _n(e.foco) + (e.foco >= 75 ? ': se nota cuando hay estrategia de verdad.' :
      ': repartido, que es el síntoma de que el diagnóstico todavía no está hecho.') + ' ' +
      'Las tres partes de Rumelt ' +
      'traducidas a tu puesto — el diagnóstico es qué te está frenando realmente (hoy: ' +
      (Motor.compuerta(e, 'pragm') < 1 ? 'la compuerta "' + e.gateNombre + '" cerrada' :
       e.deuda > 40 ? 'la deuda en ' + _n(e.deuda) :
       Motor.fitMax(e) < 0.6 ? 'el fit en ' + _pc(Motor.fitMax(e)) : 'nada evidente, y eso también es un dato') +
      '), la política que guía es a qué le decís no, y las acciones coherentes son que las cinco palancas ' +
      'empujen en la misma dirección. Lo que Rumelt llama mala estrategia es exactamente lo otro: declarar ' +
      'la meta y llamarlo plan.';
  },

  leanux: function (e) {
    return 'Viste usuarios atorarse en tu embudo, con usabilidad en ' + _n(e.usabilidad) + ' y activación ' +
      'conviertiendo al ' + _n(35 + e.usabilidad * 0.65) + '% de lo posible. Cada arreglo desde acá es una ' +
      'hipótesis con resultado esperado, no un entregable: no suma usuarios nuevos, mejora la conversión de ' +
      'todos los que ya estabas pagando por traer — y ese efecto se compone con cada mes de crecimiento. Lo ' +
      'que cambia la dinámica de verdad es mirar al usuario con el equipo entero al mismo tiempo: la ' +
      'discusión sobre si vale la pena arreglarlo se termina en treinta segundos y sin argumentos de ' +
      'autoridad.';
  },

  justenough: function (e) {
    if (!(e.calidadDesc >= 1 && e.evidencia >= 50)) return 'Calidad de discovery en ' + _pc(e.calidadDesc) +
      ' y evidencia en ' + _n(e.evidencia) + ': son dos variables distintas y las dos deforman la misma ' +
      'estimación — la calidad define el sesgo, hacia dónde te miente, y la evidencia define el ruido, ' +
      'cuánto. No necesitás un departamento de investigación: necesitás preguntar bien y la humildad de ' +
      'escuchar la respuesta cuando no es la que esperabas. Y la pregunta que Hall pone antes de cualquier ' +
      'estudio es la única que importa: qué decisión está esperando este dato. Si la respuesta es "ninguna, ' +
      'es para entender mejor", no lo hagas.';
    return 'Calidad de discovery en ' + _pc(e.calidadDesc) + ' y evidencia en ' + _n(e.evidencia) +
      ': estás entrevistando bien y se ve. Son dos variables distintas y las dos deforman la misma ' +
      'estimación — la calidad define el sesgo (hacia dónde te miente) y la evidencia define el ruido ' +
      '(cuánto). Con calidad alta y evidencia media ya decidís razonablemente bien: el motor no te exige ' +
      'certeza, te exige honestidad. Suficiente SÍ es la meta, y la pregunta que Hall pone antes de cualquier ' +
      'estudio sigue siendo la única que importa: qué decisión está esperando este dato.';
  },

  outcomes: function (e) {
    var h = e.historialImpacto || [], ult = h.length ? h[0] : null;
    return 'Rechazaste el roadmap de fechas, así que ahora medís comportamientos. En tu partida eso es ' +
      'literal: cada apuesta tiene un vector de impacto en adquisición, activación, retención, ingresos y ' +
      'fiabilidad, y algunas mueven una en positivo y otra en negativo — la superficie nueva cuesta ' +
      'fiabilidad. ' + (ult ? 'Tu última entrega, "' + ult.n + '", rindió ' + ult.real + ' contra ' +
        ult.esperado + ' esperado: ese saldo es el resultado real, no el hecho de haberla lanzado.' :
        'Ese saldo neto es el resultado; el lanzamiento es solo el momento en que se cobra.') +
      ' Y la mayoría de las apuestas no logra mover nada, lo cual está bien si lo sabés y es catastrófico si ' +
      'no.';
  },

  alchemy: function (e) {
    if (e.marca < 70) return 'Marca en ' + _n(e.marca) + ': en el motor eso mueve el CAC de ' + e.sector +
      ', la disposición a pagar sobre tus $' + e.precio + ' y cuánto pesa la comparación con el competidor. ' +
      'Es la única variable del juego que mejora los números sin tocar el producto, y por eso es la más ' +
      'fácil de despreciar en una reunión de ingeniería. Los humanos no compran lo óptimo: compran ' +
      'significado, señales y contexto. La percepción de valor es una palanca de diseño legítima — la parte ' +
      'de la experiencia que ocurre en la cabeza del usuario también se diseña.';
    return 'Marca en ' + _n(e.marca) + ': la gente ya no compra tu producto, compra su historia. En el motor ' +
      'eso no es poesía — la marca mueve el CAC de ' + e.sector + ', la disposición a pagar sobre tu precio ' +
      'de $' + e.precio + ', y cuánto pesa la comparación con el competidor. Es la única variable del juego ' +
      'que mejora los números sin tocar el producto, y por eso es la más fácil de despreciar en una reunión ' +
      'de ingeniería. Sutherland diría que la percepción de valor es una palanca de diseño legítima: la ' +
      'parte de la experiencia que ocurre en la cabeza del usuario también se diseña.';
  },

  badass: function (e) {
    if (Motor.retencionMedia(e) <= 0.93) return 'Retención media en ' + _pc(Motor.retencionMedia(e)) +
      ': el bucle compuesto del motor — retención alimenta boca a boca, el boca a boca baja el CAC y ' +
      'alimenta la adquisición del mes siguiente — todavía está a media máquina. Es el único crecimiento que ' +
      'no se apaga cuando dejás de pagarlo. La lectura de Sierra sobre cómo se enciende: nadie recomienda un ' +
      'producto, la gente se recomienda a sí misma siendo mejor en algo. Si tus usuarios no mejoran con el ' +
      'uso, ninguna campaña produce recomendación sostenida.';
    return 'Retención media en ' + _pc(Motor.retencionMedia(e)) + ': tus usuarios están ganando con vos, y ' +
      'eso enciende el único bucle compuesto del motor — retención alta alimenta boca a boca, el boca a boca ' +
      'baja el CAC y alimenta la adquisición del mes siguiente, gratis. Es el único crecimiento que no se ' +
      'apaga cuando dejás de pagarlo. La lectura de Sierra sobre por qué pasa: nadie recomienda un producto, ' +
      'la gente se recomienda a sí misma siendo mejor en algo. Si tus usuarios no mejoran con el uso, ' +
      'ninguna campaña produce recomendación sostenida.';
  },

  coldstart: function (e) {
    var mix = Motor.mixSegmentos(e);
    var conc = mix && mix.length ? _pc(mix[0].pct) : null;
    return 'Tu sector tiene coeficiente viral ' + e.viral + ' y ya tenés ' + _mil(Motor.usuarios(e)) +
      ' usuarios: el arranque en frío es tu problema, porque el viral multiplica una base y sobre poca base ' +
      'rinde poco. ' + (conc ? 'Hoy el ' + conc + ' de tus usuarios está en ' + mix[0].seg.nombre + '. ' : '') +
      (mix && mix.length > 2 ? 'Estás repartido entre varios segmentos, y eso deja el bucle apagado en todos: ' +
        'saturá una red chica hasta que tenga vida propia antes de abrir la siguiente.' :
        'Esa concentración es correcta: la red atómica es el grupo más chico que se sostiene solo, y ganar ' +
        'mil redes chicas en fila le gana a perseguir una grande.');
  },

  olsen: function (e) {
    return 'Tu fit con visionarios pasó de 0,6 (hoy ' + _pc(Motor.fit(e, 'visio')) + '), y con pragmáticos ' +
      'está en ' + _pc(Motor.fit(e, 'pragm')) + ': la pirámide tiene base en un segmento y no en el otro. Eso ' +
      'es la tesis de Olsen medida — el fit no existe en general, existe con alguien, porque cada segmento ' +
      'pesa las necesidades distinto. Y sirve para localizar el problema cuando algo no funciona: si la ' +
      'retención es mala, la pregunta no es qué feature falta, es en qué capa se rompió la cadena. Arreglar ' +
      'la capa equivocada es lo que hace que un equipo trabaje un año sin mover nada.';
  },

  thinkingbets: function (e, c) {
    var h = e.historialImpacto || [], buenas = 0, i, cal = _calib(e, c);
    for (i = 0; i < h.length; i++) if (h[i].real >= h[i].esperado * 0.8) buenas++;
    if (cal) return 'Tus llamadas van ' + cal.ok + ' de ' + cal.n + ' (' + cal.pct + '%), con evidencia en ' +
      _n(e.evidencia) + '. Ese marcador es lo único del juego que califica tu CRITERIO y no tu resultado, y ' +
      'por eso es el más incómodo: una decisión correcta puede salir mal y una mala puede salir bien. Duke ' +
      'llama resulting a juzgar por cómo salió, y es el error más caro de cualquier organización, porque ' +
      'premia la suerte y castiga el buen criterio con mala fortuna. ' +
      (cal.pct >= 60 ? 'Con ' + cal.pct + '% estás leyendo bien el ruido: sabés cuándo el número del backlog ' +
        'te está mintiendo.' : 'Con ' + cal.pct + '% todavía le crees demasiado a la estimación — y con ' +
        'evidencia en ' + _n(e.evidencia) + ', esa estimación no se lo ha ganado.');
    return (e.sectorId === 'apuestas' ? 'Trabajás en la industria de las apuestas, donde la suerte es el ' +
      'producto — y el motor te la aplica igual: ' : 'El motor te aplica la suerte de frente: ') +
      'varias opciones muestran su probabilidad antes de elegir y tiran los dados una sola vez. ' + (h.length ? 'De tus últimas ' + h.length + ' entregas, ' + buenas + ' rindieron cerca de lo ' +
        'esperado, con evidencia en ' + _n(e.evidencia) + '.' : 'Con evidencia en ' + _n(e.evidencia) + '.') +
      ' Ahí está el punto de Duke: la rama mala de una decisión correcta existe, y juzgar por resultado ' +
      'premia la suerte y castiga el buen criterio con mala fortuna. El historial de esperado contra real es ' +
      'lo único que distingue las dos cosas.';
  },

  /* ---------------- GROWTH Y VENTAS ---------------- */

  traction: function (e) {
    var g = e.gastoPropio || {}, f = Motor.fitMax(e);
    return 'Pusiste ' + _n(g.crec || 0) + ' punto(s) en crecer, con CAC de sector en ' + e.cac + ', marca ' +
      _n(e.marca) + ' y usabilidad ' + _n(e.usabilidad) + ' moderando la conversión. ' +
      (f < 0.55 ? 'Con fit máximo en ' + _pc(f) + ' ese gasto compra usuarios que se van: es el gasto más ' +
        'fácil de justificar en una reunión y el más fácil de tirar a la basura.' :
        'Con fit en ' + _pc(f) + ' el gasto rinde: ahí sí conviene probar canales.') +
      ' La observación de Weinberg que más duele: el canal que te va a funcionar probablemente no es el que ' +
      'te gusta, así que la intuición del equipo sobre cuál probar primero no vale nada — se encuentra con ' +
      'pruebas chicas cuyo objetivo es saber, no crecer.';
  },

  hackingg: function (e) {
    return 'Tenés ' + e.gtm + ' personas en go-to-market, que convierten puntos en alcance con más ' +
      'eficiencia que tu gasto directo — pero multiplican sobre la conversión que ya tenés: activación ' +
      'limitada por usabilidad ' + _n(e.usabilidad) + ' y retención en ' + _pc(Motor.retencionMedia(e)) + '. ' +
      (e.usabilidad < 60 || Motor.retencionMedia(e) < 0.85 ?
        'Con esos números, más gente de GTM es más presupuesto entrando a la misma cañería agujereada. El ' +
        'prerrequisito de Ellis es el producto imprescindible, y todavía no lo tenés.' :
        'La cañería aguanta, así que el proceso semanal — analizar, idear, priorizar, probar — rinde. Y las ' +
        'palancas grandes no están en la punta del embudo: están en activación y retención, que son ' +
        'territorio tuyo.');
  },

  influence: function (e) {
    if (!(e.hechas && e.hechas.casos)) return 'Marca en ' + _n(e.marca) + ' y evidencia en ' +
      _n(e.evidencia) + ', con la compuerta "' + e.gateNombre + '" al ' + _pc(Motor.compuerta(e, 'pragm')) +
      '. Publicar casos de éxito sube las dos variables a la vez y destraba parte de esos requisitos: es la ' +
      'jugada de crecimiento que no compra usuarios, baja la desconfianza del que todavía no te compró. En ' +
      'una compra B2B la prueba social es la palanca que más pesa por una razón específica: el que firma no ' +
      'está evaluando tu producto, está evaluando el riesgo de haberse equivocado frente a su jefe.';
    return 'Publicaste casos de éxito: subiste marca (hoy ' + _n(e.marca) + ') y evidencia (' +
      _n(e.evidencia) + ') a la vez, y destrabaste parte de los requisitos de "' + e.gateNombre + '". Eso es ' +
      'prueba social vendiendo por vos, y en una compra B2B es la palanca que más pesa por una razón ' +
      'específica: el que firma no está evaluando tu producto, está evaluando el riesgo de haberse equivocado ' +
      'frente a su jefe — y un caso de una empresa parecida a la suya resuelve ese problema mejor que ' +
      'cualquier demo. La advertencia de Cialdini es la de siempre: conocerlos es marketing, abusarlos es el ' +
      'camino corto a que nunca te vuelvan a creer, y tu Lupa está en ' + _n(e.lupa) + '.';
  },

  positioning: function (e) {
    var falta = _gateFalta(e);
    return 'Elegiste cabeza de playa, y en tu partida eso significa algo concreto: a qué segmento le vas a ' +
      'cumplir los requisitos primero. La compuerta "' + e.gateNombre + '" convierte hoy al ' +
      _pc(Motor.compuerta(e, 'pragm')) + ' de lo normal' + (falta ? ' y lo que más te falta es "' + falta +
      '"' : '') + ', y no se abre a medias. Repartir el esfuerzo entre dos frentes deja las dos compuertas ' +
      'cerradas: ser el número uno de algo chico le gana a ser el número cuatro de algo grande, y la ' +
      'aritmética de la atención es la razón — en la cabeza del cliente caben dos o tres marcas por ' +
      'categoría, no diez.';
  },

  challenger: function (e) {
    return 'Negociaste con un cliente grande, con fiabilidad percibida en ' + _n(e.fiabPercibida) +
      ' y la compuerta "' + e.gateNombre + '" al ' + _pc(Motor.compuerta(e, 'pragm')) + '. Su requisito no se ' +
      'negocia con precio: pide cobertura específica y confiabilidad antes de firmar. Lo que sí se negocia es ' +
      'cuánto de tu mes se va a construir para uno solo — y si eso te acerca o te desvía de la compuerta del ' +
      'mercado. La lección de ventas es la que sirve del otro lado de la mesa: la simpatía empata el partido, ' +
      'la perspectiva vende, y esa perspectiva la construye quien hizo el discovery.';
  },

  predictable: function (e) {
    var burn = Motor.burnMensual(e);
    if (e.mrr <= burn) return 'Tus ingresos ($' + _k(e.mrr) + ') todavía no cubren el burn ($' + _k(burn) +
      '), así que seguís comprando tiempo con rondas y no con ingresos. La receta de Ross para que los ' +
      'ingresos dejen de depender de milagros es especializar el embudo: el que prospecta no cierra, el que ' +
      'cierra no hace onboarding. Con cada etapa dueña de su métrica, contratar deja de ser un acto de fe y ' +
      'pasa a ser aritmética. La advertencia es la de siempre: la máquina se construye después de saber que ' +
      'alguien compra, no antes — y tu retención está en ' + _pc(Motor.retencionMedia(e)) + '.';
    return 'Tus ingresos ($' + _k(e.mrr) + ') ya cubren el burn ($' + _k(burn) + '), así que ' +
      'el juego cambió de moneda: dejás de comprar tiempo con rondas y empezás a comprarlo con ingresos. ' +
      'Sostenerlo depende del churn, que el motor calcula sobre la retención por segmento — hoy ' +
      _pc(Motor.retencionMedia(e)) + ' de promedio — y no sobre el total que te gusta mirar. La receta de ' +
      'Ross para que deje de depender de milagros es especializar el embudo: cada etapa con su dueño, su ' +
      'métrica y su tasa. Ahí contratar deja de ser un acto de fe y pasa a ser aritmética.';
  },

  contagious: function (e) {
    return 'Con viral ' + e.viral + ' y ' + _mil(Motor.usuarios(e)) + ' usuarios, tu producto se riega solo: ' +
      'el boca a boca entra como adquisición gratis todos los meses, y es el único canal cuyo costo no sube ' +
      'cuando crecés. Por eso vale más arreglar retención (hoy ' + _pc(Motor.retencionMedia(e)) + ') que ' +
      'comprar alcance. La pregunta de diseño de Berger no es si tu producto es compartible, es qué dice de ' +
      'alguien que lo comparte — la gente comparte lo que la hace ver bien. Y lo segundo más útil: si el uso ' +
      'no se ve, no se imita.';
  },

  pricing: function (e) {
    return 'Tu precio hoy es $' + e.precio + '/mes' + (e.precio !== e.precioInicio ? ' (empezaste en $' +
      e.precioInicio + ')' : '') + ', con ' + _mil(Motor.usuarios(e)) + ' usuarios y ' + _run(e) + '. Es la ' +
      'palanca más rápida del juego — mueve la caja el mismo mes — y la única que puede arreglar el runway ' +
      'sin construir nada, a costa de frenar la adquisición y subir la atención del competidor (hoy ' +
      _n(e.competidor.atencion * 100) + '%). La pregunta del libro es la incómoda: ¿lo decidió una ' +
      'investigación de disposición a pagar, o es un sobrante del pitch original apretado por la caja? El ' +
      'precio no es un número, es diseño de producto.';
  },

  foundingsales: function (e) {
    if (!e.esFundador) return 'Sos ' + e.rol + ' con mando ' + _pc(e.mando) + ', así que entre el que habla ' +
      'con el cliente y el que decide qué se construye hay una traducción — y en esa traducción se pierde ' +
      'casi todo. Las primeras cien conversaciones de venta SON el discovery: ahí se descubre con qué ' +
      'palabras el cliente nombra el problema, qué objeción aparece siempre, y cuánto está dispuesto a pagar ' +
      'antes de pedir descuento. Sentarse en esas llamadas, aunque no te toque, es el atajo más grande ' +
      'disponible desde tu asiento.';
    return 'Sos fundador con $' + _k(e.mrr) + ' de ingresos, mando total y tus puntos son los de la empresa: ' +
      'lo que hagas vos pesa más que en cualquier otro rol del escalafón. Las mismas horas en descubrir ' +
      'rinden doble, porque no hay traducción entre el que habla con el cliente y el que decide qué se ' +
      'construye. Por eso Kazanjy dice que las primeras cien conversaciones de venta SON el discovery: ahí se ' +
      'descubre con qué palabras el cliente nombra el problema, qué objeción aparece siempre, y cuánto está ' +
      'dispuesto a pagar antes de pedir descuento. Contratar ventas antes de poder escribir ese guion es ' +
      'tirar el aprendizaje más caro que existe.';
  },

  purplecow: function (e) {
    if (e.marca < 50) return 'Tu marca está en ' + _n(e.marca) + ': todavía nada de lo que hacés cuenta su ' +
      'propia historia, así que cada usuario lo pagás al CAC completo de ' + e.sector + '. La publicidad ' +
      'murió de promedio — la gente ignora lo bueno y solo habla de lo notable — y en un mercado saturado el ' +
      'riesgo grande no es hacer algo raro, es hacer algo correcto que nadie note. La remarcabilidad se ' +
      'decide en el producto, donde el usuario la encuentra, no en el mensaje que lo rodea. Si necesitás ' +
      'gritar para que se note, el problema no es el volumen: es la vaca.';
    return 'Tu marca cruzó 50 (hoy ' + _n(e.marca) + '): algo que hacés ya cuenta su propia historia, y eso ' +
      'es lo que hace que la adquisición no cueste lo mismo todos los meses — baja el CAC de ' + e.sector +
      ' y sube la disposición a pagar sobre tus $' + e.precio + '. Sube con cobertura, fiabilidad y prensa, y ' +
      'un solo incidente grande le pega más que tres meses de buenas noticias: tu presupuesto de error está ' +
      'en ' + _n(e.presupuestoError) + '. La parte que Godin pone en el producto y no en la campaña: si ' +
      'necesitás gritar para que se note, el problema no es el volumen, es la vaca.';
  },

  /* ---------------- CAPITAL ---------------- */

  sandhill: function (e) {
    return 'Llevás ' + e.rondas.length + ' rondas y $' + _k(e.capFondeo || 0) + ' de capital de fondeo ' +
      'trabajando, con tu porcentaje en ' + _pc(e.capTable.fund) + '. Ya conocés la mesa; ahora conocé sus ' +
      'incentivos: el VC no busca buenas empresas, busca las poquísimas que devuelven el fondo entero, y en ' +
      'esa mesa tu empresa no compite contra tu mercado sino contra su portafolio. Entendida esa matemática, ' +
      'cada consejo raro cobra sentido — por qué te empujan a crecer más rápido de lo que te conviene, y por ' +
      'qué prefieren un fracaso rápido a un negocio sano y chico. No es traición: es su función objetivo, y ' +
      'no es la tuya.';
  },

  wasserman: function (e) {
    return e.esFundador ? 'Tenés el ' + _pc(e.capTable.fund) + ' de ' + e.empresa + ' después de ' +
      e.rondas.length + ' ronda(s), con ' + (e.preferencias || []).length + ' preferencia(s) firmadas por ' +
      'delante en la cascada. Cada decisión de acá en adelante te va a pedir elegir entre control y valor: ' +
      'quedarte con el mando significa levantar menos y crecer más despacio; buscar el valor máximo significa ' +
      'diluirte y aceptar un directorio con poder real. Rico o rey, casi nunca ambos — y el hallazgo más útil ' +
      'del estudio es sobre no elegir: el que trata de tener las dos cosas suele terminar sin ninguna.' :
      'Como ' + e.rol + ' tu dilema es el espejo del de un fundador: autoridad hoy contra equity que hace ' +
      'vesting mañana. Tu mando es ' + _pc(e.mando) + ' y tu nivel te da estas palancas: ' +
      (e.palancas || []).join(', ') + '. Elegilo consciente en la próxima oferta — el sueldo se cobra ' +
      'mensual, el equity solo si te quedás.';
  },

  powerlaw: function (e, c) {
    var n = c && c.equities ? c.equities.length : 0;
    return 'Juntaste equity en ' + n + ' empresa(s) a lo largo de la carrera. La mayoría va a valer cero y ' +
      'una, quizás, todo: en venture capital no existe el promedio, y tu portafolio funciona igual. Esa ' +
      'única propiedad matemática explica el ecosistema entero alrededor tuyo — por qué te empujan a ' +
      'perseguir un mercado enorme aunque uno mediano estuviera al alcance, y por qué prefieren que mueras ' +
      'rápido a que vivas chico. La lección para tu carrera es la misma: el resultado lo va a definir la ' +
      'mejor posición, no el promedio, así que el trabajo es no perderte esas.';
  },

  psych: function (e) {
    if (!(e.ventaSecundaria > 0)) return 'Tu resultado está todo en papel: ' + _pc(e.capTable.fund) +
      ' de una empresa valuada en $' + _k(e.valoracion) + ', que no paga nada hasta que haya un exit. Housel ' +
      'lo diría así: nadie quiebra por falta de retornos, quiebra por falta de margen de seguridad, y un ' +
      'resultado bueno que no podés esperar a cobrar equivale a ninguno. La plata compra opciones, no ' +
      'cosas. Vender una tajada cuando vas arriba baja tu techo y sube tu piso, y el piso es lo que decide ' +
      'cuántas apuestas más podés hacer.';
    return 'Vendiste parte de tus acciones ($' + _k(e.ventaSecundaria || 0) + '): bajaste tu techo y subiste ' +
      'tu piso, y el piso es lo que decide cuántas apuestas más podés hacer. Esos ahorros son lo único que ' +
      'sobrevive al cierre del puesto y lo que financia tu propia empresa después. Housel lo diría así: nadie ' +
      'quiebra por falta de retornos, quiebra por falta de margen de seguridad, y un resultado bueno que no ' +
      'podés esperar a cobrar equivale a ninguno. Vender una tajada arriba no es falta de fe — es entender ' +
      'que sobrevivir es el prerrequisito de todo lo demás. Vas a jugar mejor sin el miedo a quebrar.';
  },

  voss: function (e) {
    var pref = e.preferencias || [], limpia = false, i;
    for (i = 0; i < pref.length; i++) if ((pref[i].mult || 1) === 1 && !pref[i].part) limpia = true;
    if (!limpia) return 'Llevás ' + pref.length + ' preferencia(s) firmadas en ' + e.empresa +
      ', y ninguna limpia: en la cascada del exit cobran antes que vos y algunas vuelven a cobrar con el ' +
      'resto. El método de Voss para la próxima mesa no es firmeza, es información — escuchar y demostrarlo, ' +
      'etiquetar la emoción que ves para bajarle intensidad, preguntas que empiezan con cómo y obligan al ' +
      'otro a resolver tu problema. El "no" no cierra la conversación, la empieza. El que más entiende de ' +
      'las restricciones del otro controla la negociación.';
    return 'Firmaste términos limpios: preferencia 1x no participativa, o sea que cobra una vez y se aparta. ' +
      'En la cascada del exit eso puede valer más que un 30% extra de valuación, y no se ve en ningún ' +
      'titular. Alguien negoció bien en esa mesa. El método de Voss para llegar ahí no es firmeza, es ' +
      'información: escuchar y demostrarlo, etiquetar la emoción que ves para bajarle intensidad, preguntas ' +
      'que empiezan con cómo y obligan al otro a resolver tu problema. El que más entiende de las ' +
      'restricciones del otro controla la negociación — y eso se consigue preguntando, no argumentando.';
  },

  /* ---------------- GENTE ---------------- */

  radical: function (e) {
    return 'Tu equipo tocó fondo (moral mínima ' + _n(e.moralMin || e.moral) + ') y se recuperó hasta ' +
      _n(e.moral) + '. En el medio hubo conversaciones como las que Scott describe, y el motor las cobra ' +
      'donde importa: la moral es un multiplicador de capacidad, así que perderla cuesta un mes y ' +
      'recuperarla varios. El cuadrante que atrapa a la gente bienintencionada es la empatía ruinosa: te ' +
      'importa mucho la persona y por eso no decís nada, hasta que el problema es indefendible y la ' +
      'conversación que evitaste seis meses se convierte en un despido. Que te importe Y retar de frente no ' +
      'son opuestos que haya que equilibrar: son el mismo acto, y el feedback pierde valor con los días.';
  },

  lencioni: function (e) {
    if (e.moral >= 38) return 'Moral en ' + _n(e.moral) + ': la base aguanta, y el síntoma que la mayoría de ' +
      'los líderes lee al revés es justamente ese — un equipo que nunca discute no es sano, es uno donde ' +
      'decir lo que pensás tiene costo. La armonía permanente es la señal de alarma. El orden de Lencioni no ' +
      'se puede alterar: sin confianza no hay conflicto honesto, sin conflicto no hay compromiso real, y sin ' +
      'compromiso los resultados no son de nadie. Instalar procesos y objetivos sobre una base sin confianza ' +
      'produce cumplimiento formal y cero cambio.';
    return 'La moral está en ' + _n(e.moral) + ', o sea rota: cada punto de capacidad rinde menos y los ' +
      'eventos de gente se multiplican — renuncias, robos de talento, fugas de contexto. Antes de procesos y ' +
      'objetivos, mirá la base de la pirámide: sin confianza no hay conflicto honesto, sin conflicto no hay ' +
      'compromiso real, y sin compromiso los resultados no son de nadie. Instalar rituales sobre una base ' +
      'sin confianza produce cumplimiento formal y cero cambio. En el juego eso es literal: ningún proceso ' +
      'arregla la moral, se recupera con decisiones — y son las que cuestan capital político, hoy en ' +
      _n(e.politico) + '.';
  },

  drive: function (e) {
    if (!(e.empoderado && e.moral >= 75)) return 'Moral en ' + _n(e.moral) +
      (e.empoderado ? ' con el equipo ya empoderado' : ' y el equipo sin empoderar') + ': todavía no estás ' +
      'pagando en la moneda correcta. Los premios y castigos funcionan para tareas mecánicas y destruyen las ' +
      'creativas — el incentivo externo reemplaza la motivación interna en vez de sumarse, y estrecha el ' +
      'campo de visión, que es útil para apurar y fatal para resolver. Las tres cosas que lo mueven de ' +
      'verdad — decidir el cómo, mejorar en algo difícil, y que le importe a alguien — no se compran con un ' +
      'bono, y las tres se destruyen fácil desde arriba.';
    return 'Equipo empoderado con moral en ' + _n(e.moral) + ': estás pagando en la moneda correcta. Las tres ' +
      'cosas que mueven el trabajo de conocimiento — decidir el cómo, mejorar en algo difícil, y que le ' +
      'importe a alguien — no se compran con un bono, y las tres se destruyen fácil desde arriba: basta con ' +
      'decidir el cómo por ellos, cambiar de prioridad cada tres semanas, y no contarles nunca qué pasó con ' +
      'lo que construyeron. En el motor esto rinde mejor que contratar y no tiene rampa: la misma gente ' +
      'entrega más porque decide más.';
  },

  coachb: function (e, c) {
    return 'Sos ' + e.rol + ' con reputación en ' +
      _n(c ? c.reputacion : 50) + ', y eso decide qué ofertas ves y en qué nivel del escalafón entrás. Cada ' +
      'nivel te abre una palanca más del plan — hoy tenés ' + (e.palancas || []).join(', ') + '. Lo que ' +
      'Campbell hacía y casi nadie copia era operativo, no inspiracional: empezar por lo personal, obligar a ' +
      'que los desacuerdos se dijeran en la sala y no en el pasillo, y no decidir antes de que el equipo ' +
      'hubiera hablado — porque una decisión tomada de antemano convierte la discusión en teatro. La parte de ' +
      'las personas no es el costo del trabajo: es el trabajo.';
  },

  managerpath: function (e) {
    return 'Sos ' + e.rol + ' con mando ' + _pc(e.mando) + ': de los ' + _n(Motor.capacidad(e)) + ' puntos que ' +
      'produce el área te responden ' + _n(Motor.capacidad(e) * e.mando) + '. Subir no te dio más puntos ' +
      'propios: te dio más gente que se mueve con tu decisión, y eso es un trabajo distinto con una ' +
      'definición distinta de qué cuenta como un buen día. El error cómodo es seguir haciendo el trabajo ' +
      'viejo con reuniones encima — el buen ejecutor se mete en la ejecución porque ahí sabe que es bueno, y ' +
      'su equipo aprende que las decisiones importantes se las lleva él. La moneda cambió: ahora es la ' +
      'calidad de las decisiones ajenas.';
  },

  norules: function (e) {
    if (!(e.eventosVistos && e.eventosVistos.caza)) return 'Con ' + _equipo(e) + ' personas construyendo y ' +
      'moral en ' + _n(e.moral) + ', la densidad de talento es lo que decide tu velocidad de decisión: los ' +
      'controles existen por los mediocres, y el precio lo paga todo el resto. En el motor perder una ' +
      'persona clave cuesta más que su capacidad — se lleva contexto y le pega a la moral de los que ' +
      'quedan. Las dos mitades de la apuesta de Netflix son inseparables: pagar arriba del mercado y actuar ' +
      'rápido con quien no entrega. Muchas empresas copiaron solo la divertida.';
    return 'Peleaste por quedarte con tu estrella, con moral en ' + _n(e.moral) + ' y capital político en ' +
      _n(e.politico) + '. Así se defiende la densidad de talento, y en el motor esa jugada se paga sola: ' +
      'perder una persona clave cuesta más que su capacidad, porque se lleva contexto y le pega a la moral de ' +
      'los que quedan. La apuesta de Netflix tiene dos mitades inseparables — pagar arriba del mercado y ' +
      'actuar rápido con quien no entrega — y muchas empresas copiaron solo la divertida. La velocidad de ' +
      'decisión de una organización es una función de en quién confiás, y ninguna herramienta de proceso ' +
      'mejora eso.';
  },

  deepwork: function (e) {
    return 'Foco en ' + _n(e.foco) + ' con ' + _wip(e) + ' apuesta(s) en vuelo: ' +
      (e.foco >= 80 ? 'tu equipo hace un trabajo que otros simplemente no pueden, y eso multiplica la ' +
        'capacidad de todos.' : 'el trabajo profundo se está fugando en frentes abiertos, y eso divide la ' +
        'capacidad de todos.') + ' El costo del cambio de contexto ' +
      'no es el minuto de la interrupción: es el residuo de atención que queda en la tarea anterior y degrada ' +
      'la media hora siguiente. Lo que Newport señala para un asiento de gestión es que la concentración de ' +
      'un equipo no depende de la disciplina individual de cada uno: depende de las normas del grupo — ' +
      'cuántos frentes abiertos tolera el sistema. Es la variable de gente más fácil de mover con tus ' +
      'decisiones: no necesita presupuesto, necesita decir no.';
  },

  crucial: function (e) {
    return 'Tu capital político está en ' + _n(e.politico) + ': ' +
      (e.politico < 30 ? 'hay una conversación que le debés a alguien, y el motor te está cobrando no ' +
        'haberla tenido.' : 'tenés margen, que es exactamente cuando conviene tener la conversación difícil ' +
        '— cuesta menos y todavía es sobre un hecho y no sobre un historial.') +
      ' El capital político es lo que te permite defender ' +
      'inversiones que no rinden este mes — plataforma, fiabilidad, deuda (hoy ' + _n(e.deuda) + ') — y con el ' +
      'capital en el piso el juego te niega exactamente las jugadas que más necesitás. Se gasta pidiendo y se ' +
      'recupera cumpliendo. El método: seguridad primero, porque nadie dice nada útil si se siente en riesgo; ' +
      'hechos antes que juicios, porque el hecho se verifica y el juicio solo se defiende.';
  },

  walsh: function (e, c) {
    var n = 0, i;
    if (c && c.puestos) for (i = 0; i < c.puestos.length; i++) if (c.puestos[i].cumplido) n++;
    return n + ' mandatos cumplidos en tu carrera, reputación en ' + _n(c ? c.reputacion : 50) + ': el ' +
      'estándar ya es tuyo. Y eso es lo único que viaja con vos — el puesto se cierra y se olvida, la ' +
      'reputación decide en qué nivel te contratan después y con qué palancas. Walsh no habló nunca de ganar: ' +
      'definió el estándar de cómo se hace todo, con el argumento de que el marcador es un resultado y no una ' +
      'conducta, así que no se puede practicar. Lo que se practica es el cómo, repetido — y repetirlo es un ' +
      'trabajo, no una declaración.';
  },

  /* ---------------- TECNOLOGÍA (más) ---------------- */

  pragmatic: function (e) {
    if (e.deuda > 15) return 'Deuda técnica en ' + _n(e.deuda) + ': tenés ventanas rotas, y el deterioro que ' +
      'describe el libro no es técnico sino social — la siguiente persona que pasa por ese archivo calibra ' +
      'su estándar con lo que encuentra, no con lo que dice la guía de estilo. Una ventana sin arreglar ' +
      'enseña que acá se tolera. Se detiene con arreglos chicos y constantes mientras se pasa por ahí, no ' +
      'con un proyecto de limpieza. Y el corolario: un equipo al que nunca se le permite arreglar la ventana ' +
      'que ve, aprende a no verla — y eso cuesta mucho más que las horas que le negaste.';
    return 'Deuda técnica en ' + _n(e.deuda) + ': sin ventanas rotas en tu edificio, y eso no te da ningún ' +
      'bono visible — te devuelve capacidad completa todos los meses, que es la forma más aburrida y más ' +
      'grande de ganar. El deterioro que el libro describe no es técnico sino social: la siguiente persona ' +
      'que pasa por un archivo calibra su estándar con lo que encuentra, no con lo que dice la guía de ' +
      'estilo. Mantenerlo bajo se hace con arreglos chicos y constantes mientras se pasa por ahí, no con un ' +
      'proyecto de limpieza. Y el corolario para quien prioriza: un equipo al que nunca se le permite ' +
      'arreglar la ventana que ve, aprende a no verla.';
  },

  ousterhout: function (e) {
    if (e.arquitectura < 60) return 'Arquitectura en ' + _n(e.arquitectura) + ' con la carga al ' +
      _n(Motor.carga(e) * 100) + '%: ese número define cuántos usuarios soporta ' + e.empresa + ' antes de ' +
      'que la probabilidad de incidente se dispare. La complejidad se manifiesta en tres síntomas — cambios ' +
      'que se propagan por muchos lugares, carga cognitiva alta para hacer algo simple, y no saber qué hay ' +
      'que tocar — y el arma contra ella son los módulos profundos: interfaz chica, implementación ' +
      'poderosa. La recomendación que más rinde y menos se hace: diseñalo dos veces antes de escribirlo una.';
    return 'Arquitectura en ' + _n(e.arquitectura) + ', con la carga al ' + _n(Motor.carga(e) * 100) +
      '% de lo que aguanta: alguien está pensando antes de teclear. Ese número define cuántos usuarios ' +
      'soporta ' + e.empresa + ' antes de que la probabilidad de incidente se dispare, así que es lo que ' +
      'decide si el crecimiento del mes que viene te sirve o te tumba. El arma de Ousterhout contra la ' +
      'complejidad son los módulos profundos: interfaz chica, implementación poderosa. Y la recomendación ' +
      'que más rinde y menos se hace: diseñalo dos veces antes de escribirlo una, porque la segunda ' +
      'alternativa casi siempre mejora la primera y pensar es barato.';
  },

  phoenix: function (e) {
    if (!e.congelado) return 'Presupuesto de error en ' + _n(e.presupuestoError) + ' y ' +
      (e.incidentesPuesto || 0) + ' incidente(s) en el puesto: la fábrica todavía fluye. El diagnóstico ' +
      'central del libro aplica igual — el trabajo de tecnología fluye como una fábrica, con cuellos de ' +
      'botella donde mejorar cualquier otra cosa no mejora nada, y con trabajo en curso invisible (los ' +
      'pedidos informales, las urgencias, los favores) que es la mayor parte de la carga real. La primera ' +
      'intervención no es técnica: es hacer visible el flujo, porque no se puede gestionar una cola que no ' +
      'se ve.';
    return 'Entraste en congelamiento con el presupuesto de error en ' + _n(e.presupuestoError) +
      ' y ' + (e.incidentesPuesto || 0) + ' incidente(s) en el puesto: construís un cuarto de tu capacidad y ' +
      'el resto se va forzado a fiabilidad. No lo elegiste vos — es el sistema imponiendo la prioridad que ' +
      'venías postergando, y dura hasta el trimestre siguiente. Tu fábrica se atascó en trabajo invisible, ' +
      'que es el diagnóstico central del libro: los pedidos informales, las urgencias y los favores son la ' +
      'mayor parte de la carga real y no están en ningún tablero. La primera intervención no es técnica: es ' +
      'hacer visible el flujo, porque no se puede gestionar una cola que no se ve.';
  },

  contdel: function (e) {
    if (!e.cd) return 'Todavía desplegás por evento, con ' + (e.incidentesPuesto || 0) + ' incidente(s) en ' +
      'el puesto y el presupuesto de error en ' + _n(e.presupuestoError) + '. Un deploy doloroso no se ' +
      'arregla haciéndolo menos: se arregla haciéndolo tan seguido que deja de doler, porque cada ' +
      'repetición fuerza a automatizar el paso que fallaba. Lo que se gana además de velocidad es ' +
      'reversibilidad, y eso cambia qué se anima a probar el equipo. La objeción de que no hay tiempo para ' +
      'automatizar se responde sola: el tiempo ya se está gastando, repartido en incidentes que nadie ' +
      'contabiliza como proyecto.';
    return 'Encendiste el despliegue continuo: baja la probabilidad de incidentes y suma capacidad todos los ' +
      'meses sin volver a pagarlo — la única mejora permanente del lado técnico del juego. Los jueves a la ' +
      'noche vuelven a ser tuyos. Lo que ganaste además de velocidad es reversibilidad: cuando volver atrás ' +
      'cuesta dos minutos, lanzar deja de ser una apuesta y empieza a ser un experimento, y eso cambia qué se ' +
      'anima a probar el equipo. La objeción habitual — no tenemos tiempo para automatizar — se responde ' +
      'sola: el tiempo ya se estaba gastando, repartido en incidentes que nadie contabilizaba como proyecto.';
  },

  releaseit: function (e) {
    if ((e.incidentesPuesto || 0) < 2) return 'Llevás ' + (e.incidentesPuesto || 0) + ' incidente(s) en el ' +
      'puesto, con la carga al ' + _n(Motor.carga(e) * 100) + '% y fiabilidad percibida en ' +
      _n(e.fiabPercibida) + '. El sistema que pasa los tests no es el que sobrevive producción: sobrevive el ' +
      'que asume que todo lo de al lado va a fallar, y en el peor momento. La pregunta de diseño de Nygard ' +
      'no es "¿funciona?" sino "¿qué pasa cuando lo de al lado no funciona?" — timeouts, cortes antes de ' +
      'agotar recursos, aislamiento entre partes. Los puntos en fiabilidad bajan esa probabilidad de forma ' +
      'permanente; los parches después del hecho solo pagan el incidente que ya ocurrió.';
    return (e.incidentesPuesto || 0) + ' incidentes en el mismo puesto, con presupuesto de error en ' +
      _n(e.presupuestoError) + ', fiabilidad percibida en ' + _n(e.fiabPercibida) + ' y la carga al ' +
      _n(Motor.carga(e) * 100) + '%. Tu sistema necesita mamparos, no parches: los puntos en fiabilidad bajan ' +
      'esa probabilidad de forma permanente, mientras un arreglo después del hecho solo paga el incidente que ' +
      'ya ocurrió. La pregunta de diseño de Nygard no es "¿funciona?" sino "¿qué pasa cuando lo de al lado no ' +
      'funciona?" — timeouts en todo, cortes antes de agotar recursos, aislamiento entre partes. Es la ' +
      'diferencia entre diez minutos y seis horas.';
  },

  staffeng: function (e) {
    if (!e.teamTopo) return 'Tenés ' + _equipo(e) + ' personas construyendo contra un umbral de carga ' +
      'cognitiva de ' + (8 + Math.round(e.hab.liderazgo / 12)) + ' sin fronteras definidas. El rol que ' +
      'Larson documenta es el que arregla eso sin ser jefe de nadie: fijar dirección técnica, desbloquear ' +
      'equipos ajenos, decirle no a la arquitectura de moda con argumentos y no con jerarquía. Otro trabajo, ' +
      'otra moneda — contexto y confianza, acumulados en el tiempo. Ahí está el apalancamiento técnico real: ' +
      'cambiar cómo se decide en tres equipos sin autoridad formal sobre ninguno.';
    return 'Organizaste equipos con dueños claros: subiste el umbral desde el que cada persona nueva empieza ' +
      'a rendir menos, hoy en ' + ((e.teamTopo ? 12 : 8) + Math.round(e.hab.liderazgo / 12)) + ' con ' +
      _equipo(e) + ' construyendo. Es un cambio estructural — no suma puntos este mes, cambia la pendiente de ' +
      'todos los meses que vienen. Alguien técnico con influencia y sin autoridad formal estuvo en esa sala, ' +
      'que es exactamente el rol que Larson documenta: fijar dirección, desbloquear equipos ajenos, decirle ' +
      'no a la arquitectura de moda con argumentos y no con jerarquía. Ahí está el apalancamiento técnico ' +
      'real: cambiar cómo se decide en tres equipos sin ser jefe de ninguno.';
  },

  elegant: function (e) {
    if (_equipo(e) < 13) return 'Tenés ' + _equipo(e) + ' personas construyendo: todavía estás en el rango ' +
      'donde gestionar por anécdota funciona. Las reglas de Larson empiezan a pesar más arriba, y conviene ' +
      'conocerlas antes: un equipo con demasiada gente y otro con muy poca producen menos que dos parejos, ' +
      'y agregar gente a un equipo ya endeudado lo empeora. Hay cuatro estados posibles — cayéndose, al ' +
      'día, endeudado, innovando — y cada uno pide una intervención distinta y opuesta. Con deuda en ' +
      _n(e.deuda) + ', el tuyo se lee bastante claro.';
    return 'Tu área pasó de 13 personas (' + _equipo(e) + ' construyendo, ' + e.gtm + ' en go-to-market): ' +
      'bienvenido a los problemas de sistemas. Desde acá cada persona nueva rinde menos que la anterior por ' +
      'carga de coordinación, y la salida es estructural — no está en el plan del mes. Las reglas ' +
      'contraintuitivas de Larson aplican todas: un equipo con demasiada gente y otro con muy poca producen ' +
      'menos que dos parejos, y agregar gente a un equipo endeudado lo empeora. Lo que hay que soltar es ' +
      'gestionar por anécdota: funciona con veinte personas y falla a escala, porque cada anécdota es cierta ' +
      'y ninguna es representativa.';
  },

  /* ---------------- HISTORIAS DE GUERRA ---------------- */

  shoedog: function (e) {
    return _run(e) + ' con $' + _k(e.caja) + ' en caja contra un burn de $' + _k(Motor.burnMensual(e)) +
      ', y seguís operando. Knight vivió ahí diez años mientras Nike explotaba en las calles, y la lección ' +
      'que a nadie le gusta es de tesorería: crecer se come la caja, porque se paga antes de cobrar, así que ' +
      'las empresas que crecen rápido viven más cerca de la muerte que las que crecen lento. En el motor eso ' +
      'es literal — con este runway todo pega más fuerte, las opciones empeoran y el capital político se ' +
      'vuelve caro. Sigue siendo jugable: el puesto se cierra con la caja en cero, no antes.';
  },

  badblood: function (e) {
    return 'Tu Lupa está en ' + _n(e.lupa) + '. Theranos empezó con una mentira de este tamaño para cerrar ' +
      'una ronda — una demo arreglada, un plazo prometido sabiendo que no se cumplía — y llegó al final por ' +
      'el interés compuesto de los atajos. Tu medidor ya está corriendo y no baja solo: pasado cierto nivel ' +
      'abre eventos que ya no podés esquivar, y esos cierran el puesto sin preguntar cómo venía el mandato. ' +
      'Nadie amanece una mañana siendo Elizabeth Holmes: se llega por una escalera de decisiones que en su ' +
      'momento parecían defendibles, y cada peldaño hace más caro bajarse.';
  },

  hatching: function (e) {
    if (!(e.eventosVistos && e.eventosVistos.socio)) return 'Moral en ' + _n(e.moral) + ', capital político ' +
      'en ' + _n(e.politico) + ': la pelea de socios todavía no llegó, y lo que Bilton deja claro sobre ' +
      'Twitter es que en las empresas que valen algo es la regla y no la excepción — porque el valor mismo ' +
      'es lo que la produce. Mientras no hay nada, no hay nada que repartir. Y no la causa la maldad de ' +
      'nadie: la causa no haber hablado del poder a tiempo — quién decide qué, qué pasa si dos no se ponen ' +
      'de acuerdo. Lo que en el año uno se resuelve con un documento, en el año cuatro se resuelve con ' +
      'abogados.';
    return 'Tuviste tu momento con el socio, con moral en ' + _n(e.moral) + ', capital político en ' +
      _n(e.politico) + ' y Lupa en ' + _n(e.lupa) + ': ninguna rama de ese dilema salía gratis, y el motor ' +
      'las recuerda — la decisión de este mes cambia qué opciones te ofrece el que viene. Así empiezan estos ' +
      'libros. Lo que Bilton deja claro sobre Twitter es que la pelea de cofundadores es la regla y no la ' +
      'excepción en las empresas que valen algo, porque el valor mismo es lo que la produce. Y no la causó la ' +
      'maldad de nadie: la causó no haber hablado del poder a tiempo, cuando la conversación era incómoda y ' +
      'parecía innecesaria.';
  },

  chaosm: function (e, c) {
    var desp = false, i;
    if (c && c.puestos) for (i = 0; i < c.puestos.length; i++) if (c.puestos[i].despido) desp = true;
    if (!desp) return 'Todavía no te echaron de ningún lado, y este libro sirve igual como calibración: ' +
      'García Martínez cuenta cuánto del resultado de una carrera es timing y posición y cuánto es mérito, ' +
      'sin fingir que la proporción es cómoda. Aceleradoras que funcionan como casinos, adquisiciones que ' +
      'son despidos con champaña. Lo útil de saberlo antes: en este juego un despido no borra la carrera — ' +
      'el equity vestido se queda en tu portafolio y la reputación se recupera cumpliendo el mandato ' +
      'siguiente. Lo único irreversible es la imputación.';
    return 'Te despidieron una vez y este libro ahora te va a dar risa. Lo que conviene saber es que el ' +
      'despido no borró tu carrera: el equity vestido se quedó en tu portafolio (' +
      (c && c.equities ? c.equities.length : 0) + ' posición(es)) y la reputación bajó pero se recupera ' +
      'cumpliendo el mandato siguiente — hoy estás en ' + _n(c ? c.reputacion : 50) + '. Lo único ' +
      'irreversible del juego es la imputación. García Martínez cuenta cuánto del resultado de una carrera ' +
      'es timing y posición y cuánto es mérito, sin fingir que la proporción es cómoda: sirve para que una ' +
      'salida rara deje de leerse como un juicio personal.';
  },

  superpumped: function (e) {
    if (!(e.eventosVistos && e.eventosVistos.cocinar)) return 'Lupa en ' + _n(e.lupa) + ' y moral en ' +
      _n(e.moral) + ': todavía no cruzaste esa línea, y este libro es sobre el momento en que se traza. La ' +
      'cultura que conquistó cien ciudades era la misma que espiaba reguladores — no eran dos culturas, una ' +
      'para crecer y otra mala. Los rasgos que ganan la guerra son exactamente los que después incendian la ' +
      'casa. Y el orden de los factores importa: la línea se define antes de necesitarla, porque cada atajo ' +
      'que funciona se convierte en política informal y después ya es una concesión.';
    return 'Cocinaste los números bajo presión: Lupa en ' + _n(e.lupa) + ' y moral en ' + _n(e.moral) +
      '. Las dos cosas se quedan, y las dos cobran — la Lupa alta abre eventos irreversibles y la moral baja ' +
      'te resta capacidad todos los meses. El atajo compró un mes y va a cobrar el resto del puesto. ' +
      'Kalanick también empezó "ganando", y la lección incómoda que Isaac documenta es que no eran dos ' +
      'culturas: los rasgos que ganan la guerra son exactamente los que después incendian la casa. El momento ' +
      'de trazar la línea es antes de necesitarla, porque después ya es una concesión.';
  },

  everything: function (e) {
    if ((e.cobertura.escala || 0) < 70) return 'Tu cobertura de escala está en ' + _n(e.cobertura.escala || 0) +
      ' y la carga al ' + _n(Motor.carga(e) * 100) + '% de lo que aguanta la arquitectura: es la inversión ' +
      'que no se ve en ninguna métrica de producto y la que decide cuántos usuarios podés aceptar. La ' +
      'apuesta de Bezos era un círculo — precios bajos traen volumen, el volumen baja el costo, el costo ' +
      'menor permite precios más bajos — y solo funciona si podés financiar la parte de abajo del ciclo ' +
      'durante años. Esa condición, no la ambición, es la que separa a Amazon de las mil que intentaron lo ' +
      'mismo.';
    return 'Saturaste la necesidad de escala (' + _n(e.cobertura.escala || 0) + '): eso alimenta directo la ' +
      'capacidad del sistema y la fiabilidad, y decide cuántos usuarios podés aceptar sin que la ' +
      'probabilidad de incidente se dispare — hoy la carga está al ' + _n(Motor.carga(e) * 100) + '%. Es la ' +
      'inversión que no se ve en ninguna métrica de producto y lo único barato del juego largo. Estás jugando ' +
      'la apuesta de Bezos: precios bajos traen volumen, el volumen baja el costo, el costo menor permite ' +
      'precios más bajos. Solo funciona si podés financiar la parte de abajo del ciclo durante años, y esa ' +
      'condición — no la ambición — es la que separa a Amazon de las mil que intentaron lo mismo.';
  },

  masters: function (e) {
    var tot = _equipo(e) + (e.gtm || 0);
    if (tot < 18) return 'Sos ' + tot + ' personas en total, todavía debajo del punto donde la coordinación ' +
      'empieza a comerse el rendimiento marginal. El patrón que se repite en casi todas las historias del ' +
      'libro es contraintuitivo para cualquiera con presión de crecimiento: primero algo que cien personas ' +
      'amen, y solo después los millones — porque el amor de cien contiene la información de por qué ' +
      'funciona, y sin eso escalar amplifica algo que no entendés. Tu fit máximo está en ' +
      _pc(Motor.fitMax(e)) + ': ese es el número que dice si ya te ganaste el derecho a escalar.';
    return 'Tu organización pasó de 18 personas (' + _equipo(e) + ' construyendo, ' + e.gtm + ' en ' +
      'go-to-market): empezó el juego de escalar gente. Pasada cierta cantidad, la coordinación se come el ' +
      'rendimiento marginal y la decisión que antes tomabas solo necesita estructura — el juego lo modela con ' +
      'el umbral de carga cognitiva, y solo se mueve reorganizando. El patrón que se repite en casi todas las ' +
      'historias del libro: primero algo que cien personas amen, y solo después los millones. La segunda ' +
      'mitad del patrón es la difícil — hay que soltar exactamente lo que había funcionado.';
  },

  lostfounder: function (e) {
    if (!(e.eventosVistos && e.eventosVistos.downround)) return 'Valuación en $' + _k(e.valoracion) +
      ' con ' + (e.preferencias || []).length + ' preferencia(s) por delante de tu ' + _pc(e.capTable.fund) +
      '. Fishkin cuenta lo que nadie cuenta en una conferencia: la down round, el directorio que te sonríe ' +
      'mientras vota tu reemplazo, y la matemática que convierte una empresa buena y rentable en una ' +
      'decepción porque no iba a devolver el fondo. La tesis es sobre la elección de camino: levantar no es ' +
      'una graduación, es elegir un juego con una sola regla — crecimiento exponencial o nada — y hay ' +
      'negocios excelentes que no son ese juego.';
    return 'Pasaste por una down round: la valuación bajó a $' + _k(e.valoracion) + ', diluiste más por el ' +
      'mismo capital, y las ' + (e.preferencias || []).length + ' preferencia(s) viejas siguen firmes arriba ' +
      'de tu ' + _pc(e.capTable.fund) + '. En la cascada del exit eso se acumula: la ronda que te salvó el ' +
      'mes puede ser la que te dejó en cero. Fishkin escribió este libro para este momento exacto, y su tesis ' +
      'es sobre la elección de camino — levantar venture capital no es una graduación, es elegir un juego con ' +
      'una sola regla, crecimiento exponencial o nada, y hay negocios excelentes que no son ese juego.';
  },

  /* ---------------- LA CALLE ---------------- */

  elprincipe: function (e) {
    return 'Tu capital político está en ' + _n(e.politico) + ', o tocaste una decisión de chivo expiatorio: ' +
      'el juego ya era maquiavélico, ahora tenés el manual. Ese capital es real y se gasta — pedir ' +
      'inversiones impopulares, defender gente, negarse a un pedido de arriba — y con el capital en el piso ' +
      'el motor te niega exactamente las jugadas que más necesitás. Recuperarlo cuesta meses de cumplir sin ' +
      'pedir nada. La lectura que más sirve del libro es defensiva: reconocer estas jugadas cuando las hacen ' +
      'sobre vos — el crédito que se desvía, el aliado que se enfría, el chivo elegido antes de la reunión — ' +
      'vale más que ejecutarlas, porque el que las ejecuta paga un costo compuesto que Maquiavelo no ' +
      'menciona.';
  },

  '48laws': function (e) {
    return 'Alguien tocó el crédito de tu equipo, o jugaste la contra silenciosa: capital político en ' +
      _n(e.politico) + ', moral en ' + _n(e.moral) + '. La ley 1 rige en ' + e.empresa + ' la hayas leído o ' +
      'no, y en el motor el crédito es moneda: mueve capital político y reputación, y la reputación decide ' +
      'tus ofertas siguientes. Estos dilemas no tienen rama gratis — se paga en política o se paga en moral. ' +
      'Hay dos formas de leer a Greene y conviene saber cuál estás usando: como manual funciona a corto plazo ' +
      'y te deja rodeado de gente que juega igual; como vacuna sirve para reconocer la jugada cuando te la ' +
      'hacen. La mayoría necesita la vacuna.';
  },

  artofwar: function (e) {
    return 'La atención del competidor está en ' + _n(e.competidor.atencion * 100) + '% con fuerza ' +
      _pc(e.competidor.fuerza) + ': esa es tu variable de terreno. ' +
      (e.competidor.atencion < 0.4 ? 'Baja, o sea meses gratis para profundizar la diferencia antes de que ' +
        'te mire.' : 'Alta, o sea que su fuerza descuenta tu crecimiento todos los meses.') +
      ' Cada jugada tuya sobre su cancha la sube, y no baja rápido. Las ideas de Sun Tzu se traducen sin ' +
      'esfuerzo: el terreno es la elección de segmento, la velocidad vale más que la fuerza cuando el otro es ' +
      'más grande porque su tamaño es su latencia, y el mejor movimiento es el que hace que pelear no le ' +
      'convenga. Cada jugada sucia de tu industria es una peor traducción de un capítulo que él escribió ' +
      'mejor, sobrio, hace dos mil quinientos años.';
  },

  pitchanything: function (e) {
    return 'Ya te sentaste a la mesa de levantamiento como fundador: ' + e.rondas.length + ' ronda(s), $' +
      _k(e.capFondeo || 0) + ' de fondeo, ' + _pc(e.capTable.fund) + ' del cap table y ' +
      (e.preferencias || []).length + ' preferencia(s) firmadas. Es la única mesa del juego donde una sola ' +
      'conversación cambia el resultado final de la carrera, porque los términos se aplican en la cascada del ' +
      'exit. Acordate de quién puso el marco en esa sala — la plata, o vos. A los premios se los persigue y a ' +
      'los que persiguen se los descuenta, y la única fuente de poder de negociación que no se puede simular ' +
      'es estar dispuesto a irse. Con ' + _run(e) + ', eso depende menos de tu carácter que de tu caja.';
  },

  mafia: function (e) {
    return 'Conociste al hombre que conoce a todos, o tenés una palanca en la mano. En el motor eso no es ' +
      'color: las palancas y los favores quedan guardados en tu carrera y no solo en el puesto — una carta ' +
      'jugada se gasta, y una deuda pendiente se cobra cuando menos te conviene. Alguien, en algún lugar, ' +
      'tiene tu nombre en un libro de favores, y este juego también lleva ese libro. Lo que Puzo describe con ' +
      'precisión es una economía de favores, que es cómo funciona en realidad cualquier red profesional: la ' +
      'lealtad se prueba y no se asume, y las puertas que se abren diez años después casi siempre vienen de ' +
      'ahí.';
  }
};

function aplicarLibro(id, e, c) {
  if (!e || !APLICAR[id]) return null;
  var t = null;
  try { t = APLICAR[id](e, c); } catch (err) { t = null; }
  return t;
}

/* ================================================================
   INTEGRACIÓN INTRÍNSECA (Habgood & Ainsworth, 2011)

   El principio: el contenido a aprender tiene que entregarse a través de la
   parte más divertida del juego y vivir en la mecánica central — no pegado
   encima. Cuando el concepto solo está asociado decorativamente a la fantasía
   de fondo (integración exógena), enseña menos. Cutting & Iacovides (CHI PLAY
   2022, n=210, pre-registrado) encontraron que el mediador es atencional: la
   integración funciona porque dirige la atención al contenido, más que por
   motivación.

   Esta tabla es el contrato que hace auditable esa integración. Para cada
   ficha declara DÓNDE vive el concepto dentro del motor, y por lo tanto qué
   mecánica lo enseña. Sin esto, un libro nuevo entra como panel de texto y
   nadie se da cuenta.

     clase    qué mecánica enseña el concepto
       info      vive en la CALIDAD DE LOS NÚMEROS con los que decidís: el
                 ancho del error y su sesgo. Lo enseña la predicción antes del
                 reveal y la calibración acumulada de la carrera.
       capacidad vive en un MODIFICADOR CON NOMBRE sobre tus puntos del mes
                 (resta o multiplica). Lo enseña verlo en la pantalla donde
                 repartís, no en el cierre.
       postura   vive en una DECISIÓN QUE CAMBIA LA MATRIZ DE PAGOS: precio,
                 segmento, paridad, cobertura. Aplicar el concepto ES tomarla.
       relato    NO tiene palanca, y decirlo es más honesto que fingirla. Son
                 las historias de guerra: su valor es de calibración — saber
                 que la etapa fea es la etapa normal — no de decisión. Se leen
                 en la biblioteca y no pretenden ser mecánica.

     var      la variable del puesto (o derivada de Motor) donde se lee
     palanca  la partida del plan que la mueve, o null si no se mueve
              repartiendo puntos

   Regla para agregar una ficha: si no podés nombrar su `var`, el concepto
   todavía no está en el juego — o es `relato`, o falta la mecánica. */

var INTEGRA = {
  /* --- info: el concepto vive en el ancho y el sesgo de tus números --- */
  lean:        { clase:'info', v:'evidencia',           palanca:'desc' },
  momtest:     { clase:'info', v:'sesgo',               palanca:'desc' },
  torres:      { clase:'info', v:'evidencia',           palanca:'desc' },
  blank:       { clase:'info', v:'evidencia',           palanca:'desc' },
  inspired:    { clase:'info', v:'evidencia',           palanca:'desc' },
  runninglean: { clase:'info', v:'evidencia',           palanca:'desc' },
  justenough:  { clase:'info', v:'calidadDesc',         palanca:'desc' },
  sprintk:     { clase:'info', v:'evidencia',           palanca:'desc' },
  pgscale:     { clase:'info', v:'evidencia',           palanca:'desc' },
  yctalk:      { clase:'info', v:'evidencia',           palanca:'desc' },
  thinkingbets:{ clase:'info', v:'sesgo',               palanca:null   },
  analytics:   { clase:'info', v:'retencionMedia',      palanca:null   },
  yclaunch:    { clase:'info', v:'apuestasCompletadas', palanca:'cons' },
  outcomes:    { clase:'info', v:'progresoMandato',     palanca:'cons' },
  trap:        { clase:'info', v:'progresoMandato',     palanca:'cons' },
  workingback: { clase:'info', v:'progresoMandato',     palanca:'cons' },

  /* --- capacidad: modificador con nombre sobre tus puntos del mes --- */
  fowler:      { clase:'capacidad', v:'deuda',            palanca:'plat' },
  pragmatic:   { clase:'capacidad', v:'deuda',            palanca:'plat' },
  brooks:      { clase:'capacidad', v:'rampa',            palanca:null   },
  blitz:       { clase:'capacidad', v:'rampa',            palanca:null   },
  shapeup:     { clase:'capacidad', v:'enVuelo',          palanca:'cons' },
  topologies:  { clase:'capacidad', v:'teamTopo',         palanca:null   },
  staffeng:    { clase:'capacidad', v:'teamTopo',         palanca:null   },
  elegant:     { clase:'capacidad', v:'ing',              palanca:null   },
  masters:     { clase:'capacidad', v:'ing',              palanca:null   },
  sre:         { clase:'capacidad', v:'presupuestoError', palanca:'fiab' },
  phoenix:     { clase:'capacidad', v:'congelado',        palanca:'fiab' },
  releaseit:   { clase:'capacidad', v:'incidentesPuesto', palanca:'fiab' },
  accelerate:  { clase:'capacidad', v:'cd',               palanca:'plat' },
  contdel:     { clase:'capacidad', v:'cd',               palanca:'plat' },
  ddia:        { clase:'capacidad', v:'carga',            palanca:'plat' },
  ousterhout:  { clase:'capacidad', v:'arquitectura',     palanca:'plat' },
  krug:        { clase:'capacidad', v:'usabilidad',       palanca:'cons' },
  norman:      { clase:'capacidad', v:'usabilidad',       palanca:'cons' },
  leanux:      { clase:'capacidad', v:'usabilidad',       palanca:'cons' },
  grove:       { clase:'capacidad', v:'moral',            palanca:null   },
  radical:     { clase:'capacidad', v:'moral',            palanca:null   },
  lencioni:    { clase:'capacidad', v:'moral',            palanca:null   },
  norules:     { clase:'capacidad', v:'moral',            palanca:null   },
  drive:       { clase:'capacidad', v:'empoderado',       palanca:null   },
  empowered:   { clase:'capacidad', v:'empoderado',       palanca:null   },
  pgmakers:    { clase:'capacidad', v:'foco',             palanca:null   },
  deepwork:    { clase:'capacidad', v:'foco',             palanca:null   },
  okrdoerr:    { clase:'capacidad', v:'foco',             palanca:null   },
  rumelt:      { clase:'capacidad', v:'foco',             palanca:null   },
  crucial:     { clase:'capacidad', v:'politico',         palanca:null   },
  elprincipe:  { clase:'capacidad', v:'politico',         palanca:null   },
  '48laws':    { clase:'capacidad', v:'politico',         palanca:null   },
  managerpath: { clase:'capacidad', v:'mando',            palanca:null   },
  hackingg:    { clase:'capacidad', v:'gtm',              palanca:'crec' },

  /* --- postura: la decisión que cambia la matriz de pagos --- */
  zero:        { clase:'postura', v:'cobertura',      palanca:'cons' },
  helmer:      { clase:'postura', v:'cobertura',      palanca:'cons' },
  storymap:    { clase:'postura', v:'cobertura',      palanca:'cons' },
  jtbd:        { clase:'postura', v:'cobertura',      palanca:'cons' },
  everything:  { clase:'postura', v:'cobertura',      palanca:'cons' },
  chasm:       { clase:'postura', v:'compuerta',      palanca:'cons' },
  positioning: { clase:'postura', v:'compuerta',      palanca:'cons' },
  seibel:      { clase:'postura', v:'fitMax',         palanca:'cons' },
  olsen:       { clase:'postura', v:'fit',            palanca:'cons' },
  hooked:      { clase:'postura', v:'retencionMedia', palanca:'cons' },
  badass:      { clase:'postura', v:'retencionMedia', palanca:'cons' },
  innov:       { clase:'postura', v:'precio',         palanca:'crec' },
  innovsol:    { clase:'postura', v:'precio',         palanca:'crec' },
  pricing:     { clase:'postura', v:'precio',         palanca:'crec' },
  dunford:     { clase:'postura', v:'marca',          palanca:'crec' },
  playbigger:  { clase:'postura', v:'marca',          palanca:'crec' },
  alchemy:     { clase:'postura', v:'marca',          palanca:'crec' },
  purplecow:   { clase:'postura', v:'marca',          palanca:'crec' },
  influence:   { clase:'postura', v:'marca',          palanca:'crec' },
  coldstart:   { clase:'postura', v:'viral',          palanca:'crec' },
  contagious:  { clase:'postura', v:'viral',          palanca:'crec' },
  traction:    { clase:'postura', v:'cac',            palanca:'crec' },
  ycgrowth:    { clase:'postura', v:'usuarios',       palanca:'crec' },
  predictable: { clase:'postura', v:'mrr',            palanca:'crec' },
  pgramen:     { clase:'postura', v:'mrr',            palanca:'crec' },
  antifragile: { clase:'postura', v:'mrr',            palanca:null   },
  pgdefault:   { clase:'postura', v:'runwayMeses',    palanca:'crec' },
  challenger:  { clase:'postura', v:'fiabPercibida',  palanca:'fiab' },
  paranoid:    { clase:'postura', v:'atencion',       palanca:null   },
  artofwar:    { clase:'postura', v:'atencion',       palanca:null   },
  pgmean:      { clase:'postura', v:'lupa',           palanca:null   },
  whatyoudo:   { clase:'postura', v:'lupa',           palanca:null   },
  badblood:    { clase:'postura', v:'lupa',           palanca:null   },
  superpumped: { clase:'postura', v:'lupa',           palanca:null   },
  pgfund:      { clase:'postura', v:'capFondeo',      palanca:null   },
  sandhill:    { clase:'postura', v:'capFondeo',      palanca:null   },
  pitchanything:{clase:'postura', v:'capFondeo',      palanca:null   },
  rework:      { clase:'postura', v:'capFondeo',      palanca:null   },
  deals:       { clase:'postura', v:'preferencias',   palanca:null   },
  voss:        { clase:'postura', v:'preferencias',   palanca:null   },
  wasserman:   { clase:'postura', v:'capTable',       palanca:null   },
  psych:       { clase:'postura', v:'ventaSecundaria',palanca:null   },
  lostfounder: { clase:'postura', v:'valoracion',     palanca:null   },
  foundingsales:{clase:'postura', v:'mando',          palanca:'desc' },

  /* --- relato: sin palanca, y decirlo es más honesto que fingirla --- */
  hard:          { clase:'relato', v:'politico', palanca:null },
  pgdie:         { clase:'relato', v:'caja',     palanca:null },
  shoedog:       { clase:'relato', v:'caja',     palanca:null },
  pgrr:          { clase:'relato', v:'eraId',    palanca:null },
  foundersatwork:{ clase:'relato', v:'esFundador', palanca:null },
  powerlaw:      { clase:'relato', v:null,       palanca:null },
  coachb:        { clase:'relato', v:null,       palanca:null },
  walsh:         { clase:'relato', v:null,       palanca:null },
  hatching:      { clase:'relato', v:null,       palanca:null },
  chaosm:        { clase:'relato', v:null,       palanca:null },
  mafia:         { clase:'relato', v:'palancaSecreta', palanca:null }
};

function integraDe(id) { return INTEGRA[id] || null; }
