export interface Account {
    id: string;
    created_at: string;
    business_name: string;
    user_id: string;
    place_id: string;
    auto_reply_enabled?: boolean;
    min_star_rating?: number;
    publication_mode?: 'manual' | 'semi' | 'automated';
}

export interface Review {
    id: string;
    review_id: string;
    account_id: string;
    author_name: string;
    author_url?: string;
    language?: string;
    original_language?: string;
    profile_photo_url?: string;
    rating: number; // Verify if it's rating or star_rating
    star_rating: number; // In code it used star_rating
    relative_time_description?: string;
    text: string;
    original_text?: string;
    time: number;
    translated: boolean;
    review_date: string; // ISO date string
    reviewer_name?: string;
    comment?: string;
    generated_reply?: string;
    reply_status: 'published' | 'draft' | 'pending' | 'rejected' | 'approved';
    reply_text?: string;
}

export interface User {
    id: string;
    email?: string;
    user_metadata?: {
        full_name?: string;
        avatar_url?: string;
    };
    app_metadata?: {
        provider?: string;
        providers?: string[];
    };
    aud: string;
    created_at: string;
}
