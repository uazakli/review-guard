import { NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
        return NextResponse.json({ error: 'Place ID is required' }, { status: 400 });
    }

    if (!GOOGLE_PLACES_API_KEY) {
        return NextResponse.json({ error: 'Google Places API Key not configured' }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,formatted_address&language=tr&key=${GOOGLE_PLACES_API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch place details');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching place details:', error);
        return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 500 });
    }
}
