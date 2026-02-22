'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations['tr'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('tr');

    useEffect(() => {
        // Load saved language from localStorage if available
        const savedLang = localStorage.getItem('review-guard-lang') as Language;
        if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setLanguage((prev) => (prev !== savedLang ? savedLang : prev));
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('review-guard-lang', lang);
    };

    const value = {
        language,
        setLanguage: handleSetLanguage,
        t: translations[language] as typeof translations['tr'],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
