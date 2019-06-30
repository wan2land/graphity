import { FieldDecoratorFactory } from "../interfaces/decorator"
import { MetadataFieldsMap } from "../metadata"


export const Field: FieldDecoratorFactory = (typeFactory, options = {}) => (target, property) => {
  let fields = MetadataFieldsMap.get(target.constructor)
  if (!fields) {
    fields = []
    MetadataFieldsMap.set(target.constructor, fields)
  }
  const guard = options.guards || []
  fields.push({
    target,
    property,
    typeFactory,
    guards: Array.isArray(guard) ? guard : [guard],
    name: options.name || ((typeof property === "string") ? property : property.toString()),
    description: options.description,
  })
}
