import { GraphQLFieldConfigMap, GraphQLObjectType } from 'graphql'

import { ConstructType } from '../interfaces/common'
import { MetadataEntities, MetadataFields } from '../metadata'

export function entityToGraphQLObject(entity: ConstructType<any>): GraphQLObjectType {
  const metadataEntity = MetadataEntities.get(entity)
  const fields = MetadataFields.get(entity) || []
  return new GraphQLObjectType({
    name: metadataEntity ? metadataEntity.name : entity.name,
    description: metadataEntity ? metadataEntity.description : undefined,
    fields: fields.reduce<GraphQLFieldConfigMap<any, any>>((carry, field) => {
      const type = field.typeFactory(undefined)
      return Object.assign<GraphQLFieldConfigMap<any, any>, GraphQLFieldConfigMap<any, any>>(carry, {
        [field.name]: {
          type,
          description: field.description,
          deprecationReason: typeof field.deprecated === 'string' ? field.deprecated : undefined,
        },
      })
    }, {}),
  })
}
