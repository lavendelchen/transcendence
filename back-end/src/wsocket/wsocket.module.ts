import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { WSocketGateway } from './wsocket.gateway';
import { ChatServiceBase } from 'src/chat/chat.servicebase';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => ChatModule)],
})
export class WSocketModule { }

