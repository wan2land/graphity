import { ConstructType } from "../interfaces/common"
import { GraphQLFieldConfigFactoryMap } from "../interfaces/graphql"
import { MetadataEntities, MetadataFields } from "../metadata"
import { createFieldResolve } from "./create-field-resolve"
import { ObjectTypeFactory } from "./object-type-factory"


export function createObjectTypeFactory(entity: ConstructType<any>): ObjectTypeFactory {
  const metadataEntity = MetadataEntities.get(entity)
  const fields = MetadataFields.get(entity) || []

  return new ObjectTypeFactory(
    metadataEntity ? metadataEntity.name : entity.name,
    metadataEntity ? metadataEntity.description : undefined,
    fields.reduce((carry, field) => {
      const resolve = field.guards.length ? createFieldResolve(field.name, field.guards) : undefined
      const type = field.typeFactory(undefined)
      return Object.assign<GraphQLFieldConfigFactoryMap, GraphQLFieldConfigFactoryMap>(carry, {
        [field.name]: () => ({
          type,
          description: field.description,
          resolve,
        }),
      })
    }, {})
  )
}
