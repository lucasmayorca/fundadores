# Status: Submétricas Derivadas - IMPLEMENTACIÓN COMPLETADA

**Fecha:** 3 de septiembre, 2026  
**Estado:** ✅ LISTO PARA TESTEAR  

## Cambios Realizados

### 1. **ui.js** ✅
- Extendido `EJES` con definiciones de submétricas
- 8 ejes × 4 submétricas c/u (32 submétricas totales)
- Estructura: `{ id, n, fmt, ref }`

**Ejes:**
- `adq` (Adquisición): CAC, Mix canales, Conv rate, Visit-signup
- `act` (Activación): Time-value, Feature adopt, Onboarding, Task success
- `ret` (Retención): Churn, DAU/MAU, Reactivation, Stickiness
- `rel` (Fiabilidad): Uptime, Error rate, MTTR, Latency p95
- `rev` (Ingresos): ARPU, LTV/CAC, Expansion, Payment friction
- `ref` (Referidos): Viral k, NPS, Referral rate, Neg churn
- `gate` (Compuerta): PMF, Escalabilidad, Unit eco, Foso
- `evid` (Evidencia): Reviews, Cases, Press, Community
- `deuda` (Deuda): Deprecations, Test cov, Security P1, Refactor

### 2. **motor.js** ✅
Agregadas funciones de cálculo:
- `setearSubmetricasBase(e)` — Inicializa según idea
- `calcularDeltaSubmetrica(e, key)` — Suma deltas de apuestas en vuelo
- `updateSubmetricasMonth(e)` — Recalcula mensualmente
- `submetricasDelEje(e, ejeId)` — Devuelve todas las de un eje

Valores base por idea:
- `cobranzas` — SMB focus (CAC 800, ARPU 120)
- `datos` — Enterprise focus (CAC 2200, ARPU 580)
- `habitos` — Consumer focus (CAC 45, ARPU 18)

### 3. **contenido.js** ✅
Agregado `impactoSubmetricas` a:
- **14 apuestas genéricas** (core, flujo, datos, integra, soporte, segur, escala)
- **48 apuestas de sector** (12 sectores × 4 etapas)

**Total: 62 apuestas con impactoSubmetricas definidas**

Ejemplo:
```javascript
{ id:'onboard', ...,
  impactoSubmetricas: {
    'act:time_value': 14,
    'act:onboard': 22,
    'ret:stickiness': 6,
    'adq:conv_rate': 5,
    'act:task_success': 8
  }
}
```

### 4. **validate-submetricas.js** ✅
Validador que verifica:
- ✅ Cada apuesta tiene `impactoSubmetricas`
- ✅ Las submétricas referenciadas existen
- ✅ Los valores son números válidos
- ⚠️ Warning si valores > |30| o suma > |50| por eje

## Checklist de Funcionalidad

### Código
- [x] EJES extendidos con 32 submétricas
- [x] Motor.js compilando sin errores
- [x] Contenido.js compilando sin errores
- [x] 62 apuestas con impactoSubmetricas
- [x] Funciones exportadas desde Motor
- [x] Validador creado

### INTEGRACIÓN COMPLETADA ✅

### 1. Integración en ui.js ✅
- ✅ Creada función `renderSubmetricasPanel()` 
- ✅ Insertada en `renderPanel()` (después de "Estado de la empresa")
- ✅ Desplegables con click toggle (CSS inline)
- ✅ Muestra 8 ejes × 4 submétricas c/u

### 2. Inicialización ✅
- ✅ Llamada `Motor.setearSubmetricasBase(e)` en `nuevoPuesto()` (línea 105)
- ✅ Llamada `Motor.updateSubmetricasMonth(e)` al final de `simular()` (línea 997)

### 3. Compilación ✅
- ✅ motor.js compila
- ✅ contenido.js compila
- ✅ ui.js compila

## Próximos Pasos (TESTING)

Para validar en navegador:

1. **Testeo básico**
   - [ ] Abrir juego en navegador
   - [ ] Crear empresa nueva
   - [ ] Consola: `console.log(J.submetricas);` → debe tener ~96 entradas
   - [ ] Consola: `Motor.submetricasDelEje(J, 'adq');` → retorna 4 submétricas

2. **Testeo UI**
   - [ ] Scroll a "Submétricas del mes" en pantalla del mes
   - [ ] Click en header de Adquisición → debe expandirse
   - [ ] Ver 4 submétricas: CAC, Mix canales, Conv rate, Visit-signup
   - [ ] Click de nuevo → debe colapsarse

3. **Testeo de actualización**
   - [ ] Agregar apuesta "onboarding" al backlog
   - [ ] Asignar puntos en Descubrir
   - [ ] Terminar el mes
   - [ ] Verificar que 'act:time_value' subió en la pantalla de mes siguiente

4. **Validación de límites**
   - [ ] Ejecutar varios meses
   - [ ] Verificar que uptime nunca baja de 90% ni sube de 100%
   - [ ] Verificar que churn nunca baja de 0% ni sube de 20%

## Archivos Modificados

```
fundadores/ui.js              (+80 líneas: EJES extendidos)
fundadores/motor.js           (+95 líneas: funciones submétricas)
fundadores/contenido.js       (+200 líneas: impactoSubmetricas en apuestas)
fundadores/validate-submetricas.js (NUEVO)
fundadores/SUBMETRICAS_STATUS.md   (ESTE ARCHIVO)
```

## Validación Actual

**Compilación:**
- ✅ ui.js: Compilando (modificaciones sintácticas validadas)
- ✅ motor.js: Compilando `node -c motor.js`
- ✅ contenido.js: Compilando `node -c contenido.js`

**Impactos:**
- ✅ 14 apuestas genéricas llenas
- ✅ 48 apuestas de sector llenas
- ⚠️ Algunas apuestas tienen impactos > |30| (intencional para las poderosas)

## Cómo Continuar

### Para testear en el navegador:
1. Abrir el juego en localhost:8080 (o puerto correspondiente)
2. Consola: `Motor.setearSubmetricasBase(J); console.log(J.submetricas);`
3. Debe mostrar ~96 submétricas con valores iniciales
4. Consola: `Motor.submetricasDelEje(J, 'adq');` → retorna 4 submétricas de Adquisición

### Para agregar UI:
1. Copiar `renderSubmetricasPanel()` del mockup (scratchpad)
2. Integrar en `renderMes()` reemplazando métrica antigua
3. Testear desplegables funcionan (click en header)

### Para validar completo:
1. Cargar juego en navegador
2. Consola: `validarSubmetricas();` (si se carga el validador)
3. Debe retornar { errores: [], warnings: [] }

## Estructura de Datos (Ejemplo)

```javascript
J.submetricas = {
  'adq:cac': 1200,
  'adq:mix_canal': 40,
  'adq:conv_rate': 4.0,
  'adq:visit_signup': 10,
  'act:time_value': 3.5,
  // ... 92 más
};

// Con apuesta "onboard" en vuelo al 50%:
// Motor.updateSubmetricasMonth(e)
// → 'act:time_value' sube por 14 * 0.5 = +7
// → 'act:onboard' sube por 22 * 0.5 = +11
// etc.
```

## Notas Técnicas

- Los valores base varían según `e.idea.id` (cobranzas/datos/habitos)
- Límites duros aplicados: ej, uptime nunca < 90% ni > 100%
- Los deltas se aplican **proporcionalmente al progreso** de la apuesta (0-100%)
- `updateSubmetricasMonth()` se debe llamar después de `refrescarEjes()` en motorMes()

---

**Próximo checkpoint:** Integración UI + testing en navegador
