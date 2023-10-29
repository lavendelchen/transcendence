import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(["blockingUser", "blockedUser"])
export class BlockedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    blockingUser: User;

    @ManyToOne(() => User)
    blockedUser: User;
}
