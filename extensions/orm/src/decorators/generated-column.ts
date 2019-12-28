import { ColumnType, GeneratedStrategy } from '../interfaces/common'
import { ColumnDecoratorOptions } from '../interfaces/decorator'
import { MetadataColumns } from '../metadata'


export function GeneratedColumn(strategy: GeneratedStrategy, options?: ColumnDecoratorOptions): PropertyDecorator
export function GeneratedColumn(options?: ColumnDecoratorOptions): PropertyDecorator
export function GeneratedColumn(optionsOrStrategy?: GeneratedStrategy | ColumnDecoratorOptions, options?: ColumnDecoratorOptions): PropertyDecorator {
  return (target, property) => {
    let columns = MetadataColumns.get(target.constructor)
    if (!columns) {
      columns = []
      MetadataColumns.set(target.constructor, columns)
    }
    let strategy: GeneratedStrategy = GeneratedStrategy.Auto
    if (typeof optionsOrStrategy === 'string') {
      strategy = optionsOrStrategy
      options = {}
    } else {
      options = optionsOrStrategy || {}
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
      generated: strategy,
    })
  }
}
