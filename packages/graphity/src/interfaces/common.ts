import { GraphQLResolveInfo, GraphQLFieldResolver } from 'graphql'


export type ConstructType<T> = (new (...args: any[]) => T) | Function

export type MaybeArray<T> = T | T[]

export type ResolverFactory = (ctor: new (...args: any[]) => any) => Promise<any>

export type CreateResolveHandler = (ctor: ConstructType<any>, handler: (...args: any) => any, guards: GraphQLGuard<any, any>[]) => GraphQLFieldResolver<any, any>

export type GraphQLNext<TArgs, TContext> = (
  parent: any,
  args: TArgs,
  ctx: TContext,
  info: GraphQLResolveInfo
) => any

export type GraphQLGuard<TArgs, TContext> = (
  parent: any,
  args: TArgs,
  ctx: TContext,
  info: GraphQLResolveInfo,
  next: GraphQLNext<TArgs, TContext>
) => any
