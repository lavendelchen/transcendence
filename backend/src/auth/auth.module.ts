import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [HttpModule, UserModule],
	controllers: [AuthController],
	providers: [AuthService, JwtService]
})
export class AuthModule {}
