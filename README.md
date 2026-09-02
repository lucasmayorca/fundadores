# Founder Mode — una carrera en producto

**Juégalo aquí: https://fundadores-production.up.railway.app/**

Juego de carrera para el navegador. Nació para un iPad 3 (iOS 9.3.5) y por
eso corre en cualquier cosa, pero **hoy el objetivo es Mac y teléfono** — el
iPad ya no condiciona las decisiones técnicas (ver *Restricciones técnicas*).
El teléfono tiene su propio layout (ver *En el teléfono*). En casa lo sirve
el servidor del panel (`localhost:8000/juego/`); en internet, Railway con el
`server.js` de este repo (`npm start` para correrlo en local).

Empiezas como Analista de Producto y saltas de startup en startup — como la
carrera de Soccer Superstar — hasta CPO o hasta fundar lo tuyo. Cada puesto
dura 8-14 meses, te contratan con un **mandato** (que recién conoces el día
uno: en la entrevista nunca te dicen el trabajo real), y al final te juzgan:
ascenso, renovación, despido... o imputación.

**Todo el juego está en español latinoamericano** (v23). La marca queda en
inglés — Founder Mode, como el ensayo de Paul Graham — igual que los títulos
de los libros de la biblioteca, que son el canon.

## Publicar cambios — SIEMPRE en todas partes

El juego vive en una sola carpeta pero se despliega en **tres lugares**, y un
cambio no está terminado hasta que llegó a los tres:

| Lugar | Quién lo ve | Cómo se actualiza |
|---|---|---|
| Servidor del panel (Mac/iPad) | tú, en casa | solo — sirve esta carpeta directamente |
| GitHub (`lucasmayorca/fundadores`) | el código público | `git push` |
| Railway (link público) | cualquiera en internet | `railway up` |

La checklist para CADA cambio, sin excepciones:

1. Sube el `?v=N` en `index.html` (revienta las cachés del navegador y de Railway).
2. Commit, push y deploy:

```bash
git add -A && git commit -m "qué cambió" && git push && railway up --detach
```

Si te saltas el `git push`, GitHub se vuelve un mentiroso; si te saltas
`railway up`, el link público sirve el juego viejo. Railway **no** se
despliega solo con el push (los deploys van por la CLI, no está conectado al
repo) — si algún día se conecta desde el dashboard de Railway, el
`railway up` se vuelve redundante, pero hasta entonces haces los dos.

## Restricciones técnicas

**El iPad 3 dejó de ser un objetivo (decidido en septiembre de 2026).** El
juego se juega sobre todo en Mac y en el teléfono, así que Safari 9 ya no
manda: usá recursos modernos sin pedir permiso — CSS actual (variables,
grid, `filter`, `backdrop-filter`, animaciones y transiciones sin prefijar),
JS actual (`let`/`const`, arrows, template literals, `class`, `fetch`),
SVG/Canvas/WebGL, tipografías web, lo que haga falta para que se vea bien.
Si algo se ve mejor y cuesta la compatibilidad con el iPad 3, se hace.

Lo que se mantiene, pero por decisión propia y no por compatibilidad:

- **Sin build y sin dependencias**: los archivos se sirven tal cual. Es lo
  que hace que desplegar sea copiar una carpeta.
- **Todo el estado del jugador en `localStorage`** (el ranking público vive
  en el servidor).
- **Los script tags llevan `?v=N`**: subí el número cada vez que toques
  cualquier archivo, o las cachés sirven el juego viejo.
- **Motor, Carrera y Mundo no tocan el DOM**, para poder cargarlos en node y
  balancear el juego con bots.

El código que ya está escrito sigue en ES5 con prefijos `-webkit-`: funciona,
así que no hay que reescribirlo por deporte — pero el código nuevo no tiene
por qué imitarlo.

El lienzo sigue siendo de **1024×768**, escalado y centrado al viewport, y
por debajo de 700px de lado corto entra el modo móvil (ver abajo).

## En el teléfono

Escalar el lienzo de 1024 a 390px de ancho deja el texto a ~0.38x: ilegible.
Así que por debajo de **700px de lado corto** el juego entra en modo móvil:
`ui.js` marca `movil` en `<body>` y el bloque de móvil de `estilos.css` toma
el control. Sin esa clase esas reglas no existen — el iPad 3 ve exactamente
lo de siempre, y al rotar o redimensionar se cruza de un modo al otro
repintando la pantalla activa.

Qué cambia:

- **El lienzo se estira** al viewport (sin `transform: scale`), con las
  `safe-area-inset-*` del notch como padding.
- **La pantalla de juego se parte en dos pestañas**: *Tu mes* (estaciones +
  proyectos, un solo scroll) y *La empresa* (los signos vitales que en ancho
  viven en la columna derecha). El paso del tour que ilumina el panel cambia
  de pestaña solo.
- **Ritmo, era y retos se mudan adentro del scroll** de la columna izquierda:
  son contexto que se lee al empezar el mes, no cosas que necesites clavadas
  mientras mueves puntos. Quedan fijos el HUD, el mandato, las pestañas y el
  cierre del mes — de 407px de cromo fijo a 284px, que en un iPhone SE es la
  diferencia entre 160 y 285px para jugar.
- **Todo lo que era una fila de columnas de ancho fijo se apila** (portada,
  ofertas, briefing, cierre, final, Salón de la Fama). En el HTML esas
  columnas van marcadas con `.dosc` / `.colx`; las estaciones pasan a tres
  por fila y las tarjetas de oferta a una por fila.
- **Los overlays son hojas a pantalla completa** (dilemas, resumen del mes,
  biblioteca, tarjetas de libro), con el botón de cerrar clavado abajo.
- **De lado se pide vertical**, y solo en la pantalla de juego: con ~390px de
  alto el mes no cabe. El resto del juego funciona igual en cualquier sentido.

## Inicio personalizado (LinkedIn)

La pantalla de inicio pregunta **¿Quién eres?** (opcional): pega tu URL de
LinkedIn o tu cargo actual, o toca un escalón (APM -> Fundador — cada
posición de producto mapea a uno: Product Owner->PM, Head of Product->Director,
Principal/Lead->GPM, y así). Empezar de cero siempre está disponible.

- En el **deploy público**, el servidor Node trae la página pública de
  LinkedIn (`/api/perfil?u=...`) y extrae tu nombre + titular del lado del
  servidor (LinkedIn puede poner authwall; degrada con gracia).
- En el **iPad/LAN** no existe el endpoint: el cliente parsea el slug de la
  URL para tu nombre y el cargo pegado para tu escalón. Misma experiencia,
  sin conexión.
- Empezar a media escalera siembra reputación y habilidades a la altura, y tu
  rival arranca en tu mismo nivel.

## Tooltips táctiles

Las etiquetas con subrayado punteado (Retención, Runway, Capital político, la
Lupa, prob/impacto, compromiso, Evidencia, Deuda, Carga, Presupuesto de
error...) muestran una explicación de una línea al tocarlas — 16 en total.
Sin hover: es un iPad.

## El ciclo mensual: estaciona a tu equipo (estilo AoE/Catan)

Tu equipo produce **puntos** cada mes — un solo recurso visible, una barra
donde cada punto está contado:

1. **Estaciona a tu equipo**: steppers +/- en cuatro estaciones, cada una
   mostrando su rendimiento en vivo — Descubrir (`+N evidencia`), Plataforma
   (`−N deuda`), Fiabilidad (`+N uptime`), Crecimiento (`+alcance`). Las
   estaciones se desbloquean al subir la escalera. **Lo que no estaciones va
   a Construir** y empuja tus proyectos.
2. **Elige tus proyectos**: **slots** limitados (2 seed / 3 Serie A / 4
   Serie B) mostrados como cajas que se llenan al elegir. Cada tarjeta de
   proyecto muestra puntos de prob, bloques de impacto, tamaño de esfuerzo —
   y **lo que otorga al salir**: los proyectos Scale suman capacidad
   permanente de sistema, los Data suman evidencia, Flow suma usabilidad,
   Integr/Support/Security marcan la compuerta del mercado grande. Entregar
   libera el slot. Construcción de motor, estilo The Founder: cada proyecto
   agranda la máquina.
3. **Cierra el mes** ("Construyendo…") y lee qué pasó: el resultado abre
   con el delta de tu mandato (93% → 95% · objetivo 88%) y cada entrega
   muestra su impacto real contra el esperado, chip por chip.

**Las métricas pirata son la columna vertebral (AARRR de Dave McClure).**
Cada proyecto lleva un vector de impacto esperado sobre ACQ/ACT/RET/REV/REL
— positivo o NEGATIVO (la superficie nueva cuesta confiabilidad, la
complejidad cuesta activación) — y el chip de la métrica de tu mandato
brilla en cada tarjeta. El panel EMBUDO muestra Adquisición → Activación →
Retención → Ingresos → **Ganancia** → Referidos: los números con los que se
decide. El panel RECURSOS (caja, runway, valoración, capital político,
reputación) completa el tablero.

**Los dilemas son ocasionales, no un impuesto mensual** (~39% de los meses):
los críticos (allanamientos, congelamiento por presupuesto de error) siempre
salen; el resto respeta un enfriamiento y una memoria de carrera — las
lecciones de una sola vez no se repiten, y las frecuentes llegan con pieles
distintas por empresa. Un reclutador puede tentarte a mitad de mandato:
irte con el plan encaminado es ambición; atrasado, te persigue.

**La pista de Edad** marca tu progresión (APM → … → Fndr) y qué desbloquea
el siguiente escalón; los **retos** de la semana y las contingencias estilo
The Founder (robo de datos, notas demoledoras, caídas del proveedor,
barridas regulatorias) mantienen el mes vivo.

## El briefing y las etapas (teoría de PMF)

Aceptar una oferta abre el **briefing del día uno**: la fase de la empresa
con su objetivo, un mosaico de contexto (usuarios/equipo/sector/mandato), qué
necesidades pagan (▲) y cuáles apenas cuentan (▽), el elenco con nombre, y un
bloque **"De dónde sale esta etapa"** con la teoría (Blank, Rachleff, Startup
Genome, Moore) aplicada a los números de ESA empresa. El chip de fase queda
fijado en la barra del mandato y tocarlo reabre el briefing.

Las fases son mecánicas, no decorativas — el impacto real de las apuestas
alineadas paga ×1.3 y el de las desalineadas ×0.5:

| Fase | Etapa | Paga | Apenas cuenta |
|---|---|---|---|
| PRE-PMF | Seed | Core, Flow | Scale, Security |
| VALIDANDO PMF | Serie A | Flow, Data | Scale |
| ESCALANDO | Serie B | Integraciones, Support, Security, Scale | — |

Escalar demasiado pronto — la causa número uno de muerte según Startup
Genome — ahora es un error que el juego te cobra.

## Teoría aplicada al caso (en cuatro lugares)

1. **Tarjeta de libro**: además de la idea y de cómo la modela el juego, un
   bloque **"En tu partida, hoy"** calculado en vivo con tus números
   ("Tu deuda está en 60: el equipo pierde ~33% de capacidad pagando ese
   interés"). 25 libros tienen aplicador (`APLICAR` en libros.js).
2. **Decisión de dilema**: al elegir, el resultado muestra **"La teoría"**
   — el concepto completo del libro + la línea aplicada a tu empresa.
3. **Briefing de etapa**: la teoría de la fase + el veredicto sobre esa
   empresa en concreto.
4. **Barra de ritmo** (bajo la barra de mandato, en el mes a mes): cruza el
   ritmo real de avance del mandato (tendencia de los últimos meses, o el
   promedio desde el día uno si aún no hay historial) contra el runway —
   "a este paso, ¿lo lográs antes de quedarte sin caja, y antes de que se
   acabe el puesto?" — citando *Default Alive or Default Dead?* (Paul
   Graham), el mismo libro que antes solo aparecía como evento aislado
   cuando el runway bajaba de 7 meses.

## El sistema de carrera

- **Escalera de 8 niveles**: cada rol define tu **control** (% del área de
  la que respondes — el resto se mueve solo) y qué **posturas** tienes.
  También lo que VES: ingresos desde PM, caja/runway desde GPM, sala de
  máquinas desde Sr PM. Ganar visibilidad es parte del premio.
- **Mandato + capital político**: gastar fuera del mandato — incluso cuando
  tienes razón — quema capital político; en cero, estás despedido. Los
  mandatos de crecimiento escalan con la duración del contrato y solo se
  ofrecen a roles con las palancas para cumplirlos.
- **Primer puesto corto** (8-10 meses): el primer ascenso llega rápido.
- **Equity real**: cliff de 12 meses, vesting a 4 años, dilución cuando la
  empresa levanta sin ti, una lotería final según la salud de la empresa
  cuando te vas. Un fundador sin evento de compra se queda en papel.
- **Habilidades** (producto/tecnología/negocio/liderazgo): crecen según en
  qué gastas tus meses, con retornos decrecientes.

## Los 7 sectores (2 empresas cada uno, todas startups)

| Sector | La compuerta al mercado grande | Se rompe con |
|---|---|---|
| Datos y opinión pública | Auditoría de transparencia | Escándalo de datos de campaña |
| Biogenética aplicada | Validación regulatoria y bioseguridad | Evento adverso |
| Banco digital | Licencia y control de fraude | Ola de fraude |
| Energía renovable | Prueba verificable de ahorro | Caída de infraestructura |
| Devtools | Venderle al departamento, no al individuo | Caída de infraestructura |
| Apuestas y juego online | Licencia y controles de adicción | La ballena y el hueco del bono |
| Salud premium (gold) | Confianza médica impecable | Evento adverso con un paciente VIP |

Cada empresa además declara su **perfil de priorización** en la oferta:
tope de compromiso (22/30/40 pts por etapa) y tipo de cartera — "pocas y
grandes" (28% de las apuestas pagan ×2, el resto casi nada), "muchas y
chicas", "difíciles de estimar" o "cartera pareja".

## El mundo vivo

- **6 eras** (Age of Empires): boom de longevidad, invierno de capital, año
  electoral, transición energética, fiebre del juego, año de los
  reguladores. Calientan/enfrían sectores, mueven capital y ofertas.
- **Rival con nombre** (NFS): progresa en paralelo, gana terreno cuando
  tropiezas, se compara al final.
- **Elenco por empresa** (GTA): un CEO, CTO, VP de Ventas y Staff Engineer
  con nombre traen los dilemas. Ticker de noticias por era.

## La zona gris (GTA, Billions, Breaking Bad)

**La Lupa del regulador** es tu nivel de "se busca": los atajos sucios la
suben (cocinar métricas, el data room robado, usuarios comprados, el club de
compradores estilo Dallas Buyers Club, el negocio paralelo del CTO estilo
Breaking Bad, diluir a tu socio estilo Social Network). En 40: inspecciones
y multas. En 55: el fiscal ofrece un trato. En 85: un allanamiento — y si
encuentran algo, **imputación** (−22 reputación, −2 niveles). La tentación
siempre es la primera opción y siempre paga hoy: en bots, jugar sucio
termina en ~$6.8M y limpio en ~$16.6M.

## La biblioteca: 105 tarjetas

9 pilares: startup (19), producto (24), tecnología (13), YC/ensayos (12),
growth (10), capital (5), gente (9), historias de guerra (8) y **La Calle**
(5: El Príncipe, Las 48 leyes del poder, El arte de la guerra, Pitch
Anything, El Padrino). Las 20 canónicas están cableadas a mecánicas; el
resto tiene un **gatillo contextual**
(runway < 7 → *Default Alive or Default Dead?*; Lupa ≥ 60 → *Bad Blood*;
despido → *Chaos Monkeys*). Máximo 2 por mes. Una carrera abre ~71;
completarla exige estilos de juego distintos entre carreras.

## Meta-juego

17 logros (Heisenberg, Manos limpias, La casa siempre gana, Regicidio,
Por un pelo...), un salón de récords que persiste entre carreras, historial
de carreras pasadas.

## Ranking público: el Salón de la Fama

Todo el que termina una carrera cae en un **ranking público** — sin cuentas:
el cliente acuña un token anónimo en `localStorage` (`fundadores.token`) y
cada envío lo lleva, así las carreras de un jugador se agrupan y nadie puede
suplantar al dueño de un nombre. Robado de Argentum y GTA Online:

- **Cuatro tablas históricas** (los tops de Argentum): patrimonio — el
  **ranking mundial**, con todos los jugadores listados — más rol más alto,
  racha de mandatos y logros (top 5 cada una). Mejor carrera por jugador.
- **Desafío semanal** (GTA Online): `Mundo.nuevo(seed)` siembra un LCG con
  la semana ISO (`2026-W36`), así **todos enfrentan la misma secuencia de
  eras** esa semana. Las partidas semanales quedan etiquetadas y compiten en
  su propia tabla de 7 días; el ganador de la semana pasada queda en la
  página.
- **Rival fantasma** (los fantasmas de los juegos de carreras): el rival
  **siempre se llama Lucas M**. Al empezar la carrera el cliente le pide a
  `/api/rival` la mejor carrera de un jugador real, que lo posee
  (reputación, techo): sube con los dados de siempre pero **se detiene en el
  nivel que ese jugador de verdad alcanzó**. La pantalla final muestra la
  carrera real detrás de él. Sin conexión se queda como NPC — mismo nombre.
- **Facciones** (Armada vs Legión): elige Legión del Crecimiento o Gremio
  del Oficio en la portada (`fundadores.faccion`); cada carrera terminada
  suma sus mandatos cumplidos a la barra de la guerra de facciones.
- **Recompensa** (GTA): destrona al #1 histórico por patrimonio y el
  servidor responde `destronaste`, que desbloquea el logro **Regicidio**.

Del lado del servidor (`server.js`, sigue con cero dependencias):
`POST /api/ranking` (envío, acotado por plausibilidad y con rate limit),
`GET /api/ranking` (todas las tablas + facciones + recompensa; `?t=token`
marca tus filas), `GET /api/rival`, y **`/ranking`** — una página HTML
pública y compartible con las mismas tablas. CORS está abierto para que el
iPad en la LAN también puntúe contra el deploy público (los POST van como
`text/plain` para ahorrarle el preflight a Safari 9).

El almacén es un archivo JSON en un **volumen de Railway montado en
`/data`** — el log de arranque avisa si falta el volumen, en cuyo caso el
ranking se resetea en cada deploy. En local cae a la carpeta del repo (o a
`RANKING_DIR`).

## Identidad visual (hoja de ruta)

El motor está completo; la expresión visual todavía es sobre todo tipografía.
Diagnóstico y propuesta, comparando contra 100 juegos de habilidades y eras
(Civilization, Age of Empires, Football Manager, Crusader Kings, Darkest
Dungeon, Duolingo, GTA...): **[La Identidad Visual de Founder
Mode](https://claude.ai/code/artifact/eca128b7-1e51-4b1f-8f59-59117f587fc2)**.

Todo corre con SVG inline + CSS, sin dependencias nuevas. Orden de trabajo:

1. **Ahora**: tira de eras con ícono propio y glow en la activa (`#era`);
   elenco con silueta por rol y marco de color por postura (ayuda/bloquea)
   en vez de una letra en un círculo.
2. **Después**: radar de 5 ejes (producto/tecnología/GTM/gente/capital) con
   el mes anterior como contorno fantasma; la Lupa del regulador como fila
   de íconos que se llenan, estilo wanted level de GTA.
3. **Más adelante**: las tres etapas de PMF como camino de nodos (no barras
   sueltas); los 17 logros y las facciones del ranking como vitrina de
   badges en vez de listas con candado.

## Archivos

```
index.html     shell + metas de web app (script tags con ?v=N)
estilos.css    tema oscuro, flexbox con prefijos, animaciones -webkit-,
               y al final el bloque `body.movil` con el layout de teléfono
libros.js      100 tarjetas + gatillos contextuales + APLICAR (caso en vivo)
sectores.js    sectores, empresas+perfil, escalera, etapas+fases, mandatos
mundo.js       eras, noticias, rival, elenco
contenido.js   necesidades, segmentos, 52 apuestas, 35 dilemas
motor.js       simulación de un puesto (mes a mes): encaje, difusión, Lupa,
               tope, perfiles, incidentes por sector, cap table
carrera.js     ofertas, cierres de puesto, ascenso, equity, habilidades
logros.js      logros y récords (localStorage, entre carreras)
ranking.js     cliente del ranking público: token, semilla semanal, envíos, rival
ui.js          render + un solo manejador de clicks delegado
server.js      servidor de Railway: estáticos + /api/perfil + API de ranking + /ranking
icono.png      generado por scripts/make_icono_juego.py
```

Motor, Carrera y Mundo nunca tocan el DOM: cargan en node para simular
carreras enteras y balancear el juego (ver el scratchpad sim2/sim3/dist
del desarrollo).

## Balance verificado con bots

- Primer mandato jugando "según el manual" (descubrir → construir,
  priorizando prob×impacto÷esfuerzo alineado a la etapa): **~90%** de éxito.
- Carrera completa: patrimonio mediano ~$6M; alineado al mandato > rebelde
  > flojo (~$0.7M con muchos despidos); limpio ≈ 2.4× sucio.
- El premio gordo (~$80-120M) existe: funda, deja que te compren, sobrevive
  la cascada de liquidación.

## En el iPad y en el teléfono

Igual que el panel: Safari → `http://MacBook-Air-de-Lucas.local:8000/juego/`
→ Compartir → Añadir a pantalla de inicio. Se recomienda Acceso Guiado.

En el teléfono es lo mismo, pero con el link público
(https://fundadores-production.up.railway.app/) para no depender de la LAN.
Añadido a la pantalla de inicio abre a pantalla completa, sin barras de
Safari — que es donde el modo móvil se ve mejor.
