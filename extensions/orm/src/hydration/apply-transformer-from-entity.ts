import { ValueTransformer } from '../interfaces/common'

export function applyTransformFromEntity(value: any, transformers: ValueTransformer<any>[]) {
  transformers = transformers.slice().reverse()
  let result = value
  while (transformers.length) {
    const transformer = transformers.shift()
    if (transformer?.from) {
      result = transformer.from(result)
    }
  }
  return result
}
