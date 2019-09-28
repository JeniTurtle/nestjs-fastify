import * as assert from 'assert'
import { validate } from 'class-validator'
import {
  DeepPartial,
  FindManyOptions,
  FindOperator,
  Repository,
  Equal,
  In,
  IsNull,
  LessThan,
  MoreThan,
  Not,
  Raw
} from 'typeorm'

export interface IFindParam {
  where?: any
  orderBy?: any
  limit?: number
  offset?: number
  fields?: string[]
}

export class BaseService {
  static serviceMap: Map<string, Service<any>> = new Map()

  constructor(...args) {
    const self = this
    const serviceClass = this.constructor
    const injectedServices = Reflect.getMetadata('injected_services', serviceClass) || []
    injectedServices.forEach((value, key) => {
      args.forEach(obj => {
        if (obj instanceof Repository && obj.metadata.target === value) {
          self[key] = this.getService(obj)
        }
      })
      assert(self[key], `未找到${key}属性对应的Repository实例，请在构造函数中注入此实例`)
    })
  }

  static getService<T>(repository: Repository<T>): Service<T> {
    const className = repository.metadata.name
    if (this.serviceMap.has(className)) {
      const service = this.serviceMap.get(className)
      if (service && service.repository === repository) {
        return service
      }
    }
    const newService = new Service<T>(repository)
    this.serviceMap.set(className, newService)
    return newService
  }

  getService<T>(repository: Repository<T>): Service<T> {
    return BaseService.getService<T>(repository)
  }
}

export class Service<E> {
  constructor(public readonly repository: Repository<E>) { }

  private async findOption({ where, limit, offset, fields, orderBy }: IFindParam = {}): Promise<
    any
  > {
    const findOptions: FindManyOptions = {}

    if (limit) {
      findOptions.take = limit
    }
    if (offset) {
      findOptions.skip = offset
    }
    if (fields) {
      findOptions.select = fields
    }
    if (orderBy) {
      const parts = orderBy.toString().split('_')
      const attr = parts[0]
      const direction: 'ASC' | 'DESC' = parts[1] as 'ASC' | 'DESC'
      findOptions.order = {
        [attr]: direction
      }
    }
    findOptions.where = this.processWhereOptions(where)
    return findOptions
  }

  async find({ where, limit, offset, fields, orderBy }: IFindParam = {}): Promise<E[]> {
    const findOptions: any = await this.findOption({ where, limit, offset, fields, orderBy })
    return await this.repository.find(findOptions)
  }

  async count({ where }: IFindParam = {}): Promise<number> {
    const findOptions: any = await this.findOption({ where })
    return await this.repository.count(findOptions)
  }

  async findAndCount({ where, limit, offset, fields, orderBy }: IFindParam = {}): Promise<{
    rows: E[]
    count: number
  }> {
    const findOptions: any = await this.findOption({ where, limit, offset, fields, orderBy })
    const [rows, count] = await this.repository.findAndCount(findOptions)
    return { rows, count }
  }

  async findOne(where, fields?: string[], orderBy?: string): Promise<E | null> {
    const items = await this.find({ where, fields, orderBy })
    if (!items.length) {
      return null
    } else if (items.length > 1) {
      throw new Error(
        `Found ${items.length} ${this.repository.metadata.name}s where ${JSON.stringify(where)}`
      )
    }
    return items[0]
  }

  async create(data: DeepPartial<E>): Promise<E> {
    const results = await this.repository.create([data])
    const obj = results[0]

    const errors = await validate(obj, { skipMissingProperties: true })
    if (errors.length) {
      throw new Error(JSON.stringify(errors))
    }
    return await this.repository.save(obj, { reload: true })
  }

  async createMany(data: Array<DeepPartial<E>>): Promise<E[]> {
    data = data.map(item => {
      return { ...item }
    })

    const results = await this.repository.create(data)

    results.forEach(async obj => {
      const errors = await validate(obj, { skipMissingProperties: true })
      if (errors.length) {
        throw new Error(JSON.stringify(errors))
      }
    })

    return await this.repository.save(results, { reload: true })
  }

  async update(data: DeepPartial<E>, where): Promise<E | false> {
    const found = await this.findOne(where)
    if (!found) {
      return false
    }
    const merged = this.repository.merge(found, data)

    const errors = await validate(merged, { skipMissingProperties: true })
    if (errors.length) {
      throw new Error(JSON.stringify(errors))
    }
    return await this.repository.save(merged)
  }

  processWhereOptions<W extends any>(where: W) {
    if (Array.isArray(where)) {
      const whereOptions: Array<{ [key: string]: FindOperator<any> }> = []
      Object.keys(where).forEach(k => {
        const options: any = {}
        for (const index in where[k]) {
          const key = index as keyof W
          if (where[k][key] === undefined) {
            continue
          }
          const [attr, operator] = getFindOperator(String(key), where[k][key])
          options[attr] = operator
        }
        whereOptions.push(options)
      })
      return whereOptions
    } else {
      const whereOptions: { [key: string]: FindOperator<any> } = {}
      Object.keys(where).forEach(k => {
        const key = k as keyof W
        if (where[key] !== undefined) {
          const [attr, operator] = getFindOperator(String(key), where[key])
          whereOptions[attr] = operator
        }
      })
      return whereOptions
    }
  }
}

export function getFindOperator(key: string, value: any): [string, FindOperator<any>] {
  const parts = key.toString().split('_')
  const attr = parts[0]
  const operator = parts.length > 1 ? parts[1] : 'eq'

  switch (operator) {
    case 'eq':
      if (value === null) {
        return [attr, IsNull()]
      }
      return [attr, Equal(value)]
    // // Not using "not" yet
    // case 'not':
    //   return [attr, Not(value)];
    case 'lt':
      return [attr, LessThan(value)]
    case 'lte':
      return [attr, Not(MoreThan(value))]
    case 'gt':
      return [attr, MoreThan(value)]
    case 'gte':
      return [attr, Not(LessThan(value))]
    case 'in':
      return [attr, In(value)]
    case 'contains':
      return [attr, Raw(alias => `LOWER(${alias}) LIKE LOWER('%${value}%')`)]
    case 'startsWith':
      return [attr, Raw(alias => `LOWER(${alias}) LIKE LOWER('${value}%')`)]
    case 'endsWith':
      return [attr, Raw(alias => `LOWER(${alias}) LIKE LOWER('%${value}')`)]
    default:
      throw new Error(`Can't find operator ${operator}`)
  }
}
