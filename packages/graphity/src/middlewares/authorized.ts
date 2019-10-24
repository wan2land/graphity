import { GraphityError } from '../errors/graphity-error'
import { GraphQLAuthContext } from '../interfaces/auth'
import { MaybeArray, MaybePromise } from '../interfaces/common'
import { Middleware, MiddlewareCarry, MiddlewareNext } from '../interfaces/graphity'

export function Authorized<TAuthUser = any, TRole = string>(
  roles?: MaybeArray<TRole>,
  handler?: (auth: { roles: TRole[], user?: TAuthUser }, resource: any) => MaybePromise<boolean>,
) {
  return class implements Middleware<null, GraphQLAuthContext<TAuthUser, TRole>> {
    public async handle({ context }: MiddlewareCarry<null, GraphQLAuthContext<TAuthUser, TRole>>, next: MiddlewareNext<null, GraphQLAuthContext<TAuthUser, TRole>>) {
      if (!context.auth || !context.auth.user) {
        throw new GraphityError('Access denied.', 'UNAUTHORIZED')
      }
      for (const role of !roles ? [] : Array.isArray(roles) ? roles : [roles]) {
        if (context.auth.roles.includes(role)) {
          const resource = await next()
          if (handler) {
            if (!await handler(context.auth, resource)) {
              throw new GraphityError('Access denied.', 'FORBIDDEN')
            }
          }
          return resource
        }
      }
      throw new GraphityError('Access denied.', 'FORBIDDEN')
    }
  }
}
