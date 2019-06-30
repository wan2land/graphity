import { ConstructType } from "../interfaces/common"
import { GraphQLFieldConfigFactoryMap } from "../interfaces/graphql"
import { MetadataEntitiesMap, MetadataFieldsMap } from "../metadata"
import { ObjectTypeFactory } from "./object-type-factory"


export function createObjectTypeFactory(entity: ConstructType<any>): ObjectTypeFactory {
  const metadataEntity = MetadataEntitiesMap.get(entity)
  const metadataFields = MetadataFieldsMap.get(entity) || []

  return new ObjectTypeFactory(
    metadataEntity ? metadataEntity.name : entity.name,
    metadataEntity ? metadataEntity.description : undefined,
    metadataFields.reduce((carry, field) => {
      const type = field.typeFactory(undefined)
      return Object.assign<GraphQLFieldConfigFactoryMap, GraphQLFieldConfigFactoryMap>(carry, {
        [field.name]: () => ({
          type,
          description: field.description,
        }),
      })
    }, {})
  )
}
