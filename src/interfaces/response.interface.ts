export type TExceptionOption =
  | string
  | {
      code: number
      msg: string
      error?: any
    }

// 分页数据
export interface IHttpResultPaginate<T> {
  list: T
  total: number
}

// HTTP 状态返回
export interface IHttpResponseBase {
  code: number
  msg: string
}

// HTTP error
export type THttpErrorResponse = IHttpResponseBase & {
  error: any
}

// HTTP success 返回
export type THttpSuccessResponse<T> = IHttpResponseBase & {
  data: T | IHttpResultPaginate<T>
}

// HTTP Response
export type THttpResponse<T> = THttpErrorResponse | THttpSuccessResponse<T>
