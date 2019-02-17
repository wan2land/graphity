import { ResolverDecoratorFactory } from "../interfaces/decorator"
import { metadataResolvers } from "../metadata"


export const GraphQLResolver: ResolverDecoratorFactory = (typeFactory, options) => (target) => {
  const guard = (options && options.guards || [])
  metadataResolvers.set(target, {
    target,
    typeFactory,
    guards: Array.isArray(guard) ? guard : [guard],
  })
}
