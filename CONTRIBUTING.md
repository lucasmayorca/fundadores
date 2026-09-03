# Cómo trabajamos tres personas en paralelo

Este repo se toca desde tres frentes a la vez. Lo que sigue existe para que eso
no termine en conflictos de merge ni en un `main` roto.

## La idea en una línea

`main` siempre anda y siempre está desplegado. Todo lo demás entra por una rama
corta con Pull Request.

## Los tres carriles

El reparto no es arbitrario: sale de medir qué archivo referencia a cuál. Cada
carril es dueño de archivos **distintos**, así dos personas casi nunca editan
las mismas líneas.

| Carril | Archivos propios | De qué se ocupa |
|---|---|---|
| **Contenido** | `sectores.js` `libros.js` `contenido.js` | El mundo: sectores, las 60 empresas, el escalafón, las apuestas, los dilemas, las 105 fichas de la biblioteca |
| **Motor** | `motor.js` `carrera.js` `mundo.js` `logros.js` | La simulación y el balance: el mes, el fit, la Lupa, ofertas, ascensos, equity, eras, logros |
| **Interfaz / Plataforma** | `ui.js` `estilos.css` `index.html` `server.js` `ranking.js` `propuestas.js` | Lo que se ve y lo que sirve: pantallas, estilos, el servidor, el ranking público y las propuestas de la comunidad |

Quién es quién está en [`.github/CODEOWNERS`](.github/CODEOWNERS). GitHub pide
sola la review del dueño de cada archivo que toca el PR.

## Las ramas

No hay una rama permanente por persona: las ramas personales de larga vida se
alejan de `main` y después el merge duele. Lo que hay es un **prefijo por
carril** y ramas cortas, de días, no de semanas.

```
main                        ← protegida, siempre desplegable, deploy automático
├── feat/contenido/<tema>   ← carril Contenido
├── feat/motor/<tema>       ← carril Motor
├── feat/ui/<tema>          ← carril Interfaz / Plataforma
└── fix/<tema>              ← arreglos puntuales, cualquiera
```

Ejemplos: `feat/contenido/sector-logistica`, `feat/motor/rebalance-runway`,
`feat/ui/pantalla-final-movil`, `fix/ranking-token-vacio`.

## El ciclo de trabajo

```bash
git checkout main && git pull                 # arrancá siempre desde main al día
git checkout -b feat/motor/rebalance-runway   # rama con el prefijo de tu carril
# ... trabajás ...
npm test                                      # el test de humo tiene que pasar
git add -A && git commit -m "Qué cambió y por qué"
git push -u origin feat/motor/rebalance-runway
gh pr create --fill                           # o desde la web
```

Cuando el PR está aprobado y el CI en verde: **Squash and merge**. Un cambio =
un commit en `main`, así el historial se lee.

Después de mergear:

```bash
git checkout main && git pull
git branch -d feat/motor/rebalance-runway
```

## Cómo evitar pisarse

- **Antes de empezar, `git pull`.** La mayoría de los conflictos son de ramas
  viejas, no de dos personas en la misma función.
- **Si tu rama se quedó atrás**, traé main con `git pull --rebase origin main`
  antes de pedir la review.
- **Ramas cortas.** Una rama de tres días casi nunca conflictúa; una de tres
  semanas, siempre.
- **Si necesitás tocar el archivo de otro carril**, avisale antes en el PR y
  marcá los dos carriles en la plantilla. No es prohibido: es que se avisa.

### Los contratos entre carriles

Los archivos son distintos, pero los módulos se hablan. Estos son los puntos
donde un cambio tuyo rompe el carril de al lado:

- `contenido.js` y `motor.js` se llaman mutuamente (unas 50 veces cada uno).
  Si cambiás lo que devuelve `Motor`, avisá al carril Contenido.
- `ui.js` consume **todo** (unas 160 referencias). Cualquier cambio en la
  superficie pública de `Motor`, `Carrera`, `Mundo`, `Logros` o `Ranking`, o en
  los nombres de `SECTORES` / `EMPRESAS` / `APUESTAS` / `EVENTOS`, llega a la
  interfaz. El test de humo verifica que esa superficie siga existiendo.
- Agregar cosas es seguro. Renombrar y borrar es lo que rompe.

## Desarrollo colaborativo: propuestas de la comunidad

El juego tiene un segundo circuito además de la carrera: los jugadores
proponen mejoras al juego (texto libre) y votan las propuestas de otros,
desde el panel que aparece al subir de escalón. El modelo vive en
`server.js` (`propuestas.json`, mismo volumen que `ranking.json`) y el
cliente en `propuestas.js`.

Cada semana, un agente de IA toma la propuesta más votada, la pre-screenea
contra estas mismas reglas (sin dependencias, sin build, capas en un solo
sentido), la implementa en una rama `feat/comunidad/<semana>-<slug>` y abre
un PR contra `main` — **esas ramas y esos PRs no los abre una persona**. El
único paso humano es la review: cuando Lucas lo aprueba y mergea, Railway
despliega solo, igual que cualquier otro PR.

Si ves un PR de `feat/comunidad/*`, revisalo con el mismo criterio que
cualquier otro: que pase `npm test`, que respete las capas y los carriles de
arriba, y que el cambio sea lo que la propuesta pedía.

## El deploy

- Producción: https://fundadores-production.up.railway.app/

**Mergear no alcanza: hay que verificar que salió.** Este documento afirmaba
que Railway desplegaba solo con cada entrada a `main`, y durante meses no fue
cierto — el servicio se desplegaba a mano con `railway up` y nadie lo había
anotado. Dos sesiones distintas perdieron tiempo el 2026-09-03 confiando en
esta línea, así que ahora dice lo que realmente hay que hacer.

Después de mergear, confirmá que producción tomó el cambio:

```
curl -s -o /dev/null -w "%{http_code}\n" https://fundadores-production.up.railway.app/ui.js
railway deployment list | head -3
```

Si el último deploy no es posterior a tu merge, no salió. En ese caso:

```
cd fundadores && railway up
```

El repo quedó conectado a Railway el 2026-09-03 (Settings → Source →
`lucasmayorca/fundadores`, branch `main`), así que el auto-deploy debería
disparar solo. Mientras el dashboard siga mostrando **"Auto deploy
unavailable"**, no confíes en eso: verificá siempre, y si no salió, subilo a
mano. Cuando el auto-deploy quede confirmado funcionando, esta sección se
puede simplificar — pero recién ahí, y con una verificación real encima.

## Reglas del proyecto

Estas no se negocian sin hablarlo, porque son la razón de que el juego cargue
en cualquier cosa y no tenga mantenimiento:

1. **Sin dependencias.** Ni npm packages, ni CDN, ni frameworks.
2. **Sin build step.** Los archivos que escribís son los que se sirven.
3. **JavaScript plano.** Nada que necesite transpilarse.
4. **Nada de `?v=N` en `index.html`.** El caché lo maneja el servidor con ETag
   y `no-cache`. Ese contador obligaba a tocar las mismas diez líneas en cada
   cambio y era el conflicto garantizado de todos los PR. El test de humo falla
   si vuelve.

## Correrlo en local

```bash
npm start
```

Y abrí http://localhost:3000. Para el test de humo:

```bash
npm test
```
