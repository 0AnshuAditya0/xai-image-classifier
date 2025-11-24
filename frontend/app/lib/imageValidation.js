// Image validation utilities

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MIN_DIMENSIONS = 224;
export const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function validateImageFile(file) {
  const errors = [];

  // Check file type
  if (!ALLOWED_FORMATS.includes(file.type)) {
    errors.push('Only JPG, PNG, and WebP formats are supported');
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    errors.push(`File size (${sizeMB}MB) exceeds maximum allowed size of 10MB`);
  }

  return errors;
}

export async function getImageMetadata(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const metadata = {
        filename: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        width: img.width,
        height: img.height,
        dimensions: `${img.width} × ${img.height}`,
        format: file.type.split('/')[1].toUpperCase(),
        aspectRatio: (img.width / img.height).toFixed(2),
      };

      // Check minimum dimensions
      const dimensionErrors = [];
      if (img.width < MIN_DIMENSIONS || img.height < MIN_DIMENSIONS) {
        dimensionErrors.push(
          `Image dimensions (${img.width}×${img.height}) are below minimum required (${MIN_DIMENSIONS}×${MIN_DIMENSIONS})`
        );
      }

      URL.revokeObjectURL(url);
      resolve({ metadata, errors: dimensionErrors });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function calculateImageHash(file) {
  // Simple hash for caching (in production, use crypto.subtle.digest)
  return `${file.name}-${file.size}-${file.lastModified}`;
}
