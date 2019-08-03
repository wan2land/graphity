import { arrayTransformer } from './transformers/array-transformer'
import { booleanTransformer } from './transformers/boolean-transformer'
import { floatTransformer } from './transformers/float-transformer'
import { intTransformer } from './transformers/int-transformer'
import { stringTransformer } from './transformers/string-transformer'

export * from './interfaces/mapper'
export * from './interfaces/utils'


export { Mapper } from './mapper/mapper'

export const Transformer = {
  ARRAY: arrayTransformer,
  BOOLEAN: booleanTransformer,
  FLOAT: floatTransformer,
  INT: intTransformer,
  STRING: stringTransformer,
}
