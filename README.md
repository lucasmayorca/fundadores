# Founder Mode — una carrera en producto

**Juégalo aquí: https://fundadores-production.up.railway.app/**

Juego de carrera para el navegador, construido originalmente para un iPad 3
(iOS 9.3.5), y por eso corre en cualquier cosa. En casa lo sirve el servidor
del panel (`localhost:8000/juego/`); en internet, Railway con el `server.js`
de este repo (`npm start` para correrlo en local).

Empiezas como Analista de Producto y saltas de startup en startup — como la
carrera de Soccer Superstar — hasta CPO o hasta fundar lo tuyo. Cada puesto
dura 8-14 meses, te contratan con un **mandato**, y al final te juzgan:
ascenso, renovación, despido... o imputación.

## Publicar cambios — SIEMPRE en todas partes

El juego vive en una sola carpeta pero se despliega en **tres lugares**, y un
cambio no está terminado hasta que llegó a los tres:

| Lugar | Quién lo ve | Cómo se actualiza |
|---|---|---|
| Servidor del panel (Mac/iPad) | tú, en casa | solo — sirve esta carpeta directamente |
| GitHub (`lucasmayorca/fundadores`) | el código público | `git push` |
| Railway (link público) | cualquiera en internet | `railway up` |

La checklist para CADA cambio, sin excepciones:

1. Sube el `?v=N` en `index.html` (revienta las cachés del iPad y de Railway).
2. Commit, push y deploy:

```bash
git add -A && git commit -m "qué cambió" && git push && railway up --detach
```

Si te saltas el `git push`, GitHub se vuelve un mentiroso; si te saltas
`railway up`, el link público sirve el juego viejo. Railway **no** se
despliega solo con el push (los deploys van por la CLI, no está conectado al
repo) — si algún día se conecta desde el dashboard de Railway, el
`railway up` se vuelve redundante, pero hasta entonces haces los dos.

## Restricciones técnicas (las mismas del panel)

iOS 9.3.5 / Safari 9: ES5 puro (nada de `let`/`const`, arrows, template
literals, `class` ni `fetch`), flexbox con prefijos `-webkit-`, 1024×768
fijo, sin build, sin dependencias. Todo el estado en `localStorage`.
Los script tags llevan `?v=N` para reventar caché: **sube el número cada
vez que toques cualquier archivo**.

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
3. **Cierra el mes** y lee qué pasó (impacto real vs esperado, más lo que
   otorgó cada proyecto entregado).

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

## Teoría aplicada al caso (en tres lugares)

1. **Tarjeta de libro**: además de la idea y de cómo la modela el juego, un
   bloque **"En tu partida, hoy"** calculado en vivo con tus números
   ("Tu deuda está en 60: el equipo pierde ~33% de capacidad pagando ese
   interés"). 25 libros tienen aplicador (`APLICAR` en libros.js).
2. **Decisión de dilema**: al elegir, el resultado muestra **"La teoría"**
   — el concepto completo del libro + la línea aplicada a tu empresa.
3. **Briefing de etapa**: la teoría de la fase + el veredicto sobre esa
   empresa en concreto.

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

## La biblioteca: 100 tarjetas

8 pilares: startup (19), producto (24), tech (13), YC/ensayos (12),
growth (10), capital (5), gente (9), historias (8). Las 20 canónicas están
cableadas a mecánicas; las otras 80 tienen un **gatillo contextual**
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

## Archivos

```
index.html     shell + metas de web app (script tags con ?v=N)
estilos.css    tema oscuro, flexbox con prefijos, animaciones -webkit-
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

## En el iPad

Igual que el panel: Safari → `http://MacBook-Air-de-Lucas.local:8000/juego/`
→ Compartir → Añadir a pantalla de inicio. Se recomienda Acceso Guiado.
