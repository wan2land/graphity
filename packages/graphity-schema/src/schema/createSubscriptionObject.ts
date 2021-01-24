import { GraphQLArgument, GraphQLObjectType, isObjectType } from 'graphql'

import { MetadataStorable } from '../interfaces/metadata'
import { resolveEntityFactory } from './resolveEntityFactory'
import { resolveReturnEntityFactory } from './resolveReturnEntityFactory'


export interface CreateSubscriptionObjectParams {
  storage: MetadataStorable
  name: string
  resolvers: Function[]
}

export function createSubscriptionObject({
  storage,
  name,
  resolvers,
}: CreateSubscriptionObjectParams): GraphQLObjectType {

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

    for (const metaSubscription of storage.subscriptions.get(resolver) ?? []) {
      const parentObjectType = typeof metaSubscription.parent === 'function'
        ? resolveEntityFactory(metaSubscription.parent, { storage })
        : queryObjectType

      if (!isObjectType(parentObjectType)) {
        continue
      }

      const fields = parentObjectType.getFields()

      fields[metaSubscription.name] = {
        name: metaSubscription.name,
        type: resolveReturnEntityFactory(metaSubscription.returns, resolverObjectType, { storage }),
        args: metaSubscription.input
          ? Object.entries(metaSubscription.input).map<GraphQLArgument>(([name, arg]) => {
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
        description: metaSubscription.description,
        isDeprecated: typeof metaSubscription.deprecated === 'string',
        deprecationReason: typeof metaSubscription.deprecated === 'string' ? metaSubscription.deprecated : undefined,
        subscribe: metaSubscription.subscribe,
        extensions: null,
        astNode: null,
      }
    }
  }
  return queryObjectType
}
