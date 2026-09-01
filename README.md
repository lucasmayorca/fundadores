# Fundadores — una carrera en producto

Juego de carrera para el iPad 3, servido por el mismo servidor del panel:
`http://MacBook-Air-de-Lucas.local:8000/juego/` (en la Mac: `localhost:8000/juego/`).

Arrancás de Analista de Producto y saltás de startup en startup — como la
carrera del Soccer Superstar — hasta CPO o tu propia fundación. Cada puesto
dura 8-14 meses, te contratan con un **mandato**, y al final te evalúan:
ascenso, renovación, despido... o imputación.

## Restricciones técnicas (las mismas del panel)

iOS 9.3.5 / Safari 9: ES5 plano (sin `let`/`const`, arrows, template
literals, `class` ni `fetch`), flexbox con prefijos `-webkit-`, 1024×768
fijo, sin build step ni dependencias. Todo el estado en `localStorage`.
Los script tags llevan `?v=N` para bustear caché: **subí el número al
modificar cualquier archivo**.

## El bucle del mes: 3 toques

1. **Postura del mes** (un botón): Construir / Descubrir / Sanear / Crecer.
   Se desbloquean al ascender y reparten los puntos solas.
2. **Elegir apuestas** hasta llenar el **techo de compromiso**. Cada apuesta
   muestra: **prob** (puntos ●●●○○: confiabilidad de la estimación),
   **impacto** (bloques ▂▄▆: cuánto mueve si acierta), **esfuerzo**
   (S/M/L/XL) y el marcador **▲/▽** de alineación con la etapa. Priorizar
   por probabilidad × impacto ÷ esfuerzo bajo un techo ES el juego: con
   bot, hacerlo bien cumple ~90% de los primeros mandatos; ignorarlo, ~45%.
3. **Cerrar el mes** y leer qué pasó (impacto real vs. esperado).

## El briefing y las etapas (teoría de PMF)

Al aceptar una oferta aparece el **briefing del día uno**: la fase de la
empresa con su objetivo, mosaico de contexto (usuarios/equipo/sector/
mandato), qué necesidades priman (▲) y cuáles pesan poco (▽), el elenco con
nombre, y un bloque **"De dónde sale esta etapa"** con la teoría (Blank,
Rachleff, Startup Genome, Moore) aplicada a los números de ESA empresa.
El chip de fase queda persistente en la barra del mandato y tocarlo reabre
el briefing.

Las fases son mecánicas, no decorativas — el impacto real de las apuestas
alineadas rinde ×1,3 y el de las desalineadas ×0,5:

| Fase | Etapa | Prima | Pesa poco |
|---|---|---|---|
| PRE-PMF | Semilla | Núcleo, Flujo | Escala, Seguridad |
| VALIDANDO PMF | Serie A | Flujo, Datos | Escala |
| ESCALANDO | Serie B | Integra, Soporte, Segur, Escala | — |

Escalar antes de tiempo — la causa de muerte número uno según Startup
Genome — ahora es un error que el juego cobra.

## Teoría aplicada al caso (en tres lugares)

1. **Ficha de libro**: además de la idea y cómo lo modela el juego, un
   bloque **"En tu partida, hoy"** calculado en vivo con tus números
   ("Tu deuda está en 60: el equipo pierde ~33% de capacidad pagando ese
   interés"). 25 libros tienen aplicador (`APLICAR` en libros.js).
2. **Decisión de dilema**: al elegir, el resultado muestra **"La teoría"**
   — el concepto completo del libro + la línea aplicada a tu empresa.
3. **Briefing de etapa**: la teoría de la fase + el veredicto sobre esa
   empresa concreta.

## El sistema de carrera

- **Escalafón de 8 niveles**: cada rol define tu **mando** (% del área que
  respondés — el resto se mueve solo) y qué **posturas** tenés. También qué
  VES: ingresos desde PM, caja/runway desde GPM, sala de máquinas desde
  Sr PM. Ganar visión es parte del premio.
- **Mandato + capital político**: gastar fuera del mandato — aunque tengas
  razón — quema capital político; a cero te despiden. Los mandatos de
  crecimiento escalan con el plazo del contrato y solo se ofrecen a roles
  con las palancas para cumplirlos.
- **Primer puesto corto** (8-10 meses): el primer ascenso llega rápido.
- **Equity real**: acantilado de 12 meses, vesting a 4 años, dilución
  cuando la empresa levanta sin vos, lotería final según la salud de la
  empresa al irte. El fundador sin evento de compra queda en papel.
- **Habilidades** (producto/tecnología/negocio/liderazgo): suben según en
  qué gastás los meses, con rendimientos decrecientes.

## Los 7 sectores (2 empresas cada uno, todas startups)

| Sector | La compuerta al mercado grande | Se rompe con |
|---|---|---|
| Datos y opinión pública | Auditoría de transparencia | Escándalo de datos en campaña |
| Biogenética aplicada | Validación regulatoria y bioseguridad | Evento adverso |
| Banco digital | Licencia y control de fraude | Ola de fraude |
| Energía renovable | Prueba verificable del ahorro | Caída de infraestructura |
| Devtools | Compra del área, no del individuo | Caída de infraestructura |
| Apuestas y juego online | Licencia y controles de adicción | La ballena y el agujero del bono |
| Salud premium (gold) | Confianza médica impecable | Evento adverso con paciente VIP |

Cada empresa además declara en la oferta su **perfil de priorización**:
techo de compromiso (22/30/40 pts por etapa) y tipo de cartera — "pocas y
grandes" (28% de apuestas valen ×2, el resto casi nada), "muchas y chicas",
"difíciles de estimar" o "cartera pareja".

## El mundo vivo

- **6 eras** (Age of Empires): boom de la longevidad, invierno del capital,
  año electoral, transición energética, fiebre del juego, año de los
  reguladores. Calientan/enfrían sectores, mueven el capital y las ofertas.
- **Rival con nombre** (NFS): progresa en paralelo, avanza cuando tropezás,
  se compara al final.
- **Elenco por empresa** (GTA): CEO, CTO, VP Ventas y Staff Engineer con
  nombre traen los dilemas. Ticker de noticias por era.

## La zona gris (GTA, Billions, Breaking Bad)

**La Lupa del regulador** es el nivel de "buscado": los atajos turbios la
suben (cocinar métricas, el data room robado, usuarios comprados, el club
de compradores estilo Dallas Buyers Club, el negocio paralelo del CTO
estilo Breaking Bad, diluir al socio estilo Social Network). A 40:
inspecciones y multas. A 55: la fiscal ofrece un trato. A 85: allanamiento
— y si encuentran algo, **imputación** (−22 reputación, −2 niveles).
La tentación siempre es la primera opción y siempre paga hoy: en bots,
jugar sucio termina en ~$6,8M y limpio en ~$16,6M.

## La biblioteca: 100 fichas

8 pilares: startup (19), producto (24), tecnología (13), YC/ensayos (12),
growth (10), capital (5), gente (9), historias (8). Las 20 canónicas están
cableadas a mecánicas; las 80 restantes tienen **disparador contextual**
(runway < 7 → *Default Alive or Default Dead?*; Lupa ≥ 60 → *Bad Blood*;
despido → *Chaos Monkeys*). Máximo 2 por mes. Una carrera abre ~71;
completarla exige estilos distintos entre carreras.

## Meta-juego

16 logros (Heisenberg, Manos limpias, La banca gana, Zafaste...), sala de
récords persistente entre carreras, historia de carreras pasadas.

## Archivos

```
index.html     shell + metas de web app (script tags con ?v=N)
estilos.css    tema oscuro, flexbox prefijado, animaciones -webkit-
libros.js      100 fichas + disparadores contextuales + APLICAR (caso vivo)
sectores.js    sectores, empresas+perfil, escalafón, etapas+fases, mandatos
mundo.js       eras, noticias, rival, elenco
contenido.js   necesidades, segmentos, 52 apuestas, 35 dilemas
motor.js       simulación de un puesto (mes a mes): fit, difusión, Lupa,
               techo, perfiles, incidentes por sector, cap table
carrera.js     ofertas, cierres, promoción, equity, habilidades
logros.js      logros y récords (localStorage, entre carreras)
ui.js          render + un manejador de clicks delegado
icono.png      generado por scripts/make_icono_juego.py
```

Motor, Carrera y Mundo no tocan el DOM: se cargan en node para simular
carreras enteras y balancear (ver scratchpad sim2/sim3/dist del desarrollo).

## Balance verificado con bots

- Primer mandato jugando "por el libro" (descubrir → construir, priorizando
  prob×impacto÷esfuerzo alineado a la etapa): **~90%** de éxito.
- Carrera completa: patrimonio mediano ~$6M; alineado al mandato > rebelde
  > vago (~$0,7M con muchos despidos); limpio ≈ 2,4× turbio.
- El jackpot (~$80-120M) existe: fundar, que te compren, sobrevivir a la
  cascada de liquidación.

## En el iPad

Igual que el panel: Safari → `http://MacBook-Air-de-Lucas.local:8000/juego/`
→ Compartir → Añadir a pantalla de inicio. Guiado de acceso recomendado.
