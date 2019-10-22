import { ConstructType } from '../interfaces/common'
import { FieldDecoratorFactory } from '../interfaces/decorator'
import { MetadataFields } from '../metadata'


export const Field: FieldDecoratorFactory = (typeFactory, options = {}) => (target, property) => {
  let fields = MetadataFields.get(target.constructor as any as ConstructType<any>)
  if (!fields) {
    fields = []
    MetadataFields.set(target.constructor as any as ConstructType<any>, fields)
  }
  const middleware = options.middlewares || []
  fields.push({
    target,
    property,
    typeFactory,
    resolve: options.resolve || undefined,
    middlewares: Array.isArray(middleware) ? middleware : [middleware],
    name: options.name || (typeof property === 'string' ? property : property.toString()),
    description: options.description || undefined,
  })
}
