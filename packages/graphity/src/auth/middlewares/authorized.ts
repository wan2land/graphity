import { Middleware, MiddlewareCarry, MiddlewareClass, MiddlewareNext } from '@graphity/schema'

import { GraphityError } from '../../errors/graphity-error'
import { GraphityAuth } from '../../interfaces/auth'
import { GraphityContext } from '../../interfaces/graphity'

export function Authorized<TRole extends string>(
  roles?: TRole | TRole[],
  handler?: (auth: GraphityAuth, resource: any) => boolean | Promise<boolean>,
): MiddlewareClass {
  return class implements Middleware<null, GraphityContext> {
    async handle({ context }: MiddlewareCarry<null, GraphityContext>, next: MiddlewareNext<null, GraphityContext>) {
      if (!context.$auth || !context.$auth.user) {
        throw new GraphityError('Access denied.', 'UNAUTHORIZED')
      }
      if (!roles) { // roles not defined, ignore
        const resource = await next()
        if (handler) {
          if (!await handler(context.$auth, resource)) {
            throw new GraphityError('Access denied.', 'FORBIDDEN')
          }
        }
      }
      for (const role of !roles ? [] : Array.isArray(roles) ? roles : [roles]) {
        if (context.$auth.roles.includes(role)) {
          const resource = await next()
          if (handler) {
            if (!await handler(context.$auth, resource)) {
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
