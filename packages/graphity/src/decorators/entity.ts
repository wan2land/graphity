import { EntityDecoratorFactory } from '../interfaces/decorator'
import { MetadataEntities } from '../metadata'


export const GraphQLEntity: EntityDecoratorFactory = (options = {}) => (target) => {
  MetadataEntities.set(target, {
    target,
    name: options.name || target.name,
    description: options.description || undefined,
  })
}
