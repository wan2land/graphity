import { ValueTransformer } from '../../interfaces/mapper'

export const booleanTransformer: ValueTransformer<any, boolean> = {
  to(source: any): boolean {
    if (source === null || typeof source === 'undefined') {
      return source
    }
    if (typeof source === 'boolean') {
      return source
    }
    return !!source
  },
}
