import { IConfig } from '@interfaces/config.interface'
import devConfig from './dev.config'

export default (config: IConfig) => {
  return devConfig(config)
}
