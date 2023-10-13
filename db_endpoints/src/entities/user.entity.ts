import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Match } from './match.entity';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { ChannelAdmin } from './channel_admin.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    fortytwo_id: number;

    @Column({ length: 50 })
    pseudo: string;

    @Column({ length: 255 })
    refresh_token: string;

    @Column({ length: 50 })
    email: string;

    @Column({ length: 60 })
    password: string;

    @Column({ length: 50, nullable: true })
    avatar?: string;

    @Column({ type: 'boolean' })
    is2FActive: boolean;

    @Column({ length: 60, nullable: true })
    secretOf2FA?: string;

    @Column({ type: 'float', default: 0 })
    xp: number;

    @Column({ type: 'int', default: 0 })
    ratio: number;

	//entity relationships ...
	@OneToMany(() => Message, message => message.creator)
    messages: Message[];

    @OneToMany(() => Match, match => match.userHome)
    homeMatches: Match[];

    @OneToMany(() => Match, match => match.userForeign)
    foreignMatches: Match[];

    @OneToMany(() => Match, match => match.winner)
    wonMatches: Match[];

    @OneToMany(() => Channel, channel => channel.owner)
    ownedChannels: Channel[];

    @OneToMany(() => ChannelAdmin, channelAdmin => channelAdmin.user)
    adminChannels: ChannelAdmin[];
}
