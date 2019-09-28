import { ServerResponse } from 'http'
import { Injectable, NestMiddleware, HttpStatus, RequestMethod } from '@nestjs/common'
import config from '@config'

/**
 * @class CorsMiddleware
 * @classdesc 用于处理 CORS 跨域
 */
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(request, response: ServerResponse, next) {
    const { crossDomain } = config
    const getMethod = method => RequestMethod[method]
    const origins = request.headers.origin
    const origin = (Array.isArray(origins) ? origins[0] : origins) || ''
    const allowedOrigins = [...crossDomain.allowedOrigins]
    const allowedMethods = [
      RequestMethod.GET,
      RequestMethod.HEAD,
      RequestMethod.PUT,
      RequestMethod.PATCH,
      RequestMethod.POST,
      RequestMethod.DELETE
    ]
    const allowedHeaders = [
      'Authorization',
      'Origin',
      'No-Cache',
      'X-Requested-With',
      'If-Modified-Since',
      'Pragma',
      'Last-Modified',
      'Cache-Control',
      'Expires',
      'Content-Type',
      'X-E4M-With'
    ]

    // Allow Origin
    if (!origin || allowedOrigins.includes(origin)) {
      response.setHeader('Access-Control-Allow-Origin', origin || '*')
    }
    // Headers
    response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','))
    response.setHeader('Access-Control-Allow-Methods', allowedMethods.map(getMethod).join(','))
    response.setHeader('Access-Control-Max-Age', '1728000')
    response.setHeader('Content-Type', 'application/json; charset=utf-8')

    // OPTIONS Request
    if (request.method === getMethod(RequestMethod.OPTIONS)) {
      response.statusCode = HttpStatus.NO_CONTENT
      response.end()
    } else {
      return next()
    }
  }
}
