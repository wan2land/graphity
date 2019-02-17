import { EntityDecoratorFactory } from "../interfaces/decorator"
import { metadataEntities } from "../metadata"


export const GraphQLEntity: EntityDecoratorFactory = (options) => (target) => {
  metadataEntities.set(target, {
    target,
    name: (options && options.name) || target.name,
  })
}
