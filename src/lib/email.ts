import { Resend } from 'resend';

export const sendEmail = async (to: string, subject: string, react: React.ReactElement) => {
    // Graceful fallback for dev environment without API Key
    if (!process.env.RESEND_API_KEY) {
        console.log('---------------------------------------------------');
        console.log('📧 [MOCK EMAIL] Sending email to:', to);
        console.log('Subject:', subject);
        console.log('(Configure RESEND_API_KEY in .env.local to send real emails)');
        console.log('---------------------------------------------------');
        return { id: 'mock-email-id', success: true };
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const data = await resend.emails.send({
            from: 'Review Guard <onboarding@resend.dev>',
            to,
            subject,
            react,
        });
        return { ...data, success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        // return { error, success: false };
        throw error;
    }
};
