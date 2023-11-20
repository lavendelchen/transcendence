import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { IMessage } from './properties';


@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
  ) { }

  @Get('test-connection')
  @HttpCode(200)
  async testConnection(): Promise<string> {
    return 'Connection successful!';
  }

  @Get('history/:channelName')
  async getChatHistory(@Param('channelName') channelName: string): Promise<string[]> {
    console.log(channelName)
    return await this.chatService.getChatHistory(channelName);
  }
}
