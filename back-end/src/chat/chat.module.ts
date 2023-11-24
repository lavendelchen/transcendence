import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Channels, Messages } from '../entities/chat.entity';
import { UserService } from '../user/user.service';
import { ChatDAO } from './chat.dao';
import { WSocketGateway } from '../wsocket/wsocket.gateway';
import { WSocketModule } from '../wsocket/wsocket.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([User, Messages, Channels]),
  forwardRef(() => WSocketModule)
  ],
  providers: [ChatService, UserService, ChatDAO, WSocketGateway],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule { }
