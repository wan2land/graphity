import { EntityDecoratorFactory } from '../interfaces/decorator'
import { MetadataEntities } from '../metadata'


export const Entity: EntityDecoratorFactory = (options = {}) => (target) => {
  MetadataEntities.set(target, {
    name: options.name || target.name.toLowerCase(),
  })
}
