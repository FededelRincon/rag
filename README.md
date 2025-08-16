# Sistema RAG Básico

Un prototipo minimalista de sistema RAG (Retrieval-Augmented Generation) que permite subir documentos PDF y hacer consultas conversacionales sobre su contenido.

## Características

- 🔄 **Procesamiento de PDFs**: Extracción de texto y división en chunks
- 🧠 **Embeddings Vectoriales**: Generación con OpenAI text-embedding-3-small
- 🔍 **Búsqueda Semántica**: Almacenamiento y búsqueda en Pinecone
- 💬 **Chat Inteligente**: Respuestas contextuales con GPT-3.5-turbo
- 📱 **Interfaz Responsive**: UI moderna con Tailwind CSS

## Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes (TypeScript)
- **AI/ML**: OpenAI API (embeddings + chat)
- **Vector DB**: Pinecone
- **Procesamiento**: pdf-parse, js-tiktoken, react-dropzone

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env.local` y configura:

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-your_openai_api_key_here

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=rag-basico

# App Configuration (opcional)
CHUNK_SIZE=400
CHUNK_OVERLAP=80
MAX_FILE_SIZE=10485760
```

### 3. Configurar Pinecone

1. Crea una cuenta en [Pinecone](https://pinecone.io)
2. Crea un nuevo índice con:
   - **Dimensiones**: 1536 (para text-embedding-3-small)
   - **Métrica**: cosine
   - **Nombre**: rag-basico (o el que configures en PINECONE_INDEX_NAME)

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Uso

1. **Subir PDF**: Ve a `/upload` y arrastra un archivo PDF (máx. 10MB)
2. **Hacer preguntas**: Ve a `/chat` y pregunta sobre el contenido del documento
3. **Ver respuestas**: El sistema buscará información relevante y generará respuestas contextuales

## Estructura del Proyecto

```
rag-prototype/
├── src/app/
│   ├── api/
│   │   ├── upload/route.ts    # Endpoint para subir PDFs
│   │   ├── chat/route.ts      # Endpoint para chat
│   │   └── status/route.ts    # Endpoint para estado
│   ├── upload/page.tsx        # Página de carga
│   ├── chat/page.tsx          # Página de chat
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página de inicio
├── lib/
│   ├── constants.ts           # Configuración
│   ├── pinecone.ts           # Cliente Pinecone
│   ├── pdfProcessor.ts       # Procesamiento PDF
│   └── vectorOperations.ts  # Operaciones vectoriales
└── .env.example              # Variables de entorno
```

## Limitaciones

- Un solo documento a la vez
- Sin autenticación de usuarios
- Sin persistencia de historial entre sesiones
- Validación manual (sin tests automáticos)

## Desarrollo

Este es un prototipo para demostración. Para producción considera:

- Autenticación y autorización
- Base de datos para persistencia
- Tests automáticos
- Manejo de errores más robusto
- Rate limiting
- Monitoreo y logging
