import { GraphQLResolveInfo } from 'graphql'
import { IncomingHttpHeaders } from 'http'

import { ConstructType, MaybePromise } from './common'


export interface GraphityOptions {
  entries: ConstructType<any>[]
  commonMiddlewares: ConstructType<Middleware>[]
  commonQueryMiddlewares: ConstructType<Middleware>[]
  commonMutationMiddlewares: ConstructType<Middleware>[]
}

export interface HttpRequest {
  method: string
  url?: string
  headers: IncomingHttpHeaders
}

export interface GraphQLContext<TAuthUser = any, TAuthRole = string> {
  auth: {
    user?: TAuthUser,
    roles: TAuthRole[],
  }
  request: HttpRequest
}

export interface MiddlewareCarry<TSource = any, TContext = any, TArgs = Record<string, any>> {
  parent: TSource
  args: TArgs
  context: TContext
  info: GraphQLResolveInfo
}

export type MiddlewareNext<TSource = any, TContext = any, TArgs = Record<string, any>> = (nextCarry: Partial<MiddlewareCarry<TSource, TContext, TArgs>>) => any

export interface Middleware<TSource = any, TContext = any, TArgs = Record<string, any>> {
  handle(carry: MiddlewareCarry<TSource, TContext, TArgs>, next: MiddlewareNext<TSource, TContext, TArgs>): MaybePromise<any>
}
