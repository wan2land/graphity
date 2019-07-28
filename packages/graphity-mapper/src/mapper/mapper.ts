import { RelaterOptions, ValueTransformer } from '../interfaces/relater'
import { MaybeArray } from '../interfaces/utils'

function applyTransformTo(value: any, transformers: ValueTransformer<any>[]) {
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

function applyTransformFrom(value: any, transformers: ValueTransformer<any>[]) {
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

export class Mapper<TEntity, TSource = any> {

  public constructor(public readonly options: RelaterOptions<TEntity>) {
  }

  public toEntity(rows: TSource[]): TEntity[]
  public toEntity(rows: TSource): TEntity
  public toEntity(rows: MaybeArray<TSource>): MaybeArray<TEntity> {
    if (!Array.isArray(rows)) {
      return this.toEntity([rows])[0]
    }
    return rows.map((row: any) => {
      const entity: Partial<TEntity> = {}
      for (const column of this.options.columns) {
        const defaultValue = typeof column.default === 'function' ? column.default() : column.default
        const value = typeof row[column.sourceKey] !== 'undefined'
          ? applyTransformTo(row[column.sourceKey], column.transformers)
          : defaultValue
        const isNull = value === null || typeof value === 'undefined'
        if (!column.nullable && isNull) {
          throw new Error(`column(${column.property}) is not nullable.`)
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

  public assign(entity: Partial<TEntity>[]): TEntity[]
  public assign(entity: Partial<TEntity>): TEntity
  public assign(entity: MaybeArray<Partial<TEntity>>): MaybeArray<TEntity> {
    if (!Array.isArray(entity)) {
      return Object.setPrototypeOf(entity, this.options.ctor.prototype)
    }
    return entity.map((row) => this.assign(row))
  }

  public toPlain(entities: TEntity[]): TSource[]
  public toPlain(entities: TEntity): TSource
  public toPlain(entities: Partial<TEntity>[]): TSource[]
  public toPlain(entities: Partial<TEntity>): TSource
  public toPlain(entities: any): MaybeArray<TSource> {
    if (!Array.isArray(entities)) {
      return this.toPlain([entities] as TEntity[])[0]
    }
    return entities.map((entity) => {
      const row: any = {}
      for (const column of this.options.columns) {
        if (typeof entity[column.property] !== 'undefined') {
          row[column.sourceKey] = applyTransformFrom(entity[column.property], column.transformers)
        }
      }
      return row
    })
  }
}
