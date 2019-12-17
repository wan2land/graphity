import { Container } from '@graphity/container'
import { GraphQLResolveInfo } from 'graphql'
import { IncomingHttpHeaders } from 'http'

import { GraphityAuth } from './auth'
import { ConstructType, MaybePromise } from './common'

export interface HttpRequest {
  method: string
  url?: string
  headers: IncomingHttpHeaders
}

export interface GraphityOptions {
  resolvers?: ConstructType<any>[]
  commonMiddlewares?: ConstructType<Middleware>[]
  commonQueryMiddlewares?: ConstructType<Middleware>[]
  commonMutationMiddlewares?: ConstructType<Middleware>[]
  contextBuilder?: ConstructType<ContextBuilder>
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

export interface ContextBuilder {
  buildContext(request: HttpRequest): Promise<GraphityContext>
}

export interface AuthBuilder {
  buildAuth(request: HttpRequest): Promise<GraphityAuth | undefined>
}

export interface GraphityContext {
  request: HttpRequest
  container: Container
  auth?: GraphityAuth
  [name: string]: any
}
