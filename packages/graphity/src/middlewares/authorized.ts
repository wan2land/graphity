import { GraphityError } from '../errors/graphity-error'
import { UserIdentifier } from '../interfaces/auth'
import { MaybeArray, MaybePromise } from '../interfaces/common'
import { GraphityContext, Middleware, MiddlewareCarry, MiddlewareNext } from '../interfaces/graphity'

export function Authorized(
  roles?: MaybeArray<string>,
  handler?: (auth: { roles?: string[], user?: UserIdentifier }, resource: any) => MaybePromise<boolean>,
) {
  return class implements Middleware<null, GraphityContext> {
    public async handle({ context }: MiddlewareCarry<null, GraphityContext>, next: MiddlewareNext<null, GraphityContext>) {
      if (!context.auth || !context.auth.user) {
        throw new GraphityError('Access denied.', 'UNAUTHORIZED')
      }
      if (!roles) { // roles not defined, ignore
        const resource = await next()
        if (handler) {
          if (!await handler(context.auth, resource)) {
            throw new GraphityError('Access denied.', 'FORBIDDEN')
          }
        }
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
