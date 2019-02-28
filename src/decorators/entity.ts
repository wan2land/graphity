import { EntityDecoratorFactory } from "../interfaces/decorator"
import { metadataEntitiesMap } from "../metadata"


export const GraphQLEntity: EntityDecoratorFactory = (options = {}) => (target) => {
  metadataEntitiesMap.set(target, {
    target,
    name: options.name || target.name,
    description: options.description,
  })
}
