import { ValueTransformer } from '../interfaces/common'

export function applyTransformerToEntity(value: any, transformers: ValueTransformer<any>[]) {
  transformers = transformers.slice()
  let result = value
  while (transformers.length) {
    const transformer = transformers.shift()
    if (transformer?.to) {
      result = transformer.to(result)
    }
  }
  return result
}
