import { EntityDecoratorOptions } from '../interfaces/decorator'
import { MetadataEntities } from '../metadata'


export function Entity(options: EntityDecoratorOptions = {}): ClassDecorator {
  return (target) => {
    MetadataEntities.set(target, {
      name: options.name || target.name.toLowerCase(),
    })
  }
}
