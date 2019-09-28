import * as winston from 'winston'
import { IConfig } from '@interfaces/config.interface'

require('winston-daily-rotate-file')

export default (config: IConfig) => {
  const { level, logDir } = config.logger

  // @ts-ignore
  const transport = new winston.transports.DailyRotateFile({
    dirname: logDir,
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  })

  config.winston = {
    level,
    format: winston.format.combine(
      winston.format.colorize({
        colors: {
          info: 'blue',
          warn: 'yellow',
          debug: 'blue'
        }
      }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(info => {
        if (info.stack) {
          info.message = info.stack
        }
        return `${info.timestamp} [${info.pid}] ${info.level}: [${info.context || 'Application'}] ${
          info.message
        }`
      })
    ),
    defaultMeta: { pid: process.pid },
    transports: [
      transport,
      new winston.transports.Console(),
      new winston.transports.File({ dirname: logDir, filename: 'error.log', level: 'error' })
    ]
  }
  return config
}
