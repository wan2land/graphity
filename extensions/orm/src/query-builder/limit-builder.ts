import { LimitState } from '../interfaces/query-builder'

export class LimitBuilder {
  public limitState?: LimitState = {}

  public limit(take: number): this
  public limit(offset: number, take: number): this
  public limit(offsetOrTake: number, take?: number) {
    this.limitState = this.limitState || {}
    if (take === null || typeof take === 'undefined') {
      this.limitState.take = offsetOrTake
    } else {
      this.limitState.offset = offsetOrTake
      this.limitState.take = take
    }
    return this
  }

  public take(take: number) {
    this.limitState = this.limitState || {}
    this.limitState.take = take
    return this
  }

  public offset(offset: number) {
    this.limitState = this.limitState || {}
    this.limitState.offset = offset
    return this
  }
}
