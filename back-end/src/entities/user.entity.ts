import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Match } from './match.entity';
import { Channels } from '../chat/chat.entity';



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

	@Column({ type: 'int', default: 0 })
    matchesCount: number;
	
	@Column({ type: 'int', default: 0 })
    wonMatchesCount: number;
	
	@Column({ type: 'int', default: 0 })
    lostMatchesCount: number;
	
	@Column({ type: 'int', default: 0 })
    pointsMade: number;
	
	@Column({ type: 'int', default: 0 })
    pointsLost: number;
	
	//entity relationships ...

    @OneToMany(() => Channels, channel => channel.owner)
    owned: Channels[];
    
    @OneToMany(() => Match, match => match.player1)
    player1Matches: Match[];
	
    @OneToMany(() => Match, match => match.player2)
    player2Matches: Match[];
	
    @OneToMany(() => Match, match => match.winner)
    wonMatches: Match[];

	@OneToMany(() => Match, match => match.loser)
    lostMatches: Match[];


    @ManyToMany(type => Channels)
    @JoinTable({
      name: "channel_subscription",
      joinColumn: {
          name: "user",
          referencedColumnName: "id"
      },
      inverseJoinColumn: {
          name: "channel",
          referencedColumnName: "id"
      }
    })
    channels: Channels[];


    // @OneToMany(() => ChannelAdmin, channelAdmin => channelAdmin.user)
    // adminChannels: ChannelAdmin[];
}
