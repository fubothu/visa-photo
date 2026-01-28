import React from 'react';
import type { VisaRequirement } from '../utils/visaRequirements';
import { useLanguage } from '../contexts/LanguageContext';

interface GuideOverlayProps {
    guide: VisaRequirement['guide'];
}

/**
 * Overlay component to show Visa photo guidelines.
 * - Center Crosshair
 * - Green Head Contour (sized according to spec)
 */
export const GuideOverlay: React.FC<GuideOverlayProps> = ({ guide }) => {
    const { t } = useLanguage();

    // headHeightPercent is [min, max]
    // We visualize the average or target height
    const minHeight = guide.headHeightPercent[0];
    const maxHeight = guide.headHeightPercent[1];
    const targetHeight = (minHeight + maxHeight) / 2;

    // Top position
    // If topMarginPercent is provided, use it.
    // Otherwise, we center vertically or guess.
    // Spec usually says "eye height from bottom" or "head from top".
    // Let's use topMarginPercent + half of head height to center the head oval roughly where it should be.

    const topMargin = guide.topMarginPercent || (1 - targetHeight) / 2; // Default to centered if no top margin
    const heightPercent = targetHeight * 100;
    const topPercent = topMargin * 100;

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
      */}
            <div style={{
                position: 'absolute',
                top: `${topPercent}%`,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '45%', // Generic width relative to container width. 
                // Since aspect ratio changes, this width % covers different actual width.
                // Maybe we should adjust width too?
                // Standard head width is ~60-70% of head height.
                height: `${heightPercent}%`,
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
                top: `${topPercent + (heightPercent * 0.4)}%`, // Approx eye level within head
                left: '50%',
                transform: 'translateX(-50%)',
                width: '30%',
                height: '1px',
                borderTop: '1px dashed rgba(74, 222, 128, 0.4)',
            }} />

        </div>
    );
};
