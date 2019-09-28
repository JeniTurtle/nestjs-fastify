import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { ValidationError } from '@exceptions/validation.error'
import { VALIDATION_ERROR } from '@constants/error/general.constant'

/**
 * @class ValidationPipe
 * @classdesc 验证所有使用 class-validator 的地方的 class 模型
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      const errorMessage = errors.map(error => Object.values(error.constraints).join(';')).join(';')
      throw new ValidationError({
        ...VALIDATION_ERROR,
        error: errorMessage
      })
    }
    return value
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find(type => metatype === type)
  }
}
