import { GraphQLResolveInfo } from "graphql"


export type ConstructType<P> = {new (...args: any[]): P} | Function // tslint:disable-line

export type GraphQLNext = <TArgs, TContext>(
  parent: any,
  args: TArgs,
  ctx: TContext,
  info: GraphQLResolveInfo
) => any

export type GraphQLGuard = <TArgs, TContext>(
  parent: any,
  args: TArgs,
  ctx: TContext,
  info: GraphQLResolveInfo,
  next: GraphQLNext
) => any
