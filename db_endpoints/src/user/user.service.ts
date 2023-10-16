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
        return this.userRepository.find();
    }

    findOne(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
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
