import { OrderByState } from '../interfaces/query-builder'

export class OrderByBuilder {
  public orderByStates?: OrderByState[]

  public orderBy(name: string) {
    this.orderByStates = this.orderByStates || []
    this.orderByStates.push({
      name,
    })
    return this
  }

  public orderByAsc(name: string) {
    this.orderByStates = this.orderByStates || []
    this.orderByStates.push({
      name,
    })
    return this
  }

  public orderByDesc(name: string) {
    this.orderByStates = this.orderByStates || []
    this.orderByStates.push({
      name,
      desc: true,
    })
    return this
  }
}
