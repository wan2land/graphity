import { GraphQLSchema } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { MiddlewareClass } from '../interfaces/middleware'
import { createMutationObject } from './create-mutation-object'
import { createQueryObject } from './create-query-object'


export interface CreateGraphQLSchemaParams {
  resolvers: Function[]
  container?: GraphQLContainer
  globalMiddlewares?: MiddlewareClass[]
  queryMiddlewares?: MiddlewareClass[]
  mutationMiddlewares?: MiddlewareClass[]
}

export function createGraphQLSchema(params: CreateGraphQLSchemaParams): GraphQLSchema {
  const container = params.container ?? GraphQLContainer.getGlobalContainer()
  const globalMiddlewares = (params.globalMiddlewares ?? []).map(middleware => container.get(middleware))
  const queryMiddlewares = (params.queryMiddlewares ?? []).map(middleware => container.get(middleware))
  const mutationMiddlewares = (params.mutationMiddlewares ?? []).map(middleware => container.get(middleware))

  const query = createQueryObject({
    container,
    name: 'Query',
    middlewares: globalMiddlewares.concat(queryMiddlewares),
    resolvers: params.resolvers,
  })
  const mutation = createMutationObject({
    container,
    name: 'Mutation',
    middlewares: globalMiddlewares.concat(mutationMiddlewares),
    resolvers: params.resolvers,
  })

  return new GraphQLSchema({
    ...Object.keys(query.getFields()).length > 0 ? { query } : {},
    ...Object.keys(mutation.getFields()).length > 0 ? { mutation } : {},
  })
}
