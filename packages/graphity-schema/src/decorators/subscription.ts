import { isInputObjectType, GraphQLFieldConfigArgumentMap, GraphQLOutputType, GraphQLFieldResolver } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { EntityFactory } from '../interfaces/metadata'
import { MiddlewareClass } from '../interfaces/middleware'


const DEFAULT_RETURNS = (node: GraphQLOutputType) => node

export interface SubscriptionParams {
  name?: string
  parent?: EntityFactory
  input?: GraphQLFieldConfigArgumentMap
  middlewares?: MiddlewareClass | MiddlewareClass[]
  returns?: (type: GraphQLOutputType) => GraphQLOutputType | Function
  description?: string
  deprecated?: string
  subscribe: GraphQLFieldResolver<any, any>
  container?: GraphQLContainer
}

export function Subscription(params: SubscriptionParams): MethodDecorator {
  const container = params.container ?? GraphQLContainer.getGlobalContainer()
  const metaSubscriptions = container.metaSubscriptions
  return (target, property) => {
    let resolves = metaSubscriptions.get(target.constructor)
    if (!resolves) {
      resolves = []
      metaSubscriptions.set(target.constructor, resolves)
    }

    const middleware = params.middlewares ?? []
    const middlewares = Array.isArray(middleware) ? middleware : [middleware]
    middlewares.forEach(middleware => container.bind(middleware))

    const input = params.input
    resolves.push({
      target: target.constructor,
      property,
      parent: params.parent ?? null,
      name: params.name ?? (typeof property === 'string' ? property : property.toString()),
      input: (isInputObjectType(input) ? input.getFields() : input) ?? null,
      middlewares: Array.isArray(middleware) ? middleware : [middleware],
      returns: params.returns ?? DEFAULT_RETURNS,
      description: params.description ?? null,
      deprecated: params.deprecated ?? null,
      subscribe: params.subscribe,
    })
  }
}
