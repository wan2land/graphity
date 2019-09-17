import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'

import { GraphQLGuard } from '../interfaces/common'


function execute<TArgs, TContext>(
  guards: GraphQLGuard<any, any>[],
  resolver: GraphQLFieldResolver<any, any>,
  parent: any,
  args: TArgs,
  ctx: TContext,
  info: GraphQLResolveInfo
): any {
  if (guards.length > 0) {
    const firstGuard = guards[0]
    const nextGuards = guards.slice(1)
    return firstGuard(parent, args, ctx, info, (nextParent, nextArgs, nextCtx, nextInfo) => {
      return execute(
        nextGuards,
        resolver,
        typeof nextParent === 'undefined' ? parent : nextParent,
        typeof nextArgs === 'undefined' ? args : nextArgs,
        typeof nextCtx === 'undefined' ? ctx : nextCtx,
        typeof nextInfo === 'undefined' ? info : nextInfo
      )
    })
  }
  return resolver(parent, args, ctx, info)
}

export function executeResolver(
  guards: GraphQLGuard<any, any>[],
  resolver: GraphQLFieldResolver<any, any>,
  parent: any,
  args: any,
  ctx: any,
  info: GraphQLResolveInfo
): any {
  return execute(guards, resolver, parent, args, ctx, info)
}
