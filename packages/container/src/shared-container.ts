import { ConstructType, Name } from './interfaces/common'
import { Container, Provider, ProviderDescriptor } from './interfaces/container'
import { MetadataInject } from './metadata'

type ContainerType = 'resolver' | 'bind' | 'instance' | 'promise'

export class SharedContainer implements Container, ProviderDescriptor {

  public static instance = new SharedContainer()

  public types: Map<any, ContainerType>
  public instances: Map<any, any>
  public promises: Map<any, Promise<any>>
  public resolvers: Map<any, () => any>
  public binds: Map<any, ConstructType<any>>

  public locks: Map<any, Promise<any>>
  public freezes: Map<any, true>

  public providers: Provider[]

  public booted: Promise<any> | undefined

  public constructor() {
    this.types = new Map<any, ContainerType>()
    this.instances = new Map<any, any>()
    this.promises = new Map<any, Promise<any>>()
    this.resolvers = new Map<any, () => any>()
    this.binds = new Map<any, ConstructType<any>>()

    this.locks = new Map<any, Promise<any>>()
    this.freezes = new Map<any, true>()

    this.providers = []
  }

  public setToGlobal() {
    return (SharedContainer.instance = this)
  }

  public instance<T>(name: Name<T>, value: T | Promise<T>): void {
    this.delete(name)
    if (value instanceof Promise) {
      this.types.set(name, 'promise')
      this.promises.set(name, value)
    } else {
      this.types.set(name, 'instance')
      this.instances.set(name, value)
    }
  }

  public resolver<T>(name: Name<T>, resolver: () => T | Promise<T>): void {
    this.delete(name)
    this.types.set(name, 'resolver')
    this.resolvers.set(name, resolver)
  }

  public bind<T>(name: Name<T>, constructor: ConstructType<T>): void {
    this.delete(name)
    this.types.set(name, 'bind')
    this.binds.set(name, constructor)
  }

  public async create<T>(ctor: ConstructType<T>): Promise<T> {
    const params = []
    const options = (MetadataInject.get(ctor) || []).filter(({ propertyKey }) => !propertyKey)
    for (const { index, name, resolver } of options) {
      const instance = await this.resolve(name)
      params[index] = resolver ? await resolver(instance) : instance
    }
    return new (ctor as any)(...params)
  }

  public async invoke<TIns, TRet = any>(instance: TIns, method: keyof TIns): Promise<TRet> {
    const params = []
    const options = (MetadataInject.get((instance as any).constructor) || []).filter(({ propertyKey }) => propertyKey === method)
    for (const { index, name, resolver } of options) {
      const instance = await this.resolve(name)
      params[index] = resolver ? await resolver(instance) : instance
    }
    return (instance as any)[method](...params)
  }

  public get<T>(name: Name<T>): T {
    if (this.instances.has(name)) {
      return this.instances.get(name) as T
    }

    const descriptor = this.types.get(name)
    if (!descriptor) {
      throw new Error(`"${typeof name === 'symbol' ? name.toString() : name}" is not defined!`)
    }
    throw new Error(`"${typeof name === 'symbol' ? name.toString() : name}" is not resolved.`)
  }

  public has<T>(name: Name<T>): boolean {
    return this.instances.has(name)
  }

  public resolve<T>(name: Name<T>): Promise<T> {
    if (this.instances.has(name)) {
      return Promise.resolve(this.instances.get(name) as T)
    }
    if (this.promises.has(name)) {
      return this.promises.get(name)!.then(instance => (this.instances.set(name, instance), instance))
    }

    const descriptor = this.types.get(name)
    if (!descriptor) {
      throw new Error(`"${typeof name === 'symbol' ? name.toString() : name}" is not defined!`)
    }
    this.freezes.set(name, true)

    const lock = this.locks.get(name)
    if (lock) {
      return lock.then((instance) => {
        this.locks.delete(name)
        return Promise.resolve(instance)
      })
    }

    const promise = new Promise<T>((resolve, reject) => {
      const resolver = this.resolvers.get(name)
      if (resolver) {
        return resolve(resolver())
      }
      const bind = this.binds.get(name)
      if (bind) {
        return resolve(this.create(bind))
      }
      reject(new Error(`"${typeof name === 'symbol' ? name.toString() : name}" is not defined!`))
    }).then((instance) => {
      this.instances.set(name, instance) // caching
      return Promise.resolve(instance)
    })

    this.locks.set(name, promise)

    return promise
  }

  public delete(...names: Name<any>[]): void {
    for (const name of names) {
      if (this.types.has(name)) {
        if (this.freezes.get(name)) {
          throw new Error(`cannot change ${typeof name === 'symbol' ? name.toString() : name}`)
        }
        this.types.delete(name)
      }
      this.instances.delete(name)
      this.promises.delete(name)
      this.resolvers.delete(name)
      this.binds.delete(name)
    }
  }

  public register(provider: Provider): void {
    if (this.booted) {
      throw new Error('cannot register a provider with a container that is already booted.')
    }
    this.providers.push(provider)
  }

  public boot(forced = false): Promise<void> {
    if (this.booted && !forced) {
      return this.booted
    }
    this.booted = Promise.all(this.providers.map(p => p.register(this)))
      .then(() => Promise.all(this.providers.filter(p => p.boot).map(p => p.boot!(this))))
      .then(() => Promise.all([...this.types.keys()].map((name) => this.resolve(name))))
      .then(() => Promise.resolve())

    return this.booted
  }

  public close(): Promise<void> {
    if (this.booted) {
      return this.booted
        .then(() => Promise.all(this.providers.filter(p => p.close).map(p => p.close!(this))))
        .then(() => Promise.resolve())
    }
    return Promise.resolve()
  }
}
