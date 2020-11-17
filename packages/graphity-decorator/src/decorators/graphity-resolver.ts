import { GraphQLContainer } from '../container/graphql-container'
import { EntityFactory } from '../interfaces/metadata'
import { MiddlewareClass } from '../interfaces/middleware'


export interface GraphityResolverParams {
  middlewares?: MiddlewareClass | MiddlewareClass[]
  container?: GraphQLContainer
}

export function GraphityResolver(typeFactory: EntityFactory, params: GraphityResolverParams = {}): ClassDecorator {
  const container = params.container ?? GraphQLContainer.getGlobalContainer()
  const metaResolvers = container.metaResolvers

  return (target) => {
    const middleware = params.middlewares ?? []
    const middlewares = Array.isArray(middleware) ? middleware : [middleware]

    container.bind(target as any)
    middlewares.forEach(middleware => container.bind(middleware))

    metaResolvers.set(target, {
      target,
      typeFactory,
      middlewares,
    })
  }
}
