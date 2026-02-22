'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateAccountSettings(accountId: string, settings: {
    auto_reply_enabled: boolean;
    min_star_rating: number;
    publication_mode: 'manual' | 'automated' | 'semi';
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    // Verify ownership
    const { data: account } = await supabase
        .from('accounts')
        .select('user_id')
        .eq('id', accountId)
        .single();

    if (!account || account.user_id !== user.id) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('accounts')
        .update({
            auto_reply_enabled: settings.auto_reply_enabled,
            min_star_rating: settings.min_star_rating,
            publication_mode: settings.publication_mode,
        })
        .eq('id', accountId);

    if (error) {
        console.error('Error updating settings:', JSON.stringify(error, null, 2));
        throw new Error(`Failed to update settings: ${error.message} (${error.code})`);
    }

    revalidatePath('/dashboard/settings');
    return { success: true };
}
