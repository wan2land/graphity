import { ContextFactory, GraphQLAuthContext, HttpRequest, Inject, JwtUser } from 'graphity'
import { JsonWebTokenError } from 'jsonwebtoken'

import { Jwt } from './jwt'

export class JwtContextFactory extends ContextFactory {

  public constructor(
    @Inject(Jwt) public jwt: Jwt,
  ) {
    super()
  }

  public factory(request: HttpRequest): Promise<GraphQLAuthContext> {
    try {
      const authorization = request.headers.authorization || ''
      if (authorization) {
        const [_, token] = authorization.split(/^bearer\s+/i)
        const user = this.jwt.verify<JwtUser>(token || '')

        // TODO User Provider..

        return Promise.resolve({
          request,
          auth: {
            user,
            roles: [],
          },
        })
      }
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        //
      } else {
        console.log('error', e)
      }
    }
    return Promise.resolve({
      request,
      auth: {
        roles: [],
      },
    })
  }
}
