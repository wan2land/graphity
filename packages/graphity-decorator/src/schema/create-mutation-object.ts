import { GraphQLArgument, GraphQLObjectType, isObjectType } from 'graphql'

import { MetadataStorage } from '../metadata/storage'
import { resolveEntityFactory, resolveReturnEntityFactory } from './resolve-entity-factory'


export function createMutationObject(name: string, resolvers: Function[], metadataStorage: MetadataStorage): GraphQLObjectType {

  const mutationObjectType = new GraphQLObjectType({
    name,
    fields: {},
  })

  for (const resolver of resolvers) {
    const metadataResolver = metadataStorage.resolvers.get(resolver)
    if (!metadataResolver) {
      continue
    }

    const resolverObjectType = resolveEntityFactory(metadataResolver.typeFactory, { metadataStorage })

    for (const mutation of metadataStorage.resolverMutations.get(resolver) ?? []) {
      const parentObjectType = typeof mutation.parent === 'function'
        ? resolveEntityFactory(mutation.parent, { metadataStorage })
        : mutationObjectType

      if (!isObjectType(parentObjectType)) {
        continue
      }

      const fields = parentObjectType.getFields()

      fields[mutation.name] = {
        name: mutation.name,
        type: resolveReturnEntityFactory(mutation.returns, resolverObjectType, { metadataStorage }),
        args: mutation.input
          ? Object.entries(mutation.input).map<GraphQLArgument>(([name, arg]) => {
            return {
              name,
              type: arg.type,
              defaultValue: arg.defaultValue,
              description: arg.description,
              deprecationReason: arg.deprecationReason,
              extensions: null,
              astNode: null,
            }
          })
          : [],
        description: mutation.description,
        isDeprecated: typeof mutation.deprecated === 'string',
        deprecationReason: typeof mutation.deprecated === 'string' ? mutation.deprecated : undefined,
        extensions: null,
        astNode: null,
      }
    }
  }
  return mutationObjectType
}
