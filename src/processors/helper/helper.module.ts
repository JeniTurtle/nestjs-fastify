import { Module, Global } from '@nestjs/common'
import { RsaService } from './crypto.serivce'

@Global()
@Module({
  providers: [RsaService],
  exports: [RsaService]
})
export class HelperModule {}
