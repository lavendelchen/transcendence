import { Controller, Post, Body, NotFoundException, Param } from '@nestjs/common';
import { TfaService } from './tfa.service';
import { UserService } from 'src/user/user.service';


@Controller('tfa')
export class TfaController {
  constructor(
    private readonly tfaService: TfaService,
    private readonly userService: UserService,
  ) {}

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

  @Post('generateOtp')
  async generateOtp(@Body() body) {
    const { secret } = body;

    // Generate a TFA OTP based on the provided secret
    const otp = this.tfaService.generateTfaToken(secret);

    return { otp }; // Return the OTP in a JSON response
  }

  @Post('verifyTfa')
  async verifyTfa(@Body() body) {
    const { otp, secret } = body;

    // Verify the TFA OTP
    const isValid = this.tfaService.verifyTfaToken(otp, secret);

    if (isValid) {
      return { message: 'TFA OTP is valid.' };
    } else {
      return { message: 'TFA OTP is invalid.' };
    }
  }
}




//curl -X POST -H "Content-Type: application/json" -d '{"secret": "your_secret_here"}' http://localhost:3000/tfa/generateOtp

