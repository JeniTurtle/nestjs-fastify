/**
 * 现金充值记录表
 * 想疯狂打人！！！！！！1
 */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

export const enum StrengthenStatus {
  WAIT = 0, // 未发送充值
  SENDED = 1, // 已发送充值
  SUCCESS = 2, // 充值成功
  FAIL = 3 // 充值失败
}

export enum RechargeMode {
  ONE_BOOLD = 0, // 软件读卡充值
  DOUBLE_KILL = 1, // 充值名单充值
  TRIPLE_KILL = 2, // 提现现金充值
  QUADRA_KILL = 3, // 补卡充值
  PENTA_KILL = 4 // 银行充值
}

export enum RechargeType {
  COWARD = 0, // 脱机
  HERO = 1 // 联机
}

@Entity({
  name: 'dt_user'
})
export class Monster {
  @PrimaryGeneratedColumn('increment', {
    name: 'user_serial',
    type: 'bigint',
  })
  id?: number

  @Column({
    name: 'user_no',
    type: 'varchar',
    comment: '用户编号'
  })
  userNo?: number

  @Column({
    name: 'dep_no',
    type: 'varchar',
    comment: 'string'
  })
  depNo?: string

  @Column({
    name: 'user_lname',
    type: 'varchar',
    comment: '用户名'
  })
  username?: string
}
