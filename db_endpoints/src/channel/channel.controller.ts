import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from '../entities/channel.entity';

@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Get()
    findAll(): Promise<Channel[]> {
        return this.channelService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Channel> {
        return this.channelService.findOne(id);
    }

    @Post()
    create(@Body() channelData: Partial<Channel>): Promise<Channel> {
        return this.channelService.create(channelData);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() channelData: Partial<Channel>): Promise<Channel> {
        const updatedChannel = await this.channelService.update(id, channelData);
        if (!updatedChannel) {
            throw new NotFoundException(`Channel with ID ${id} not found`);
        }
        return updatedChannel;
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.channelService.delete(id);
    }
}
