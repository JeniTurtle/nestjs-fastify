import { Injectable } from '@nestjs/common'
import * as NodeRSA from 'node-rsa'
import * as CryptoJS from 'crypto-js'

export interface ISecretKeys {
  publicKey: string
  privateKey: string
}

@Injectable()
export class RsaService {
  private rsaMap: Map<string, any> = new Map()

  private _pkcsType: string = 'pkcs1'

  private _pkcsSize: number = 128

  /**
   * 设置加密类型
   * @param pkcsType
   */
  setPkcsType(pkcsType: string): RsaService {
    this._pkcsType = pkcsType
    return this
  }

  /**
   * 设置密钥长度
   * @param pkcsSize
   */
  setPkcsSize(pkcsSize: number): RsaService {
    this._pkcsSize = pkcsSize
    return this
  }

  /**
   * 创建rsa实例，并缓存
   */
  private getInstance(isNew?: boolean) {
    if (isNew) {
      return new NodeRSA({ b: this._pkcsSize })
    }
    const key = `${this._pkcsType}_${this._pkcsSize}` // 创建RSA对象，并指定秘钥长度
    if (!this.rsaMap.has(key)) {
      const rsa = new NodeRSA({ b: this._pkcsSize })
      rsa.setOptions({ encryptionScheme: this._pkcsType }) // 指定加密格式
      this.rsaMap.set(key, rsa)
    }
    return this.rsaMap.get(key)
  }

  /**
   * 生成公钥、私钥
   */
  public genSecretKeys(isNew: boolean = true): ISecretKeys {
    const rsa = this.getInstance(isNew)
    return {
      publicKey: rsa.exportKey(`${this._pkcsType}-public-pem`),
      privateKey: rsa.exportKey(`${this._pkcsType}-private-pem`)
    }
  }

  /**
   * 私钥加密
   * @param priKey
   * @param data
   */
  public priKeyEncrypt(priKey: string, data: string): string {
    const rsa = this.getInstance()
    rsa.importKey(priKey)
    return rsa.encryptPrivate(data, 'base64', 'utf8')
  }

  /**
   * 公钥解密
   * @param pubKey
   * @param data
   */
  public pubKeyDecrypt(pubKey: string, data: string): string {
    const rsa = this.getInstance()
    rsa.importKey(pubKey)
    return rsa.decryptPublic(data, 'utf8')
  }
}

@Injectable()
export class CryptoService {
  keyStr = 'k;)*(+nmjdsf$#@d'

  encrypt(word) {
    const key = CryptoJS.enc.Utf8.parse(this.keyStr)
    const srcs = CryptoJS.enc.Utf8.parse(word)
    return CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString()
  }

  decrypt(word) {
    const key = CryptoJS.enc.Utf8.parse(this.keyStr)
    return CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8)
  }
}
