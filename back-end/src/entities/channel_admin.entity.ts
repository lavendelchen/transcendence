import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';

@Entity()
@Unique(["channel", "user"])
export class ChannelAdmin {
    @PrimaryGeneratedColumn()
    id: number;

	@ManyToOne(() => Channel, channel => channel.adminUsers)
    channel: Channel;

    @ManyToOne(() => User, user => user.adminChannels)
    user: User;
}
