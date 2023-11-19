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

    @Column({ type: 'float', default: 0 })
    xp: number;

    @Column({ type: 'int', default: 0 })
    ratio: number;

	//entity relationships ...

    @OneToMany(() => Match, match => match.userHome)
    homeMatches: Match[];

    @OneToMany(() => Match, match => match.userForeign)
    foreignMatches: Match[];

    @OneToMany(() => Match, match => match.winner)
    wonMatches: Match[];

    @OneToMany(() => Channels, channel => channel.owner)
    owned: Channels[];

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
