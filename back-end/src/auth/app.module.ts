// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FortyTwoModule } from './forty-two.module'; // Import the FortyTwoModule

@Module({
  imports: [FortyTwoModule], // Include the FortyTwoModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
