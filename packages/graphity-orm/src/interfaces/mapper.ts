import { ConstructType, MaybeFactory } from './utils'


export type ColumnType = 'any'
| 'array'
| 'string'
| 'int'
| 'float'
| 'boolean'
| 'object'

export interface MapperOptions<T> {
  ctor: ConstructType<T>
  columns: {
    type: ColumnType
    property: keyof T
    sourceKey: string
    nullable?: boolean
    default?: MaybeFactory<any>
    transformers: ValueTransformer[]
  }[]
}

export interface ValueTransformer<TSource = any, TEntity = {}> {
  to?(source: TSource | null | undefined): TEntity | null | undefined
  from?(dest: TEntity | null | undefined): TSource | null | undefined
}
