import { JsonWebTokenError } from 'jsonwebtoken'

import { GraphityAuth, UserIdentifier, UserProvider } from '../interfaces/auth'
import { AuthBuilder, HttpRequest } from '../interfaces/graphity'
import { Jwt } from './jwt'


export class JwtAuthBuilder implements AuthBuilder {

  public constructor(
    public jwt: Jwt,
    public userProvider: UserProvider,
  ) {
  }

  public createToken(user: UserIdentifier) {
    return this.jwt.sign({ id: user.id }, { expiresIn: '7d', audience: 'admin' })
  }

  public buildAuth(request: HttpRequest): Promise<GraphityAuth | undefined> {
    const authorization = request.headers.authorization
    if (authorization) {
      try {
        const [_, token] = authorization.split(/^bearer\s+/i)
        const { id } = this.jwt.verify<{ id: string | number }>(token || '')
        return Promise.resolve(this.userProvider.findUser(id)).then(user => Promise.resolve(user && {
          user,
          roles: this.userProvider.getRoles(user),
        } || undefined))
      } catch (e) {
        if (e instanceof JsonWebTokenError) {
          //
        } else {
          console.log('error', e)
        }
      }
    }
    return Promise.resolve(undefined)
  }
}
