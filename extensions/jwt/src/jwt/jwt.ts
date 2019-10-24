import { Secret, sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken'

import { JwtOptions } from '../interfaces/jwt'

export class Jwt {

  public constructor(public options: JwtOptions) {
  }

  public sign(payload: any, options: SignOptions = {}): string {
    let secretOrPrivKey: Secret = ''
    switch (this.options.algorithm) {
      case 'HS256':
      case 'HS384':
      case 'HS512':
        secretOrPrivKey = this.options.secret
        break
      case 'RS256':
      case 'RS384':
      case 'RS512':
        secretOrPrivKey = this.options.privateKey
        break
    }
    return sign(payload, secretOrPrivKey, {
      algorithm: this.options.algorithm,
      ...options,
    })
  }

  public verify<T>(token: string, options: VerifyOptions = {}): T {
    let secretOrPubKey: string | Buffer = ''
    switch (this.options.algorithm) {
      case 'HS256':
      case 'HS384':
      case 'HS512':
        secretOrPubKey = this.options.secret
        break
      case 'RS256':
      case 'RS384':
      case 'RS512':
        secretOrPubKey = this.options.publicKey
        break
    }
    return verify(token, secretOrPubKey, {
      algorithms: [this.options.algorithm],
      ...options,
    }) as any as T
  }
}
