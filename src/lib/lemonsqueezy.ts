import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

// Initialize LemonSqueezy with API Key
// Safe to call multiple times
export function ensureLemonSqueezy() {
    if (!process.env.LEMONSQUEEZY_API_KEY) {
        // console.warn("Missing LEMONSQUEEZY_API_KEY");
        return;
    }
    lemonSqueezySetup({
        apiKey: process.env.LEMONSQUEEZY_API_KEY,
        onError: (error) => console.error("LemonSqueezy Error:", error),
    });
}
