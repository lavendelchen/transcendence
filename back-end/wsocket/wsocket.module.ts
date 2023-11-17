import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { WSocketGateway } from './wsocket.gateway';

@Module({
  imports: [ChatModule],
  providers: [WSocketGateway]
})
export class WSocketModule {}

