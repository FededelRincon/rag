import pdfParse from 'pdf-parse';
import { encodingForModel } from 'js-tiktoken';
import { CONFIG } from './constants';

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        throw new Error(`Error extracting text from PDF: ${(error as Error).message}`);
    }
}

/**
 * Split text into chunks by token count
 */
export function chunkTextByTokens(
    text: string,
    chunkSize: number = CONFIG.CHUNK_SIZE,
    overlap: number = CONFIG.CHUNK_OVERLAP
): string[] {
    const encoder = encodingForModel(CONFIG.EMBEDDING_MODEL);

    try {
        const tokens = encoder.encode(text);
        const chunks: string[] = [];

        for (let i = 0; i < tokens.length; i += chunkSize - overlap) {
            const chunkTokens = tokens.slice(i, i + chunkSize);
            const chunkText = encoder.decode(chunkTokens);
            chunks.push(chunkText);
        }

        // Remove encoder.free() as it's not available in all versions
        // The encoder will be garbage collected automatically
        return chunks;
    } catch (error) {
        throw new Error(`Error chunking text: ${(error as Error).message}`);
    }
}

/**
 * Validate PDF file
 */
export function validatePDF(file: File): { valid: boolean; error?: string } {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!CONFIG.SUPPORTED_TYPES.includes(file.type as "application/pdf")) {
        return { valid: false, error: 'File must be a PDF' };
    }

    if (file.size > CONFIG.MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size must be less than ${CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
        };
    }

    return { valid: true };
}