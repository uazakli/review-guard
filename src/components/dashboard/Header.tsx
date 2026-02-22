'use client';

import { Menu, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
    onOpenSidebar: () => void;
    userEmail?: string;
}

export default function Header({ onOpenSidebar, userEmail }: HeaderProps) {
    const { t } = useLanguage();

    return (
        <header className="bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between lg:hidden sticky top-0 z-20">
            <button
                onClick={onOpenSidebar}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Open Menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            <span className="font-bold text-slate-800">Review Guard</span>

            {/* Simple User Menu / Placeholder for Mobile */}
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <User className="w-5 h-5" />
            </div>
        </header>
    );
}
