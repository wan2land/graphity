import { ConstructType } from '../interfaces/common'
import { EntityDecoratorFactory } from '../interfaces/decorator'
import { MetadataEntities } from '../metadata'


export const GraphQLEntity: EntityDecoratorFactory = (options = {}) => (target) => {
  MetadataEntities.set(target as any as ConstructType<any>, {
    target,
    name: options.name || target.name,
    description: options.description || undefined,
  })
}
