import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
            {/* Simple toggle or buttons */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(0,0,0,0.3)',
                padding: '4px',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)'
            }}>
                <button
                    className={`btn ${language === 'en' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setLanguage('en')}
                    style={{ padding: '4px 8px', fontSize: '0.8rem', border: 'none', background: language === 'en' ? '' : 'transparent', color: language === 'en' ? '' : '#ccc' }}
                >
                    EN
                </button>
                <button
                    className={`btn ${language === 'zh' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setLanguage('zh')}
                    style={{ padding: '4px 8px', fontSize: '0.8rem', border: 'none', background: language === 'zh' ? '' : 'transparent', color: language === 'zh' ? '' : '#ccc' }}
                >
                    中文
                </button>
            </div>
        </div>
    );
};
