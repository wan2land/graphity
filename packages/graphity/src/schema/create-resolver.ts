import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'

import { GraphQLGuard } from '../interfaces/common'

function executeResolver<TSource, TContext, TArgs = { [argName: string]: any }>(
  parent: TSource,
  args: TArgs,
  ctx: TContext,
  info: GraphQLResolveInfo,
  guards: GraphQLGuard<TSource, TContext, TArgs>[],
  resolve: GraphQLFieldResolver<TSource, TContext, TArgs>,
): any {
  if (guards.length > 0) {
    const firstGuard = guards[0]
    const nextGuards = guards.slice(1)
    return firstGuard(parent, args, ctx, info, (nextParent, nextArgs, nextCtx, nextInfo) => {
      return executeResolver(
        typeof nextParent === 'undefined' ? parent : nextParent,
        typeof nextArgs === 'undefined' ? args : nextArgs,
        typeof nextCtx === 'undefined' ? ctx : nextCtx,
        typeof nextInfo === 'undefined' ? info : nextInfo,
        nextGuards,
        resolve,
      )
    })
  }
  return resolve ? resolve(parent, args, ctx, info) : parent
}

export function createResolver<TSource, TContext, TArgs = { [argName: string]: any }>(
  guards: GraphQLGuard<TSource, TContext, TArgs>[],
  resolve: GraphQLFieldResolver<TSource, TContext, TArgs>
): GraphQLFieldResolver<TSource, TContext, TArgs> {
  if (guards.length === 0) {
    return resolve
  }
  return (parent, args, ctx, info) => {
    return executeResolver(
      parent,
      args,
      ctx,
      info,
      guards,
      resolve,
    )
  }
}
