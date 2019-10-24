import { Container } from '@graphity/container'
import { GraphQLObjectType, GraphQLString, isOutputType } from 'graphql'

import { ConstructType } from '../interfaces/common'
import { Middleware } from '../interfaces/graphity'
import { MetadataQueries, MetadataResolvers } from '../metadata'
import { createResolver } from './create-resolver'
import { entityToGraphQLObjectType } from './entity-to-graphql-object-type'

function getObjectType(container: Container, types: Map<ConstructType<any>, GraphQLObjectType>, entity: ConstructType<any>): GraphQLObjectType {
  let type = types.get(entity)
  if (!type) {
    type = entityToGraphQLObjectType(container, entity)
    types.set(entity, type)
  }
  return type
}

export interface CreateQueryObjectOptions {
  name?: string
  types?: Map<ConstructType<any>, GraphQLObjectType>
  resolvers?: ConstructType<any>[]
  rootMiddlewares?: ConstructType<Middleware>[]
  rootQueryMiddlewares?: ConstructType<Middleware>[]
}

export function createQueryObject(container: Container, {
  name = 'Query',
  types = new Map(),
  resolvers = [],
  rootMiddlewares = [],
  rootQueryMiddlewares = [],
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
    const resolverObjectType = isOutputType(ctorOrType) ? ctorOrType : getObjectType(container, types, ctorOrType)

    for (const query of MetadataQueries.get(resolver) || []) {
      const parentObjectType = typeof query.parent === 'function' ? getObjectType(container, types, query.parent(undefined)) : queryObjectType
      const fields = parentObjectType.getFields()

      const middlewares = parentObjectType === queryObjectType
        ? ([] as ConstructType<Middleware>[]).concat(rootMiddlewares, rootQueryMiddlewares, metadataResolver.middlewares, query.middlewares)
        : ([] as ConstructType<Middleware>[]).concat(metadataResolver.middlewares, query.middlewares)

      fields[query.name] = {
        name: query.name,
        type: query.returns ? query.returns(resolverObjectType) : resolverObjectType,
        args: query.input && Object.entries(query.input).map(([name, arg]) => {
          return {
            name,
            type: arg.type,
            defaultValue: arg.defaultValue,
            description: arg.description,
            extensions: null,
            astNode: null,
          }
        }) || [],
        description: query.description,
        resolve: createResolver(container, middlewares, metadataResolver.target, query.target),
        isDeprecated: typeof query.deprecated === 'string',
        deprecationReason: typeof query.deprecated === 'string' ? query.deprecated : undefined,
        extensions: null,
        astNode: null,
      }
    }
  }
  return queryObjectType
}
