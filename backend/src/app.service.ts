import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      service: 'streamhub-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
