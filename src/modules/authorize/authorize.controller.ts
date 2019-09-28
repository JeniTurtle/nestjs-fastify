import { Controller, Inject, Query, Get } from '@nestjs/common'
import { ApiUseTags, ApiOperation } from '@nestjs/swagger'
import { RsaService } from '@processors/helper/crypto.serivce'
import { ISecretKeys } from '@processors/helper/crypto.serivce'
import { RsaOptionsDto } from './authorize.dto'

@ApiUseTags('授权认证')
@Controller('authorize')
export class AuthorizeController {
  constructor(@Inject(RsaService) private rsaService: RsaService) {}

  @Get('gen_secret_key')
  @ApiOperation({ title: '生成RSA公钥和私钥' })
  genPubKey(@Query() { pkcsSize = 128, pkcsType = 'pkcs1' }: RsaOptionsDto): ISecretKeys {
    return this.rsaService
      .setPkcsType(pkcsType)
      .setPkcsSize(pkcsSize)
      .genSecretKeys()
  }

  @Get('gen_temporary_token')
  @ApiOperation({ title: '生成临时token' })
  genTemporaryToken(@Query() { pkcsSize = 128, pkcsType = 'pkcs1' }: RsaOptionsDto): string {
    const { privateKey } = this.rsaService
      .setPkcsType(pkcsType)
      .setPkcsSize(pkcsSize)
      .genSecretKeys()
    // 获取当前的时间戳
    const timestamp = String(new Date().getTime())
    // 时间戳倒序
    const reverseTimestamp = timestamp
      .split('')
      .reverse()
      .join('')
    // 私钥加密
    return this.rsaService.priKeyEncrypt(privateKey, reverseTimestamp)
  }
}
