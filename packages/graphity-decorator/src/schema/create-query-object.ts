import { GraphQLArgument, GraphQLObjectType, isObjectType } from 'graphql'

import { MetadataStorage } from '../metadata/storage'
import { resolveEntityFactory, resolveReturnEntityFactory } from './resolve-entity-factory'


export function createQueryObject(name: string, resolvers: Function[], metadataStorage: MetadataStorage): GraphQLObjectType {

  const queryObjectType = new GraphQLObjectType({
    name,
    fields: {},
  })

  for (const resolver of resolvers) {
    const metadataResolver = metadataStorage.resolvers.get(resolver)
    if (!metadataResolver) {
      continue
    }

    const resolverObjectType = resolveEntityFactory(metadataResolver.typeFactory, { metadataStorage })

    for (const query of metadataStorage.resolverQueries.get(resolver) ?? []) {
      const parentObjectType = typeof query.parent === 'function'
        ? resolveEntityFactory(query.parent, { metadataStorage })
        : queryObjectType

      if (!isObjectType(parentObjectType)) {
        continue
      }

      const fields = parentObjectType.getFields()

      fields[query.name] = {
        name: query.name,
        type: resolveReturnEntityFactory(query.returns, resolverObjectType, { metadataStorage }),
        args: query.input
          ? Object.entries(query.input).map<GraphQLArgument>(([name, arg]) => {
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
        description: query.description,
        isDeprecated: typeof query.deprecated === 'string',
        deprecationReason: typeof query.deprecated === 'string' ? query.deprecated : undefined,
        extensions: null,
        astNode: null,
      }
    }
  }
  return queryObjectType
}
