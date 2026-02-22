'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BusinessSearch from '@/components/landing/BusinessSearch';
import AIDemo from '@/components/landing/AIDemo';
import PricingSection from '@/components/landing/PricingSection';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import { Review } from '@/types';
import { Loader2, ShieldCheck, Zap, TrendingUp, Globe, Star } from 'lucide-react';

interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  rating: number;
  user_ratings_total: number;
}

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handlePlaceSelect = async (place: Place) => {
    setSelectedPlace(place);
    setLoadingDetails(true);

    try {
      // Fetch details including reviews
      const res = await fetch(`/api/places/details?placeId=${place.place_id}`);
      const data = await res.json();

      if (data.result && data.result.reviews) {
        setReviews(data.result.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (loadingDetails || selectedPlace) {
      setTimeout(() => {
        const element = document.getElementById('demo');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [loadingDetails, selectedPlace]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-indigo-100 selection:text-indigo-900 font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#0F172A]">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>ReviewGuard</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition">Özellikler</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition">Nasıl Çalışır?</a>
            <a href="#pricing" className="hover:text-indigo-600 transition">Fiyatlandırma</a>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <LanguageSelector />
            <Link href="/auth" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-[#0F172A]">Giriş Yap</Link>
            <Link href="/auth" className="text-xs sm:text-sm font-medium text-white bg-indigo-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm hover:shadow-md whitespace-nowrap">
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Split Screen) */}
      <section className="pt-24 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Column: Content */}
            <div className="text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wide mb-6 border border-indigo-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Google Maps Uyumlu v1.0
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15] mb-6">
                İtibarınızı <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  Otopilota Alın
                </span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                Google işletme yorumlarınıza yapay zeka ile anında, profesyonel ve SEO dostu yanıtlar verin. Müşteri sadakatini artırırken zamandan tasarruf edin.
              </p>

              {/* Search Box Container */}
              <div className="relative max-w-lg mb-8 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-white p-2 rounded-xl border border-slate-200 shadow-xl">
                  <BusinessSearch onSelect={handlePlaceSelect} />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[#0F172A] border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-0.5 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-medium text-slate-700">100+ İşletme Güveniyor</span>
                </div>
              </div>
            </div>

            {/* Right Column: Abstract Visualization */}
            <div className="relative hidden lg:block h-[500px]">
              {/* Decorative Blobs */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full blur-3xl opacity-50 -z-10 animate-blob"></div>

              {/* Abstract Dashboard UI (CSS Only) */}
              <div className="relative w-full h-full perspective-1000">
                <div className="absolute top-10 right-0 w-4/5 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 transition duration-700 ease-out">
                  {/* Fake Header */}
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                    <div className="w-32 h-4 bg-slate-100 rounded-full"></div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                      <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                  {/* Chat Bubbles */}
                  <div className="space-y-4">
                    {/* User Review */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center text-yellow-600 font-bold">A</div>
                      <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none w-full">
                        <div className="flex gap-1 mb-2">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        </div>
                        <div className="h-2 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>

                    {/* AI Reply */}
                    <div className="flex gap-4 flex-row-reverse">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center text-white">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-2xl rounded-tr-none w-full border border-indigo-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">AI Yanıtı</span>
                          <span className="text-xs text-indigo-400">Az önce</span>
                        </div>
                        <div className="h-2 bg-indigo-200 rounded w-full mb-2"></div>
                        <div className="h-2 bg-indigo-200 rounded w-5/6 mb-2"></div>
                        <div className="h-2 bg-indigo-200 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <div className="w-24 h-8 bg-slate-100 rounded-lg"></div>
                    <div className="w-24 h-8 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200"></div>
                  </div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute bottom-20 left-10 w-48 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-slate-100 animate-bounce-slow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">SEO Etkisi</p>
                      <p className="text-sm font-bold text-slate-900">+45% Artış</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 w-[75%] h-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Özellikler</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
              İşletmeniz İçin Tasarlanan <br className="hidden sm:block" />
              Akıllı Çözümler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 (Large) */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200 p-8 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">Otopilot Yanıtlar</h3>
                <p className="text-slate-600 leading-relaxed max-w-md">
                  Yorumları saniyeler içinde analiz edin ve marka dilinize (%99) uygun, kişiselleştirilmiş yanıtlar oluşturun. Standart &quot;Kopyala-Yapıştır&quot; cevaplara son.
                </p>
              </div>
              {/* Abstract graphic at bottom */}
              <div className="mt-8 flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="h-2 w-16 bg-slate-300 rounded-full"></div>
                <div className="h-2 w-24 bg-indigo-300 rounded-full"></div>
                <div className="h-2 w-8 bg-slate-300 rounded-full"></div>
              </div>
            </div>

            {/* Feature 2 (Tall) */}
            <div className="md:col-span-1 group relative overflow-hidden rounded-3xl bg-[#0F172A] text-white p-8 hover:shadow-xl transition-all duration-300">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center text-white mb-6">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">SEO Gücü</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    Yanıtlara stratejik anahtar kelimeler ekleyerek Google harita sıralamanızı organik olarak yükseltin.
                  </p>
                </div>
                <div className="mt-8 bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-end gap-2 h-24">
                    <div className="w-full bg-indigo-500/50 h-[40%] rounded-t"></div>
                    <div className="w-full bg-indigo-500/70 h-[60%] rounded-t"></div>
                    <div className="w-full bg-indigo-500 h-[85%] rounded-t relative">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-green-400">+%24</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 (Wide) */}
            <div className="md:col-span-3 group relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-violet-600 mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">Çoklu Dil Desteği</h3>
                <p className="text-slate-600 leading-relaxed">
                  Turistlerin dilinden konuşun. İngilizce, Arapça, Rusça veya Çince gelen yorumlara, kendi dillerinde mükemmel gramerle yanıt verin.
                </p>
              </div>
              <div className="flex-1 flex flex-wrap gap-3">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">🇹🇷 Merhaba</div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">🇬🇧 Hello</div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">🇸🇦 Marhaba</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Demo Section (Conditional) */}
      {(selectedPlace || loadingDetails) && (
        <div id="demo" className="py-24 bg-slate-900 border-t border-slate-800 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">
                {loadingDetails ? 'İşletme Analiz Ediliyor...' : selectedPlace?.name}
              </h2>
              {!loadingDetails && (
                <p className="text-slate-400 mt-3 text-lg">
                  Son {reviews.length} yorum analiz edildi. Aşağıdan birini seçip AI performansını test edin.
                </p>
              )}
            </div>

            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                <p className="text-indigo-300 animate-pulse">Google Business verileri çekiliyor...</p>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                <AIDemo businessName={selectedPlace?.name || ''} reviews={reviews} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Review Guard. Tüm hakları saklıdır.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
              Gizlilik Politikası
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
