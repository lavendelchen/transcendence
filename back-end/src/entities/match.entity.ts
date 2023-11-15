import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, nullable: true })
    map: string;

    @Column({ type: 'int', nullable: true })
    userHomeScore: number;

    @Column({ type: 'int', nullable: true })
    userForeignScore: number;

    @Column({ type: 'timestamp', nullable: true })
    timestamp: Date;

	//entity relationships ...
	@ManyToOne(() => User, user => user.homeMatches)
    userHome: User;

    @ManyToOne(() => User, user => user.foreignMatches)
    userForeign: User;

    @ManyToOne(() => User, user => user.wonMatches)
    winner: User;
}
