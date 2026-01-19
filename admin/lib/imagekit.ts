// ImageKit utility for uploading and transforming 360-degree panorama images
import ImageKit from 'imagekit-javascript';

export interface ImageKitUploadResponse {
  url: string;
  fileId: string;
  name: string;
  size: number;
  versionInfo?: {
    id: string;
    name: string;
  };
  filePath: string;
  thumbnailUrl?: string;
}

// Initialize ImageKit
const getImageKit = () => {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !urlEndpoint) {
    throw new Error('ImageKit configuration is missing. Please check your environment variables.');
  }

  return new ImageKit({
    publicKey: publicKey,
    urlEndpoint: urlEndpoint,
  });
};

// Validate 360 panorama image
const validate360Image = (file: File): void => {
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 20 * 1024 * 1024; // 20MB for high-quality panoramas

  if (!validImageTypes.includes(file.type)) {
    throw new Error(`Invalid image format for 360 view. Supported formats: JPEG, PNG`);
  }

  if (file.size > maxSize) {
    throw new Error(`Image size too large. Maximum size is 20MB for 360 panoramas`);
  }
};

// Check if image has proper dimensions for 360 view (should be close to 2:1 ratio)
const checkImageDimensions = (file: File): Promise<{ width: number; height: number; ratio: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const width = img.width;
      const height = img.height;
      const ratio = width / height;
      resolve({ width, height, ratio });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for dimension check'));
    };

    img.src = url;
  });
};

/**
 * Upload 360 panorama image to ImageKit with 2:1 aspect ratio transformation
 * @param file - The image file to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with ImageKit upload response
 */
export const upload360ImageToImageKit = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<ImageKitUploadResponse> => {
  // Validate file
  validate360Image(file);

  // Check image dimensions
  const dimensions = await checkImageDimensions(file);
  console.log('Original image dimensions:', dimensions);

  // Get authentication token from backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const authEndpoint = `${apiUrl}/admin/imagekit/auth`;
  
  console.log('🔍 Fetching ImageKit auth from:', authEndpoint);
  
  const authResponse = await fetch(authEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('📡 Auth response status:', authResponse.status);

  if (!authResponse.ok) {
    const errorText = await authResponse.text();
    console.error('❌ Auth failed:', {
      status: authResponse.status,
      statusText: authResponse.statusText,
      body: errorText,
      url: authEndpoint
    });
    throw new Error(`Failed to get ImageKit authentication token (Status: ${authResponse.status}). Check backend server is running.`);
  }

  const authData = await authResponse.json();
  console.log('✅ Auth successful, got token');

  // Create FormData for upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', `panorama_${Date.now()}_${file.name}`);
  formData.append('folder', '/mudrika_international/panoramas');
  formData.append('token', authData.token);
  formData.append('signature', authData.signature);
  formData.append('expire', authData.expire);
  formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
  
  // No transformations - upload image as-is for Photo Sphere Viewer
  // Photo Sphere Viewer handles equirectangular images natively
  
  // Add tags for easy filtering
  formData.append('tags', 'panorama,360-view,property');

  try {
    // ImageKit upload endpoint is ALWAYS this URL (not your custom endpoint)
    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.message || 'Failed to upload image to ImageKit');
    }

    const uploadData = await uploadResponse.json();

    // Use original URL - no transformations needed for Photo Sphere Viewer
    const imageUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${uploadData.filePath}`;

    return {
      url: imageUrl, // Original image URL
      fileId: uploadData.fileId,
      name: uploadData.name,
      size: uploadData.size,
      filePath: uploadData.filePath,
      thumbnailUrl: generateThumbnailUrl(uploadData.filePath),
    };
  } catch (error: any) {
    console.error('ImageKit upload error:', error);
    throw new Error(error.message || 'Failed to upload 360 image to ImageKit');
  }
};

/**
 * Generate URL for 360 image without transformations
 * @param filePath - The file path from ImageKit
 * @returns Original image URL
 */
export const generate360ImageUrl = (filePath: string): string => {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  
  if (!urlEndpoint) {
    throw new Error('ImageKit URL endpoint is missing');
  }

  // Return original image URL - Photo Sphere Viewer handles equirectangular images natively
  return `${urlEndpoint}${filePath}`;
};

/**
 * Generate thumbnail URL for 360 image preview
 * @param filePath - The file path from ImageKit
 * @returns Thumbnail image URL
 */
export const generateThumbnailUrl = (filePath: string): string => {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  
  if (!urlEndpoint) {
    throw new Error('ImageKit URL endpoint is missing');
  }

  // Create a small thumbnail without aspect ratio transformation
  const thumbnailPath = `${urlEndpoint}/tr:w-400,f-auto,q-60${filePath}`;
  
  return thumbnailPath;
};

/**
 * Upload multiple 360 images
 * @param files - Array of image files
 * @param onProgress - Optional callback for overall progress
 * @returns Promise with array of ImageKit upload responses
 */
export const uploadMultiple360Images = async (
  files: File[],
  onProgress?: (progress: number) => void
): Promise<ImageKitUploadResponse[]> => {
  const results: ImageKitUploadResponse[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await upload360ImageToImageKit(files[i], (fileProgress) => {
      // Calculate overall progress
      const overallProgress = ((i / files.length) * 100) + ((fileProgress / files.length));
      onProgress?.(overallProgress);
    });
    results.push(result);
  }

  onProgress?.(100);
  return results;
};

/**
 * Delete 360 image from ImageKit
 * @param fileId - The file ID from ImageKit
 * @param token - Authentication token (optional, required for authenticated routes)
 */
export const delete360Image = async (fileId: string, token?: string): Promise<void> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/admin/imagekit/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fileId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image from ImageKit');
    }
  } catch (error: any) {
    console.error('ImageKit delete error:', error);
    throw new Error(error.message || 'Failed to delete 360 image from ImageKit');
  }
};

