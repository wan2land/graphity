import { Name } from '../interfaces/common'
import { MetadataStorable } from '../interfaces/metadata'
import { MetadataStorage } from '../metadata/MetadataStorage'

export interface InjectParams<T> {
  storage?: MetadataStorable
  resolver?: (instance: T) => any
}

export function Inject<T>(name: Name<T>): (target: any, property: string | symbol, parameterIndex?: number) => void
export function Inject<T>(name: Name<T>, immediatelyResolver: (instance: T) => any): (target: any, property: string | symbol, parameterIndex?: number) => void
export function Inject<T>(name: Name<T>, params: InjectParams<T>): (target: any, property: string | symbol, parameterIndex?: number) => void
export function Inject<T>(name: Name<T>, resolverOrParams?: ((instance: T) => any) | InjectParams<T>) {
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
  const metaInejctParams = storage.injectParams
  const metaInejctProps = storage.injectProps

  return (target: any, property: string | symbol, index?: number) => {
    target = (property ? target.constructor : target)
    if (typeof index === 'number') {
      let injectParams = metaInejctParams.get(target as Function)
      if (!injectParams) {
        injectParams = []
        metaInejctParams.set(target as Function, injectParams)
      }

      injectParams.push({
        target: target as Function,
        property,
        index,
        name,
        resolver,
      })
    } else {
      let injectProps = metaInejctProps.get(target as Function)
      if (!injectProps) {
        injectProps = []
        metaInejctProps.set(target as Function, injectProps)
      }

      injectProps.push({
        target: target as Function,
        property,
        name,
        resolver,
      })
    }
  }
}
