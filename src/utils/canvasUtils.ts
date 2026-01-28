export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

/**
 * This function was adapted from the one in the Readme of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<string> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return ''
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw image
    ctx.drawImage(image, 0, 0)

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // paste generated rotate image containing the top left corner from the "crop center" offset
    ctx.putImageData(data, 0, 0)

    // As Base64 string
    return canvas.toDataURL('image/jpeg', 0.95);
}

import type { VisaRequirement } from './visaRequirements';

/**
 * Generates a 6x4 inch tiled image (3x2 grid of 2x2 inch photos for US).
 * Adapted for other sizes to fit as many as possible.
 * Output: 1800x1200 px (at 300dpi)
 */
export async function generateTiledImage(singlePhotoDataUrl: string, requirement: VisaRequirement): Promise<string> {
    const image = await createImage(singlePhotoDataUrl);

    // Canvas size for 6x4 inch @ 300dpi
    // Width: 6 inch * 300 = 1800 px
    // Height: 4 inch * 300 = 1200 px
    // We assume landscape orientation for the paper itself
    const canvasWidth = 1800;
    const canvasHeight = 1200;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate photo size in pixels (300 dpi)
    // 1 inch = 25.4 mm
    // px = (mm / 25.4) * 300
    const ppm = 300 / 25.4; // pixels per mm
    const photoWidthPx = Math.round(requirement.widthMm * ppm);
    const photoHeightPx = Math.round(requirement.heightMm * ppm);

    // Simple tiling logic: maximize fit
    // Try normal orientation
    const cols = Math.floor(canvasWidth / photoWidthPx);
    const rows = Math.floor(canvasHeight / photoHeightPx);

    // Calculate margins to center the grid
    const totalGridWidth = cols * photoWidthPx;
    const totalGridHeight = rows * photoHeightPx;
    const startX = (canvasWidth - totalGridWidth) / 2;
    const startY = (canvasHeight - totalGridHeight) / 2;

    // Draw photos
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = startX + c * photoWidthPx;
            const y = startY + r * photoHeightPx;

            // Draw image
            ctx.drawImage(image, x, y, photoWidthPx, photoHeightPx);

            // Draw light cut lines/border
            ctx.strokeStyle = '#e2e8f0'; // slate-200
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);
        }
    }

    return canvas.toDataURL('image/jpeg', 0.95);
}

