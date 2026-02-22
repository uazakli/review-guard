import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const GEN_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!GEN_AI_API_KEY) {
        return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    try {
        const { reviewText, reviewerName, starRating, tone } = await request.json();
        const genAI = new GoogleGenerativeAI(GEN_AI_API_KEY);

        // Models to try in order (Prioritizing Lite/Free ones)
        // 1.5 = 404 (Not Found)
        // 2.0 = 429 (Limit 0 - No Quota)
        // 2.5 = 429 (Limit 20 - Rate Limited) -> This is our best bet!
        const modelsToTry = [
            'gemini-flash-latest',
            'gemini-2.5-flash',
        ];

        let replyText = '';
        let errorDetails = '';

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
                    You are an AI assistant for a business owner.
                    Your task is to write a warm, professional reply to a customer review.

                    Review Details:
                    - Reviewer: ${reviewerName}
                    - Rating: ${starRating} Stars
                    - Comment: "${reviewText}"
                    
                    CRITICAL INSTRUCTION ON LANGUAGE:
                    - **DETECT the language of the review.**
                    - **REPLY IN THE SAME LANGUAGE.** (e.g., If review is Turkish -> Reply Turkish. If English -> Reply English. If Chinese -> Reply Chinese).
                    - Do NOT translate unless explicitly asked. Match the user's language.

                    Tone: ${tone || 'Professional'}.
                    Keep it short (max 3 sentences). Appreciative and polite.
                    No placeholders. No HTML.
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                replyText = response.text().replace(/<[^>]*>/g, '');

                if (replyText) break; // Success!

            } catch (err: any) {
                console.warn(`Model ${modelName} failed:`, err.message);
                errorDetails += `[${modelName}: ${err.message}] `;
                continue; // Try next model
            }
        }

        // Failsafe: If all models fail, return ERROR (No more Mock Mode)
        if (!replyText) {
            console.error('All AI models failed:', errorDetails);
            return NextResponse.json({
                error: 'AI Generation Failed',
                details: errorDetails.trim()
            }, { status: 500 });
        }

        return NextResponse.json({ reply: replyText });

    } catch (error: any) {
        console.error('Critical Error in generate-reply:', error);
        return NextResponse.json({
            error: 'Failed to generate reply (System Error)',
            details: error.message
        }, { status: 500 });
    }
}
