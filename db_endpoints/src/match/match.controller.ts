import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from '../entities/match.entity';

@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Get()
    findAll(): Promise<Match[]> {
        return this.matchService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Match> {
        return this.matchService.findOne(id);
    }

    @Post()
    create(@Body() matchData: Partial<Match>): Promise<Match> {
        return this.matchService.create(matchData);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() matchData: Partial<Match>): Promise<Match> {
        const updatedMatch = await this.matchService.update(id, matchData);
        if (!updatedMatch) {
            throw new NotFoundException(`Match with ID ${id} not found`);
        }
        return updatedMatch;
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.matchService.delete(id);
    }
}
