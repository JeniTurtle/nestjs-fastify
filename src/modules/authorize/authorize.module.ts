import { Module } from '@nestjs/common'
import { AuthorizeController } from '@modules/authorize/authorize.controller'

@Module({
  controllers: [AuthorizeController]
})
export class AuthorizeModule {}
