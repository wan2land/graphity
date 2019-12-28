import { MetadataIds } from '../metadata'


export function Id(): PropertyDecorator {
  return (target, property) => {
    const id = MetadataIds.get(target.constructor)
    if (id && id.property !== property) {
      throw new Error('An entity can have only one ID.')
    }
    MetadataIds.set(target.constructor, {
      property,
    })
  }
}
