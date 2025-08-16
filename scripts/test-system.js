#!/usr/bin/env node

/**
 * Script para facilitar el testing manual del sistema RAG Básico
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 Sistema de Testing Manual - RAG Básico\n");

// Verificar que el sistema esté configurado
const envPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("❌ Sistema no configurado. Ejecuta primero:");
  console.log("   npm run setup\n");
  process.exit(1);
}

console.log("📋 Checklist de Testing Disponible:");
console.log("   📄 docs/TESTING_CHECKLIST.md");
console.log("   🔗 http://localhost:3000 (asegúrate de que esté corriendo)\n");

console.log("🚀 Pasos para Testing Manual:");
console.log("1. Ejecutar: npm run dev");
console.log("2. Abrir: http://localhost:3000");
console.log("3. Seguir checklist en docs/TESTING_CHECKLIST.md");
console.log("4. Documentar resultados\n");

console.log("📁 PDFs de Prueba Sugeridos:");
console.log("- PDF pequeño: Manual de usuario, artículo corto");
console.log("- PDF mediano: Documento técnico, reporte");
console.log("- PDF grande: Libro, documentación extensa");
console.log("- PDF complejo: Con tablas, gráficos, múltiples columnas\n");

console.log("🔍 Áreas Críticas a Probar:");
console.log("✅ Upload y procesamiento de PDFs");
console.log("✅ Chat y generación de respuestas");
console.log("✅ Reemplazo de documentos");
console.log("✅ Manejo de errores");
console.log("✅ Estados de carga y feedback");
console.log("✅ Responsive design\n");

console.log("⚠️  Casos Edge Importantes:");
console.log("- PDFs sin texto extraíble");
console.log("- Errores de conexión");
console.log("- Archivos muy grandes");
console.log("- Preguntas sin respuesta en el documento\n");

console.log("📊 Métricas a Observar:");
console.log("- Tiempo de procesamiento de PDFs");
console.log("- Calidad de respuestas (scores de similitud)");
console.log("- Tiempo de respuesta del chat");
console.log("- Manejo de errores\n");

console.log("🎯 Criterios de Éxito:");
console.log("- Flujo completo funciona sin errores");
console.log("- Respuestas relevantes y precisas");
console.log("- UI intuitiva y responsive");
console.log("- Manejo robusto de errores\n");

console.log("📝 Para reportar issues:");
console.log("- Descripción clara del problema");
console.log("- Pasos para reproducir");
console.log("- Comportamiento esperado vs actual");
console.log("- Screenshots si es necesario\n");

console.log("🔧 Comandos Útiles Durante Testing:");
console.log("   npm run check-config  # Verificar configuración");
console.log("   npm run dev          # Ejecutar en desarrollo");
console.log("   npm run build        # Build para producción");
console.log("   npm run start        # Ejecutar build de producción\n");

console.log("✨ ¡Listo para comenzar el testing manual!");
console.log("   Abre docs/TESTING_CHECKLIST.md y comienza la validación.\n");
