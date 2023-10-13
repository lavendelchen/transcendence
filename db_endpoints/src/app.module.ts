import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { MatchModule } from './match/match.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'your_username'),
        password: configService.get<string>('DB_PASSWORD', 'your_password'),
        database: configService.get<string>('DB_NAME', 'your_database'),
        entities: [__dirname + '/**/*.entity{.ts}'],
        synchronize: configService.get<boolean>('DB_SYNC', true), // if DB_SYNC is true, the database is creatd again on each launch from TypeORM
      }),
    }),
    UserModule,
    FriendModule,
    MatchModule,
    ChannelModule,
    MessageModule,
  ],
})
export class AppModule {}
