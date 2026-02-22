'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, MapPin } from 'lucide-react';

interface Location {
    name: string; // "accounts/X/locations/Y"
    title: string;
    storeCode?: string;
    metadata?: any;
}

export default function ConnectGoogleBusiness() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [existingConnections, setExistingConnections] = useState<Set<string>>(new Set());
    const supabase = createClient();

    useEffect(() => {
        setError(null);
        fetchExistingConnections();
    }, []);

    const fetchExistingConnections = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('accounts')
            .select('google_location_id')
            .eq('user_id', user.id);

        if (data) {
            setExistingConnections(new Set(data.map(d => d.google_location_id).filter(Boolean) as string[]));
        }
    };

    const fetchLocations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/google/locations');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.details ? `${data.error}: ${data.details}` : data.error || 'Failed to fetch locations');
            }
            const data = await res.json();
            setLocations(data.locations);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (location: Location) => {
        try {
            const res = await fetch('/api/accounts/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.details || data.error || 'Failed to connect');
            }


            // Redirect to dashboard after brief delay
            window.location.href = '/dashboard';

        } catch (err: any) {
            alert("Bağlantı hatası: " + err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Google İşletme Profili</h2>
                <button
                    onClick={fetchLocations}
                    disabled={loading}
                    className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'İşletmeleri Getir'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                    ⚠️ {error}
                </div>
            )}

            <div className="grid gap-4">
                {locations.length === 0 && !loading && !error && (
                    <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                        Henüz işletme listelenmedi.
                    </div>
                )}

                {locations.map((loc) => (
                    <div
                        key={loc.name}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{loc.title}</h3>
                                <p className="text-xs text-gray-500">{loc.storeCode || 'Mağaza Kodu Yok'}</p>
                            </div>
                        </div>

                        {existingConnections.has(loc.name) ? (
                            <button
                                disabled
                                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium text-sm cursor-default"
                            >
                                Bağlı
                            </button>
                        ) : (
                            <button
                                onClick={() => handleConnect(loc)}
                                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                            >
                                Bağla
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
