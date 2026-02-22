'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Fiyatlandırma</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
                        İşletmeniz İçin En Uygun Planı Seçin
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        Gizli ücret yok. İstediğiniz zaman iptal edebilirsiniz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                    {/* ESNAF PAKETİ (Starter) */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-[#0F172A]">Esnaf</h3>
                        <p className="mt-4 text-sm text-slate-500">Küçük işletmeler ve yeni başlayanlar için ideal.</p>
                        <div className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-[#0F172A]">₺299</span>
                            <span className="text-sm font-semibold text-slate-500">/ay</span>
                        </div>
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                1 İşletme
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                50 Kredi (Cevap Hakkı)
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                Manuel Onay Modu
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                Kriz Alarmı (1 Yıldız Bildirimi)
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                Haftalık Rapor
                            </li>
                        </ul>
                        <Link
                            href="/auth?plan=esnaf"
                            className="mt-8 block rounded-xl border border-indigo-200 bg-white px-3 py-3 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors"
                        >
                            Hemen Başla
                        </Link>
                    </div>

                    {/* PATRON PAKETİ (Pro) - Highlight */}
                    <div className="relative rounded-3xl border-2 border-indigo-500 bg-white p-8 shadow-xl md:scale-105 z-10">
                        <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-center text-xs font-semibold text-white uppercase tracking-wide shadow-md">
                            En Popüler
                        </div>
                        <h3 className="text-lg font-semibold text-[#0F172A]">Patron</h3>
                        <p className="mt-4 text-sm text-slate-500">Büyüyen işletmeler için tam otomasyon.</p>
                        <div className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-[#0F172A]">₺449</span>
                            <span className="text-sm font-semibold text-slate-500">/ay</span>
                        </div>
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                <strong>Esnaf Paketindeki Her Şey</strong>
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                <strong>3 İşletme</strong>
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                <strong>300 Kredi</strong> (Cevap Hakkı)
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                Tam Otopilot (7/24)
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                Çoklu Dil Desteği (Turist)
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                Duygu Analizi Grafikleri
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                Öncelikli Destek
                            </li>
                        </ul>
                        <Link
                            href="/auth?plan=patron"
                            className="mt-8 block rounded-xl bg-indigo-600 px-3 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-colors"
                        >
                            Ücretsiz Dene
                        </Link>
                    </div>

                    {/* AJANS PAKETİ (Enterprise) - Coming Soon */}
                    <div className="relative rounded-3xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm opacity-75 grayscale-[0.5]">
                        <div className="absolute top-4 right-4 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                            Çok Yakında
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Ajans / Enterprise</h3>
                        <p className="mt-4 text-sm text-slate-500">Kapsamlı yönetim ve analiz araçları.</p>
                        <div className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-3xl font-bold tracking-tight text-slate-400">---</span>
                        </div>
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-500">
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-slate-400" aria-hidden="true" />
                                Sınırsız İşletme & Kredi
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-slate-400" aria-hidden="true" />
                                Rakip Analizi
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-slate-400" aria-hidden="true" />
                                Çoklu Şube Yönetimi
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-slate-400" aria-hidden="true" />
                                API Erişimi & White-label
                            </li>
                        </ul>
                        <button
                            disabled
                            className="mt-8 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-3 text-center text-sm font-semibold text-slate-400 cursor-not-allowed"
                        >
                            Haber Ver
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
