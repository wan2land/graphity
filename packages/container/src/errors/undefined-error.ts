import { Name } from '../interfaces/common'
import { normalizeName } from '../utils'

export class UndefinedError extends Error {
  public constructor(
    public target: Name<any>,
    public resolveStack: Name<any>[] = [],
  ) {
    super(`${normalizeName(target)} is not defined!
resolve stack: ${resolveStack.map(target => normalizeName(target)).join(' -> ')}`)
    this.name = 'UndefinedError'
  }
}
