import { NextResponse } from 'next/server';
import { pineconeIndex, NAMESPACE } from '../../../../lib/pinecone';
import { VectorMetadata } from '../../../../lib/vectorOperations';

export async function GET() {
    try {
        // Query Pinecone to check if there are any vectors
        const queryResponse = await pineconeIndex.namespace(NAMESPACE).query({
            vector: new Array(1536).fill(0), // Dummy vector for text-embedding-3-small
            topK: 1,
            includeMetadata: true,
        });

        const hasDocument = queryResponse.matches && queryResponse.matches.length > 0;

        let documentInfo = null;
        if (hasDocument && queryResponse.matches[0]) {
            const firstMatch = queryResponse.matches[0];
            const metadata = firstMatch.metadata as VectorMetadata;
            documentInfo = {
                filename: metadata?.filename || 'Unknown',
                chunks: metadata?.totalChunks || 0,
                uploadedAt: metadata?.timestamp || new Date().toISOString(),
            };
        }

        return NextResponse.json({
            hasDocument,
            documentInfo,
        });

    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json(
            { hasDocument: false, error: 'Error checking document status' },
            { status: 500 }
        );
    }
}