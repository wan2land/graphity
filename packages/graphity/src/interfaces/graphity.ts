import { Container } from '@graphity/container'
import { GraphQLResolveInfo } from 'graphql'
import { IncomingHttpHeaders } from 'http'

import { ConstructType, MaybePromise } from './common'

export interface HttpRequest {
  method: string
  url?: string
  headers: IncomingHttpHeaders
}

export interface GraphityOptions<TContext> {
  resolvers?: ConstructType<any>[]
  commonMiddlewares?: ConstructType<Middleware>[]
  commonQueryMiddlewares?: ConstructType<Middleware>[]
  commonMutationMiddlewares?: ConstructType<Middleware>[]
  contextBuilder?: ConstructType<ContextBuilder<TContext>>
}

export interface MiddlewareCarry<TSource = any, TContext = any, TArgs = Record<string, any>> {
  parent: TSource
  args: TArgs
  context: TContext
  info: GraphQLResolveInfo
}

export type MiddlewareNext<TSource = any, TContext = any, TArgs = Record<string, any>> = (nextCarry?: Partial<MiddlewareCarry<TSource, TContext, TArgs>>) => any

export interface Middleware<TSource = any, TContext = any, TArgs = Record<string, any>> {
  handle(carry: MiddlewareCarry<TSource, TContext, TArgs>, next: MiddlewareNext<TSource, TContext, TArgs>): MaybePromise<any>
}

export interface ContextBuilder<TAuth = any> {
  buildContext(request: HttpRequest): Promise<GraphityContext<TAuth>>
}

export interface AuthBuilder<TAuth = any> {
  buildAuth(request: HttpRequest): TAuth
}

export interface GraphityContext<TAuth = any> {
  request: HttpRequest
  container: Container
  auth?: TAuth
  [name: string]: any
}
