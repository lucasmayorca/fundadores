/* Validador de submétricas derivadas
   Uso: node fundadores/validate-submetricas.js

   Verifica que:
   1. Cada apuesta declare impactoSubmetricas
   2. Cada submetrica referenciada existe
   3. No hay valores fuera de rango
*/

// Cargar archivos necesarios
var contenido = require('./contenido.js');

// Definir EJES (copia de ui.js)
var EJES_KEYS = ['adq', 'act', 'ret', 'rel', 'rev', 'ref', 'gate', 'evid', 'deuda'];
var EJES_SUBMETRICAS = {
  adq: ['cac', 'mix_canal', 'conv_rate', 'visit_signup'],
  act: ['time_value', 'feature_adopt', 'onboard', 'task_success'],
  ret: ['churn', 'dau_mau', 'reactivation', 'stickiness'],
  rel: ['uptime', 'error_rate', 'mttr', 'latency_p95'],
  rev: ['arpu', 'ltv_cac', 'expansion', 'payment_friction'],
  ref: ['viral_k', 'nps', 'referral_rate', 'neg_churn'],
  gate: ['gate_fit', 'gate_escala', 'gate_unit', 'gate_foso'],
  evid: ['reviews', 'cases', 'press', 'community'],
  deuda: ['deprecations', 'test_cov', 'security_p1', 'refactor_backlog']
};

function validarSubmetricas() {
  var errores = [];
  var warnings = [];
  var totalApuestas = 0;
  var conImpactos = 0;

  // Obtener todas las apuestas
  if (!window || !window.APUESTAS) {
    console.error('No se puede acceder a APUESTAS. Ejecutar en navegador con el juego cargado.');
    return { errores: ['Contexto incorrecto'], warnings: [] };
  }

  var apuestas = window.APUESTAS || [];
  totalApuestas = apuestas.length;

  for (var i = 0; i < apuestas.length; i++) {
    var a = apuestas[i];

    // Check 1: Tiene impactoSubmetricas
    if (!a.impactoSubmetricas || Object.keys(a.impactoSubmetricas).length === 0) {
      errores.push('Apuesta "' + a.id + '" (' + a.n + ') NO TIENE impactoSubmetricas');
      continue;
    }

    conImpactos++;

    // Check 2: Validar cada entrada
    var impactosPorEje = {};
    for (var key in a.impactoSubmetricas) {
      if (!a.impactoSubmetricas.hasOwnProperty(key)) continue;

      var valor = a.impactoSubmetricas[key];
      var partes = key.split(':');

      if (partes.length !== 2) {
        errores.push('Apuesta "' + a.id + '": formato inválido "' + key + '" (debe ser "eje:submetrica")');
        continue;
      }

      var ejeId = partes[0];
      var subId = partes[1];

      // Check 2a: Eje existe
      if (!EJES_SUBMETRICAS[ejeId]) {
        errores.push('Apuesta "' + a.id + '": eje "' + ejeId + '" NO EXISTE');
        continue;
      }

      // Check 2b: Submetrica existe
      if (EJES_SUBMETRICAS[ejeId].indexOf(subId) === -1) {
        errores.push('Apuesta "' + a.id + '": submetrica "' + subId + '" NO EXISTE en eje "' + ejeId + '"');
        continue;
      }

      // Check 2c: Valor es número
      if (typeof valor !== 'number' || !isFinite(valor)) {
        errores.push('Apuesta "' + a.id + '": valor de "' + key + '" no es número (es: ' + typeof valor + ')');
        continue;
      }

      // Check 2d: Valor en rango sensato
      if (Math.abs(valor) > 30) {
        warnings.push('Apuesta "' + a.id + '": impacto muy alto en "' + key + '" (' + valor + '). Típicamente [-20, +20].');
      }

      impactosPorEje[ejeId] = (impactosPorEje[ejeId] || 0) + valor;
    }

    // Check 3: Suma por eje coherente
    for (var ejeId in impactosPorEje) {
      if (!impactosPorEje.hasOwnProperty(ejeId)) continue;
      var suma = impactosPorEje[ejeId];
      if (Math.abs(suma) > 50) {
        warnings.push('Apuesta "' + a.id + '": impacto total en "' + ejeId + '" muy alto (' + suma + '). Típicamente [-30, +30].');
      }
    }
  }

  return {
    errores: errores,
    warnings: warnings,
    totalApuestas: totalApuestas,
    conImpactos: conImpactos
  };
}

function formatarReporte(resultado) {
  var lineas = [];
  lineas.push('');
  lineas.push('='.repeat(60));
  lineas.push('VALIDACIÓN DE SUBMÉTRICAS');
  lineas.push('='.repeat(60));
  lineas.push('Total apuestas: ' + resultado.totalApuestas);
  lineas.push('Con impactos: ' + resultado.conImpactos);
  lineas.push('');

  if (resultado.errores.length === 0) {
    lineas.push('✓ TODAS LAS APUESTAS VÁLIDAS');
  } else {
    lineas.push('✗ ERRORES (' + resultado.errores.length + '):');
    resultado.errores.forEach(function(e) {
      lineas.push('  • ' + e);
    });
  }

  if (resultado.warnings.length > 0) {
    lineas.push('');
    lineas.push('⚠ WARNINGS (' + resultado.warnings.length + '):');
    resultado.warnings.forEach(function(w) {
      lineas.push('  • ' + w);
    });
  }

  lineas.push('');
  lineas.push('='.repeat(60));
  lineas.push('');

  return lineas.join('\n');
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validarSubmetricas: validarSubmetricas,
    formatarReporte: formatarReporte
  };
}
