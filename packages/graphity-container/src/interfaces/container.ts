import { ConstructType, MaybePromise, Name } from './common'

export interface Containable {
  instance<T>(name: Name<T>, instance: MaybePromise<T>): void
  resolver<T>(name: Name<T>, resolver: () => MaybePromise<T>): ContainerFluent<T>
  bind<T>(name: Name<T>, constructor: ConstructType<T>): ContainerFluent<T>
  get<T>(name: Name<T>): Promise<T>
  register(provider: Provider): void
  create<T>(ctor: ConstructType<T>): Promise<T>
  invoke<TIns, TRet = any>(instance: TIns, method: keyof TIns): Promise<TRet>
}

export interface ContainerFluent<T> {
  freeze(): ContainerFluent<T>
  factory(): ContainerFluent<T>
}

export interface Provider {
  register(app: Containable): any
  boot?(app: Containable): any
  close?(app: Containable): any
}
