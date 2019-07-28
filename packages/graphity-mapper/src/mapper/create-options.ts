import { ColumnType } from '../interfaces/decorator'
import { MetadataColumn } from '../interfaces/metadata'
import { RelaterOptions, ValueTransformer } from '../interfaces/relater'
import { ConstructType } from '../interfaces/utils'
import { MetadataColumns } from '../metadata'
import { arrayTransformer } from '../transformers/array-transformer'
import { booleanTransformer } from '../transformers/boolean-transformer'
import { floatTransformer } from '../transformers/float-transformer'
import { intTransformer } from '../transformers/int-transformer'
import { stringTransformer } from '../transformers/string-transformer'

function createTypeTransformers(type: ColumnType): ValueTransformer[] {
  switch (type) {
    case ColumnType.Array:
      return [arrayTransformer]
    case ColumnType.Boolean:
      return [booleanTransformer]
    case ColumnType.Float:
      return [floatTransformer]
    case ColumnType.Int:
      return [intTransformer]
    case ColumnType.String:
      return [stringTransformer]
  }
  return []
}

export function createOptions<TEntity>(ctor: ConstructType<TEntity>): RelaterOptions<TEntity> {
  return {
    ctor,
    columns: ((MetadataColumns.get(ctor) || []) as MetadataColumn<TEntity>[]).map(({ property, type, name, nullable, default: def, transformers }) => ({
      property,
      sourceKey: name,
      nullable,
      default: def,
      transformers: createTypeTransformers(type).concat(transformers),
    })),
  }
}
