import { GraphQLArgument, GraphQLObjectType, isObjectType } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { Middleware } from '../interfaces/middleware'
import { applyMiddlewares } from '../resolver/apply-middlewares'
import { resolveEntityFactory, resolveReturnEntityFactory } from './resolve-entity-factory'


export interface CreatMutationObjectParams {
  container: GraphQLContainer
  name: string
  middlewares: Middleware[]
  resolvers: Function[]
}

export function createMutationObject({
  container,
  name,
  middlewares,
  resolvers,
}: CreatMutationObjectParams): GraphQLObjectType {

  const mutationObjectType = new GraphQLObjectType({
    name,
    fields: {},
  })

  for (const resolver of resolvers) {
    const metaResolver = container.metaResolvers.get(resolver)
    if (!metaResolver) {
      continue
    }

    const resolverObjectType = resolveEntityFactory(metaResolver.typeFactory, { container })

    for (const metaMutation of container.metaMutations.get(resolver) ?? []) {
      const parentObjectType = typeof metaMutation.parent === 'function'
        ? resolveEntityFactory(metaMutation.parent, { container })
        : mutationObjectType

      if (!isObjectType(parentObjectType)) {
        continue
      }

      const fields = parentObjectType.getFields()

      const resolveTarget = container.get<any>(metaMutation.target as any)
      fields[metaMutation.name] = {
        name: metaMutation.name,
        type: resolveReturnEntityFactory(metaMutation.returns, resolverObjectType, { container }),
        args: metaMutation.input
          ? Object.entries(metaMutation.input).map<GraphQLArgument>(([name, arg]) => {
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
        description: metaMutation.description,
        isDeprecated: typeof metaMutation.deprecated === 'string',
        deprecationReason: typeof metaMutation.deprecated === 'string' ? metaMutation.deprecated : undefined,
        resolve: applyMiddlewares(
          middlewares.concat(metaResolver.middlewares.concat(metaMutation.middlewares).map(middleware => container.get(middleware))),
          resolveTarget[metaMutation.property].bind(resolveTarget),
        ),
        extensions: null,
        astNode: null,
      }
    }
  }
  return mutationObjectType
}
