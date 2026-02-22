'use server'

import { sendEmail } from '@/lib/email';
import NewReviewEmail from '@/emails/NewReviewEmail';
import { createClient } from '@/lib/supabase/server';

export async function sendTestNotification() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        throw new Error('User not found or no email');
    }

    // Mock Review Data
    const mockReview = {
        businessName: "Çaylak Tost",
        reviewerName: "Ahmet Yılmaz",
        starRating: 5,
        comment: "Harika bir deneyimdi, tostlar çok lezzetliydi! Kesinlikle tekrar geleceğim.",
        reviewLink: "https://google.com/maps",
    };

    const emailHtml = NewReviewEmail(mockReview);

    try {
        const result = await sendEmail(
            user.email,
            'Yeni Google Yorumu: 5 Yıldız! ⭐',
            emailHtml
        );
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: 'Failed to send email: ' + (error as Error).message };
    }
}
