import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
        return new Response('LemonSqueezy Webhook Secret not set', { status: 500 });
    }

    try {
        const text = await request.text();
        const output = await headers();
        const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
        const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
        const signature = Buffer.from(output.get('x-signature') || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
            return new Response('Invalid signature', { status: 400 });
        }

        const payload = JSON.parse(text);
        const { meta, data } = payload;
        const eventName = meta.event_name;
        const customData = meta.custom_data || {};
        const userId = customData.user_id; // Pass user_id in custom_data during checkout

        // console.log('LemonSqueezy Webhook:', eventName, data);

        const supabase = await createClient();

        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            const subscription = data.attributes;
            const status = subscription.status;
            const variantId = subscription.variant_id;
            const customerId = subscription.customer_id;
            const renewsAt = subscription.renews_at;

            // We need to map this to our user. 
            // Ideally, pass `user_id` as custom data in the checkout link.
            // If user_id is missing, we might need to find by email (less reliable).

            if (userId) {
                const { error } = await supabase.from('subscriptions').upsert({
                    user_id: userId,
                    lemonsqueezy_subscription_id: data.id,
                    lemonsqueezy_customer_id: customerId.toString(),
                    lemonsqueezy_variant_id: variantId.toString(),
                    status: status,
                    renews_at: renewsAt,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'lemonsqueezy_subscription_id' }); // Or maybe unique user_id if 1 sub per user

                if (error) console.error('Error updating subscription:', error);
            }
        }

        return new Response('Webhook received', { status: 200 });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response('Webhook error', { status: 400 });
    }
}
