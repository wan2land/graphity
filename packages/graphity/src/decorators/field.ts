import { FieldDecoratorFactory } from '../interfaces/decorator'
import { MetadataFields } from '../metadata'


export const Field: FieldDecoratorFactory = (typeFactory, options = {}) => (target, property) => {
  let fields = MetadataFields.get(target.constructor)
  if (!fields) {
    fields = []
    MetadataFields.set(target.constructor, fields)
  }
  const guard = options.guards || []
  fields.push({
    target,
    property,
    typeFactory,
    guards: Array.isArray(guard) ? guard : [guard],
    name: options.name || (typeof property === 'string' ? property : property.toString()),
    description: options.description,
  })
}
