import { GraphQLResolveInfo, GraphQLFieldResolver } from 'graphql'


export type ConstructType<T> = (new (...args: any[]) => T) | Function

export type MaybeArray<T> = T | T[]

export type ResolverFactory = (ctor: new (...args: any[]) => any) => Promise<any>

export type CreateResolveHandler = (ctor: ConstructType<any>, handler: (...args: any) => any) => GraphQLFieldResolver<any, any>

export type GraphQLGuard<TSource, TContext, TArgs = { [argName: string]: any }> = (
  parent: TSource,
  args: TArgs,
  ctx: TContext,
  info: GraphQLResolveInfo,
  next: GraphQLFieldResolver<TSource, TContext, TArgs>
) => any
