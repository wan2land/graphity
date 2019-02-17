import { GraphQLFieldResolver } from "graphql"
import { GraphQLGuard } from "../interfaces/common"
import { executeResolver } from "./execute-resolver"


export function createResolve(
  guards: GraphQLGuard[],
  instance: any,
  method: string | symbol): GraphQLFieldResolver<any, any> {
  return (parent, args, ctx, info) => {
    return executeResolver(
      guards,
      instance[method].bind(instance),
      parent,
      args,
      ctx,
      info
    )
  }
}
