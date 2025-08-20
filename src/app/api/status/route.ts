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

            // Validate that we have essential metadata
            if (metadata?.filename && metadata?.totalChunks) {
                documentInfo = {
                    filename: metadata.filename,
                    chunks: metadata.totalChunks,
                    uploadedAt: metadata.timestamp || new Date().toISOString(),
                };
            } else {
                // If metadata is incomplete, consider no document
                console.warn('Incomplete document metadata found:', metadata);
                return NextResponse.json({
                    hasDocument: false,
                    documentInfo: null,
                });
            }
        }

        // Add cache control headers to prevent stale responses
        const response = NextResponse.json({
            hasDocument,
            documentInfo,
        });

        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;

    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json(
            { hasDocument: false, error: 'Error checking document status' },
            { status: 500 }
        );
    }
}