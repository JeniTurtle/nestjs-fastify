import { HttpException, HttpStatus } from '@nestjs/common'
import { BAD_REQUEST_ERROR } from '@constants/error/general.constant'
import { TExceptionOption } from '@interfaces/response.interface'

/**
 * @class HttpBadRequestError
 * @classdesc 400 -> 请求不合法
 */
export class HttpBadRequestError extends HttpException {
  constructor(error?: TExceptionOption) {
    super(error || BAD_REQUEST_ERROR, HttpStatus.BAD_REQUEST)
  }
}
