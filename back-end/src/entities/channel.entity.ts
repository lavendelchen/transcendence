import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
import { ChannelAdmin } from './channel_admin.entity';

export enum ChannelType {
    PUBLIC = 'PUBLIC',
    PROTECTED = 'PROTECTED',
    PRIVATE = 'PRIVATE',
    DIRECT = 'DIRECT'
}

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user: User) => user.id)
    owner: User;

    @Column({ length: 255 })
    name: string;

    @Column({
        type: 'enum',
        enum: ChannelType
    })
    type: ChannelType;

    @Column({ length: 255, nullable: true })
    password?: string;

    @Column({ type: 'timestamp' })
    creationDate: Date;

	//entity relationships ...
	@OneToMany(() => Message, message => message.channel)
    messages: Message[];

    @OneToMany(() => ChannelAdmin, channelAdmin => channelAdmin.channel)
    adminUsers: ChannelAdmin[];
}
