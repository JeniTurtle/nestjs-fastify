/**
 * 补贴充值记录表
 * 想疯狂打人！！！！！！1
 */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { ADMIN_NO } from '@constants/system.constant'

export enum SubsidyMode {
  MISAKA_NO_0 = 0, // 手动金额补贴
  MISAKA_NO_1 = 1, // 自动金额补贴
  MISAKA_NO_2 = 2, // 提现转入已发放
  MISAKA_NO_3 = 3, // 提现转入未发放
  MISAKA_NO_4 = 4, // 旧卡金额录入
  MISAKA_NO_5 = 5, // 纠错录入
  MISAKA_NO_6 = 6, // 补卡转入已发补贴
  MISAKA_NO_7 = 7, // 补卡转入未发补贴
  MISAKA_NO_8 = 8 // 银行app充值
}

export enum RechargeType {
  COWARD = 0, // 脱机
  HERO = 1 // 联机
}

export const enum IsCleanUp {
  FUCK_NOW = 1, // 清除
  NO_FUCK = 0 // 不清除
}

export const enum SubsidyStatus {
  WAIT = 0, // 未发送充值
  SENDED = 1, // 已发送充值
  SUCCESS = 2, // 充值成功
  FAIL = 3 // 充值失败
}

@Entity({
  name: 'xf_subsidy'
})
export class Assist {
  @PrimaryGeneratedColumn('increment', {
    name: 'xh'
  })
  id?: number

  @Column({
    name: 'sub_money',
    type: 'money',
    comment: '补贴金额(分)'
  })
  subAmount?: number

  @Column({
    name: 'sj',
    type: 'datetime',
    comment: '创建时间'
  })
  createdDate?: Date

  @Column({
    name: 'update_sj',
    type: 'datetime',
    comment: '修改时间'
  })
  updatedDate?: Date

  @Column({
    name: 'lx',
    type: 'int',
    default: SubsidyMode.MISAKA_NO_8,
    comment: '补贴方式'
  })
  subsidyMode?: SubsidyMode

  @Column({
    name: 'sub_state',
    type: 'int',
    default: SubsidyStatus.WAIT,
    comment: '补贴状态'
  })
  status?: SubsidyStatus

  @Column({
    name: 'sub_new',
    type: 'money',
    comment: '补贴余额（分)，不知道啥意思，咱也不敢问，再也不敢说，反正为0就行了',
    default: 0
  })
  subBalance?: number

  @Column({
    name: 'sub_del',
    type: 'int',
    comment: '是否清除之前的补贴；0不清，1清',
    default: IsCleanUp.NO_FUCK
  })
  isCleanUp?: IsCleanUp

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

  @Column({
    name: 'type',
    type: 'int',
    default: RechargeType.HERO,
    comment: '充值类型，0脱机，1联机'
  })
  rechargeType?: RechargeType

  @Column({
    name: 'sub_order',
    type: 'int',
    comment: '序号，当前人最大序号+1。。。'
  })
  order?: number

  @Column({
    name: 'user_serial',
    type: 'bigint',
    comment: '用户id'
  })
  userSerial?: number
}
