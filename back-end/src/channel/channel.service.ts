import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
    ) {}

    findAll(): Promise<Channel[]> {
        return this.channelRepository.find();
    }

    findOne(id: number): Promise<Channel> {
        return this.channelRepository.findOne({ where: { id } });
    }

    create(channelData: Partial<Channel>): Promise<Channel> {
        const channel = this.channelRepository.create(channelData);
        return this.channelRepository.save(channel);
    }

    async update(id: number, channelData: Partial<Channel>): Promise<Channel> {
        await this.channelRepository.update({ id }, channelData);
        return this.channelRepository.findOne({ where: { id } });
    }

    delete(id: number): Promise<void> {
        return this.channelRepository.delete({ id }).then(() => {});
    }
}
