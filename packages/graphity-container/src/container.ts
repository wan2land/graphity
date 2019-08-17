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
  public providers: Provider[]
  public isBooted = false

  public constructor() {
    this.instances = new Map<any, any>()
    this.descriptors = new Map<any, Descriptor<any>>()
    this.resolvers = new Map<any, () => any>()
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

  public async get<T>(name: Name<T>): Promise<T> {
    if (this.instances.has(name)) {
      return this.instances.get(name) as T
    }

    const descriptor = this.descriptors.get(name)
    if (!descriptor) {
      throw new Error(`"${typeof name === 'symbol' ? name.toString() : name}" is not defined!`)
    }
    descriptor.freeze()


    let instance: T
    if (this.resolvers.has(name)) {
      const factory = this.resolvers.get(name)!
      instance = await factory()
    } else if (this.binds.has(name)) {
      instance = await this.create(this.binds.get(name)!)
    } else {
      throw new Error(`"${typeof name === 'symbol' ? name.toString() : name}" is not defined!`)
    }

    if (!descriptor.isFactory) {
      this.instances.set(name, instance) // caching
    }

    return instance
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
    this.providers.push(provider)
  }

  public async boot(forced = false): Promise<void> {
    if (!this.isBooted || forced) {
      await Promise.all(this.providers.map(p => p.register(this)))
      await Promise.all(this.providers.filter(p => p.boot).map(p => p.boot!(this)))
      this.isBooted = true
    }
  }

  public async close(): Promise<void> {
    if (this.isBooted) {
      for (const provider of this.providers) {
        if (!provider.close) {
          continue
        }
        await provider.close(this)
      }
      this.isBooted = false
    }
  }
}
