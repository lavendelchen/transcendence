import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello from the backend of [PING PANG PONG] !';
  }
}
