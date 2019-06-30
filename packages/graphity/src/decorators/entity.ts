import { EntityDecoratorFactory } from "../interfaces/decorator"
import { MetadataEntitiesMap } from "../metadata"


export const GraphQLEntity: EntityDecoratorFactory = (options = {}) => (target) => {
  MetadataEntitiesMap.set(target, {
    target,
    name: options.name || target.name,
    description: options.description,
  })
}
