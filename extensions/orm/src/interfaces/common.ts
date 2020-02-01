
export type Factory<T> = (type: any) => T

export type ConstructType<T> = new (...args: any[]) => T

export type MaybeArray<T> = T | T[]

export type MaybeFactory<T> = T | Factory<T>

export enum ColumnType {
  Int = 'int',
  BigInt = 'bigint',
  Float = 'float',
  String = 'string',
  Boolean = 'boolean',
  Array = 'array',
  Object = 'object',
}

export enum GeneratedStrategy {
  Auto = 'auto'
}

export interface ValueTransformer<TSource = any, TEntity = {}> {
  to?(source: TSource | null | undefined): TEntity | null | undefined
  from?(dest: TEntity | null | undefined): TSource | null | undefined
}
