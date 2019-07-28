import { ConstructType, MaybeFactory } from './utils'

export interface RelaterOptions<T> {
  ctor: ConstructType<T>
  columns: {
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
