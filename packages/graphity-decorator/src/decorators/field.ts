import { GraphQLFieldResolver, GraphQLOutputType } from 'graphql'

import { MiddlewareConstructor } from '../interfaces/middleware'
import { MetadataStorage } from '../metadata/storage'

export interface FieldParams {
  name?: string
  resolve?: GraphQLFieldResolver<any, any>
  middlewares?: MiddlewareConstructor | MiddlewareConstructor[]
  description?: string
  deprecated?: string
  metadataStorage?: MetadataStorage
}

export function Field(typeFactory: () => GraphQLOutputType, params: FieldParams = {}): PropertyDecorator {
  const metadataFields = (params.metadataStorage ?? MetadataStorage.getGlobalStorage()).entityFields

  return (target, property) => {
    let fields = metadataFields.get(target.constructor)
    if (!fields) {
      fields = []
      metadataFields.set(target.constructor, fields)
    }
    const middleware = params.middlewares ?? []
    fields.push({
      target: target.constructor,
      property,
      typeFactory,
      resolve: params.resolve ?? null,
      middlewares: Array.isArray(middleware) ? middleware : [middleware],
      name: params.name ?? (typeof property === 'string' ? property : property.toString()),
      description: params.description ?? null,
      deprecated: params.deprecated ?? null,
    })
  }
}
