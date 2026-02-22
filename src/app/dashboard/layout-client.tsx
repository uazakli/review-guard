'use client';

import { useState } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { Account, User } from '@/types';

interface DashboardClientLayoutProps {
    children: React.ReactNode;
    accounts: Account[];
    user: User;
}

export default function DashboardClientLayout({ children, accounts, user }: DashboardClientLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Determine active account from URL (layout doesn't have easy searchParams access in Client Comp without hook)
    // Actually, Sidebar handles active logic via its own prop or we can pass it if we parse URL.
    // Sidebar logic: "activeAccount" prop is optional. If missing, it highlights based on URL.
    // Let's rely on Sidebar's internal URL matching or pass the first one as fallback.
    // Ideally we'd use `useSearchParams` here if we want to pass `activeAccount` to Sidebar explicitly.
    // But Sidebar.tsx already reads `usePathname`.
    // Sidebar.tsx line 76: uses `currentAccountId` vs `acc.id`.
    // Let's just pass `accounts`.

    return (
        <LanguageProvider>
            <div className="min-h-screen bg-[#F8FAFC]">
                {/* Mobile Header */}
                <Header
                    onOpenSidebar={() => setSidebarOpen(true)}
                    userEmail={user.email}
                />

                {/* Sidebar (Responsive) */}
                <Sidebar
                    accounts={accounts}
                    isOpen={isSidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <main className="lg:ml-64 transition-all duration-300">
                    {children}
                </main>
            </div>
        </LanguageProvider>
    );
}
