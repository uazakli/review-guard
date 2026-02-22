import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Store } from 'lucide-react'
import DashboardClient from './DashboardClient'

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>
}) {
    const supabase = await createClient()

    const { id: searchId } = await searchParams; // Await params

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    // 1. Get ALL Connected Accounts
    const { data: accounts } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    // 2. If no account, show onboarding
    if (!accounts || accounts.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Hoşgeldiniz!</h1>
                    <p className="text-gray-600 mb-6">
                        Yönetim paneline erişmek için bir işletme bağlayın.
                    </p>
                    <Link
                        href="/dashboard/connect"
                        className="inline-flex items-center justify-center w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        İşletme Bağla
                    </Link>
                </div>
            </div>
        )
    }

    // 3. Determine Active Account
    const activeAccountId = searchId || accounts[0].id;
    const activeAccount = accounts.find(a => a.id === activeAccountId) || accounts[0];

    // 4. Get Reviews for Active Account
    const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('account_id', activeAccount.id)
        .order('review_date', { ascending: false });

    return (
        <DashboardClient
            activeAccount={activeAccount}
            reviews={reviews || []}
        />
    )
}
