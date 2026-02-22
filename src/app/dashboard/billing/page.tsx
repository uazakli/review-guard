import PricingTable from '@/components/billing/PricingTable';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch accounts for sidebar
    const { data: accounts } = await supabase.from('accounts').select('*');

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Abonelik ve Faturalandırma</h1>
                    <p className="text-slate-500 mt-1">Planınızı yönetin ve faturalarınızı görüntüleyin.</p>
                </div>

                <PricingTable />
            </div>
        </div>
    );
}
