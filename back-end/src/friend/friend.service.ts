import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from '../entities/friend.entity';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(Friend)
		private friendRepository: Repository<Friend>,
	) {}

	findAll(): Promise<Friend[]> {
		return this.friendRepository.find();
	}

	findOne(id: number): Promise<Friend> {
		return this.friendRepository.findOne({
			where: { id }
		});
	}

	create(friendData: Partial<Friend>): Promise<Friend> {
		const friend = this.friendRepository.create(friendData);
		return this.friendRepository.save(friend);
	}

	async update(id: number, friendData: Partial<Friend>): Promise<Friend> {
		await this.friendRepository.update({ id }, friendData);
		return this.friendRepository.findOne({ where: { id }});
	}

	delete(id: number): Promise<void> {
		return this.friendRepository.delete(id).then(() => {});
	}
}
