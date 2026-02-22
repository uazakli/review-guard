import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    try {
        // Direct REST call to list models
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        // TEST GENERATION
        // We will try one of the 'lite' models first as it might have better quota
        const testModel = 'gemini-1.5-flash-001';


        const genResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        let genData;
        try {
            genData = await genResponse.json();
        } catch {
            genData = { error: "Failed to parse generation response" };
        }

        return NextResponse.json({
            models: data,
            generationTest: {
                model: testModel,
                status: genResponse.status,
                statusText: genResponse.statusText,
                response: genData
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
