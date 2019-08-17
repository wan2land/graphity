import { Descriptor } from './descriptor'
import { ConstructType, Name } from './interfaces/common'
import { Containable, ContainerFluent, Provider } from './interfaces/container'
import { MetadataInject } from './metadata'

export class Container implements Containable {

  public static instance = new Container()

  public stack: any[]
  public descriptors: Map<any, Descriptor<any>>
  public instances: Map<any, any>
  public factories: Map<any, () => any>
  public binds: Map<any, ConstructType<any>>
  public aliases: Map<any, string>
  public providers: Provider[]
  public isBooted = false

  public constructor() {
    this.stack = []
    this.instances = new Map<any, any>()
    this.descriptors = new Map<any, Descriptor<any>>()
    this.factories = new Map<any, () => any>()
    this.binds = new Map<any, ConstructType<any>>()
    this.aliases = new Map<any, string>()
    this.providers = []
  }

  public setToGlobal() {
    return (Container.instance = this)
  }

  public instance<T>(name: Name<T>, value: T | Promise<T>): void {
    this.instances.set(name, value)
  }

  public factory<T>(name: Name<T>, factory: () => T | Promise<T>): ContainerFluent<T> {
    this.delete(name)
    this.factories.set(name, factory)
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
    if (this.descriptors.has(name)) {
      (this.descriptors.get(name) as Descriptor<T>).freeze()
    }
    while (this.aliases.has(name)) {
      name = this.aliases.get(name) as string
    }
    if (this.instances.has(name)) {
      return this.instances.get(name) as T
    }

    if (!this.descriptors.has(name)) {
      throw new Error(`"${typeof name === 'symbol' ? name.toString() : name}" is not defined!`)
    }

    if (this.stack.includes(name)) {
      const stack = [...this.stack]
      this.stack = [] // clear stack
      throw Object.assign(new Error('circular reference found!'), {
        code: 'CIRCULAR_REFERENCE',
        stack,
      })
    }
    this.stack.push(name)

    const descriptor = this.descriptors.get(name)!
    let instance: T

    if (this.factories.has(name)) {
      const factory = this.factories.get(name)!
      instance = await factory()
    } else if (this.binds.has(name)) {
      instance = await this.create(this.binds.get(name)!)
    } else {
      this.stack.pop()
      throw new Error(`"${typeof name === 'symbol' ? name.toString() : name}" is not defined!`)
    }

    for (const afterHandler of descriptor.afterHandlers) {
      instance = await afterHandler(instance)
    }
    if (descriptor.isSingleton) {
      this.instances.set(name, instance) // caching
    }
    this.stack.pop()
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
      this.factories.delete(name)
      this.aliases.delete(name)
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
