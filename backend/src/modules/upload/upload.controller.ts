import { Controller, Post, UploadedFile, Body, BadRequestException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    return this.uploadService.uploadImage(file, 'streamhub/channels');
  }

  @Post('delete')
  async deleteImage(@Body() body: { publicId: string }) {
    return this.uploadService.deleteImage(body.publicId);
  }
}
