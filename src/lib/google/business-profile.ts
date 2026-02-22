export const GOOGLE_BUSINESS_API_BASE = 'https://mybusinessbusinessinformation.googleapis.com/v1';
export const GOOGLE_ACCOUNT_API_BASE = 'https://mybusinessaccountmanagement.googleapis.com/v1';

export async function getGoogleAccounts(accessToken: string) {
    const response = await fetch(`${GOOGLE_ACCOUNT_API_BASE}/accounts`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google API Error (Accounts): ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch accounts: ${response.status} ${errorText}`);
    }

    return response.json();
}

export async function getLocations(accessToken: string, accountName: string) {
    // accountName format: "accounts/{accountId}"
    const response = await fetch(`${GOOGLE_BUSINESS_API_BASE}/${accountName}/locations?readMask=name,title,storeCode,metadata`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google API Error (Locations): ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch locations: ${response.status} ${errorText}`);
    }

    return response.json();
}
