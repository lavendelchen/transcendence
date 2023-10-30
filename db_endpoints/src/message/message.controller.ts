import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from '../entities/message.entity';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get()
    findAll(): Promise<Message[]> {
        return this.messageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Message> {
        return this.messageService.findOne(id);
    }

    @Post()
    create(@Body() messageData: Partial<Message>): Promise<Message> {
        return this.messageService.create(messageData);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() messageData: Partial<Message>): Promise<Message> {
        const updatedMessage = await this.messageService.update(id, messageData);
        if (!updatedMessage) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }
        return updatedMessage;
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.messageService.delete(id);
    }
}
