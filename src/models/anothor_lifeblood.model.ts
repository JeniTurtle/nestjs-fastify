/**
 * 联机账户表
 * 想疯狂打人！！！！！！1
 */
import { Entity, Column, UpdateDateColumn } from 'typeorm'

@Entity({
  name: 'dt_ac_user'
})
export class AnotherLifeblood {
  @Column({
    primary: true,
    name: 'user_serial',
    type: 'bigint',
    comment: '用户id；这是主键。。。。'
  })
  userSerial?: number

  @Column({
    name: 'ac_money',
    type: 'money',
    comment: '账户总余额（分），现金+补贴'
  })
  totalBalance?: number

  @Column({
    name: 'ac_addo',
    type: 'money',
    comment: '现金总余额（分）'
  })
  moneyBalance?: number

  @Column({
    name: 'ac_subo',
    type: 'money',
    comment: '补贴总余额（分）'
  })
  subsidyBalance?: number

  @Column({
    name: 'ac_addm',
    type: 'money',
    comment: '累计现金充值余额（分）'
  })
  accAmont?: number

  @Column({
    name: 'ac_subm',
    type: 'money',
    comment: '累计补贴充值余额（分）'
  })
  accSubsidy?: number

  @UpdateDateColumn({
    name: 'sj',
    type: 'datetime',
    comment: '修改时间'
  })
  updatedDate?: Date
}
