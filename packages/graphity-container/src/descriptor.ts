import { MaybePromise } from './interfaces/common'
import { ContainerFluent } from './interfaces/container'

export class Descriptor<TVal> implements ContainerFluent<TVal> {

  public isFrozen = false

  public isSingleton = false

  public afterHandlers: ((context: TVal) => MaybePromise<TVal>)[] = []

  public freeze() {
    this.isFrozen = true
    return this
  }

  public singleton() {
    this.isSingleton = true
    return this
  }

  public after(handler: (context: TVal) => MaybePromise<TVal>) {
    this.afterHandlers.push(handler)
    return this
  }
}
