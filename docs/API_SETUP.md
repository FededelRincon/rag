# 🔧 Configuración de APIs Externas

Esta guía te ayudará a configurar las APIs necesarias para el sistema RAG Básico.

## 🤖 OpenAI API

### 1. Crear cuenta y obtener API Key

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta o inicia sesión
3. Ve a [API Keys](https://platform.openai.com/api-keys)
4. Haz clic en "Create new secret key"
5. Copia la key (empieza con `sk-`)

### 2. Configurar límites y billing

1. Ve a [Billing](https://platform.openai.com/account/billing)
2. Agrega un método de pago
3. Configura límites de uso (recomendado: $10-20/mes para desarrollo)

### 3. Modelos utilizados

- **text-embedding-3-small**: Para generar embeddings ($0.00002 / 1K tokens)
- **gpt-3.5-turbo**: Para generar respuestas ($0.0015 / 1K tokens input, $0.002 / 1K tokens output)

### 4. Estimación de costos

Para un documento de 100 páginas (~50,000 tokens):

- Embeddings: ~$1.00
- 100 consultas de chat: ~$0.50
- **Total estimado**: $1.50 por documento

## 🌲 Pinecone API

### 1. Crear cuenta

1. Ve a [Pinecone](https://www.pinecone.io/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Obtener API Key

1. Ve al [Dashboard](https://app.pinecone.io/)
2. En la barra lateral, haz clic en "API Keys"
3. Copia tu API key

### 3. Crear índice

1. En el dashboard, haz clic en "Create Index"
2. Configura:
   - **Name**: `rag-basico` (o el nombre que prefieras)
   - **Dimensions**: `1536` (importante: debe ser exactamente 1536)
   - **Metric**: `cosine`
   - **Region**: `us-east-1` (recomendado para menor latencia)
3. Haz clic en "Create Index"

### 4. Plan gratuito

El plan gratuito incluye:

- 1 índice
- 100,000 vectores
- Suficiente para ~50-100 documentos PDF

### 5. Configuración avanzada (opcional)

Para producción, considera:

- **Metadata filtering**: Para múltiples usuarios
- **Namespaces**: Para separar documentos
- **Replicas**: Para mayor disponibilidad

## 🔐 Seguridad de API Keys

### Mejores prácticas

1. **Nunca commits API keys** al repositorio
2. **Usa variables de entorno** (`.env.local`)
3. **Rota las keys** regularmente
4. **Configura límites** de uso
5. **Monitorea el uso** regularmente

### Variables de entorno

```bash
# ❌ NUNCA hagas esto
OPENAI_API_KEY=sk-1234567890abcdef

# ✅ Usa archivos .env.local (no commiteados)
# .env.local
OPENAI_API_KEY=sk-tu-key-real-aqui
```

### Verificación de configuración

Usa nuestro script para verificar que todo esté configurado:

```bash
npm run check-config
```

## 🚨 Troubleshooting APIs

### OpenAI

#### Error 401: Unauthorized

- Verifica que la API key sea correcta
- Confirma que la key no haya expirado
- Revisa que tengas créditos disponibles

#### Error 429: Rate limit exceeded

- Espera unos minutos antes de reintentar
- Considera implementar rate limiting en tu app
- Revisa los límites de tu plan

#### Error 400: Invalid request

- Verifica que los parámetros sean correctos
- Confirma que el modelo esté disponible

### Pinecone

#### Error: Index not found

- Verifica que el nombre del índice sea correcto
- Confirma que el índice exista en tu dashboard

#### Error: Dimension mismatch

- El índice debe tener exactamente 1536 dimensiones
- Recrea el índice si es necesario

#### Error: Quota exceeded

- Verifica que no hayas excedido el límite de vectores
- Considera limpiar vectores antiguos
- Actualiza a un plan de pago si es necesario

## 📊 Monitoreo de uso

### OpenAI

- Ve a [Usage](https://platform.openai.com/account/usage)
- Revisa el consumo diario/mensual
- Configura alertas de billing

### Pinecone

- En el dashboard, ve a tu índice
- Revisa las métricas de uso
- Monitorea el número de vectores almacenados

## 🔄 Rotación de API Keys

### Proceso recomendado

1. Genera una nueva API key
2. Actualiza `.env.local` con la nueva key
3. Reinicia la aplicación
4. Verifica que funcione correctamente
5. Elimina la API key antigua

### Frecuencia recomendada

- **Desarrollo**: Cada 3-6 meses
- **Producción**: Cada 1-3 meses
- **Después de cualquier compromiso de seguridad**: Inmediatamente
