export const CONFIG = {
  CHUNK_SIZE: parseInt(process.env.CHUNK_SIZE || '400'),
  CHUNK_OVERLAP: parseInt(process.env.CHUNK_OVERLAP || '80'),
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  SUPPORTED_TYPES: ["application/pdf"] as const,
  EMBEDDING_MODEL: "text-embedding-3-small" as const,
  CHAT_MODEL: "gpt-3.5-turbo" as const,
  MAX_TOKENS_RESPONSE: 256,
  PINECONE_NAMESPACE: "rag-basico",
} as const;
