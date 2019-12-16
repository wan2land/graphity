import { ConstructType, MaybePromise, Name } from './common'

export interface Container {
  create<T>(ctor: ConstructType<T>): Promise<T>
  invoke<TIns, TRet = any>(instance: TIns, method: keyof TIns): Promise<TRet>
  get<T>(name: Name<T>): Promise<T>
}

export interface ProviderDescriptor {
  instance<T>(name: Name<T>, instance: MaybePromise<T>): void
  resolver<T>(name: Name<T>, resolver: () => MaybePromise<T>): ContainerFluent<T>
  bind<T>(name: Name<T>, constructor: ConstructType<T>): ContainerFluent<T>
  get<T>(name: Name<T>): Promise<T>
}

export interface ContainerFluent<T> {
  freeze(): ContainerFluent<T>
  factory(): ContainerFluent<T>
}

export interface Provider {
  register(app: ProviderDescriptor): any
  boot?(app: ProviderDescriptor): any
  close?(app: ProviderDescriptor): any
}
