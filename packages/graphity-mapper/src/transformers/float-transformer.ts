import { ValueTransformer } from '../interfaces/relater'

export const floatTransformer: ValueTransformer<any, number> = {
  to(source: any): number {
    if (source === null || typeof source === 'undefined') {
      return source
    }
    return +source
  },
}
