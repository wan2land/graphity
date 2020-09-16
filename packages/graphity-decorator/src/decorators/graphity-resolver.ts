import { GraphQLObjectType } from 'graphql'

import { MiddlewareConstructor } from '../interfaces/middleware'
import { MetadataStorage } from '../metadata/storage'

export interface GraphityResolverParams {
  middlewares?: MiddlewareConstructor | MiddlewareConstructor[]
  metadataStorage?: MetadataStorage
}

export function GraphityResolver(typeFactory: () => GraphQLObjectType | Function, params: GraphityResolverParams = {}): ClassDecorator {
  const metadataResolvers = (params.metadataStorage ?? MetadataStorage.getGlobalStorage()).resolvers

  return (target) => {
    const middleware = params.middlewares ?? []
    metadataResolvers.set(target, {
      target,
      typeFactory,
      middlewares: Array.isArray(middleware) ? middleware : [middleware],
    })
  }
}
