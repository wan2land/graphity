import { GraphQLArgument, GraphQLObjectType, isObjectType } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { Middleware } from '../interfaces/middleware'
import { applyMiddlewares } from '../resolver/apply-middlewares'
import { resolveEntityFactory, resolveReturnEntityFactory } from './resolve-entity-factory'


export interface CreateSubscriptionObjectParams {
  container: GraphQLContainer
  name: string
  middlewares: Middleware[]
  resolvers: Function[]
}

export function createSubscriptionObject({
  container,
  name,
  middlewares,
  resolvers,
}: CreateSubscriptionObjectParams): GraphQLObjectType {

  const queryObjectType = new GraphQLObjectType({
    name,
    fields: {},
  })

  for (const resolver of resolvers) {
    const metaResolver = container.metaResolvers.get(resolver)
    if (!metaResolver) {
      continue
    }

    const resolverObjectType = resolveEntityFactory(metaResolver.typeFactory, { container })

    for (const metaSubscription of container.metaSubscriptions.get(resolver) ?? []) {
      const parentObjectType = typeof metaSubscription.parent === 'function'
        ? resolveEntityFactory(metaSubscription.parent, { container })
        : queryObjectType

      if (!isObjectType(parentObjectType)) {
        continue
      }

      const fields = parentObjectType.getFields()

      const resolveTarget = container.get<any>(metaSubscription.target as any)
      fields[metaSubscription.name] = {
        name: metaSubscription.name,
        type: resolveReturnEntityFactory(metaSubscription.returns, resolverObjectType, { container }),
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
        resolve: applyMiddlewares(
          middlewares.concat(metaResolver.middlewares.concat(metaSubscription.middlewares).map(middleware => container.get(middleware))),
          resolveTarget[metaSubscription.property].bind(resolveTarget),
        ),
        extensions: null,
        astNode: null,
      }
    }
  }
  return queryObjectType
}
