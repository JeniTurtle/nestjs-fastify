import * as lodash from 'lodash'
import * as META from '@constants/meta.constant'
import * as TEXT from '@constants/text.constant'
import { DEFAULT_ERROR } from '@constants/error/general.constant'
import { SetMetadata, HttpStatus } from '@nestjs/common'

// 构造器参数
interface IBuildDecoratorOption {
  errorCode?: number
  errorStatus?: HttpStatus
  errorMsg?: string
  successCode?: number
  successStatus?: HttpStatus
  successMsg?: string
  usePaginate?: boolean
}

// handle 参数
interface IHandleOption {
  errorCode: number
  errorStatus: HttpStatus
  message: string
  usePaginate?: boolean
}

type THandleOption = string | IHandleOption

// 构造请求装饰器
const buildHttpDecorator = (options: IBuildDecoratorOption): MethodDecorator => {
  const {
    errorCode,
    successCode,
    errorMsg,
    successMsg,
    errorStatus,
    successStatus,
    usePaginate
  } = options
  return (_, __, descriptor: PropertyDescriptor) => {
    if (errorCode) {
      SetMetadata(META.HTTP_ERROR_RESPONSE_CODE, errorCode)(descriptor.value)
    }
    if (successCode) {
      SetMetadata(META.HTTP_SUCCESS_RESPONSE_CODE, successCode)(descriptor.value)
    }
    if (errorMsg) {
      SetMetadata(META.HTTP_ERROR_RESPONSE_MESSAGE, errorMsg)(descriptor.value)
    }
    if (successMsg) {
      SetMetadata(META.HTTP_SUCCESS_RESPONSE_MESSAGE, successMsg)(descriptor.value)
    }
    if (errorStatus) {
      SetMetadata(META.HTTP_ERROR_RESPONSE_STATUS, errorStatus)(descriptor.value)
    }
    if (successStatus) {
      SetMetadata(META.HTTP_SUCCESS_RESPONSE_STATUS, successStatus)(descriptor.value)
    }
    if (usePaginate) {
      SetMetadata(META.HTTP_RESPONSE_TRANSFORM_PAGINATE, true)(descriptor.value)
    }
    return descriptor
  }
}

/**
 * 异常响应装饰器
 * @exports success
 * @example @HttpProcessor.success('error message', 100010, 200)
 * @example @HttpProcessor.success(DEFAULT_ERROR, 200)
 */
export function error(
  message: string | { msg: string; code: number },
  code?: number,
  status?: HttpStatus
): MethodDecorator {
  const isString = (value): value is string => lodash.isString(value)
  if (isString(message)) {
    return buildHttpDecorator({
      errorMsg: message || DEFAULT_ERROR.msg,
      errorCode: code || DEFAULT_ERROR.code,
      errorStatus: status || HttpStatus.INTERNAL_SERVER_ERROR
    })
  }
  return buildHttpDecorator({ errorMsg: message.msg, errorCode: message.code, errorStatus: status })
}
/**
 * 成功响应装饰器
 * @exports success
 * @example @HttpProcessor.success('success message')
 */
export const success = (message?: string, code?: number): MethodDecorator => {
  return buildHttpDecorator({
    successMsg: message || TEXT.HTTP_DEFAULT_SUCCESS_TEXT,
    successCode: code || HttpStatus.OK,
    successStatus: HttpStatus.OK
  })
}

/**
 * 统配构造器
 * @function handle
 * @description 两种用法
 * @example @HttpProcessor.handle('获取某项数据')
 * @example @HttpProcessor.handle({ message: '操作', errorCode: 500, errorStatus, usePaginate: true })
 */
export function handle(args: THandleOption): MethodDecorator
export function handle(...args: any[]) {
  const option = args[0]
  const isOption = (value: THandleOption): value is IHandleOption => lodash.isObject(value)
  const message: string = isOption(option) ? option.message : option
  const errorMsg: string = message + '失败'
  const successMsg: string = message + '成功'
  const errorCode: number = isOption(option) ? option.errorCode : DEFAULT_ERROR.code
  const errorStatus: number = isOption(option)
    ? option.errorStatus
    : HttpStatus.INTERNAL_SERVER_ERROR
  const successCode: number = HttpStatus.OK
  const usePaginate: boolean = isOption(option) ? option.usePaginate || false : false
  return buildHttpDecorator({
    errorCode,
    successCode,
    errorMsg,
    successMsg,
    errorStatus,
    usePaginate
  })
}

/**
 * 分页装饰器
 * @exports paginate
 * @example @HttpProcessor.paginate()
 */
export const paginate = (): MethodDecorator => {
  return buildHttpDecorator({ usePaginate: true })
}

/**
 * 导出的不同模块
 * @exports HttpProcessor
 * @description { error, success, paginate }
 */
export const HttpProcessor = { error, success, paginate }
