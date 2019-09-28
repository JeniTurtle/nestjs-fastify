import { RsaService } from './crypto.serivce'

test('ras加密解密', () => {
  const service = new RsaService()
  const { privateKey, publicKey } = service.genSecretKeys()
  const str = 'fuck!!!哟哟哟！！'
  const exec = () => {
    const encodeStr = service.priKeyEncrypt(privateKey, str)
    return service.pubKeyDecrypt(publicKey, encodeStr)
  }
  expect(exec()).toBe(str)
})
