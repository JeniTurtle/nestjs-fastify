/**
 * 现金充值记录表
 * 想疯狂打人！！！！！！1
 */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ADMIN_NO } from '@constants/system.constant'

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
  name: 'xf_addmoney'
})
export class Strengthen {
  @PrimaryGeneratedColumn('increment', {
    name: 'xh'
  })
  id?: number

  @Column({
    name: 'input_money',
    type: 'money',
    comment: '输入金额(分)'
  })
  inputMoney?: number

  @Column({
    name: 'add_money',
    type: 'money',
    comment: '实际金额(分)'
  })
  realMoney?: number

  @Column({
    name: 'gly_money',
    type: 'money',
    default: 0,
    nullable: true,
    comment: '管理费？手续费？(分)'
  })
  commission?: number

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
    name: 'add_state',
    type: 'int',
    default: StrengthenStatus.SUCCESS,
    comment: '充值状态'
  })
  status?: StrengthenStatus

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
    name: 'lx',
    type: 'int',
    default: RechargeMode.PENTA_KILL,
    comment: '充值方式'
  })
  rechargeMode?: RechargeMode

  @Column({
    name: 'type',
    type: 'int',
    default: RechargeType.HERO,
    comment: '充值类型，0脱机，1联机'
  })
  rechargeType?: RechargeType

  @Column({
    type: 'varchar',
    length: 50,
    comment: '交易流水号'
  })
  tranno?: string

  @Column({
    name: 'user_serial',
    type: 'bigint',
    comment: '用户id'
  })
  userSerial?: number

  // @Column({
  //   name: 'bank_id',
  //   type: 'int',
  //   comment: '银行id'
  // })
  // bankId?: number;

  // @Column({
  //   name: 'recharge_user',
  //   type: 'int',
  //   comment: '充值人id'
  // })
  // recharge_user?: number;
}
