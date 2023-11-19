import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Request } from 'express';

//declare session type becuase of typescript
declare module 'express-session' {
  export interface SessionData {
    dataAuthCode: any;
    dataAuthenticated: any;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('init')
  async initAuth() {
    return this.authService.initAuth();
  }

  @Get()
  async successAuth(@Query('code') code: string, @Res() res: Response, @Req() req: Request) {
    console.log('Received code:', code); // Log the received code
    const result = await this.authService.successAuth(code);
    console.log('Success Auth Result:', result); // Log the result of successAuth
    req.session.dataAuthCode = result;
    req.session.dataAuthenticated = "true";
    req.session.userID = result.userID;
    console.log(req.session);
    console.log(req.userID);
    console.log(req.session.dataAuthenticated);
    return res.redirect('http://localhost:5173/play'); // redirect to playpage
  }

  @Get('isAuthenticated')
  async checkAuthentication(@Req() req: Request) {
    console.log(req.session.dataAuthenticated);
    console.log(req.session);
    console.log(req.userID);

    if (req.session && req.session.dataAuthenticated) {
      // If user is authenticated, check if TFA is enabled
      const userId = req.session.userId; // You need to adjust this based on how you store the user ID in the session
      const isTfaEnabledResponse = await this.isTfaEnabled(userId);

      if (isTfaEnabledResponse.isTfaEnabled) {
        console.log('TFA is enabled for the user.');
        return true;
      } else {
        console.log('TFA is not enabled for the user.');
        return false;
      }
    } else {
      // If user is not authenticated, return false
      return false;
    }
  }
}
