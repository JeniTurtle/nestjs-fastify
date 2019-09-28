import { Max, Min, IsInt, IsNumber, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger'

export const enum RechargeType {
  MONEY = 'money',
  SUBSIDY = 'subsidy'
}

export class RechargeParamsDto {
  @ApiModelProperty({
    required: true,
    enum: [RechargeType.MONEY, RechargeType.SUBSIDY],
    description: '充值类型：金额，补贴'
  })
  readonly type: RechargeType

  @ApiModelProperty({
    required: true,
    description: '充值金额，单位（元）'
  })
  @IsNumber({ allowNaN: false }, { message: '错误的充值金额' })
  @Max(100000, { message: '充值金额最多不能超过10万' })
  @Min(1, { message: '充值金额不能小于1元' })
  @Type(() => Number)
  readonly amount: number

  @ApiModelProperty({
    required: true,
    description: '需要充值的用户id'
  })
  @IsInt({ message: '错误的用户id' })
  @Type(() => Number)
  readonly userId: number

  @ApiModelProperty({
    required: true,
    description: '交易流水号'
  })
  @MaxLength(50, {
    message: '交易流水号最多不能超过50个字符'
  })
  readonly tranno?: string
}
