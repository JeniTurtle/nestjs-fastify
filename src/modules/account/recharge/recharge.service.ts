import { Logger } from 'winston'
import { Injectable, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ADMIN_NO } from '@constants/system.constant'
import { Repository, Transaction, TransactionRepository } from 'typeorm'
import { Strengthen, StrengthenStatus, RechargeMode, RechargeType as RechargeModelType } from '@models/strengthen.model'
import { Lifeblood } from '@models/lifeblood.model'
import { AnotherLifeblood } from '@models/anothor_lifeblood.model'
import { Naked, Mould, RecordType, Status, RecordSource } from '@models/naked.model'
import { Undisguised, RecordType as UndisRecordType } from '@models/undisguised.model'
import { Monster } from '@models/monster.model'
import { Assist, SubsidyMode, SubsidyStatus, IsCleanUp, RechargeType as AssistRechargeType } from '@models/assist.model'
import { BaseService, Service } from '@processors/base/base.service'
import { PlatformError } from '@exceptions/platform.error'
import { RechargeParamsDto, RechargeType } from './recharge.dto'
import { USER_ACCOUNT_NOT_FOUND_ERROR } from '@constants/error/recharge.constant'

/**
 * 注释是不可能写的，
 * 它不配拥有注释
 */
@Injectable()
export class RechargeService extends BaseService {
  constructor(
    @Inject('winston') private logger: Logger,
    @InjectRepository(Strengthen) private strengthenRepo: Repository<Strengthen>,
    @InjectRepository(Lifeblood) private lifebloodRepo: Repository<Lifeblood>,
    @InjectRepository(AnotherLifeblood) private anotherlifebloodRepo: Repository<AnotherLifeblood>,
    @InjectRepository(Naked) private nakedRepo: Repository<Naked>,
    @InjectRepository(Undisguised) private undisguisedRepo: Repository<Undisguised>,
    @InjectRepository(Monster) private monsterRepo: Repository<Monster>,
    @InjectRepository(Assist) private assistRepo: Repository<Assist>
  ) {
    super()
  }
  private strengthenService: Service<Strengthen>
  private lifebloodService: Service<Lifeblood>
  private anotherlifebloodService: Service<AnotherLifeblood>
  private nakedService: Service<Naked>
  private undisguisedService: Service<Undisguised>
  private monsterService: Service<Monster>
  private assistService: Service<Assist>

  @Transaction()
  async recharge(
    body: RechargeParamsDto,
    @TransactionRepository(Strengthen) strengthenRepo?: Repository<Strengthen>,
    @TransactionRepository(Lifeblood) lifebloodRepo?: Repository<Lifeblood>,
    @TransactionRepository(AnotherLifeblood) anotherlifebloodRepo?: Repository<AnotherLifeblood>,
    @TransactionRepository(Naked) nakedRepo?: Repository<Naked>,
    @TransactionRepository(Undisguised) undisguisedRepo?: Repository<Undisguised>,
    @TransactionRepository(Monster) monsterRepo?: Repository<Monster>,
    @TransactionRepository(Assist) assistRepo?: Repository<Assist>
  ) {
    this.strengthenService = this.getService(strengthenRepo || this.strengthenRepo)
    this.lifebloodService = this.getService(lifebloodRepo || this.lifebloodRepo)
    this.anotherlifebloodService = this.getService(
      anotherlifebloodRepo || this.anotherlifebloodRepo
    )
    this.nakedService = this.getService(nakedRepo || this.nakedRepo)
    this.undisguisedService = this.getService(undisguisedRepo || this.undisguisedRepo)
    this.monsterService = this.getService(monsterRepo || this.monsterRepo)
    this.assistService = this.getService(assistRepo || this.assistRepo)

    const [userinfo, lifeblood, anotherLifeblood] = await Promise.all([
      await this.monsterService.findOne({
        id: body.userId
      }),
      await this.lifebloodService.findOne({
        userSerial: body.userId
      }),
      await this.anotherlifebloodService.findOne({
        userSerial: body.userId
      })
    ])
    if (!lifeblood || !anotherLifeblood || !userinfo) {
      throw new PlatformError(USER_ACCOUNT_NOT_FOUND_ERROR)
    }
    try {
      switch (body.type) {
        case RechargeType.MONEY:
          return await this.rechargeMoney(body, userinfo, lifeblood, anotherLifeblood)
        case RechargeType.SUBSIDY:
          return await this.rechargeSubsidy(body, userinfo, lifeblood, anotherLifeblood)
        default:
      }
    } catch (err) {
      this.logger.error(err)
      throw err
    }
  }

  async rechargeMoney(
    { tranno, userId, amount }: RechargeParamsDto,
    userinfo: Monster,
    lifeblood: Lifeblood,
    anotherLifeblood: AnotherLifeblood
  ) {
    const rechargeAmount = amount * 100
    const totalBalance = (Number(lifeblood.totalBalance) || 0) + rechargeAmount
    const moneyBalance = (Number(lifeblood.moneyBalance) || 0) + rechargeAmount
    const accAmont = (Number(anotherLifeblood.accAmont) || 0) + rechargeAmount
    return await Promise.all([
      await this.strengthenService.create({
        tranno,
        commission: 0,
        createdDate: new Date(),
        updatedDate: new Date(),
        status: StrengthenStatus.SUCCESS,
        operatorCode: ADMIN_NO,
        userSerial: userId,
        rechargeType: RechargeModelType.HERO,
        rechargeMode: RechargeMode.PENTA_KILL,
        inputMoney: rechargeAmount,
        realMoney: rechargeAmount,
      }),
      await this.lifebloodService.update(
        {
          totalBalance,
          moneyBalance,
          updatedDate: new Date(),
        },
        { userSerial: userId }
      ),
      await this.anotherlifebloodService.update(
        {
          totalBalance,
          moneyBalance,
          accAmont,
          updatedDate: new Date(),
        },
        { userSerial: userId }
      ),
      await this.nakedService.create({
        tranno,
        recordNo: '0',
        devSerial: '0000000',
        samSerial: '0',
        devTimeNo: '0000000000000000',
        userTimeNo: '0000000000000000',
        subsidy: 0,
        preCopiesNum: 0,
        unitPrice: 0,
        depSerial: Number(userinfo.depNo),
        isDelete: 0,
        operatorCode: ADMIN_NO,
        amountReceivable: 0,
        discountRate: 100,
        createdDate: new Date(),
        updatedDate: new Date(),
        mould: Mould.SWIM,
        status: Status.GENUINE,
        amount: rechargeAmount,
        modifyCount: lifeblood.modifyCount,
        recordSource: RecordSource.TONY,
        recordType: RecordType.SABER_NO_61,
        userSerial: userId,
        copiesNum: lifeblood.totalCopies,
        preSubsidyBalance: lifeblood.subsidyBalance,
        preTotalBalance: lifeblood.totalBalance
      }),
      await this.undisguisedService.create({
        tranno,
        rechargeAmount,
        subsidy: 0,
        retardedField: 0,
        withdrawAmount: 0,
        withdrawCount: 0,
        eachAmount: 0,
        zeroAmount: 0,
        zeroCount: 0,
        editAmount: 0,
        editCount: 0,
        recordNo: '0',
        devSerial: '0000000',
        devTimeNo: '0000000000000000',
        userTimeNo: '0000000000000000',
        userSerial: userId,
        recordTime: new Date(),
        createdDate: new Date(),
        updatedDate: new Date(),
        depSerial: Number(userinfo.depNo),
        operatorCode: ADMIN_NO,
        modifyCount: lifeblood.modifyCount,
        recordType: UndisRecordType.SABER_NO_61,
        preSubsidyBalance: lifeblood.subsidyBalance,
        preRechargeAmount: anotherLifeblood.moneyBalance,
        preTotalBalance: lifeblood.totalBalance
      })
    ])
  }

  async rechargeSubsidy(
    { tranno, userId, amount }: RechargeParamsDto,
    userinfo: Monster,
    lifeblood: Lifeblood,
    anotherLifeblood: AnotherLifeblood
  ) {
    const rechargeAmount = amount * 100
    const totalBalance = (Number(lifeblood.totalBalance) || 0) + rechargeAmount
    const subsidyBalance = (Number(lifeblood.subsidyBalance) || 0) + rechargeAmount
    const accSubsidy = (Number(anotherLifeblood.accSubsidy) || 0) + rechargeAmount
    const maxOrderAssist = await this.assistService.find({
      limit: 1,
      where: { userSerial: userId },
      orderBy: 'order_desc'
    })
    const order = maxOrderAssist.length > 0 ? Number(maxOrderAssist[0].order) + 1 : 1
    const newAssist = await this.assistService.create({
      order,
      tranno,
      subBalance: 0,
      createdDate: new Date(),
      updatedDate: new Date(),
      rechargeType: AssistRechargeType.HERO,
      subAmount: rechargeAmount,
      operatorCode: ADMIN_NO,
      userSerial: userId,
      isCleanUp: IsCleanUp.NO_FUCK,
      status: SubsidyStatus.SUCCESS,
      subsidyMode: SubsidyMode.MISAKA_NO_8,
    });
    return await Promise.all([
      await this.lifebloodService.update(
        {
          totalBalance,
          subsidyBalance,
          updatedDate: new Date(),
        },
        { userSerial: userId }
      ),
      await this.anotherlifebloodService.update(
        {
          totalBalance,
          subsidyBalance,
          accSubsidy,
          updatedDate: new Date(),
        },
        { userSerial: userId }
      ),
      await this.nakedService.create({
        tranno,
        recordNo: '0',
        devSerial: '0000000',
        samSerial: '0',
        devTimeNo: '0000000000000000',
        userTimeNo: '0000000000000000',
        preCopiesNum: 0,
        unitPrice: 0,
        depSerial: Number(userinfo.depNo),
        isDelete: 0,
        operatorCode: ADMIN_NO,
        amountReceivable: 0,
        discountRate: 100,
        createdDate: new Date(),
        updatedDate: new Date(),
        mould: Mould.SWIM,
        status: Status.GENUINE,
        amount: 0,
        assistId: newAssist.id,
        subsidy: rechargeAmount,
        modifyCount: lifeblood.modifyCount,
        recordSource: RecordSource.TONY,
        recordType: RecordType.SABER_NO_61,
        userSerial: userId,
        copiesNum: lifeblood.totalCopies,
        preSubsidyBalance: lifeblood.subsidyBalance,
        preTotalBalance: lifeblood.totalBalance
      }),
      await this.undisguisedService.create({
        tranno,
        rechargeAmount: 0,
        retardedField: 0,
        withdrawAmount: 0,
        withdrawCount: 0,
        eachAmount: 0,
        zeroAmount: 0,
        zeroCount: 0,
        editAmount: 0,
        editCount: 0,
        recordNo: '0',
        devSerial: '0000000',
        devTimeNo: '0000000000000000',
        userTimeNo: '0000000000000000',
        userSerial: userId,
        recordTime: new Date(),
        createdDate: new Date(),
        updatedDate: new Date(),
        depSerial: Number(userinfo.depNo),
        subsidy: rechargeAmount,
        operatorCode: ADMIN_NO,
        modifyCount: lifeblood.modifyCount,
        recordType: UndisRecordType.SABER_NO_61,
        preSubsidyBalance: lifeblood.subsidyBalance,
        preRechargeAmount: anotherLifeblood.moneyBalance,
        preTotalBalance: lifeblood.totalBalance
      })
    ])
  }
}
