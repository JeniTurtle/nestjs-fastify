import { HttpException, HttpStatus } from '@nestjs/common'
import { FORBIDDEN_ERROR } from '@constants/error/general.constant'
import { TExceptionOption } from '@interfaces/response.interface'

/**
 * @class HttpForbiddenError
 * @classdesc 403 -> 无权限/权限不足
 */
export class HttpForbiddenError extends HttpException {
  constructor(error?: TExceptionOption) {
    super(error || FORBIDDEN_ERROR, HttpStatus.FORBIDDEN)
  }
}
