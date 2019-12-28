import { ColumnType, MaybeFactory, ValueTransformer } from './common'


export interface EntityDecoratorOptions {
  name?: string
}

export interface ColumnDecoratorOptions {
  name?: string
  type?: ColumnType
  nullable?: boolean
  default?: MaybeFactory<any>
  transformer?: ValueTransformer | ValueTransformer[]
}
