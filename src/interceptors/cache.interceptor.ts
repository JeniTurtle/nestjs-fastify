import { tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { Logger } from 'winston'
import {
  CacheInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  Inject,
  RequestMethod
} from '@nestjs/common'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import * as META from '@constants/meta.constant'
import config from '@config'

/**
 * @class HttpCacheInterceptor
 * @classdesc 自定义这个拦截器是是要弥补框架不支持 ttl 参数的缺陷
 */
@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  constructor(cacheManager: any, reflector: any, @Inject('winston') private logger: Logger) {
    super(cacheManager, reflector)
  }
  // 自定义装饰器，修饰 ttl 参数
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const call$ = next.handle()
    // 如果想彻底禁用缓存服务，还是直接返回数据吧
    // return call$;
    const key = this.trackBy(context)
    const target = context.getHandler()
    const request = context.switchToHttp().getRequest().req
    const metaTTL = this.reflector.get(META.HTTP_CACHE_TTL_METADATA, target)
    const ttl = metaTTL || config.redis.ttl
    if (!key) {
      return call$
    }
    try {
      const value = await this.cacheManager.get(key)
      if (value) {
        this.logger.info(
          `返回缓存数据：${request.method} -> ${request.url} ${JSON.stringify(value)}`
        )
        return of(value)
      }
      return call$.pipe(tap(response => this.cacheManager.set(key, response, { ttl })))
    } catch (error) {
      return call$
    }
  }

  /**
   * @function trackBy
   * @description 目前的命中规则是：必须手动设置了 CacheKey 才会启用缓存机制，默认 ttl 为 APP_CONFIG.REDIS.defaultCacheTTL
   */
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest()
    const httpServer: FastifyAdapter = this.httpAdapterHost.httpAdapter
    const isHttpApp = httpServer && !!httpServer.getRequestMethod
    const isGetRequest =
      isHttpApp && httpServer.getRequestMethod(request) === RequestMethod[RequestMethod.GET]
    const requestUrl = httpServer.getRequestUrl(request)
    const cacheKey = this.reflector.get(META.HTTP_CACHE_KEY_METADATA, context.getHandler())
    const isMatchedCache = isHttpApp && isGetRequest && cacheKey
    // 缓存命中策略 -> http -> GET -> cachekey -> url -> undefined;
    return isMatchedCache ? cacheKey || requestUrl : undefined
  }
}
