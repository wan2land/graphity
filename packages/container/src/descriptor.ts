import { ContainerFluent } from './interfaces/container'

export class Descriptor<T> implements ContainerFluent<T> {

  public isFrozen = false

  public isFactory = false

  public freeze() {
    this.isFrozen = true
    return this
  }

  public factory() {
    this.isFactory = true
    return this
  }
}
