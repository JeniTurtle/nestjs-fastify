import { Get, Controller } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'
import { HttpCache } from '@decorators/cache.decorator'
import { HOME_PAGE_CACHE } from '@constants/cache.constant'

@Controller()
export class AppController {
  @Get()
  @ApiExcludeEndpoint()
  @HttpCache(HOME_PAGE_CACHE, 60 * 60)
  root(): string {
    return 'hello world!'
  }
}
