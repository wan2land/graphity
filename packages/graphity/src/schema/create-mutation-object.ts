import { Container } from '@graphity/container'
import { GraphQLObjectType, GraphQLString, isOutputType } from 'graphql'

import { ConstructType } from '../interfaces/common'
import { Middleware } from '../interfaces/graphity'
import { MetadataMutations, MetadataResolvers } from '../metadata'
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

export interface CreateMutationObjectOptions {
  name?: string
  types?: Map<ConstructType<any>, GraphQLObjectType>
  resolvers?: ConstructType<any>[]
  rootMiddlewares?: ConstructType<Middleware<any, any>>[]
  rootMutationMiddlewares?: ConstructType<Middleware<any, any>>[]
}

export function createMutationObject(container: Container, {
  name = 'Mutation',
  types = new Map(),
  resolvers = [],
  rootMiddlewares = [],
  rootMutationMiddlewares = [],
}: CreateMutationObjectOptions): GraphQLObjectType {

  const mutationObjectType = new GraphQLObjectType({
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

    for (const mutation of MetadataMutations.get(resolver) || []) {
      const parentObjectType = typeof mutation.parent === 'function' ? getObjectType(container, types, mutation.parent(undefined)) : mutationObjectType
      const fields = parentObjectType.getFields()

      const middlewares = parentObjectType === mutationObjectType
        ? ([] as ConstructType<Middleware<any, any>>[]).concat(rootMiddlewares, rootMutationMiddlewares, metadataResolver.middlewares, mutation.middlewares)
        : ([] as ConstructType<Middleware<any, any>>[]).concat(metadataResolver.middlewares, mutation.middlewares)

      fields[mutation.name] = {
        name: mutation.name,
        type: mutation.returns ? mutation.returns(resolverObjectType) : resolverObjectType,
        args: mutation.input && Object.entries(mutation.input).map(([name, arg]) => {
          return {
            name,
            type: arg.type,
            defaultValue: arg.defaultValue,
            description: arg.description,
            extensions: null,
            astNode: null,
          }
        }) || [],
        description: mutation.description,
        resolve: createResolver(container, middlewares, metadataResolver.target, mutation.target),
        isDeprecated: typeof mutation.deprecated === 'string',
        deprecationReason: typeof mutation.deprecated === 'string' ? mutation.deprecated : undefined,
        extensions: null,
        astNode: null,
      }
    }
  }
  return mutationObjectType
}
