import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Point, Area } from 'react-easy-crop';
import { GuideOverlay } from './GuideOverlay';
import getCroppedImg, { generateTiledImage } from '../utils/canvasUtils';
import { useLanguage } from '../contexts/LanguageContext';
import './PhotoEditor.css';

interface PhotoEditorProps {
    imageSrc: string;
    fileName: string;
    onCancel: () => void;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({ imageSrc, fileName, onCancel }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const { t } = useLanguage();

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const saveFile = async (dataUrl: string, suffix: string) => {
        // Construct new filename: [original]-[suffix].jpeg
        const namePart = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        const newFileName = `${namePart}-${suffix}.jpeg`;

        // Try File System Access API
        try {
            // @ts-ignore
            if (window.showSaveFilePicker) {
                // @ts-ignore
                const handle = await window.showSaveFilePicker({
                    suggestedName: newFileName,
                    types: [{
                        description: 'JPEG Image',
                        accept: { 'image/jpeg': ['.jpeg', '.jpg'] },
                    }],
                });
                const writable = await handle.createWritable();
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                await writable.write(blob);
                await writable.close();
                return;
            }
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            console.warn('File Save API failed', err);
        }

        // Fallback
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = newFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownload = async () => {
        if (!croppedAreaPixels) return;
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            await saveFile(croppedImage, 'visa-photo');
        } catch (e) {
            console.error(e);
            alert('Failed to crop image');
        }
    };

    const handleDownloadPrintSheet = async () => {
        if (!croppedAreaPixels) return;
        try {
            // 1. Get single cropped image first
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            // 2. Generate tiled sheet
            const tiledImage = await generateTiledImage(croppedImage);
            // 3. Save
            await saveFile(tiledImage, 'visa-photo-6x4-print');
        } catch (e) {
            console.error(e);
            alert('Failed to generate print sheet');
        }
    };


    const adjustZoom = (delta: number) => {
        setZoom(prev => Math.min(Math.max(prev + delta, 1), 3));
    };

    const adjustRotation = (delta: number) => {
        setRotation(prev => prev + delta);
    };

    return (
        <div className="editor-container">
            <div className="crop-container-wrapper glass-panel">
                <div className="crop-container">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        showGrid={false} // We provide our own guides
                        cropSize={{ width: 400, height: 400 }} // Fixed visual size
                    />
                    <GuideOverlay />
                </div>
            </div>

            <div className="controls-panel glass-panel">

                {/* Zoom Controls */}
                <div className="control-group">
                    <label>{t.zoom}</label>
                    <div className="control-row">
                        <button className="btn btn-icon" onClick={() => adjustZoom(-0.1)}>-</button>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                        />
                        <button className="btn btn-icon" onClick={() => adjustZoom(0.1)}>+</button>
                    </div>
                </div>

                {/* Rotate Controls */}
                <div className="control-group">
                    <label>{t.rotation}</label>
                    <div className="control-row">
                        <button className="btn btn-secondary" onClick={() => adjustRotation(-90)}>
                            ↺ -90°
                        </button>
                        <button className="btn btn-secondary" onClick={() => adjustRotation(-1)}>
                            ↺ -1°
                        </button>
                        <button className="btn btn-secondary" onClick={() => adjustRotation(1)}>
                            1° ↻
                        </button>
                        <button className="btn btn-secondary" onClick={() => adjustRotation(90)}>
                            90° ↻
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="actions-row" style={{ flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        <button className="btn btn-danger" onClick={onCancel}>
                            {t.startOver}
                        </button>
                        <button className="btn btn-primary" onClick={handleDownload} style={{ flex: 1.5 }}>
                            {t.download}
                        </button>
                    </div>

                    <button className="btn" style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        width: '100%',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }} onClick={handleDownloadPrintSheet}>
                        {t.downloadPrintSheet}
                    </button>
                </div>

                <p className="hint-text">
                    {t.hint}
                </p>
            </div>
        </div>
    );
};
