import * as lodash from 'lodash'
import { Logger } from 'winston'
import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { THttpErrorResponse, TExceptionOption } from '@interfaces/response.interface'
import { NOT_FOUND_ERROR, DEFAULT_ERROR } from '@constants/error/general.constant'

/**
 * @class HttpExceptionFilter
 * @classdesc 拦截全局抛出的所有异常，同时任何错误将在这里被规范化输出 THttpErrorResponse
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception.toString())
    const request = host.switchToHttp().getRequest().req
    const response = host.switchToHttp().getResponse()
    try {
      const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
      const errorOption: TExceptionOption = exception.getResponse() as TExceptionOption
      const isString = (value): value is string => lodash.isString(value)
      const errCode = isString(errorOption)
        ? NOT_FOUND_ERROR.code
        : errorOption.code || NOT_FOUND_ERROR.code
      const errMessage = isString(errorOption) ? errorOption : errorOption.msg
      const errorInfo = isString(errorOption) ? null : errorOption.error
      const parentErrorInfo = errorInfo ? String(errorInfo) : null
      const isChildrenError = errorInfo && errorInfo.code && errorInfo.msg
      const resultError = (isChildrenError && errorInfo.msg) || parentErrorInfo
      const data: THttpErrorResponse = {
        code: errCode,
        msg: errMessage,
        error: resultError
      }
      // 对默认的 404 进行特殊处理
      if (status === HttpStatus.NOT_FOUND) {
        data.error = `资源不存在`
        data.msg = `接口 ${request.method} -> ${request.url} 无效`
      }
      return response.code(status).send(data)
    } catch (err) {
      return response.code(status).send(DEFAULT_ERROR)
    }
  }
}
