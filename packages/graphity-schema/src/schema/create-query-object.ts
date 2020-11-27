import { GraphQLArgument, GraphQLObjectType, isObjectType } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { Middleware } from '../interfaces/middleware'
import { applyMiddlewares } from '../resolver/apply-middlewares'
import { resolveEntityFactory, resolveReturnEntityFactory } from './resolve-entity-factory'


export interface CreateQueryObjectParams {
  container: GraphQLContainer
  name: string
  middlewares: Middleware[]
  resolvers: Function[]
}

export function createQueryObject({
  container,
  name,
  middlewares,
  resolvers,
}: CreateQueryObjectParams): GraphQLObjectType {

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

    for (const metaQuery of container.metaQueries.get(resolver) ?? []) {
      const parentObjectType = typeof metaQuery.parent === 'function'
        ? resolveEntityFactory(metaQuery.parent, { container })
        : queryObjectType

      if (!isObjectType(parentObjectType)) {
        continue
      }

      const fields = parentObjectType.getFields()

      const resolveTarget = container.get<any>(metaQuery.target as any)
      fields[metaQuery.name] = {
        name: metaQuery.name,
        type: resolveReturnEntityFactory(metaQuery.returns, resolverObjectType, { container }),
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
        resolve: applyMiddlewares(
          middlewares.concat(metaResolver.middlewares.concat(metaQuery.middlewares).map(middleware => container.get(middleware))),
          resolveTarget[metaQuery.property].bind(resolveTarget),
        ),
        extensions: null,
        astNode: null,
      }
    }
  }
  return queryObjectType
}
