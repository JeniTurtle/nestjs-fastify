import { LoggerOptions } from 'winston'
import { ConnectionOptions } from 'typeorm'

export interface IConfig {
  readonly env: string
  readonly isProd: boolean
  readonly baseDir: string
  port: number
  crossDomain: {
    allowedOrigins: string | string[]
    allowedReferer: string | string[]
  }
  typeOrm: ConnectionOptions
  winston: LoggerOptions
  logger: {
    level?: string
    logDir?: string
  }
  [propName: string]: any
}
