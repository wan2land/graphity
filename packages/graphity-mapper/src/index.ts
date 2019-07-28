import { arrayTransformer } from './transformers/array-transformer'
import { booleanTransformer } from './transformers/boolean-transformer'
import { floatTransformer } from './transformers/float-transformer'
import { intTransformer } from './transformers/int-transformer'
import { stringTransformer } from './transformers/string-transformer'

export * from './interfaces/decorator'
export * from './interfaces/metadata'
export * from './interfaces/relater'
export * from './interfaces/utils'

export { Column } from './decorators/column'

export { Mapper } from './mapper/mapper'
export { createOptions } from './mapper/create-options'

export { MetadataColumns } from './metadata'

export const Transformer = {
  ARRAY: arrayTransformer,
  BOOLEAN: booleanTransformer,
  FLOAT: floatTransformer,
  INT: intTransformer,
  STRING: stringTransformer,
}
