import * as path from 'path'
import { IConfig } from '@interfaces/config.interface'

export default (config: IConfig) => {
  config.port = 3001

  config.logger = {
    level: 'debug',
    logDir: path.join(config.baseDir, 'logs')
  }

  config.redis = {
    host: 'localhost',
    port: 6379,
    auth_pass: '',
    ttl: null,
    db: 1,
    defaultCacheTTL: 60 * 60 * 24
  }

  config.typeOrm = {
    type: 'mssql',
    host: 'locahost',
    database: 'fuck',
    username: 'bitch',
    password: '123456',
    entities: [`${config.baseDir}/**/**.model.ts`],
    synchronize: false,
    migrationsRun: false,
    logging: ['query'],
    maxQueryExecutionTime: 1500 // 慢查询记录
  }

  return config
}
