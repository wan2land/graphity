import { ResolverDecoratorFactory } from "../interfaces/decorator"
import { MetadataResolvers } from "../metadata"


export const GraphQLResolver: ResolverDecoratorFactory = (typeFactory, options = {}) => (target) => {
  const guard = options.guards || []
  MetadataResolvers.set(target, {
    target,
    typeFactory: typeFactory || undefined,
    guards: Array.isArray(guard) ? guard : [guard],
  })
}
