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
    const metadataResolver = container.metaResolvers.get(resolver)
    if (!metadataResolver) {
      continue
    }

    const resolverObjectType = resolveEntityFactory(metadataResolver.typeFactory, { container })

    for (const mutation of container.metaMutations.get(resolver) ?? []) {
      const parentObjectType = typeof mutation.parent === 'function'
        ? resolveEntityFactory(mutation.parent, { container })
        : mutationObjectType

      if (!isObjectType(parentObjectType)) {
        continue
      }

      const fields = parentObjectType.getFields()

      fields[mutation.name] = {
        name: mutation.name,
        type: resolveReturnEntityFactory(mutation.returns, resolverObjectType, { container }),
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
        resolve: applyMiddlewares(
          middlewares.concat(mutation.middlewares.map(middleware => container.get(middleware))),
          container.get<any>(mutation.target as any)[mutation.property],
        ),
        extensions: null,
        astNode: null,
      }
    }
  }
  return mutationObjectType
}
