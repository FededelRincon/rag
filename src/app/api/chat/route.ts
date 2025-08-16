import { NextRequest, NextResponse } from 'next/server';
import { searchSimilarChunks, generateChatResponse } from '../../../../lib/vectorOperations';

interface ChatRequest {
    message: string;
}

export async function POST(request: NextRequest) {
    try {
        const { message }: ChatRequest = await request.json();

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Search for similar chunks
        const similarChunks = await searchSimilarChunks(message.trim(), 5);

        if (similarChunks.length === 0) {
            return NextResponse.json({
                answer: 'No tengo suficiente información en el documento para responder esa pregunta.',
                similarity: 0,
                chunk: '',
            });
        }

        // Use the most similar chunk as context
        const bestMatch = similarChunks[0];
        const context = bestMatch.text;

        // Generate response using OpenAI
        const answer = await generateChatResponse(message.trim(), context);

        return NextResponse.json({
            answer,
            similarity: bestMatch.similarity,
            chunk: context,
        });

    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json(
            { error: 'Error processing your question: ' + (error as Error).message },
            { status: 500 }
        );
    }
}