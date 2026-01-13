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

/**
 * Generates a 6x4 inch tiled image (3x2 grid of 2x2 inch photos).
 * Assuming input photo is correctly squared.
 * Output: 1800x1200 px (at 300dpi)
 */
export async function generateTiledImage(singlePhotoDataUrl: string): Promise<string> {
    const image = await createImage(singlePhotoDataUrl);

    // Canvas size for 6x4 inch @ 300dpi
    // Width: 6 inch * 300 = 1800 px
    // Height: 4 inch * 300 = 1200 px
    const canvas = document.createElement('canvas');
    canvas.width = 1800;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Each photo is 2x2 inch = 600x600 px
    // We want a 3x2 grid.
    // 600 * 3 = 1800 (Fits perfectly width)
    // 600 * 2 = 1200 (Fits perfectly height)

    const photoSize = 600;

    // Draw 6 photos
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
            const x = c * photoSize;
            const y = r * photoSize;

            // Draw image
            ctx.drawImage(image, x, y, photoSize, photoSize);

            // Optional: Draw light cut lines or border?
            // Since background is white and photos usually white, helpful to have a very light border
            ctx.strokeStyle = '#e2e8f0'; // slate-200
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, photoSize, photoSize);
        }
    }

    return canvas.toDataURL('image/jpeg', 0.95);
}
