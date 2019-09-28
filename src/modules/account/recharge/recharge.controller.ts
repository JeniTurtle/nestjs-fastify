import { Controller, Body, Post, Inject } from '@nestjs/common'
import { ApiUseTags, ApiOperation } from '@nestjs/swagger'
import { RechargeParamsDto } from './recharge.dto'
import { RechargeService } from './recharge.service'

@ApiUseTags('账户充值服务')
@Controller('account/recharge')
export class RechargeController {
  constructor(
    @Inject(RechargeService)
    private readonly rechargeService: RechargeService
  ) {}

  @Post()
  @ApiOperation({ title: '人员账户充值' })
  async recharge(@Body() body: RechargeParamsDto) {
    return await this.rechargeService.recharge(body)
  }
}
