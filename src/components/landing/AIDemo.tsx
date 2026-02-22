'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
}

interface AIDemoProps {
    businessName: string;
    reviews: Review[];
}

export default function AIDemo({ reviews }: AIDemoProps) {
    const [selectedReview, setSelectedReview] = useState<Review | null>(reviews[0] || null);
    const [generatedReply, setGeneratedReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [tone, setTone] = useState('Professional');
    const [language, setLanguage] = useState('Turkish');

    const handleGenerate = async () => {
        if (!selectedReview) return;

        setLoading(true);
        setGeneratedReply('');

        try {
            const res = await fetch('/api/generate-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reviewText: selectedReview.text,
                    reviewerName: selectedReview.author_name,
                    starRating: selectedReview.rating,
                    tone,
                    language,
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('API Error:', res.status, errorText);
                throw new Error(`API Error ${res.status}: ${errorText.slice(0, 100)}...`);
            }

            const data = await res.json();
            if (data.reply) {
                setGeneratedReply(data.reply);
            }
        } catch (error: any) {
            console.error('Failed to generate reply:', error);
            // @ts-ignore
            setGeneratedReply('Hata: ' + (error.message || 'Bilinmeyen bir hata oluştu.'));
        } finally {
            setLoading(false);
        }
    };

    if (!reviews.length) return null;

    return (
        <div className="mt-12 w-full max-w-6xl mx-auto animate-in fade-in zoom-in duration-500">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Review List Sidebar */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[600px]">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">
                        Bulunan Yorumlar ({reviews.length})
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {reviews.map((review, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setSelectedReview(review);
                                    setGeneratedReply('');
                                }}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg text-sm transition-all border",
                                    selectedReview === review
                                        ? "bg-blue-50 border-blue-200 ring-1 ring-blue-300"
                                        : "hover:bg-gray-50 border-transparent hover:border-gray-200"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-gray-900 line-clamp-1">{review.author_name}</span>
                                    <span className="text-yellow-500 flex text-xs font-bold">{review.rating} ★</span>
                                </div>
                                <p className="text-gray-500 line-clamp-2 text-xs">{review.text}</p>
                                <span className="text-[10px] text-gray-400 mt-1 block">{review.relative_time_description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Review & AI Action */}
                <div className="lg:col-span-2 grid grid-cols-1 gap-8">
                    {/* Review Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 text-xl">Seçilen Yorum</h3>
                            <span className="text-sm text-gray-500">{selectedReview?.relative_time_description}</span>
                        </div>

                        {selectedReview ? (
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                                        {selectedReview.author_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{selectedReview.author_name}</p>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < selectedReview.rating ? 'fill-current' : 'text-gray-200'}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic leading-relaxed text-lg">&quot;{selectedReview.text}&quot;</p>
                            </div>
                        ) : (
                            <p className="text-gray-400">Lütfen soldan bir yorum seçin.</p>
                        )}
                    </div>

                    {/* AI Reply Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-2xl text-white flex flex-col relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-yellow-300" />
                                <h3 className="font-bold text-xl">ReviewGuard AI Yanıtı</h3>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-blue-200 uppercase font-semibold tracking-wider">Ton</label>
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full mt-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 option:text-gray-900"
                                    >
                                        <option className="text-gray-900" value="Professional">Profesyonel</option>
                                        <option className="text-gray-900" value="Friendly">Samimi</option>
                                        <option className="text-gray-900" value="Witty">Esprili</option>
                                        <option className="text-gray-900" value="Solution Oriented">Çözüm Odaklı</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-blue-200 uppercase font-semibold tracking-wider">Dil</label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full mt-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                                    >
                                        <option className="text-gray-900" value="Turkish">Türkçe</option>
                                        <option className="text-gray-900" value="English">English</option>
                                        <option className="text-gray-900" value="Romanian">Română</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !selectedReview}
                                className="w-full py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                {loading ? 'Yanıt Yazılıyor...' : 'AI Yanıtı Oluştur'}
                            </button>
                        </div>

                        {/* Generated Reply Area */}
                        <div className="mt-6 flex-1 bg-black/20 rounded-xl p-4 border border-white/10 relative group min-h-[120px]">
                            {generatedReply ? (
                                <>
                                    <p className="text-blue-50 leading-relaxed whitespace-pre-wrap">{generatedReply}</p>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(generatedReply)}
                                        className="absolute top-2 right-2 p-2 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all"
                                        title="Kopyala"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-blue-200/50 text-center text-sm">
                                    <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                                    {selectedReview ? 'Yanıt oluşturmak için butona tıklayın.' : 'Lütfen soldan bir yorum seçin.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
