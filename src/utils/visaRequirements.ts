export interface VisaRequirement {
    id: string;
    label: string;
    widthMm: number;
    heightMm: number;
    // For print size calculations:
    // US: 2x2 inches = 50.8 x 50.8 mm
    // CN: 33 x 48 mm
    // EU/UK: 35 x 45 mm
    // JP: 45 x 45 mm (standard)

    aspectRatio: number; // width / height

    // Guide overlay configuration
    guide: {
        // Approximate head height percentage range (min, max)
        headHeightPercent: [number, number];
        // Top margin percentage (approximate distance from top of photo to top of head)
        topMarginPercent?: number;
    }
}

export const VISA_REQUIREMENTS: Record<string, VisaRequirement> = {
    'US': {
        id: 'US',
        label: 'USA (2x2")',
        widthMm: 50.8, // 2 inches
        heightMm: 50.8,
        aspectRatio: 1,
        guide: {
            headHeightPercent: [0.50, 0.69], // 50-69%
            topMarginPercent: 0.15 // ~15% from top
        }
    },
    'CN': {
        id: 'CN',
        label: 'China (33x48mm)',
        widthMm: 33,
        heightMm: 48,
        aspectRatio: 33 / 48,
        guide: {
            headHeightPercent: [0.58, 0.69], // 28-33mm / 48mm ~= 58-69%
            topMarginPercent: 0.08 // 3-5mm / 48mm ~= 6-10%
        }
    },
    'EU': {
        id: 'EU',
        label: 'Schengen/EU (35x45mm)',
        widthMm: 35,
        heightMm: 45,
        aspectRatio: 35 / 45,
        guide: {
            headHeightPercent: [0.70, 0.80], // 32-36mm / 45mm ~= 71-80%
            topMarginPercent: 0.07 // ~3mm gap => ~6-7%
        }
    },
    'UK': {
        id: 'UK',
        label: 'UK (35x45mm)',
        widthMm: 35,
        heightMm: 45,
        aspectRatio: 35 / 45,
        guide: {
            headHeightPercent: [0.64, 0.75], // 29-34mm / 45mm ~= 64-75%
            topMarginPercent: 0.10 // ~10%
        }
    },
    'JP': {
        id: 'JP',
        label: 'Japan (45x45mm)',
        widthMm: 45,
        heightMm: 45,
        aspectRatio: 1,
        guide: {
            headHeightPercent: [0.70, 0.80], // 32-36mm / 45mm ~= 71-80%
            topMarginPercent: 0.08 // ~4-6mm
        }
    }
};
