'use client';

import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

const plans = [
    {
        name: 'Esnaf',
        price: '₺299/ay',
        description: 'Küçük işletmeler ve yeni başlayanlar için ideal.',
        features: [
            '1 İşletme',
            '50 Kredi (Cevap Hakkı)',
            'Manuel Onay Modu',
            'Kriz Alarmı (1 Yıldız Bildirimi)',
            'Haftalık Rapor'
        ],
        buttonText: 'Mevcut Plan',
        isCurrent: true,
        variantId: null, // Free/Basic plan has no variant ID yet
        isPopular: false
    },
    {
        name: 'Patron',
        price: '₺449/ay',
        description: 'Büyüyen işletmeler için tam otomasyon.',
        features: [
            'Esnaf Paketindeki Her Şey',
            '3 İşletme',
            '300 Kredi (Cevap Hakkı)',
            'Tam Otopilot (7/24)',
            'Çoklu Dil Desteği (Turist)',
            'Duygu Analizi Grafikleri',
            'Öncelikli Destek'
        ],
        buttonText: 'Yükselt',
        isCurrent: false,
        variantId: '550186', // Replace with real Variant ID
        isPopular: true
    },
    {
        name: 'Ajans / Enterprise',
        price: '---',
        description: 'Kapsamlı yönetim ve analiz araçları.',
        features: [
            'Sınırsız İşletme & Kredi',
            'Rakip Analizi',
            'Çoklu Şube Yönetimi',
            'API Erişimi & White-label'
        ],
        buttonText: 'Çok Yakında',
        isCurrent: false,
        variantId: null, // Contact sales
        isPopular: false,
        disabled: true
    }
];

export default function PricingTable() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleUpgrade = async (variantId: string | null) => {
        if (!variantId) return;
        setIsLoading(variantId);

        // Mock checkout for now
        setTimeout(() => {
            alert("Checkout sayfasına yönlendiriliyor (Mock)...");
            setIsLoading(null);
        }, 1000);
    };

    return (
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {plans.map((plan) => (
                <div key={plan.name} className={`relative rounded-2xl border ${plan.isPopular ? 'border-indigo-500 bg-white shadow-xl scale-105 z-10' : 'border-slate-200 bg-white shadow-sm'} p-8 flex flex-col ${plan.disabled ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                    {plan.isPopular && (
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600 border border-indigo-200 uppercase tracking-wide">
                                En Popüler
                            </span>
                        </div>
                    )}

                    {plan.disabled && (
                        <div className="absolute top-4 right-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                            Çok Yakında
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                        <p className="mt-2 text-slate-500 text-sm">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-slate-600 text-sm">
                                <Check className={`w-5 h-5 shrink-0 ${plan.isPopular ? 'text-indigo-600' : 'text-slate-400'}`} />
                                <span dangerouslySetInnerHTML={{ __html: feature.replace('3 İşletme', '<strong>3 İşletme</strong>').replace('300 Kredi', '<strong>300 Kredi</strong>') }} />
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handleUpgrade(plan.variantId)}
                        disabled={plan.isCurrent || isLoading === plan.variantId || plan.disabled}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition shadow-sm flex items-center justify-center gap-2 ${plan.isCurrent
                            ? 'bg-slate-100 text-slate-400 cursor-default'
                            : plan.disabled
                                ? 'bg-transparent border border-slate-200 text-slate-400 cursor-not-allowed'
                                : plan.isPopular
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-white text-slate-900 border border-indigo-200 hover:bg-indigo-50'
                            }`}
                    >
                        {isLoading === plan.variantId && <Loader2 className="w-4 h-4 animate-spin" />}
                        {plan.buttonText}
                    </button>
                </div>
            ))}
        </div>
    );
}
