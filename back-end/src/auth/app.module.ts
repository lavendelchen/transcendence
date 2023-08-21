// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth.module'; // Import the FortyTwoModule

@Module({
  imports: [AuthModule], // Include the FortyTwoModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
