import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Channels, Messages } from '../entities/chat.entity';
import { UserService } from '../user/user.service';
import { ChatDAO } from './chat.dao';

@Module({
  imports: [TypeOrmModule.forFeature([User, Messages, Channels])],
  providers: [ChatService, UserService, ChatDAO],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule { }
