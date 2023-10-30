import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    map: string;

    @Column({ type: 'int' })
    userHomeScore: number;

    @Column({ type: 'int' })
    userForeignScore: number;

    @Column({ type: 'timestamp' })
    timestamp: Date;

	//entity relationships ...
	@ManyToOne(() => User, user => user.homeMatches)
    userHome: User;

    @ManyToOne(() => User, user => user.foreignMatches)
    userForeign: User;

    @ManyToOne(() => User, user => user.wonMatches)
    winner: User;
}
