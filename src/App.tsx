import { useState } from 'react';
import { PhotoUploader } from './components/PhotoUploader';
import { PhotoEditor } from './components/PhotoEditor';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

function AppContent() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { t } = useLanguage();

  const handleFileSelect = (src: string, name: string) => {
    setImageSrc(src);
    setFileName(name);
  };

  const handleCancel = () => {
    setImageSrc(null);
    setFileName('');
  };

  return (
    <div className="container">
      <LanguageSwitcher />
      <header style={{ marginBottom: '2rem', textAlign: 'center', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {t.title}
        </h1>
        <p style={{ color: '#94a3b8' }}>
          {t.subtitle}
        </p>
      </header>

      <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {!imageSrc ? (
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <PhotoUploader onFileSelect={handleFileSelect} />
          </div>
        ) : (
          <PhotoEditor imageSrc={imageSrc} fileName={fileName} onCancel={handleCancel} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
