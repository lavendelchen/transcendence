import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Request } from 'express';

//declare session type becuase of typescript
declare module 'express-session' {
  export interface SessionData {
    dataAuthCode: any;
    dataAuthenticated: any;
    userID: any;
  }
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

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
    console.log(req.session.userID);
    console.log(req.session.dataAuthenticated);
    return res.redirect('http://localhost:5173/play'); // redirect to playpage
  }

  @Get('isAuthenticated')
  checkAuthentication(@Req() req: Request) {
    // console.log(req.session.dataAuthenticated);
    // console.log(req.session);
    // console.log(req.sessionID);
    if (req.session && req.session.dataAuthenticated)
      return (true);
    else
      return (false);
  }

  @Get('whoIam')
  async checkWhoIam(@Req() req: Request) {
    if (req.session && req.session.dataAuthenticated)
      return await this.userService.findOne(req.session.userID);
    else
      // User is not authenticated
      return {};
  }

}
