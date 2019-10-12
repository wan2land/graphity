import { Descriptor } from './descriptor'
import { ConstructType, Name } from './interfaces/common'
import { Containable, ContainerFluent, Provider } from './interfaces/container'
import { MetadataInject } from './metadata'

export class Container implements Containable {

  public static instance = new Container()

  public descriptors: Map<any, Descriptor<any>>
  public instances: Map<any, any>
  public resolvers: Map<any, () => any>
  public binds: Map<any, ConstructType<any>>
  public locks: Map<any, Promise<any>>
  public providers: Provider[]

  public booted: Promise<any> | undefined

  public constructor() {
    this.instances = new Map<any, any>()
    this.descriptors = new Map<any, Descriptor<any>>()
    this.resolvers = new Map<any, () => any>()
    this.locks = new Map<any, Promise<any>>()
    this.binds = new Map<any, ConstructType<any>>()
    this.providers = []
  }

  public setToGlobal() {
    return (Container.instance = this)
  }

  public instance<T>(name: Name<T>, value: T | Promise<T>): void {
    this.instances.set(name, value)
  }

  public resolver<T>(name: Name<T>, resolver: () => T | Promise<T>): ContainerFluent<T> {
    this.delete(name)
    this.resolvers.set(name, resolver)
    const descriptor = new Descriptor<T>()
    this.descriptors.set(name, descriptor)
    return descriptor
  }

  public bind<T>(name: Name<T>, constructor: ConstructType<T>): ContainerFluent<T> {
    this.delete(name)
    this.binds.set(name, constructor)
    const descriptor = new Descriptor<T>()
    this.descriptors.set(name, descriptor)
    return descriptor
  }

  public async create<T>(ctor: ConstructType<T>): Promise<T> {
    const params = []
    const options = (MetadataInject.get(ctor) || []).filter(({ propertyKey }) => !propertyKey)
    for (const { index, name } of options) {
      params[index] = await this.get(name)
    }
    return new (ctor as any)(...params)
  }

  public async invoke<TIns, TRet = any>(instance: TIns, method: keyof TIns): Promise<TRet> {
    const params = []
    const options = (MetadataInject.get((instance as any).constructor) || []).filter(({ propertyKey }) => propertyKey === method)
    for (const { index, name } of options) {
      params[index] = await this.get(name)
    }
    return (instance as any)[method](...params)
  }

  public get<T>(name: Name<T>): Promise<T> {
    if (this.instances.has(name)) {
      return Promise.resolve(this.instances.get(name) as T)
    }

    const descriptor = this.descriptors.get(name)
    if (!descriptor) {
      throw new Error(`"${typeof name === 'symbol' ? name.toString() : name}" is not defined!`)
    }
    descriptor.freeze()

    if (!descriptor.isFactory) {
      const lock = this.locks.get(name)
      if (lock) {
        return lock.then((instance) => {
          this.locks.delete(name)
          return Promise.resolve(instance)
        })
      }
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
      if (!descriptor.isFactory) {
        this.instances.set(name, instance) // caching
      }
      return Promise.resolve(instance)
    })

    if (!descriptor.isFactory) {
      this.locks.set(name, promise)
    }

    return promise
  }

  public delete(...names: Name<any>[]): void {
    for (const name of names) {
      if (this.descriptors.has(name)) {
        const descriptor = this.descriptors.get(name) as Descriptor<any>
        if (descriptor.isFrozen) {
          throw new Error(`cannot change ${typeof name === 'symbol' ? name.toString() : name}`)
        }
        this.descriptors.delete(name)
      }
      this.instances.delete(name)
      this.resolvers.delete(name)
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
