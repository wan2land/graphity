import { ContainerFluent } from './interfaces/container'

export class Descriptor<T> implements ContainerFluent<T> {

  public isFrozen = false

  public isSingleton = false

  public freeze() {
    this.isFrozen = true
    return this
  }

  public singleton() {
    this.isSingleton = true
    return this
  }
}
