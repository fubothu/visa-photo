import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface Translations {
    title: string;
    subtitle: string;
    uploadTitle: string;
    uploadSubtitle: string;
    selectFile: string;
    errorFormat: string;
    errorSize: (w: number, h: number) => string;
    errorRead: string;
    zoom: string;
    rotation: string;
    startOver: string;
    download: string;
    downloadPrintSheet: string;
    hint: string;
    headContour: string;
}

const translations: Record<Language, Translations> = {
    en: {
        title: 'US Visa Photo Maker',
        subtitle: 'Upload, Align, and Download Compliant Photos.',
        uploadTitle: 'Click or Drag to Upload',
        uploadSubtitle: 'Supports JPEG, PNG. Min 600x600 pixels.',
        selectFile: 'Select File',
        errorFormat: 'Only JPEG and PNG are supported',
        errorSize: (w, h) => `Resolution too low (${w}x${h}). Required: 600x600+.`,
        errorRead: 'Failed to read image file.',
        zoom: 'Scaling (Zoom)',
        rotation: 'Rotation',
        startOver: 'Start Over',
        download: 'Download Photo',
        downloadPrintSheet: 'Download 4x6" Printable (6 Photos)',
        hint: 'Double tap / Pinch to Zoom on Trackpad supported.',
        headContour: 'Fit Head Here',
    },
    zh: {
        title: '美国签证照片制作',
        subtitle: '上传、对齐、下载符合要求的照片。',
        uploadTitle: '点击或拖拽上传照片',
        uploadSubtitle: '支持 JPEG, PNG。像素不低于 600x600。',
        selectFile: '选择文件',
        errorFormat: '仅支持 JPEG 或 PNG 格式',
        errorSize: (w, h) => `图片分辨率过低 (${w}x${h})。需要至少 600x600 像素。`,
        errorRead: '无法读取图片文件。',
        zoom: '缩放 (Zoom)',
        rotation: '旋转 (Rotation)',
        startOver: '重新开始',
        download: '下载照片',
        downloadPrintSheet: '下载 4x6" 排版 (6张)',
        hint: '支持触控板双指捏合缩放。',
        headContour: '将头部对齐此处',
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('zh'); // Default to Chinese as user interacted in Chinese

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
