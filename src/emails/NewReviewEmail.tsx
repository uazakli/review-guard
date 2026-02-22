import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Section,
    Button,
} from '@react-email/components';
import * as React from 'react';

interface NewReviewEmailProps {
    businessName: string;
    reviewerName: string;
    starRating: number;
    comment: string;
    reviewLink: string;
}

export const NewReviewEmail = ({
    businessName,
    reviewerName,
    starRating,
    comment,
    reviewLink,
}: NewReviewEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Yeni bir Google yorumunuz var!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Yeni Yorum Bildirimi 🔔</Heading>
                    <Text style={text}>Merhaba <b>{businessName}</b>,</Text>
                    <Text style={text}>
                        İşletmeniz için yeni bir yorum alındı.
                    </Text>

                    <Section style={reviewContainer}>
                        <Text style={reviewText}>
                            <b>{reviewerName}</b> • {'★'.repeat(starRating)}
                        </Text>
                        <Text style={reviewText}>&quot;{comment}&quot;</Text>
                    </Section>

                    <Button style={button} href={reviewLink}>
                        Yorumu Yanıtla
                    </Button>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    paddingTop: '32px',
    paddingBottom: '16px',
};

const text = {
    color: '#525f7f',
    fontSize: '16px',
    lineHeight: '24px',
};

const reviewContainer = {
    padding: '24px',
    backgroundColor: '#f6f9fc',
    borderRadius: '4px',
    marginBottom: '24px',
    border: '1px solid #e6ebf1',
};

const reviewText = {
    ...text,
    margin: '0 0 10px 0',
};

const button = {
    backgroundColor: '#5e6ad2',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '12px',
};

export default NewReviewEmail;
