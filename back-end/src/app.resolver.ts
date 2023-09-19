import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(returns => String)
  getHello() {
    return 'Hello World!';
  }
}