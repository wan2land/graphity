import { InjectDecoratorFactory } from '../interfaces/decorator'
import { MetadataInject } from '../metadata'

export const Inject: InjectDecoratorFactory = (name, resolver) => (target, propertyKey, index) => {
  target = propertyKey ? target.constructor : target
  let params = MetadataInject.get(target)
  if (!params) {
    params = []
    MetadataInject.set(target, params)
  }
  params.push({
    propertyKey,
    index,
    name,
    resolver,
  })
}
