import { IConfig } from '@interfaces/config.interface'

export default (config: IConfig) => {
  config.crossDomain = {
    allowedOrigins: '*',
    allowedReferer: '*'
  }

  return config
}
