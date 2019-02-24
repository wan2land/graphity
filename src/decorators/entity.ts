import { EntityDecoratorFactory } from "../interfaces/decorator"
import { metadataEntitiesMap } from "../metadata"


export const GraphQLEntity: EntityDecoratorFactory = (options) => (target) => {
  metadataEntitiesMap.set(target, {
    target,
    name: (options && options.name) || target.name,
  })
}
