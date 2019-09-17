import { GraphQLObjectType, GraphQLString, isOutputType } from 'graphql'

import { ConstructType, CreateResolveHandler, GraphQLGuard } from '../interfaces/common'
import { MetadataMutations, MetadataResolvers } from '../metadata'
import { entityToGraphQLObjectType } from './entity-to-graphql-object-type'

function getObjectType(container: Map<ConstructType<any>, GraphQLObjectType>, entity: ConstructType<any>): GraphQLObjectType {
  let type = container.get(entity)
  if (!type) {
    type = entityToGraphQLObjectType(entity)
    container.set(entity, type)
  }
  return type
}

export interface CreateMutationObjectOptions {
  name: string
  container: Map<ConstructType<any>, GraphQLObjectType>
  resolvers: ConstructType<any>[]
  rootGuards: GraphQLGuard<any, any>[]
  mutationGuards: GraphQLGuard<any, any>[]
  create: CreateResolveHandler
}

export function createMutationObject({
  name = 'Mutation',
  container = new Map(),
  resolvers = [],
  rootGuards = [],
  mutationGuards = [],
  create,
}: Partial<CreateMutationObjectOptions>): GraphQLObjectType {

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
    const resolverObjectType = isOutputType(ctorOrType) ? ctorOrType : getObjectType(container, ctorOrType)

    for (const mutation of MetadataMutations.get(resolver) || []) {
      const parentObjectType = typeof mutation.parent === 'function' ? getObjectType(container, mutation.parent(undefined)) : mutationObjectType
      const fields = parentObjectType.getFields()

      // TODO rootable
      const guards = parentObjectType === mutationObjectType
        ? ([] as GraphQLGuard<any, any>[]).concat(rootGuards, mutationGuards, metadataResolver.guards, mutation.guards)
        : ([] as GraphQLGuard<any, any>[]).concat(metadataResolver.guards, mutation.guards)
      fields[mutation.name] = {
        name: mutation.name,
        type: mutation.returns ? mutation.returns(resolverObjectType) : resolverObjectType,
        args: mutation.input && Object.entries(mutation.input).map(([name, arg]) => {
          return {
            name,
            type: arg.type,
            defaultValue: arg.defaultValue,
            description: arg.description,
          }
        }) || [],
        description: mutation.description,
        resolve: create && create(metadataResolver.target, mutation.target, guards) || undefined,
      }
    }
  }
  return mutationObjectType
}
