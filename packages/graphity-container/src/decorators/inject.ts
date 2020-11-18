import { Name } from '../interfaces/common'
import { MetadataInject } from '../metadata'

export function Inject<T>(name: Name<T>, immediatelyResolver?: (instance: T) => any): ParameterDecorator {
  return (target, propertyKey, index) => {
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
      resolver: immediatelyResolver,
    })
  }
}
