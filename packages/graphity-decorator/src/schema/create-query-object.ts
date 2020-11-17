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
    const metadataResolver = container.metaResolvers.get(resolver)
    if (!metadataResolver) {
      continue
    }

    const resolverObjectType = resolveEntityFactory(metadataResolver.typeFactory, { container })

    for (const query of container.metaQueries.get(resolver) ?? []) {
      const parentObjectType = typeof query.parent === 'function'
        ? resolveEntityFactory(query.parent, { container })
        : queryObjectType

      if (!isObjectType(parentObjectType)) {
        continue
      }

      const fields = parentObjectType.getFields()

      fields[query.name] = {
        name: query.name,
        type: resolveReturnEntityFactory(query.returns, resolverObjectType, { container }),
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
        resolve: applyMiddlewares(
          middlewares.concat(query.middlewares.map(middleware => container.get(middleware))),
          container.get<any>(query.target as any)[query.property],
        ),
        extensions: null,
        astNode: null,
      }
    }
  }
  return queryObjectType
}
