import { ColumnDecoratorFactory, ColumnType } from '../interfaces/decorator'
import { MetadataColumns } from '../metadata'


export const Column: ColumnDecoratorFactory = (options = {}) => (target, property) => {
  let columns = MetadataColumns.get(target.constructor)
  if (!columns) {
    columns = []
    MetadataColumns.set(target.constructor, columns)
  }
  const transformers = Array.isArray(options.transformer)
    ? options.transformer
    : options.transformer
      ? [options.transformer]
      : []

  columns.push({
    property,
    name: options.name || (typeof property === 'string' ? property : property.toString()),
    type: options.type || ColumnType.String,
    nullable: options.nullable || false,
    default: options.default,
    transformers,
  })
}
