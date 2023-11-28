import { Module } from "@nestjs/common";
import { GameserverGateway } from './gameserver.gateway';

@Module({
    providers: [GameserverGateway],
})
export class GameserverModule {}