import { isInputObjectType, GraphQLFieldConfigArgumentMap, GraphQLOutputType } from 'graphql'

import { MiddlewareConstructor } from '../interfaces/middleware'
import { MetadataStorage } from '../metadata/storage'

const DEFAULT_RETURNS = (node: GraphQLOutputType) => node

export interface QueryParams {
  name?: string
  parent?: ((type: null) => GraphQLOutputType | Function)
  input?: GraphQLFieldConfigArgumentMap
  middlewares?: MiddlewareConstructor | MiddlewareConstructor[]
  returns?: (type: GraphQLOutputType) => GraphQLOutputType | Function
  description?: string
  deprecated?: string
  metadataStorage?: MetadataStorage
}

export function Query(params: QueryParams = {}): MethodDecorator {
  const metadataQueries = (params.metadataStorage ?? MetadataStorage.getGlobalStorage()).resolverQueries
  return (target, property) => {
    let resolves = metadataQueries.get(target.constructor)
    if (!resolves) {
      resolves = []
      metadataQueries.set(target.constructor, resolves)
    }
    const middleware = params.middlewares ?? []
    const input = params.input
    resolves.push({
      target: target.constructor,
      property,
      parent: params.parent ?? null,
      name: params.name ?? (typeof property === 'string' ? property : property.toString()),
      input: (isInputObjectType(input) ? input.getFields() : input) ?? null,
      middlewares: Array.isArray(middleware) ? middleware : [middleware],
      returns: params.returns ?? DEFAULT_RETURNS,
      description: params.description ?? null,
      deprecated: params.deprecated ?? null,
    })
  }
}
