import { Channels, Messages } from '../entities/chat.entity';
import { User } from '../entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EChannelType, IChannel, IMessage } from './properties';
import { UserService } from '../user/user.service';


@Injectable()
export class ChatDAO {
  constructor(
    @InjectRepository(Channels)
    private channelRepo: Repository<Channels>,
    @InjectRepository(Messages)
    private messsageRepo: Repository<Messages>,
    private connection: Connection,
    @Inject(UserService)
    private userService: UserService,
  ) { }


  public async getChannelByTitle(title: string): Promise<Channels> {
    return await this.channelRepo
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'users')
      .where('channel.title = :title', { title })
      .getOne();
  }

  public async addUserToChannel(title: string, user: string): Promise<void> {
    const channel: Channels = await this.getChannelByTitle(title);
    const newUser: User = await this.userService.findOneByName(user);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.manager.query(
        `INSERT INTO channel_subscription (channel, "user")
          VALUES (${channel.id}, ${newUser.id})
          ON CONFLICT (channel, "user") DO NOTHING;`,
      );
    } catch (error) {
      console.error('Error adding user to channel:', error.message.split('\n')[0]);
    } finally {
      await queryRunner.release();
    }
  }

  public async saveChannel(channel: IChannel, user: string): Promise<void> {
    const existingChannel = await this.channelRepo.findOne({
      where: { title: channel.title },
    });
    if (existingChannel && existingChannel.type !== EChannelType.PRIVATE) {
      await this.addUserToChannel(channel.title, user);
    } else if (!existingChannel) {
      await this.channelRepo.save(
        this.channelRepo.create({
          title: channel.title,
          owner: await this.userService.findOneByName(user),
          users: [await this.userService.findOneByName(user)],
          type: channel.type,
        }),
      );
    }
  }

  public async saveMessageToChannel(message: IMessage): Promise<void> {
    await this.messsageRepo.save(
      this.messsageRepo.create({
        sender: await this.userService.findOneByName(message.user.name),
        channel: await this.getChannelByTitle(message.room),
        content: message.input,
      }),
    );
  }

  public async getChannelMessages(channelId: number): Promise<Messages[]> {
    return await this.messsageRepo
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.sender', 'sender')
      .where('message.channel = :id', { id: channelId })
      .orderBy('message.id', 'ASC')
      .getMany();
  }

  public async getRawChannelMessages(channelId: number): Promise<string[]> {
    return (await this.getChannelMessages(channelId)).map((item) => {
      return `${item.sender.pseudo}: ${item.content}`;
    });
  }

  public async getUserChannels(userId: number): Promise<Channels[]> {
    return await this.channelRepo
      .createQueryBuilder('channel')
      .innerJoin('channel.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  public async getRawUserChannels(userId: number): Promise<string[]> {
    return (await this.getUserChannels(userId)).map((item) => {
      return item.title;
    });
  }

  public async isChannelOwner(title: string, name: string): Promise<Boolean> {
    const channel = await this.channelRepo.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.owner', 'owner')
      .where('channel.title = :title', { title })
      .getOne();

    if (!channel) {
      throw new Error('Channel not found');
    }

    return channel.owner.pseudo === name;
  }

  public async isChannelAdmin(title: string, name: string): Promise<Boolean> {
    const channel = await this.channelRepo.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.administrators', 'administrators')
      .where('channel.title = :title', { title })
      .getOne();

    if (!channel) {
      throw new Error('Channel not found');
    }

    return channel.administrators.some((admin) => admin.pseudo === name);
  }

  public async removeUserFromChannel(title: string, userId: string): Promise<void> {
    const channel: Channels = await this.getChannelByTitle(title);
    const user: User = await this.userService.findOneByName(userId);
    channel.users = channel.users.filter((u) => u.id !== user.id);
    this.channelRepo.save(channel);
  }

  public async promoteUsertoChannelAdmin(title: string, userId: string): Promise<void> {
    const channel: Channels = await this.getChannelByTitle(title);
    const user: User = await this.userService.findOneByName(userId);
    channel.administrators.push(user);
    this.channelRepo.save(channel);
  }

  public async getUsersInChannel(title: string): Promise<User[]> {
    const channel = await this.channelRepo.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'users')
      .where('channel.title = :title', { title })
      .getOne();

    if (!channel) {
      throw new Error('Channel not found');
    }
    return channel.users;
  }
}
