# 🤖 Sistema RAG Básico

Un prototipo minimalista de sistema RAG (Retrieval-Augmented Generation) que permite subir documentos PDF y hacer consultas conversacionales sobre su contenido usando inteligencia artificial.

## ✨ Características

- 📄 **Procesamiento de PDFs**: Extracción de texto y división inteligente en chunks
- 🧠 **Embeddings Vectoriales**: Generación con OpenAI text-embedding-3-small
- 🔍 **Búsqueda Semántica**: Almacenamiento y búsqueda eficiente en Pinecone
- 💬 **Chat Inteligente**: Respuestas contextuales con GPT-3.5-turbo
- 📱 **Interfaz Responsive**: UI moderna y accesible con Tailwind CSS
- 🔄 **Reemplazo Automático**: Detección y limpieza automática al cambiar documentos
- ⚡ **Estados en Tiempo Real**: Indicadores de estado y progreso actualizados
- 🛡️ **Manejo de Errores**: Sistema robusto de manejo de errores y recuperación

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes (TypeScript)
- **AI/ML**: OpenAI API (embeddings + chat)
- **Vector DB**: Pinecone
- **Procesamiento**: pdf-parse, js-tiktoken, react-dropzone

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de OpenAI con API key
- Cuenta de Pinecone con API key

### 1. Clonar e instalar dependencias

```bash
git clone <repository-url>
cd rag-prototype
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con tus API keys
```

**Variables requeridas:**

```bash
# OpenAI API Key (obtener en: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Pinecone API Key (obtener en: https://app.pinecone.io/)
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=rag-basico
```

### 3. Configurar Pinecone

1. Crea una cuenta en [Pinecone](https://pinecone.io)
2. Crea un nuevo índice con estas especificaciones:
   - **Nombre**: `rag-basico` (o el que configures)
   - **Dimensiones**: `1536` (para text-embedding-3-small)
   - **Métrica**: `cosine`
   - **Región**: Cualquiera (recomendado: us-east-1)

### 4. Verificar configuración

```bash
# Verificar que todo está configurado correctamente
npm run check-config
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 6. Setup completo (alternativo)

```bash
# Instalar dependencias y verificar configuración en un comando
npm run setup
```

## 📖 Uso

### Flujo básico

1. **📄 Subir PDF**:

   - Ve a `/upload` o haz clic en "Subir PDF"
   - Arrastra un archivo PDF o haz clic para seleccionar
   - Máximo 10MB, solo archivos PDF
   - El sistema procesará automáticamente el documento

2. **💬 Hacer preguntas**:

   - Ve a `/chat` o haz clic en "Chat"
   - Escribe preguntas sobre el contenido del documento
   - El sistema buscará información relevante y generará respuestas

3. **🔄 Cambiar documento**:
   - Sube un nuevo PDF para reemplazar el anterior
   - El historial de chat se limpiará automáticamente
   - El indicador de estado se actualizará en tiempo real

### Características avanzadas

- **Scores de similitud**: Cada respuesta muestra qué tan relevante es la información encontrada
- **Manejo de errores**: El sistema maneja errores de conexión, archivos inválidos, etc.
- **Estados en tiempo real**: El indicador en la navegación muestra si hay un documento cargado
- **Navegación automática**: Después de subir un PDF, serás redirigido automáticamente al chat

## 🏗️ Arquitectura del Sistema

### Flujo de datos

```
[PDF Upload] → [Text Extraction] → [Chunking] → [Embeddings] → [Pinecone Storage]
                                                                        ↓
[User Query] → [Query Embedding] → [Similarity Search] → [Context] → [GPT Response]
```

### Componentes principales

#### Backend (API Routes)

- **`/api/upload`**: Procesa PDFs, genera embeddings y los almacena
- **`/api/chat`**: Maneja consultas y genera respuestas contextuales
- **`/api/status`**: Verifica el estado del documento actual

#### Frontend (React Components)

- **`UploadPage`**: Interfaz de carga con drag & drop
- **`ChatPage`**: Interfaz de chat con historial
- **`DocumentStatus`**: Indicador de estado en tiempo real
- **`ErrorAlert`**: Componente reutilizable para errores
- **`ErrorBoundary`**: Manejo global de errores de React

#### Librerías (Utilities)

- **`pdfProcessor`**: Extracción de texto y chunking
- **`vectorOperations`**: Operaciones con embeddings y Pinecone
- **`pinecone`**: Cliente y configuración de Pinecone
- **`constants`**: Configuración centralizada

## 📁 Estructura del Proyecto

```
rag-prototype/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── upload/route.ts    # Procesamiento de PDFs
│   │   │   ├── chat/route.ts      # Chat con IA
│   │   │   └── status/route.ts    # Estado del documento
│   │   ├── upload/page.tsx        # Página de carga
│   │   ├── chat/page.tsx          # Página de chat
│   │   ├── layout.tsx             # Layout principal
│   │   └── page.tsx               # Página de inicio
│   ├── components/           # Componentes reutilizables
│   │   ├── DocumentStatus.tsx     # Indicador de estado
│   │   ├── ErrorAlert.tsx         # Alertas de error
│   │   └── ErrorBoundary.tsx      # Manejo de errores
│   └── hooks/                # Custom hooks
│       └── useDocumentStatus.ts   # Hook de estado
├── lib/                      # Utilidades del servidor
│   ├── constants.ts              # Configuración
│   ├── pinecone.ts              # Cliente Pinecone
│   ├── pdfProcessor.ts          # Procesamiento PDF
│   └── vectorOperations.ts     # Operaciones vectoriales
├── scripts/                  # Scripts de utilidad
│   └── check-config.js          # Verificación de configuración
├── .env.example             # Variables de entorno
└── README.md               # Documentación
```

## Limitaciones

- Un solo documento a la vez
- Sin autenticación de usuarios
- Sin persistencia de historial entre sesiones
- Validación manual (sin tests automáticos)

## 🔧 Troubleshooting

### Problemas comunes

#### Error: "OPENAI_API_KEY is required"

- Verifica que hayas configurado la variable en `.env.local`
- Asegúrate de que la API key sea válida y tenga créditos
- Ejecuta `npm run check-config` para verificar

#### Error: "PINECONE_API_KEY is required"

- Configura tu API key de Pinecone en `.env.local`
- Verifica que el índice exista y tenga las dimensiones correctas (1536)
- Confirma que la métrica sea "cosine"

#### Error al procesar PDF

- Verifica que el archivo sea un PDF válido
- Confirma que el tamaño sea menor a 10MB
- Algunos PDFs escaneados pueden no tener texto extraíble

#### Chat no funciona / "No hay documento cargado"

- Asegúrate de haber subido un PDF primero
- Verifica que el procesamiento haya sido exitoso
- Revisa la consola del navegador para errores

### Scripts de utilidad

```bash
# Verificar configuración
npm run check-config

# Instalar y verificar en un paso
npm run setup

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build
npm start
```

## 🚀 Despliegue en Producción

### Variables de entorno adicionales

Para producción, copia `.env.production.example` y configura:

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### Consideraciones para producción

- **Autenticación**: Implementar sistema de usuarios
- **Rate Limiting**: Limitar requests por usuario/IP
- **Monitoreo**: Logs y métricas de uso
- **Backup**: Respaldo de vectores en Pinecone
- **Escalabilidad**: Considerar múltiples índices
- **Seguridad**: Validación adicional de archivos

## 📚 Recursos Adicionales

- [Documentación de OpenAI](https://platform.openai.com/docs)
- [Documentación de Pinecone](https://docs.pinecone.io/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Guía de RAG](https://www.pinecone.io/learn/retrieval-augmented-generation/)

## 🤝 Contribuir

Este es un prototipo educativo. Para mejoras:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Ejecuta las verificaciones
5. Crea un Pull Request

## 📄 Licencia

MIT License - Ver archivo LICENSE para detalles.
