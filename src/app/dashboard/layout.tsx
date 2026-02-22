import DashboardClientLayout from './layout-client';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth');
    }

    // Fetch accounts for the sidebar
    const { data: accounts } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    return (
        <DashboardClientLayout accounts={accounts || []} user={user}>
            {children}
        </DashboardClientLayout>
    );
}
