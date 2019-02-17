import {
  GraphQLFieldConfigMap,
  GraphQLObjectType
  } from "graphql"
import { ConstructType } from "../interfaces/common"
import { metadataEntities, metadataFieldsMap } from "../metadata"

export function createGraphQLTypeFromEntity(entity: ConstructType<any>): GraphQLObjectType {
  const metadataEntity = metadataEntities.get(entity)
  const metadataFields = metadataFieldsMap.get(entity) || []

  return new GraphQLObjectType({
    name: metadataEntity ? metadataEntity.name : entity.name,
    fields: metadataFields.reduce((carry, field) => {
      return Object.assign<GraphQLFieldConfigMap<any, any>, GraphQLFieldConfigMap<any, any>>(carry, {
        [field.name]: {
          type: field.typeFactory(undefined),
        },
      })
    }, {}),
  })
}
