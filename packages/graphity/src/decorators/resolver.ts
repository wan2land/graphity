import { ConstructType } from '../interfaces/common'
import { ResolverDecoratorFactory } from '../interfaces/decorator'
import { MetadataResolvers } from '../metadata'


export const GraphQLResolver: ResolverDecoratorFactory = (typeFactory, options = {}) => (target) => {
  const middleware = options.middlewares || []
  MetadataResolvers.set(target as any as ConstructType<any>, {
    target,
    typeFactory: typeFactory || undefined,
    middlewares: Array.isArray(middleware) ? middleware : [middleware],
  })
}
