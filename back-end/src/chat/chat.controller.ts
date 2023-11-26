import { Controller, Get, Put, HttpCode, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDAO } from './chat.dao';


@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatDao: ChatDAO,
  ) { }

  @Get('test-connection')
  @HttpCode(200)
  async testConnection(): Promise<string> {
    return 'Connection successful!';
  }

  // @Get('history/:channelName')
  // async getChatHistory(@Param('channelName') channelName: string): Promise<string[]> {
  //   // return await this.chatService.getChatHistory(channelName);
  // }

  @Get('channels/:userId')
  async getUserChannels(@Param('userId') userId: number): Promise<string[]> {
    return await this.chatDao.getRawUserChannels(userId);
  }

  @Put('block/:userId')
  async blockUser(@Param('userId') userId: number): Promise<string[]> {
    
    return
  }
}
