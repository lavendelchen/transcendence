import { Controller, Get, HttpCode, Body, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { IMessage } from './properties';


@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
  ) {}

  @Get('test-connection')
  @HttpCode(200)
  async testConnection(): Promise<string> {
    return 'Connection successful!';
  }

}
