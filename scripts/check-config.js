#!/usr/bin/env node

/**
 * Script para verificar la configuración del sistema RAG Básico
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Verificando configuración del sistema RAG Básico...\n");

// Verificar archivo .env.local
const envPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("❌ Archivo .env.local no encontrado");
  console.log("💡 Copia .env.example a .env.local y configura tus API keys\n");
  process.exit(1);
}

// Cargar variables de entorno
require("dotenv").config({ path: envPath });

const requiredVars = [
  "OPENAI_API_KEY",
  "PINECONE_API_KEY",
  "PINECONE_INDEX_NAME",
];

const optionalVars = ["CHUNK_SIZE", "CHUNK_OVERLAP", "MAX_FILE_SIZE"];

let hasErrors = false;

console.log("📋 Variables requeridas:");
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.error(`❌ ${varName}: No configurada`);
    hasErrors = true;
  } else if (value.includes("your_") || value.includes("_here")) {
    console.error(
      `❌ ${varName}: Usar valor de ejemplo, configurar con valor real`
    );
    hasErrors = true;
  } else {
    const maskedValue = varName.includes("KEY")
      ? value.substring(0, 8) + "..."
      : value;
    console.log(`✅ ${varName}: ${maskedValue}`);
  }
});

console.log("\n📋 Variables opcionales:");
optionalVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: Usando valor por defecto`);
  }
});

// Verificar valores de configuración
console.log("\n🔧 Verificando valores de configuración:");

const chunkSize = parseInt(process.env.CHUNK_SIZE || "400");
const chunkOverlap = parseInt(process.env.CHUNK_OVERLAP || "80");
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "10485760");

if (chunkSize < 100 || chunkSize > 1000) {
  console.warn(
    `⚠️  CHUNK_SIZE (${chunkSize}) fuera del rango recomendado (100-1000)`
  );
}

if (chunkOverlap >= chunkSize) {
  console.error(
    `❌ CHUNK_OVERLAP (${chunkOverlap}) debe ser menor que CHUNK_SIZE (${chunkSize})`
  );
  hasErrors = true;
}

if (maxFileSize > 50 * 1024 * 1024) {
  console.warn(
    `⚠️  MAX_FILE_SIZE (${Math.round(
      maxFileSize / 1024 / 1024
    )}MB) es muy grande, puede causar timeouts`
  );
}

console.log(`✅ Chunk size: ${chunkSize} tokens`);
console.log(`✅ Chunk overlap: ${chunkOverlap} tokens`);
console.log(`✅ Max file size: ${Math.round(maxFileSize / 1024 / 1024)}MB`);

if (hasErrors) {
  console.error(
    "\n❌ Configuración incompleta. Corrige los errores antes de continuar."
  );
  process.exit(1);
} else {
  console.log("\n✅ Configuración válida. El sistema está listo para usar.");
}
