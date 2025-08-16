import { Pinecone, Index } from '@pinecone-database/pinecone';
import { CONFIG } from './constants';

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is required');
}

if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error('PINECONE_INDEX_NAME is required');
}

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex: Index = pinecone.index(process.env.PINECONE_INDEX_NAME);
export const NAMESPACE = CONFIG.PINECONE_NAMESPACE;