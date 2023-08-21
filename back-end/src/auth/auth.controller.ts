 // src/forty-two.controller.ts

import { Controller, Get } from '@nestjs/common';
import { FortyTwoAuthService } from './auth.service';

@Controller('42')
export class FortyTwoController {
  constructor(private readonly authService: FortyTwoAuthService) {}

  @Get('get-token')
  async getAccessToken(): Promise<string> {
    const token = await this.authService.getAccessToken();
    return token;
  }
}
