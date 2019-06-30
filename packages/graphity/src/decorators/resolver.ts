import { ResolverDecoratorFactory } from "../interfaces/decorator"
import { MetadataResolversMap } from "../metadata"


export const GraphQLResolver: ResolverDecoratorFactory = (typeFactory, options = {}) => (target) => {
  const guard = options.guards || []
  MetadataResolversMap.set(target, {
    target,
    typeFactory: typeFactory || undefined,
    guards: Array.isArray(guard) ? guard : [guard],
  })
}
