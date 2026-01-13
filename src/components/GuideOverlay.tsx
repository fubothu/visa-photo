import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Overlay component to show US Visa photo guidelines.
 * - Center Crosshair
 * - Green Head Contour (representing ~60% height)
 */
export const GuideOverlay: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="guide-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 10,
            border: '2px solid rgba(255, 255, 255, 0.3)'
        }}>
            {/* Center Vertical Line */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: '1px',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                transform: 'translateX(-50%)'
            }} />

            {/* Center Horizontal Line */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                transform: 'translateY(-50%)'
            }} />

            {/* 
        Head Contour Guide
        Spec: Head height 50-69% of photo height.
        Target: ~60% height.
        Position: Centered horizontally.
        Vertical alignment: Eyes should be at ~56-69% from bottom (or ~31-44% from top).
        
        Let's position the oval such that:
        - Height = 60%
        - Top = ~15%
        - Bottom = ~75%
        - Width = ~45% (Approximate head ratio)
      */}
            <div style={{
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '45%',
                height: '60%', // 60% of total height
                border: '3px solid rgba(74, 222, 128, 0.6)', // Green border
                borderRadius: '50% 50% 45% 45%', // Oval shape
                boxShadow: '0 0 20px rgba(74, 222, 128, 0.2), inset 0 0 20px rgba(74, 222, 128, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    color: 'rgba(74, 222, 128, 0.8)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    marginTop: '-120%', // Float above the head
                    whiteSpace: 'nowrap'
                }}>
                    {t.headContour}
                </div>
            </div>

            {/* Optional: Inner Eye overlay for precision (subtle) */}
            <div style={{
                position: 'absolute',
                top: '40%', // Approx eye level
                left: '50%',
                transform: 'translateX(-50%)',
                width: '30%',
                height: '1px',
                borderTop: '1px dashed rgba(74, 222, 128, 0.4)',
            }} />

        </div>
    );
};
