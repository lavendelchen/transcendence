import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Request } from 'express';

//declare session type becuase of typescript
declare module 'express-session' {
  export interface SessionData {
    dataAuthCode: any;
    dataAuthenticated: any;
    transformedUserData: any;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('init')
  async initAuth() {
    return this.authService.initAuth();
  }

  @Get()
  async successAuth(@Query('code') code: string, @Res() res: Response, @Req() req: Request) {
    console.log('Received code:', code); // Log the received code
    const result = await this.authService.successAuth(code);
    console.log('Success Auth Result:', result.token); // Log the result of successAuth
    req.session.dataAuthCode = result.token;
    req.session.dataAuthenticated = "true";
    req.session.transformedUserData = result.userData;
    console.log(req.session);
    console.log(req.sessionID);
    console.log(req.session.dataAuthenticated);
    console.log(req.session.transformedUserData);
    return res.redirect('http://localhost:5173/play'); // redirect to playpage
  }

  @Get('isAuthenticated')
  checkAuthentication(@Req() req: Request) {
    console.log(req.session.dataAuthenticated);
    console.log(req.session);
    console.log(req.sessionID);
    if (req.session && req.session.dataAuthenticated)
      return (true);
    else
      return (false);
  }

  @Get('userData')
  async getUserData(@Req() req: Request) {
    const userData = req.session.transformedUserData
    console.log('user data: ', req.session.transformedUserData)
    return userData;
  }

}
