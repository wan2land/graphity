import { GraphQLResolveInfo } from "graphql"


export type ConstructType<P> = (new (...args: any[]) => P) | Function

export type MaybeArray<P> = P | P[]

export type ResolverFactory = (ctor: new (...args: any[]) => any) => Promise<any>

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
