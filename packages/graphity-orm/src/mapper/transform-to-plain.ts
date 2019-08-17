import { ColumnType, ValueTransformer } from '../interfaces/mapper'

export function transformToPlain(value: any, type: ColumnType, transformers: ValueTransformer<any>[]) {
  const dupTransformers = transformers.slice().reverse()
  let result = value
  while (dupTransformers.length) {
    const transformer = dupTransformers.shift()
    if (transformer && transformer.from) {
      result = transformer.from(result)
    }
  }
  return result
}
