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

	@Get('/leaderboard')
    findAllLeaderboard(): Promise<User[]> {
        return this.userService.findAllLeaderboard();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @Get(':id/secret')
    findSecret(@Param('id') id: number): Promise<User> {
        return this.userService.findSecret(id);
    }

	@Get(':id/matchHistory')
  	async getMatches(@Param('id') id: number) {
  	  const user = await this.userService.findOne(id);
	  console.log(user);
  		return this.userService.getMatches(user.id);
  	}

    @Post()
    create(@Body() userData: Partial<User>): Promise<User> {
        return this.userService.create(userData);
    }

    @Post(':id')
    updateOrCreate(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User> {
        console.log(userData);
		return this.userService.updateOrCreate(id, userData);
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
