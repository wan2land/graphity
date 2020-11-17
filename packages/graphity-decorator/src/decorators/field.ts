import { GraphQLFieldResolver, GraphQLOutputType, isOutputType } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { EntityFactory } from '../interfaces/metadata'
import { MiddlewareClass } from '../interfaces/middleware'


export interface FieldParams {
  name?: string
  resolve?: GraphQLFieldResolver<any, any>
  middlewares?: MiddlewareClass | MiddlewareClass[]
  description?: string
  deprecated?: string
  container?: GraphQLContainer
}

export function Field(type: EntityFactory | GraphQLOutputType, params: FieldParams = {}): PropertyDecorator {
  const container = params.container ?? GraphQLContainer.getGlobalContainer()
  const metaFields = container.metaFields

  return (target, property) => {
    let fields = metaFields.get(target.constructor)
    if (!fields) {
      fields = []
      metaFields.set(target.constructor, fields)
    }

    const middleware = params.middlewares ?? []
    const middlewares = Array.isArray(middleware) ? middleware : [middleware]
    middlewares.forEach(middleware => container.bind(middleware))

    fields.push({
      target: target.constructor,
      property,
      typeFactory: isOutputType(type) ? () => type : type,
      resolve: params.resolve ?? null,
      middlewares,
      name: params.name ?? (typeof property === 'string' ? property : property.toString()),
      description: params.description ?? null,
      deprecated: params.deprecated ?? null,
    })
  }
}
