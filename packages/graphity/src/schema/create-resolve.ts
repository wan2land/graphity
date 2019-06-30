import { GraphQLFieldResolver } from "graphql"
import { GraphQLGuard, ResolverFactory } from "../interfaces/common"
import { executeResolver } from "./execute-resolver"


export function createResolve(
  guards: GraphQLGuard<any, any>[],
  ctor: any,
  method: (...args: any[]) => any,
  instances: Map<any, any>,
  create: ResolverFactory
): GraphQLFieldResolver<any, any> {
  return async (parent, args, ctx, info) => {
    let instance = instances.get(ctor)
    if (!instance) {
      instance = await create(ctor)
      instances.set(ctor, instance)
    }
    return await executeResolver(
      guards,
      method.bind(instance),
      parent,
      args,
      ctx,
      info
    )
  }
}
