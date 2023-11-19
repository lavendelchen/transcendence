import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

	findAll(): Promise<User[]> {
		return this.userRepository.find({
			select: ['fortytwo_id', 'pseudo', 'email']
		});
	}

	findOne(id: number): Promise<User> {
		return this.userRepository.findOne({
			where: { id },
			select: ['fortytwo_id', 'pseudo', 'email', 'avatar', 'is2FActive', 'xp', 'homeMatches', 'foreignMatches']
		});
	}

	async findOneByName(userId: string): Promise<User> {
		const res: User = await this.userRepository.findOne({
		  where: { pseudo: userId },
		});
		if (res) {
		  console.log(res)
		  return res;
		} else {
		  throw new Error('User not found');
		}
	  }

    create(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async update(id: number, userData: Partial<User>): Promise<User> {
        await this.userRepository.update({ id }, userData);
        return this.userRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete({ id });
    }

	// extra ...
	async updateOrCreate(id: number, userData: Partial<User>): Promise<User> {
		const existingUser = await this.userRepository.findOne({ where: { id } });

		if (existingUser) {
			return this.update(id, userData);
		} else {
			return this.create(userData);
		}
	}

	async saveOrUpdate(userData: Partial<User>): Promise<User> {
		// Check if user already exists using email
		let user = await this.userRepository.findOne({ where: { email: userData.email } });
		if (user) {
			user.email = userData.email;
			user.pseudo = userData.pseudo;
			user.avatar = userData.avatar;
			await this.userRepository.save(user);
		} else {
			// If user does not exist, create a new one
			user = this.userRepository.create(userData);
			await this.userRepository.save(user);
		}
		return user;
	}

}
