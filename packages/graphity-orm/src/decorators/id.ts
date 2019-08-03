import { IdDecoratorFactory } from '../interfaces/decorator'
import { MetadataIds } from '../metadata'


export const Id: IdDecoratorFactory = () => (target, property) => {
  const id = MetadataIds.get(target.constructor)
  if (id && id.property !== property) {
    throw new Error('An entity can have only one ID.')
  }
  MetadataIds.set(target.constructor, {
    property,
  })
}
