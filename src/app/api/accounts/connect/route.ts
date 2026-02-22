import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { location } = body; // Location object from Google API (or Mock)

        // 1. Save Account to Supabase
        const { data: account, error: accountError } = await supabase
            .from('accounts')
            .insert({
                user_id: user.id,
                connection_method: 'oauth',
                google_location_id: location.name, // "locations/X"
                business_name: location.title,
                is_active: true
            })
            .select()
            .single();

        if (accountError) throw accountError;

        // 2. Insert Mock Reviews (Seeding for Demo)
        // In real app, we would fetch from Google API here.

        const randomReviewers = ['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Çelik', 'Canan Öztürk', 'Burak Yıldız', 'Elif Arslan', 'Murat Koç', 'Selin Yılmaz', 'Kaan Demir'];
        const randomComments = [
            'Harika bir deneyimdi, kesinlikle tavsiye ederim.',
            'Servis biraz yavaştı ama lezzet süper.',
            'Fiyatlar biraz yüksek ama kalite ortada.',
            'Beklediğimden daha iyi çıktı, ellerinize sağlık.',
            'Maalesef pek memnun kalmadım, geliştirilmeli.',
            'Mekan çok şık ve ferah, arkadaşlarla gelmek için ideal.',
            'Personel çok ilgili ve güler yüzlüydü.',
            'Tam bir hayal kırıklığı, bir daha gelmem.',
            'Kahvaltısı efsane, mutlaka deneyin.',
            'Ortalama bir mekan, ne iyi ne kötü.'
        ];

        const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

        const mockReviews = Array.from({ length: 3 }).map((_, i) => ({
            account_id: account.id,
            google_review_id: `review-${Date.now()}-${i}`,
            reviewer_name: getRandom(randomReviewers),
            star_rating: Math.floor(Math.random() * 5) + 1,
            comment: getRandom(randomComments),
            review_date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
            reply_status: 'pending'
        }));

        const { error: reviewsError } = await supabase
            .from('reviews')
            .insert(mockReviews);

        if (reviewsError) throw reviewsError;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error connecting account:', error);
        return NextResponse.json({
            error: 'Failed to connect account',
            details: error.message
        }, { status: 500 });
    }
}
