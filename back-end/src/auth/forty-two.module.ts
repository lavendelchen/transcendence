// src/forty-two.module.ts

import { Module } from '@nestjs/common';
import { FortyTwoController } from './forty-two.controller';
import { FortyTwoAuthService } from './forty-two-auth.service';

@Module({
  controllers: [FortyTwoController],
  providers: [FortyTwoAuthService],
})
export class FortyTwoModule {}
