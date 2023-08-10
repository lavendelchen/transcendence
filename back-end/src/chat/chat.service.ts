import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './channel.entity'
import { CreateChannelInput } from './dto/create-channel.input';

@Injectable()
export class ChatService {
    constructor(@InjectRepository(Channel) 
    private channelRepository: Repository<Channel>,
    private readonly entityManager: EntityManager,
    ) {}

    createChannel(createChannelInput: CreateChannelInput): Promise<Channel> {
        const newChannel = this.channelRepository.create(createChannelInput); // newChannel = new Channel(); newChannel.name = name;
    
        return  this.channelRepository.save(newChannel); // INSERT INTO channel (name) VALUES (name);
    }

    findOne(id: number): Promise<Channel> {
        return this.channelRepository.findOneOrFail({ where: { id: id } }); // SELECT * FROM channel LIMIT 1;
    }

    async findAllChannels(): Promise<Channel[]> {
        return this.channelRepository.find(); // SELECT * FROM channel;
    }

    async deleteAllChannels(): Promise<void> {
        await this.channelRepository.clear();
        // Reset the id sequence
        await this.entityManager.query(`SELECT setval('channel_id_seq', 1, false)`);
    }
}
