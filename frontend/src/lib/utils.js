import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function resolveImageDataUrl(source) {
  if (!source) return '';

  const isWebpDataUrl = source.startsWith('data:image/webp');
  if (source.startsWith('data:') && !isWebpDataUrl) return source;

  const toPngDataUrl = async (imageSource) => {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageSource;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context unavailable');
    }

    context.drawImage(image, 0, 0);
    return canvas.toDataURL('image/png');
  };

  if (isWebpDataUrl) {
    try {
      return await toPngDataUrl(source);
    } catch (error) {
      console.error('Failed to convert WebP logo for PDF:', error);
      return '';
    }
  }

  const response = await fetch(source);
  const blob = await response.blob();

  if (blob.type === 'image/webp') {
    const objectUrl = URL.createObjectURL(blob);

    try {
      return await toPngDataUrl(objectUrl);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
