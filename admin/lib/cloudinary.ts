// Cloudinary upload utility
import imageCompression from 'browser-image-compression';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
}

// Validate file before upload
const validateImageFile = (file: File): void => {
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validImageTypes.includes(file.type)) {
    throw new Error(`Invalid image format. Supported formats: JPEG, PNG, GIF, WebP`);
  }

  if (file.size > maxSize) {
    throw new Error(`Image size too large. Maximum size is 10MB`);
  }
};

const validateVideoFile = (file: File): void => {
  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  const maxSize = 100 * 1024 * 1024; // 100MB

  if (!validVideoTypes.includes(file.type)) {
    throw new Error(`Invalid video format. Supported formats: MP4, WebM, OGG`);
  }

  if (file.size > maxSize) {
    throw new Error(`Video size too large. Maximum size is 100MB`);
  }
};

/**
 * Compress and convert image to WebP format
 * @param file - The image file to compress and convert
 * @param maxSizeMB - Maximum file size in MB (default: 1MB)
 * @param maxWidthOrHeight - Maximum width or height in pixels (default: 1920)
 * @returns Promise<File> - Compressed WebP file
 */
const compressAndConvertToWebP = async (
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
): Promise<File> => {
  try {
    // If file is already WebP and small enough, return as is
    if (file.type === 'image/webp' && file.size <= maxSizeMB * 1024 * 1024) {
      return file;
    }

    // First, compress the image (this keeps the original format but reduces size)
    const compressionOptions = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: true,
      initialQuality: 0.85,
    };

    // Compress the image
    const compressedFile = await imageCompression(file, compressionOptions);

    // Then convert to WebP format using Canvas API
    return await convertToWebP(compressedFile);
  } catch (error: any) {
    console.error('Error compressing image:', error);
    // If compression fails, try to convert to WebP without compression
    try {
      return await convertToWebP(file);
    } catch (conversionError) {
      // If all fails, return original file
      console.warn('Failed to compress/convert image, using original:', conversionError);
      return file;
    }
  }
};

/**
 * Convert image to WebP format using Canvas API
 * @param file - The image file to convert
 * @returns Promise<File> - WebP file
 */
const convertToWebP = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image to WebP'));
              return;
            }
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          'image/webp',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  // Check if file is valid
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file object');
  }

  // Validate file before upload
  validateImageFile(file);

  // Compress and convert to WebP
  const processedFile = await compressAndConvertToWebP(file);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
  }

  const formData = new FormData();
  formData.append('file', processedFile);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'mudrika_international/properties');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      // Log detailed error for debugging
      console.error('Cloudinary upload error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData,
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
        }
      });
      
      const errorMessage = responseData.error?.message || responseData.message || 'Failed to upload image to Cloudinary';
      
      // Provide more specific error messages
      if (responseData.error?.message?.toLowerCase().includes('invalid')) {
        throw new Error(`Invalid image file. Please ensure the file is a valid image (JPEG, PNG, GIF, WebP) and try again.`);
      }
      
      throw new Error(errorMessage);
    }

    return {
      secure_url: responseData.secure_url,
      public_id: responseData.public_id,
      width: responseData.width,
      height: responseData.height,
    };
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to upload image to Cloudinary. Please check your internet connection and try again.');
  }
};

export const uploadVideoToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  // Check if file is valid
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file object');
  }

  // Validate file before upload
  validateVideoFile(file);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'mudrika_international/properties/videos');
  formData.append('resource_type', 'video');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error?.message || error.message || 'Failed to upload video to Cloudinary';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to upload video to Cloudinary. Please check your internet connection and try again.');
  }
};

export const uploadMultipleToCloudinary = async (
  files: File[]
): Promise<CloudinaryUploadResponse[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
};

// Upload image to Cloudinary with custom folder
export const uploadToCloudinaryWithFolder = async (
  file: File,
  folder: string = 'mudrika_international/properties'
): Promise<CloudinaryUploadResponse> => {
  // Check if file is valid
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file object');
  }

  // Validate file before upload
  validateImageFile(file);

  // Compress and convert to WebP
  const processedFile = await compressAndConvertToWebP(file);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
  }

  const formData = new FormData();
  formData.append('file', processedFile);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Cloudinary upload error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData,
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
        }
      });
      
      const errorMessage = responseData.error?.message || responseData.message || 'Failed to upload image to Cloudinary';
      
      if (responseData.error?.message?.toLowerCase().includes('invalid')) {
        throw new Error(`Invalid image file. Please ensure the file is a valid image (JPEG, PNG, GIF, WebP) and try again.`);
      }
      
      throw new Error(errorMessage);
    }

    return {
      secure_url: responseData.secure_url,
      public_id: responseData.public_id,
      width: responseData.width,
      height: responseData.height,
    };
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to upload image to Cloudinary. Please check your internet connection and try again.');
  }
};

