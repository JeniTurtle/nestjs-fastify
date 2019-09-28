import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  HttpStatus
} from '@nestjs/common'
import { THttpSuccessResponse, IHttpResultPaginate } from '@interfaces/response.interface'
import * as META from '@constants/meta.constant'
import * as TEXT from '@constants/text.constant'

// 转换为标准的数据结构
export function transformDataToPaginate<T>(data: {
  rows: T[]
  count: number
}): IHttpResultPaginate<T[]> {
  return {
    list: data.rows,
    total: data.count
  }
}

/**
 * @class TransformInterceptor
 * @classdesc 当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构 IHttpResultPaginate
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, THttpSuccessResponse<T>> {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<THttpSuccessResponse<T>> {
    const call$ = next.handle()
    const target = context.getHandler()
    const code =
      this.reflector.get<string>(META.HTTP_SUCCESS_RESPONSE_CODE, target) || HttpStatus.OK
    const msg =
      this.reflector.get<string>(META.HTTP_SUCCESS_RESPONSE_MESSAGE, target) ||
      TEXT.HTTP_DEFAULT_SUCCESS_TEXT
    const usePaginate = this.reflector.get<boolean>(META.HTTP_RESPONSE_TRANSFORM_PAGINATE, target)
    return call$.pipe(
      map((item: any) => {
        const data = !usePaginate ? item : transformDataToPaginate<T>(item)
        return { code: Number(code), msg, data }
      })
    )
  }
}
