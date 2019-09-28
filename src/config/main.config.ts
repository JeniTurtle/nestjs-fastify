import * as path from 'path'
import * as extend from 'extend'
import baseConfig from './base.config'
import winstonConfig from './winston.config'
import { IConfig } from '@interfaces/config.interface'

class Config {
  static instance: IConfig

  static getInstace(): IConfig {
    if (!Config.instance) {
      Config.instance = getConfig()
    }
    return Config.instance
  }
}

function getConfig() {
  const env = (process.env.NODE_ENV || 'local').toLowerCase()
  const config: any = {
    env,
    baseDir: path.resolve(__dirname, '..', '..'),
    isProd: env === 'prod' || env === 'production'
  }
  const envPath = path.resolve(__dirname, `./${config.env}.config`)
  try {
    const tempConfig = extend(config, baseConfig(config))
    extend(config, require(envPath).default(tempConfig))
    winstonConfig(config)
  } catch (err) {
    throw err
  }
  return config
}

export default Config.getInstace()
