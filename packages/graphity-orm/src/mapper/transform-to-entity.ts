import { ColumnType, ValueTransformer } from '../interfaces/mapper'

export function transformToEntity(value: any, type: ColumnType, transformers: ValueTransformer<any>[]) {
  const dupTransformers = transformers.slice()
  let result = value
  while (dupTransformers.length) {
    const transformer = dupTransformers.shift()
    if (transformer && transformer.to) {
      result = transformer.to(result)
    }
  }
  return result
}
