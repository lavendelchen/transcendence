import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true })
    player1Score: number;

    @Column({ type: 'int', nullable: true })
    player2Score: number;

	//entity relationships ...
	@ManyToOne(() => User, user => user.player1Matches)
    player1: User;

    @ManyToOne(() => User, user => user.player2Matches)
    player2: User;

    @ManyToOne(() => User, user => user.wonMatches)
    winner: User;

	@ManyToOne(() => User, user => user.lostMatches)
    loser: User;
}
