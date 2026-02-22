'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Bell, CreditCard, Building, MessageSquare, Save, Loader2 } from 'lucide-react';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import { updateAccountSettings } from '@/app/actions/settings';

import { Account } from '@/types';

interface SettingsClientProps {
    account: Account;
}

export default function SettingsClient({ account }: SettingsClientProps) {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' });

    const [settings, setSettings] = useState({
        auto_reply_enabled: account?.auto_reply_enabled ?? false,
        min_star_rating: account?.min_star_rating ?? 4,
        publication_mode: account?.publication_mode ?? 'manual',
    });

    const handleSave = async () => {
        if (!account) return;
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await updateAccountSettings(account.id, settings);
            setMessage({ type: 'success', text: t.settings_page?.saved || 'Kaydedildi' });

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: t.common?.error || 'Hata oluştu' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{t.settings_page?.title || "Ayarlar"}</h1>
                        <p className="text-slate-500 mt-1">{t.settings_page?.subtitle || "Hesap tercihlerinizi yönetin."}</p>
                    </div>
                    <LanguageSelector />
                </div>

                <div className="grid gap-6">
                    {/* Auto-Reply Rules Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{t.settings_page?.auto_reply_settings || "Otomatik Yanıt Ayarları"}</h3>
                                        <p className="text-slate-500 text-sm mt-1">{t.settings_page?.auto_reply_desc || "Yapay zeka yanıt tercihleri."}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.auto_reply_enabled}
                                            onChange={(e) => setSettings({ ...settings, auto_reply_enabled: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>

                                <div className={`mt-6 space-y-6 pt-6 border-t border-slate-100 transition-opacity ${settings.auto_reply_enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                    {/* Minimum Star Rating */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            {t.settings_page?.min_star_rating || "Otomatik Yanıt İçin Minimum Puan"}
                                        </label>
                                        <select
                                            className="block w-full rounded-lg border-slate-200 text-slate-700 focus:border-purple-500 focus:ring-purple-500 shadow-sm sm:text-sm p-2.5 bg-white border"
                                            value={settings.min_star_rating}
                                            onChange={(e) => setSettings({ ...settings, min_star_rating: parseInt(e.target.value) })}
                                        >
                                            <option value="1">{t.settings_page?.star_1_plus || "1 Yıldız ve Üzeri (★+)"}</option>
                                            <option value="2">{t.settings_page?.star_2_plus || "2 Yıldız ve Üzeri (★★+)"}</option>
                                            <option value="3">{t.settings_page?.star_3_plus || "3 Yıldız ve Üzeri (★★★+)"}</option>
                                            <option value="4">{t.settings_page?.star_4_plus || "4 Yıldız ve Üzeri (★★★★+)"}</option>
                                            <option value="5">{t.settings_page?.star_5_only || "Sadece 5 Yıldız (★★★★★)"}</option>
                                        </select>
                                        <p className="mt-1 text-xs text-slate-500">{t.settings_page?.min_star_desc}</p>
                                    </div>

                                    {/* Publication Mode */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-3">
                                            {t.settings_page?.response_mode || "Yayınlama Modu"}
                                        </label>
                                        <div className="grid gap-3">
                                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${settings.publication_mode === 'manual' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="response_mode"
                                                    value="manual"
                                                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                                    checked={settings.publication_mode === 'manual'}
                                                    onChange={() => setSettings({ ...settings, publication_mode: 'manual' })}
                                                />
                                                <span className="text-sm text-slate-700">{t.settings_page?.mode_manual || "Manuel Onay"}</span>
                                            </label>

                                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${settings.publication_mode === 'semi' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="response_mode"
                                                    value="semi"
                                                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                                    checked={settings.publication_mode === 'semi'}
                                                    onChange={() => setSettings({ ...settings, publication_mode: 'semi' })}
                                                />
                                                <span className="text-sm text-slate-700">{t.settings_page?.mode_semi || "Yarı Otomatik"}</span>
                                            </label>

                                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${settings.publication_mode === 'automated' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="response_mode"
                                                    value="automated"
                                                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                                    checked={settings.publication_mode === 'automated'}
                                                    onChange={() => setSettings({ ...settings, publication_mode: 'automated' })}
                                                />
                                                <span className="text-sm text-slate-700">{t.settings_page?.mode_automated || "Tam Otomatik"}</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        {message.text && (
                                            <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                {message.text}
                                            </span>
                                        )}
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {t.settings_page?.save_changes || "Kaydet"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900">{t.settings_page?.notifications || "Bildirimler"}</h3>
                                <p className="text-slate-500 text-sm mt-1">{t.settings_page?.notifications_desc || "Bildirim ayarları."}</p>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-slate-700">{t.settings_page?.new_review_email || "Yeni Yorum E-postaları"}</p>
                                            <p className="text-xs text-slate-500">{t.settings_page?.new_review_email_desc || "Yorum gelince e-posta al."}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={async () => {
                                                    const { sendTestNotification } = await import('@/app/actions/notifications');
                                                    setIsLoading(true);
                                                    try {
                                                        const res = await sendTestNotification();
                                                        if (res.success) {
                                                            setMessage({ type: 'success', text: 'Test e-postası gönderildi!' });
                                                        } else {
                                                            setMessage({ type: 'error', text: 'Gönderim başarısız. API Key kontrol edin.' });
                                                        }
                                                    } catch (e) {
                                                        console.error("Test notification error:", e);
                                                        setMessage({ type: 'error', text: 'Bir hata oluştu: ' + (e as Error).message });
                                                    } finally {
                                                        setIsLoading(false);
                                                        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                    }
                                                }}
                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline px-2"
                                            >
                                                Test Et
                                            </button>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between opacity-50 pointer-events-none">
                                        <div>
                                            <p className="font-medium text-slate-700">{t.settings_page?.weekly_report || "Haftalık Rapor"}</p>
                                            <p className="text-xs text-slate-500">{t.settings_page?.weekly_report_desc || "Özet e-posta al."}</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors">
                                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Profile Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <Building className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900">{t.settings_page?.business_profile || "İşletme Profili"}</h3>
                                <p className="text-slate-500 text-sm mt-1">{t.settings_page?.business_profile_desc || "Profil detayları."}</p>
                                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="text-sm font-medium text-slate-700">{t.settings_page?.business_connected || "Bağlı"}</span>
                                        </div>
                                        <button className="text-xs font-medium text-slate-500 hover:text-slate-700">{t.settings_page?.manage || "Yönet"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-50 rounded-lg text-green-600">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900">{t.settings_page?.subscription || "Abonelik"}</h3>
                                <p className="text-slate-500 text-sm mt-1">{t.settings_page?.subscription_desc || "Plan detayları."}</p>
                                <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                        <p className="font-medium text-slate-900">{t.settings_page?.free_plan || "Ücretsiz Plan"}</p>
                                        <p className="text-xs text-slate-500">{t.settings_page?.trial_active || "Deneme aktif."}</p>
                                    </div>
                                    <Link href="/dashboard/billing" className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
                                        {t.settings_page?.upgrade || "Yükselt"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
