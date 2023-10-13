import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @Post()
    create(@Body() userData: Partial<User>): Promise<User> {
        return this.userService.create(userData);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User> {
        const updatedUser = await this.userService.update(id, userData);
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.userService.delete(id);
    }
}
