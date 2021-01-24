import { GraphQLArgument, GraphQLObjectType, isObjectType } from 'graphql'

import { MetadataStorable } from '../interfaces/metadata'
import { resolveEntityFactory } from './resolveEntityFactory'
import { resolveReturnEntityFactory } from './resolveReturnEntityFactory'


export interface CreateQueryObjectParams {
  storage: MetadataStorable
  name: string
  resolvers: Function[]
}

export function createQueryObject({
  storage,
  name,
  resolvers,
}: CreateQueryObjectParams): GraphQLObjectType {

  const queryObjectType = new GraphQLObjectType({
    name,
    fields: {},
  })

  for (const resolver of resolvers) {
    const metaResolver = storage.resolvers.get(resolver)
    if (!metaResolver) {
      continue
    }

    const resolverObjectType = resolveEntityFactory(metaResolver.typeFactory, { storage })

    for (const metaQuery of storage.queries.get(resolver) ?? []) {
      const parentObjectType = typeof metaQuery.parent === 'function'
        ? resolveEntityFactory(metaQuery.parent, { storage })
        : queryObjectType

      if (!isObjectType(parentObjectType)) {
        continue
      }

      const fields = parentObjectType.getFields()

      fields[metaQuery.name] = {
        name: metaQuery.name,
        type: resolveReturnEntityFactory(metaQuery.returns, resolverObjectType, { storage }),
        args: metaQuery.input
          ? Object.entries(metaQuery.input).map<GraphQLArgument>(([name, arg]) => {
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
        description: metaQuery.description,
        isDeprecated: typeof metaQuery.deprecated === 'string',
        deprecationReason: typeof metaQuery.deprecated === 'string' ? metaQuery.deprecated : undefined,
        extensions: null,
        astNode: null,
      }
    }
  }
  return queryObjectType
}
