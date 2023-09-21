import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('init')
  async initAuth() {
    return this.authService.initAuth();
  }

  @Get()
  async successAuth(@Query('code') code: string) {
    console.log('Received code:', code); // Log the received code
    const result = await this.authService.successAuth(code);
    console.log('Success Auth Result:', result); // Log the result of successAuth
    return result;
  }
}
