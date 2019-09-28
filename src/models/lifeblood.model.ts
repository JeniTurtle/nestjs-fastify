/**
 * 联机账户表
 * 想疯狂打人！！！！！！1
 */
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'

@Entity({
  name: 'dt_ac_link'
})
export class Lifeblood {
  @PrimaryGeneratedColumn('increment', {
    name: 'xh'
  })
  id?: number

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
    name: 'ac_eacho',
    type: 'int',
    comment: '账户份数余额'
  })
  totalCopies?: number

  @VersionColumn({
    name: 'jl_count',
    type: 'int',
    comment: '修改次数'
  })
  modifyCount?: number

  @UpdateDateColumn({
    name: 'sj',
    type: 'datetime',
    comment: '修改时间'
  })
  updatedDate?: Date

  @Column({
    name: 'user_serial',
    type: 'bigint',
    comment: '用户id'
  })
  userSerial?: number
}
