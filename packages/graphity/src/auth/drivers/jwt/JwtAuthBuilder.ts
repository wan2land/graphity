import { JsonWebTokenError, Secret, sign, SignOptions, verify } from 'jsonwebtoken'

import { GraphityAuth, UserIdentifier } from '../../../interfaces/auth'
import { AuthBuilder } from '../../AuthBuilder'
import { JwtOptions } from './interfaces'


export abstract class JwtAuthBuilder extends AuthBuilder {

  constructor(
    public options: JwtOptions,
  ) {
    super()
  }

  createToken(user: UserIdentifier) {
    return this._sign({ id: user.id }, { expiresIn: '7d', audience: 'admin' })
  }

  buildAuth(accessToken: string | null): Promise<GraphityAuth> {
    if (!accessToken) {
      return Promise.resolve({
        roles: [],
      })
    }
    try {
      const user = this._verify<{ id: string | number }>(accessToken)
      return Promise.resolve({
        user,
        roles: [],
      })
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        //
      } else {
        console.log('error', e)
      }
    }
    return Promise.resolve({
      roles: [],
    })
  }

  _sign(payload: any, options: SignOptions = {}): string {
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

  _verify<T>(token: string): T {
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
    }) as any as T
  }
}
