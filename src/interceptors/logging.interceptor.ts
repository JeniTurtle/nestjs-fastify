import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Logger } from 'winston'
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const call$ = next.handle()
    const request = context.switchToHttp().getRequest().req
    const content = request.method + ' -> ' + request.url
    const body = request.body ? JSON.stringify(request.body) : '{}'
    this.logger.info(`收到请求：${content} body: ${body}`)
    const now = Date.now()
    return call$.pipe(tap(() => this.logger.info(`响应请求：${content} ${Date.now() - now}ms`)))
  }
}
