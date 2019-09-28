import { HttpException, HttpStatus } from '@nestjs/common'
import { TExceptionOption } from '@interfaces/response.interface'

/**
 * @class PlatformError
 * @classdesc 默认 500 -> 服务端出错
 */
export class PlatformError extends HttpException {
  constructor(options: TExceptionOption, statusCode?: HttpStatus) {
    super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
