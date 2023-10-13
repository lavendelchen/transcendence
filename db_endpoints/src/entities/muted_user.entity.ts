import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';

@Entity()
@Unique(["channel", "user"])
export class MutedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Channel)
    channel: Channel;

    @ManyToOne(() => User)
    user: User;

    @Column({ type: 'date', nullable: true })
    until?: Date;
}
