import { GraphQLFieldConfigMap, GraphQLObjectType } from 'graphql'

import { ConstructType } from '../interfaces/common'
import { MetadataEntities, MetadataFields } from '../metadata'
import { createFieldResolve } from './create-field-resolve'


export function entityToGraphQLObjectType(entity: ConstructType<any>): GraphQLObjectType {
  const metadataEntity = MetadataEntities.get(entity)
  const fields = MetadataFields.get(entity) || []
  return new GraphQLObjectType({
    name: metadataEntity ? metadataEntity.name : entity.name,
    description: metadataEntity ? metadataEntity.description : undefined,
    fields: fields.reduce<GraphQLFieldConfigMap<any, any>>((carry, field) => {
      const resolve = field.guards.length > 0 ? createFieldResolve(field.name, field.guards) : undefined
      const type = field.typeFactory(undefined)
      return Object.assign<GraphQLFieldConfigMap<any, any>, GraphQLFieldConfigMap<any, any>>(carry, {
        [field.name]: {
          type,
          description: field.description,
          resolve,
        },
      })
    }, {}),
  })
}
