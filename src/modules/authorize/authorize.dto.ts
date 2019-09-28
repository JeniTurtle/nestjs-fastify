import { Max, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiModelProperty } from '@nestjs/swagger'

export class RsaOptionsDto {
  @ApiModelProperty({
    enum: ['pkcs1', 'pkcs8'],
    description: '加密类型'
  })
  readonly pkcsType?: string

  @ApiModelProperty({
    default: 128,
    description: '密钥长度'
  })
  @IsInt({ message: '必须是整数' })
  @Max(512, { message: '大小不能超过512' })
  @Min(64, { message: '大小不能少于64' })
  @Type(() => Number)
  readonly pkcsSize?: number
}
