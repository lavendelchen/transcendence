import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entities/match.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
		private readonly userService: UserService,
    ) {}

    findAll(): Promise<Match[]> {
        return this.matchRepository.find();
    }

    findOne(id: number): Promise<Match> {
        return this.matchRepository.findOne({ where: { id } });
    }

    async create(matchData: Partial<Match>): Promise<Match> {
        const match = this.matchRepository.create(matchData);
		const savedMatch = await this.matchRepository.save(match);
		const updatedMatch = await this.matchRepository.findOne({
			where: { id: savedMatch.id },
			relations: ['player1', 'player2', 'winner', 'loser'],
		});

		if (updatedMatch.winner.id == updatedMatch.player1.id) {
			updatedMatch.player1.matchesCount++;
			updatedMatch.player1.wonMatchesCount++;

			updatedMatch.player2.matchesCount++;
			updatedMatch.player2.lostMatchesCount++;
		}
		else {
			updatedMatch.player2.matchesCount++;
			updatedMatch.player2.wonMatchesCount++;

			updatedMatch.player1.matchesCount++;
			updatedMatch.player1.lostMatchesCount++;
		}

		updatedMatch.player1.pointsMade += updatedMatch.player1Score;
		updatedMatch.player1.pointsLost += updatedMatch.player2Score;
		updatedMatch.player2.pointsMade += updatedMatch.player2Score;
		updatedMatch.player2.pointsLost += updatedMatch.player1Score;

		this.userService.update(updatedMatch.player1.id, updatedMatch.player1);
		this.userService.update(updatedMatch.player2.id, updatedMatch.player2);

		// then push to database
		return savedMatch;
    }

    async update(id: number, matchData: Partial<Match>): Promise<Match> {
        await this.matchRepository.update({ id }, matchData);
        return this.matchRepository.findOne({ where: { id } });
    }

    delete(id: number): Promise<void> {
        return this.matchRepository.delete({ id }).then(() => {});
    }
}
