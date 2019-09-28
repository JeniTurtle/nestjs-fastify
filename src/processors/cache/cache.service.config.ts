import * as redisStore from 'cache-manager-redis-store'
import { Logger } from 'winston'
import { CacheModuleOptions, CacheOptionsFactory, Injectable, Inject } from '@nestjs/common'
import config from '@config'

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  // 重试策略
  public retryStrategy() {
    return {
      retry_strategy: options => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          this.logger.warn('Redis 连接出了问题：', options.error)
          return new Error('Redis 服务器拒绝连接')
        }
        if (options.total_retry_time > 1000 * 60) {
          return new Error('重试时间已用完')
        }
        if (options.attempt > 6) {
          return new Error('尝试次数已达极限')
        }
        return Math.min(options.attempt * 100, 3000)
      }
    }
  }

  // 缓存配置
  public createCacheOptions(): CacheModuleOptions {
    return { store: redisStore, ...config.redis }
  }
}
