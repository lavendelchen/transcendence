import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entities/match.entity';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
    ) {}

    findAll(): Promise<Match[]> {
        return this.matchRepository.find();
    }

    findOne(id: number): Promise<Match> {
        return this.matchRepository.findOne({ where: { id } });
    }

    create(matchData: Partial<Match>): Promise<Match> {
        const match = this.matchRepository.create(matchData);
        return this.matchRepository.save(match);
    }

    async update(id: number, matchData: Partial<Match>): Promise<Match> {
        await this.matchRepository.update({ id }, matchData);
        return this.matchRepository.findOne({ where: { id } });
    }

    delete(id: number): Promise<void> {
        return this.matchRepository.delete({ id }).then(() => {});
    }
}
