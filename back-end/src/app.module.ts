import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware, CheckUserOwnershipMiddleware } from './auth/auth.middleware';
import { GameserverModule } from './gameserver/gameserver.module';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './friend/friend.module';
import { MatchModule } from './match/match.module';
import { AppController } from './app.controller';
import { TfaModule } from './tfa/tfa.module';
import { WSocketModule } from './wsocket/wsocket.module';

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
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('POSTGRES_SYNC', true), // if DB_SYNC is true, the database is created again on each launch from TypeORM
      }),
    }),
    ChatModule,
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
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(
			'friend/:id',
			'friend',
			'tfa/disableTfa/:userId',
			{ path: 'match/:id', method: RequestMethod.POST },
			{ path: 'match/:id', method: RequestMethod.DELETE },
		);
		consumer.apply(CheckUserOwnershipMiddleware).forRoutes(
			'user/:id/secret',
			{ path: 'user/:id', method: RequestMethod.POST },
			{ path: 'user/:id', method: RequestMethod.PUT },
			{ path: 'user/:id', method: RequestMethod.DELETE },
			'tfa/isTfaEnabled/:userId',
			'tfa/enableTfa/:userId',
			'tfa/disableTfa/:userId',
			'tfa/verifyTfa'
		);
	}
}
