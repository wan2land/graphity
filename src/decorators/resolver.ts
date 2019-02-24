import { ResolverDecoratorFactory } from "../interfaces/decorator"
import { metadataResolversMap } from "../metadata"


export const GraphQLResolver: ResolverDecoratorFactory = (typeFactory, options) => (target) => {
  const guard = (options && options.guards || [])
  metadataResolversMap.set(target, {
    target,
    typeFactory,
    guards: Array.isArray(guard) ? guard : [guard],
  })
}
