/**
 * 原始消费记录表
 * 想疯狂打人！！！！！！1
 */
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

import { ADMIN_NO } from '@constants/system.constant'

export const enum Mould {
  SWIM = 0, // 现金模式
  KEEP = 1 // 计份模式
}

export const enum Status {
  GENUINE = 0, // 有效记录
  FORGERY = 1 // 无效记录
}

export const enum RecordType {
  SABER_NO_1 = 1, // 消费
  SABER_NO_2 = 2, // 正常充值
  SABER_NO_3 = 3, // 提现金额充值
  SABER_NO_4 = 4, // 补贴
  SABER_NO_5 = 5, // 纠错补贴
  SABER_NO_8 = 8, // 提现
  SABER_NO_12 = 12, // 无卡充值
  SABER_NO_13 = 13, // 补卡充值
  SABER_NO_16 = 16, // 补贴清零
  SABER_NO_31 = 31, // 金额消费纠错
  SABER_NO_32 = 32, // 冲正
  SABER_NO_34 = 34, // 日补贴
  SABER_NO_35 = 35, // 时段补贴
  SABER_NO_36 = 36, // 冻结
  SABER_NO_37 = 37, // 解冻
  SABER_NO_51 = 51, // 联机记账
  SABER_NO_52 = 52, // 联机份记账
  SABER_NO_61 = 61 // 银行app充值
}

export const enum RecordSource {
  LUCKY = 0, // 设备读取的记录
  LARRY = 1, // 系统生成的记录
  ANDY = 2, // 系统补录的记录
  CHERRY = 3, // 手工补录的记录
  HONNY = 4, // 联机收到的记录
  TONY = 5 // 银行app充值
}

@Entity({
  name: 'xf_jl'
})
export class Naked {
  @PrimaryGeneratedColumn('increment', {
    name: 'xh'
  })
  id?: number

  @Column({
    name: 'mould',
    type: 'int',
    default: Mould.SWIM,
    comment: '消费模式，0：现金模式 1：计份模式'
  })
  mould?: Mould

  @Column({
    name: 'lx',
    type: 'int',
    default: RecordType.SABER_NO_61,
    comment: '记录类型'
  })
  recordType?: RecordType

  @Column({
    name: 'jl_bh',
    type: 'varchar',
    length: 50,
    default: '0',
    comment: '记录编号'
  })
  recordNo?: string

  @Column({
    type: 'varchar',
    length: 50,
    comment: '交易流水号'
  })
  tranno?: string

  @Column({
    name: 'dev_serial',
    type: 'char',
    default: '0000000',
    comment: '设备id'
  })
  devSerial?: string

  @Column({
    name: 'sam_serial',
    type: 'varchar',
    default: '0000000',
    comment: 'SAM卡应用序列号：00+SAM卡前5个字节。12位十进制'
  })
  samSerial?: string

  @Column({
    name: 'dep_serial',
    type: 'bigint',
    comment: '部门id'
  })
  depSerial?: number

  @Column({
    name: 'old_money',
    type: 'money',
    comment: '交易前总余额（分）'
  })
  preTotalBalance?: number

  @Column({
    name: 'new_money',
    type: 'money',
    default: 0,
    comment: '消费/充值金额（分）'
  })
  amount?: number

  @Column({
    name: 'user_serial',
    type: 'bigint',
    comment: '用户id'
  })
  userSerial?: number

  @Column({
    name: 'sub_xh',
    type: 'int',
    nullable: true,
    comment: '补贴id'
  })
  assistId?: number

  @Column({
    name: 'state',
    type: 'int',
    comment: '记录状态，0有效，1无效',
    default: Status.GENUINE
  })
  status?: Status

  @Column({
    name: 'type',
    type: 'int',
    comment: '记录来源',
    default: RecordSource.TONY
  })
  recordSource?: RecordSource

  @Column({
    name: 'time_order',
    type: 'char',
    comment: '设备时段编号',
    default: '0000000000000000'
  })
  devTimeNo?: string

  @Column({
    name: 'time_no',
    type: 'char',
    comment: '个人时段编号',
    default: '0000000000000000'
  })
  userTimeNo?: string

  @Column({
    name: 'del_type',
    type: 'int',
    comment: '是否删除',
    default: 0
  })
  isDelete?: number

  @Column({
    name: 'sub_old',
    type: 'money',
    comment: '补贴交易前余额（分）'
  })
  preSubsidyBalance?: number

  @Column({
    name: 'sub_new',
    type: 'money',
    default: 0,
    comment: '消费/充值补贴（分）'
  })
  subsidy?: number

  @Column({
    name: 'each_old',
    type: 'int',
    comment: '交易前份数',
    default: 0
  })
  preCopiesNum?: number

  @Column({
    name: 'each_new',
    type: 'int',
    comment: '操作份数',
    default: 0
  })
  copiesNum?: number

  @Column({
    name: 'each_unit',
    type: 'int',
    default: 0,
    comment: '交易单价（分）'
  })
  unitPrice?: number

  @Column({
    name: 'more_money',
    type: 'money',
    default: 0,
    comment: '应收金额（分）'
  })
  amountReceivable?: number

  @Column({
    name: 'discount_rate',
    type: 'int',
    default: 100,
    comment: '消费折扣比例，百分比数字'
  })
  discountRate?: number

  @Column({
    name: 'jl_count',
    type: 'int',
    comment: '修改次数'
  })
  modifyCount?: number

  @CreateDateColumn({
    name: 'jl_sj',
    type: 'int',
    comment: '记录时间'
  })
  createdDate?: Date

  @Column({
    name: 'sj',
    type: 'datetime',
    comment: '修改时间'
  })
  updatedDate?: Date

  @Column({
    name: 'gly_no',
    type: 'nvarchar',
    length: 50,
    nullable: true,
    default: ADMIN_NO,
    comment: '操作人员编号'
  })
  operatorCode?: string
}
