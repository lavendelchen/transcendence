import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    findAll(): Promise<Message[]> {
        return this.messageRepository.find();
    }

    findOne(id: number): Promise<Message> {
        return this.messageRepository.findOne({ where: { id } });
    }

    create(messageData: Partial<Message>): Promise<Message> {
        const message = this.messageRepository.create(messageData);
        return this.messageRepository.save(message);
    }

    async update(id: number, messageData: Partial<Message>): Promise<Message> {
        await this.messageRepository.update({ id }, messageData);
        return this.messageRepository.findOne({ where: { id } });
    }

    delete(id: number): Promise<void> {
        return this.messageRepository.delete({ id }).then(() => {});
    }
}
