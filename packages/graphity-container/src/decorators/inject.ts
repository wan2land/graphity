import { Name } from '../interfaces/common'
import { MetadataStorable } from '../interfaces/metadata'
import { MetadataStorage } from '../metadata/MetadataStorage'

export interface InjectParams<T> {
  storage?: MetadataStorable
  resolver?: (instance: T) => any
}

export function Inject<T>(name: Name<T>): ParameterDecorator
export function Inject<T>(name: Name<T>, immediatelyResolver: (instance: T) => any): ParameterDecorator
export function Inject<T>(name: Name<T>, params: InjectParams<T>): ParameterDecorator
export function Inject<T>(name: Name<T>, resolverOrParams?: ((instance: T) => any) | InjectParams<T>): ParameterDecorator {
  let storage = MetadataStorage.getGlobalStorage()
  let resolver: ((instance: T) => any) | null = null
  if (typeof resolverOrParams === 'function') {
    resolver = resolverOrParams
  } else if (typeof resolverOrParams === 'object') {
    resolver = resolverOrParams.resolver ?? null
    if (resolverOrParams.storage) {
      storage = resolverOrParams.storage
    }
  }
  const metaInejcts = storage.injects

  return (target, property, index) => {
    target = (property ? target.constructor : target)
    let injects = metaInejcts.get(target as Function)
    if (!injects) {
      injects = []
      metaInejcts.set(target as Function, injects)
    }

    injects.push({
      target: target as Function,
      property,
      index,
      name,
      resolver,
    })
  }
}
