'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

export default function PricingSection() {
    const { language } = useLanguage();
    const t = (translations[language] ?? translations['tr']).landing;

    return (
        <section id="pricing" className="py-24 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">{t.pricing_label}</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
                        {t.pricing_title}
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        {t.pricing_subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                    {/* Starter Plan */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-[#0F172A]">{t.plan_starter_name}</h3>
                        <p className="mt-4 text-sm text-slate-500">{t.plan_starter_desc}</p>
                        <div className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-[#0F172A]">{t.plan_starter_price}</span>
                            <span className="text-sm font-semibold text-slate-500">{t.plan_per_month}</span>
                        </div>
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {t.plan_feature_1biz}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {t.plan_feature_50credit}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {t.plan_feature_manual}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {t.plan_feature_alert}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {t.plan_feature_weekly}
                            </li>
                        </ul>
                        <Link
                            href="/auth?plan=esnaf"
                            className="mt-8 block rounded-xl border border-indigo-200 bg-white px-3 py-3 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors"
                        >
                            {t.plan_starter_cta}
                        </Link>
                    </div>

                    {/* Pro Plan - Highlight */}
                    <div className="relative rounded-3xl border-2 border-indigo-500 bg-white p-8 shadow-xl md:scale-105 z-10">
                        <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-center text-xs font-semibold text-white uppercase tracking-wide shadow-md">
                            {t.plan_pro_badge}
                        </div>
                        <h3 className="text-lg font-semibold text-[#0F172A]">{t.plan_pro_name}</h3>
                        <p className="mt-4 text-sm text-slate-500">{t.plan_pro_desc}</p>
                        <div className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-[#0F172A]">{t.plan_pro_price}</span>
                            <span className="text-sm font-semibold text-slate-500">{t.plan_per_month}</span>
                        </div>
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                <strong>{t.plan_feature_everything}</strong>
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                <strong>{t.plan_feature_3biz}</strong>
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                <strong>{t.plan_feature_300credit}</strong>
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {t.plan_feature_autopilot}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {t.plan_feature_multilang}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {t.plan_feature_sentiment}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                {t.plan_feature_support}
                            </li>
                        </ul>
                        <Link
                            href="/auth?plan=patron"
                            className="mt-8 block rounded-xl bg-indigo-600 px-3 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-colors"
                        >
                            {t.plan_pro_cta}
                        </Link>
                    </div>

                    {/* Enterprise Plan - Coming Soon */}
                    <div className="relative rounded-3xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm opacity-75 grayscale-[0.5]">
                        <div className="absolute top-4 right-4 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                            {t.plan_enterprise_badge}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{t.plan_enterprise_name}</h3>
                        <p className="mt-4 text-sm text-slate-500">{t.plan_enterprise_desc}</p>
                        <div className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-3xl font-bold tracking-tight text-slate-400">---</span>
                        </div>
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-500">
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-slate-400" aria-hidden="true" />
                                {t.plan_feature_unlimited}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-slate-400" aria-hidden="true" />
                                {t.plan_feature_competitor}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-slate-400" aria-hidden="true" />
                                {t.plan_feature_branches}
                            </li>
                            <li className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-slate-400" aria-hidden="true" />
                                {t.plan_feature_api}
                            </li>
                        </ul>
                        <button
                            disabled
                            className="mt-8 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-3 text-center text-sm font-semibold text-slate-400 cursor-not-allowed"
                        >
                            {t.plan_enterprise_cta}
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
