'use client';

import ReviewCard from './ReviewCard';

export default function ReviewList({ reviews }: { reviews: any[] }) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">Henüz hiç yorum yok.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
}
