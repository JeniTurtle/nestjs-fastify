import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RechargeController } from '@modules/account/recharge/recharge.controller'
import { RechargeService } from '@modules/account/recharge/recharge.service'
import { Strengthen } from '@models/strengthen.model'
import { Lifeblood } from '@models/lifeblood.model'
import { AnotherLifeblood } from '@models/anothor_lifeblood.model'
import { Naked } from '@models/naked.model'
import { Undisguised } from '@models/undisguised.model'
import { Monster } from '@models/monster.model'
import { Assist } from '@models/assist.model'

@Module({
  imports: [
    TypeOrmModule.forFeature([Strengthen, Lifeblood, Naked, Undisguised, AnotherLifeblood, Monster, Assist])
  ],
  controllers: [RechargeController],
  providers: [RechargeService]
})
export class RechargeModule { }
