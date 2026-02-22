'use client';

import { useState } from 'react';
import { Search, MapPin, Star, Loader2 } from 'lucide-react';


interface Place {
    place_id: string;
    name: string;
    formatted_address: string;
    rating: number;
    user_ratings_total: number;
}

interface BusinessSearchProps {
    onSelect: (place: Place) => void;
}

export default function BusinessSearch({ onSelect }: BusinessSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResults([]);

        try {
            const res = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.results) {
                setResults(data.results);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="İşletme adını girin..."
                    className="w-full h-14 pl-12 pr-[90px] rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ara'}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            {results.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden divide-y divide-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {results.map((place) => (
                        <button
                            key={place.place_id}
                            onClick={() => onSelect(place)}
                            className="w-full text-left p-4 hover:bg-blue-50 transition-colors flex items-start gap-4 group"
                        >
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{place.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">{place.formatted_address}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                        {place.rating} <Star className="w-3 h-3 fill-current" />
                                    </span>
                                    <span className="text-gray-400 text-xs">({place.user_ratings_total} yorum)</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
