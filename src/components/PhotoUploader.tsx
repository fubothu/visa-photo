import React, { useCallback, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './PhotoUploader.css';

interface PhotoUploaderProps {
    onFileSelect: (imageDataUrl: string, fileName: string, fileHandle?: any) => void;
}

const MIN_DIMENSION = 600;

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onFileSelect }) => {
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const { t } = useLanguage();

    const processFile = useCallback((file: File, handle?: any) => {
        setError(null);

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setError(t.errorFormat);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;

            // Verify dimensions
            const img = new Image();
            img.onload = () => {
                if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
                    setError(t.errorSize(img.width, img.height));
                } else {
                    onFileSelect(result, file.name, handle);
                }
            };
            img.onerror = () => {
                setError(t.errorRead);
            };
            img.src = result;
        };
        reader.readAsDataURL(file);
    }, [onFileSelect, t]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const handleSelectClick = async (e: React.MouseEvent) => {
        // @ts-ignore
        if (window.showOpenFilePicker) {
            e.preventDefault();
            try {
                // @ts-ignore
                const [handle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'Images',
                        accept: { 'image/*': ['.png', '.jpeg', '.jpg'] }
                    }],
                    multiple: false
                });
                const file = await handle.getFile();
                processFile(file, handle);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('File Picker failed', err);
                    // Fallback to default input
                    document.getElementById('fileInput')?.click();
                }
            }
        }
        // If API not supported, label's default behavior handles the click on input
    };

    return (
        <div
            className={`uploader-container ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <div className="upload-content">
                <div className="icon">📁</div>
                <h3>{t.uploadTitle}</h3>
                <p className="sub-text">{t.uploadSubtitle}</p>

                <input
                    type="file"
                    id="fileInput"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden-input"
                />
                <label htmlFor="fileInput" className="btn btn-primary upload-btn" onClick={handleSelectClick}>
                    {t.selectFile}
                </label>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};
