import { Controller, Get, HttpCode } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('test-connection')
  @HttpCode(200)
  async testConnection(): Promise<string> {
    return 'Connection successful!';
  }
}
