import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GameserverModule } from './gameserver/gameserver.module';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { MatchModule } from './match/match.module';
import { AppController } from './app.controller';
import { TfaModule } from './tfa/tfa.module';
import { WSocketModule } from '../wsocket/wsocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('POSTGRES_SYNC', true), // if DB_SYNC is true, the database is created again on each launch from TypeORM
      }),
    }),
    AuthModule,
	GameserverModule,
    TfaModule,
    UserModule,
    FriendModule,
    MatchModule,
    WSocketModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
