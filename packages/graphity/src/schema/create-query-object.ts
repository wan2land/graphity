import { GraphQLObjectType, GraphQLString, isOutputType } from 'graphql'

import { ConstructType, CreateResolveHandler, GraphQLGuard } from '../interfaces/common'
import { MetadataQueries, MetadataResolvers } from '../metadata'
import { entityToGraphQLObjectType } from './entity-to-graphql-object-type'
import { createResolver } from './create-resolver'

function getObjectType(container: Map<ConstructType<any>, GraphQLObjectType>, entity: ConstructType<any>): GraphQLObjectType {
  let type = container.get(entity)
  if (!type) {
    type = entityToGraphQLObjectType(entity)
    container.set(entity, type)
  }
  return type
}

export interface CreateQueryObjectOptions {
  name?: string
  container?: Map<ConstructType<any>, GraphQLObjectType>
  resolvers?: ConstructType<any>[]
  rootGuards?: GraphQLGuard<any, any>[]
  queryGuards?: GraphQLGuard<any, any>[]
  create: CreateResolveHandler
}

export function createQueryObject({
  name = 'Query',
  container = new Map(),
  resolvers = [],
  rootGuards = [],
  queryGuards = [],
  create,
}: CreateQueryObjectOptions): GraphQLObjectType {

  const queryObjectType = new GraphQLObjectType({
    name,
    fields: {},
  })

  for (const resolver of resolvers) {
    const metadataResolver = MetadataResolvers.get(resolver)
    if (!metadataResolver) {
      continue
    }

    const ctorOrType = metadataResolver.typeFactory ? metadataResolver.typeFactory(undefined) : GraphQLString
    const resolverObjectType = isOutputType(ctorOrType) ? ctorOrType : getObjectType(container, ctorOrType)

    for (const query of MetadataQueries.get(resolver) || []) {
      const parentObjectType = typeof query.parent === 'function' ? getObjectType(container, query.parent(undefined)) : queryObjectType
      const fields = parentObjectType.getFields()

      // TODO rootable
      const guards = parentObjectType === queryObjectType
        ? ([] as GraphQLGuard<any, any>[]).concat(rootGuards, queryGuards, metadataResolver.guards, query.guards)
        : ([] as GraphQLGuard<any, any>[]).concat(metadataResolver.guards, query.guards)

      fields[query.name] = {
        name: query.name,
        type: query.returns ? query.returns(resolverObjectType) : resolverObjectType,
        args: query.input && Object.entries(query.input).map(([name, arg]) => {
          return {
            name,
            type: arg.type,
            defaultValue: arg.defaultValue,
            description: arg.description,
          }
        }) || [],
        description: query.description,
        resolve: createResolver(guards, create(metadataResolver.target, query.target)),
        isDeprecated: typeof query.deprecated === 'string',
        deprecationReason: typeof query.deprecated === 'string' ? query.deprecated : undefined,
      }
    }
  }
  return queryObjectType
}
