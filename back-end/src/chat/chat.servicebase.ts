import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { EChannelType, IChannel } from './properties';
import { ChatDAO } from './chat.dao';
import { WSocketGateway } from 'src/wsocket/wsocket.gateway';

@Injectable()
export class ChatServiceBase {
  constructor(
    @Inject(UserService)
    protected userService: UserService,
    @Inject(ChatDAO)
    protected chatDao: ChatDAO,
    @Inject(forwardRef(() => WSocketGateway))
    protected wSocketGateway: WSocketGateway,
  ) { }

  public async addChat(chat: IChannel): Promise<string[]> {
    const res: string[] = [];
    try {
      const user = await this.userService.findOneByName(chat.user.name);
      await this.chatDao.saveChannel(chat, chat.user.name);
      return await this.chatDao.getRawUserChannels(user.id);
    } catch (error) {
      console.log(`SYSTEM: ${error.message}`);
      return res;

    }
  }
}
