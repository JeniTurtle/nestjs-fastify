import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from '@config'

// 首页控制器
import { AppController } from './app.controller'
// 拦截器
import { HttpCacheInterceptor } from '@interceptors/cache.interceptor'
// 中间件
import { CorsMiddleware } from '@middlewares/cors.middleware'
import { OriginMiddleware } from '@middlewares/origin.middleware'
// 公共模块
import { HttpCacheModule } from '@processors/cache/cache.module'
import { HelperModule } from '@processors/helper/helper.module'
// 业务模块
import { AuthorizeModule } from '@modules/authorize/authorize.module'
import { RechargeModule } from '@modules/account/recharge/recharge.module'

@Module({
  imports: [
    WinstonModule.forRoot(config.winston),
    TypeOrmModule.forRoot({ ...config.typeOrm }),
    HttpCacheModule,
    HelperModule,
    AuthorizeModule,
    RechargeModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes({
      path: '(.*)?',
      method: RequestMethod.ALL
    })
  }
}
