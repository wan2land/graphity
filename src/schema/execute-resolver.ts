import { GraphQLResolveInfo } from "graphql"
import { GraphQLGuard, GraphQLNext } from "../interfaces/common"


export function executeResolver(
  guards: GraphQLGuard[],
  resolver: GraphQLNext,
  parent: any,
  args: any,
  ctx: any,
  info: GraphQLResolveInfo
): any {
  return execute(guards, resolver, parent, args, ctx, info)
}

function execute<TArgs, TContext>(
  guards: GraphQLGuard[],
  resolver: GraphQLNext,
  parent: any,
  args: TArgs,
  ctx: TContext,
  info: GraphQLResolveInfo
): any {
  if (guards.length) {
    const firstGuard = guards[0]
    const nextGuards = guards.slice(1)
    return firstGuard(parent, args, ctx, info, (nextParent, nextArgs, nextCtx, nextInfo) => {
      return execute(
        nextGuards,
        resolver,
        typeof nextParent === "undefined" ? parent : nextParent,
        typeof nextArgs === "undefined" ? args : nextArgs,
        typeof nextCtx === "undefined" ? ctx : nextCtx,
        typeof nextInfo === "undefined" ? info : nextInfo
      )
    })
  }
  return resolver(parent, args, ctx, info)
}
