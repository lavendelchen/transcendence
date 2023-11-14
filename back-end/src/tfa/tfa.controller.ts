import { Controller, Post, Body } from '@nestjs/common';
import { TfaService } from './tfa.service';

@Controller('tfa')
export class TfaController {
  constructor(private readonly tfaService: TfaService) {}

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

