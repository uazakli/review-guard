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
        const { reviewId, action, replyText } = await req.json();

        if (!reviewId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Prepare update data
        let updateData: any = {};

        if (action === 'approve') {
            updateData = {
                reply_status: 'published',
                generated_reply: replyText, // Ensure current text is saved
                published_reply_id: `mock-google-reply-${Date.now()}` // Simulation
            };
            // TODO: Here we would call Google API to actually publish the reply
        } else if (action === 'reject') {
            updateData = {
                reply_status: 'rejected'
            };
        } else if (action === 'save_draft') {
            updateData = {
                generated_reply: replyText,
                reply_status: 'pending'
            };
        }

        const { error } = await supabase
            .from('reviews')
            .update(updateData)
            .eq('id', reviewId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error updating review:', error);
        return NextResponse.json({
            error: 'Failed to update review',
            details: error.message
        }, { status: 500 });
    }
}
