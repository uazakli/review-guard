'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import ReviewList from '@/components/dashboard/ReviewList';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import { Settings, Star, TrendingUp, MessageSquare, AlertCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Account, Review } from '@/types';

interface DashboardClientProps {
    activeAccount: Account;
    reviews: Review[];
}

export default function DashboardClient({
    activeAccount,
    reviews,
}: DashboardClientProps) {
    const { t, language } = useLanguage();

    // --- State for Filtering ---
    const [viewMode, setViewMode] = useState<'all_time' | 'weekly'>('weekly');
    // Start with the requested specific week: Jan 26 - Feb 1, 2026. 
    // Note: The user mentioned "2026-02-06" in previous context, but likely means 2025 based on standard years, 
    // BUT the mockup said "Jan 26 - Feb 1". Let's stick to a reference date.
    // Let's assume current date is Feb 8, 2026 based on metadata.
    // For the specific report, let's just initialize to a date that covers Jan 26.
    const [currentDate, setCurrentDate] = useState(new Date('2026-01-29'));

    // --- Helper Functions ---
    const getWeekRange = (date: Date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    };

    const formatDateRange = (start: Date, end: Date) => {
        // Simple formatter: "Jan 26 - Feb 1"
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        // Use current language for formatting
        return `${start.toLocaleDateString(language, options)} - ${end.toLocaleDateString(language, options)}`;
    };

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    // --- Derived Data ---
    const { start: weekStart, end: weekEnd } = getWeekRange(currentDate);

    const filteredReviews = useMemo(() => {
        if (!reviews) return [];
        if (viewMode === 'all_time') return reviews;

        return reviews.filter((r: Review) => {
            const rDate = new Date(r.review_date);
            return rDate >= weekStart && rDate <= weekEnd;
        });
    }, [reviews, viewMode, weekStart, weekEnd]);

    // --- Stats Calculation ---
    const totalReviews = filteredReviews.length;

    const averageRating = useMemo(() => {
        if (totalReviews === 0) return '0.0';
        const sum = filteredReviews.reduce((acc: number, curr: Review) => acc + curr.star_rating, 0);
        return (sum / totalReviews).toFixed(1);
    }, [filteredReviews, totalReviews]);

    const responseRate = useMemo(() => {
        if (!reviews || reviews.length === 0) return 0; // Global response rate usually? Or filtered?
        // User asked: "Yanıt oranı kısmında tüm yorumlara verilen yanıtların oranı gösterilmeli" -> 
        // Could mean "Rate for ALL reviews" or "Rate for FILTERED reviews".
        // Usually stats cards react to filters. Let's calculate based on filtered reviews for consistency.
        if (totalReviews === 0) return 0;

        const repliedCount = filteredReviews.filter((r: Review) => r.reply_status === 'published').length;
        return Math.round((repliedCount / totalReviews) * 100);
    }, [filteredReviews, totalReviews, reviews]);

    // Mock AI Summary based on data presence
    const complaintSummary = useMemo(() => {
        if (totalReviews === 0) return t.stats.no_data_weekly;
        // Mock logic to vary the text slightly so it feels dynamic
        const ratingVal = parseFloat(averageRating);
        if (ratingVal > 4) return t.stats.ai_summary_positive || "Müşteriler hizmet kalitesinden ve lezzetten oldukça memnun.";
        if (ratingVal < 3) return t.stats.ai_summary_negative || "Servis hızıyla ilgili şikayetler bu hafta artış gösterdi.";
        return t.stats.ai_summary_neutral || "Müşteriler genel olarak memnun, ancak fiyatlarla ilgili bazı eleştiriler var.";
    }, [totalReviews, averageRating, t]);



    // --- UI State ---
    const [isExpanded, setIsExpanded] = useState(false);

    // --- Derived Data ---
    const displayedReviews = useMemo(() => {
        const list = reviews || [];
        return isExpanded ? list : list.slice(0, 6);
    }, [reviews, isExpanded]);

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Area */}
                <div className="flex justify-between items-end">
                    <div className="flex items-end gap-6">
                        <div>
                            <h2 className="text-slate-500 font-medium">{t.dashboard.welcome},</h2>
                            <h1 className="text-3xl font-bold text-slate-900">{activeAccount.business_name}</h1>
                        </div>

                        {/* Date Filter & Navigation */}
                        <div className="flex items-center h-fit bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('all_time')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${viewMode === 'all_time' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {t.stats.all_time}
                            </button>
                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                            <button
                                onClick={() => setViewMode('weekly')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${viewMode === 'weekly' ? 'bg-white text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {t.stats.weekly}
                            </button>

                            {viewMode === 'weekly' && (
                                <>
                                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                    <div className="flex items-center">
                                        <button
                                            onClick={handlePrevWeek}
                                            className="p-1 hover:bg-slate-100 rounded text-slate-500 flex-shrink-0"
                                            title={t.stats.prev_week}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-xs font-medium text-slate-700 px-2 min-w-[100px] text-center whitespace-nowrap">
                                            {formatDateRange(weekStart, weekEnd)}
                                        </span>
                                        <button
                                            onClick={handleNextWeek}
                                            className="p-1 hover:bg-slate-100 rounded text-slate-500 flex-shrink-0"
                                            title={t.stats.next_week}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                        <button
                                            onClick={() => setCurrentDate(new Date())}
                                            className="p-1 hover:bg-slate-100 rounded text-slate-500 flex-shrink-0"
                                            title={t.stats.current_week}
                                        >
                                            <Calendar className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <LanguageSelector />
                        <Link href="/dashboard/settings" className="flex items-center justify-center gap-1.5 px-2 bg-white border border-slate-200 text-slate-700 rounded-md shadow-sm hover:bg-slate-50 transition h-7 w-9" title={t.dashboard.settings}>
                            <Settings className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Total Reviews */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-500">{t.stats.total_reviews}</h3>
                            <MessageSquare className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">{totalReviews}</span>
                            {/* Mock Trend */}
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                    </div>

                    {/* Card 2: Average Rating (Google Maps Logic) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-500">{t.stats.avg_rating}</h3>
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">{averageRating}</span>
                            <span className="text-sm text-slate-400">/ 5.0</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">Google Maps</div>
                    </div>

                    {/* Card 3: Response Rate */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-500">{t.stats.response_rate}</h3>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">%{responseRate}</span>
                            <span className="text-xs font-medium text-slate-500">
                                {responseRate >= 90 ? (t.stats.excellent || 'Mükemmel') : responseRate >= 70 ? (t.stats.good || 'İyi') : (t.stats.needs_improvement || 'Geliştirilmeli')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Weekly Report Section */}
                {viewMode === 'weekly' && (
                    <div className="bg-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden transition-all">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-800 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{t.stats.weekly_report}</h3>
                                    <p className="text-indigo-300 text-sm">{formatDateRange(weekStart, weekEnd)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <p className="text-indigo-300 text-xs uppercase tracking-wide font-semibold mb-1">{t.stats.incoming_review}</p>
                                    <p className="text-4xl font-bold">{totalReviews}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-indigo-300 text-xs uppercase tracking-wide font-semibold mb-2">{t.stats.ai_summary}</p>
                                    <p className="text-indigo-100 leading-relaxed text-sm md:text-base">
                                        &quot;{complaintSummary}&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Reviews List */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">{t.stats.recent_reviews}</h3>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                        >
                            {isExpanded ? t.stats.show_less : t.stats.view_all}
                        </button>
                    </div>
                    <ReviewList reviews={displayedReviews} />
                </div>

            </div>
        </div>
    );
}
