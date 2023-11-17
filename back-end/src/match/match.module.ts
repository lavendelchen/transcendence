import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match } from '../entities/match.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), UserModule],
  providers: [MatchService],
  controllers: [MatchController]
})
export class MatchModule {}
