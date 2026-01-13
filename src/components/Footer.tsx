import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer style={{
            marginTop: '3rem',
            marginBottom: '2rem',
            textAlign: 'center',
            padding: '1rem',
            color: '#94a3b8',
            fontSize: '0.875rem',
            borderTop: '1px solid #e2e8f0'
        }}>
            <p style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.5' }}>
                {t.disclaimer}
            </p>
            <p style={{ maxWidth: '800px', margin: '0.5rem auto 0', lineHeight: '1.5', fontSize: '0.75rem' }}>
                {t.privacy}
            </p>
        </footer>
    );
}
