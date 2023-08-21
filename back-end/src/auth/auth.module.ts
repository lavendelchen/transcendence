// src/forty-two.module.ts

import { Module } from '@nestjs/common';
import { FortyTwoController } from './auth.controller';
import { FortyTwoAuthService } from './auth.service';

@Module({
  controllers: [FortyTwoController],
  providers: [FortyTwoAuthService],
})
export class AuthModule {}
