import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { Friend } from '../entities/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule {}
