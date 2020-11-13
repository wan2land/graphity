import { isInputObjectType, GraphQLFieldConfigArgumentMap, GraphQLOutputType } from 'graphql'

import { EntityFactory } from '../interfaces/metadata'
import { MiddlewareConstructor } from '../interfaces/middleware'
import { MetadataStorage } from '../metadata/storage'

const DEFAULT_RETURNS = (node: GraphQLOutputType) => node

export interface MutationParams {
  name?: string
  parent?: EntityFactory
  input?: GraphQLFieldConfigArgumentMap
  middlewares?: MiddlewareConstructor | MiddlewareConstructor[]
  returns?: (type: GraphQLOutputType) => GraphQLOutputType | Function
  description?: string
  deprecated?: string
  metadataStorage?: MetadataStorage
}

export function Mutation(params: MutationParams = {}): MethodDecorator {
  const metadataMutations = (params.metadataStorage ?? MetadataStorage.getGlobalStorage()).resolverMutations
  return (target, property) => {
    let resolves = metadataMutations.get(target.constructor)
    if (!resolves) {
      resolves = []
      metadataMutations.set(target.constructor, resolves)
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
