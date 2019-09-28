import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common'
import { ANONYMOUSE_ERROR } from '@constants/error/general.constant'
import config from '@config'

/**
 * @class OriginMiddleware
 * @classdesc 用于验证是否为非法来源请求
 */
@Injectable()
export class OriginMiddleware implements NestMiddleware {
  use(request, response, next) {
    const { crossDomain } = config
    const { origin, referer } = request.headers
    const checkHeader = field =>
      !field || crossDomain.allowedReferer === '*' || crossDomain.allowedReferer.includes(field)
    const isVerifiedOrigin = checkHeader(origin)
    const isVerifiedReferer = checkHeader(referer)
    if (!isVerifiedOrigin && !isVerifiedReferer) {
      response.statusCode = HttpStatus.UNAUTHORIZED
      return response.end(
        JSON.stringify({
          ...ANONYMOUSE_ERROR
        })
      )
    }
    // 其他通行
    return next()
  }
}
