import { UnauthorizedException } from '@nestjs/common'
import { FORBIDDEN_ERROR } from '@constants/error/general.constant'
import { TExceptionOption } from '@interfaces/response.interface'

/**
 * @class HttpUnauthorizedError
 * @classdesc 401 -> 未授权/权限验证失败
 */
export class HttpUnauthorizedError extends UnauthorizedException {
  constructor(message?: TExceptionOption, error?: string) {
    super(message || FORBIDDEN_ERROR, error)
  }
}
