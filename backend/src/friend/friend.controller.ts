import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { FriendService } from './friend.service';
import { Friend } from '../entities/friend.entity';

@Controller('friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @Get()
    findAll(): Promise<Friend[]> {
        return this.friendService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Friend> {
        return this.friendService.findOne(id);
    }

    @Post()
    create(@Body() friendData: Partial<Friend>): Promise<Friend> {
        return this.friendService.create(friendData);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() friendData: Partial<Friend>): Promise<Friend> {
        const updatedFriend = await this.friendService.update(id, friendData);
        if (!updatedFriend) {
            throw new NotFoundException(`Friend with ID ${id} not found`);
        }
        return updatedFriend;
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.friendService.delete(id);
    }
}
