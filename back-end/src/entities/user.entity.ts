import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
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

    @Column({ length: 50 })
    email: string;

    @Column({ length: 255, nullable: true })
    refresh_token: string;

    @Column({ length: 255, nullable: true })
    avatar?: string;

    @Column({ type: 'boolean', default: false })
    is2FActive: boolean;

    @Column({ length: 60, nullable: true })
    secretOf2FA?: string;

	//entity relationships ...
	@OneToMany(() => Message, message => message.creator)
	messages: Message[];

    @OneToMany(() => Match, match => match.player1)
    player1Matches: Match[];

    @OneToMany(() => Match, match => match.player2)
    player2Matches: Match[];

    @OneToMany(() => Match, match => match.winner)
	//@JoinColumn([{ name: "winnerId", referencedColumnName: "id" }])
    wonMatches: Match[];

    @OneToMany(() => Channel, channel => channel.owner)
    ownedChannels: Channel[];

    @OneToMany(() => ChannelAdmin, channelAdmin => channelAdmin.user)
    adminChannels: ChannelAdmin[];
}
