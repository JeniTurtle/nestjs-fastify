import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Logger } from 'winston'
import { Reflector } from '@nestjs/core'
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  HttpStatus
} from '@nestjs/common'
import { PlatformError } from '@exceptions/platform.error'
import { DEFAULT_ERROR } from '@constants/error/general.constant'
import * as META from '@constants/meta.constant'
import * as TEXT from '@constants/text.constant'

/**
 * @class ErrorInterceptor
 * @classdesc 当控制器所需的 Promise service 发生错误时，错误将在此被捕获
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector, readonly logger: Logger) { }
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const call$ = next.handle()
    const target = context.getHandler()
    const code =
      this.reflector.get<string>(META.HTTP_SUCCESS_RESPONSE_CODE, target) || DEFAULT_ERROR.code
    const status =
      this.reflector.get<HttpStatus>(META.HTTP_ERROR_RESPONSE_STATUS, target) ||
      HttpStatus.INTERNAL_SERVER_ERROR
    const msg =
      this.reflector.get<string>(META.HTTP_ERROR_RESPONSE_MESSAGE, target) ||
      TEXT.HTTP_DEFAULT_ERROR_TEXT
    return call$.pipe(
      catchError(error => {
        if (error.response && error.status) {
          return throwError(error)
        }
        return throwError(
          new PlatformError(
            {
              code: Number(code),
              msg,
              error: error.message
            },
            status
          )
        )
      })
    )
  }
}
