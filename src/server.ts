import * as rateLimit from 'fastify-rate-limit'
import * as helmet from 'fastify-helmet'
import * as compress from 'fastify-compress'
import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from '@modules/app/app.module'
import { ValidationPipe } from '@pipes/validation.pipe'
import { HttpExceptionFilter } from '@filters/exception.filter'
import { TransformInterceptor } from '@interceptors/transform.interceptor'
import { ErrorInterceptor } from '@interceptors/error.interceptor'
import { LoggingInterceptor } from '@interceptors/logging.interceptor'
import config from '@config'

async function bootstrap() {
  const urlPrefix = 'api/v1'
  const adapter = new FastifyAdapter()
  // 安全防护
  adapter.register(helmet)
  // 压缩请求
  adapter.register(compress)
  // 限制访问频率，多实例建议走redis
  adapter.register(rateLimit, {
    max: 100,
    timeWindow: 6000 // 一分钟
  })
  const nestApp = await NestFactory.create<NestFastifyApplication>(AppModule, adapter)
  // 设置全局前缀
  nestApp.setGlobalPrefix(urlPrefix)
  // 全局使用winston
  const nestWinston = nestApp.get('NestWinston')
  nestApp.useLogger(nestWinston)
  // 捕获全局错误
  nestApp.useGlobalFilters(new HttpExceptionFilter(nestWinston.logger))
  // class-validator效验
  nestApp.useGlobalPipes(new ValidationPipe())
  // 添加拦截器
  nestApp.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    new ErrorInterceptor(new Reflector(), nestWinston.logger),
    new LoggingInterceptor(nestWinston.logger)
  )
  // Swagger文档
  const options = new DocumentBuilder()
    .setBasePath(urlPrefix)
    .setTitle('接口文档')
    .setDescription('接口文档')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(nestApp, options)
  SwaggerModule.setup('/docs', nestApp, document)
  // 监听服务端口
  await nestApp.listen(config.port)
  return nestWinston.logger
}
bootstrap().then(logger => {
  logger.info(`url: http://127.0.0.1:${config.port}, env: ${config.env}`)
})
