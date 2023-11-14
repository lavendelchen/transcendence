import { Module } from '@nestjs/common';
import { TfaController } from './tfa.controller';
import { TfaService } from './tfa.service';

@Module({
  imports: [],
  controllers: [TfaController],
  providers: [TfaService],
  exports: [TfaService],
})
export class TfaModule {}