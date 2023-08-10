import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
        // type: 'postgres',
        // database: ':memory:',
        // entities: ['dist/**/*.entity{.ts,.js}'],
        // synchronize: true, // here we should add "migrations" later
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'tuto',
        password: 'admingres',
        database: 'tutos',
        autoLoadEntities: true,
        synchronize: true,
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppResolver, AppService],
})
export class AppModule {}
