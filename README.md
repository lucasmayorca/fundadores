# Founders — a career in product

**Play it here: https://fundadores-production.up.railway.app/**

Career game for the browser, originally built for an iPad 3
(iOS 9.3.5), which is why it runs on anything. At home it's served by the
dashboard server (`localhost:8000/juego/`); on the internet, Railway with
this repo's `server.js` (`npm start` to run it locally).

You start as a Product Analyst and hop from startup to startup — like the
career in Soccer Superstar — up to CPO or founding your own thing. Each job
lasts 8-14 months, you get hired with a **mandate**, and at the end you're
judged: promotion, renewal, firing... or indictment.

## Publishing changes — ALWAYS everywhere

The game lives in a single folder but ships to **three places**, and a
change isn't done until it's reached all three:

| Place | Who sees it | How it updates |
|---|---|---|
| Dashboard server (Mac/iPad) | you, at home | on its own — serves this folder directly |
| GitHub (`lucasmayorca/fundadores`) | the public code | `git push` |
| Railway (public link) | anyone on the internet | `railway up` |

The checklist for EVERY change, no exceptions:

1. Bump the `?v=N` in `index.html` (busts the iPad and Railway caches).
2. Commit, push and deploy:

```bash
git add -A && git commit -m "qué cambió" && git push && railway up --detach
```

Skip the `git push` and GitHub becomes a liar; skip `railway up` and the
public link serves the old game. Railway does **not** deploy itself on
push (deploys go through the CLI, it's not connected to the repo) — if it
ever gets connected from the Railway dashboard, the `railway up` becomes
redundant, but until then you do both.

## Technical constraints (same as the dashboard)

iOS 9.3.5 / Safari 9: plain ES5 (no `let`/`const`, arrows, template
literals, `class` or `fetch`), flexbox with `-webkit-` prefixes, fixed
1024×768, no build step, no dependencies. All state in `localStorage`.
Script tags carry `?v=N` for cache busting: **bump the number whenever
you touch any file**.

## Personalized start (LinkedIn)

The start screen asks **Who are you?** (optional): paste your LinkedIn URL or
your current title, or tap a rung (APM -> Founder — every product position
maps to one: Product Owner->PM, Head of Product->Director, Principal/Lead->GPM,
and so on). Starting from zero is always available.

- On the **public deploy**, the Node server fetches the public LinkedIn page
  (`/api/perfil?u=...`) and extracts your name + headline server-side
  (LinkedIn may authwall; it degrades gracefully).
- On the **iPad/LAN** there is no endpoint: the client parses the URL slug
  for your name and the pasted title for your rung. Same experience, offline.
- Starting mid-ladder seeds reputation and skills to match, and your rival
  starts at your same level.

## Touch tooltips

Dotted-underlined labels (Retention, Runway, Political capital, the Heat,
prob/impact, commitment, Evidence, Debt, Load, Error budget...) show a
one-line explainer when tapped — 16 of them. No hover needed: it's an iPad.

## The monthly loop: 3 taps

1. **Stance for the month** (one button): Build / Discover / Clean up / Grow.
   They unlock as you climb and split the points on their own.
2. **Pick bets** until you fill the **commitment cap**. Each bet shows:
   **prob** (dots ●●●○○: how reliable the estimate is), **impact**
   (blocks ▂▄▆: how much it moves if it lands), **effort** (S/M/L/XL) and
   the **▲/▽** marker for stage alignment. Prioritizing by probability ×
   impact ÷ effort under a cap IS the game: with bots, doing it well
   delivers ~90% of the first mandates; ignoring it, ~45%.
3. **Close the month** and read what happened (real vs. expected impact).

## The briefing and the stages (PMF theory)

Accepting an offer brings up the **day-one briefing**: the company's phase
with its goal, a context mosaic (users/team/sector/mandate), which needs
pay off (▲) and which barely count (▽), the named cast, and a **"Where
this stage comes from"** block with the theory (Blank, Rachleff, Startup
Genome, Moore) applied to THAT company's numbers. The phase chip stays
pinned in the mandate bar and tapping it reopens the briefing.

The phases are mechanical, not decorative — the real impact of aligned
bets pays ×1.3 and misaligned ones ×0.5:

| Phase | Stage | Pays off | Barely counts |
|---|---|---|---|
| PRE-PMF | Seed | Core, Flow | Scale, Security |
| VALIDATING PMF | Series A | Flow, Data | Scale |
| SCALING | Series B | Integrations, Support, Security, Scale | — |

Scaling too early — the number one cause of death according to Startup
Genome — is now a mistake the game charges you for.

## Theory applied to the case (in three places)

1. **Book card**: besides the idea and how the game models it, an
   **"In your run, today"** block computed live from your numbers
   ("Your debt sits at 60: the team loses ~33% of capacity paying that
   interest"). 25 books have an applier (`APLICAR` in libros.js).
2. **Dilemma decision**: on choosing, the result shows **"The theory"**
   — the book's full concept + the line applied to your company.
3. **Stage briefing**: the phase's theory + the verdict on that
   specific company.

## The career system

- **8-level ladder**: each role defines your **control** (% of the area
  you answer for — the rest moves on its own) and which **stances** you
  get. Also what you SEE: revenue from PM, cash/runway from GPM, engine
  room from Sr PM. Gaining visibility is part of the prize.
- **Mandate + political capital**: spending outside the mandate — even
  when you're right — burns political capital; at zero you're fired.
  Growth mandates scale with the contract length and are only offered to
  roles with the levers to deliver them.
- **Short first job** (8-10 months): the first promotion comes fast.
- **Real equity**: 12-month cliff, 4-year vesting, dilution when the
  company raises without you, a final lottery based on the company's
  health when you leave. A founder with no purchase event stays on paper.
- **Skills** (product/tech/business/leadership): they grow based on what
  you spend your months on, with diminishing returns.

## The 7 sectors (2 companies each, all startups)

| Sector | The gate to the big market | Breaks with |
|---|---|---|
| Data and public opinion | Transparency audit | Campaign data scandal |
| Applied biogenetics | Regulatory validation and biosafety | Adverse event |
| Digital bank | License and fraud control | Fraud wave |
| Renewable energy | Verifiable proof of savings | Infrastructure outage |
| Devtools | Selling to the department, not the individual | Infrastructure outage |
| Betting and online gaming | License and addiction controls | The whale and the bonus loophole |
| Premium health (gold) | Impeccable medical trust | Adverse event with a VIP patient |

Each company also declares its **prioritization profile** in the offer:
commitment cap (22/30/40 pts per stage) and portfolio type — "few and
big" (28% of bets pay ×2, the rest almost nothing), "many and small",
"hard to estimate" or "balanced portfolio".

## The living world

- **6 eras** (Age of Empires): longevity boom, capital winter, election
  year, energy transition, gambling fever, year of the regulators. They
  heat/cool sectors, move capital and offers.
- **Named rival** (NFS): progresses in parallel, gains ground when you
  stumble, gets compared at the end.
- **Cast per company** (GTA): a named CEO, CTO, VP Sales and Staff
  Engineer bring the dilemmas. News ticker per era.

## The gray zone (GTA, Billions, Breaking Bad)

**The regulator's Heat** is your "wanted" level: shady shortcuts raise it
(cooking metrics, the stolen data room, bought users, the Dallas Buyers
Club-style buyers club, the CTO's Breaking Bad-style side business,
diluting your partner Social Network-style). At 40: inspections and
fines. At 55: the prosecutor offers a deal. At 85: a raid — and if they
find something, **indictment** (−22 reputation, −2 levels). The
temptation is always the first option and always pays today: in bots,
playing dirty ends at ~$6.8M and clean at ~$16.6M.

## The library: 100 cards

8 pillars: startup (19), product (24), tech (13), YC/essays (12),
growth (10), capital (5), people (9), stories (8). The 20 canonical ones
are wired to mechanics; the other 80 have a **contextual trigger**
(runway < 7 → *Default Alive or Default Dead?*; Heat ≥ 60 → *Bad Blood*;
firing → *Chaos Monkeys*). Max 2 per month. One career opens ~71;
completing it requires different playstyles across careers.

## Meta-game

16 achievements (Heisenberg, Clean hands, The house always wins, Close
call...), a hall of records that persists across careers, history of past
careers.

## Files

```
index.html     shell + web app metas (script tags with ?v=N)
estilos.css    dark theme, prefixed flexbox, -webkit- animations
libros.js      100 cards + contextual triggers + APLICAR (live case)
sectores.js    sectors, companies+profile, ladder, stages+phases, mandates
mundo.js       eras, news, rival, cast
contenido.js   needs, segments, 52 bets, 35 dilemmas
motor.js       simulation of one job (month by month): fit, diffusion, Heat,
               cap, profiles, per-sector incidents, cap table
carrera.js     offers, job closes, promotion, equity, skills
logros.js      achievements and records (localStorage, across careers)
ui.js          render + one delegated click handler
icono.png      generated by scripts/make_icono_juego.py
```

Motor, Carrera and Mundo never touch the DOM: they load in node to
simulate whole careers and balance the game (see the sim2/sim3/dist
scratchpad from development).

## Balance verified with bots

- First mandate playing "by the book" (discover → build, prioritizing
  prob×impact÷effort aligned to the stage): **~90%** success.
- Full career: median net worth ~$6M; aligned to the mandate > rebel
  > lazy (~$0.7M with lots of firings); clean ≈ 2.4× dirty.
- The jackpot (~$80-120M) exists: found, get acquired, survive the
  liquidation waterfall.

## On the iPad

Same as the dashboard: Safari → `http://MacBook-Air-de-Lucas.local:8000/juego/`
→ Share → Add to Home Screen. Guided Access recommended.
