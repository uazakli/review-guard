'use client';

import React, { createContext, useContext, useState } from 'react';
import { translations, Language } from '@/lib/translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations['tr'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('review-guard-lang') as Language;
            if (savedLang && (savedLang === 'tr' || savedLang === 'en' || savedLang === 'es' || savedLang === 'zh' || savedLang === 'ar' || savedLang === 'de' || savedLang === 'fr' || savedLang === 'ru')) {
                return savedLang;
            }
        }
        return 'tr';
    });

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
