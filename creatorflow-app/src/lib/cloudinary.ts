import { v2 as cloudinary } from 'cloudinary';

// Add type definitions at the top of the file
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: 'image' | 'video';
  duration?: number;
  thumbnail_url?: string;
}

export interface UploadOptions {
  folder?: string;
  transformation?: any;
  resource_type?: 'auto' | 'image' | 'video';
  allowed_formats?: string[];
  max_bytes?: number;
}

export class CloudinaryService {
  private static instance: CloudinaryService;
  private defaultFolder = 'creatorflow';

  private constructor() {}

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /**
   * Upload a file to Cloudinary
   */
  async uploadFile(
    file: Buffer | string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const {
        folder = this.defaultFolder,
        transformation,
        resource_type = 'auto',
        allowed_formats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'webm'],
        max_bytes = 100 * 1024 * 1024 // 100MB
      } = options;

      // Validate file size
      if (Buffer.isBuffer(file) && file.length > max_bytes) {
        throw new Error(`File size exceeds maximum allowed size of ${max_bytes} bytes`);
      }

      const uploadOptions: any = {
        folder,
        resource_type,
        allowed_formats,
        transformation: transformation || this.getDefaultTransformation(resource_type),
        overwrite: false,
        unique_filename: true,
        use_filename: true,
      };

      let result;
      if (Buffer.isBuffer(file)) {
        // Upload buffer
        result = await new Promise<UploadResult>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) reject(error);
              else resolve(result as UploadResult);
            }
          );
          uploadStream.end(file);
        });
      } else {
        // Upload from URL
        result = await cloudinary.uploader.upload(file, uploadOptions);
      }

      // Generate thumbnail for videos
      if (result.resource_type === 'video') {
        result.thumbnail_url = cloudinary.url(result.public_id, {
          resource_type: 'video',
          transformation: [
            { width: 400, height: 300, crop: 'fill' },
            { quality: 'auto' }
          ]
        });
      }

      return result as UploadResult;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a file from Cloudinary
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate optimized URL with transformations
   */
  generateOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
      format?: string;
      crop?: string;
      resource_type?: 'image' | 'video';
    } = {}
  ): string {
    const {
      width,
      height,
      quality = 'auto',
      format = 'auto',
      crop = 'fill',
      resource_type = 'image'
    } = options;

    const transformation: any[] = [];

    if (width || height) {
      transformation.push({
        width,
        height,
        crop,
        quality
      });
    }

    if (format !== 'auto') {
      transformation.push({ fetch_format: format });
    }

    return cloudinary.url(publicId, {
      resource_type,
      transformation,
      secure: true
    });
  }

  /**
   * Get default transformation based on resource type
   */
  private getDefaultTransformation(resourceType: string) {
    if (resourceType === 'video') {
      return [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ];
    }

    return [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ];
  }

  /**
   * Validate file before upload
   */
  validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mov',
      'video/avi',
      'video/webm'
    ];

    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: `File type ${file.mimetype} is not supported`
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size ${file.size} bytes exceeds maximum allowed size of ${maxSize} bytes`
      };
    }

    return { valid: true };
  }

  /**
   * Get file info from Cloudinary
   */
  async getFileInfo(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<any> {
    try {
      return await cloudinary.api.resource(publicId, { resource_type: resourceType });
    } catch (error) {
      console.error('Cloudinary get file info error:', error);
      throw new Error(`Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const cloudinaryService = CloudinaryService.getInstance();

// Export cloudinary instance for direct use if needed
export { cloudinary }; 