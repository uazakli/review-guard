'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const languages = [
    { code: 'tr', flag: 'tr', label: 'Türkçe' },
    { code: 'en', flag: 'us', label: 'English' },
    { code: 'es', flag: 'es', label: 'Español' },
    { code: 'zh', flag: 'cn', label: '中文' },
    { code: 'ar', flag: 'sa', label: 'العربية' },
    { code: 'de', flag: 'de', label: 'Deutsch' },
    { code: 'fr', flag: 'fr', label: 'Français' },
    { code: 'ru', flag: 'ru', label: 'Русский' },
];

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLang = languages.find(l => l.code === language) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 bg-white border border-gray-200 rounded-md shadow-sm h-7 hover:bg-gray-50 transition-colors"
            >
                <div className="relative w-5 h-3.5 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/5">
                    <Image
                        src={`https://flagcdn.com/w40/${selectedLang.flag}.png`}
                        alt={selectedLang.label}
                        fill
                        className="object-cover"
                        sizes="20px"
                    />
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code as Language);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium transition-colors ${language === lang.code ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <div className="relative w-5 h-3.5 overflow-hidden rounded-sm shadow-sm flex-shrink-0 ring-1 ring-black/5">
                                <Image
                                    src={`https://flagcdn.com/w40/${lang.flag}.png`}
                                    alt={lang.label}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
