import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello() {
    return {
      status: 'ok',
      service: 'streamhub-backend',
      database: 'mongodb',
      storage: 'cloudinary',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
