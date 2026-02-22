import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsPage({
    searchParams,
}: {
    searchParams: { id?: string };
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Fetch accounts for sidebar
    const { data: accounts } = await supabase.from('accounts').select('*');

    const activeAccountId = searchParams?.id || accounts?.[0]?.id;
    const activeAccount = accounts?.find(a => a.id === activeAccountId) || accounts?.[0];

    return (
        <SettingsClient account={activeAccount} />
    );
}
