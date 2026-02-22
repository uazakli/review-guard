'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Store, LayoutDashboard, Settings, LogOut, Plus, CreditCard, X } from 'lucide-react';
import { Account } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
    accounts?: Account[];
    activeAccount?: Account;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ accounts, activeAccount, isOpen, onClose }: SidebarProps) {
    const { t } = useLanguage();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchId = searchParams.get('id');

    // Priority: URL param > Prop > First Account
    const currentAccountId = searchId || activeAccount?.id || (accounts && accounts.length > 0 ? accounts[0].id : null);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/auth');
        router.refresh();
    };


    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <Store className="w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                            Review Guard
                        </h1>
                    </div>
                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-8">
                    {/* Navigation */}
                    <div>
                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
                            {t.dashboard.menu}
                        </h2>
                        <div className="space-y-1">
                            <Link
                                href="/dashboard"
                                onClick={() => onClose && onClose()}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${pathname === '/dashboard'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                {t.dashboard.home}
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                onClick={() => onClose && onClose()}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${pathname === '/dashboard/settings'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Settings className="w-4 h-4" />
                                {t.dashboard.settings}
                            </Link>
                            <Link
                                href="/dashboard/billing"
                                onClick={() => onClose && onClose()}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${pathname === '/dashboard/billing'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <CreditCard className="w-4 h-4" />
                                {t.dashboard.billing || "Abonelik"}
                            </Link>
                        </div>
                    </div>

                    {/* Businesses */}
                    <div>
                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
                            {t.dashboard.businesses}
                        </h2>
                        <div className="space-y-1">
                            {accounts && accounts.map((acc: Account) => (
                                <Link
                                    key={acc.id}
                                    href={`/dashboard?id=${acc.id}`}
                                    onClick={() => onClose && onClose()}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentAccountId === acc.id && pathname === '/dashboard'
                                        ? 'bg-white border border-slate-200 shadow-sm text-slate-900'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${currentAccountId === acc.id && pathname === '/dashboard' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    <span className="truncate">{acc.business_name || 'İsimsiz İşletme'}</span>
                                </Link>
                            ))}
                        </div>
                        <Link
                            href="/dashboard/connect"
                            onClick={() => onClose && onClose()}
                            className="flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-3 mt-3"
                        >
                            <Plus className="w-3 h-3" />
                            {t.dashboard.add_new}
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        {t.dashboard.logout}
                    </button>
                </div>
            </aside>
        </>
    );
}
