import OpenAI from 'openai';
import { pineconeIndex, NAMESPACE } from './pinecone';
import { CONFIG } from './constants';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface SearchResult {
    text: string;
    similarity: number;
    filename: string;
    chunkIndex: number;
}

export interface StoreEmbeddingsResult {
    documentId: string;
    chunksStored: number;
}

export interface VectorMetadata {
    text: string;
    filename: string;
    chunkIndex: number;
    documentId: string;
    timestamp: string;
    totalChunks: number;
    [key: string]: any; // Index signature for Pinecone compatibility
}

/**
 * Generate embedding for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await openai.embeddings.create({
            model: CONFIG.EMBEDDING_MODEL,
            input: text,
        });

        return response.data[0].embedding;
    } catch (error) {
        throw new Error(`Error generating embedding: ${(error as Error).message}`);
    }
}

/**
 * Store embeddings in Pinecone
 */
export async function storeEmbeddings(
    chunks: string[],
    filename: string
): Promise<StoreEmbeddingsResult> {
    try {
        const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        const vectors = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const embedding = await generateEmbedding(chunk);

            vectors.push({
                id: `${documentId}_chunk_${i}`,
                values: embedding,
                metadata: {
                    text: chunk,
                    filename: filename,
                    chunkIndex: i,
                    documentId: documentId,
                    timestamp: new Date().toISOString(),
                    totalChunks: chunks.length,
                } as VectorMetadata,
            });
        }

        await pineconeIndex.namespace(NAMESPACE).upsert(vectors);

        return {
            documentId,
            chunksStored: vectors.length,
        };
    } catch (error) {
        throw new Error(`Error storing embeddings: ${(error as Error).message}`);
    }
}

/**
 * Search for similar chunks in Pinecone
 */
export async function searchSimilarChunks(
    query: string,
    topK: number = 5
): Promise<SearchResult[]> {
    try {
        const queryEmbedding = await generateEmbedding(query);

        const searchResponse = await pineconeIndex.namespace(NAMESPACE).query({
            vector: queryEmbedding,
            topK: topK,
            includeMetadata: true,
        });

        return searchResponse.matches?.map(match => {
            const metadata = match.metadata as unknown as VectorMetadata;
            return {
                text: metadata?.text || '',
                similarity: match.score || 0,
                filename: metadata?.filename || '',
                chunkIndex: metadata?.chunkIndex || 0,
            };
        }) || [];
    } catch (error) {
        throw new Error(`Error searching similar chunks: ${(error as Error).message}`);
    }
}

/**
 * Clear all embeddings from Pinecone namespace
 */
export async function clearAllEmbeddings(): Promise<void> {
    try {
        await pineconeIndex.namespace(NAMESPACE).deleteAll();
    } catch (error) {
        throw new Error(`Error clearing embeddings: ${(error as Error).message}`);
    }
}

/**
 * Generate chat response using OpenAI with context
 */
export async function generateChatResponse(query: string, context: string): Promise<string> {
    try {
        const prompt = `Based on the following context, answer the user's question. If the context doesn't contain enough information to answer the question, respond with "No tengo suficiente información en el documento para responder esa pregunta."

Context: ${context}

Question: ${query}

Answer:`;

        const response = await openai.chat.completions.create({
            model: CONFIG.CHAT_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that answers questions based on provided document context. Always respond in Spanish.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: CONFIG.MAX_TOKENS_RESPONSE,
            temperature: 0.3,
        });

        return response.choices[0].message.content?.trim() || 'No se pudo generar una respuesta.';
    } catch (error) {
        throw new Error(`Error generating chat response: ${(error as Error).message}`);
    }
}