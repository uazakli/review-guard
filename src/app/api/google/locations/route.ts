import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGoogleAccounts, getLocations } from '@/lib/google/business-profile';

export async function GET() {
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providerToken = session.provider_token;

    if (!providerToken) {
        return NextResponse.json({
            error: 'Google Access Token not found. Please sign out and sign in again with Google.'
        }, { status: 422 });
    }

    try {
        // 1. Get Google Accounts associated with the user
        const accountsData = await getGoogleAccounts(providerToken);
        const accounts = accountsData.accounts || [];

        if (accounts.length === 0) {
            console.log("No Google Business accounts found for this user.");
            return NextResponse.json({ locations: [] });
        }

        // 2. Fetch locations for the primary account
        // Ideally we should loop through all accounts, but for V1 let's take the first one
        const primaryAccount = accounts[0];

        // Note: primaryAccount.name is in format "accounts/{accountId}"
        const locationsData = await getLocations(providerToken, primaryAccount.name);
        const locations = locationsData.locations || [];

        return NextResponse.json({
            accountName: primaryAccount.name,
            locations: locations
        });

    } catch (error: any) {
        console.error('Error fetching Google locations:', error);


        // Handle specific API errors
        if (error.message.includes('401') || error.message.includes('UNAUTHENTICATED')) {
            return NextResponse.json({
                error: 'Google oturum süresi doldu. Lütfen çıkış yapıp tekrar giriş yapın.'
            }, { status: 401 });
        }

        if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('QUOTA_EXCEEDED')) {
            return NextResponse.json({
                error: 'Google API istek limiti aşıldı (Kota Doldu). Lütfen daha sonra tekrar deneyin veya geliştirici ile iletişime geçin.',
                details: 'Google My Business API Quota Exceeded. This is likely due to the "Requests per minute" limit being 0 for unverified projects.'
            }, { status: 429 });
        }

        return NextResponse.json({
            error: 'Google verileri alınamadı.',
            details: error.message
        }, { status: 500 });
    }
}
