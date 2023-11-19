import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { EChannelType, IChannel } from './properties';
import { ChatDAO } from './chat.dao';


@Injectable()
export class ChatServiceBase {
  constructor(
    @Inject(UserService)
    protected userService: UserService,
    @Inject(ChatDAO)
    protected chatDao: ChatDAO,
  ) {}

  public async addChat(chat: IChannel): Promise<string[]> {
    const res: string[] = [];
    try {
      console.log("DEBUG - Chat received:", chat);
      console.log("DEBUG - Chat user:", chat.user);
      console.log("DEBUG - Chat user name:", chat.user.name);
  
      if (!chat.user || !chat.user.name) {
        console.error("ERROR - User or username is undefined.");
        return res; // or handle the error as needed
      }
  
      const user = await this.userService.findOneByName(chat.user.name);
  
      console.log("DEBUG - User found:", user);
  
      await this.chatDao.saveChannel(chat, chat.user.name);
      return await this.chatDao.getRawUserChannels(user.id);
    } catch (error) {
      console.log(`SYSTEM: ${error.message}`);
      return res;
    }
  }
  

}
