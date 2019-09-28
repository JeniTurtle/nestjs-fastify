/**
 * 消费明细记录表
 * 想疯狂打人！！！！！！1
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert
} from 'typeorm'
import { ADMIN_NO } from '@constants/system.constant'

export const enum RecordSource {
  BITCH = 0, // 脱机
  DOG = 1 // 联机
}

export const enum Mould {
  SWIM = 0, // 现金模式
  KEEP = 1 // 计份模式
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

@Entity({
  name: 'xf_mx'
})
export class Undisguised {
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
    name: 'type',
    type: 'int',
    comment: '记录来源',
    default: RecordSource.DOG
  })
  recordSource?: RecordSource

  @Column({
    name: 'jl_bh',
    type: 'varchar',
    default: '00000000',
    comment: '记录编号'
  })
  recordNo?: string

  @Column({
    name: 'jl_count',
    type: 'int',
    comment: '修改次数'
  })
  modifyCount?: number

  @Column({
    name: 'user_serial',
    type: 'bigint',
    comment: '用户id'
  })
  userSerial?: number

  @Column({
    name: 'dep_serial',
    type: 'bigint',
    comment: '部门id'
  })
  depSerial?: number

  @Column({
    name: 'rq',
    type: 'datetime',
    comment: '消费日期'
  })
  createdDate?: Date

  @Column({
    name: 'jl_sj',
    type: 'datetime',
    comment: '记录时间'
  })
  recordTime?: Date

  @Column({
    name: 'dev_serial',
    type: 'char',
    default: '0000000',
    comment: '设备id'
  })
  devSerial?: string

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
    comment: '实收金额金额（分）。鬼知道怎么用！默认添0就行了！'
  })
  retardedField?: number

  @Column({
    name: 'new_add',
    type: 'money',
    default: 0,
    comment: '充值金额（分）'
  })
  rechargeAmount?: number

  @Column({
    name: 'old_add',
    type: 'money',
    default: 0,
    comment: '充值前金额（分）'
  })
  preRechargeAmount?: number

  @Column({
    name: 'old_sub',
    type: 'money',
    comment: '补贴交易前余额（分）'
  })
  preSubsidyBalance?: number

  @Column({
    name: 'new_sub',
    type: 'money',
    default: 0,
    comment: '消费/充值补贴（分）'
  })
  subsidy?: number

  @Column({
    name: 'new_del',
    type: 'int',
    comment: '提现的金额',
    default: 0
  })
  withdrawAmount?: number

  @Column({
    name: 'del_count',
    type: 'int',
    comment: '提现次数',
    default: 0
  })
  withdrawCount?: number

  @Column({
    name: 'add_count',
    type: 'int',
    default: 1,
    comment: '充值次数。呵呵呵呵呵呵'
  })
  rechargeCount?: number

  @Column({
    name: 'save_add',
    type: 'money',
    comment: 'new_add + old_add'
  })
  currentAmount?: number

  @Column({
    name: 'save_sub',
    type: 'money',
    comment: 'new_sub + old_sub'
  })
  currentSubsidy?: number

  @Column({
    name: 'save_money',
    type: 'money',
    comment: 'new_add + old_money'
  })
  currentTotalBalance?: number

  @Column({
    name: 'new_each',
    type: 'money',
    default: 0,
    comment: '按份消费的金额'
  })
  eachAmount?: number

  @Column({
    name: 'new_zero',
    type: 'money',
    default: 0,
    comment: '补贴清零的金额'
  })
  zeroAmount?: number

  @Column({
    name: 'del_zero',
    type: 'int',
    default: 0,
    comment: '补贴清零的次数'
  })
  zeroCount?: number

  @Column({
    name: 'new_edit',
    type: 'money',
    default: 0,
    comment: '充正的金额'
  })
  editAmount?: number

  @Column({
    name: 'del_edit',
    type: 'int',
    default: 0,
    comment: '充正的次数'
  })
  editCount?: number

  @Column({
    name: 'dev_time_no',
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

  @Column({
    type: 'varchar',
    length: 50,
    comment: '交易流水号'
  })
  tranno?: string

  @BeforeInsert()
  computedCurrentAmount() {
    this.currentAmount = (this.preRechargeAmount || 0) + (this.rechargeAmount || 0)
  }

  @BeforeInsert()
  computedCurrentSubsidy() {
    this.currentSubsidy = (this.preSubsidyBalance || 0) + (this.subsidy || 0)
  }

  @BeforeInsert()
  computedCurrentTotalBalance() {
    this.currentTotalBalance = (this.preTotalBalance || 0) + (this.rechargeAmount || 0)
  }
}
