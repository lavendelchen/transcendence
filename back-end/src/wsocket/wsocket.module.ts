import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { WSocketGateway } from './wsocket.gateway';
import { ChatDAO } from '../chat/chat.dao';


@Module({
  imports: [ChatModule],
  providers: [WSocketGateway]
})
export class WSocketModule { }

