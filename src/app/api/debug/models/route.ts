import { NextResponse } from 'next/server';


const GEN_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export async function GET() {
    if (!GEN_AI_API_KEY) {
        return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    try {
        // We can't easily list models via the SDK helper in 0.1.0 version if it doesn't expose it easily, 
        // but we can try a direct fetch to the API to be sure, or use the SDK's generic request if possible.
        // Actually, checking standard fetch is safer to debug the key.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEN_AI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error listing models:', error);
        return NextResponse.json({
            error: 'Failed to list models',
            details: error.message || error.toString()
        }, { status: 500 });
    }
}
