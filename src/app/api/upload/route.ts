import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, chunkTextByTokens, validatePDF } from '../../../../lib/pdfProcessor';
import { storeEmbeddings, clearAllEmbeddings } from '../../../../lib/vectorOperations';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file
        const validation = validatePDF(file);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Extract text from PDF
        const text = await extractTextFromPDF(buffer);

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'No text could be extracted from the PDF' },
                { status: 400 }
            );
        }

        // Clear previous embeddings
        await clearAllEmbeddings();

        // Chunk the text
        const chunks = chunkTextByTokens(text);

        if (chunks.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No chunks could be generated from the text' },
                { status: 400 }
            );
        }

        // Store embeddings
        const result = await storeEmbeddings(chunks, file.name);

        return NextResponse.json({
            success: true,
            message: 'Document processed successfully',
            documentInfo: {
                filename: file.name,
                chunks: result.chunksStored,
                documentId: result.documentId,
            },
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Error processing document: ' + (error as Error).message
            },
            { status: 500 }
        );
    }
}