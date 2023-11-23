import { Controller, Post, Get, Body, NotFoundException, Param } from '@nestjs/common';
import { TfaService } from './tfa.service';
import { UserService } from 'src/user/user.service';


@Controller('tfa')
export class TfaController {
  constructor(
    private readonly tfaService: TfaService,
    private readonly userService: UserService,
  ) {}

  @Get('isTfaEnabled/:userId')
  async isTfaEnabled(@Param('userId') userId: number) {
    // Retrieve the user from the database
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Check if TFA is already enabled for the user
    if (user.is2FActive)
    	return { isTfaEnabled: true };
	else
		return { isTfaEnabled: false };
  }

  @Post('enableTfa/:userId')
  async enableTfa(@Param('userId') userId: number) {
    // Retrieve the user from the database
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Check if TFA is already enabled for the user
    if (user.is2FActive) {
      return { message: 'TFA is already enabled for the user.' };
    }

    // Generate a TFA secret for the user
    const tfaSecret = this.tfaService.generateTfaSecret();

    // Update the user record in the database
    const updatedUser = await this.userService.update(userId, {
      is2FActive: true,
      secretOf2FA: tfaSecret,
    });

    return { message: 'TFA enabled for the user.', user: updatedUser };
  }

  @Post('disableTfa/:userId')
  async disableTfa(@Param('userId') userId: number) {
    // Retrieve the user from the database
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Check if TFA is already disabled for the user
    if (!user.is2FActive) {
      return { message: 'TFA is already disabled for the user.' };
    }

    // Update the user record in the database to disable TFA
    const updatedUser = await this.userService.update(userId, {
      is2FActive: false,
      secretOf2FA: null,
    });

    return { message: 'TFA disabled for the user.', user: updatedUser };
  }

  @Post('verifyTfa')
  async verifyTfa(@Body() body: { userId: number, otp: string }) {
    const { userId, otp } = body;

    console.log('Received userId:', userId);
    console.log('Received OTP:', otp);

    const user = await this.userService.findSecret(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.is2FActive) {
      return { message: 'TFA is not enabled for the user.' };
    }

    if (!user.secretOf2FA) {
      throw new Error('User does not have a TFA secret.');
    }

    // Verify the TFA OTP
    const isValid = this.tfaService.verifyTfaToken(otp, user.secretOf2FA);

    if (isValid) {
        // Update is2FAuthenticated in the user entity
        await this.userService.update(userId, { is2FAuthenticated: true });
		console.log(user.is2FAuthenticated)
        return { message: 'TFA OTP is valid.' };
    } else {
        // Optionally, reset is2FAuthenticated if OTP is invalid
        await this.userService.update(userId, { is2FAuthenticated: false });
        return { message: 'TFA OTP is invalid.' };
    }
  }
}




//curl -X POST -H "Content-Type: application/json" -d '{"secret": "your_secret_here"}' http://localhost:3000/tfa/generateOtp
