import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Channel } from './channel.entity';
import { CreateChannelInput } from './dto/create-channel.input';

@Resolver(of => Channel)
export class ChatResolver {
    constructor(private chatService: ChatService) {}

    @Query(returns => Channel)
    getChannel(@Args('id', {type: () => Int}) id: number): Promise<Channel> {
        return this.chatService.findOne(id);
    }

    @Query(returns => [Channel])
    channels(): Promise<Channel[]> {
        return this.chatService.findAllChannels();
    }

    @Mutation(returns => Channel)
    createChannel(@Args('createChannelInput')createChannelInput: CreateChannelInput): Promise<Channel> {
        return this.chatService.createChannel(createChannelInput);
    }

    @Mutation(returns => Int)
    async deleteAllChannels(): Promise<number> {
        const deletedCount = await this.chatService.deleteAllChannels();
        return 0;
    }
}
