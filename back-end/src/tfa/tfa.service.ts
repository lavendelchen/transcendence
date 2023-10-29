import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class TfaService {
  // Generate a TFA secret
  generateTfaSecret(): string {
    return authenticator.generateSecret();
  }

  // Generate a TFA OTP based on a secret
  generateTfaToken(secret: string): string {
    return authenticator.generate(secret);
  }

  // Verify a TFA OTP against a secret
  verifyTfaToken(otp: string, secret: string): boolean {
    return authenticator.verify({ token: otp, secret });
  }
}
