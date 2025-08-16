# ✅ Checklist de Validación Manual

Esta checklist cubre todos los aspectos del sistema que deben ser probados manualmente antes del despliegue.

## 🚀 Preparación para Testing

### Pre-requisitos

- [ ] Sistema configurado con API keys válidas
- [ ] `npm run check-config` ejecutado exitosamente
- [ ] Aplicación corriendo en `http://localhost:3000`
- [ ] PDFs de prueba disponibles (diferentes tamaños y tipos)

### PDFs de Prueba Recomendados

- [ ] PDF pequeño (< 1MB, pocas páginas)
- [ ] PDF mediano (2-5MB, 10-20 páginas)
- [ ] PDF grande (8-10MB, 50+ páginas)
- [ ] PDF con texto complejo (tablas, gráficos)
- [ ] PDF escaneado (para probar extracción de texto)

## 📄 1. Funcionalidad de Upload

### 1.1 Upload Exitoso

- [ ] Arrastrar PDF válido a la zona de drop
- [ ] Hacer clic para seleccionar PDF
- [ ] Verificar que se muestre información del archivo
- [ ] Confirmar que el botón "Procesar" esté habilitado
- [ ] Hacer clic en "Procesar Documento"
- [ ] Verificar indicador de "Procesando..."
- [ ] Confirmar mensaje de éxito con número de chunks
- [ ] Verificar redirección automática al chat (2 segundos)

### 1.2 Validación de Archivos

- [ ] Intentar subir archivo no-PDF (debe fallar)
- [ ] Intentar subir PDF > 10MB (debe fallar)
- [ ] Verificar mensajes de error específicos
- [ ] Confirmar que el botón "Procesar" esté deshabilitado

### 1.3 Estados de Carga

- [ ] Verificar que el botón se deshabilite durante procesamiento
- [ ] Confirmar que se muestre "Procesando..." durante upload
- [ ] Verificar que no se pueda subir otro archivo durante procesamiento

### 1.4 Manejo de Errores

- [ ] Desconectar internet durante upload (simular error de red)
- [ ] Subir PDF corrupto o dañado
- [ ] Verificar que se muestren mensajes de error apropiados
- [ ] Confirmar que se pueda reintentar después de error

## 💬 2. Funcionalidad de Chat

### 2.1 Chat Básico

- [ ] Acceder a `/chat` con documento cargado
- [ ] Escribir pregunta simple sobre el documento
- [ ] Verificar que se muestre "Pensando..." durante procesamiento
- [ ] Confirmar que se reciba respuesta relevante
- [ ] Verificar que se muestre score de similitud
- [ ] Confirmar que el historial se mantenga

### 2.2 Diferentes Tipos de Preguntas

- [ ] Pregunta directa sobre contenido específico
- [ ] Pregunta que requiera inferencia
- [ ] Pregunta sobre información no presente (debe indicar falta de info)
- [ ] Pregunta muy general
- [ ] Pregunta muy específica

### 2.3 Historial de Conversación

- [ ] Hacer múltiples preguntas
- [ ] Verificar que se mantenga el orden cronológico
- [ ] Confirmar scroll automático a mensajes nuevos
- [ ] Verificar que se distingan mensajes de usuario vs asistente

### 2.4 Estados de Carga

- [ ] Verificar indicador "Pensando..." durante consultas
- [ ] Confirmar que el input se deshabilite durante procesamiento
- [ ] Verificar que el botón "Enviar" se deshabilite apropiadamente

### 2.5 Sin Documento

- [ ] Acceder a `/chat` sin documento cargado
- [ ] Verificar mensaje "No hay documento cargado"
- [ ] Confirmar enlace a página de upload
- [ ] Verificar que no se pueda enviar mensajes

## 🔄 3. Reemplazo de Documentos

### 3.1 Cambio de Documento

- [ ] Subir primer PDF y hacer algunas preguntas
- [ ] Subir segundo PDF diferente
- [ ] Verificar que el historial de chat se limpie automáticamente
- [ ] Confirmar que el indicador de estado se actualice
- [ ] Hacer preguntas sobre el nuevo documento
- [ ] Verificar que las respuestas sean del nuevo documento

### 3.2 Sincronización de Estado

- [ ] Verificar que el indicador en la navegación se actualice
- [ ] Confirmar que el estado se sincronice entre pestañas (si aplica)
- [ ] Verificar polling automático de estado

## 🌐 4. Navegación y UI

### 4.1 Navegación

- [ ] Navegar entre páginas usando el menú
- [ ] Verificar que los enlaces funcionen correctamente
- [ ] Confirmar que el indicador de estado sea visible
- [ ] Verificar responsive design en móvil

### 4.2 Estados Visuales

- [ ] Verificar indicador "Sin documento" cuando no hay PDF
- [ ] Confirmar indicador "Documento cargado" cuando hay PDF
- [ ] Verificar tooltips con información del documento
- [ ] Confirmar estados de hover en botones y enlaces

### 4.3 Página de Inicio

- [ ] Verificar que la página de inicio se cargue correctamente
- [ ] Confirmar que los enlaces a Upload y Chat funcionen
- [ ] Verificar información del proyecto y tecnologías

## ⚠️ 5. Manejo de Errores

### 5.1 Errores de Conexión

- [ ] Desconectar internet durante chat
- [ ] Verificar mensaje de error de conexión
- [ ] Confirmar opción de reintentar
- [ ] Verificar que funcione después de reconectar

### 5.2 Errores de API

- [ ] Configurar API key inválida (temporalmente)
- [ ] Verificar manejo de errores de OpenAI
- [ ] Confirmar mensajes de error apropiados
- [ ] Restaurar configuración válida

### 5.3 Errores de Validación

- [ ] Intentar enviar mensaje vacío (debe estar deshabilitado)
- [ ] Verificar validación de archivos
- [ ] Confirmar mensajes de error específicos

## 📊 6. Performance y Límites

### 6.1 Diferentes Tamaños de PDF

- [ ] Probar PDF pequeño (< 1MB) - debe procesar rápido
- [ ] Probar PDF mediano (2-5MB) - tiempo razonable
- [ ] Probar PDF grande (8-10MB) - puede tomar más tiempo
- [ ] Verificar que no haya timeouts

### 6.2 Calidad de Respuestas

- [ ] Verificar relevancia de respuestas
- [ ] Confirmar scores de similitud apropiados (> 0.7 para buenas respuestas)
- [ ] Verificar que respuestas sean en español
- [ ] Confirmar que se indique cuando no hay información suficiente

### 6.3 Límites del Sistema

- [ ] Probar con PDF de exactamente 10MB
- [ ] Intentar múltiples uploads rápidos
- [ ] Verificar comportamiento con muchas preguntas seguidas

## 🔧 7. Configuración y Setup

### 7.1 Verificación de Configuración

- [ ] Ejecutar `npm run check-config`
- [ ] Verificar que todas las variables estén configuradas
- [ ] Confirmar que no haya warnings de configuración

### 7.2 Scripts de Utilidad

- [ ] Probar `npm run setup`
- [ ] Verificar `npm run dev`
- [ ] Confirmar `npm run build` (si aplica)

## 📱 8. Responsive Design

### 8.1 Móvil

- [ ] Probar en pantalla móvil (< 768px)
- [ ] Verificar que la navegación sea usable
- [ ] Confirmar que el chat sea funcional
- [ ] Verificar que el upload funcione en móvil

### 8.2 Tablet

- [ ] Probar en pantalla tablet (768px - 1024px)
- [ ] Verificar layout apropiado
- [ ] Confirmar funcionalidad completa

### 8.3 Desktop

- [ ] Probar en pantalla grande (> 1024px)
- [ ] Verificar que el diseño se vea bien
- [ ] Confirmar que todos los elementos sean accesibles

## 🎯 9. Casos Edge

### 9.1 PDFs Problemáticos

- [ ] PDF sin texto extraíble (solo imágenes)
- [ ] PDF con caracteres especiales
- [ ] PDF con múltiples idiomas
- [ ] PDF con formato complejo (tablas, columnas)

### 9.2 Consultas Problemáticas

- [ ] Pregunta muy larga (> 500 caracteres)
- [ ] Pregunta con caracteres especiales
- [ ] Pregunta en idioma diferente al español
- [ ] Múltiples preguntas muy rápidas

### 9.3 Estados Inusuales

- [ ] Recargar página durante procesamiento
- [ ] Cerrar y reabrir navegador
- [ ] Múltiples pestañas abiertas
- [ ] Navegación con botones del navegador

## ✅ Criterios de Aceptación

### Funcionalidad Core

- [ ] Upload de PDF funciona correctamente
- [ ] Extracción y procesamiento de texto exitoso
- [ ] Chat genera respuestas relevantes
- [ ] Reemplazo de documentos funciona

### Experiencia de Usuario

- [ ] Interfaz intuitiva y fácil de usar
- [ ] Estados de carga claros
- [ ] Mensajes de error útiles
- [ ] Navegación fluida

### Robustez

- [ ] Manejo apropiado de errores
- [ ] Performance aceptable
- [ ] Funciona en diferentes dispositivos
- [ ] Configuración verificable

## 📝 Reporte de Testing

### Formato de Reporte

Para cada item probado, documentar:

- ✅ **Pasó**: Funciona como esperado
- ⚠️ **Advertencia**: Funciona pero con issues menores
- ❌ **Falló**: No funciona, requiere corrección

### Issues Encontrados

Documentar cualquier problema encontrado con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Severidad (Alta/Media/Baja)

---

**Nota**: Esta validación debe realizarse antes de cualquier despliegue o demo del sistema.
