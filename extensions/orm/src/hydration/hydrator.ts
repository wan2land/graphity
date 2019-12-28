import { ConstructType, ColumnType } from '../interfaces/common'
import { MetadataColumn } from '../interfaces/metadata'
import { applyTransformerToEntity } from './apply-transformer-to-entity'

function applyType(value: any, type: ColumnType) {
  if (value === null || typeof value === 'undefined') {
    return value
  }
  switch (type) {
    case ColumnType.Int:
      return parseInt(+value as any)
    case ColumnType.Float:
      return +value
    case ColumnType.String:
      return `${value}`
    case ColumnType.Boolean: {
      const valueString = `${value}`.toLocaleLowerCase()
      if (valueString === 'true') {
        return true
      }
      if (valueString === 'false' || valueString === '0') {
        return false
      }
      return !!value
    }
    case ColumnType.Array:
      return Array.isArray(value) ? value : [value]
  }
  return value
}

export interface HydratorOptions<T> {
  ctor: ConstructType<T>
  columns: MetadataColumn<T>[]
}

export class Hydrator<TEntity, TSource = any> {

  public constructor(public readonly options: HydratorOptions<TEntity>) {
  }

  public hydrate(rows: TSource[]): TEntity[]
  public hydrate(rows: TSource): TEntity
  public hydrate(rows: TSource | TSource[]): TEntity | TEntity[] {
    if (!Array.isArray(rows)) {
      return this.hydrate([rows])[0]
    }
    return rows.map((row: any) => {
      const entity: Partial<TEntity> = {}
      for (const column of this.options.columns) {
        const value = applyTransformerToEntity(applyType(row[column.name], column.type), column.transformers)
          ?? (typeof column.default === 'function' ? column.default() : column.default)

        const isNull = value === null || typeof value === 'undefined'
        if (!column.nullable && isNull) {
          throw new Error(`column(${column.property as string}) is not nullable.`)
        }
        if (column.nullable) {
          entity[column.property] = !isNull ? value : null
        } else {
          entity[column.property] = value
        }
      }

      Object.setPrototypeOf(entity, this.options.ctor.prototype)
      return entity as TEntity
    })
  }
}
