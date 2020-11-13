import { GraphQLObjectType } from 'graphql'

import { EntityFactory } from '../interfaces/metadata'
import { MiddlewareConstructor } from '../interfaces/middleware'
import { MetadataStorage } from '../metadata/storage'

export interface GraphityResolverParams {
  middlewares?: MiddlewareConstructor | MiddlewareConstructor[]
  metadataStorage?: MetadataStorage
}

export function GraphityResolver(typeFactory: EntityFactory, params: GraphityResolverParams = {}): ClassDecorator {
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
