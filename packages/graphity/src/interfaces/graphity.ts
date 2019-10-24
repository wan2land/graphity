import { GraphQLResolveInfo } from 'graphql'

import { ConstructType, MaybePromise } from './common'


export interface GraphityOptions {
  entries: ConstructType<any>[]
  commonMiddlewares: ConstructType<Middleware>[]
  commonQueryMiddlewares: ConstructType<Middleware>[]
  commonMutationMiddlewares: ConstructType<Middleware>[]
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
