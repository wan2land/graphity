import { GraphQLFieldConfigMap, GraphQLObjectType, isOutputType } from 'graphql'

import { MetadataStorage } from '../metadata/storage'

export interface ToGraphQLObjectParams {
  metadataStorage?: MetadataStorage
}

export function toGraphQLObject(entity: Function, params: ToGraphQLObjectParams = {}): GraphQLObjectType {
  const storage = params.metadataStorage ?? MetadataStorage.getGlobalStorage()
  const metadataEntity = storage.entities.get(entity)

  return new GraphQLObjectType({
    name: metadataEntity?.name ?? entity.name,
    description: metadataEntity?.description,
    fields: () => {
      const metadataFields = storage.entityFields.get(entity) ?? []
      return metadataFields.reduce<GraphQLFieldConfigMap<any, any>>((carry, field) => {
        const type = field.typeFactory(null)
        return Object.assign<GraphQLFieldConfigMap<any, any>, GraphQLFieldConfigMap<any, any>>(carry, {
          [field.name]: {
            type: isOutputType(type) ? type : toGraphQLObject(type, params),
            description: field.description ?? null,
            deprecationReason: field.deprecated ?? null,
          },
        })
      }, {})
    },
  })
}
