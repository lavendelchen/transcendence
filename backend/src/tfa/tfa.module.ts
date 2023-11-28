import { Module } from '@nestjs/common';
import { TfaController } from './tfa.controller';
import { TfaService } from './tfa.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TfaController],
  providers: [TfaService],
  exports: [TfaService],
})
export class TfaModule {}