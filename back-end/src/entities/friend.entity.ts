import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user: User) => user.id)
    user: User;

    @ManyToOne(() => User, (user: User) => user.id)
    followedUser: User;

    @Column({ type: 'boolean' })
    isPending: boolean;
}
