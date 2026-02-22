'use client';

import { useState } from 'react';
import { Star, Sparkles, Check, ThumbsDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext'; // Assuming you have this from previous steps

interface Review {
    id: string;
    reviewer_name: string;
    star_rating: number;
    comment: string;
    review_date: string;
    reply_status: 'pending' | 'approved' | 'rejected' | 'published';
    generated_reply?: string;
}

import { createClient } from '@/lib/supabase/client';

export default function ReviewCard({ review }: { review: Review }) {
    const { t } = useLanguage();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyStatus, setReplyStatus] = useState(review.reply_status);
    const [reply, setReply] = useState(review.generated_reply || '');
    const [hasRegenerated, setHasRegenerated] = useState(false);
    const supabase = createClient();

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        try {
            // 1. Generate Reply via AI API
            const res = await fetch('/api/generate-reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewText: review.comment,
                    reviewerName: review.reviewer_name,
                    starRating: review.star_rating,
                    tone: 'Professional', // Can be dynamic later
                    language: 'Turkish'
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                const errorMessage = errorData.details
                    ? `${errorData.error}: ${errorData.details}`
                    : errorData.error || 'AI Generation failed';
                throw new Error(errorMessage);
            }
            const data = await res.json();
            const generatedText = data.reply;

            // 2. Save Draft to Database
            const { error } = await supabase
                .from('reviews')
                .update({
                    generated_reply: generatedText,
                    reply_status: 'pending' // Still pending approval
                })
                .eq('id', review.id);

            if (error) throw error;

            // 3. Update UI
            setReply(generatedText);
            if (reply) {
                setHasRegenerated(true);
            }

        } catch (error: any) {
            console.error(error);
            alert(`Hata: ${error.message || "Bilinmeyen bir hata oluştu"}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAction = async (action: 'approve' | 'reject' | 'save_draft') => {
        try {
            const res = await fetch('/api/reviews/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewId: review.id,
                    action,
                    replyText: reply
                })
            });

            if (!res.ok) throw new Error('Action failed');

            if (action === 'approve') {
                setReplyStatus('published');
                setIsEditing(false);
            } else if (action === 'reject') {
                setReplyStatus('rejected');
                setReply(''); // Clear draft
            } else if (action === 'save_draft') {
                setReplyStatus('pending');
                setIsEditing(false);
            }

        } catch (error) {
            console.error(error);
            alert("İşlem başarısız oldu.");
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 transition-all hover:shadow-md">
            {/* Header: Reviewer & Rating */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900">{review.reviewer_name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "w-4 h-4",
                                    i < review.star_rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                )}
                            />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">
                            {new Date(review.review_date).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                </div>
                {replyStatus !== 'pending' && (
                    <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        replyStatus === 'published' ? "bg-green-100 text-green-700" :
                            replyStatus === 'rejected' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                    )}>
                        {replyStatus === 'published' ? t.common.published :
                            replyStatus === 'rejected' ? t.common.reject : ''}
                    </span>
                )}
            </div>

            {/* Review Content */}
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                {review.comment}
            </p>

            {/* Action Area */}
            {replyStatus === 'published' ? (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800 font-medium mb-1 flex items-center gap-2">
                        <Check className="w-4 h-4" /> {t.ai.published_reply}:
                    </p>
                    <p className="text-sm text-gray-700 italic">&quot;{reply}&quot;</p>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-3">
                    {!reply && !isEditing ? (
                        <button
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            {isGenerating ? (
                                <>Generating...</>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    {t.ai.generate}
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-blue-500" /> {t.ai.draft_reply}
                                    {!hasRegenerated && !isEditing && (
                                        <button
                                            onClick={handleGenerateAI}
                                            disabled={isGenerating}
                                            className="ml-2 hover:bg-blue-50 p-1 rounded-full text-blue-400 hover:text-blue-600 transition-colors"
                                            title={t.ai.regenerate || "Yeniden Oluştur"}
                                        >
                                            <RefreshCw className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />
                                        </button>
                                    )}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAction('reject')}
                                        className="p-1 hover:bg-white rounded text-gray-400 hover:text-red-500"
                                        title="Reddet / Sil"
                                    >
                                        <ThumbsDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {isEditing ? (
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    className="w-full text-sm p-3 rounded border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[80px]"
                                />
                            ) : (
                                <div className="text-sm text-gray-800 bg-white p-3 rounded border border-gray-200">
                                    {reply}
                                </div>
                            )}

                            <div className="flex gap-2">
                                {isEditing ? (
                                    <button
                                        onClick={() => handleAction('save_draft')}
                                        className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Kaydet
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleAction('approve')}
                                            className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            {t.ai.approve}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-md hover:bg-slate-50 transition"
                                        >
                                            {t.ai.edit}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
