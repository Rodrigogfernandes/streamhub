import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File, folder?: string) {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: folder || 'streamhub',
          resource_type: 'auto',
          transformation: [
            { width: 800, height: 450, crop: 'fill', quality: 'auto' },
            { format: 'webp' },
          ],
        },
      );
      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      throw new Error('Erro ao fazer upload da imagem');
    }
  }

  async deleteImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { deleted: true };
    } catch (error) {
      throw new Error('Erro ao deletar imagem');
    }
  }
}
