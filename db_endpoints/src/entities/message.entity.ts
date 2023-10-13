import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'timestamp' })
    timestamp: Date;

    @Column({ type: 'timestamp', nullable: true })
    modified?: Date;

	//entity relationships ...
    @ManyToOne(() => User, user => user.messages)
    creator: User;

    @ManyToOne(() => Channel, channel => channel.messages)
    channel: Channel;
}
