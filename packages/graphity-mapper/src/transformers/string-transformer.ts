import { ValueTransformer } from '../interfaces/mapper'

export const stringTransformer: ValueTransformer<any, string> = {
  to(source: any): string {
    if (source === null || typeof source === 'undefined') {
      return source
    }
    switch (typeof source) {
      case 'string':
        return source
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'function':
        return `${source}`
      case 'symbol':
        return source.toString()
    }
    return JSON.stringify(source)
  },
}
