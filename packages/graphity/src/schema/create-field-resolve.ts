import { GraphQLFieldResolver } from 'graphql'

import { GraphQLGuard } from '../interfaces/common'
import { executeResolver } from './execute-resolver'


export function createFieldResolve(property: string, guards: GraphQLGuard<any, any>[]): GraphQLFieldResolver<any, any> {
  return (parent, args, ctx, info) => {
    return executeResolver(
      guards,
      (parent) => parent[property],
      parent,
      args,
      ctx,
      info
    )
  }
}
